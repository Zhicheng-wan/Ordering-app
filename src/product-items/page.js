'use client';

import { useEffect, useState } from 'react';
import InfoBox, { SuccessBox } from '@/components/layout/InfoBox';

export default function ProductItemsPage() {
  const [view, setView] = useState('create');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState('');

  // list state
  const [items, setItems] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [listError, setListError] = useState('');

  async function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.set('file', file);
    setIsUploading(true);
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    const data = await res.json();
    setImageUrl(data.fileUrl);
    setIsUploading(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaved(false);
    setSaveError('');
    setIsSaving(true);

    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        description,
        price: Number(price),  
        image: imageUrl,      
      }),
    });

    setIsSaving(false);

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      setSaveError(err?.error || 'Save failed');
      return;
    }

    setSaved(true);
    setName('');
    setDescription('');
    setPrice('');
    setImageUrl('');

    // switch to list and refresh
    setView('list');
    await loadItems();
  }

  async function loadItems() {
    try {
      setListError('');
      setLoadingList(true);
      const res = await fetch('/api/products', { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setListError('Could not load items.');
    } finally {
      setLoadingList(false);
    }
  }

  useEffect(() => {
    if (view === 'list') loadItems();
  }, [view]);

  const canSubmit = !!name && !!description && !!price && !!imageUrl && !isUploading;

  return (
    <div className="w-full px-4 mt-4">
      {/* Toggle */}
      <div className="flex justify-start mb-4">
        <button
          onClick={() => setView(view === 'create' ? 'list' : 'create')}
          className="px-4 py-2 border border-gray-300 bg-white text-gray-800 rounded hover:bg-gray-100 transition"
        >
          {view === 'create' ? '📋 Show All Items' : '➕ Create New Product'}
        </button>
      </div>

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
              {!imageUrl && (
                <p className="text-xs text-gray-500 mt-1">Image is required.</p>
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
                min="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </label>

            <button
              type="submit"
              disabled={!canSubmit}
              className={`w-full text-white py-2 rounded transition ${
                canSubmit ? 'bg-primary hover:bg-red-600' : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              Create Product
            </button>

            {isUploading && <InfoBox>Uploading image...</InfoBox>}
            {isSaving && <InfoBox>Saving product...</InfoBox>}
            {saveError && <InfoBox>{saveError}</InfoBox>}
            {saved && <SuccessBox>Product created!</SuccessBox>}
          </form>
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-bold text-center mb-4">All items</h2>

          <div className="flex items-center justify-between mb-3">
            <button
              onClick={loadItems}
              className="px-3 py-1.5 text-sm border rounded hover:bg-gray-50"
            >
              Refresh
            </button>
            <span className="text-sm text-gray-500">
              {loadingList ? 'Loading…' : items.length ? `${items.length} item(s)` : 'No items'}
            </span>
          </div>

          {listError && <div className="mb-3 text-red-600 text-sm">{listError}</div>}

          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((it) => (
              <li key={it._id} className="border rounded p-3 flex gap-3 items-start">
                <img
                  src={it.image}
                  alt={it.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <div className="font-semibold">{it.name}</div>
                  <div className="text-sm text-gray-600 line-clamp-2">{it.description}</div>
                  <div className="mt-1 font-medium">${Number(it.price).toFixed(2)}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    Added {new Date(it.createdAt).toLocaleString()}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
