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
            <h2 className="text-3xl font-black tracking-tight uppercase">Wallet</h2>
            <p className="text-muted-foreground">Manage your earnings.</p>
          </div>
          <Link href="/withdraw">
            <Button className="bg-primary text-black hover:bg-primary/90 font-bold">
              <Send className="mr-2 h-4 w-4" /> Withdraw
            </Button>
          </Link>
        </div>

        <Card className="bg-gradient-to-br from-card to-accent border-border shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Wallet className="w-48 h-48 text-primary" />
          </div>
          <CardHeader>
            <CardTitle className="text-muted-foreground uppercase tracking-wider font-bold">Available Balance</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-16 w-48" />
            ) : (
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-black text-white">{formatMoney(balanceData?.balance)}</span>
                <span className="text-2xl font-bold text-primary">USDT</span>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Earned</CardTitle>
              <Coins className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              {isLoading ? <Skeleton className="h-8 w-24" /> : <div className="text-2xl font-bold text-white">{formatMoney(balanceData?.totalEarned)} USDT</div>}
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Pending Withdrawals</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              {isLoading ? <Skeleton className="h-8 w-24" /> : <div className="text-2xl font-bold text-white">{formatMoney(balanceData?.pendingWithdrawals)} USDT</div>}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
