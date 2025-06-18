"use client";

import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";

type GiftType = {
    id: string;
    idea: string;
    price: number;
};

interface Props {
    gift: GiftType;
}

const DynamicGift: React.FC<Props> = ({gift}) => {
    const router = useRouter();
    const [idea, setIdea] = useState(gift.idea);
    const [price, setPrice] = useState(gift.price);
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

        try {
            const parsedPrice = parseFloat(priceInput);
            if (isNaN(parsedPrice)) throw new Error("Invalid price");

            const res = await fetch(`http://localhost:8080/v1/gifts/${encodeURIComponent(gift.id)}`, {
                method: "PATCH",
                headers: {"Content-Type": "application/json"},
                credentials: "include",
                body: JSON.stringify({idea, price: parsedPrice}),
            });

            if (!res.ok) throw new Error(`Failed to update: ${res.statusText}`);

            setPrice(parsedPrice);
            setLoading(false);
        } catch (error: any) {
            setError(error.message);
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`http://localhost:8080/v1/gifts/${encodeURIComponent(gift.id)}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (!res.ok) throw new Error(`Failed to delete: ${res.statusText}`);

            await delay(3000);
            router.push("/gifts");
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <main className="flex flex-col items-center">
            <div className="w-[90vw] md:w-[92.5vw] lg:w-[95vw] py-24 flex flex-col gap-6">
                <section>
                    <h2 className="text-white text-xl md:text-2xl lg:text-3xl font-bold">
                        Gift Details
                    </h2>
                    <p className="opacity-75 text-white text-sm">
                        ID: {gift.id}
                    </p>
                </section>

                <form className="flex flex-col md:grid md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
                    <section>
                        <label className="text-white font-semibold" htmlFor="idea">
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
                        <label className="text-white font-semibold" htmlFor="price">
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
                                onBlur={() => {
                                    const parsed = parseFloat(priceInput);
                                    if (!isNaN(parsed)) {
                                        setPrice(parsed);
                                        setPriceInput(parsed.toFixed(2));
                                    }
                                }}
                                className="text-white focus:outline-none bg-transparent w-full"
                                required
                            />
                        </div>
                    </section>

                    {error && <p className="text-red-500">{error}</p>}

                    <div className="flex gap-3 md:col-span-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-white md:col-span-1 w-full font-bold py-2 px-4 rounded-full hover:opacity-75 transition duration-200"
                        >
                            {loading ? "Saving..." : "Save"}
                        </button>

                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={loading}
                            className="bg-white md:col-span-1 w-full font-bold py-2 px-4 rounded-full hover:opacity-75 transition duration-200"
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
