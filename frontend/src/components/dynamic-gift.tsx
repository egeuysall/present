"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { GiftType } from "@/types/gifts";

interface Props {
    gift: GiftType;
}

const DynamicGift: React.FC<Props> = ({ gift }) => {
    const router = useRouter();
    const [idea, setIdea] = useState(gift.idea);
    const [priceInput, setPriceInput] = useState(gift.price.toFixed(2));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setPriceInput(gift.price.toFixed(2));
    }, [gift.price]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const parsedPrice = parseFloat(priceInput);
        if (isNaN(parsedPrice)) {
            setError("Invalid price");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(
                `https://presentapi.egeuysal.com/${encodeURIComponent(gift.id)}`,
                {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ idea, price: parsedPrice }),
                }
            );

            if (!res.ok) {
                const data = await res.json().catch(() => null);
                const message =
                    data?.error || data?.message || "Failed to save changes.";
                setError(message);
                setLoading(false);
                return;
            }

            setLoading(false);
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("An unexpected error occurred");
            }
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(
                `https://presentapi.egeuysal.com/${encodeURIComponent(gift.id)}`,
                {
                    method: "DELETE",
                    credentials: "include",
                }
            );

            if (!res.ok) {
                const data = await res.json().catch(() => null);
                const message =
                    data?.error || data?.message || "Failed to delete gift.";
                setError(message);
                setLoading(false);
                return;
            }

            setLoading(false);
            await new Promise((r) => setTimeout(r, 3000));
            router.push("/gifts");
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                console.error("An unknown error occurred");
                setError("Something went wrong.");
            }
            setLoading(false);
        }
    };

    const handlePriceBlur = () => {
        const parsed = parseFloat(priceInput);
        if (!isNaN(parsed)) setPriceInput(parsed.toFixed(2));
    };

    return (
        <main className="flex flex-col items-center">
            <div className="w-[90vw] md:w-[92.5vw] lg:w-[95vw] py-24 flex flex-col gap-6">
                <section>
                    <h2 className="text-white text-xl md:text-2xl lg:text-3xl font-bold">
                        Gift Details
                    </h2>
                    <p className="opacity-75 text-white text-sm">ID: {gift.id}</p>
                </section>

                <form
                    className="flex flex-col md:grid md:grid-cols-2 gap-6"
                    onSubmit={handleSubmit}
                >
                    <section>
                        <label htmlFor="idea" className="text-white font-semibold">
                            Idea
                        </label>
                        <input
                            id="idea"
                            type="text"
                            value={idea}
                            onChange={(e) => setIdea(e.target.value)}
                            className="text-white focus:outline-none bg-transparent w-full"
                            required
                        />
                    </section>

                    <section>
                        <label htmlFor="price" className="text-white font-semibold">
                            Price
                        </label>
                        <div className="text-white flex items-center">
                            <p>$</p>
                            <input
                                id="price"
                                type="text"
                                inputMode="decimal"
                                value={priceInput}
                                onChange={(e) => setPriceInput(e.target.value)}
                                onBlur={handlePriceBlur}
                                className="text-white focus:outline-none bg-transparent w-full"
                                required
                            />
                        </div>
                    </section>

                    {error && (
                        <p className="text-red-500 md:col-span-2" role="alert">
                            {error}
                        </p>
                    )}

                    <div className="flex gap-3 md:col-span-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-white w-full font-bold py-2 px-4 rounded-full hover:opacity-75 transition duration-200"
                        >
                            {loading ? "Saving..." : "Save"}
                        </button>

                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={loading}
                            className="bg-white w-full font-bold py-2 px-4 rounded-full hover:opacity-75 transition duration-200"
                        >
                            {loading ? "Processing..." : "Delete"}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
};

export default DynamicGift;
