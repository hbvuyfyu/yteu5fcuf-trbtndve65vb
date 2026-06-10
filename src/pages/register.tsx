import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { setToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Coins, Sparkles, Zap, Shield, Wallet, Gift } from "lucide-react";
import { customFetch } from "@/lib/api-client/custom-fetch";
import type { AuthResponse } from "@/lib/api-client";
import { useMutation } from "@tanstack/react-query";

const registerSchema = z.object({
  email: z.string().email("Invalid email"),
  username: z.string().min(3, "Min 3 characters").max(30),
  password: z.string().min(8, "Min 8 characters"),
});
type RegisterFormValues = z.infer<typeof registerSchema>;

function CachvioLogo() {
  return (
    <div className="flex items-center justify-center gap-3">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
        <Coins className="w-6 h-6 text-black" />
      </div>
      <div className="text-2xl font-black tracking-tight">
        <span className="text-white">Cach</span><span className="text-amber-400">vio</span>
      </div>
    </div>
  );
}

const perks = [
  { icon: Gift, text: "Free to join — No credit card required" },
  { icon: Zap, text: "Instant USDT withdrawals to any wallet" },
  { icon: Shield, text: "Access 5+ premium offerwalls" },
];

export default function Register() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const form = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema), defaultValues: { email: "", username: "", password: "" } });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterFormValues) => customFetch<AuthResponse>("/api/auth/register", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: (res) => { setToken(res.token); toast({ title: "Welcome to Cachvio!" }); setLocation("/dashboard"); },
    onError: (error: any) => { toast({ variant: "destructive", title: "Registration failed", description: error.data?.error || error.message }); },
  });

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left - Decorative Panel */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-gradient-to-br from-black via-zinc-900 to-black items-center justify-center p-16">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/15 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-600/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-400/5 rounded-full blur-[150px]" />
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(212, 175, 55, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(212, 175, 55, 0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />

        {/* Content */}
        <div className="relative z-10 text-center max-w-md">
          {/* Logo */}
          <div className="mb-12">
            <CachvioLogo />
          </div>

          {/* Heading */}
          <h2 className="text-4xl font-black text-white mb-4">Start Earning Today</h2>
          <p className="text-lg text-zinc-400 mb-12">Create your free account and start withdrawing USDT in minutes.</p>

          {/* Perks */}
          <div className="space-y-4 text-left">
            {perks.map((perk, i) => (
              <div key={i} className="flex items-center gap-4 p-4 premium-card rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-600/10 flex items-center justify-center border border-amber-500/20 shrink-0">
                  <perk.icon className="w-5 h-5 text-amber-400" />
                </div>
                <span className="text-zinc-300 font-medium">{perk.text}</span>
              </div>
            ))}
          </div>

          {/* Badge */}
          <div className="mt-12 inline-flex items-center gap-2 px-4 py-2 glass-gold rounded-full">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-bold text-amber-300">Join 85,000+ users</span>
          </div>
        </div>
      </div>

      {/* Right - Register Form */}
      <div className="flex-1 lg:max-w-xl flex flex-col items-center justify-center px-8 py-12 bg-black relative">
        {/* Mobile Logo */}
        <div className="lg:hidden mb-10">
          <CachvioLogo />
        </div>

        {/* Form Container */}
        <div className="w-full max-w-sm">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-black text-white mb-2">Create Account</h1>
            <p className="text-zinc-500">Join thousands of users earning USDT daily</p>
          </div>

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(registerMutation.mutate)} className="space-y-4">
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs uppercase tracking-wider font-bold text-zinc-500">Email Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="you@example.com"
                      {...field}
                      className="h-12 dark-input rounded-xl"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="username" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs uppercase tracking-wider font-bold text-zinc-500">Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="YourUsername"
                      {...field}
                      className="h-12 dark-input rounded-xl"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="password" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs uppercase tracking-wider font-bold text-zinc-500">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Min. 8 characters"
                      {...field}
                      className="h-12 dark-input rounded-xl"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <Button
                type="submit"
                className="w-full h-12 btn-premium rounded-xl font-bold mt-2"
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending ? <Loader2 className="animate-spin h-5 w-5" /> : "Create Free Account"}
              </Button>
            </form>
          </Form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-zinc-800" />
            <span className="text-xs text-zinc-600 uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-zinc-800" />
          </div>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-zinc-500 text-sm mb-4">Already have an account?</p>
            <Link href="/login">
              <Button variant="outline" className="w-full h-12 rounded-xl border-amber-500/30 text-amber-400 hover:bg-amber-500/10 hover:border-amber-500/50 font-bold">
                Sign In Instead
              </Button>
            </Link>
          </div>

          {/* Terms */}
          <p className="text-center text-xs text-zinc-600 mt-8">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
