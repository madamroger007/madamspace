import { EmailTemplate } from "@/app/components/emailResend";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from 'resend';

export async function POST(req: NextRequest) {
  try {
    const { email, name, order_id, items, total } = await req.json();
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
      from: "MadamSpace <mamdamspaceshop@adamstd.my.id>",
      to: email,
      subject: `Order Confirmation - ${order_id}`,
      react: EmailTemplate({ items, order_id, name, total }),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    console.log(error)
    return Response.json({ error }, { status: 500 });
  }
}
