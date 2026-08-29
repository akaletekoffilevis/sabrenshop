import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = z.object({ email: z.string().email(), password: z.string().min(1) }).safeParse(credentials);
        if (!parsed.success) return null;
        const email = parsed.data.email.trim().toLowerCase();
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.password) return null;
        const ok = await bcrypt.compare(parsed.data.password, user.password);
        if (!ok) return null;
        return { id: user.id, email: user.email, name: user.name, image: user.image, role: user.role } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) (token as any).role = (user as any).role;
      return token;
    },
    async session({ session, token }) {
      if (token.sub) {
        (session.user as any).id = token.sub;
        const dbUser = await prisma.user.findUnique({ where: { id: token.sub }, select: { role: true } });
        (session.user as any).role = dbUser?.role ?? undefined;
      }
      return session;
    },
  },
  pages: { signIn: "/connexion" },
});
