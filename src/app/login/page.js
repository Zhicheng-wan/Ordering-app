"use client";
import { useState } from 'react';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginInProgress, setLoginInProgress] = useState(false);

    async function handleLogin(event) {
        event.preventDefault();
        setLoginInProgress(true);
        // Handle login logic here
        const result = await signIn('credentials', {
            username: email,
            password,
            callbackUrl: '/', // Redirect to home page after login
        });
        

    }


    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2" htmlFor="email">Email</label>
                        <input
                            name ="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loginInProgress}
                            type="email"
                            id="email"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:cursor-not-allowed"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2" htmlFor="password">Password</label>
                        <input
                            name = "password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loginInProgress}
                            type="password"
                            id="password"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:cursor-not-allowed"
                            required
                        />
                    </div>
                    <button
                        disabled={loginInProgress}
                        type="submit"
                        className="cursor-pointer w-full bg-primary text-white py-2 rounded hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Login
                    </button>
                </form>

                <div className="flex items-center my-6">
                    <hr className="flex-grow border-gray-300" />
                    <span className="px-4 text-gray-500 text-sm">or login with</span>
                    <hr className="flex-grow border-gray-300" />
                    </div>

                    {/* Login with Google */}
                    <button
                        onClick={() => signIn('google', {callbackUrl:"/"})} // Replace with actual handler
                        className="cursor-pointer w-full flex items-center justify-center gap-3 border border-gray-300 py-2 rounded hover:bg-gray-50 transition"
                        >
                        <img src="/Google.webp" alt="Google" className="w-5 h-5" />
                        <span className="text-sm font-medium text-gray-700">Login with Google</span>
                    </button>

            </div>
        </div>
    );
}