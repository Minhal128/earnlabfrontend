"use client";

import React, { useEffect, useState } from "react";
import { X, ArrowUpRight, ArrowDownLeft, Loader2, Search } from "lucide-react";

interface Transaction {
  _id: string;
  type: string;
  amount: number;
  description: string;
  createdAt: string;
  status?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function TransactionHistoryModal({ isOpen, onClose }: Props) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "earning" | "withdrawal">("all");

  useEffect(() => {
    if (!isOpen) return;

    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

        // Fetch completed tasks
        const tasksResponse = await fetch(`${api}/api/v1/tasks?status=completed&limit=200`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        const tasksData = await tasksResponse.json();

        // Fetch Giftbit transactions
        const giftbitResponse = await fetch(`${api}/api/v1/giftbit/transactions`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        const giftbitData = await giftbitResponse.json();

        // Combine all transactions
        const allTransactions: Transaction[] = [];

        // Add completed tasks
        if (tasksData && Array.isArray(tasksData.tasks)) {
          tasksData.tasks.forEach((task: any) => {
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
            // Giftbit amounts are already in dollars, not cents
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
  }, [isOpen]);

  if (!isOpen) return null;

  // Filter transactions
  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.type.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType =
      filterType === "all" ||
      (filterType === "earning" && tx.amount >= 0) ||
      (filterType === "withdrawal" && tx.amount < 0);

    return matchesSearch && matchesType;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#1A1D2E] rounded-2xl border border-[#2A2D3E] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#2A2D3E]">
          <div>
            <h2 className="text-2xl font-bold text-white">Transaction History</h2>
            <p className="text-sm text-[#9CA3AF] mt-1">
              {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-[#252840] hover:bg-[#2A2D3E] border border-[#2A2D3E] transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-[#2A2D3E] space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[#252840] border border-[#2A2D3E] rounded-lg text-white placeholder-[#9CA3AF] focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Type Filter */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilterType("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterType === "all"
                  ? "bg-emerald-500 text-white"
                  : "bg-[#252840] text-[#9CA3AF] hover:bg-[#2A2D3E]"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType("earning")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterType === "earning"
                  ? "bg-emerald-500 text-white"
                  : "bg-[#252840] text-[#9CA3AF] hover:bg-[#2A2D3E]"
              }`}
            >
              Earnings
            </button>
            <button
              onClick={() => setFilterType("withdrawal")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterType === "withdrawal"
                  ? "bg-emerald-500 text-white"
                  : "bg-[#252840] text-[#9CA3AF] hover:bg-[#2A2D3E]"
              }`}
            >
              Withdrawals
            </button>
          </div>
        </div>

        {/* Transactions List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <Loader2 className="w-6 h-6 text-emerald-400 animate-pulse" />
                </div>
              </div>
              <p className="text-emerald-400 font-medium animate-pulse">Loading transactions...</p>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[#9CA3AF] text-lg">No transactions found</p>
            </div>
          ) : (
            filteredTransactions.map((tx) => (
              <div
                key={tx._id}
                className="flex items-center justify-between p-4 rounded-xl bg-[#252840] hover:bg-[#2A2D3E] border border-[#2A2D3E] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`p-3 rounded-lg ${
                      tx.amount >= 0 ? "bg-emerald-500/10" : "bg-red-500/10"
                    }`}
                  >
                    {tx.amount >= 0 ? (
                      <ArrowDownLeft className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5 text-red-400" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-white">{tx.description}</p>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs ${
                          tx.type === "Task Completed"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-blue-500/20 text-blue-400"
                        }`}
                      >
                        {tx.type}
                      </span>
                    </div>
                    <p className="text-xs text-[#9CA3AF] mt-1">
                      {new Date(tx.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p
                    className={`text-lg font-bold ${
                      tx.amount >= 0 ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {typeof tx.amount === "number" && !isNaN(tx.amount) ? (
                      <>
                        {tx.amount >= 0 ? "+" : ""}${Math.abs(tx.amount).toFixed(2)}
                      </>
                    ) : (
                      <span className="text-gray-500">N/A</span>
                    )}
                  </p>
                  {tx.status && (
                    <p className="text-xs text-[#9CA3AF] mt-1 capitalize">{tx.status}</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
