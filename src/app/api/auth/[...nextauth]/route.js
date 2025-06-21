import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import * as mongoose from "mongoose";

import {User} from "@/models/User";
import bcrypt from "bcrypt";

import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from "@/libs/mongoConnect";

const handler = NextAuth({
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
                password: { label: "Password", type: "password" }       
            },
            async authorize(credentials) {
                const email = credentials?.username;
                const password = credentials?.password;

                if (!email || !password) return null;
              
                await mongoose.connect(process.env.MONGO_URI);
                const user = await User.findOne({ email });
              
                if (!user) return null;
              
                const passwordOk = await bcrypt.compare(password, user.password);
                console.log ({ email, password, user, passwordOk });
              
                if (passwordOk) {
                   return user;
                }
              
                return null;
            },
        }),
                    
    ],
});

export { handler as GET, handler as POST };