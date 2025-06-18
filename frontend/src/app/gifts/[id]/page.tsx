import {notFound} from "next/navigation";

type GiftType = {
    id: string;
    idea: string;
    price: number;
};

export async function generateStaticParams() {
    try {
        const res = await fetch(`https://presentapi.egeuysal.com/v1/gifts`);

        if (!res.ok) {
            console.error("Failed to fetch gifts");
            notFound();
        }

        const json = await res.json();
        const gifts: GiftType[] = json.data;

        return gifts.map((gift) => ({
            id: gift.id,
        }));
    } catch (err) {
        console.error("Unexpected error during fetch", err);
        notFound();
    }
}
