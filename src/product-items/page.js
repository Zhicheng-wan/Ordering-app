'use client';

import { useState } from 'react';
import InfoBox, { SuccessBox } from '@/components/layout/InfoBox';

export default function ProductItemsPage() {
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
      <div className="flex justify-start mb-4">
        <button className="mx-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
          Show All Menu Items
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Create New Product</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Product"
                className="w-32 h-32 object-cover rounded shadow mb-2"
              />
            ) : (
              <label className="cursor-pointer bg-gray-100 border border-dashed border-gray-400 w-32 h-32 flex items-center justify-center rounded hover:bg-gray-200">
                <span className="text-sm text-gray-600">Click to Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
            {imageUrl && (
              <button
                type="button"
                className="text-sm text-red-600 mt-2"
                onClick={() => setImageUrl('')}
              >
                Remove Image
              </button>
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
            ></textarea>
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
    </div>
  );
}
