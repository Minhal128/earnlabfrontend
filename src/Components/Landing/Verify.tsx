
"use client";

import React from "react";
import Image from "next/image";

import BgImg from "../../../public/assets/bg.png";
import LockImg from "../../../public/assets/locak.png";

type VerifyProps = {
    height?: string;
};

const Verify: React.FC<VerifyProps> = () => {
    return (
        <div className="md:min-h-screen h-[600px] flex items-center justify-center mt-10 md:mt-0 bg-[#083136] px-4">
            <div
                className={`relative w-full max-w-4xl md:h-[500px] rounded-xl overflow-hidden`}
            >
                {/* Background Image */}
                <div className="absolute inset-0">
                    <Image
                        src={BgImg}
                        alt="Background"
                        fill
                        className="object-cover"
                    />
                </div>

                {/* Content */}
                <div className="relative text-center px-6 py-12 rounded-xl">
                    <h2 className="text-2xl md:text-4xl pt-6 font-semibold text-[#0D0F1E]">
                        Verify Your Email To Unlock <br /> $0.25 + 3 Freeboxes
                    </h2>
                    <p className="text-[#3A3E57] md:px-52 mt-5 text-sm font-semibold md:text-lg">
                        Sign up today, confirm your email, and instantly receive $0.25 cash
                        plus 3 Free boxes with exciting reward probabilities.
                    </p>

                    <button className="mt-7 px-14 py-3 cursor-pointer rounded-full bg-gradient-to-t from-[#0B816D] to-[#18C3A7] text-white font-semibold shadow-md transition">
                        Claim my Bonus
                    </button>

                    <div className="flex items-center pt-4 justify-center font-semibold gap-2 mt-4 text-[#151728] text-md">
                        <span className="">
                            <Image
                                src={LockImg}
                                alt="Lock Image"
                                width={30}
                                height={20}
                                className="object-contain"
                            />
                        </span>
                        Secure sign-ups – No hidden fees
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Verify;
