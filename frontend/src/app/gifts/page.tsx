"use client";

import React, {useEffect, useState} from "react";
import {Gift} from "@/components/gift"

const Gifts: React.FC = () => {
    const [gifts, setGifts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGifts = async () => {
            try {
                const res = await fetch("http://localhost:8080/v1/gifts", {
                    credentials: "include",
                });

                const json = await res.json();

                if (!res.ok) {
                    throw new Error(json.error || "Failed to fetch gifts");
                }

                if (Array.isArray(json.data)) {
                    setGifts(json.data);
                } else {
                    setGifts([]);
                }

            } catch (error) {
                console.error(`Error: ${error}`)
            } finally {
                setLoading(false);
            }
        };
        fetchGifts();
    }, []);

    return (
        <main className="flex flex-col items-center">
            <div className="w-[90vw] md:w-[92.5vw] lg:w-[95vw] py-24 flex flex-col gap-6">
                <section>
                    <h2 className="md:w-3/4 lg:w-2/4 text-white text-xl md:text-2xl lg:text-3xl font-bold">
                        Gift Ideas
                    </h2>
                </section>

                {loading ? (
                    <p className="text-white">Loading...</p>
                ) : (
                    <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {gifts.map((gift, index) => (
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
