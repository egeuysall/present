"use client";

import {Menu, X} from "lucide-react";
import {useState} from "react";
import Link from "next/link";

const navItems = [
    {label: "Gifts", href: "/gifts"},
    {label: "Login", href: "/login"},
    {label: "Home", href: "/"},
    {label: "Signup", href: "/signup"},
    {label: "Signout", href: "/signout"},
];

export default function Navbar() {
    const [open, setOpen] = useState(false);

    return (
        <header className="w-full flex justify-center">
            <nav
                className="fixed top-4 w-[90vw] md:w-[92.5vw] lg:w-[95vw] z-50 backdrop-blur-lg bg-black/90 border border-neutral-800 rounded-lg px-4 py-3 flex items-center justify-between">
                <Link href="/" className="text-xl font-bold text-white">
                    Present
                </Link>

                {/* Desktop nav */}
                <ul className="hidden md:flex gap-6">
                    {navItems.map((item) => (
                        <li key={item.href}>
                            <Link
                                href={item.href}
                                className="text-sm font-semibold text-white hover:opacity-80 transition"
                            >
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* Mobile menu button */}
                <button
                    className="md:hidden text-white"
                    onClick={() => setOpen((prev) => !prev)}
                    aria-label="Toggle menu"
                >
                    {open ? <X size={24}/> : <Menu size={24}/>}
                </button>

                {/* Mobile dropdown */}
                {open && (
                    <ul className="absolute top-full right-4 mt-2 backdrop-blur-lg bg-black/90 border border-neutral-800 rounded-lg p-4 flex flex-col gap-3 w-48 md:hidden">
                        {navItems.map((item) => (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className="text-sm font-semibold text-white hover:opacity-80 transition"
                                    onClick={() => setOpen(false)}
                                >
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </nav>
        </header>
    );
}
