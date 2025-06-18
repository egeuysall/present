import {notFound} from "next/navigation";
import DynamicGift from "@/components/dynamic-gift";

type GiftType = {
    id: string;
    idea: string;
    price: number;
};

interface DynamicGiftProps {
    params: {
        id: string;
    };
}

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

// Async server component, no React.FC typing needed
export default async function DynamicPage({ params }: DynamicGiftProps) {
    const { id } = params;

    try {
        const res = await fetch(
            `https://presentapi.egeuysal.com/v1/gifts/${encodeURIComponent(id)}`
        );

        if (!res.ok) {
            const text = await res.text();
            console.error("Failed to fetch gift", {
                id,
                status: res.status,
                statusText: res.statusText,
                responseText: text,
            });
            notFound();
        }

        const json = await res.json();
        const gift: GiftType = json.data;

        return <DynamicGift gift={gift} />;
    } catch (err) {
        console.error("Unexpected error during fetch", err);
        notFound();
    }
}
