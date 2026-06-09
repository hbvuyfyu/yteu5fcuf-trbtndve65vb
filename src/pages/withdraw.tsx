import { useState } from "react";
import { Layout } from "@/components/layout";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateWithdrawal, useListWithdrawals, useGetBalance, getGetBalanceQueryKey, getListWithdrawalsQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

const formatMoney = (value?: string | number | null) => {
  const n = Number(value ?? 0);
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: n % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(n);
};

const networkOptions = [
  { value: "BEP20",         label: "BNB Smart Chain (BEP20)",  addressLabel: "Wallet Address",             addressPlaceholder: "0x..." },
  { value: "TRC20",         label: "Tron (TRC20)",             addressLabel: "Wallet Address",             addressPlaceholder: "T..."  },
  { value: "SHAM_CASH",     label: "(Sham Cash)",      addressLabel: "Phone Number",               addressPlaceholder: "09xxxxxxxx" },
  { value: "SYRIATEL_CASH", label: "(Syriatel Cash)", addressLabel: "Phone Number",           addressPlaceholder: "09xxxxxxxx" },
  { value: "COENEX_EMAIL",  label: "Coenex (Email)",           addressLabel: "Email Address",              addressPlaceholder: "you@example.com" },
];

const withdrawSchema = z.object({
  amount: z.string().min(1, "Amount is required"),
  network: z.enum(["BEP20", "TRC20", "SHAM_CASH", "SYRIATEL_CASH", "COENEX_EMAIL"]),
  walletAddress: z.string().min(3, "Required"),
});

type WithdrawForm = z.infer<typeof withdrawSchema>;

export default function Withdraw() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: balanceData } = useGetBalance();
  const { data: historyData, isLoading: historyLoading } = useListWithdrawals({ page: 1, limit: 10 });
  const withdrawMutation = useCreateWithdrawal();

  const form = useForm<WithdrawForm>({
    resolver: zodResolver(withdrawSchema),
    defaultValues: {
      amount: "",
      network: "BEP20",
      walletAddress: "",
    },
  });

  const selectedNetwork = form.watch("network");
  const networkMeta = networkOptions.find(n => n.value === selectedNetwork) ?? networkOptions[0];

  const onSubmit = (data: WithdrawForm) => {
    withdrawMutation.mutate({ data: { ...data, network: data.network as any } }, {
      onSuccess: () => {
        toast({ title: "Withdrawal Requested", description: "Your request is being processed." });
        form.reset();
        queryClient.invalidateQueries({ queryKey: getGetBalanceQueryKey() });
        queryClient.invalidateQueries({ queryKey: getListWithdrawalsQueryKey({ page: 1, limit: 10 }) });
      },
      onError: (error: any) => {
        toast({ variant: "destructive", title: "Withdrawal Failed", description: error.data?.error || "Could not process request" });
      },
    });
  };

  const networkDisplayName = (network: string) =>
    networkOptions.find(n => n.value === network)?.label ?? network;

  return (
    <Layout>
      <div className="space-y-8 max-w-6xl mx-auto">
        <div>
          <h2 className="text-3xl font-black tracking-tight uppercase text-white">Withdraw Funds</h2>
          <p className="text-zinc-500">Transfer your balance to your preferred payment method.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <Card className="dark-card">
              <CardHeader>
                <CardTitle className="uppercase tracking-wider text-white">Request Withdrawal</CardTitle>
                <CardDescription className="text-zinc-500">Minimum withdrawal: $1</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6 p-4 bg-zinc-800/50 rounded-lg border border-zinc-700 flex justify-between items-center">
                  <span className="text-zinc-500 uppercase text-xs font-bold">Available</span>
                  <span className="font-bold text-yellow-400">{formatMoney(balanceData?.balance)} USDT</span>
                </div>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-zinc-500 uppercase text-xs font-bold">Amount (USDT)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" placeholder="1.00" {...field} className="bg-zinc-900 border-zinc-800 focus-visible:ring-yellow-500 h-11 text-white placeholder:text-zinc-600" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="network"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-zinc-500 uppercase text-xs font-bold">Payment Method</FormLabel>
                          <Select
                            onValueChange={(val) => {
                              field.onChange(val);
                              form.setValue("walletAddress", "");
                            }}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-zinc-900 border-zinc-800 focus-visible:ring-yellow-500 h-11 text-white">
                                <SelectValue placeholder="Select method" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-zinc-900 border-zinc-800">
                              {networkOptions.map(opt => (
                                <SelectItem key={opt.value} value={opt.value} className="text-white hover:bg-zinc-800">{opt.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="walletAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-zinc-500 uppercase text-xs font-bold">
                            {networkMeta.addressLabel}
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder={networkMeta.addressPlaceholder}
                              {...field}
                              className="bg-zinc-900 border-zinc-800 focus-visible:ring-yellow-500 font-mono text-sm h-11 text-white placeholder:text-zinc-600"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-yellow-500 to-yellow-400 text-black font-bold uppercase tracking-wider hover:from-yellow-400 hover:to-yellow-300 mt-4 shadow-lg shadow-yellow-500/30"
                      disabled={withdrawMutation.isPending}
                    >
                      {withdrawMutation.isPending ? <Loader2 className="animate-spin h-5 w-5" /> : "Withdraw Now"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="dark-card h-full">
              <CardHeader>
                <CardTitle className="uppercase tracking-wider text-white">Withdrawal History</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-zinc-800/50">
                      <TableRow className="border-zinc-800 hover:bg-transparent">
                        <TableHead className="font-bold text-zinc-500">Date</TableHead>
                        <TableHead className="font-bold text-zinc-500">Amount</TableHead>
                        <TableHead className="font-bold text-zinc-500">Method</TableHead>
                        <TableHead className="font-bold text-zinc-500">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {historyLoading ? (
                        <TableRow><TableCell colSpan={4} className="text-center py-8"><Loader2 className="animate-spin h-6 w-6 mx-auto text-yellow-400"/></TableCell></TableRow>
                      ) : historyData?.withdrawals?.length ? (
                        historyData.withdrawals.map((w) => (
                          <TableRow key={w.id} className="border-zinc-800 hover:bg-zinc-800/30">
                            <TableCell className="text-zinc-400 whitespace-nowrap">
                              {new Date(w.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="font-bold text-white">{w.amount} USDT</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="font-semibold text-xs border-zinc-700 text-zinc-300">
                                {networkDisplayName(w.network)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={w.status === "paid" ? "default" : w.status === "rejected" ? "destructive" : "secondary"}
                                className={`uppercase tracking-wider text-[10px] ${w.status === "paid" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : w.status === "rejected" ? "bg-red-500/20 text-red-400 border-red-500/30" : "bg-amber-500/20 text-amber-400 border-amber-500/30"}`}
                              >
                                {w.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="h-32 text-center text-zinc-500">
                            No withdrawals yet.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
