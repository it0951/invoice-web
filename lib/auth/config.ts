import "server-only";

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { authConfig } from "./auth.config";
import { verifyPassword } from "./verify";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "이메일", type: "email" },
        password: { label: "비밀번호", type: "password" },
      },
      async authorize(
        credentials,
      ): Promise<{ id: string; email: string } | null> {
        const email = credentials?.email;
        const password = credentials?.password;

        if (typeof email !== "string" || typeof password !== "string")
          return null;

        const adminEmail = process.env.ADMIN_EMAIL;
        const adminHash = process.env.ADMIN_PASSWORD_HASH;

        // 환경변수 미설정 시 인증 거부
        if (!adminEmail || !adminHash) return null;
        if (email !== adminEmail) return null;

        const isValid = await verifyPassword(password, adminHash);
        if (!isValid) return null;

        return { id: "admin", email };
      },
    }),
  ],
});
