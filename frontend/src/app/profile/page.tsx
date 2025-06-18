"use client"

import React, {useEffect, useState} from "react";
import Error from "next/error";

interface UserData {
    id: string;
    email: string;
}

interface ApiResponse {
    data: UserData;
}

const Profile: React.FC = () => {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                const response = await fetch('https://presentapi.egeuysal.com/v1/me', {
                    credentials: "include",
                });

                const result: ApiResponse = await response.json();
                setUserData(result.data);
                setError(null);
            } catch (error: unknown) {
                if (error instanceof Error) {
                    const err = error as Error & { message: string };
                    setError(err.message);
                } else {
                    setError('An error occurred');
                }
                setUserData(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    if (loading) {
        return (
            <main className="flex flex-col items-center">
                <div className="w-[90vw] md:w-[92.5vw] lg:w-[95vw] py-24 flex flex-col gap-6">
                    <section className="flex flex-col gap-3">
                        <h2 className="md:w-3/4 lg:w-2/4 text-white text-xl md:text-2xl lg:text-3xl font-bold">Profile</h2>
                        <div className="rounded-lg border border-neutral-800 py-3 px-4 flex flex-col gap-3">
                            <p className="text-white">Loading...</p>
                        </div>
                    </section>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="flex flex-col items-center">
                <div className="w-[90vw] md:w-[92.5vw] lg:w-[95vw] py-24 flex flex-col gap-6">
                    <section className="flex flex-col gap-3">
                        <h2 className="md:w-3/4 lg:w-2/4 text-white text-xl md:text-2xl lg:text-3xl font-bold">Profile</h2>
                        <div className="rounded-lg border border-red-800 py-3 px-4 flex flex-col gap-3">
                            <p className="text-red-400">Error: {error}</p>
                        </div>
                    </section>
                </div>
            </main>
        );
    }

    return (
        <main className="flex flex-col items-center">
            <div className="w-[90vw] md:w-[92.5vw] lg:w-[95vw] py-24 flex flex-col gap-6">
                <section className="flex flex-col gap-3">
                    <h1 className="md:w-3/4 lg:w-2/4 text-white text-xl md:text-2xl lg:text-3xl font-bold">Profile</h1>
                    <div className="rounded-lg border border-neutral-800 py-3 px-4 flex flex-col gap-3">
                        <p className="md:w-3/4 lg:w-2/4 text-white">
                            <span className="font-bold">ID: </span>
                            {userData?.id}
                        </p>
                        <hr className="border-neutral-800"/>
                        <p className="md:w-3/4 lg:w-2/4 text-white">
                            <span className="font-bold">Email: </span>
                            {userData?.email}
                        </p>
                    </div>
                </section>
            </div>
        </main>
    );
};

export default Profile;