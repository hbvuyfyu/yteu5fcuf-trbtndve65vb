import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronRight, Zap, Coins, Shield, Clock, TrendingUp, Star, Gamepad2, CheckCircle2, Globe, Award } from "lucide-react";

const stats = [
  { value: "$2.4M+", label: "Total Paid Out" },
  { value: "85K+", label: "Active Users" },
  { value: "5+", label: "Offerwall Partners" },
  { value: "<24h", label: "Avg Withdrawal" },
];

const features = [
  { icon: Gamepad2, title: "5+ Premium Offerwalls", desc: "OfferToro, CPX Research, Lootably, Adgate Media, BitLabs — all in one platform." },
  { icon: Coins, title: "Instant USDT Payouts", desc: "Withdraw to BEP20 or TRC20 wallets with zero hidden fees." },
  { icon: Zap, title: "Real-Time Balance", desc: "Earnings appear the moment an offer is credited to your account." },
  { icon: Shield, title: "Verified & Secure", desc: "Every withdrawal is reviewed before processing to keep you safe." },
  { icon: Clock, title: "Fast Processing", desc: "Most withdrawals are processed within 24 hours of approval." },
  { icon: TrendingUp, title: "No Earning Cap", desc: "Complete unlimited offers and grow your balance as high as you want." },
];

const testimonials = [
  { name: "ProGamer_99", amount: "$320 withdrawn", text: "Cashed out three times already. Always fast and accurate. Best GPT site I've used." },
  { name: "CryptoKing88", amount: "$150 withdrawn", text: "The UI is clean, USDT payouts are real. No shady business, just straight earnings." },
  { name: "OfferHunter", amount: "$500+ withdrawn", text: "Been here since day one. The offerwalls pay and support is responsive." },
];

const steps = [
  { num: "01", icon: Gamepad2, title: "Choose an Offer", desc: "Browse our premium offerwalls and select the games and tasks that pay the most." },
  { num: "02", icon: Zap, title: "Complete & Earn", desc: "Finish tasks or reach game levels. Your balance updates instantly upon completion." },
  { num: "03", icon: Coins, title: "Withdraw Crypto", desc: "Request USDT via BEP20 or TRC20. Processed within 24 hours to your wallet." },
];

const partners = ["OfferToro", "CPX Research", "Lootably", "Adgate Media", "BitLabs"];

function CachvioLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-yellow-500 via-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-500/30">
        <Coins className="w-5 h-5 text-black" />
      </div>
      <span className="text-xl font-black tracking-tight text-white">
        Cach<span className="text-yellow-400">vio</span>
      </span>
    </div>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-border/50 bg-black/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex justify-between items-center">
          <CachvioLogo />
          <div className="hidden md:flex gap-7 text-sm text-muted-foreground items-center">
            <a href="#how-it-works" className="hover:text-yellow-400 transition-colors font-medium">How It Works</a>
            <a href="#features" className="hover:text-yellow-400 transition-colors font-medium">Features</a>
            <a href="#reviews" className="hover:text-yellow-400 transition-colors font-medium">Reviews</a>
          </div>
          <div className="flex gap-2 items-center">
            <Link href="/login">
              <Button variant="ghost" className="font-semibold text-sm text-white hover:text-yellow-400 hover:bg-yellow-400/10">Login</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-black font-bold shadow-lg shadow-yellow-500/30 text-sm hover:from-yellow-400 hover:to-yellow-300 transition-all">
                Sign Up Free
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-28 pb-20 md:pt-44 md:pb-32 bg-gradient-to-b from-black via-zinc-900 to-black text-white overflow-hidden">
        {/* Background effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-yellow-600/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none opacity-5" style={{backgroundImage: 'linear-gradient(rgba(212,175,55,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.4) 1px, transparent 1px)', backgroundSize: '50px 50px'}} />

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-yellow-500/10 backdrop-blur-sm border border-yellow-500/30 rounded-full px-4 py-1.5 text-sm font-bold text-yellow-300">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse shadow-lg shadow-yellow-400/50" />
            $2.4M+ Paid Out to Real Users
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter leading-none drop-shadow-lg">
            Earn Real <span className="text-yellow-400">USDT</span><br />
            From Your Phone
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Complete premium offers, play games, and withdraw crypto directly to your wallet — no investment, no limits, no tricks.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link href="/register">
              <Button size="lg" className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-black hover:from-yellow-400 hover:to-yellow-300 font-black text-lg px-10 h-14 shadow-xl shadow-yellow-500/30 w-full sm:w-auto group border-0">
                Start Earning Free
                <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" className="bg-yellow-500/10 backdrop-blur-sm border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20 font-bold h-14 px-8 w-full sm:w-auto">
                I Have an Account
              </Button>
            </Link>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-5 text-sm text-zinc-500 pt-1">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-yellow-500" /> Free to join</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-yellow-500" /> No credit card</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-yellow-500" /> Instant withdrawals</span>
          </div>
        </div>
      </section>

      {/* Partners marquee */}
      <section className="bg-black border-b border-border py-3 overflow-hidden">
        <div className="flex items-center gap-10 whitespace-nowrap px-4" style={{animation: 'marquee 18s linear infinite'}}>
          {[...partners, ...partners].map((p, i) => (
            <span key={i} className="text-xs font-black text-yellow-500/60 uppercase tracking-[0.15em] flex-shrink-0">{p}</span>
          ))}
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-zinc-950 border-b border-border py-12 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label} className="p-4">
              <div className="text-3xl md:text-4xl font-black text-yellow-400">{s.value}</div>
              <div className="text-xs text-zinc-500 mt-1.5 uppercase tracking-widest font-bold">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 px-4 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-bold text-yellow-500 uppercase tracking-[0.2em] mb-3 block">Simple Process</span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-3">How It Works</h2>
            <p className="text-zinc-500 text-lg max-w-xl mx-auto">Three simple steps to get crypto in your wallet.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step) => (
              <div key={step.num} className="dark-card rounded-2xl p-8 relative overflow-hidden group hover:border-yellow-500/40 transition-all duration-300">
                <div className="absolute top-4 right-6 text-7xl font-black text-yellow-500/5 select-none group-hover:text-yellow-500/10 transition-colors">{step.num}</div>
                <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 w-14 h-14 rounded-xl flex items-center justify-center mb-6 border border-yellow-500/20">
                  <step.icon className="w-7 h-7 text-yellow-400" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">{step.title}</h3>
                <p className="text-zinc-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-zinc-950 border-y border-border px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-bold text-yellow-500 uppercase tracking-[0.2em] mb-3 block">Why Cachvio</span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-3">Everything You Need</h2>
            <p className="text-zinc-500 text-lg">Built to maximize your earnings, secured and verified.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <div key={f.title} className="dark-card rounded-xl p-6 hover:border-yellow-500/40 transition-all duration-200 group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 flex items-center justify-center border border-yellow-500/20 group-hover:border-yellow-500/40 transition-colors">
                    <f.icon className="h-5 w-5 text-yellow-400" />
                  </div>
                  <h3 className="font-bold text-white">{f.title}</h3>
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Reach Banner */}
      <section className="py-14 px-4 bg-black border-b border-border">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 dark-card rounded-2xl p-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border border-yellow-500/25 flex items-center justify-center shrink-0">
              <Globe className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Available Worldwide</h3>
              <p className="text-zinc-500 text-sm">Withdraw to any BEP20 or TRC20 wallet, anywhere.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border border-yellow-500/25 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Trusted Platform</h3>
              <p className="text-zinc-500 text-sm">Transparent system, no hidden fees, verified payouts.</p>
            </div>
          </div>
          <Link href="/register">
            <Button className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-black font-bold px-8 h-11 shadow-lg shadow-yellow-500/30 shrink-0 hover:from-yellow-400 hover:to-yellow-300">
              Join Now <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section id="reviews" className="py-24 px-4 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-bold text-yellow-500 uppercase tracking-[0.2em] mb-3 block">Community</span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-3">Users Trust Cachvio</h2>
            <p className="text-zinc-500 text-lg">Real users, real withdrawals.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="dark-card rounded-2xl p-6 hover:border-yellow-500/40 transition-all duration-200">
                <div className="flex items-center gap-1 mb-4">
                  {[1,2,3,4,5].map(i => <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-zinc-300 leading-relaxed mb-5 text-sm">"{t.text}"</p>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white text-sm">{t.name}</div>
                    <div className="text-xs text-yellow-400 font-bold mt-0.5">{t.amount}</div>
                  </div>
                  <div className="w-9 h-9 bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border border-yellow-500/20 rounded-full flex items-center justify-center">
                    <Coins className="h-4 w-4 text-yellow-400" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24 px-4 bg-gradient-to-b from-zinc-900 via-black to-black text-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-5" style={{backgroundImage: 'linear-gradient(rgba(212,175,55,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.4) 1px, transparent 1px)', backgroundSize: '50px 50px'}} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter">
            Start Earning<br />Today — It's Free
          </h2>
          <p className="text-xl text-zinc-400 max-w-xl mx-auto">Join 85,000+ users already earning USDT. No investment required.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <Link href="/register">
              <Button size="lg" className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-black hover:from-yellow-400 hover:to-yellow-300 font-black text-lg px-12 h-14 shadow-xl shadow-yellow-500/30 w-full sm:w-auto border-0">
                Create Free Account
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20 font-bold h-14 px-10 w-full sm:w-auto">
                Sign In
              </Button>
            </Link>
          </div>
          <p className="text-sm text-zinc-600">Minimum withdrawal: $1 USDT · BEP20, TRC20, Sham Cash, Syriatel Cash & Coenex supported</p>
        </div>
      </section>

      <footer className="border-t border-border bg-black py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <CachvioLogo />
          <p className="text-zinc-600 text-sm">© {new Date().getFullYear()} Cachvio. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-zinc-500">
            <Link href="/register"><span className="hover:text-yellow-400 cursor-pointer transition-colors">Sign Up</span></Link>
            <Link href="/login"><span className="hover:text-yellow-400 cursor-pointer transition-colors">Login</span></Link>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
