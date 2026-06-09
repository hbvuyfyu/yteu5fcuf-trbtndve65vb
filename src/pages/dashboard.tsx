import { Layout } from "@/components/layout";
import { useGetDashboardStats, useGetBalance, useListPlatforms, useGetMe } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { Coins, Download, CheckCircle2, History, ArrowUpRight, Gamepad2, Zap, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";

const formatMoney = (value?: string | number | null) => {
  const n = Number(value ?? 0);
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: n % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(n);
};

function buildOfferUrl(template: string, userId: number): string {
  return template
    .replace(/\{USER_ID\}/g, String(userId))
    .replace(/\[USER_ID\]/g, String(userId))
    .replace(/%7BUSER_ID%7D/g, String(userId));
}

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useGetDashboardStats();
  const { data: balanceData } = useGetBalance();
  const { data: platformsData } = useListPlatforms();
  const { data: user } = useGetMe();
  const [featuredPlatform, setFeaturedPlatform] = useState<any>(null);

  useEffect(() => {
    if (!platformsData?.platforms) return;
    const hp = platformsData.platforms.find((p: any) => p.placement === "homepage" && p.isEnabled && p.apiEndpoint);
    if (hp) {
      setFeaturedPlatform(hp);
    } else {
      const fallback = platformsData.platforms.find((p: any) => p.apiEndpoint && p.isEnabled);
      if (fallback) setFeaturedPlatform(fallback);
    }
  }, [platformsData]);

  const offerUrl = featuredPlatform && user?.id
    ? buildOfferUrl(featuredPlatform.apiEndpoint, user.id)
    : featuredPlatform?.apiEndpoint;

  const statCards = [
    { label: "Current Balance", value: `$${formatMoney(balanceData?.balance)}`, icon: Coins, color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20", highlight: true },
    { label: "Total Earned", value: `$${formatMoney(stats?.totalEarned)}`, icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", highlight: false },
    { label: "Total Withdrawn", value: `$${formatMoney(stats?.totalWithdrawn)}`, icon: Download, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", highlight: false },
    { label: "Pending", value: `$${formatMoney(stats?.pendingWithdrawals)}`, icon: History, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", highlight: false },
  ];

  return (
    <Layout>
      <div className="space-y-6 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-white">Dashboard</h2>
            <p className="text-zinc-500 text-sm mt-0.5">Here's your earnings overview.</p>
          </div>
          <div className="flex gap-2">
            <Link href="/platforms">
              <Button variant="outline" size="sm" className="border-zinc-800 hover:border-yellow-500/40 hover:text-yellow-400">
                <Gamepad2 className="h-4 w-4 mr-1.5" />Browse Offers
              </Button>
            </Link>
            <Link href="/withdraw">
              <Button size="sm" className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-black font-bold hover:from-yellow-400 hover:to-yellow-300 shadow-lg shadow-yellow-500/30">
                <ArrowUpRight className="h-4 w-4 mr-1.5" />Withdraw
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => (
            <Card key={stat.label} className={`dark-card ${stat.highlight ? "border-yellow-500/30" : ""}`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
                <CardTitle className="text-[10px] sm:text-xs font-bold text-zinc-500 uppercase tracking-wider">{stat.label}</CardTitle>
                <div className={`w-7 h-7 rounded-lg ${stat.bg} border ${stat.border} flex items-center justify-center shrink-0`}>
                  <stat.icon className={`h-3.5 w-3.5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                {statsLoading ? (
                  <Skeleton className="h-8 w-24 mt-1 bg-zinc-800" />
                ) : (
                  <div className={`text-2xl font-black ${stat.highlight ? "text-yellow-400" : "text-white"}`}>
                    {stat.value}
                  </div>
                )}
                <p className="text-[10px] text-zinc-500 mt-1 uppercase tracking-wider">USDT</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Featured Platform */}
        <div className="rounded-2xl dark-card overflow-hidden">
          {/* Header bar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-900/50">
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse shadow-lg shadow-yellow-400/50" />
              {featuredPlatform?.logoUrl ? (
                <img src={featuredPlatform.logoUrl} alt={featuredPlatform.name} className="w-6 h-6 rounded object-cover border border-zinc-700" />
              ) : (
                <div className="w-6 h-6 rounded-md bg-yellow-500/15 border border-yellow-500/25 flex items-center justify-center">
                  <Zap className="h-3.5 w-3.5 text-yellow-400" />
                </div>
              )}
              <span className="font-bold text-sm text-white">
                {featuredPlatform ? featuredPlatform.name : "No Featured Platform"}
              </span>
              {featuredPlatform && (
                <span className="text-[10px] bg-yellow-500 text-black px-2 py-0.5 rounded font-bold uppercase tracking-wider">Live</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {offerUrl && (
                <a href={offerUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-yellow-400 hover:underline font-medium">
                  <ExternalLink className="h-3 w-3" /> Open in tab
                </a>
              )}
              <Link href="/platforms">
                <Button variant="outline" size="sm" className="h-7 text-xs border-zinc-800 hover:border-yellow-500/40 hover:text-yellow-400">
                  <Gamepad2 className="h-3 w-3 mr-1" /> Switch Platform
                </Button>
              </Link>
            </div>
          </div>

          {/* Iframe area */}
          {featuredPlatform && offerUrl ? (
            <iframe
              key={featuredPlatform.id}
              src={offerUrl}
              className="w-full border-0"
              style={{ height: "600px" }}
              allow="fullscreen"
              title={featuredPlatform.name}
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-20 px-8 bg-zinc-900/30" style={{ height: "600px" }}>
              <div className="w-16 h-16 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mb-5">
                <Gamepad2 className="h-8 w-8 text-yellow-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">No Platform Featured Yet</h3>
              <p className="text-zinc-500 text-sm max-w-xs mb-5">
                The admin hasn't set a featured platform for the dashboard yet. Browse all available offerwalls.
              </p>
              <Link href="/platforms">
                <Button className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-black font-bold hover:from-yellow-400 hover:to-yellow-300">
                  <Gamepad2 className="h-4 w-4 mr-2" /> Browse Offerwalls
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
