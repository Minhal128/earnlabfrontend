"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Gift, DollarSign, Zap, Shield, Clock, CreditCard, Bitcoin, ShoppingBag, Smartphone } from "lucide-react";

import PaypalImg from "../../../public/assets/paypal.png";
import VisaImg from "../../../public/assets/visa.png";
import BitcoinImg from "../../../public/assets/bit.png";
import AmazonImg from "../../../public/assets/amazon.png";

const payoutMethods = [
    {
        icon: PaypalImg,
        name: "PayPal",
        minWithdraw: "$5",
        processingTime: "Instant",
        fee: "Free",
    },
    {
        icon: VisaImg,
        name: "VISA Card",
        minWithdraw: "$10",
        processingTime: "1-3 days",
        fee: "Free",
    },
    {
        icon: BitcoinImg,
        name: "Bitcoin",
        minWithdraw: "$20",
        processingTime: "Instant",
        fee: "Network fee",
    },
    {
        icon: AmazonImg,
        name: "Amazon Gift Card",
        minWithdraw: "$5",
        processingTime: "Instant",
        fee: "Free",
    },
];

const rewardTypes = [
    {
        icon: <DollarSign className="w-8 h-8" />,
        title: "Cash Rewards",
        description: "Withdraw real money directly to your PayPal, bank account, or crypto wallet.",
        color: "emerald",
    },
    {
        icon: <ShoppingBag className="w-8 h-8" />,
        title: "Gift Cards",
        description: "Redeem your earnings for gift cards from Amazon, Steam, iTunes, and more.",
        color: "purple",
    },
    {
        icon: <Bitcoin className="w-8 h-8" />,
        title: "Cryptocurrency",
        description: "Convert your earnings to Bitcoin, Ethereum, Litecoin, or other crypto.",
        color: "orange",
    },
    {
        icon: <Smartphone className="w-8 h-8" />,
        title: "Mobile Top-up",
        description: "Add credit to your mobile phone directly from your earnings.",
        color: "blue",
    },
];

const features = [
    {
        icon: <Zap className="w-6 h-6" />,
        title: "Instant Payouts",
        description: "Most withdrawals are processed instantly. Get your money when you need it.",
    },
    {
        icon: <Shield className="w-6 h-6" />,
        title: "Secure Transactions",
        description: "All transactions are encrypted and protected with industry-standard security.",
    },
    {
        icon: <Clock className="w-6 h-6" />,
        title: "Low Minimums",
        description: "Start withdrawing from just $5. No need to wait until you earn hundreds.",
    },
    {
        icon: <CreditCard className="w-6 h-6" />,
        title: "No Hidden Fees",
        description: "What you earn is what you get. No hidden charges or surprise deductions.",
    },
];

export default function RewardsInfoPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0A0C1A] via-[#0D0F1E] to-[#0A0C1A] text-white">
            {/* Header */}
            <div className="bg-[#0A0C1A] border-b border-[#2A2D3E] sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center">
                    <div className="flex items-center gap-4">
                        <Link href="/landing" className="p-2 rounded-lg bg-[#1A1D2E] border border-[#2A2D3E] hover:bg-[#252840] transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div className="flex items-center gap-2">
                            <Gift className="w-6 h-6 text-purple-400" />
                            <h1 className="text-xl font-bold">Rewards</h1>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <section className="py-16 px-4 relative overflow-hidden">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"></div>
                </div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
                            <Gift className="w-4 h-4 text-purple-400" />
                            <span className="text-sm font-medium text-purple-400">Multiple Payout Options</span>
                        </div>
                        <h2 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                            Get Paid Your Way
                        </h2>
                        <p className="text-lg text-[#9CA3AF] leading-relaxed">
                            Choose from multiple withdrawal methods. Cash out to PayPal, crypto, 
                            gift cards, or bank transfer. Fast, secure, and hassle-free!
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
                        <div className="text-center p-6 rounded-xl bg-[#1A1D2E] border border-[#2A2D3E]">
                            <div className="text-3xl font-bold text-white mb-1">$5</div>
                            <div className="text-sm text-[#9CA3AF]">Min. Withdrawal</div>
                        </div>
                        <div className="text-center p-6 rounded-xl bg-[#1A1D2E] border border-[#2A2D3E]">
                            <div className="text-3xl font-bold text-white mb-1">10+</div>
                            <div className="text-sm text-[#9CA3AF]">Payout Methods</div>
                        </div>
                        <div className="text-center p-6 rounded-xl bg-[#1A1D2E] border border-[#2A2D3E]">
                            <div className="text-3xl font-bold text-white mb-1">Instant</div>
                            <div className="text-sm text-[#9CA3AF]">Processing</div>
                        </div>
                        <div className="text-center p-6 rounded-xl bg-[#1A1D2E] border border-[#2A2D3E]">
                            <div className="text-3xl font-bold text-white mb-1">$2M+</div>
                            <div className="text-sm text-[#9CA3AF]">Paid Out</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Reward Types */}
            <section className="py-16 px-4 bg-[#0D0F1E]/50">
                <div className="max-w-7xl mx-auto">
                    <h3 className="text-2xl font-bold mb-8 text-center">Ways to Get Paid</h3>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {rewardTypes.map((reward, idx) => (
                            <div key={idx} className="rounded-2xl bg-[#1A1D2E] border border-[#2A2D3E] p-6 hover:border-purple-500/50 transition-all duration-300">
                                <div className={`w-16 h-16 rounded-xl bg-${reward.color}-500/10 flex items-center justify-center mb-4 text-${reward.color}-400`}>
                                    {reward.icon}
                                </div>
                                <h4 className="text-xl font-bold mb-2">{reward.title}</h4>
                                <p className="text-sm text-[#9CA3AF]">{reward.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Payout Methods */}
            <section className="py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <h3 className="text-2xl font-bold mb-8 text-center">Popular Payout Methods</h3>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {payoutMethods.map((method, idx) => (
                            <div key={idx} className="rounded-2xl bg-[#1A1D2E] border border-[#2A2D3E] p-6 hover:border-purple-500/50 transition-all duration-300">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 rounded-lg bg-[#252840] p-2">
                                        <Image src={method.icon} alt={method.name} className="w-full h-full object-contain" />
                                    </div>
                                    <h4 className="text-lg font-bold">{method.name}</h4>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-[#9CA3AF]">Min. Withdraw:</span>
                                        <span className="text-white">{method.minWithdraw}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[#9CA3AF]">Processing:</span>
                                        <span className="text-emerald-400">{method.processingTime}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[#9CA3AF]">Fee:</span>
                                        <span className="text-white">{method.fee}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-16 px-4 bg-[#0D0F1E]/50">
                <div className="max-w-7xl mx-auto">
                    <h3 className="text-2xl font-bold mb-8 text-center">Why Our Rewards Are Better</h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, idx) => (
                            <div key={idx} className="p-6 rounded-xl bg-[#1A1D2E] border border-[#2A2D3E] hover:border-purple-500/50 transition-colors">
                                <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4 text-purple-400">
                                    {feature.icon}
                                </div>
                                <h4 className="font-bold mb-2">{feature.title}</h4>
                                <p className="text-sm text-[#9CA3AF]">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

        </div>
    );
}
