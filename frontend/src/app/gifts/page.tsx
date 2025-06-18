"use client";

import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {Gift} from "@/components/gift";

const Gifts: React.FC = () => {
    const [gifts, setGifts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [idea, setIdea] = useState("");
    const [price, setPrice] = useState("");

    const router = useRouter();

    const fetchGifts = async () => {
        try {
            const res = await fetch("http://localhost:8080/v1/gifts", {
                credentials: "include",
            });

            const json = await res.json();

            if (!res.ok) throw new Error(json.error || "Failed to fetch gifts");

            setGifts(Array.isArray(json.data) ? json.data : []);
        } catch (error: any) {
            console.error(`Error: ${error.message}`);
            setError(error.message);
        } finally {
            setLoading(false);
            router.refresh();
        }
    };

    useEffect(() => {
        fetchGifts();
    }, []);

    const handleCreateGift = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const formattedPrice = parseFloat(price).toFixed(2);

            const res = await fetch("http://localhost:8080/v1/gifts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    idea,
                    price: parseFloat(formattedPrice),
                }),
            });

            const json = await res.json();

            if (!res.ok) throw new Error(json.error || "Failed to create gift");

            setIdea("");
            setPrice("");
            fetchGifts();
        } catch (error: any) {
            console.error(`Error: ${error.message}`);
            setError(error.message);
        }
    };

    return (
        <main className="flex flex-col items-center">
            <div className="w-[90vw] md:w-[92.5vw] lg:w-[95vw] py-24 flex flex-col gap-6">

                <section className="space-y-4">
                    <h2 className="text-white text-xl md:text-2xl lg:text-3xl font-bold">
                        Create Gift
                    </h2>
                    <form onSubmit={handleCreateGift} className="grid gap-4 md:grid-cols-2">
                        <input
                            type="text"
                            placeholder="Idea"
                            value={idea}
                            onChange={(e) => setIdea(e.target.value)}
                            required
                            className="placeholder:text-white/50 text-white border rounded-lg py-2 px-3 border-neutral-800 bg-transparent"
                        />
                        <input
                            type="number"
                            step="1"
                            placeholder="Price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                            className="placeholder:text-white/50 text-white border rounded-lg py-2 px-3 border-neutral-800 bg-transparent"
                        />
                        <button
                            type="submit"
                            className="bg-white md:col-span-2 w-full font-bold py-2 px-4 rounded-full hover:opacity-75 transition duration-200"
                        >
                            Create
                        </button>
                    </form>
                </section>

                <section>
                    <h2 className="text-white text-xl md:text-2xl lg:text-3xl font-bold">
                        Gift Ideas
                    </h2>
                </section>

                {loading ? (
                    <p className="text-white">Loading...</p>
                ) : error ? (
                    <div className="rounded-lg border border-red-800 py-3 px-4 flex flex-col gap-3">
                        <p className="text-red-400">Error: {error}</p>
                    </div>
                ) : (
                    <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {gifts.map((gift) => (
                            <Gift
                                key={gift.id}
                                id={gift.id}
                                idea={gift.idea}
                                price={gift.price}
                            />
                        ))}
                    </ul>
                )}
            </div>
        </main>
    );
};

export default Gifts;
