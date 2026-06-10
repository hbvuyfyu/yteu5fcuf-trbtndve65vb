import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronRight, Zap, Coins, Shield, Clock, TrendingUp, Star, Gamepad2, CheckCircle2, Globe, Award, Sparkles, ArrowRight, Wallet, Users } from "lucide-react";

const stats = [
  { value: "$2.4M+", label: "Paid Out", icon: Coins },
  { value: "85K+", label: "Active Users", icon: Users },
  { value: "5+", label: "Offerwalls", icon: Gamepad2 },
  { value: "<24h", label: "Withdrawals", icon: Clock },
];

const features = [
  { icon: Gamepad2, title: "Premium Offerwalls", desc: "Access top-tier platforms including OfferToro, CPX Research, Lootably, Adgate Media, and BitLabs." },
  { icon: Coins, title: "Instant USDT Payouts", desc: "Withdraw directly to your BEP20 or TRC20 wallet with zero hidden fees or delays." },
  { icon: Zap, title: "Real-Time Updates", desc: "Watch your earnings appear instantly as offers are credited to your account." },
  { icon: Shield, title: "Verified & Secure", desc: "Every transaction is reviewed and verified to ensure maximum security." },
  { icon: Clock, title: "24h Processing", desc: "Most withdrawals are completed within 24 hours of approval." },
  { icon: TrendingUp, title: "Unlimited Earnings", desc: "No caps on how much you can earn. Complete as many offers as you want." },
];

const testimonials = [
  { name: "ProGamer_99", amount: "$320", text: "Cashed out multiple times. Fast, reliable, and the best GPT platform I've used.", avatar: "🎮" },
  { name: "CryptoKing88", amount: "$150", text: "Clean interface and real USDT payouts. Exactly what I was looking for.", avatar: "👑" },
  { name: "OfferHunter", amount: "$500+", text: "Been here since day one. Offerwalls pay well and support is excellent.", avatar: "🎯" },
];

const steps = [
  { num: "01", icon: Gamepad2, title: "Choose Your Offers", desc: "Browse through our collection of premium offerwalls and select high-paying games and tasks." },
  { num: "02", icon: Zap, title: "Complete & Earn", desc: "Finish tasks, reach game levels, or complete surveys. Your balance updates instantly." },
  { num: "03", icon: Wallet, title: "Withdraw Crypto", desc: "Request USDT via BEP20 or TRC20. Get paid within 24 hours to your wallet." },
];

const partners = ["OfferToro", "CPX Research", "Lootably", "Adgate Media", "BitLabs"];

