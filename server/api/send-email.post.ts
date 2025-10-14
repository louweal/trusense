// server/api/send-email.post.ts
import { H3Event } from "h3";
import sgMail from "@sendgrid/mail";
import { defineEventHandler, readBody } from "h3";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

interface EmailRequestBody {
    to: string;
    subject: string;
    message: string;
}

export default defineEventHandler(async (event: H3Event) => {
    try {
        const body: EmailRequestBody = await readBody(event);

        const msg = {
            to: body.to,
            from: "trusense.alert@gmail.com", // must be verified in SendGrid
            subject: body.subject,
            text: body.message,
            html: `<p>${body.message}</p>`,
        };

        await sgMail.send(msg);

        return { success: true, message: "Email sent!" };
    } catch (error: any) {
        console.error("SendGrid error:", error);
        return { success: false, error: error.message || "Unknown error" };
    }
});
