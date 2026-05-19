import { betterAuth, email } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { authDB } from "@/db/drizzle";
import { user, session, account, verification } from "@/db/auth/schema";

import { sendEmail } from "@/actions/sendEmail";
import { createProfile } from "@/actions/createProfile";
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
    },
    hooks: {
        after: createAuthMiddleware(async (ctx) => {
            if (ctx.path === "/callback/:id" && ctx.params?.id === "github") {
                const newSession = ctx.context.newSession;
                if (newSession) {
                    await createProfile(newSession.user.id, newSession.user.name, "👤");
                }
            }
        }),
    },
    trustedOrigins: ["https://boardsproject.app", "http://localhost:3000", "https://webdashboard-project.netlify.app"],
    plugins: [nextCookies()],
});
