import { useState } from "react";
import { AdminLayout as Layout } from "@/components/admin-layout";
import { useListUsers, useAdjustUserBalance, useUpdateUser, getListUsersQueryKey } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Users, Search, Coins, UserX, UserCheck } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

export default function AdminUsers() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const limit = 10;
  const { data, isLoading } = useListUsers({ page, limit, search });

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/10 flex items-center justify-center border border-blue-500/20">
              <Users className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white">User Management</h1>
              <p className="text-zinc-500 text-sm">Search and manage user accounts</p>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input
              placeholder="Search username or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 w-[250px] dark-input rounded-xl h-10"
            />
          </div>
        </div>

        {/* Table */}
        <div className="premium-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-zinc-900/50">
                <TableRow className="border-zinc-800 hover:bg-transparent">
                  <TableHead className="text-zinc-500 font-bold text-xs uppercase tracking-wider">Username</TableHead>
                  <TableHead className="text-zinc-500 font-bold text-xs uppercase tracking-wider">Email</TableHead>
                  <TableHead className="text-zinc-500 font-bold text-xs uppercase tracking-wider">Balance</TableHead>
                  <TableHead className="text-zinc-500 font-bold text-xs uppercase tracking-wider">Status</TableHead>
                  <TableHead className="text-zinc-500 font-bold text-xs uppercase tracking-wider text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-12"><Loader2 className="animate-spin h-6 w-6 mx-auto text-amber-400" /></TableCell></TableRow>
                ) : data?.users?.map(user => (
                  <TableRow key={user.id} className="border-zinc-800 hover:bg-zinc-800/30 transition-colors">
                    <TableCell className="font-bold text-white">{user.username}</TableCell>
                    <TableCell className="text-zinc-400">{user.email}</TableCell>
                    <TableCell className="font-mono gold-gradient-text font-bold">{user.balance}</TableCell>
                    <TableCell>
                      <Badge variant={user.status === 'active' ? 'default' : 'secondary'} className={`text-[10px] font-bold uppercase tracking-wider ${
                        user.status === 'active' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                      }`}>{user.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <UserActions user={user} />
                    </TableCell>
                  </TableRow>
                ))}
                {data?.users?.length === 0 && (
                  <TableRow><TableCell colSpan={5} className="text-center py-12 text-zinc-500">No users found.</TableCell></TableRow>
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

function UserActions({ user }: { user: any }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const adjustBalance = useAdjustUserBalance();
  const updateUser = useUpdateUser();
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");

  const handleAdjustBalance = () => {
    adjustBalance.mutate({ userId: user.id, data: { amount, reason } }, {
      onSuccess: () => {
        toast({ title: "Balance adjusted" });
        queryClient.invalidateQueries({ queryKey: getListUsersQueryKey() });
      },
      onError: (err: any) => toast({ variant: "destructive", title: "Error", description: err.data?.error || "Failed" })
    });
  };

  const handleToggleStatus = () => {
    updateUser.mutate({ userId: user.id, data: { status: user.status === 'active' ? 'disabled' : 'active' } }, {
      onSuccess: () => {
        toast({ title: "Status updated" });
        queryClient.invalidateQueries({ queryKey: getListUsersQueryKey() });
      }
    });
  };

  return (
    <div className="flex justify-end gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 rounded-lg border-amber-500/20 text-amber-400 hover:bg-amber-500/10 hover:border-amber-500/30">
            <Coins className="h-3.5 w-3.5 mr-1.5" />Balance
          </Button>
        </DialogTrigger>
        <DialogContent className="premium-card rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Adjust Balance for {user.username}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input type="number" placeholder="Amount (positive or negative)" value={amount} onChange={e => setAmount(e.target.value)} className="h-12 dark-input rounded-xl" />
            <Input placeholder="Reason" value={reason} onChange={e => setReason(e.target.value)} className="h-12 dark-input rounded-xl" />
            <Button onClick={handleAdjustBalance} disabled={adjustBalance.isPending} className="w-full h-12 btn-premium rounded-xl font-bold">
              {adjustBalance.isPending ? <Loader2 className="animate-spin h-4 w-4" /> : "Adjust"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Button variant="outline" size="sm" onClick={handleToggleStatus} disabled={updateUser.isPending} className={`h-8 rounded-lg ${
        user.status === 'active' ? 'border-red-500/20 text-red-400 hover:bg-red-500/10' : 'border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10'
      }`}>
        {user.status === 'active' ? <UserX className="h-3.5 w-3.5 mr-1.5" /> : <UserCheck className="h-3.5 w-3.5 mr-1.5" />}
        {user.status === 'active' ? 'Disable' : 'Enable'}
      </Button>
    </div>
  );
}
