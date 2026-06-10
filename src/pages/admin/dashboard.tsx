import { AdminLayout as Layout } from "@/components/admin-layout";
import { useGetAdminStats } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Users, Gamepad2, Coins, Clock, TrendingUp, UserCheck, Activity, ArrowDownUp } from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

const earningsData = [
  { month: "Jan", earnings: 1200, withdrawals: 900 },
  { month: "Feb", earnings: 1800, withdrawals: 1200 },
  { month: "Mar", earnings: 2400, withdrawals: 1900 },
  { month: "Apr", earnings: 2100, withdrawals: 1700 },
  { month: "May", earnings: 3200, withdrawals: 2600 },
  { month: "Jun", earnings: 2900, withdrawals: 2300 },
  { month: "Jul", earnings: 4100, withdrawals: 3400 },
];

const userGrowthData = [
  { month: "Jan", users: 3200 },
  { month: "Feb", users: 4800 },
  { month: "Mar", users: 7200 },
  { month: "Apr", users: 9100 },
  { month: "May", users: 12400 },
  { month: "Jun", users: 18700 },
  { month: "Jul", users: 24300 },
];

const platformData = [
  { name: "OfferToro", value: 35, color: "#facc15" },
  { name: "CPX Research", value: 25, color: "#fbbf24" },
  { name: "Lootably", value: 20, color: "#f59e0b" },
  { name: "Adgate", value: 12, color: "#d97706" },
  { name: "BitLabs", value: 8, color: "#b45309" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="premium-card rounded-xl p-3 shadow-lg text-xs border border-amber-500/20">
        <p className="font-bold text-white mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color }} className="font-medium">
            {p.name}: ${p.value?.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AdminDashboard() {
  const { data: stats, isLoading } = useGetAdminStats();

  const statCards = [
    { label: "Total Users", value: stats?.totalUsers, sub: `${stats?.activeUsers ?? 0} active`, icon: Users, color: "text-blue-400", gradient: "from-blue-500/15 to-blue-600/8", border: "border-blue-500/20", bgIcon: "bg-gradient-to-br from-blue-500/20 to-blue-600/10" },
    { label: "System Balance", value: `${stats?.totalBalanceInSystem ?? 0} USDT`, sub: "across all wallets", icon: Coins, color: "text-amber-400", gradient: "from-amber-500/15 to-amber-600/8", border: "border-amber-500/20", bgIcon: "bg-gradient-to-br from-amber-500/20 to-amber-600/10" },
    { label: "Total Withdrawn", value: `${stats?.totalWithdrawnAllTime ?? 0} USDT`, sub: "all time", icon: TrendingUp, color: "text-emerald-400", gradient: "from-emerald-500/15 to-emerald-600/8", border: "border-emerald-500/20", bgIcon: "bg-gradient-to-br from-emerald-500/20 to-emerald-600/10" },
    { label: "Pending", value: stats?.pendingWithdrawals, sub: "awaiting review", icon: Clock, color: "text-red-400", gradient: "from-red-500/15 to-red-600/8", border: "border-red-500/20", bgIcon: "bg-gradient-to-br from-red-500/20 to-red-600/10" },
    { label: "Platforms", value: stats?.totalPlatforms, sub: "offerwalls", icon: Gamepad2, color: "text-purple-400", gradient: "from-purple-500/15 to-purple-600/8", border: "border-purple-500/20", bgIcon: "bg-gradient-to-br from-purple-500/20 to-purple-600/10" },
    { label: "Admins", value: "—", sub: "manage access", icon: UserCheck, color: "text-teal-400", gradient: "from-teal-500/15 to-teal-600/8", border: "border-teal-500/20", bgIcon: "bg-gradient-to-br from-teal-500/20 to-teal-600/10" },
  ];

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-600/10 flex items-center justify-center border border-amber-500/20">
              <Activity className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white">Admin Overview</h1>
              <p className="text-zinc-500 text-sm">System-wide metrics and analytics</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-2 font-bold">
            <div className="relative">
              <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse shadow-lg shadow-amber-400/50" />
              <div className="absolute inset-0 w-2 h-2 bg-amber-400 rounded-full animate-ping opacity-50" />
            </div>
            Live Data
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-3">
          {statCards.map((stat) => (
            <div
              key={stat.label}
              className={`premium-card rounded-xl p-5 glass transition-all duration-200`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-lg ${stat.bgIcon} flex items-center justify-center border ${stat.border}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
              {isLoading ? (
                <Skeleton className="h-8 w-24 mt-1 bg-zinc-800 rounded" />
              ) : (
                <div className="text-2xl font-black text-white">{stat.value ?? "—"}</div>
              )}
              <p className="text-[10px] text-zinc-500 mt-1 uppercase tracking-wider font-bold">{stat.sub}</p>
              <p className="text-xs text-zinc-400 mt-2">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Earnings vs Withdrawals */}
          <div className="premium-card rounded-2xl lg:col-span-2 overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-amber-900/20">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-600/10 flex items-center justify-center border border-amber-500/20">
                <TrendingUp className="h-4 w-4 text-amber-400" />
              </div>
              <div>
                <h2 className="font-bold text-white text-sm">Earnings vs Withdrawals</h2>
                <p className="text-xs text-zinc-500">Monthly platform performance (USD)</p>
              </div>
            </div>
            <div className="p-6">
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={earningsData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="earningsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#facc15" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#facc15" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="withdrawalsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#71717a' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#71717a' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Area type="monotone" dataKey="earnings" name="Earnings" stroke="#facc15" strokeWidth={2} fill="url(#earningsGrad)" />
                  <Area type="monotone" dataKey="withdrawals" name="Withdrawals" stroke="#60a5fa" strokeWidth={2} fill="url(#withdrawalsGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Platform Distribution */}
          <div className="premium-card rounded-2xl overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-amber-900/20">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/10 flex items-center justify-center border border-purple-500/20">
                <Gamepad2 className="h-4 w-4 text-purple-400" />
              </div>
              <div>
                <h2 className="font-bold text-white text-sm">Platform Share</h2>
                <p className="text-xs text-zinc-500">Traffic distribution</p>
              </div>
            </div>
            <div className="p-6">
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={platformData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                    {platformData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val: any) => [`${val}%`, 'Share']} contentStyle={{ background: 'rgb(24 24 27)', border: '1px solid rgb(63 63 70)', borderRadius: '8px', fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-3">
                {platformData.map((p) => (
                  <div key={p.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                      <span className="text-zinc-400">{p.name}</span>
                    </div>
                    <span className="font-bold text-white">{p.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid gap-4 lg:grid-cols-3">
          {/* User Growth */}
          <div className="premium-card rounded-2xl lg:col-span-2 overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-amber-900/20">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/10 flex items-center justify-center border border-blue-500/20">
                <Users className="h-4 w-4 text-blue-400" />
              </div>
              <div>
                <h2 className="font-bold text-white text-sm">User Growth</h2>
                <p className="text-xs text-zinc-500">Cumulative registered users</p>
              </div>
            </div>
            <div className="p-6">
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={userGrowthData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#71717a' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#71717a' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: 'rgb(24 24 27)', border: '1px solid rgb(63 63 70)', borderRadius: '8px', fontSize: '11px' }} />
                  <Bar dataKey="users" name="Users" fill="#facc15" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Actions & Alerts */}
          <div className="premium-card rounded-2xl overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-amber-900/20">
              <h2 className="font-bold text-white text-sm">Quick Actions</h2>
            </div>
            <div className="p-4 grid grid-cols-2 gap-2">
              <Link href="/admin/withdrawals">
                <Button variant="outline" className="w-full h-auto py-3.5 flex flex-col gap-1 border-zinc-700 hover:border-amber-500/40 hover:text-amber-400 text-xs">
                  <ArrowDownUp className="h-5 w-5" />
                  <span>Withdrawals</span>
                </Button>
              </Link>
              <Link href="/admin/users">
                <Button variant="outline" className="w-full h-auto py-3.5 flex flex-col gap-1 border-zinc-700 hover:border-amber-500/40 hover:text-amber-400 text-xs">
                  <Users className="h-5 w-5" />
                  <span>Users</span>
                </Button>
              </Link>
              <Link href="/admin/platforms">
                <Button variant="outline" className="w-full h-auto py-3.5 flex flex-col gap-1 border-zinc-700 hover:border-amber-500/40 hover:text-amber-400 text-xs">
                  <Gamepad2 className="h-5 w-5" />
                  <span>Offerwalls</span>
                </Button>
              </Link>
              <Link href="/admin/verifications">
                <Button variant="outline" className="w-full h-auto py-3.5 flex flex-col gap-1 border-zinc-700 hover:border-amber-500/40 hover:text-amber-400 text-xs">
                  <Clock className="h-5 w-5" />
                  <span>Verif. Codes</span>
                </Button>
              </Link>
            </div>

            {stats?.pendingWithdrawals && Number(stats.pendingWithdrawals) > 0 ? (
              <div className="p-4 border-t border-amber-900/20">
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 space-y-3">
                  <p className="text-xs font-bold text-red-400 uppercase tracking-wider">Action Required</p>
                  <p className="text-white font-bold text-lg">{stats.pendingWithdrawals} pending</p>
                  <Link href="/admin/withdrawals">
                    <Button className="bg-red-500 text-white hover:bg-red-600 font-bold w-full text-xs h-8">
                      Review Now
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="p-4 border-t border-amber-900/20">
                <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
                  <p className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">System Status</p>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse shadow-lg shadow-amber-400/50" />
                      <div className="absolute inset-0 w-2 h-2 bg-amber-400 rounded-full animate-ping opacity-50" />
                    </div>
                    <span className="text-xs text-zinc-400 font-medium">All systems operational</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
