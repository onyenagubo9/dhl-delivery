import { NextResponse } from "next/server";
import { transporter } from "@/lib/mail";
import { trackingEmailTemplate } from "@/lib/emailTemplates";

export async function POST(req: Request) {
  try {
    console.log("📩 Send mail API called");

    const body = await req.json();
    console.log("📦 Payload:", body);

    const { email, name, trackingCode } = body;

    if (!email || !name || !trackingCode) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    console.log("🚀 Sending email...");

    const info = await transporter.sendMail({
      from: `"DHL Delivery" <${process.env.ZOHO_EMAIL}>`,
      to: email,
      subject: "Your Delivery Tracking Code",
      html: trackingEmailTemplate(name, trackingCode),
    });

    console.log("✅ Email sent:", info.messageId);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("❌ Email error:", error);

    return NextResponse.json(
      { error: error.message || "Failed to send email" },
      { status: 500 }
    );
  }
}
