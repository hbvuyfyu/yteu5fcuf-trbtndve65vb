import { Layout } from "@/components/layout";
import { useGetDashboardStats, useGetBalance, useListPlatforms, useGetMe } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { Coins, Download, CheckCircle2, History, ArrowUpRight, Gamepad2, Zap, ExternalLink, TrendingUp, Sparkles, Wallet } from "lucide-react";
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
    {
      label: "Current Balance",
      value: `$${formatMoney(balanceData?.balance)}`,
      icon: Wallet,
      color: "text-amber-400",
      gradient: "from-amber-500/20 to-amber-600/10",
      border: "border-amber-500/30",
      highlight: true,
      bgIcon: "bg-gradient-to-br from-amber-500/30 to-amber-600/20"
    },
    {
      label: "Total Earned",
      value: `$${formatMoney(stats?.totalEarned)}`,
      icon: TrendingUp,
      color: "text-emerald-400",
      gradient: "from-emerald-500/15 to-emerald-600/8",
      border: "border-emerald-500/20",
      highlight: false,
      bgIcon: "bg-gradient-to-br from-emerald-500/20 to-emerald-600/10"
    },
    {
      label: "Total Withdrawn",
      value: `$${formatMoney(stats?.totalWithdrawn)}`,
      icon: Download,
      color: "text-blue-400",
      gradient: "from-blue-500/15 to-blue-600/8",
      border: "border-blue-500/20",
      highlight: false,
      bgIcon: "bg-gradient-to-br from-blue-500/20 to-blue-600/10"
    },
    {
      label: "Pending",
      value: `$${formatMoney(stats?.pendingWithdrawals)}`,
      icon: History,
      color: "text-orange-400",
      gradient: "from-orange-500/15 to-orange-600/8",
      border: "border-orange-500/20",
      highlight: false,
      bgIcon: "bg-gradient-to-br from-orange-500/20 to-orange-600/10"
    },
  ];

  return (
    <Layout>
      <div className="space-y-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-white mb-1">Dashboard</h1>
            <p className="text-zinc-500">Your earnings overview at a glance</p>
          </div>
          <div className="flex gap-3">
            <Link href="/platforms">
              <Button variant="outline" className="border-amber-500/20 text-amber-400 hover:bg-amber-500/10 hover:border-amber-500/30 rounded-xl">
                <Gamepad2 className="h-4 w-4 mr-2" />Browse Offers
              </Button>
            </Link>
            <Link href="/withdraw">
              <Button className="btn-premium rounded-xl">
                <ArrowUpRight className="h-4 w-4 mr-2" />Withdraw
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => (
            <div
              key={stat.label}
              className={`premium-card rounded-2xl p-5 ${stat.highlight ? "glow-gold" : ""}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${stat.bgIcon} flex items-center justify-center border ${stat.border}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                {stat.highlight && (
                  <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                )}
              </div>
              <div className="mb-1">
                {statsLoading ? (
                  <Skeleton className="h-9 w-28 bg-zinc-800 rounded" />
                ) : (
                  <span className={`text-3xl font-black ${stat.highlight ? "gold-gradient-text" : "text-white"}`}>
                    {stat.value}
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider font-bold">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Featured Platform Card */}
        <div className="premium-card-glow rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-amber-900/20 bg-black/50">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shadow-lg shadow-amber-400/50" />
                <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping opacity-50" />
              </div>
              {featuredPlatform?.logoUrl ? (
                <img src={featuredPlatform.logoUrl} alt={featuredPlatform.name} className="w-7 h-7 rounded-lg object-cover border border-amber-500/20" />
              ) : (
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/20 flex items-center justify-center">
                  <Zap className="h-4 w-4 text-amber-400" />
                </div>
              )}
              <span className="font-bold text-white">
                {featuredPlatform ? featuredPlatform.name : "No Featured Platform"}
              </span>
              {featuredPlatform && (
                <span className="text-[10px] bg-amber-500 text-black px-2 py-0.5 rounded-lg font-bold uppercase tracking-wider">Live</span>
              )}
            </div>
            <div className="flex items-center gap-3">
              {offerUrl && (
                <a
                  href={offerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-medium transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Open in new tab
                </a>
              )}
              <Link href="/platforms">
                <Button variant="outline" size="sm" className="h-8 text-xs border-amber-500/20 text-amber-400 hover:bg-amber-500/10 rounded-lg">
                  <Gamepad2 className="h-3.5 w-3.5 mr-1.5" />
                  Switch
                </Button>
              </Link>
            </div>
          </div>

          {/* Iframe Area */}
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
            <div className="flex flex-col items-center justify-center text-center py-24 px-8" style={{ height: "600px" }}>
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/25 flex items-center justify-center mb-6">
                <Gamepad2 className="h-10 w-10 text-amber-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">No Platform Featured</h3>
              <p className="text-zinc-500 text-sm max-w-sm mb-6">
                The admin hasn't configured a featured platform yet. Browse available offerwalls to start earning.
              </p>
              <Link href="/platforms">
                <Button className="btn-premium rounded-xl">
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
