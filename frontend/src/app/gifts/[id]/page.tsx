import React from "react";
import {notFound} from "next/navigation";
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
    let gift: GiftType | null = null;

    const cookieStore = await cookies()
    const accessToken = cookieStore.get('access_token')

    if (accessToken?.value) {
        cookieStore.set({
            name: 'access_token',
            value: accessToken?.value,
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            path: `/`
        })
    }

    try {
        const res = await fetch(
            `https://presentapi.egeuysal.com/v1/gifts/${encodeURIComponent(id)}`,
            {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                }
            });

        if (!res.ok) {
            const text = await res.text();
            console.error("Failed to fetch gift", {
                id,
                status: res.status,
                statusText: res.statusText,
                responseText: text,
            });
        }

        const json = await res.json();
        gift = json.data;

    } catch (error) {
        console.error("Unexpected error during fetch", error);
        notFound();
    }

    if (!gift) {
        notFound()
    }

    return <DynamicGift gift={gift} />;
};

export default DynamicPage;