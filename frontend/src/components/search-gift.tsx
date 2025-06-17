"use client";

import React, {useState} from "react";
import {useRouter} from "next/navigation";

export const SearchGift: React.FC = () => {
    const [gift, setGift] = useState<string>("");
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!gift.trim()) return;

        const encoded = encodeURIComponent(gift.trim());
        router.push(`/gifts/${encoded}`);
        setGift("");
    };

    return (
        <form className="flex flex-col gap-3 md:grid md:grid-cols-4" onSubmit={handleSubmit}>
            <label className="text-white md:col-span-4 text-lg md:text-xl lg:text-2xl font-bold mb-1">Search
                gift</label>
            <input
                placeholder="Bag e.g."
                className="placeholder:text-white/50 md:col-span-3 text-white border rounded-lg py-2 px-3 border-neutral-800"
                value={gift}
                onChange={(e) => setGift(e.target.value)}
            />
            <button
                type="submit"
                className="bg-white md:col-span-1 w-full font-bold py-2 px-4 rounded-full hover:opacity-75 transition duration-200">
                Search
            </button>
        </form>
    );
};
