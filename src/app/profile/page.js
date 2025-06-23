'use client';
import InfoBox, { SuccessBox } from "@/components/layout/InfoBox";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function ProfilePage() {
    const { data: session, status } = useSession();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [avatar, setAvatar] = useState('');
    const [save, setSave] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        if (status === "authenticated" && session) {
            setName(session.user.name || '');
            setEmail(session.user.email || '');
            setAvatar(session.user.image || '');
        }
    }, [session, status]);
  
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

    async function handleSave(event) {
      event.preventDefault();
      setSave(false);
      setIsSaving(true);
      const response = await fetch('/api/profile', {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              name: name,
              avatar: avatar,
          }),
      })

      setIsSaving(false);
      setSave(true);
      
    }

    async function handleChangeAvatar(e) {
        const files = e.target.files;

        if (files && files.length > 0) {
          const data = new FormData();
          data.set('file', files[0]);

          setIsUploading(true);

          const response = await fetch ('/api/upload', {
            method: 'POST',
            body: data,
          });

          const json = await response.json();
          const fileUrl = json.fileUrl;
          
          setAvatar(fileUrl);
          setIsUploading(false);
        }

        
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
         {/* Change avatar using label + input */}
         <div className="text-center mb-6">
            <label htmlFor="avatar-upload" className="cursor-pointer inline-block px-4 py-1 text-sm text-blue-600 rounded transition">
              <span>Change Avatar</span>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleChangeAvatar}
              />
            </label>
        </div>
        
        <h2 className="text-2xl font-bold mb-6 text-center">Edit Profile</h2>
        

        <form
          onSubmit={(e) => {
            handleSave(e);
          }}
        >
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
                placeholder="Enter first name"
            />
          </div>

        
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1 ">Gmail</label>
            <input
                disabled
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 bg-gray-200 rounded"
                placeholder="you@gmail.com"
            />
          </div>

          <button
            type="submit"
            className="cursor-pointer w-full bg-primary text-white py-2 rounded hover:bg-red-600 transition"
          >
            Save Changes
          </button>

          {save &&(
            <SuccessBox>  Profile saved! </SuccessBox>   
          )} 
          {isUploading && (
            <InfoBox>  Uploading... </InfoBox>     
  
          )}
          {isSaving && (
            <InfoBox>  Saving...  </InfoBox>
          )}
          

        </form>
      </div>
    </div>
  );
}
