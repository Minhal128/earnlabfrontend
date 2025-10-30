"use client";
import React from "react";
import Image from "next/image";
import BoxImg from '../../../public/assets/rewardsModal.png'
import { IoMdClose } from "react-icons/io";

type RewardModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

const RewardModal: React.FC<RewardModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60">
            <div className="bg-[#1B1E2B] text-center rounded-xl shadow-lg w-[90%] max-w-md relative px-9 py-6">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 p-0.5 rounded-md text-gray-400 bg-white cursor-pointer text-xl"
                >
                    <IoMdClose size={16} />
                </button>

                {/* Heading */}
                <h2 className="text-white md:text-2xl text-xl font-bold mt-5 mb-2">You’ve Unlocked a Reward!</h2>
                <p className="text-[#8C8FA8] md:text-sm text-xs mb-5">
                    Your Free Box has revealed a special prize. Keep opening the
                    remaining boxes to see what else you’ve won.
                </p>

                {/* Reward Image */}
                <div className="flex justify-center mb-5">
                    <Image
                        src={BoxImg}
                        alt="Reward Box"
                        width={380}
                        height={220}
                        className="rounded-lg"
                    />
                </div>

                {/* Action Button */}
                <button
                    onClick={onClose}
                    className="w-full py-3 bg-[#18C3A7] text-white font-semibold rounded-lg transition hover:bg-[#0fb197]"
                >
                    Open next box
                </button>
            </div>
        </div>
    );
};

export default RewardModal;
