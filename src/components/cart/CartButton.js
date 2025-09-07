'use client';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function CartButton() {
  const { totalQty } = useCart();
  return (
    <Link
      href="/cart"
      className="relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full border"
    >
      Cart
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-xs">
        {totalQty}
      </span>
    </Link>
  );
}
