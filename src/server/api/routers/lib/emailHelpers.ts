import { Resend } from "resend";
import dayjs from "dayjs";
import { db } from "~/server/db";
export const sendEmail = (email: string, content: string, subject: string) => {
  const resend = new Resend(process.env.RESEND_EMAIL_CLIENT_API_KEY);

  resend.emails.send({
    from: "onboarding@resend.dev",
    to: "shakirckyt@gmail.com",
    subject: subject,
    html: content,
  });
  console.log("email sent");
};
export const sendVerificationEmail = async (email: string) => {
  console.log("  sendVerificationEmail to ", email);
  const code = generateCode(8);
  const expiryTime = dayjs().minute(10).toISOString();
  console.log(expiryTime);

  await db.verificationOTP.upsert({
    where: {
      email,
    },
    create: {
      email,
      otp: code,
      expiry: expiryTime,
    },
    update: {
      otp: code,
      expiry: expiryTime,
    },
  });

  const content = `
     <h1> Your verification code is ${code}</h1>
    `;
  const subject = "Verify your email";
  await sendEmail(email, content, subject);
};
export const generateCode = (length: number) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};
