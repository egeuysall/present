export const dynamic = "force-dynamic";

import React from "react";
import {notFound} from "next/navigation";
import {cookies} from "next/headers";
import DynamicGift from "@/components/dynamic-gift";

type GiftType = {
    id: string;
    idea: string;
    price: number;
};

const DynamicPage = async ({ params }: { params: { id: string } }) => {
    const { id } = params;
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) return notFound();

    try {
        const res = await fetch(`https://presentapi.egeuysal.com/v1/gifts/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Cookie: `access_token=${token}`,
            },
        });

        if (res.status === 404) return notFound();

        const json = await res.json();
        const gift: GiftType = json.data;

        return <DynamicGift gift={gift} />;
    } catch (err) {
        console.error("Failed to load gift:", err);
        return notFound();
    }
};

export default DynamicPage;
