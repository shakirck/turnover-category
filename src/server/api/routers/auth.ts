import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
import { db } from "~/server/db";
import { createToken } from "~/server/lib/auth";
import cookie from "cookie";
import { sendVerificationEmail } from "./lib/emailHelpers";
import { send } from "process";
export const authRouter = createTRPCRouter({
  signin: publicProcedure
    .input(
      z.object({
        email: z.string().min(4),
        password: z.string().min(8),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { email, password } = input;
      const userdata = await db.user.findFirst({
        where: {
          email: email,
        },
        select: {
          email: true,
          password: true,
          id: true,
        },
      });
      if (!userdata) {
        throw new Error("User not found");
      }
      if (userdata.password !== password) {
        throw new Error("Invalid password");
      }
      const jwt = await createToken(userdata);

      ctx.res.setHeader(
        "Set-Cookie",
        cookie.serialize("token", String(jwt), {
          httpOnly: true,
          maxAge: 60 * 60 * 24,
          path: "/",
          sameSite: "lax",
        }),
      );
      console.log("set cookie");
      return {
        userdata,
        token: jwt,
      };
    }),
  signup: publicProcedure
    .input(
      z.object({
        email: z.string().min(4),
        password: z.string().min(8),
        name: z.string().min(4),
      }),
    )
    .mutation(async ({ input }) => {
      const { email, password, name } = input;
      const  checkUserExists = await db.user.findFirst({
        where: {
          email: email,
        },
      });
      if (checkUserExists  && checkUserExists.isVerified){
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "User already exists",
        });
      }
      if(checkUserExists && !checkUserExists.isVerified){
        sendVerificationEmail(email);
        return {
          user: checkUserExists,
        }
      }
      const userdata = await db.user.create({
        data: {
          email,
          password,
          name,
        },
      });
      // const jwt = await createToken(userdata);
      sendVerificationEmail(userdata.email);
      return {
        userdata,
      };
    }),
  verify: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        code: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const { email, code } = input;
      const user = await db.user.findFirst({
        where: {
          email: email,
        },
      });
      if (!user) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "User not found",
        });
      }
      const verification = await db.verificationOTP.findFirst({
        where: {
          email: email,
          otp: code,
        },
      });
      if (!verification) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Invalid code",
        });
      }

      const currentTime = new Date().toISOString();
      if (new Date(currentTime) > new Date(verification.expiry)) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Code expired",
        });
      }

      await db.verificationOTP.delete({
        where: {
          id: verification.id,
        },
      });

      await db.user.update({
        where: {
          id: user.id,
        },
        data: {
          isVerified: true,
        },
      });
      const jwt = await createToken(user);
      return {
        user,
        token: jwt,
      };
    }),
});
