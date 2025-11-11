"use client";

import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { Loader2 } from "lucide-react";

interface Transaction {
    _id: string;
    type: string;
    amount: number;
    newBalance?: number;
    description?: string;
    createdAt: string;
    status?: string;
}

const TransactionDashboard: React.FC = () => {
    const [currentTab, setCurrentTab] = useState<string>("Main");
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchTransactions = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("token");
                const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

                // Fetch completed tasks
                const tasksResponse = await fetch(`${api}/api/v1/tasks?status=completed&limit=100`, {
                    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
                });
                const tasksData = await tasksResponse.json();

                // Fetch Giftbit transactions
                const giftbitResponse = await fetch(`${api}/api/v1/giftbit/transactions`, {
                    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
                });
                const giftbitData = await giftbitResponse.json();
                
                // Debug: Log first transaction to see structure
                if (giftbitData?.transactions?.[0]) {
                    console.log('Sample Giftbit transaction:', giftbitData.transactions[0]);
                }

                // Combine all transactions
                const allTransactions: Transaction[] = [];

                // Add completed tasks
                if (tasksData && Array.isArray(tasksData.tasks)) {
                    tasksData.tasks.forEach((task: any) => {
                        // Calculate amount safely
                        const rewardValue = task.rewardCents || task.reward || 0;
                        const calculatedAmount = typeof rewardValue === 'number' ? rewardValue / 100 : 0;
                        
                        allTransactions.push({
                            _id: task._id || task.id || `task-${Date.now()}-${Math.random()}`,
                            type: 'Task Completed',
                            amount: calculatedAmount,
                            description: task.title || task.name || 'Task',
                            createdAt: task.completedAt || task.createdAt,
                            status: task.status,
                        });
                    });
                }

                // Add Giftbit transactions
                if (giftbitData && giftbitData.success && Array.isArray(giftbitData.transactions)) {
                    giftbitData.transactions.forEach((tx: any) => {
                        // Calculate amount safely - Giftbit amounts are already in dollars, not cents
                        const amountValue = tx.amount || tx.amountCents || tx.value || 0;
                        const calculatedAmount = typeof amountValue === 'number' ? -amountValue : 0;
                        
                        allTransactions.push({
                            _id: tx._id || tx.id || `giftbit-${Date.now()}-${Math.random()}`,
                            type: 'Gift Card Payout',
                            amount: calculatedAmount,
                            description: `${tx.brandName || 'Gift Card'}`,
                            createdAt: tx.createdAt,
                            status: tx.status,
                        });
                    });
                }

                // Sort by date (newest first)
                allTransactions.sort((a, b) => 
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );

                setTransactions(allTransactions);
            } catch (error) {
                console.error("Error fetching transactions:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    // Filter transactions by search query
    const filteredTransactions = transactions.filter(tx =>
        tx.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tx._id && tx._id.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="w-full">
            <div className="flex gap-6 border-b border-gray-700">
                {["Main", "Game"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setCurrentTab(tab)}
                        className={`px-4 py-2 w-full md:text-lg text-sm ${currentTab === tab
                            ? "border-b-2 border-[#4DD6C1] text-[#4DD6C1]"
                            : "text-[#B3B6C7]"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Search */}
            <div className="mt-4 relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white text-md" />
                <input
                    type="text"
                    placeholder="Search transactions"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-1 py-4 rounded-md bg-[#26293E] text-sm text-gray-300 focus:outline-none focus:border-teal-400"
                />
            </div>

            {["Main", "Game"].map(
                (tab) =>
                    currentTab === tab && (
                        <div key={tab} className="mt-2 overflow-x-auto w-full">
                            <div className="min-w-[1000px]">
                                {/* Header */}
                                <div className="grid grid-cols-5 py-2 bg-[#0D0F1E] text-gray-300 text-sm rounded-md mb-2">
                                    <div className="px-6 py-3 text-center text-xs">ID</div>
                                    <div className="px-6 py-3 text-center text-xs">Type</div>
                                    <div className="px-6 py-3 text-center text-xs">Description</div>
                                    <div className="px-6 py-3 text-center text-xs">Amount</div>
                                    <div className="px-6 py-3 text-center text-xs">Date</div>
                                </div>

                                {/* Loading State */}
                                {loading ? (
                                    <div className="flex flex-col justify-center items-center py-12 space-y-4">
                                        <div className="relative">
                                            <div className="w-16 h-16 border-4 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin"></div>
                                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                                <Loader2 className="w-6 h-6 text-emerald-400 animate-pulse" />
                                            </div>
                                        </div>
                                        <div className="flex space-x-1">
                                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                                        </div>
                                        <p className="text-emerald-400 font-medium animate-pulse">Loading transactions...</p>
                                    </div>
                                ) : filteredTransactions.length === 0 ? (
                                    <div className="text-center py-12 text-gray-400">
                                        No transactions found
                                    </div>
                                ) : (
                                    filteredTransactions.map((tx) => (
                                        <div
                                            key={tx._id}
                                            className="grid grid-cols-5 py-2 bg-[#1E2133] border border-[#2A2D44] rounded-md hover:bg-[#1b1f30] mb-2"
                                        >
                                            <div className="px-6 py-3 text-center text-xs font-mono text-gray-400">
                                                {tx._id && tx._id.length > 10 ? `${tx._id.slice(0, 6)}...${tx._id.slice(-4)}` : (tx._id || 'N/A')}
                                            </div>
                                            <div className="px-6 py-3 text-center text-xs">
                                                <span className={`px-2 py-1 rounded-full text-xs ${
                                                    tx.type === 'Task Completed' 
                                                        ? 'bg-emerald-500/20 text-emerald-400'
                                                        : 'bg-blue-500/20 text-blue-400'
                                                }`}>
                                                    {tx.type}
                                                </span>
                                            </div>
                                            <div className="px-6 py-3 text-center text-xs text-gray-300">
                                                {tx.description}
                                            </div>
                                            <div className={`px-6 py-3 text-center text-xs font-semibold ${
                                                tx.amount >= 0 ? 'text-emerald-400' : 'text-red-400'
                                            }`}>
                                                {typeof tx.amount === 'number' && !isNaN(tx.amount) ? (
                                                    <>{tx.amount >= 0 ? '+' : ''}${Math.abs(tx.amount).toFixed(2)}</>
                                                ) : (
                                                    <span className="text-gray-500">N/A</span>
                                                )}
                                            </div>
                                            <div className="px-6 py-3 text-center text-xs text-gray-400">
                                                {new Date(tx.createdAt).toLocaleString()}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )
            )}
        </div>
    );
};

export default TransactionDashboard;
