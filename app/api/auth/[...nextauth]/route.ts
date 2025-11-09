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
          scope: "public_profile,email", // ✅ request both
        },
      },
      profile(profile) {
        // ✅ Map the Facebook API response into a NextAuth-compatible user object
        return {
          id: profile.id,
          name: profile.name || "Facebook User",
          email: profile.email || `${profile.id}@facebook.com`, // fallback prevents createAccount errors
          image: profile.picture?.data?.url || null,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      if (token.sub) session.user.id = token.sub;
      return session;
    },
  },
});

export { handler as GET, handler as POST };