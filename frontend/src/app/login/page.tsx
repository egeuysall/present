"use client";

import React, {useState} from "react";

const Login: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        setIsSubmitting(true);

        try {
            const response = await fetch("http://localhost:8080/v1/login", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                credentials: "include",
                body: JSON.stringify({email, password}),
            });

            const json = await response.json();

            if (!response.ok) throw new Error(json.error || "Login failed.");

            setSuccessMessage(json.data || "Login successful!");
            setEmail("");
            setPassword("");
            // Optionally redirect or update UI after login here
        } catch (err: any) {
            setError(err.message || "Login failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="flex flex-col items-center px-4">
            <div className="w-[90vw] md:w-[92.5vw] lg:w-[95vw] py-24">
                <section className="flex flex-col gap-3 mb-8">
                    <h2 className="text-xl md:text-2xl lg:text-3xl text-white font-bold">Log in</h2>
                    <p className="text-white">Enter your credentials to access your account.</p>
                </section>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="email"
                        placeholder="Email"
                        required
                        autoComplete="email"
                        className="placeholder:text-white/50 md:col-span-1 text-white border rounded-lg py-2 px-3 border-neutral-800 bg-transparent focus:outline-none focus:ring-2 focus:ring-white"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        required
                        minLength={6}
                        autoComplete="current-password"
                        className="placeholder:text-white/50 md:col-span-1 text-white border rounded-lg py-2 px-3 border-neutral-800 bg-transparent focus:outline-none focus:ring-2 focus:ring-white"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {error && (
                        <p className="text-red-400 text-sm font-medium md:col-span-3" role="alert">
                            {error}
                        </p>
                    )}

                    {successMessage && (
                        <p className="text-green-400 text-sm font-medium md:col-span-3" role="status">
                            {successMessage}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-white w-full font-bold py-2 px-4 rounded-full hover:opacity-75 transition duration-200 text-black disabled:opacity-60 md:col-span-3"
                    >
                        {isSubmitting ? "Logging in..." : "Log In"}
                    </button>
                </form>
            </div>
        </main>
    );
};

export default Login;
