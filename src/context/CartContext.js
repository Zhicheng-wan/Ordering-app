'use client';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';

const CartCtx = createContext(null);
const LS_KEY = 'guest_cart_v1'; // [{productId,name,image,price,qty}]

export function CartProvider({ children }) {
  const { data: session, status } = useSession();
  const authed = status === 'authenticated';

  const [items, setItems] = useState([]);
  const totalQty = useMemo(() => items.reduce((a, b) => a + (b.qty || 0), 0), [items]);
  const totalPrice = useMemo(() => items.reduce((a, b) => a + (b.price * b.qty || 0), 0), [items]);

  // Load cart
  const load = useCallback(async () => {
    if (authed) {
      const res = await fetch('/api/cart', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setItems(data?.items || []);
      }
    } else {
      const raw = localStorage.getItem(LS_KEY);
      setItems(raw ? JSON.parse(raw) : []);
    }
  }, [authed]);

  // Sync guest cart to server once after login
  const syncGuestToServer = useCallback(async () => {
    if (!authed) return;
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return;
    try {
      const guest = JSON.parse(raw);
      for (const it of guest) {
        await fetch('/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: it.productId, qty: it.qty }),
        });
      }
      localStorage.removeItem(LS_KEY);
    } finally {
      await load();
    }
  }, [authed, load]);

  useEffect(() => {
    if (status === 'loading') return;
    load().then(() => {
      if (authed) syncGuestToServer();
    });
  }, [status, authed, load, syncGuestToServer]);

  // Mutations
  async function add(product, qty = 1) {
    if (!product?._id) return;
    if (authed) {
      await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product._id, qty }),
      });
      await load();
    } else {
      const next = [...items];
      const i = next.findIndex((x) => x.productId === product._id);
      if (i >= 0) next[i].qty += qty;
      else
        next.push({
          productId: product._id,
          name: product.name,
          image: product.image,
          price: Number(product.price || 0),
          qty,
        });
      localStorage.setItem(LS_KEY, JSON.stringify(next));
      setItems(next);
    }
  }

  async function setQty(productId, qty) {
    if (authed) {
      await fetch(`/api/cart/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qty }),
      });
      await load();
    } else {
      const next = items.map((it) => (it.productId === productId ? { ...it, qty } : it));
      localStorage.setItem(LS_KEY, JSON.stringify(next));
      setItems(next);
    }
  }

  async function remove(productId) {
    if (authed) {
      await fetch(`/api/cart/${productId}`, { method: 'DELETE' });
      await load();
    } else {
      const next = items.filter((it) => it.productId !== productId);
      localStorage.setItem(LS_KEY, JSON.stringify(next));
      setItems(next);
    }
  }

  async function clear() {
    if (authed) {
      await fetch('/api/cart/clear', { method: 'DELETE' });
      await load();
    } else {
      localStorage.removeItem(LS_KEY);
      setItems([]);
    }
  }

  return (
    <CartCtx.Provider value={{ items, totalQty, totalPrice, add, setQty, remove, clear }}>
      {children}
    </CartCtx.Provider>
  );
}

export function useCart() {
  return useContext(CartCtx);
}
