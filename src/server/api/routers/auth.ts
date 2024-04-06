import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
import { db } from "~/server/db";
import { createToken } from "~/server/lib/auth";
import cookie from "cookie";
export const authRouter = createTRPCRouter({
  signin: publicProcedure
    .input(
      z.object({
        username: z.string().min(4),
        password: z.string().min(8),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { username, password } = input;
      const userdata = await db.user.findFirst({
        where: {
          username: username,
        },
        select: {
          username: true,
          password: true,
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
        username: z.string().min(4),
        password: z.string().min(8),
      }),
    )
    .mutation(async ({ input }) => {
      const { username, password } = input;
      const userdata = await db.user.create({
        data: {
          username,
          password,
        },
      });
      const jwt = await createToken(userdata);
      return {
        userdata,
        token: jwt,
      };
    }),
});
