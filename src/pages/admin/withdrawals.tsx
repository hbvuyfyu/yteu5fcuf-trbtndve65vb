import { useState } from "react";
import { AdminLayout as Layout } from "@/components/admin-layout";
import { useListAllWithdrawals, useUpdateWithdrawalStatus, getListAllWithdrawalsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowDownUp, CreditCard, CheckCircle2, XCircle } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function AdminWithdrawals() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string>("all");
  const limit = 10;
  const { data, isLoading } = useListAllWithdrawals({ page, limit, ...(status !== 'all' && { status: status as any }) });

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500/20 to-orange-600/10 flex items-center justify-center border border-orange-500/20">
              <ArrowDownUp className="h-5 w-5 text-orange-400" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white">Withdrawals</h1>
              <p className="text-zinc-500 text-sm">Review and process withdrawal requests</p>
            </div>
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[180px] dark-input rounded-xl h-10">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800">
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="premium-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-zinc-900/50">
                <TableRow className="border-zinc-800 hover:bg-transparent">
                  <TableHead className="text-zinc-500 font-bold text-xs uppercase tracking-wider">User ID</TableHead>
                  <TableHead className="text-zinc-500 font-bold text-xs uppercase tracking-wider">Amount</TableHead>
                  <TableHead className="text-zinc-500 font-bold text-xs uppercase tracking-wider">Network / Wallet</TableHead>
                  <TableHead className="text-zinc-500 font-bold text-xs uppercase tracking-wider">Status</TableHead>
                  <TableHead className="text-zinc-500 font-bold text-xs uppercase tracking-wider text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-12"><Loader2 className="animate-spin h-6 w-6 mx-auto text-amber-400" /></TableCell></TableRow>
                ) : data?.withdrawals?.map(w => (
                  <TableRow key={w.id} className="border-zinc-800 hover:bg-zinc-800/30 transition-colors">
                    <TableCell className="font-mono text-xs text-zinc-400">{w.userId}</TableCell>
                    <TableCell className="font-bold text-white">{w.amount} USDT</TableCell>
                    <TableCell>
                      <div className="text-xs text-zinc-500">{w.network}</div>
                      <div className="font-mono text-xs text-zinc-400 truncate max-w-[150px]" title={w.walletAddress}>{w.walletAddress}</div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`text-[10px] font-bold uppercase tracking-wider ${
                        w.status === 'paid' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                        w.status === 'rejected' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                        w.status === 'pending' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                        'bg-blue-500/20 text-blue-400 border-blue-500/30'
                      }`}>{w.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <WithdrawalActions withdrawal={w} />
                    </TableCell>
                  </TableRow>
                ))}
                {data?.withdrawals?.length === 0 && (
                  <TableRow><TableCell colSpan={5} className="text-center py-12 text-zinc-500">No withdrawals found.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {data && data.total > 0 && (
            <div className="flex items-center justify-between p-4 border-t border-zinc-800 bg-zinc-900/20">
              <div className="text-sm text-zinc-500">
                Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, data.total)} of {data.total}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="border-zinc-800 text-zinc-400 hover:text-white hover:border-amber-500/30 rounded-lg">Previous</Button>
                <Button variant="outline" size="sm" onClick={() => setPage(p => p + 1)} disabled={page * limit >= data.total} className="border-zinc-800 text-zinc-400 hover:text-white hover:border-amber-500/30 rounded-lg">Next</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

function WithdrawalActions({ withdrawal }: { withdrawal: any }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const updateStatus = useUpdateWithdrawalStatus();
  const [status, setStatus] = useState<any>(withdrawal.status);
  const [txHash, setTxHash] = useState(withdrawal.txHash || "");
  const [adminNote, setAdminNote] = useState(withdrawal.adminNote || "");

  const handleUpdate = () => {
    updateStatus.mutate({ withdrawalId: withdrawal.id, data: { status, txHash, adminNote } }, {
      onSuccess: () => {
        toast({ title: "Updated" });
        queryClient.invalidateQueries({ queryKey: getListAllWithdrawalsQueryKey() });
      },
      onError: (err: any) => toast({ variant: "destructive", title: "Error", description: err.data?.error || "Failed" })
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 rounded-lg border-amber-500/20 text-amber-400 hover:bg-amber-500/10">
          Review
        </Button>
      </DialogTrigger>
      <DialogContent className="premium-card rounded-2xl max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">Update Withdrawal #{withdrawal.id}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="h-12 dark-input rounded-xl"><SelectValue /></SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800">
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Input placeholder="Transaction Hash" value={txHash} onChange={e => setTxHash(e.target.value)} className="h-12 dark-input rounded-xl" />
          <Input placeholder="Admin Note" value={adminNote} onChange={e => setAdminNote(e.target.value)} className="h-12 dark-input rounded-xl" />
          <Button onClick={handleUpdate} disabled={updateStatus.isPending} className="w-full h-12 btn-premium rounded-xl font-bold">
            {updateStatus.isPending ? <Loader2 className="animate-spin h-4 w-4" /> : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
