'use client';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function CartButton() {
  const { totalQty } = useCart();

  return (
    <Link
      href="/cart"
      className="relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full border hover:bg-gray-50"
      aria-label={`Open cart (${totalQty} item${totalQty === 1 ? '' : 's'})`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="9" cy="21" r="1"></circle>
        <circle cx="20" cy="21" r="1"></circle>
        <path d="M1 1h4l2.68 12.39a2 2 0 0 0 2 1.61h7.72a2 2 0 0 0 2-1.61L22 6H6"></path>
      </svg>

 

      {/* Badge (top-right) */}
      {totalQty > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 px-1 rounded-full bg-primary text-white text-xs flex items-center justify-center leading-none">
          {totalQty}
        </span>
      )}
    </Link>
  );
}
