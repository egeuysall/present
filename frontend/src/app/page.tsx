import React from "react"
import Link from "next/link"
import Image from "next/image"

import {SearchGift} from "@/components/search-gift"

const Home: React.FC = () => {
    return (
        <main className="flex flex-col items-center">
            <div className="w-[90vw] md:w-[92.5vw] lg:w-[95vw] py-24 flex flex-col gap-6">
                <section>
                    <h1 className="md:w-3/4 lg:w-2/4 text-white text-2xl md:text-3xl lg:text-4xl font-bold">Present</h1>
                    <p className="md:w-3/4 lg:2/4 text-white">
                        Effortlessly plan and track your gift ideas with secure, full-stack authentication and seamless
                        organization.
                    </p>
                </section>
                <section className="flex flex-col md:grid md:grid-cols-2 gap-3">
                    <Link href="/signup">
                        <button
                            className="bg-white w-full font-bold py-2 px-4 rounded-full hover:opacity-75 transition duration-200">
                            Sign up
                        </button>
                    </Link>
                    <Link href="/login">
                        <button
                            className="bg-white w-full font-bold py-2 px-4 rounded-full hover:opacity-75 transition duration-200">
                            Log in
                        </button>
                    </Link>
                </section>
                <section>
                    <SearchGift/>
                </section>
                <section>
                    <Image
                        src="/code.jpg"
                        width={2048}
                        height={1316}
                        alt="Code image"
                        className="rounded-lg w-full hover:opacity-75 transition duration-200"
                    />
                </section>
            </div>
        </main>
    );
}

export default Home