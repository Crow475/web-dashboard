import { betterAuth, email } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { APIError } from "better-auth/api";
import { lastLoginMethod } from "better-auth/plugins";

import { authDB } from "@/db/drizzle";
import { user, session, account, verification } from "@/db/auth/schema";

import { sendEmail } from "@/actions/sendEmail";
import { createProfile } from "@/actions/createProfile";
import { deleteProfile } from "@/actions/deleteProfile";
import { createAuthMiddleware } from "better-auth/api";

export const auth = betterAuth({
    database: drizzleAdapter(authDB, {
        provider: "pg",
        schema: {
            user,
            session,
            account,
            verification,
        },
    }),
    emailAndPassword: {
        enabled: true,
        minPasswordLength: 8,
        requireEmailVerification: true,
        autoSignIn: true,
        revokeSessionOnPasswordReset: true,
        sendResetPassword: async ({ user, url, token }, request) => {
            void sendEmail(
                user.email,
                "Reset your password for BOARDS",
                `
                    <p>Hello ${user.name}!</p>
                    <p>You requested a password reset for Boards. Please click the link below to reset your password:</p>
                    <a href="${url}" style="display: inline-block; padding: 10px 20px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
                    <p>If you did not request a password reset, please ignore this email.</p>
                    <p>Best regards,<br/>The Boards Team</p>
                `,
            );
        },
    },
    emailVerification: {
        sendOnSignUp: true,
        sendOnSignIn: true,
        autoSignInAfterVerification: true,
        sendVerificationEmail: async ({ user, url, token }, request) => {
            void sendEmail(
                user.email,
                "Verify your email for BOARDS",
                `
                    <p>Hello ${user.name}!</p>
                    <p>Thanks for signing up for Boards! Please verify your email by clicking the link below:</p>
                    <a href="${url}" style="display: inline-block; padding: 10px 20px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a>
                    <p>If you did not sign up for this account, please ignore this email.</p>
                    <p>Best regards,<br/>The Boards Team</p>
                `,
            );
        },
        async beforeEmailVerification(user, request) {
            console.log("User verified their email:", user.email);
            await createProfile(user.id, user.name, user.image || "👤");
        },
    },
    advanced: {
        database: {
            generateId: () => crypto.randomUUID(),
        },
    },
    rateLimit: {
        enabled: true,
        customRules: {
            "/send-verification-email": {
                window: 300, // 5 minutes
                max: 3, //3 emails per window
            },
        },
    },
    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
            mapProfileToUser: (profile) => ({
                email: profile.email ?? `${profile.id}@github.placeholder.local`,
            }),
        },
        google: {
            prompt: "select_account",
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },
    hooks: {
        after: createAuthMiddleware(async (ctx) => {
            if (ctx.path === "/callback/:id" && (ctx.params?.id === "github" || ctx.params?.id === "google")) {
                const newSession = ctx.context.newSession;
                if (newSession) {
                    await createProfile(newSession.user.id, newSession.user.name, "👤");
                }
            }
        }),
    },
    user: {
        deleteUser: {
            enabled: true,
            sendDeleteAccountVerification: async ({ user, url, token }, request) => {
                void sendEmail(
                    user.email,
                    "Delete your account for BOARDS",
                    `
                        <p>Hello ${user.name}!</p>
                        <p>You requested to delete your account for Boards. Please click the link below to delete your account:</p>
                        <a href="${url}" style="display: inline-block; padding: 10px 20px; background-color: #F40119; color: white; text-decoration: none; border-radius: 5px;">Delete Account</a>
                        <p>If you did not request account deletion, please ignore this email.</p>
                        <p>Best regards,<br/>The Boards Team</p>
                    `,
                );
            },
            beforeDelete: async (user, request) => {
                const result = await deleteProfile(user.id);
                if (!result) {
                    throw new APIError("FORBIDDEN", {
                        message: "Failed to delete profile",
                    });
                }
            },
        },
    },
    trustedOrigins: ["https://boardsproject.app", "http://localhost:3000", "https://webdashboard-project.netlify.app"],
    plugins: [lastLoginMethod(), nextCookies()],
});
