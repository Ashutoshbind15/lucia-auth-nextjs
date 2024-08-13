import { EmailTemplate } from "@/components/auth/EmailTemplate";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  const body = await req.json();

  try {
    const { data, error } = await resend.emails.send({
      from: `AuthReplier <${process.env.EMAIL_FROM}>`,
      to: body.sendto,
      subject: "Auth reply",
      react: EmailTemplate({ firstName: body.sendto }),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
