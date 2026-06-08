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
import { Loader2 } from "lucide-react";

const loginSchema = z.object({ email: z.string().email("Invalid email"), password: z.string().min(1, "Required") });
type LoginFormValues = z.infer<typeof loginSchema>;

function CaptaincashLogo() {
  return (
    <div className="flex items-center justify-center gap-2">
      <img src="/logo.jpg" alt="Captain Cash" className="w-10 h-10 rounded-xl object-cover shadow-[0_4px_14px_rgba(220,38,38,0.4)]" />
      <span className="text-2xl font-black tracking-tight text-foreground">Captain <span className="text-primary">Cach</span></span>
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

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-red-700 via-red-600 to-red-500 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-10" style={{backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '40px 40px'}} />
        <div className="relative z-10 text-white text-center space-y-6 max-w-sm">
          <CaptaincashLogo />
          <h2 className="text-3xl font-black">Welcome Back</h2>
          <p className="text-red-100 text-lg">Sign in and continue earning USDT from your favorite offerwalls.</p>
          <div className="space-y-3 text-left">
            {["Access your balance anytime", "Track all your earnings", "Withdraw to any wallet"].map(t => (
              <div key={t} className="flex items-center gap-3 text-red-50 text-sm">
                <div className="w-5 h-5 rounded-full bg-white/25 flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 12 12" className="w-3 h-3"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
                </div>
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right login form */}
      <div className="flex-1 lg:max-w-md flex flex-col items-center justify-center px-8 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center lg:text-left">
            <div className="lg:hidden mb-6"><CaptaincashLogo /></div>
            <h1 className="text-2xl font-black text-foreground">Sign In</h1>
            <p className="text-muted-foreground mt-1 text-sm">Enter your credentials to access your account.</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Email</FormLabel>
                  <FormControl><Input placeholder="you@example.com" {...field} className="h-11 bg-white border-border focus-visible:ring-primary" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="password" render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-center">
                    <FormLabel className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Password</FormLabel>
                    <Link href="/forgot-password"><span className="text-xs text-primary hover:underline cursor-pointer">Forgot password?</span></Link>
                  </div>
                  <FormControl><Input type="password" placeholder="••••••••" {...field} className="h-11 bg-white border-border focus-visible:ring-primary" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <Button type="submit" className="w-full h-11 text-white font-bold shadow-[0_2px_12px_rgba(220,38,38,0.3)]" disabled={loginMutation.isPending}>
                {loginMutation.isPending ? <Loader2 className="animate-spin h-5 w-5" /> : "Sign In"}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            New to Captain Cach?{" "}
            <Link href="/register"><span className="text-primary hover:underline cursor-pointer font-semibold">Create account</span></Link>
          </div>
        </div>
      </div>
    </div>
  );
}
