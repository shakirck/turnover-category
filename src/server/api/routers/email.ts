import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
import { sendVerificationEmail } from "./lib/emailHelpers";
export const emailRouter = createTRPCRouter({
  sendVerificationEmail: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
      }),
    )
    .mutation(async ({ input }) => {
      const { email } = input;
        await sendVerificationEmail(email);
      return true;
    }),
});

//     sendVerificationEmail: async ({ctx}) => {

//         const content = `
//         <h1>Verify your email</h1>
//         <p>Click the link below to verify your email</p>
//         `
//         const subject = "Verify your email"

//         const mailStatus = await sendEmail(ctx.user.email,content ,subject)

// })

// const resend = new Resend('re_NjPcvGPh_FSZN837ggsSnaczXmYSfFEfL');

// resend.emails.send({
//   from: 'onboarding@resend.dev',
//   to: 'shakirck333@gmail.com',
//   subject: 'Hello World',
//   html: '<p>Congrats on sending your <strong>first email</strong>!</p>'
// });
