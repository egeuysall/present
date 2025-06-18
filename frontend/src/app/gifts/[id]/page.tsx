// app/gifts/[id]/page.tsx

export const dynamic = "force-dynamic"; // Ensure dynamic rendering

import React from "react";
import {notFound} from "next/navigation";
import {cookies} from "next/headers";
import DynamicGift from "@/components/dynamic-gift";

type GiftType = {
    id: string;
    idea: string;
    price: number;
};

const DynamicPage = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;

    // Read access_token cookie from the request
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
        console.error("No token found in cookies");
        return notFound();
    }

    try {
        const res = await fetch(`https://presentapi.egeuysal.com/v1/gifts/${encodeURIComponent(id)}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Cookie: `access_token=${token}`, // Inject token manually
            },
            cache: "no-store", // Optional: ensure fresh data
        });

        if (!res.ok) {
            console.error("Failed to fetch gift", {
                status: res.status,
                statusText: res.statusText,
            });
            return notFound();
        }

        const json = await res.json();
        const gift: GiftType = json.data;

        return <DynamicGift gift={gift} />;
    } catch (err) {
        console.error("Failed to load gift:", err);
        return notFound();
    }
};

export default DynamicPage;
