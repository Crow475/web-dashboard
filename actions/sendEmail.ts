"use server";

import { Resend } from "resend";

export async function sendEmail(to: string, subject: string, html: string) {
    const resend = new Resend(process.env.RESEND_API_KEY!);

    resend.emails.send({
        from: "auth@boardsproject.app",
        to: to,
        subject: subject,
        html: html,
    });
}
