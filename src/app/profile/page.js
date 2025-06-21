'use client';
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function ProfilePage() {
  const { data: session, status } = useSession();

  const [name, setName] = useState(session?.user?.name || '');
  const [email, setEmail] = useState(session?.user?.email || '');
  const [avatar, setAvatar] = useState(session?.user?.image || '');

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Loading...</h2>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Access Denied</h2>
          <p className="text-gray-600 mb-4">You must be logged in to view this page.</p>
        </div>
      </div>
    );
  }

  function handleSave() {
    console.log({ firstName, lastName, email, avatar });
    // TODO: send updated data to backend
  }

  function handleChangeAvatar() {
    alert('Avatar upload functionality coming soon!');
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        {avatar && (
          <img
            src={avatar}
            alt="Profile Picture"
            className="w-24 h-24 rounded-full mx-auto mb-4"
          />
        )}
        <button
          onClick={handleChangeAvatar}
          className="cursor-pointer block mx-auto mb-6 text-sm text-blue-600 hover:underline"
        >
          Change Avatar
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center">Edit Profile</h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">First Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              placeholder="Enter first name"
            />
          </div>

        
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Gmail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              placeholder="you@gmail.com"
            />
          </div>

          <button
            type="submit"
            className="cursor-pointer w-full bg-primary text-white py-2 rounded hover:bg-red-600 transition"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
