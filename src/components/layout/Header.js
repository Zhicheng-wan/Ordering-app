import Link from 'next/link';


export default function Header() {
    return (
        <>
            <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm px-4">
            <div className="max-w-screen-xl mx-auto flex items-center justify-between py-4">
                <Link href="/" className="text-red-600 font-semibold text-2xl">
                POP MART
                </Link>
                <nav className="flex items-center gap-8 text-black font-semibold">
                <Link href="/">Home</Link>
                <Link href="/">Products</Link>
                <Link href="/">About</Link>
                <Link href="/">Contact</Link>
                <Link href="/" className="bg-primary rounded-full px-6 py-2 text-white">
                    Login
                </Link>
                </nav>
            </div>
            </header>
        </>
    )

}
