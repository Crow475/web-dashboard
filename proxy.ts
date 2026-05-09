import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

import { getSessionCookie } from "better-auth/cookies";

export async function proxy(request: NextRequest) {
    // const session = await auth.api.getSession({
    //     headers: await headers(),
    // });

    // if (!session) {
    //     return NextResponse.redirect(new URL("/sign-in", request.url));
    // }

    // console.log("Session found in proxy middleware:", {
    //     user: {
    //         email: session.user.email,
    //         name: session.user.name,
    //         id: session.user.id,
    //         emailVerified: session.user.emailVerified,
    //     },
    // });

    const sessionCookie = getSessionCookie(request);
    const { pathname } = request.nextUrl;

    if (sessionCookie && ["/sign-in", "/sign-up"].includes(pathname)) {
        return NextResponse.redirect(new URL("/app", request.url));
    }
    if (!sessionCookie && pathname.startsWith("/app")) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    // if (session.user.emailVerified === false) {
    //     return NextResponse.redirect(new URL(`/verify-email?email=${session.user.email}`, request.url));
    // }

    return NextResponse.next();
}

export const config = {
    matcher: ["/app/:path*"],
};
