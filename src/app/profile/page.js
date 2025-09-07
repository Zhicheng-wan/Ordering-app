'use client';
import InfoBox, { SuccessBox } from "@/components/layout/InfoBox";
import ProductItemsPage from "@/product-items/page";
import AdminUserPage from "@/users/page";
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
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const wide = isAdmin && activeTab !== 'profile';

  // URL mode state
  const [showUrlBox, setShowUrlBox] = useState(false);
  const [avatarUrlInput, setAvatarUrlInput] = useState('');
  const [checkingUrl, setCheckingUrl] = useState(false);
  const [urlError, setUrlError] = useState('');

  useEffect(() => {
    if (status === "authenticated" && session) {
      setName(session.user.name || '');
      setEmail(session.user.email || '');
      setAvatar(session.user.image || '');
      setIsAdmin(session.user.admin || false);
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
    await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, avatar }),
    });
    setIsSaving(false);
    setSave(true);
  }

  async function handleChangeAvatar(e) {
    const files = e.target.files;
    if (files?.length > 0) {
      const data = new FormData();
      data.set('file', files[0]);
      setIsUploading(true);
      const res = await fetch('/api/upload', { method: 'POST', body: data });
      const json = await res.json();
      setAvatar(json.fileUrl);
      setIsUploading(false);
      setShowUrlBox(false);
      setUrlError('');
    }
  }

  // Validate & apply URL as avatar
  async function handleApplyAvatarUrl(e) {
    e.preventDefault();
    setUrlError('');
    const url = avatarUrlInput.trim();
    if (!url) return;

    // Quick “looks like image” check (extension)
    const looksLikeImage = /\.(png|jpe?g|webp|gif|svg)(\?.*)?$/i.test(url);

    // Try to actually load the image
    setCheckingUrl(true);
    const ok = await new Promise((resolve) => {
      const img = new Image();
      img.referrerPolicy = 'no-referrer';
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
    setCheckingUrl(false);

    if (!ok) {
      setUrlError(
        looksLikeImage
          ? "That URL didn't load. The site may block hotlinking."
          : "This isn't a direct image URL. Use a link that ends with .png/.jpg/.webp, etc."
      );
      return;
    }

    setAvatar(url);
    setShowUrlBox(false);
    setAvatarUrlInput('');
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <>
            {avatar && (
              <img
                src={avatar}
                referrerPolicy="no-referrer"
                alt="Profile"
                className="w-24 h-24 rounded-full mx-auto mb-3 object-cover"
              />
            )}

            {/* Avatar controls */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <label
                htmlFor="avatar-upload"
                className="cursor-pointer px-3 py-1.5 text-sm rounded-md border border-gray-300 bg-white hover:bg-gray-50"
              >
                Upload Image
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleChangeAvatar}
                />
              </label>

              
            </div>

            {showUrlBox && (
              <form onSubmit={handleApplyAvatarUrl} className="max-w-xl mx-auto mb-4">
                <label className="block text-sm font-medium mb-1">Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={avatarUrlInput}
                    onChange={(e) => setAvatarUrlInput(e.target.value)}
                    placeholder="https://…/avatar.png"
                    className={`w-full px-3 py-2 rounded-md border ${urlError ? 'border-red-400' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-400`}
                  />
                  <button
                    type="submit"
                    disabled={checkingUrl}
                    className="px-3 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60"
                  >
                    {checkingUrl ? 'Checking…' : 'Apply'}
                  </button>
                </div>
                {!!urlError && <p className="mt-1 text-xs text-red-600">{urlError}</p>}
               
              </form>
            )}

            <h2 className="text-2xl font-bold mb-6 text-center">Edit Profile</h2>
            <form onSubmit={handleSave} className="max-w-xl mx-auto">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  placeholder="Enter your name"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-1">Gmail</label>
                <input
                  disabled
                  type="email"
                  value={email}
                  className="w-full px-3 py-2 border border-gray-300 bg-gray-200 rounded"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-white py-2 rounded hover:bg-red-600 transition"
              >
                Save Changes
              </button>

              {save && <SuccessBox>Profile saved!</SuccessBox>}
              {isUploading && <InfoBox>Uploading…</InfoBox>}
              {isSaving && <InfoBox>Saving…</InfoBox>}
            </form>
          </>
        );
      case 'products':
        return <ProductItemsPage />;
      case 'users':
        return <AdminUserPage />;
    }
  };

  const tabClasses = (tab) =>
    `px-4 py-2 rounded-t-md text-sm font-semibold cursor-pointer border-b-2 ${
      activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'
    }`;

  return (
    <div className="flex flex-col items-center justify-start min-h-screen pt-24">
      <div className={`w-full ${wide ? 'max-w-6xl' : 'max-w-2xl'} bg-white rounded-lg shadow-md`}>
        {/* Tabs */}
        <div className="flex border-b px-6 pt-4 space-x-6">
          <button className={tabClasses('profile')} onClick={() => setActiveTab('profile')}>Profile</button>
          {isAdmin && (
            <>
              <button className={tabClasses('products')} onClick={() => setActiveTab('products')}>Product Items</button>
              <button className={tabClasses('users')} onClick={() => setActiveTab('users')}>Users</button>
            </>
          )}
        </div>
        {/* Tab Content */}
        <div className="p-6">{renderTabContent()}</div>
      </div>
    </div>
  );
}