function CachvioLogo({ className = "", size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "w-8 h-8", md: "w-10 h-10", lg: "w-12 h-12" };
  const textSizes = { sm: "text-lg", md: "text-xl", lg: "text-2xl" };
  const iconSizes = { sm: "w-4 h-4", md: "w-5 h-5", lg: "w-6 h-6" };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className={`${sizes[size]} rounded-xl bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30`}>
        <Coins className={`${iconSizes[size]} text-black`} />
      </div>
      <span className={`${textSizes[size]} font-black tracking-tight`}>
        <span className="text-white">Cach</span><span className="text-amber-400">vio</span>
      </span>
    </div>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <CachvioLogo />
            <div className="hidden md:flex items-center gap-8">
              <a href="#how-it-works" className="text-sm text-zinc-400 hover:text-amber-400 transition-colors font-medium">How It Works</a>
              <a href="#features" className="text-sm text-zinc-400 hover:text-amber-400 transition-colors font-medium">Features</a>
              <a href="#testimonials" className="text-sm text-zinc-400 hover:text-amber-400 transition-colors font-medium">Reviews</a>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" className="text-white hover:text-amber-400 hover:bg-amber-500/10 font-semibold">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button className="btn-premium px-6 py-2.5 rounded-xl font-bold">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-bg relative min-h-screen flex items-center justify-center pt-20">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] float-animation" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-600/8 rounded-full blur-[100px] float-animation" style={{animationDelay: '2s'}} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-400/5 rounded-full blur-[150px]" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2 mb-8 glass-gold rounded-full">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-bold text-amber-300">$2.4M+ Paid Out to Real Users</span>
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-none mb-8">
            <span className="text-white">Earn Real</span>
            <br />
            <span className="gold-gradient-text">USDT Rewards</span>
          </h1>

          <p className="text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto mb-10 leading-relaxed">
            Complete premium gaming offers, play your favorite games, and withdraw crypto directly to your wallet. No investment required.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link href="/register">
              <Button size="lg" className="btn-premium text-lg px-10 py-6 rounded-2xl font-black group">
                Start Earning Now
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" className="glass text-white text-lg px-10 py-6 rounded-2xl font-bold hover:bg-amber-500/10 hover:border-amber-500/30 transition-all">
                I Have an Account
              </Button>
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-zinc-500">
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-500" /> Free to join</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-500" /> No credit card</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-500" /> Instant payouts</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-500" /> 24/7 support</span>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="w-6 h-10 rounded-full border-2 border-amber-500/30 flex items-start justify-center p-2">
            <div className="w-1.5 h-3 rounded-full bg-amber-500 animate-bounce" />
          </div>
        </div>
      </section>

      {/* Partners Marquee */}
      <section className="py-6 bg-black/50 border-y border-amber-900/20">
        <div className="flex items-center gap-16 whitespace-nowrap px-6" style={{animation: 'marquee 25s linear infinite'}}>
          {[...partners, ...partners].map((p, i) => (
            <span key={i} className="text-sm font-black text-amber-500/40 uppercase tracking-[0.2em] flex-shrink-0">{p}</span>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-b from-black to-zinc-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <div key={stat.label} className="stat-card p-6 text-center group hover:border-amber-500/40 transition-all">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 flex items-center justify-center border border-amber-500/20 group-hover:scale-110 transition-transform">
                  <stat.icon className="w-6 h-6 text-amber-400" />
                </div>
                <div className="text-4xl md:text-5xl font-black gold-gradient-text mb-2">{stat.value}</div>
                <div className="text-sm text-zinc-500 uppercase tracking-wider font-bold">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-[0.2em] mb-4">
              <Sparkles className="w-4 h-4" />
              Simple 3-Step Process
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">How It Works</h2>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto">Start earning crypto in minutes with our simple process</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((step, index) => (
              <div key={step.num} className="premium-card-glow rounded-2xl p-8 relative overflow-hidden group hover:border-amber-500/40 transition-all">
                {/* Step Number */}
                <div className="absolute -top-4 -right-4 text-[150px] font-black text-amber-500/5 select-none leading-none">{step.num}</div>

                {/* Icon */}
                <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 flex items-center justify-center mb-6 border border-amber-500/20 group-hover:border-amber-500/40 group-hover:scale-105 transition-all">
                  <step.icon className="w-8 h-8 text-amber-400" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-zinc-400 leading-relaxed">{step.desc}</p>

                {/* Connector */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-amber-500/50 to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-[0.2em] mb-4">
              Premium Features
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Why Choose Cachvio?</h2>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto">Built to maximize your earnings with industry-leading features</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature) => (
              <div key={feature.title} className="premium-card rounded-xl p-6 group hover:border-amber-500/40 transition-all hover:translate-y-[-2px]">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 flex items-center justify-center border border-amber-500/20 shrink-0 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-sm text-zinc-400 leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Banner */}
      <section className="py-16 bg-gradient-to-b from-zinc-950 to-black">
        <div className="max-w-6xl mx-auto px-6">
          <div className="premium-card-glow rounded-3xl p-8 md:p-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 flex items-center justify-center border border-amber-500/25">
                  <Globe className="w-8 h-8 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Available Worldwide</h3>
                  <p className="text-zinc-400">Withdraw to any BEP20 or TRC20 wallet globally</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 flex items-center justify-center border border-amber-500/25">
                  <Award className="w-8 h-8 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Trusted Platform</h3>
                  <p className="text-zinc-400">$2.4M+ paid out with verified transactions</p>
                </div>
              </div>
              <Link href="/register">
                <Button className="btn-premium px-8 py-3 rounded-xl font-bold">
                  Join Now <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-[0.2em] mb-4">
              <Star className="w-4 h-4" />
              User Testimonials
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">What Our Users Say</h2>
            <p className="text-lg text-zinc-400">Real experiences from real earners</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="premium-card rounded-2xl p-6 group hover:border-amber-500/40 transition-all">
                {/* Stars */}
                <div className="flex items-center gap-1 mb-4">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                </div>

                {/* Quote */}
                <p className="text-zinc-300 leading-relaxed mb-6">"{t.text}"</p>

                {/* Author */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-600/10 flex items-center justify-center text-xl border border-amber-500/20">
                      {t.avatar}
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">{t.name}</div>
                      <div className="text-xs text-amber-400 font-bold">{t.amount} withdrawn</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 bg-gradient-to-b from-black via-zinc-950 to-black relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/10 rounded-full blur-[150px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
            Start Earning Today
            <span className="gold-gradient-text"> — It's Free</span>
          </h2>
          <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
            Join 85,000+ users already earning USDT rewards. No investment, no hidden fees.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="btn-premium text-lg px-12 py-6 rounded-2xl font-black group">
                Create Free Account
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" className="glass text-white text-lg px-12 py-6 rounded-2xl font-bold hover:bg-amber-500/10">
                Sign In
              </Button>
            </Link>
          </div>

          <p className="text-sm text-zinc-600 mt-8">
            Min. withdrawal: $1 USDT · BEP20, TRC20, Sham Cash, Syriatel Cash & Coenex
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-black border-t border-amber-900/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <CachvioLogo />
            <p className="text-zinc-600 text-sm">© {new Date().getFullYear()} Cachvio. All rights reserved.</p>
            <div className="flex items-center gap-8">
              <Link href="/register"><span className="text-sm text-zinc-500 hover:text-amber-400 cursor-pointer transition-colors">Sign Up</span></Link>
              <Link href="/login"><span className="text-sm text-zinc-500 hover:text-amber-400 cursor-pointer transition-colors">Login</span></Link>
            </div>
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
