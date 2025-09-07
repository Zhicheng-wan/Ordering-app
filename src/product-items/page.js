'use client';

import { useEffect, useMemo, useState } from 'react';
import InfoBox, { SuccessBox } from '@/components/layout/InfoBox';

export default function ProductItemsPage() {
  const [view, setView] = useState('create'); // 'create' | 'list'
  const [editingId, setEditingId] = useState(null); // mongo _id when editing

  // form state
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

  // UI niceties
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'price-asc' | 'price-desc'

  /* ---------------- Upload ---------------- */
  async function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.set('file', file);
    setIsUploading(true);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      setImageUrl(data.fileUrl);
    } catch (err) {
      setSaveError('Image upload failed.');
    } finally {
      setIsUploading(false);
    }
  }

  /* ---------------- Create/Update ---------------- */
  async function handleSubmit(e) {
    e.preventDefault();
    setSaved(false);
    setSaveError('');
    setIsSaving(true);

    const payload = {
      name,
      description,
      price: Number(price),
      image: imageUrl,
    };

    const url = editingId ? `/api/products/${editingId}` : '/api/products';
    const method = editingId ? 'PATCH' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || 'Save failed');
      }

      setSaved(true);
      resetForm();
      setView('list');
      await loadItems();
    } catch (err) {
      setSaveError(err.message || 'Save failed');
    } finally {
      setIsSaving(false);
    }
  }

  function resetForm() {
    setEditingId(null);
    setName('');
    setDescription('');
    setPrice('');
    setImageUrl('');
  }

  /* ---------------- Read ---------------- */
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

  /* ---------------- Delete ---------------- */
  async function handleDelete(id) {
    const yes = confirm('Delete this item? This cannot be undone.');
    if (!yes) return;
    const prev = items;
    // optimistic UI
    setItems((cur) => cur.filter((x) => x._id !== id));
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      setItems(prev);
      alert('Delete failed.');
    }
  }

  /* ---------------- Edit ---------------- */
  function handleEdit(it) {
    setEditingId(it._id);
    setName(it.name);
    setDescription(it.description);
    setPrice(String(it.price));
    setImageUrl(it.image);
    setView('create');
  }

  /* ---------------- Filters / Sort ---------------- */
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let data = items;
    if (q) {
      data = data.filter(
        (it) => it.name?.toLowerCase().includes(q) || it.description?.toLowerCase().includes(q),
      );
    }
    if (sortBy === 'newest') {
      data = [...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'price-asc') {
      data = [...data].sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === 'price-desc') {
      data = [...data].sort((a, b) => Number(b.price) - Number(a.price));
    }
    return data;
  }, [items, query, sortBy]);

  const canSubmit = !!name && !!description && !!price && !!imageUrl && !isUploading;

  /* ============================ UI ============================ */
  return (
    <div className="w-full px-4 mt-4">
      {/* Toggle */}
      <div className="flex justify-start mb-4 gap-2">
        <button
          onClick={() => {
            const next = view === 'create' ? 'list' : 'create';
            setView(next);
            if (next === 'create') resetForm();
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition"
        >
          {view === 'create' ? '📋 Show All Items' : '➕ Create New Product'}
        </button>
        {editingId && view === 'create' && (
          <button
            onClick={resetForm}
            className="px-3 py-2 text-sm rounded-lg border border-gray-300 bg-white hover:bg-gray-50"
          >
            Cancel Edit
          </button>
        )}
      </div>

      {view === 'create' ? (
        <div>
          <h1 className="text-2xl font-bold mb-6 text-center">
            {editingId ? 'Update Product' : 'Create New Product'}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto">
            <div className="flex flex-col items-center">
              {imageUrl ? (
                <>
                  <img
                    src={imageUrl}
                    alt="Product"
                    className="w-40 h-40 object-cover rounded-xl shadow mb-2"
                  />
                  <button
                    type="button"
                    className="text-sm text-red-600 mt-2"
                    onClick={() => setImageUrl('')}
                  >
                    Remove Image
                  </button>
                </>
              ) : (
                <label className="cursor-pointer bg-gray-50 border border-dashed border-gray-300 w-40 h-40 flex items-center justify-center rounded-xl hover:bg-gray-100">
                  <span className="text-sm text-gray-600">Click to Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
              {!imageUrl && <p className="text-xs text-gray-500 mt-1">Image is required.</p>}
            </div>

            <label className="block">
              <span className="block mb-1 font-medium">Name</span>
              <input
                type="text"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>

            <label className="block">
              <span className="block mb-1 font-medium">Description</span>
              <textarea
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </label>

            <button
              type="submit"
              disabled={!canSubmit || isSaving}
              className={`w-full rounded-xl px-4 py-2 text-white transition ${
                canSubmit && !isSaving
                  ? 'bg-blue-600 hover:bg-blue-700 shadow-sm'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              {editingId
                ? isSaving
                  ? 'Updating…'
                  : 'Update Product'
                : isSaving
                  ? 'Creating…'
                  : 'Create Product'}
            </button>

            {isUploading && <InfoBox>Uploading image...</InfoBox>}
            {isSaving && !editingId && <InfoBox>Saving product...</InfoBox>}
            {saveError && <InfoBox>{saveError}</InfoBox>}
            {saved && (
              <SuccessBox>{editingId ? 'Product updated!' : 'Product created!'}</SuccessBox>
            )}
          </form>
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-bold text-center mb-6">All items</h2>

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-5">
            <div className="flex gap-2">
              <button
                onClick={loadItems}
                className="px-3 py-2 text-sm rounded-lg border border-gray-300 bg-white hover:bg-gray-50"
              >
                Refresh
              </button>
              <span className="self-center text-sm text-gray-500">
                {loadingList ? 'Loading…' : `${items.length} item(s)`}
              </span>
            </div>

            <div className="flex gap-2">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name or description…"
                className="w-full sm:w-72 px-2 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
              </select>
            </div>
          </div>

          {listError && <div className="mb-3 text-red-600 text-sm">{listError}</div>}

          {/* Empty state */}
          {!loadingList && filtered.length === 0 && (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center text-gray-600">
              <div className="text-3xl mb-2">🗂️</div>
              <div className="font-medium">No items match your filter.</div>
              <div className="text-sm">Try clearing the search or change sort.</div>
            </div>
          )}

          {/* Card grid */}
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((it) => (
              <li
                key={it._id}
                className="group rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                {/* image */}
                <div className="relative overflow-hidden">
                  <img
                    src={it.image}
                    alt={it.name}
                    className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                </div>

                {/* content */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-lg font-semibold leading-tight">{it.name}</div>
                      <div className="mt-1 text-sm text-gray-600 line-clamp-2">
                        {it.description}
                      </div>
                    </div>
                    <div className="shrink-0 rounded-lg bg-gray-100 px-2.5 py-1 text-sm font-semibold">
                      ${Number(it.price).toFixed(2)}
                    </div>
                  </div>

                  <div className="mt-2 text-xs text-gray-400">
                    Added {new Date(it.createdAt).toLocaleString()}
                  </div>

                  {/* actions */}
                  <div className="mt-4 flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(it)}
                      className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(it._id)}
                      className="inline-flex items-center justify-center rounded-lg border border-red-300 text-red-600 px-3 py-1.5 text-sm hover:bg-red-50"
                    >
                      Delete
                    </button>
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
