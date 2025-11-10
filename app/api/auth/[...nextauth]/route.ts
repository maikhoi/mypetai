import NextAuth, { NextAuthOptions } from "next-auth";
import FacebookProvider from "next-auth/providers/facebook";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import mongoose from "mongoose";
import User from "@/models/User"; //  Mongoose model
import { UserProfileModel } from "@/models/UserProfile";

export const authOptions: NextAuthOptions = {
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
        // 1️⃣ Ensure Mongoose connection
        if (mongoose.connection.readyState === 0) {
          await mongoose.connect(process.env.MONGODB_URI!);
        }

        // 2️⃣ Upsert into UserProfile
        const UserProfile = await UserProfileModel();
        const existing = await UserProfile.findOne({ email: user.email });

        if (!existing) {
          // New Facebook user → create profile
          await UserProfile.create({
            userId: user.id ?? "", // keep ID reference to NextAuth user
            email: user.email,
            role: "user",
            lastLogin: new Date(),
            loginCount: 1,
            passwordHash: null,
            isEmailVerified: true,
          });
          console.log(`✅ Created new UserProfile for ${user.email}`);
        } else {
          // Returning user → update
          existing.lastLogin = new Date();
          existing.loginCount = (existing.loginCount || 0) + 1;
          await existing.save();
        }

        // Update lastLogin for this username if it exists in your custom model
        await User.findOneAndUpdate(
          { username: user.email }, // or match by email if that's your identifier
          { lastLogin: new Date() },
          { upsert: false }
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
};

// 👇 this part stays the same
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };