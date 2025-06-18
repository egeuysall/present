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

const DynamicPage: React.FC<DynamicGiftProps> = async ({params}) => {
    const {id} = await params;

    // Get cookies from the incoming request
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();

    const cookieHeader = allCookies
        .map(({name, value}) => `${name}=${value}`)
        .join("; ");

    const res = await fetch(
        `http://localhost:8080/v1/gifts/${encodeURIComponent(id)}`,
        {
            headers: {
                cookie: cookieHeader,
            },
        }
    );

    if (!res.ok) {
        console.error(`Fetch failed with status ${res.status} ${res.statusText}`);
        notFound();
    }

    const json = await res.json();
    const gift: GiftType = json.data;

    return <DynamicGift gift={gift}/>;
};

export default DynamicPage;
