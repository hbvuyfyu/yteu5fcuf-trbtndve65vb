import { Link, useLocation } from "wouter";
import { useGetMe } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard, Users, ArrowDownUp, Gamepad2, ShieldCheck, KeyRound, Menu, ChevronLeft, Coins, Sparkles } from "lucide-react";
import { removeToken } from "@/lib/auth";
import { useQueryClient } from "@tanstack/react-query";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useEffect } from "react";

const adminNavItems = [
  { href: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/withdrawals", label: "Withdrawals", icon: ArrowDownUp },
  { href: "/admin/platforms", label: "Offerwalls", icon: Gamepad2 },
  { href: "/admin/admins", label: "Admins", icon: ShieldCheck },
  { href: "/admin/verifications", label: "Verif. Codes", icon: KeyRound },
];

function CachvioLogo() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
        <Coins className="w-5 h-5 text-black" />
      </div>
      <span className="text-lg font-black tracking-tight">
        <span className="text-white">Cach</span><span className="text-amber-400">vio</span>
      </span>
    </div>
  );
}

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useGetMe();

  useEffect(() => {
    if (!isLoading && !user) setLocation("/login");
    else if (!isLoading && user && !user.isAdmin && !user.isSuperAdmin) setLocation("/dashboard");
  }, [isLoading, user, setLocation]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-amber-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-500 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user.isAdmin && !user.isSuperAdmin) return null;

  const handleLogout = () => { removeToken(); queryClient.clear(); setLocation("/login"); };

  const NavLinks = ({ closeSheet }: { closeSheet?: () => void }) => (
    <>
      {adminNavItems.map((item) => {
        const isActive = location === item.href;
        return (
          <Link key={item.href} href={item.href} onClick={closeSheet}>
            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer text-sm font-medium group ${
              isActive
                ? "bg-gradient-to-r from-amber-500/20 to-amber-600/10 text-amber-400 border border-amber-500/20"
                : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white border border-transparent"
            }`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                isActive
                  ? "bg-gradient-to-br from-amber-500/30 to-amber-600/20 border border-amber-500/30"
                  : "bg-zinc-800/50 border border-zinc-700/50 group-hover:bg-zinc-700/50"
              }`}>
                <item.icon className={`h-4 w-4 shrink-0 ${isActive ? "text-amber-400" : "text-zinc-500 group-hover:text-white"}`} />
              </div>
              <span>{item.label}</span>
            </div>
          </Link>
        );
      })}
    </>
  );

  return (
    <div className="min-h-screen flex w-full bg-background text-white">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-gradient-to-b from-zinc-900 to-black border-r border-amber-900/20 shrink-0">
        {/* Logo Area */}
        <div className="p-5 border-b border-amber-900/20">
          <Link href="/"><CachvioLogo /></Link>
          <div className="mt-3 flex items-center gap-2">
            <div className="relative">
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shadow-lg shadow-amber-400/50" />
              <div className="absolute inset-0 w-2 h-2 rounded-full bg-amber-400 animate-ping opacity-50" />
            </div>
            <span className="text-[11px] text-amber-400 font-bold uppercase tracking-widest">Admin Panel</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 flex flex-col gap-1.5 overflow-y-auto">
          <NavLinks />
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-amber-900/20 space-y-3">
          {/* User Card */}
          <div className="premium-card rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 flex items-center justify-center border border-amber-500/20">
                <Sparkles className="w-5 h-5 text-amber-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                <p className="text-xs font-bold text-amber-400 uppercase tracking-wider">{user.isSuperAdmin ? "Super Admin" : "Admin"}</p>
              </div>
            </div>
          </div>

          {/* Back to App */}
          <Link href="/dashboard">
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-zinc-400 hover:bg-zinc-800/50 hover:text-white transition-colors cursor-pointer border border-transparent hover:border-amber-500/20">
              <ChevronLeft className="h-4 w-4" />Back to App
            </div>
          </Link>

          {/* Logout Button */}
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-red-400 hover:bg-red-500/10 hover:text-red-400 border border-red-500/10 rounded-xl"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-gradient-to-br from-black via-zinc-950 to-black">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 glass sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <Link href="/"><CachvioLogo /></Link>
            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest">Admin</span>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-amber-500/10">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0 bg-gradient-to-b from-zinc-900 to-black border-amber-900/20">
              <div className="p-5 border-b border-amber-900/20">
                <CachvioLogo />
                <div className="mt-3 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <span className="text-[11px] text-amber-400 font-bold uppercase tracking-widest">Admin Panel</span>
                </div>
              </div>
              <nav className="p-4 flex flex-col gap-1.5">
                <NavLinks />
              </nav>
              <div className="p-4 border-t border-amber-900/20">
                <div className="premium-card rounded-xl p-4 mb-3">
                  <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                  <p className="text-xs font-bold text-amber-400 uppercase tracking-wider">{user.isSuperAdmin ? "Super Admin" : "Admin"}</p>
                </div>
                <Link href="/dashboard">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-zinc-400 hover:bg-zinc-800/50 cursor-pointer mb-2">
                    <ChevronLeft className="h-4 w-4" />Back to App
                  </div>
                </Link>
                <Button variant="ghost" size="sm" className="w-full justify-start text-red-400 hover:bg-red-500/10" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />Logout
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </header>

        {/* Content */}
        <div className="flex-1 p-4 md:p-8 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
