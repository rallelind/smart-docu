import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from "../../../lib/prisma";

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  adapter: PrismaAdapter(prisma),
  secret: process.env.SECRET,
}

export default NextAuth(authOptions)