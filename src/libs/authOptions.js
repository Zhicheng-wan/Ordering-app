// libs/authOptions.js
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/libs/mongoConnect";
import { User } from "@/models/User";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      id: "credentials",
      credentials: {
        username: { label: "Email", type: "email", placeholder: "test@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.username;
        const password = credentials?.password;
        if (!email || !password) return null;

        await mongoose.connect(process.env.MONGO_URI);
        const user = await User.findOne({ email });
        if (!user) return null;

        const passwordOk = await bcrypt.compare(password, user.password);
        if (passwordOk) return user;
        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token, user }) {
      if (session?.user?.email) {
        await mongoose.connect(process.env.MONGO_URI);
        const dbUser = await User.findOne({ email: session.user.email });
        if (dbUser) {
          session.user.admin = dbUser.admin; 
          session.user._id = dbUser._id;     
        }
      }
      return session;
    },
  },
};
