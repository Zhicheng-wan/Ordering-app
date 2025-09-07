'use client';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { items, totalQty, totalPrice, setQty, remove, clear } = useCart();

  // Confirm modals
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);
  const [confirmRemoveOpen, setConfirmRemoveOpen] = useState(false);
  const [pendingRemove, setPendingRemove] = useState(null); // { id, name, image }

  const hasItems = items.length > 0;

  const subtotal = useMemo(() => totalPrice, [totalPrice]);
  const shipping = useMemo(() => (hasItems ? 0 : 0), [hasItems]); // free shipping placeholder
  const grandTotal = useMemo(() => subtotal + shipping, [subtotal, shipping]);

  function onRemoveClick(it) {
    setPendingRemove({ id: it.productId, name: it.name, image: it.image });
    setConfirmRemoveOpen(true);
  }

  function onConfirmRemove() {
    if (pendingRemove?.id) remove(pendingRemove.id);
    setConfirmRemoveOpen(false);
    setPendingRemove(null);
  }

  function onConfirmClear() {
    clear();
    setConfirmClearOpen(false);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      {/* Hide default number spinners globally (Chrome/Firefox) */}
      <style jsx global>{`
        input[type='number']::-webkit-outer-spin-button,
        input[type='number']::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type='number'] {
          -moz-appearance: textfield;
        }
      `}</style>

      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Your Cart</h1>
        <Link href="/products" className="text-sm font-semibold text-red-600 hover:text-red-700">
          ← Continue shopping
        </Link>
      </header>

      {!hasItems ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <section className="lg:col-span-2 space-y-4">
            {items.map((it) => (
              <article
                key={it.productId}
                className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100"
              >
                <img
                  src={it.image || '/placeholder.png'}
                  alt={it.name}
                  className="h-20 w-20 rounded-xl object-cover"
                />

                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-900 truncate">{it.name}</h3>
                  <p className="text-sm text-gray-500">${Number(it.price).toFixed(2)}</p>
                </div>

                {/* Quantity with - [input] + controls (spinners hidden) */}
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-sm text-gray-600">Quantity</span>

                  <div className="inline-flex items-stretch overflow-hidden rounded-md border border-gray-300">
                    <button
                      type="button"
                      aria-label={`Decrease quantity for ${it.name}`}
                      className="px-3 py-1.5 text-base leading-none hover:bg-gray-50"
                      onClick={() => setQty(it.productId, Math.max(1, (it.qty || 1) - 1))}
                    >
                      −
                    </button>

                    <input
                      type="number"
                      inputMode="numeric"
                      min="1"
                      value={it.qty}
                      onChange={(e) => {
                        const n = Math.max(1, Number(e.target.value || 1));
                        if (!Number.isNaN(n)) setQty(it.productId, n);
                      }}
                      onBlur={(e) => {
                        if (!e.target.value || Number(e.target.value) < 1) {
                          setQty(it.productId, 1);
                        }
                      }}
                      aria-label={`Quantity for ${it.name}`}
                      className="w-16 text-center outline-none border-l border-r border-gray-300"
                    />

                    <button
                      type="button"
                      aria-label={`Increase quantity for ${it.name}`}
                      className="px-3 py-1.5 text-base leading-none hover:bg-gray-50"
                      onClick={() => setQty(it.productId, (it.qty || 1) + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="w-24 text-right font-semibold tabular-nums">
                  ${(it.price * it.qty).toFixed(2)}
                </div>

                <button
                  className="ml-2 shrink-0 rounded-md border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
                  onClick={() => onRemoveClick(it)}
                >
                  Remove
                </button>
              </article>
            ))}

            <div className="flex justify-between">
              <button
                className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-50"
                onClick={() => setConfirmClearOpen(true)}
              >
                Clear cart
              </button>
            </div>
          </section>

          {/* Summary */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-600">Items</dt>
                  <dd className="font-medium">{totalQty}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Subtotal</dt>
                  <dd className="font-medium">${subtotal.toFixed(2)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Shipping</dt>
                  <dd className="font-medium">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</dd>
                </div>
              </dl>

              <div className="my-4 h-px bg-gray-100" />

              <div className="flex justify-between text-base">
                <span className="font-semibold">Total</span>
                <span className="font-extrabold tabular-nums">${grandTotal.toFixed(2)}</span>
              </div>

              <button className="mt-6 w-full rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-md hover:brightness-110">
                Checkout
              </button>

              <p className="mt-3 text-xs text-gray-500">Taxes calculated at checkout.</p>
            </div>
          </aside>
        </div>
      )}

      {/* Remove item confirmation */}
      <ConfirmModal
        open={confirmRemoveOpen}
        onClose={() => {
          setConfirmRemoveOpen(false);
          setPendingRemove(null);
        }}
        title="Remove item?"
        confirmText="Remove"
        confirmStyle="danger"
        onConfirm={onConfirmRemove}
      >
        {pendingRemove && (
          <div className="flex items-center gap-3">
            <img
              src={pendingRemove.image || '/placeholder.png'}
              alt={pendingRemove.name}
              className="h-14 w-14 rounded object-cover"
            />
            <div className="text-sm text-gray-700">
              Are you sure you want to remove{' '}
              <span className="font-semibold">{pendingRemove.name}</span> from your cart?
            </div>
          </div>
        )}
      </ConfirmModal>

      {/* Clear cart confirmation */}
      <ConfirmModal
        open={confirmClearOpen}
        onClose={() => setConfirmClearOpen(false)}
        title="Clear entire cart?"
        confirmText="Clear cart"
        confirmStyle="danger"
        onConfirm={onConfirmClear}
      >
        <p className="text-sm text-gray-700">
          This will remove <span className="font-semibold">{totalQty}</span> item(s) from your cart.
          You can’t undo this action.
        </p>
      </ConfirmModal>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-gray-300 bg-white/60 p-12 text-center">
      <p className="text-gray-600">
        Your cart is empty.{' '}
        <Link href="/products" className="text-primary underline">
          Shop products
        </Link>
      </p>
    </div>
  );
}

/** Simple, accessible confirmation modal (no external deps) */
function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  children,
  confirmText = 'Confirm',
  confirmStyle = 'primary',
}) {
  if (!open) return null;

  const confirmClasses =
    confirmStyle === 'danger'
      ? 'bg-red-600 hover:bg-red-700 text-white'
      : 'bg-primary hover:brightness-110 text-white';

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/40 px-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white shadow-xl ring-1 ring-black/5 animate-in fade-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between p-5 border-b">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-md px-2 py-1 text-gray-500 hover:bg-gray-100"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="p-5">{children}</div>

        <div className="flex items-center justify-end gap-2 p-5 border-t">
          <button
            onClick={onClose}
            className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm?.();
              // modal closes in parent after action
            }}
            className={`rounded-md px-4 py-2 text-sm font-semibold ${confirmClasses}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
