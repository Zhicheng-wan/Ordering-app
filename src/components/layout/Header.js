'use client';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';

export default function Header() {
  const session = useSession();
  console.log('Session:', session);
  const status = session.status;
  const userData = session.data?.user;
  let userName = userData?.name || userData?.email;
  if (userName && userName.includes(' ')) {
    userName = userName.split(' ')[0]; // Use only the first name
  }

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm px-4">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between py-4">
        {/* Left Nav: Logo + Links */}
        <nav className="flex items-center gap-8 text-black font-semibold">
          <Link href="/" className=" text-red-600 font-semibold text-2xl">
            POP MART
          </Link>
          <Link href="/">Home</Link>
          <Link href="/products">Products</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </nav>

        {/* Right Nav: Auth Links */}
        <nav className="flex items-center gap-4 text-black font-semibold">
          {status === 'authenticated' && (
            <>
              <Link href={'/profile'} className="cursor-pointer whitespace-nowrap">
                Hello, {userName}
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="cursor-pointer bg-primary rounded-full px-6 py-2 text-white "
              >
                Logout
              </button>
            </>
          )}
          {status === 'unauthenticated' && (
            <>
              <Link href="/login" className="cursor-pointer">
                Login
              </Link>
              <Link
                href="/register"
                className="cursor-pointer bg-primary rounded-full px-6 py-2 text-white"
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
