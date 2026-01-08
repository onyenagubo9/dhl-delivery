import { NextResponse } from "next/server";
import { transporter } from "@/lib/mail";

export async function POST(req: Request) {
  const { to, subject, message } = await req.json();

  try {
    await transporter.sendMail({
      from: `"Delivery App" <${process.env.ZOHO_EMAIL}>`,
      to,
      subject,
      html: `<p>${message}</p>`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
