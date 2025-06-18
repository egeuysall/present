import React from "react";
// import { notFound } from "next/navigation";
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
    try {
        console.log("[DynamicPage] Awaiting params...");
        const { id } = await params;
        console.log("[DynamicPage] Received id:", id);

        console.log("[DynamicPage] Getting cookies...");
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("access_token");
        console.log("[DynamicPage] access_token from cookies:", accessToken?.value ?? "None");

        if (accessToken?.value) {
            console.log("[DynamicPage] Resetting access_token cookie with secure attributes and path...");
            cookieStore.set({
                name: "access_token",
                value: accessToken.value,
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                path: `/gifts/${id}`,
            });
            console.log("[DynamicPage] Cookie set successfully.");
        } else {
            console.log("[DynamicPage] No access_token cookie found, skipping set.");
        }

        console.log(`[DynamicPage] Fetching gift data from API for id: ${id}`);
        const res = await fetch(`https://presentapi.egeuysal.com/v1/gifts/${encodeURIComponent(id)}`);

        console.log("[DynamicPage] Fetch response status:", res.status, res.statusText);

        if (!res.ok) {
            const text = await res.text();
            console.error("[DynamicPage] Failed to fetch gift:", {
                id,
                status: res.status,
                statusText: res.statusText,
                responseText: text,
            });
            // notFound();
            return <div>Error: Could not fetch gift data.</div>;
        }

        const json = await res.json();
        console.log("[DynamicPage] Response JSON:", json);

        const gift: GiftType = json.data;
        console.log("[DynamicPage] Gift data parsed:", gift);

        return <DynamicGift gift={gift} />;
    } catch (err) {
        console.error("[DynamicPage] Unexpected error during fetch or rendering:", err);
        // notFound();
        return <div>Error: Unexpected error occurred.</div>;
    }
};

export default DynamicPage;
