'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import RightArrow from '../icons/RightArrow';

export default function Hero() {
  const vidRef = useRef(null);
  const [muted, setMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    const v = vidRef.current;
    if (!v) return;
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    v.addEventListener('play', onPlay);
    v.addEventListener('pause', onPause);
    return () => {
      v.removeEventListener('play', onPlay);
      v.removeEventListener('pause', onPause);
    };
  }, []);

  return (
    // Full-bleed, edge-to-edge
    <section className="relative isolate w-screen ml-[calc(50%-50vw)] min-h-[78vh] sm:min-h-[85vh] overflow-hidden">
      {/* Background video */}
      <video
        ref={vidRef}
        className="
          absolute inset-0 -z-10 h-full w-full object-cover
          object-[center_38%] pointer-events-none hidden motion-safe:block
          [mask-image:linear-gradient(to_bottom,rgba(0,0,0,1)_82%,rgba(0,0,0,0))]
        "
        autoPlay
        muted={muted}
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      >
        <source src="/hero.mp4" type="video/mp4" />
      </video>

      {/* Readability scrim + subtle spotlight on the right */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/60 via-black/35 to-transparent" />
      <div className="pointer-events-none absolute right-[-10%] top-1/2 -translate-y-1/2 h-[120vmin] w-[120vmin] bg-[radial-gradient(circle_at_center,rgba(255,255,255,.28),transparent_60%)]" />

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 text-white/90 backdrop-blur-md px-3 py-1 text-xs font-semibold ring-1 ring-white/30 shadow">
            NEW • Fall Collection
          </div>

          <h1 className="mt-4 text-white text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[0.95] drop-shadow-[0_1px_1px_rgba(0,0,0,.25)]">
            Everything
            <br />
            is better <br />
            with a Labubu
          </h1>

          <p className="mt-5 max-w-xl text-base sm:text-lg text-white/85">
            Labubu is the missing piece that makes every day complete, a simple joy in life.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-red-500/20 hover:-translate-y-0.5 hover:shadow-xl transition"
            >
              Order Now <RightArrow />
            </Link>

            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded-full bg-white/20 px-5 py-3 text-sm font-semibold text-white ring-1 ring-white/40 backdrop-blur hover:bg-white/30 transition"
            >
              Learn More <RightArrow />
            </Link>

            {/* Tiny video controls */}
            <div className="ml-2 inline-flex items-center gap-2 rounded-full bg-black/40 text-white px-3 py-2 text-xs ring-1 ring-white/20 backdrop-blur">
              <button
                onClick={() => {
                  const v = vidRef.current;
                  if (!v) return;
                  v.paused ? v.play() : v.pause();
                }}
                className="px-2 py-1 rounded hover:bg-white/10"
              >
                {isPlaying ? 'Pause' : 'Play'}
              </button>
              <span className="h-3 w-px bg-white/30" />
              <button
                onClick={() => setMuted((m) => !m)}
                className="px-2 py-1 rounded hover:bg-white/10"
              >
                {muted ? 'Unmute' : 'Mute'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
