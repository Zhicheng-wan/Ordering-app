'use client';

import { useEffect, useMemo, useState } from 'react';
import { useCart } from '@/context/CartContext';

/**
 * Products Page
 * - Fetches from /api/products
 * - Dynamic category filters (if item.category exists)
 * - Otherwise shows price filters (Under $25, $25–$50, $50+)
 * - Pretty cards with hover, gradient hero, and Load More
 */
export default function ProductsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [displayed, setDisplayed] = useState(6);

  // Filter state
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'cat:<name>' | 'price:<range>'
  const [usingCategories, setUsingCategories] = useState(false);

  const { add } = useCart();

  useEffect(() => {
    (async () => {
      try {
        setLoadError('');
        setLoading(true);
        const res = await fetch('/api/products', { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        setLoadError('Failed to load products.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Detect categories if any product has item.category
  const categories = useMemo(() => {
    const set = new Set(
      items
        .map((i) => i.category)
        .filter((v) => typeof v === 'string' && v.trim().length > 0)
        .map((v) => v.toLowerCase()),
    );
    const arr = Array.from(set);
    setUsingCategories(arr.length > 0);
    return arr;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length]); // recalc only when items count changes (cheap heuristic)

  const priceFilters = [
    { key: 'price:under-25', label: 'Under $25', test: (p) => p < 25 },
    { key: 'price:25-50', label: '$25 – $50', test: (p) => p >= 25 && p <= 50 },
    { key: 'price:over-50', label: '$50+', test: (p) => p > 50 },
  ];

  const filtered = useMemo(() => {
    let list = items;
    if (activeFilter === 'all') {
      // no-op
    } else if (activeFilter.startsWith('cat:')) {
      const cat = activeFilter.slice(4);
      list = list.filter((i) => (i.category || '').toLowerCase() === cat);
    } else if (activeFilter.startsWith('price:')) {
      const key = activeFilter;
      const rule = priceFilters.find((f) => f.key === key);
      if (rule) list = list.filter((i) => rule.test(Number(i.price || 0)));
    }
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, activeFilter]);

  const toShow = filtered.slice(0, displayed);

  function onFilterClick(key) {
    setActiveFilter(key);
    setDisplayed(6);
  }

  function handleAddToCart(product) {
    // Hook up to your cart later; for now, just a friendly toast/alert
    add(product, 1);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200">
      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 py-25 max-w-7xl mx-auto">
        {/* Filters */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-12">
          <button
            onClick={() => onFilterClick('all')}
            className={`px-5 py-2.5 rounded-full border-2 transition-all shadow-sm ${
              activeFilter === 'all'
                ? 'bg-red-600 border-red-600 text-white shadow-red-200'
                : 'bg-white border-gray-200 text-gray-700 hover:-translate-y-0.5 hover:shadow'
            }`}
          >
            All Products
          </button>

          {usingCategories
            ? categories.map((c) => (
                <button
                  key={c}
                  onClick={() => onFilterClick(`cat:${c}`)}
                  className={`px-5 py-2.5 rounded-full border-2 transition-all shadow-sm capitalize ${
                    activeFilter === `cat:${c}`
                      ? 'bg-red-600 border-red-600 text-white shadow-red-200'
                      : 'bg-white border-gray-200 text-gray-700 hover:-translate-y-0.5 hover:shadow'
                  }`}
                >
                  {c.replace('-', ' ')}
                </button>
              ))
            : priceFilters.map((f) => (
                <button
                  key={f.key}
                  onClick={() => onFilterClick(f.key)}
                  className={`px-5 py-2.5 rounded-full border-2 transition-all shadow-sm ${
                    activeFilter === f.key
                      ? 'bg-red-600 border-red-600 text-white shadow-red-200'
                      : 'bg-white border-gray-200 text-gray-700 hover:-translate-y-0.5 hover:shadow'
                  }`}
                >
                  {f.label}
                </button>
              ))}
        </div>

        {/* Products Grid */}
        {loadError && <div className="text-center text-red-600 mb-6">{loadError}</div>}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-[380px] rounded-2xl bg-white shadow-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {toShow.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-white/50 p-12 text-center text-gray-600">
                No products match this filter.
              </div>
            ) : (
              <div className="products-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 mb-12">
                {toShow.map((p) => (
                  <article
                    key={p._id}
                    className="product-card group bg-white rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:-translate-y-2 hover:scale-[1.01] hover:shadow-red-200"
                  >
                    {/* Image band */}
                    <div className="relative product-image h-64 bg-gradient-to-tr from-amber-100 via-rose-100 to-indigo-100 flex items-center justify-center overflow-hidden">
                      {p.image ? (
                        <img
                          src={p.image}
                          alt={p.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <span className="text-6xl select-none">🧸</span>
                      )}
                      {/* simple shimmer line */}
                      <span className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <span className="absolute -inset-y-1 -left-1 w-1/2 skew-x-[-20deg] bg-white/10 blur-2xl" />
                      </span>
                    </div>

                    {/* Content */}
                    <div className="product-info p-6">
                      {/* Optional category / fallback label */}
                      <div className="product-category uppercase tracking-wide text-xs font-semibold text-gray-500 mb-2">
                        {(p.category || 'General').replace('-', ' ')}
                      </div>

                      <h3 className="product-name text-xl font-bold text-gray-900 mb-1 line-clamp-1">
                        {p.name}
                      </h3>

                      <div className="product-price text-2xl font-extrabold text-red-600 mb-3">
                        {formatPrice(p.price)}
                      </div>

                      <p className="product-description text-sm text-gray-600 leading-6 line-clamp-3 mb-4">
                        {p.description}
                      </p>

                      <button
                        onClick={() => handleAddToCart(p)}
                        className="add-to-cart w-full rounded-xl text-white font-semibold py-3 transition-all bg-gradient-to-br from-red-600 to-orange-500 hover:-translate-y-0.5 hover:shadow-lg"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* Load More */}
            {filtered.length > displayed && (
              <div className="load-more-section text-center">
                <button
                  onClick={() => setDisplayed((n) => n + 6)}
                  className="load-more-btn bg-white text-red-600 border-2 border-red-600 px-8 py-3 rounded-full font-semibold hover:bg-red-600 hover:text-white transition-all shadow"
                >
                  Load More Products
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

function formatPrice(v) {
  const n = Number(v);
  if (Number.isNaN(n)) return '$0.00';
  return n.toLocaleString(undefined, { style: 'currency', currency: 'USD' });
}
