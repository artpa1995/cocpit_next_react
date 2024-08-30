import nodemailer from "nodemailer";
import * as handlebars from "handlebars";
import { registr } from "./templates/registr";
import { contact } from "./templates/contact";

export async function sendMail({
  to,
  name,
  subject,
  body,
}: {
  to: string;
  name: string;
  subject: string;
  body: string;
}) {
  const { SMTP_EMAIL, SMTP_PASSWORD } = process.env; 

  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: SMTP_EMAIL,
      pass: SMTP_PASSWORD,
    },
  });
  try {
    const testResult = await transport.verify();
  } catch (error) {
    console.error({ error });
    return;
  }

  try {
    const sendResult = await transport.sendMail({
      from: SMTP_EMAIL,
      to,
      subject,
      html: body,
    });
  } catch (error) {
    console.log(error);
  }
}

export function compileWelcomeTemplate(name: string, url: string) {
  const template = handlebars.compile(registr);
  const htmlBody = template({
    name: name,
    url: url,
  });
  return htmlBody;
}

export function contact_us(message: string, name: string, email :string) {
  const template = handlebars.compile(contact);
  const htmlBody = template({
    message: message,
    name: name,
    email: email

  });
  return htmlBody;
}