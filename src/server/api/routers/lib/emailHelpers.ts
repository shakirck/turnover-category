import { Resend } from "resend";
import dayjs from "dayjs";
import { db } from "~/server/db";
import { createTransport } from "nodemailer";
const transporter = createTransport({
  host: process.env.EMAIL_HOST,
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: process.env.EMAIL_AUTH_USER,
    pass: process.env.EMAIL_AUTH_PASSWORD,
  },
});
export const sendEmail = async (
  email: string,
  content: string,
  subject: string,
) => {
  const info = await transporter.sendMail({
    from: '"shakirck 👻" <shakirck333@gmail.com>', // sender address
    to: email, // list of receivers
    subject: subject, // Subject line
    html: content, // html body
  });
  console.log("Message sent: %s", info);
};
export const sendVerificationEmail = async (email: string) => {
  console.log("  sendVerificationEmail to ", email);
  const code = generateCode(8);
  const expiryTime = dayjs().add(10, "minute").toISOString();
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
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    if (i < 4) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
    } else {
      result += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
  }
  return result;
};
