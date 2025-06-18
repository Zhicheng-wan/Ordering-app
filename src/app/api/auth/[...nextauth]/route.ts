import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";


const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Email", type: "email", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }       
            },
            async authorize(credentials, req) {
                // Add your own logic here to find the user from the credentials supplied
                const res = await fetch("https://example.com/api/auth", {
                    method: "POST",
                    body: JSON.stringify({
                        username: credentials.username,
                        password: credentials.password,
                    }),
                    headers: { "Content-Type": "application/json" },
                });
                const user = await res.json();
                // If no error and we have user data, return it
                if (res.ok && user) {
                    return user;
                }
                // Return null if user data could not be retrieved
                return null;
            },
        }),
                    
    ],

});

export { handler as GET, handler as POST };