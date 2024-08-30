import { NextResponse } from 'next/server';
import { contact_us, sendMail } from "@/lib/mail";

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();
    
    try {
      await sendMail({
        to: 'artpa199@mail.ruu',
        name: name,
        subject: "Contact message",
        body: contact_us(message,name, email),
      });
    } catch (error) {
      console.log(error);
    }
    
    const response = NextResponse.json({ message:[name, email, message ] });
 

    return response;

  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json({ error: 'Internal Server Error e' }, { status: 500 });
  }
}
