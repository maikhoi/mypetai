import NextAuth from "next-auth";
import FacebookProvider from "next-auth/providers/facebook";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import mongoose from "mongoose";
import User from "@/models/User"; //  Mongoose model

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
        const email = profile.email || `${profile.id}@facebook.com`;
        // ✅ Map the Facebook API response into a NextAuth-compatible user object
        return {
          id: profile.id,
          name: profile.name || "Facebook User",
          email,
          image: profile.picture?.data?.url || null,
          username: email, // ✅ use email as username          
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user }) {
      try {
        // Ensure Mongoose is connected (safe even if already connected)
        if (mongoose.connection.readyState === 0) {
          await mongoose.connect(process.env.MONGO_URI!);
        }

        // Update lastLogin for this username if it exists in your custom model
        await User.findOneAndUpdate(
          { username: user.email }, // or match by email if that's your identifier
          { lastLogin: new Date() }
        );
      } catch (err) {
        console.error("⚠️ Error updating lastLogin:", err);
      }

      return true; // always allow login
    },
    async session({ session, token }) {
      if (token.sub) session.user.id = token.sub;
      return session;
    },
  },
});

export { handler as GET, handler as POST };