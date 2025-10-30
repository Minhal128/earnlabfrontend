"use client";
import { X } from "lucide-react";
import { IoMdMail } from "react-icons/io";

export default function ForgotPasswordModal({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) {


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
            <div className="bg-[#1E2133] text-white rounded-xl w-[90%] max-w-md p-10 relative">
                <button
                    onClick={onClose}
                    className="absolute right-3 cursor-pointer bg-[#8C8FA8] top-3 text-black rounded-md p-1"
                >
                    <X size={14} />
                </button>

                {/* Title */}
                <h2 className="text-2xl text-[#E6FAF6] mb-2 font-semibold mt-5 text-center">Forgot Password</h2>
                <p className="text-sm text-[#8C8FA8] text-center mb-6">
                    Enter the email address associated with your account
                </p>



                <div className="relative mb-3">
                    <IoMdMail size={18} className="absolute left-3 top-3 text-[#18C3A7]" />
                    <input
                        type="email"
                        placeholder="Email address"
                        className="w-full pl-10 pr-4 py-3 rounded-md bg-[#26293E] outline-none text-sm"
                    />
                </div>


                <p className="text-sm text-[#18C3A7] cursor-pointer mt-2 mb-4">
                    Existing member?
                </p>

                <button className="w-full py-3 bg-[#18C3A7] cursor-pointer rounded-md font-medium">
                    Request Password Reset
                </button>
            </div>
        </div>
    );
}
