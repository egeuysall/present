"use client";

import React, {useState} from "react";

import {Menu, X} from "lucide-react";
import Link from "next/link";
import {ProfilePhoto} from "./profile-photo"

const desktopNavItems = [
    {label: "Home", href: "/"},
    {label: "Gifts", href: "/gifts"},
    {label: "Login", href: "/login"},
];

const mobileNavItems = [
    {label: "Gifts", href: "/gifts"},
    {label: "Login", href: "/login"},
    {label: "Home", href: "/"},
    {label: "Profile", href: "profile"},
    {label: "Signup", href: "/signup"},
    {label: "Sign out", href: "/signout"},
];

export const Navbar: React.FC = () => {
    const [open, setOpen] = useState(false);

    return (
        <header className="w-full flex justify-center">
            <nav
                className="fixed top-4 w-[90vw] md:w-[92.5vw] lg:w-[95vw] z-10 backdrop-blur-lg bg-black/90 border border-neutral-800 rounded-lg px-4 py-2.5 flex items-center justify-between">
                <Link href="/" className="font-bold text-white">
                    Present
                </Link>

                {/* Desktop nav: only gifts, home, profile */}
                <ul className="hidden md:flex items-center gap-6">
                    {desktopNavItems.map((item) => (
                        <li key={item.href}>
                            <Link href={item.href}
                                  className="text-sm font-semibold text-white hover:opacity-80 transition">
                                {item.label}
                            </Link>
                        </li>
                    ))}
                    <ProfilePhoto/>
                </ul>

                {/* Mobile menu button */}
                <button
                    className="md:hidden text-white"
                    onClick={() => setOpen((prev) => !prev)}
                    aria-label="Toggle menu"
                >
                    {open ? <X size={24}/> : <Menu size={24}/>}
                </button>

                {/* Mobile dropdown with extra items */}
                {open && (
                    <ul className="absolute top-full right-4 mt-2 backdrop-blur-lg bg-black/90 border border-neutral-800 rounded-lg p-4 flex flex-col gap-3 w-48 md:hidden">
                        {mobileNavItems.map((item) => (
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
};
