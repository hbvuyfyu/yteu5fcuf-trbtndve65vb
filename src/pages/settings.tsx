import { Layout } from "@/components/layout";
import { useGetMe, useUpdateProfile, useChangePassword, getGetMeQueryKey } from "@workspace/api-client-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

const profileSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").max(30),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string()
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

export default function Settings() {
  const { data: user } = useGetMe();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateProfileMutation = useUpdateProfile();
  const changePasswordMutation = useChangePassword();

  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: { username: "" },
  });

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  useEffect(() => {
    if (user?.username) {
      profileForm.reset({ username: user.username });
    }
  }, [user, profileForm]);

  const onProfileSubmit = (data: z.infer<typeof profileSchema>) => {
    updateProfileMutation.mutate({ data }, {
      onSuccess: () => {
        toast({ title: "Profile updated successfully" });
        queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
      },
      onError: (err: any) => {
        toast({ variant: "destructive", title: "Update failed", description: err.data?.error || err.message });
      }
    });
  };

  const onPasswordSubmit = (data: z.infer<typeof passwordSchema>) => {
    changePasswordMutation.mutate({ data: { currentPassword: data.currentPassword, newPassword: data.newPassword } }, {
      onSuccess: () => {
        toast({ title: "Password changed successfully" });
        passwordForm.reset();
      },
      onError: (err: any) => {
        toast({ variant: "destructive", title: "Change failed", description: err.data?.error || err.message });
      }
    });
  };

  return (
    <Layout>
      <div className="space-y-8 max-w-4xl mx-auto">
        <div>
          <h2 className="text-3xl font-black tracking-tight uppercase text-white">Settings</h2>
          <p className="text-zinc-500">Manage your account preferences.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="dark-card">
            <CardHeader>
              <CardTitle className="uppercase tracking-wider text-white">Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <FormLabel className="text-zinc-500 uppercase text-xs font-bold mb-2 block">Email (Read Only)</FormLabel>
                <Input value={user?.email || ""} disabled className="bg-zinc-800/50 border-zinc-700 text-zinc-400" />
              </div>
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                  <FormField
                    control={profileForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-500 uppercase text-xs font-bold">Username</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-zinc-900 border-zinc-800 focus-visible:ring-yellow-500 h-11 text-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={updateProfileMutation.isPending} className="font-bold bg-gradient-to-r from-yellow-500 to-yellow-400 text-black hover:from-yellow-400 hover:to-yellow-300 shadow-lg shadow-yellow-500/30">
                    {updateProfileMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Profile
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card className="dark-card">
            <CardHeader>
              <CardTitle className="uppercase tracking-wider text-white">Change Password</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                  <FormField
                    control={passwordForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-500 uppercase text-xs font-bold">Current Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} className="bg-zinc-900 border-zinc-800 focus-visible:ring-yellow-500 h-11 text-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-500 uppercase text-xs font-bold">New Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} className="bg-zinc-900 border-zinc-800 focus-visible:ring-yellow-500 h-11 text-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-500 uppercase text-xs font-bold">Confirm New Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} className="bg-zinc-900 border-zinc-800 focus-visible:ring-yellow-500 h-11 text-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={changePasswordMutation.isPending} variant="outline" className="font-bold text-white border-zinc-700 hover:border-yellow-500/40 hover:text-yellow-400">
                    {changePasswordMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Update Password
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
