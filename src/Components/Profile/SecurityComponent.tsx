"use client";
import { useState } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import SaveImg from '../../../public/assets/save.png'
import QrImg from '../../../public/assets/qr.png'

const SecurityComponent = () => {
    const [enabled, setEnabled] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [otp, setOtp] = useState<string[]>(Array(6).fill(""));

    const handleToggle = () => {
        setEnabled(!enabled);
        if (!enabled) {
            setShowModal(true);
        }
    };

    const handleChange = (value: string, index: number) => {
        if (/^\d?$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            if (value && index < 5) {
                const nextInput = document.getElementById(`otp-${index + 1}`);
                nextInput?.focus();
            }
        }
    };

    return (
        <div className="w-full h-96">
            <div className="flex items-center justify-between">
                <span className="text-gray-200 text-sm md:text-base font-medium">
                    Two-factor Authentication
                </span>

                <button
                    onClick={handleToggle}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${enabled ? "bg-teal-500" : "bg-gray-500"
                        }`}
                >
                    <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${enabled ? "translate-x-6" : "translate-x-1"
                            }`}
                    />
                </button>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="bg-[#1C2436] rounded-lg px-8 py-6 w-[90%] max-w-md shadow-xl relative">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 bg-[#8C8FA8] rounded-md cursor-pointer right-4 text-gray-400 hover:text-white"
                        >
                            <X size={22} className="text-[#26293E]" />
                        </button>

                
                        <h2 className="md:text-2xl text-lg font-bold mt-10 text-center text-white mb-4">
                            Enable Two-Factor Authentication
                        </h2>

                        <div className="flex justify-center mb-4">
                            <Image
                                src={QrImg}
                                alt="Auth Icon"
                                width={180}
                                height={80}
                                className="object-contain"
                            />
                        </div>

                        <div className="flex items-center justify-center gap-1 mb-6">
                            <p className="text-[#8C8FA8] text-center text-sm">
                                Scan the QR code with your authenticator app to set up two-factor authentication
                            </p>
                            <Image src={SaveImg} alt="Auth Icon" width={20} height={20} className="object-contain" />
                        </div>

                        <div className="flex justify-center gap-2 mb-6">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    id={`otp-${index}`}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(e.target.value, index)}
                                    className="w-12 h-12 text-center text-lg font-semibold rounded-md bg-[#2A334A] text-white focus:outline-none focus:border-teal-400"
                                />
                            ))}
                        </div>

                        <button
                            onClick={() => setShowModal(false)}
                            className="w-full py-4 cursor-pointer rounded-md bg-[#099F86] text-white font-medium transition"
                        >
                            Complete
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SecurityComponent;
