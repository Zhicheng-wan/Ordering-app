'use client';

import { useState } from 'react';
import InfoBox, { SuccessBox } from '@/components/layout/InfoBox';

export default function ProductItemsPage() {
  const [view, setView] = useState('create'); // 'create' or 'list'
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.set('file', file);
    setIsUploading(true);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    setImageUrl(data.fileUrl);
    setIsUploading(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaved(false);
    setIsSaving(true);

    await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description, price, image: imageUrl }),
    });

    setIsSaving(false);
    setSaved(true);
    setName('');
    setDescription('');
    setPrice('');
    setImageUrl('');
  }

  return (
    <div className="w-full px-4 mt-4">
      {/* Toggle Button */}
      <div className="flex justify-start mb-4">
        <button
          onClick={() => setView(view === 'create' ? 'list' : 'create')}
          className="px-4 py-2 border border-gray-300 bg-white text-gray-800 rounded hover:bg-gray-100 transition"
        >
          {view === 'create' ? '📋 Show All Items' : '➕ Create New Product'}
        </button>
      </div>

      {/* View Content */}
      {view === 'create' ? (
        <div>
          <h1 className="text-2xl font-bold mb-6 text-center">Create New Product</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center">
              {imageUrl ? (
                <>
                  <img src={imageUrl} alt="Product" className="w-32 h-32 object-cover rounded shadow mb-2" />
                  <button
                    type="button"
                    className="text-sm text-red-600 mt-2"
                    onClick={() => setImageUrl('')}
                  >
                    Remove Image
                  </button>
                </>
              ) : (
                <label className="cursor-pointer bg-gray-100 border border-dashed border-gray-400 w-32 h-32 flex items-center justify-center rounded hover:bg-gray-200">
                  <span className="text-sm text-gray-600">Click to Upload</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              )}
            </div>

            <label className="block">
              <span className="block mb-1 font-medium">Name</span>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>

            <label className="block">
              <span className="block mb-1 font-medium">Description</span>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </label>

            <label className="block">
              <span className="block mb-1 font-medium">Price ($)</span>
              <input
                type="number"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </label>

            <button
              type="submit"
              className="w-full bg-primary text-white py-2 rounded hover:bg-red-600 transition"
            >
              Create Product
            </button>

            {isUploading && <InfoBox>Uploading image...</InfoBox>}
            {isSaving && <InfoBox>Saving product...</InfoBox>}
            {saved && <SuccessBox>Product created!</SuccessBox>}
          </form>
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-bold text-center mb-4">All items</h2>
          <p className="text-center text-gray-500">Coming soon: list of items...</p>
        </div>
      )}
    </div>
  );
}
