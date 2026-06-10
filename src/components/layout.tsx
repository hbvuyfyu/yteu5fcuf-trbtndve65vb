import { Link, useLocation } from "wouter";
import { useGetMe } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { LogOut, Home, Wallet, History, Send, Gamepad2, Settings, ShieldAlert, Menu, Languages, Coins, Sparkles } from "lucide-react";
import { removeToken } from "@/lib/auth";
import { useQueryClient } from "@tanstack/react-query";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useEffect, useMemo, useState } from "react";

const translations = {
  en: { dashboard: "Dashboard", balance: "Balance", transactions: "Transactions", withdraw: "Withdraw", platforms: "Platforms", settings: "Settings", adminPanel: "Admin Panel", logout: "Logout", loading: "Loading..." },
  ar: { dashboard: "لوحة التحكم", balance: "الرصيد", transactions: "العمليات", withdraw: "سحب", platforms: "المنصات", settings: "الإعدادات", adminPanel: "لوحة الأدمن", logout: "تسجيل الخروج", loading: "جاري التحميل..." },
} as const;

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

export function Layout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useGetMe();
  const [language, setLanguage] = useState<"en" | "ar">(() => (localStorage.getItem("cv-language") as "en" | "ar") || "en");

  useEffect(() => {
    localStorage.setItem("cv-language", language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);

  useEffect(() => {
    if (!isLoading && !user) setLocation("/login");
  }, [isLoading, user, setLocation]);

  const t = useMemo(() => translations[language], [language]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-amber-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-500 text-sm">{t.loading}</p>
        </div>
      </div>
    );
  }

  const handleLogout = () => { removeToken(); queryClient.clear(); setLocation("/login"); };

  const navItems = [
    { href: "/dashboard", label: t.dashboard, icon: Home },
    { href: "/balance", label: t.balance, icon: Wallet },
    { href: "/transactions", label: t.transactions, icon: History },
    { href: "/withdraw", label: t.withdraw, icon: Send },
    { href: "/platforms", label: t.platforms, icon: Gamepad2 },
    { href: "/settings", label: t.settings, icon: Settings },
    ...(user.isAdmin || user.isSuperAdmin ? [{ href: "/admin/dashboard", label: t.adminPanel, icon: ShieldAlert }] : []),
  ];

  const NavLinks = ({ closeSheet }: { closeSheet?: () => void }) => (
    <>
      {navItems.map((item) => {
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
              {item.href === "/admin/dashboard" && (
                <span className="ml-auto text-[9px] bg-amber-500/15 text-amber-400 px-2 py-0.5 rounded-lg font-bold uppercase tracking-wider border border-amber-500/20">Admin</span>
              )}
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
        <div className="p-6 border-b border-amber-900/20">
          <div className="flex items-center justify-between">
            <Link href="/"><CachvioLogo /></Link>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLanguage(language === "en" ? "ar" : "en")}
              className="h-8 px-3 text-xs border-amber-500/20 text-amber-400 hover:bg-amber-500/10 hover:border-amber-500/30"
            >
              <Languages className="h-3.5 w-3.5 mr-1" />
              {language === "en" ? "AR" : "EN"}
            </Button>
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
                <p className="text-sm font-bold text-white truncate">{user.username}</p>
                <p className="text-xs text-zinc-500 truncate">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-red-400 hover:bg-red-500/10 hover:text-red-400 border border-red-500/10 rounded-xl"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            {t.logout}
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-gradient-to-br from-black via-zinc-950 to-black">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 glass sticky top-0 z-50">
          <Link href="/"><CachvioLogo /></Link>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLanguage(language === "en" ? "ar" : "en")}
              className="h-8 px-3 text-xs border-amber-500/20 text-amber-400"
            >
              <Languages className="h-3.5 w-3.5 mr-1" />
              {language === "en" ? "AR" : "EN"}
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-amber-500/10">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0 bg-gradient-to-b from-zinc-900 to-black border-amber-900/20">
                <div className="p-6 border-b border-amber-900/20">
                  <CachvioLogo />
                </div>
                <nav className="p-4 flex flex-col gap-1.5">
                  <NavLinks />
                </nav>
                <div className="p-4 border-t border-amber-900/20">
                  <div className="premium-card rounded-xl p-4 mb-3">
                    <p className="text-sm font-bold text-white truncate">{user.username}</p>
                    <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="w-full justify-start text-red-400 hover:bg-red-500/10" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />{t.logout}
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </header>

        {/* Mobile Bottom Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass border-t border-amber-900/20">
          <div className="flex items-center justify-around py-2 px-2">
            {navItems.slice(0, 5).map((item) => {
              const isActive = location === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <div className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all cursor-pointer ${
                    isActive ? "bg-amber-500/10" : "hover:bg-zinc-800/50"
                  }`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isActive
                        ? "bg-gradient-to-br from-amber-500/30 to-amber-600/20 border border-amber-500/30"
                        : "bg-zinc-800/50 border border-zinc-700/50"
                    }`}>
                      <item.icon className={`h-4 w-4 ${isActive ? "text-amber-400" : "text-zinc-500"}`} />
                    </div>
                    <span className={`text-[10px] font-bold ${isActive ? "text-amber-400" : "text-zinc-500"}`}>
                      {item.label.toString().split(' ')[0]}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Content */}
        <div className="flex-1 p-4 md:p-8 overflow-auto pb-24 md:pb-8">
          {children}
        </div>
      </main>
    </div>
  );
}
