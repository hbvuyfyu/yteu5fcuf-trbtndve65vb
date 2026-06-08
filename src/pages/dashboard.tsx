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

  // Pick the homepage-placement platform as the featured one
  useEffect(() => {
    if (!platformsData?.platforms) return;
    const hp = platformsData.platforms.find((p: any) => p.placement === "homepage" && p.isEnabled && p.apiEndpoint);
    if (hp) {
      setFeaturedPlatform(hp);
    } else {
      // fallback: first platform with a URL
      const fallback = platformsData.platforms.find((p: any) => p.apiEndpoint && p.isEnabled);
      if (fallback) setFeaturedPlatform(fallback);
    }
  }, [platformsData]);

  const offerUrl = featuredPlatform && user?.id
    ? buildOfferUrl(featuredPlatform.apiEndpoint, user.id)
    : featuredPlatform?.apiEndpoint;

  const statCards = [
    { label: "Current Balance", value: `$${formatMoney(balanceData?.balance)}`, icon: Coins, color: "text-primary", bg: "bg-primary/10", border: "border-primary/20", highlight: true },
    { label: "Total Earned", value: `$${formatMoney(stats?.totalEarned)}`, icon: CheckCircle2, color: "text-green-600", bg: "bg-green-500/10", border: "border-green-500/20", highlight: false },
    { label: "Total Withdrawn", value: `$${formatMoney(stats?.totalWithdrawn)}`, icon: Download, color: "text-blue-600", bg: "bg-blue-500/10", border: "border-blue-500/20", highlight: false },
    { label: "Pending", value: `$${formatMoney(stats?.pendingWithdrawals)}`, icon: History, color: "text-yellow-600", bg: "bg-yellow-500/10", border: "border-yellow-500/20", highlight: false },
  ];

  return (
    <Layout>
      <div className="space-y-6 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-foreground">Dashboard</h2>
            <p className="text-muted-foreground text-sm mt-0.5">Here's your earnings overview.</p>
          </div>
          <div className="flex gap-2">
            <Link href="/platforms">
              <Button variant="outline" size="sm" className="border-border hover:border-primary/40 hover:text-primary">
                <Gamepad2 className="h-4 w-4 mr-1.5" />Browse Offers
              </Button>
            </Link>
            <Link href="/withdraw">
              <Button size="sm" className="bg-primary text-white font-bold hover:bg-primary/90 shadow-[0_2px_8px_rgba(249,115,22,0.25)]">
                <ArrowUpRight className="h-4 w-4 mr-1.5" />Withdraw
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => (
            <Card key={stat.label} className={`bg-card border-border ${stat.highlight ? "shadow-[0_0_18px_rgba(249,115,22,0.08)]" : ""}`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
                <CardTitle className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wider">{stat.label}</CardTitle>
                <div className={`w-7 h-7 rounded-lg ${stat.bg} border ${stat.border} flex items-center justify-center shrink-0`}>
                  <stat.icon className={`h-3.5 w-3.5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                {statsLoading ? (
                  <Skeleton className="h-8 w-24 mt-1" />
                ) : (
                  <div className={`text-2xl font-black ${stat.highlight ? "text-primary" : "text-foreground"}`}>
                    {stat.value}
                  </div>
                )}
                <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">USDT</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Featured Platform — always open iframe */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
          {/* Header bar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-primary/5">
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              {featuredPlatform?.logoUrl ? (
                <img src={featuredPlatform.logoUrl} alt={featuredPlatform.name} className="w-6 h-6 rounded object-cover border border-border" />
              ) : (
                <div className="w-6 h-6 rounded-md bg-primary/15 border border-primary/25 flex items-center justify-center">
                  <Zap className="h-3.5 w-3.5 text-primary" />
                </div>
              )}
              <span className="font-bold text-sm text-foreground">
                {featuredPlatform ? featuredPlatform.name : "No Featured Platform"}
              </span>
              {featuredPlatform && (
                <span className="text-[10px] bg-primary text-white px-2 py-0.5 rounded font-bold uppercase tracking-wider">Live</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {offerUrl && (
                <a href={offerUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-primary hover:underline font-medium">
                  <ExternalLink className="h-3 w-3" /> Open in tab
                </a>
              )}
              <Link href="/platforms">
                <Button variant="outline" size="sm" className="h-7 text-xs border-border hover:border-primary/40 hover:text-primary">
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
            <div className="flex flex-col items-center justify-center text-center py-20 px-8" style={{ height: "600px" }}>
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5">
                <Gamepad2 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">No Platform Featured Yet</h3>
              <p className="text-muted-foreground text-sm max-w-xs mb-5">
                The admin hasn't set a featured platform for the dashboard yet. Browse all available offerwalls.
              </p>
              <Link href="/platforms">
                <Button className="bg-primary text-white font-bold hover:bg-primary/90">
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
