import NextAuth from "next-auth";
import FacebookProvider from "next-auth/providers/facebook";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";

const handler = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "public_profile", // temporarily drop "email" during dev
        },
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      // attach user ID
      if (token.sub) session.user.id = token.sub;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
