import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function proxy(request: NextRequest) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    console.log("Session found in proxy middleware:", {
        user: {
            email: session.user.email,
            name: session.user.name,
            id: session.user.id,
            emailVerified: session.user.emailVerified,
        },
    });

    // if (session.user.emailVerified === false) {
    //     return NextResponse.redirect(new URL(`/verify-email?email=${session.user.email}`, request.url));
    // }

    return NextResponse.next();
}

export const config = {
    matcher: ["/app/:path*"],
};
