import { useState } from "react";
import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForgotPassword } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Coins } from "lucide-react";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

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

export default function ForgotPassword() {
  const { toast } = useToast();
  const forgotPasswordMutation = useForgotPassword();
  const [success, setSuccess] = useState(false);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: ForgotPasswordFormValues) => {
    forgotPasswordMutation.mutate({ data }, {
      onSuccess: () => {
        setSuccess(true);
        toast({
          title: "Email sent",
          description: "Check your inbox for reset instructions.",
        });
      },
      onError: (error: any) => {
        toast({
          variant: "destructive",
          title: "Failed to send reset email",
          description: error.data?.error || error.message || "An error occurred",
        });
      },
    });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-yellow-600/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md dark-card p-8 rounded-2xl relative z-10">
        <div className="text-center mb-8">
          <Link href="/"><CachvioLogo /></Link>
          <p className="text-zinc-500 text-lg mt-4">Reset your password</p>
        </div>

        {success ? (
          <div className="text-center space-y-6">
            <div className="bg-yellow-500/10 p-4 rounded-lg border border-yellow-500/20">
              <p className="text-yellow-400 font-medium">We've sent a password reset link to your email.</p>
            </div>
            <Link href="/login">
              <Button className="w-full h-12 bg-gradient-to-r from-yellow-500 to-yellow-400 text-black font-bold">Return to Login</Button>
            </Link>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-500 uppercase text-xs tracking-wider font-bold">Email</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" {...field} className="bg-zinc-900 border-zinc-800 focus-visible:ring-yellow-500 h-12 text-white placeholder:text-zinc-600" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-yellow-500 to-yellow-400 text-black font-bold shadow-lg shadow-yellow-500/30 hover:from-yellow-400 hover:to-yellow-300"
                disabled={forgotPasswordMutation.isPending}
              >
                {forgotPasswordMutation.isPending ? <Loader2 className="animate-spin h-5 w-5" /> : "Send Reset Link"}
              </Button>
            </form>
          </Form>
        )}

        <div className="mt-8 text-center text-zinc-500">
          Remembered your password?{" "}
          <Link href="/login">
            <span className="text-yellow-500 hover:underline cursor-pointer font-medium">Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
