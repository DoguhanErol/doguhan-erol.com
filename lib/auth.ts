import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import {
  AUTH_SESSION_MAX_AGE_SEC,
  AUTH_SESSION_UPDATE_AGE_SEC,
  getAuthSessionCookieName,
  getAuthSessionCookieOptions,
} from "./auth-cookies";
import { findUserByLogin } from "./credentials";
import { checkRateLimit, clearRateLimit } from "./rate-limit";
import { getRequestIp } from "./request-ip";

class RateLimitedError extends CredentialsSignin {
  code = "RATE_LIMITED";
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: {
    strategy: "jwt",
    maxAge: AUTH_SESSION_MAX_AGE_SEC,
    updateAge: AUTH_SESSION_UPDATE_AGE_SEC,
  },
  pages: {
    signIn: "/login",
  },
  cookies: {
    sessionToken: {
      name: getAuthSessionCookieName(),
      options: getAuthSessionCookieOptions(),
    },
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        login: { label: "Login", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const login = credentials?.login as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!login || !password) return null;

        const ip = await getRequestIp();
        const key = `login:${ip}:${login.trim().toLowerCase()}`;
        const rate = checkRateLimit(key, 12, 15 * 60 * 1000, 10 * 60 * 1000);
        if (!rate.allowed) throw new RateLimitedError();

        const user = await findUserByLogin(login);
        if (!user) return null;

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return null;

        clearRateLimit(key);
        return {
          id: user.id,
          email: user.email,
          name: user.username,
          username: user.username,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.email = user.email;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub || "";
        session.user.email = (token.email as string) || "";
        session.user.username = (token.username as string) || "";
      }
      return session;
    },
  },
});
