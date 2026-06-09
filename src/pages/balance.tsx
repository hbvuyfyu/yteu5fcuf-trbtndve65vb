import { Layout } from "@/components/layout";
import { useGetBalance, useGetDashboardStats } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Coins, Send, Clock, Wallet } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const formatMoney = (value?: string | number | null) => {
  const n = Number(value ?? 0);
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: n % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(n);
};

export default function Balance() {
  const { data: balanceData, isLoading } = useGetBalance();

  return (
    <Layout>
      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black tracking-tight uppercase text-white">Wallet</h2>
            <p className="text-zinc-500">Manage your earnings.</p>
          </div>
          <Link href="/withdraw">
            <Button className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-black font-bold hover:from-yellow-400 hover:to-yellow-300 shadow-lg shadow-yellow-500/30">
              <Send className="mr-2 h-4 w-4" /> Withdraw
            </Button>
          </Link>
        </div>

        <Card className="dark-card relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
            <Wallet className="w-48 h-48 text-yellow-400" />
          </div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-yellow-500/5 to-transparent pointer-events-none" />
          <CardHeader>
            <CardTitle className="text-zinc-500 uppercase tracking-wider font-bold">Available Balance</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-16 w-48 bg-zinc-800" />
            ) : (
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-black text-white">{formatMoney(balanceData?.balance)}</span>
                <span className="text-2xl font-bold text-yellow-400">USDT</span>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="dark-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Total Earned</CardTitle>
              <Coins className="h-4 w-4 text-emerald-400" />
            </CardHeader>
            <CardContent>
              {isLoading ? <Skeleton className="h-8 w-24 bg-zinc-800" /> : <div className="text-2xl font-bold text-white">{formatMoney(balanceData?.totalEarned)} USDT</div>}
            </CardContent>
          </Card>
          <Card className="dark-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Pending Withdrawals</CardTitle>
              <Clock className="h-4 w-4 text-amber-400" />
            </CardHeader>
            <CardContent>
              {isLoading ? <Skeleton className="h-8 w-24 bg-zinc-800" /> : <div className="text-2xl font-bold text-white">{formatMoney(balanceData?.pendingWithdrawals)} USDT</div>}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
