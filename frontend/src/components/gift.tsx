import React from "react";
import Link from "next/link"

interface GiftProps {
    id: string,
    idea: string,
    price: number
}

export const Gift: React.FC<GiftProps> = ({id, idea, price}) => {
    return (
        <li className="flex items-center gap-6 justify-between border border-neutral-800 rounded-lg p-4">
            <section className="flex flex-col">
                <span className="font-bold text-white">{idea}</span>
                <span className="opacity-75 text-white text-sm">${price}</span>
            </section>
            <Link href={`/gifts/${encodeURIComponent(id)}`}>
                <button
                    className="bg-white md:col-span-1 w-full font-bold py-2 px-4 rounded-full hover:opacity-75 transition duration-200">
                    Check
                </button>
            </Link>
        </li>
    );
}