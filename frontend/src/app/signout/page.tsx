"use client";

import React, {useState} from "react";
import {useRouter} from "next/navigation";
import {ArrowLeft, LogOut} from "lucide-react";
import Link from "next/link";

const SignOut: React.FC = () => {
    const [isSigningOut, setIsSigningOut] = useState<boolean>(false);
    const router = useRouter();

    const handleSignOut = async () => {
        setIsSigningOut(true);

        try {
            const response = await fetch("https://presentapi.egeuysal.com/v1/signout", {
                method: "POST",
                credentials: "include",
            });

            if (response.ok) {
                router.push("/");
                router.refresh();
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                const err = error as Error & { message: string };
                console.error(`Error: ${err.message}`);
            } else if (typeof error === 'string') {
                console.error(`Error: ${error}`);
            } else {
                console.error('An unknown error occurred');
            }
        } finally {
            setIsSigningOut(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div
                    className="rounded-xl backdrop-blur-md bg-white/10 border border-white/20 shadow-xl p-8 text-center">
                    <div className="mb-6">
                        <LogOut className="w-8 h-8 text-white mx-auto mb-4"/>
                        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white">Sign Out</h2>
                        <p className="text-gray-300">Are you sure you want to sign out?</p>
                    </div>

                    <div className="flex gap-3">
                        <Link
                            href="/"
                            className="flex items-center justify-center gap-2 bg-white text-black w-full font-bold py-2 px-4 rounded-full hover:opacity-75 transition duration-200"
                        >
                            <ArrowLeft size={20}/>
                            Cancel
                        </Link>

                        <button
                            onClick={handleSignOut}
                            disabled={isSigningOut}
                            className="flex items-center justify-center gap-2 bg-white text-black w-full font-bold py-2 px-4 rounded-full hover:opacity-75 transition duration-200 disabled:opacity-50"
                        >
                            <LogOut size={20}/>
                            {isSigningOut ? "Signing out..." : "Sign Out"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignOut;
