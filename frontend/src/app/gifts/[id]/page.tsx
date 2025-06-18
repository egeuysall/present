import React from "react";
// import {notFound} from "next/navigation";
import {cookies} from "next/headers";
import DynamicGift from "@/components/dynamic-gift";

type GiftType = {
    id: string;
    idea: string;
    price: number;
};

interface DynamicGiftProps {
    params: Promise<{ id: string }>;
}

const DynamicPage: React.FC<DynamicGiftProps> = async ({ params }) => {
    const { id } = await params;

    const cookieStore = await cookies()
    const accessToken = cookieStore.get('access_token')

    if (accessToken?.value) {
        cookieStore.set({
            name: 'access_token',
            value: accessToken?.value,
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            path: `/gifts/${id}`
        })
    }

    try {
        const res = await fetch(
            `https://presentapi.egeuysal.com/v1/gifts/${encodeURIComponent(id)}`);

        if (!res.ok) {
            const text = await res.text();
            console.error("Failed to fetch gift", {
                id,
                status: res.status,
                statusText: res.statusText,
                responseText: text,
            });
            // notFound();
        }

        const json = await res.json();
        const gift: GiftType = json.data;

        return <DynamicGift gift={gift} />;
    } catch (err) {
        console.error("Unexpected error during fetch", err);
        // notFound();
    }
};

export default DynamicPage;