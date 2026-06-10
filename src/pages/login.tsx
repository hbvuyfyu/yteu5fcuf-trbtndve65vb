import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLogin } from "@workspace/api-client-react";
import { setToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Coins, Sparkles, Zap, Shield, Wallet } from "lucide-react";

const loginSchema = z.object({ email: z.string().email("Invalid email"), password: z.string().min(1, "Required") });
type LoginFormValues = z.infer<typeof loginSchema>;

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

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const loginMutation = useLogin();
  const form = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema), defaultValues: { email: "", password: "" } });

  const onSubmit = (data: LoginFormValues) => {
    loginMutation.mutate({ data }, {
      onSuccess: (res) => { setToken(res.token); toast({ title: "Welcome back!" }); setLocation("/dashboard"); },
      onError: (error: any) => { toast({ variant: "destructive", title: "Login failed", description: error.data?.error || error.message }); },
    });
  };

  const features = [
    { icon: Wallet, text: "Access your wallet instantly" },
    { icon: Zap, text: "Real-time balance updates" },
    { icon: Shield, text: "Secure encrypted transactions" },
  ];

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
          <h2 className="text-4xl font-black text-white mb-4">Welcome Back</h2>
          <p className="text-lg text-zinc-400 mb-12">Sign in to access your earnings and continue your journey.</p>

          {/* Features */}
          <div className="space-y-4 text-left">
            {features.map((feature, i) => (
              <div key={i} className="flex items-center gap-4 p-4 premium-card rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-600/10 flex items-center justify-center border border-amber-500/20 shrink-0">
                  <feature.icon className="w-5 h-5 text-amber-400" />
                </div>
                <span className="text-zinc-300 font-medium">{feature.text}</span>
              </div>
            ))}
          </div>

          {/* Badge */}
          <div className="mt-12 inline-flex items-center gap-2 px-4 py-2 glass-gold rounded-full">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-bold text-amber-300">$2.4M+ paid out</span>
          </div>
        </div>
      </div>

      {/* Right - Login Form */}
      <div className="flex-1 lg:max-w-xl flex flex-col items-center justify-center px-8 py-12 bg-black relative">
        {/* Mobile Logo */}
        <div className="lg:hidden mb-10">
          <CachvioLogo />
        </div>

        {/* Form Container */}
        <div className="w-full max-w-sm">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-black text-white mb-2">Sign In</h1>
            <p className="text-zinc-500">Enter your credentials to continue</p>
          </div>

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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

              <FormField control={form.control} name="password" render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-center mb-1.5">
                    <FormLabel className="text-xs uppercase tracking-wider font-bold text-zinc-500">Password</FormLabel>
                    <Link href="/forgot-password">
                      <span className="text-xs text-amber-400 hover:text-amber-300 cursor-pointer font-semibold">Forgot password?</span>
                    </Link>
                  </div>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••••"
                      {...field}
                      className="h-12 dark-input rounded-xl"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <Button
                type="submit"
                className="w-full h-12 btn-premium rounded-xl font-bold"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? <Loader2 className="animate-spin h-5 w-5" /> : "Sign In to Your Account"}
              </Button>
            </form>
          </Form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-zinc-800" />
            <span className="text-xs text-zinc-600 uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-zinc-800" />
          </div>

          {/* Register Link */}
          <div className="text-center">
            <p className="text-zinc-500 text-sm mb-4">Don't have an account yet?</p>
            <Link href="/register">
              <Button variant="outline" className="w-full h-12 rounded-xl border-amber-500/30 text-amber-400 hover:bg-amber-500/10 hover:border-amber-500/50 font-bold">
                Create Free Account
              </Button>
            </Link>
          </div>

          {/* Terms */}
          <p className="text-center text-xs text-zinc-600 mt-8">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
