import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import * as mongoose from "mongoose";

import {User} from "@/models/User";
import bcrypt from "bcrypt";

const handler = NextAuth({
    secret: process.env.NEXTAUTH_SECRET,

    providers: [
        CredentialsProvider({
            name: "Credentials",
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
                  return { email: user.email }; // avoid returning full user with hashed password
                }
              
                return null;
            },
        }),
                    
    ],

});

export { handler as GET, handler as POST };