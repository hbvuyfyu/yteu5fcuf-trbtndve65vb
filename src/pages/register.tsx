import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { setToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle2, Coins } from "lucide-react";
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
    <div className="flex items-center justify-center gap-2">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 via-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-500/30">
        <Coins className="w-6 h-6 text-black" />
      </div>
      <span className="text-2xl font-black tracking-tight text-white">Cach<span className="text-yellow-400">vio</span></span>
    </div>
  );
}

const perks = ["Free to join — no credit card required", "Withdraw USDT to your wallet instantly", "Access 5+ premium offerwalls"];

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
      {/* Left decorative */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-zinc-900 via-black to-zinc-950 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-5" style={{backgroundImage: 'linear-gradient(rgba(212,175,55,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.5) 1px, transparent 1px)', backgroundSize: '40px 40px'}} />
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-yellow-600/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl pointer-events-none" />
        <div className="relative z-10 text-white text-center space-y-6 max-w-sm">
          <CachvioLogo />
          <h2 className="text-3xl font-black">Start Earning Today</h2>
          <p className="text-zinc-400 text-lg">Create your free account and start withdrawing USDT in minutes.</p>
          <div className="space-y-3 text-left">
            {perks.map(t => (
              <div key={t} className="flex items-center gap-3 text-zinc-300 text-sm">
                <CheckCircle2 className="h-5 w-5 text-yellow-500 shrink-0" />{t}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right register form */}
      <div className="flex-1 lg:max-w-md flex flex-col items-center justify-center px-8 py-12 bg-black">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center lg:text-left">
            <div className="lg:hidden mb-6"><CachvioLogo /></div>
            <h1 className="text-2xl font-black text-white">Create Account</h1>
            <p className="text-zinc-500 mt-1 text-sm">Join thousands of users earning USDT daily.</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(registerMutation.mutate)} className="space-y-4">
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs uppercase tracking-wider font-bold text-zinc-500">Email</FormLabel>
                  <FormControl><Input placeholder="you@example.com" {...field} className="h-11 bg-zinc-900 border-zinc-800 focus-visible:ring-yellow-500 text-white placeholder:text-zinc-600" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="username" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs uppercase tracking-wider font-bold text-zinc-500">Username</FormLabel>
                  <FormControl><Input placeholder="YourUsername" {...field} className="h-11 bg-zinc-900 border-zinc-800 focus-visible:ring-yellow-500 text-white placeholder:text-zinc-600" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="password" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs uppercase tracking-wider font-bold text-zinc-500">Password</FormLabel>
                  <FormControl><Input type="password" placeholder="Min. 8 characters" {...field} className="h-11 bg-zinc-900 border-zinc-800 focus-visible:ring-yellow-500 text-white placeholder:text-zinc-600" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <Button type="submit" className="w-full h-11 bg-gradient-to-r from-yellow-500 to-yellow-400 text-black font-bold shadow-lg shadow-yellow-500/30 hover:from-yellow-400 hover:to-yellow-300 mt-1" disabled={registerMutation.isPending}>
                {registerMutation.isPending ? <Loader2 className="animate-spin h-5 w-5" /> : "Create Free Account"}
              </Button>
            </form>
          </Form>

          <div className="mt-5 text-center text-sm text-zinc-500">
            Already have an account?{" "}
            <Link href="/login"><span className="text-yellow-500 hover:underline cursor-pointer font-semibold">Sign in</span></Link>
          </div>
        </div>
      </div>
    </div>
  );
}
