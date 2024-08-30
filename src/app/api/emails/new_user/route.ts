import { compileWelcomeTemplate, sendMail } from "@/lib/mail";
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { to, name, subject, body } = await request.json();
  
  try {
    await sendMail({
      to,
      name,
      subject,
      body: compileWelcomeTemplate(name, body),
    });
    return NextResponse.json({ succes: 'Email is sended' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to Email' });
  }
}
