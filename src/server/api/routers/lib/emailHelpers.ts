import dayjs from "dayjs";
import { db } from "~/server/db";
import sgMail from '@sendgrid/mail'

export const sendEmail = async (
  email: string,
  content: string,
  subject: string,
) => {

  sgMail.setApiKey(process.env.SENDGRID_API_KEY ?? "")
  const msg = {
    to:  email, // Change to your recipient
    from: "shakirckyt@gmail.com", // Change to your verified sender
    subject:  subject,
    html: content,
  }
  const status = await sgMail.send(msg)
  
  return 
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
