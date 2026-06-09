import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useResetPassword } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Coins } from "lucide-react";

const resetPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

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

export default function ResetPassword() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const resetPasswordMutation = useResetPassword();

  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get("token");
    if (tokenParam) {
      setToken(tokenParam);
    }
  }, []);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: ResetPasswordFormValues) => {
    if (!token) {
      toast({ variant: "destructive", title: "Error", description: "Missing reset token" });
      return;
    }

    resetPasswordMutation.mutate({ data: { token, password: data.password } }, {
      onSuccess: () => {
        toast({
          title: "Password Reset",
          description: "Your password has been successfully reset.",
        });
        setLocation("/login");
      },
      onError: (error: any) => {
        toast({
          variant: "destructive",
          title: "Reset Failed",
          description: error.data?.error || error.message || "An error occurred",
        });
      },
    });
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4 text-center">
        <div className="space-y-4 max-w-md">
          <h1 className="text-2xl font-bold text-red-500">Invalid Link</h1>
          <p className="text-zinc-500">The password reset link is missing or invalid.</p>
          <Link href="/forgot-password">
            <Button className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-black font-bold">Request New Link</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-yellow-600/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md dark-card p-8 rounded-2xl relative z-10">
        <div className="text-center mb-8">
          <Link href="/"><CachvioLogo /></Link>
          <p className="text-zinc-500 text-lg mt-4">Create new password</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-500 uppercase text-xs tracking-wider font-bold">New Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} className="bg-zinc-900 border-zinc-800 focus-visible:ring-yellow-500 h-12 text-white placeholder:text-zinc-600" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-500 uppercase text-xs tracking-wider font-bold">Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} className="bg-zinc-900 border-zinc-800 focus-visible:ring-yellow-500 h-12 text-white placeholder:text-zinc-600" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-yellow-500 to-yellow-400 text-black font-bold shadow-lg shadow-yellow-500/30 hover:from-yellow-400 hover:to-yellow-300"
              disabled={resetPasswordMutation.isPending}
            >
              {resetPasswordMutation.isPending ? <Loader2 className="animate-spin h-5 w-5" /> : "Reset Password"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
