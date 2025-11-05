"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, Clock, CheckCircle } from "lucide-react";
import TopBar from "@/Components/Topbar";
import Image from "next/image";
import DolarImg from "../../../public/assets/dolar.png";

interface Transaction {
  id: string;
  type: "earning" | "withdrawal";
  amount: number;
  status: "pending" | "completed" | "failed";
  date: Date;
  description: string;
}

export default function WalletPage() {
  const router = useRouter();
  const [balance, setBalance] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWalletData = async () => {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${api}/api/v1/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (res.ok) {
          const data = await res.json();
          if (data.profile && typeof data.profile.balanceCents === "number") {
            setBalance(data.profile.balanceCents);
          }
        }

        // Fetch transactions
        const txRes = await fetch(`${api}/api/v1/user/transactions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (txRes.ok) {
          const txData = await txRes.json();
          if (txData.transactions) {
            setTransactions(txData.transactions);
          }
        }
      } catch (err) {
        console.error("Failed to fetch wallet data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();
  }, []);

  return (
    <>
      <TopBar />
      <div className="min-h-screen bg-[#0A0C1A] pb-20 lg:pb-0">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => router.back()}
              className="lg:hidden p-2 rounded-lg bg-[#1A1D2E] border border-[#2A2D3E] hover:bg-[#252840] transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white">My Wallet</h1>
              <p className="text-sm text-[#9CA3AF]">Manage your earnings and withdrawals</p>
            </div>
          </div>

          {/* Balance Card */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500/20 via-[#1A1D2E] to-blue-500/20 border border-emerald-500/30 p-8 mb-6">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <WalletIcon className="w-5 h-5 text-emerald-400" />
                <p className="text-sm text-[#9CA3AF] font-medium">Available Balance</p>
              </div>
              
              <div className="flex items-center gap-3 mb-6">
                <Image src={DolarImg} alt="Dollar" width={40} height={40} className="object-contain" />
                <h2 className="text-5xl font-bold text-white">
                  {loading ? "--" : balance !== null ? `$${(balance / 100).toFixed(2)}` : "$0.00"}
                </h2>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition-colors">
                  <ArrowUpRight className="w-4 h-4" />
                  Withdraw
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#252840] hover:bg-[#2A2D3E] border border-[#2A2D3E] text-white font-semibold transition-colors">
                  <ArrowDownLeft className="w-4 h-4" />
                  History
                </button>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="rounded-xl bg-[#1A1D2E] border border-[#2A2D3E] p-4">
              <p className="text-xs text-[#9CA3AF] mb-1">Pending</p>
              <p className="text-xl font-bold text-yellow-400">$0.00</p>
            </div>
            <div className="rounded-xl bg-[#1A1D2E] border border-[#2A2D3E] p-4">
              <p className="text-xs text-[#9CA3AF] mb-1">This Month</p>
              <p className="text-xl font-bold text-emerald-400">$0.00</p>
            </div>
            <div className="rounded-xl bg-[#1A1D2E] border border-[#2A2D3E] p-4">
              <p className="text-xs text-[#9CA3AF] mb-1">Total Earned</p>
              <p className="text-xl font-bold text-blue-400">$0.00</p>
            </div>
          </div>

          {/* Transactions */}
          <div className="rounded-2xl bg-[#1A1D2E] border border-[#2A2D3E] p-6">
            <h3 className="text-lg font-bold text-white mb-4">Recent Transactions</h3>
            
            {loading && (
              <p className="text-center text-[#9CA3AF] py-8">Loading transactions...</p>
            )}

            {!loading && transactions.length === 0 && (
              <p className="text-center text-[#9CA3AF] py-8">No transactions yet</p>
            )}

            <div className="space-y-3">
              {transactions.slice(0, 10).map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-[#252840] hover:bg-[#2A2D3E] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      tx.type === "earning" ? "bg-emerald-500/10" : "bg-blue-500/10"
                    }`}>
                      {tx.type === "earning" ? (
                        <ArrowDownLeft className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <ArrowUpRight className="w-5 h-5 text-blue-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{tx.description}</p>
                      <p className="text-xs text-[#9CA3AF]">
                        {tx.date.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className={`text-sm font-bold ${
                      tx.type === "earning" ? "text-emerald-400" : "text-blue-400"
                    }`}>
                      {tx.type === "earning" ? "+" : "-"}${(tx.amount / 100).toFixed(2)}
                    </p>
                    <div className="flex items-center gap-1 justify-end">
                      {tx.status === "completed" && (
                        <CheckCircle className="w-3 h-3 text-emerald-400" />
                      )}
                      {tx.status === "pending" && (
                        <Clock className="w-3 h-3 text-yellow-400" />
                      )}
                      <span className={`text-xs ${
                        tx.status === "completed" ? "text-emerald-400" :
                        tx.status === "pending" ? "text-yellow-400" :
                        "text-red-400"
                      }`}>
                        {tx.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
