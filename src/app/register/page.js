"use client";
import { useState } from 'react';

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [creatingUser, setCreatingUser] = useState(false);
    const [userCreated, setUserCreated] = useState(false);

    function handleSubmit(event) {
        event.preventDefault();
        setCreatingUser(true);
        fetch('/api/register', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
            headers: {
                'Content-Type': 'application/json',
            },
        })
        setCreatingUser(false);
    }

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2" htmlFor="email">Email</label>
                        <input
                            disabled={creatingUser}
                            type="email"
                            id="email"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:cursor-not-allowed"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2" htmlFor="password">Password</label>
                        <input
                            disabled={creatingUser}
                            type="password"
                            id="password"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:cursor-not-allowed"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        disabled={creatingUser}
                        type="submit"
                        className="w-full bg-primary text-white py-2 rounded hover:bg-primary-dark transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Register
                    </button>
                </form>

                {/* Divider */}
                <div className="flex items-center my-6">
                    <hr className="flex-grow border-gray-300" />
                    <span className="px-4 text-gray-500 text-sm">or login with</span>
                    <hr className="flex-grow border-gray-300" />
                    </div>

                    {/* Login with Google */}
                    <button
                    onClick={() => console.log("Login with Google")} // Replace with actual handler
                    className="w-full flex items-center justify-center gap-3 border border-gray-300 py-2 rounded hover:bg-gray-50 transition"
                    >
                    <img src="/Google.webp" alt="Google" className="w-5 h-5" />
                    <span className="text-sm font-medium text-gray-700">Login with Google</span>
                    </button>
                </div>
        </div>
    );
}