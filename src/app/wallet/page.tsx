"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, Gift } from "lucide-react";
import TopBar from "@/Components/Topbar";
import Image from "next/image";
import DolarImg from "../../../public/assets/dolar.png";
import GiftbitPayoutModal from "@/Components/Shared/GiftbitPayoutModal";
import TransactionHistoryModal from "@/Components/Shared/TransactionHistoryModal";
import GiftCardRedemptionModal from "@/Components/Shared/GiftCardRedemptionModal";

interface Transaction {
  _id: string;
  type: string;
  amount: number;
  status?: string;
  createdAt: string;
  description: string;
}

interface WithdrawalRequest {
  _id: string;
  amountCents: number;
  method: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Completed' | 'Cancelled';
  destination: string;
  createdAt: string;
  rejectionReason?: string;
}

export default function WalletPage() {
  const router = useRouter();
  const [balance, setBalance] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [giftbitModalOpen, setGiftbitModalOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [giftCardRedemptionOpen, setGiftCardRedemptionOpen] = useState(false);
  const [thisMonthEarnings, setThisMonthEarnings] = useState(0);
  const [totalEarned, setTotalEarned] = useState(0);
  const [pendingWithdrawal, setPendingWithdrawal] = useState(0);

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

        // Fetch completed tasks
        const tasksResponse = await fetch(`${api}/api/v1/tasks?status=completed&limit=10`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const tasksData = await tasksResponse.json();

        // Fetch Giftbit transactions
        const giftbitResponse = await fetch(`${api}/api/v1/giftbit/transactions?limit=10`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const giftbitData = await giftbitResponse.json();

        // Fetch withdrawal requests
        const withdrawalResponse = await fetch(`${api}/api/v1/user/withdrawals/history`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const withdrawalData = await withdrawalResponse.json();
        if (withdrawalData.history && Array.isArray(withdrawalData.history)) {
          // Filter only Pending and Rejected withdrawals
          const filteredWithdrawals = withdrawalData.history.filter((w: any) => 
            w.status === 'Pending' || w.status === 'Rejected'
          );
          setWithdrawalRequests(filteredWithdrawals);
          
          // Calculate pending withdrawal amount
          const pendingAmount = withdrawalData.history
            .filter((w: any) => w.status === 'Pending')
            .reduce((sum: number, w: any) => sum + (w.amountCents || 0), 0);
          setPendingWithdrawal(pendingAmount / 100);
        }
        
        // Debug: Log first transaction to verify amount structure
        if (giftbitData?.transactions?.[0]) {
          console.log('Giftbit transaction sample:', giftbitData.transactions[0]);
        }

        // Combine transactions
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

        // Calculate This Month earnings
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthlyEarnings = allTransactions
          .filter(tx => {
            const txDate = new Date(tx.createdAt);
            return tx.amount > 0 && txDate >= startOfMonth;
          })
          .reduce((sum, tx) => sum + tx.amount, 0);
        setThisMonthEarnings(monthlyEarnings);

        // Calculate Total Earned (sum of all positive transactions)
        const totalPositive = allTransactions
          .filter(tx => tx.amount > 0)
          .reduce((sum, tx) => sum + tx.amount, 0);
        setTotalEarned(totalPositive);
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
                <button 
                  onClick={() => setGiftCardRedemptionOpen(true)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition-colors"
                >
                  <Gift className="w-4 h-4" />
                  Redeem Gift Card
                </button>
                <button 
                  onClick={() => setHistoryModalOpen(true)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#252840] hover:bg-[#2A2D3E] border border-[#2A2D3E] text-white font-semibold transition-colors"
                >
                  <ArrowDownLeft className="w-4 h-4" />
                  History
                </button>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="rounded-xl bg-[#1A1D2E] border border-[#2A2D3E] p-4">
              <p className="text-xs text-[#9CA3AF] mb-1">Pending Withdrawal</p>
              <p className="text-xl font-bold text-yellow-400">
                {loading ? "--" : `$${pendingWithdrawal.toFixed(2)}`}
              </p>
            </div>
            <div className="rounded-xl bg-[#1A1D2E] border border-[#2A2D3E] p-4">
              <p className="text-xs text-[#9CA3AF] mb-1">This Month</p>
              <p className="text-xl font-bold text-emerald-400">
                {loading ? "--" : `$${thisMonthEarnings.toFixed(2)}`}
              </p>
            </div>
            <div className="rounded-xl bg-[#1A1D2E] border border-[#2A2D3E] p-4">
              <p className="text-xs text-[#9CA3AF] mb-1">Total Earned</p>
              <p className="text-xl font-bold text-blue-400">
                {loading ? "--" : `$${totalEarned.toFixed(2)}`}
              </p>
            </div>
          </div>

          {/* Withdrawal Requests */}
          {withdrawalRequests.length > 0 && (
            <div className="rounded-2xl bg-[#1A1D2E] border border-[#2A2D3E] p-6 mb-6">
              <h3 className="text-lg font-bold text-white mb-4">Withdrawal Requests</h3>
              
              <div className="space-y-3">
                {withdrawalRequests.map((request) => (
                  <div
                    key={request._id}
                    className="flex items-center justify-between p-4 rounded-lg bg-[#252840] hover:bg-[#2A2D3E] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        request.status === 'Pending' ? "bg-yellow-500/10" : "bg-red-500/10"
                      }`}>
                        {request.status === 'Pending' ? (
                          <Clock className="w-5 h-5 text-yellow-400" />
                        ) : (
                          <ArrowUpRight className="w-5 h-5 text-red-400" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-white">
                            {request.method.charAt(0).toUpperCase() + request.method.slice(1)} Withdrawal
                          </p>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            request.status === 'Pending'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {request.status}
                          </span>
                        </div>
                        <p className="text-xs text-[#9CA3AF] mt-1">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                        {request.rejectionReason && (
                          <p className="text-xs text-red-400 mt-1">
                            Reason: {request.rejectionReason}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm font-bold text-emerald-400">
                        ${(request.amountCents / 100).toFixed(2)}
                      </p>
                      <p className="text-xs text-[#9CA3AF] mt-1">
                        {request.destination.substring(0, 6)}......
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

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
              {transactions.slice(0, 5).map((tx) => (
                <div
                  key={tx._id}
                  className="flex items-center justify-between p-4 rounded-lg bg-[#252840] hover:bg-[#2A2D3E] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      tx.amount >= 0 ? "bg-emerald-500/10" : "bg-red-500/10"
                    }`}>
                      {tx.amount >= 0 ? (
                        <ArrowDownLeft className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <ArrowUpRight className="w-5 h-5 text-red-400" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-white">{tx.description}</p>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          tx.type === 'Task Completed'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {tx.type}
                        </span>
                      </div>
                      <p className="text-xs text-[#9CA3AF] mt-1">
                        {new Date(tx.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className={`text-sm font-bold ${
                      tx.amount >= 0 ? "text-emerald-400" : "text-red-400"
                    }`}>
                      {typeof tx.amount === 'number' && !isNaN(tx.amount) ? (
                        <>{tx.amount >= 0 ? '+' : ''}${Math.abs(tx.amount).toFixed(2)}</>
                      ) : (
                        <span className="text-gray-500">N/A</span>
                      )}
                    </p>
                    {tx.status && (
                      <div className="flex items-center gap-1 justify-end mt-1">
                        {tx.status === "completed" && (
                          <CheckCircle className="w-3 h-3 text-emerald-400" />
                        )}
                        <span className="text-xs text-emerald-400 capitalize">
                          {tx.status}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Giftbit Payout Modal */}
      <GiftbitPayoutModal
        isOpen={giftbitModalOpen}
        onClose={() => setGiftbitModalOpen(false)}
        userBalance={balance || 0}
        onPayoutComplete={() => {
          // Refresh wallet data after successful payout
          const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
          if (token) {
            fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/v1/user/profile`, {
              headers: { Authorization: `Bearer ${token}` },
            })
              .then(res => res.json())
              .then(data => {
                if (data.profile && typeof data.profile.balanceCents === "number") {
                  setBalance(data.profile.balanceCents);
                }
              });
          }
        }}
      />

      {/* Transaction History Modal */}
      <TransactionHistoryModal
        isOpen={historyModalOpen}
        onClose={() => setHistoryModalOpen(false)}
      />

      {/* Gift Card Redemption Modal */}
      <GiftCardRedemptionModal
        isOpen={giftCardRedemptionOpen}
        onClose={() => setGiftCardRedemptionOpen(false)}
        userBalance={balance || 0}
        onRedemptionComplete={() => {
          // Refresh wallet data after successful redemption
          const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
          if (token) {
            fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/v1/user/profile`, {
              headers: { Authorization: `Bearer ${token}` },
            })
              .then(res => res.json())
              .then(data => {
                if (data.profile && typeof data.profile.balanceCents === "number") {
                  setBalance(data.profile.balanceCents);
                }
              });
          }
        }}
      />
    </>
  );
}
