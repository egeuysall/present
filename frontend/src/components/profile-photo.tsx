"use client";

import React, {useEffect, useRef, useState} from "react";
import Link from "next/link";
import {BadgePlus, LogOut, User} from "lucide-react";

export const ProfilePhoto: React.FC = () => {
    const [photoLetter, setPhotoLetter] = useState<string>("");
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("https://presentapi.egeuysal.com/v1/me", {
                    credentials: "include",
                });

                if (response.ok) {
                    const data = await response.json();
                    const email: string = data.data.email;
                    if (email) {
                        setPhotoLetter(email.charAt(0).toUpperCase());
                    }
                }
            } catch (error: unknown) {
                if (error instanceof Error) {
                    const err = error as Error & { message: string };
                    console.error(`Error: ${err.message}`);
                } else if (typeof error === 'string') {
                    console.error(`Error: ${error}`);
                } else {
                    console.error('An unknown error occurred');
                }
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            <div
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="w-9 h-9 rounded-full flex items-center contrast-75 justify-center border border-neutral-800 bg-black text-white font-bold cursor-pointer hover:bg-neutral-900 transition"
            >
                {photoLetter || "U"}
            </div>

            {isMenuOpen && (
                <div
                    className="absolute right-0 top-12 w-40 rounded-lg bg-black/75 border border-neutral-800 backdrop-blur-lg overflow-hidden">
                    <Link
                        href="/profile"
                        className="w-full px-4 py-3 text-white hover:bg-white/10 transition-colors flex items-center gap-3"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        <User size={16}/>
                        Profile
                    </Link>

                    <Link
                        href="/signup"
                        className="w-full px-4 py-3 text-white hover:bg-white/10 transition-colors flex items-center gap-3"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        <BadgePlus size={16}/>
                        Signup
                    </Link>

                    <div className="h-px bg-white/20"/>

                    <Link
                        href="/signout"
                        className="w-full px-4 py-3 text-white hover:bg-white/10 transition-colors flex items-center gap-3"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        <LogOut size={16}/>
                        Sign out
                    </Link>
                </div>
            )}
        </div>
    );
};
