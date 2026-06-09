import { Link, useLocation } from "wouter";
import { useGetMe } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard, Users, ArrowDownUp, Gamepad2, ShieldCheck, KeyRound, Menu, ChevronLeft, Coins } from "lucide-react";
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
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-500 via-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-500/30">
        <Coins className="w-4 h-4 text-black" />
      </div>
      <span className="text-lg font-black tracking-tight text-white">Cach<span className="text-yellow-400">vio</span></span>
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
          <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-500 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user.isAdmin && !user.isSuperAdmin) return null;

  const handleLogout = () => { removeToken(); queryClient.clear(); setLocation("/login"); };

  const NavLinks = ({ closeSheet }: { closeSheet?: () => void }) => (
    <>
      {adminNavItems.map((item) => (
        <Link key={item.href} href={item.href} onClick={closeSheet}>
          <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all cursor-pointer text-sm font-medium ${
            location === item.href ? "bg-gradient-to-r from-yellow-500 to-yellow-400 text-black shadow-lg shadow-yellow-500/30" : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
          }`}>
            <item.icon className="h-4 w-4 shrink-0" />{item.label}
          </div>
        </Link>
      ))}
    </>
  );

  return (
    <div className="min-h-screen flex w-full bg-background text-foreground">
      <aside className="hidden lg:flex flex-col w-60 border-r border-border bg-sidebar shrink-0">
        <div className="p-5 border-b border-border">
          <Link href="/"><CachvioLogo /></Link>
          <div className="mt-2 flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse shadow-lg shadow-yellow-400/50" />
            <span className="text-[11px] text-yellow-400 font-bold uppercase tracking-widest">Admin Panel</span>
          </div>
        </div>
        <nav className="flex-1 p-3 flex flex-col gap-1 overflow-y-auto"><NavLinks /></nav>
        <div className="p-3 border-t border-border space-y-2">
          <Link href="/dashboard">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-zinc-400 hover:bg-zinc-800/50 hover:text-white transition-colors cursor-pointer">
              <ChevronLeft className="h-4 w-4" />Back to App
            </div>
          </Link>
          <div className="px-3 py-2 rounded-lg bg-zinc-800/50 border border-zinc-700">
            <p className="text-xs text-zinc-500 truncate">{user.email}</p>
            <p className="text-xs font-bold text-yellow-400 uppercase tracking-wider">{user.isSuperAdmin ? "Super Admin" : "Admin"}</p>
          </div>
          <Button variant="ghost" size="sm" className="w-full justify-start text-red-400 hover:bg-red-500/10 hover:text-red-400" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />Logout
          </Button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden flex items-center justify-between p-4 border-b border-border bg-sidebar sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <CachvioLogo />
            <span className="text-[10px] text-yellow-400 font-bold uppercase tracking-widest hidden sm:block">Admin</span>
          </div>
          <Sheet>
            <SheetTrigger asChild><Button variant="ghost" size="icon" className="text-white"><Menu className="h-5 w-5" /></Button></SheetTrigger>
            <SheetContent side="left" className="w-60 p-0 bg-sidebar border-border">
              <div className="p-5 border-b border-border">
                <CachvioLogo />
                <div className="mt-2 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                  <span className="text-[11px] text-yellow-400 font-bold uppercase tracking-widest">Admin Panel</span>
                </div>
              </div>
              <nav className="p-3 flex flex-col gap-1"><NavLinks /></nav>
              <div className="p-3 border-t border-border">
                <Link href="/dashboard">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-zinc-400 hover:bg-zinc-800/50 cursor-pointer">
                    <ChevronLeft className="h-4 w-4" />Back to App
                  </div>
                </Link>
                <Button variant="ghost" size="sm" className="w-full justify-start text-red-400 hover:bg-red-500/10 mt-1" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />Logout
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </header>
        <div className="flex-1 p-4 md:p-6 overflow-auto">{children}</div>
      </main>
    </div>
  );
}
