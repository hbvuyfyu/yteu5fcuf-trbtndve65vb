import { useState } from "react";
import { AdminLayout as Layout } from "@/components/admin-layout";
import { useListUsers, useAdjustUserBalance, useUpdateUser, getListUsersQueryKey } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
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
        <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-center">
          <div>
            <h2 className="text-3xl font-black tracking-tight uppercase text-white">User Management</h2>
          </div>
          <Input
            placeholder="Search username or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs bg-zinc-900 border-zinc-800 focus-visible:ring-yellow-500 text-white placeholder:text-zinc-600"
          />
        </div>

        <Card className="dark-card">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-zinc-800/50">
                  <TableRow className="border-zinc-800 hover:bg-transparent">
                    <TableHead className="text-zinc-500 font-bold">Username</TableHead>
                    <TableHead className="text-zinc-500 font-bold">Email</TableHead>
                    <TableHead className="text-zinc-500 font-bold">Balance</TableHead>
                    <TableHead className="text-zinc-500 font-bold">Status</TableHead>
                    <TableHead className="text-zinc-500 font-bold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow><TableCell colSpan={5} className="text-center py-8"><Loader2 className="animate-spin h-6 w-6 mx-auto text-yellow-400" /></TableCell></TableRow>
                  ) : data?.users?.map(user => (
                    <TableRow key={user.id} className="border-zinc-800 hover:bg-zinc-800/30">
                      <TableCell className="font-medium text-white">{user.username}</TableCell>
                      <TableCell className="text-zinc-400">{user.email}</TableCell>
                      <TableCell className="font-mono text-yellow-400 font-bold">{user.balance}</TableCell>
                      <TableCell>
                        <Badge variant={user.status === 'active' ? 'default' : 'secondary'} className={user.status === 'active' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-zinc-700 text-zinc-400'}>{user.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <UserActions user={user} />
                      </TableCell>
                    </TableRow>
                  ))}
                  {data?.users?.length === 0 && (
                    <TableRow><TableCell colSpan={5} className="text-center py-8 text-zinc-500">No users found.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            {data && data.total > 0 && (
              <div className="flex items-center justify-between p-4 border-t border-zinc-800">
                <div className="text-sm text-zinc-500">
                  Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, data.total)} of {data.total}
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="border-zinc-800 text-zinc-400 hover:text-white hover:border-yellow-500/30">Previous</Button>
                  <Button variant="outline" size="sm" onClick={() => setPage(p => p + 1)} disabled={page * limit >= data.total} className="border-zinc-800 text-zinc-400 hover:text-white hover:border-yellow-500/30">Next</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
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
          <Button variant="outline" size="sm" className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20 hover:bg-yellow-500 hover:text-black">Balance</Button>
        </DialogTrigger>
        <DialogContent className="dark-card">
          <DialogHeader>
            <DialogTitle className="text-white">Adjust Balance for {user.username}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input type="number" placeholder="Amount (positive or negative)" value={amount} onChange={e => setAmount(e.target.value)} className="bg-zinc-900 border-zinc-800 focus-visible:ring-yellow-500 h-11 text-white placeholder:text-zinc-600" />
            <Input placeholder="Reason" value={reason} onChange={e => setReason(e.target.value)} className="bg-zinc-900 border-zinc-800 focus-visible:ring-yellow-500 h-11 text-white placeholder:text-zinc-600" />
            <Button onClick={handleAdjustBalance} disabled={adjustBalance.isPending} className="w-full bg-gradient-to-r from-yellow-500 to-yellow-400 text-black font-bold hover:from-yellow-400 hover:to-yellow-300">
              {adjustBalance.isPending ? <Loader2 className="animate-spin h-4 w-4" /> : "Adjust"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Button variant="outline" size="sm" onClick={handleToggleStatus} disabled={updateUser.isPending} className={user.status === 'active' ? 'text-red-400 border-red-500/20 hover:bg-red-500 hover:text-white' : 'text-emerald-400 border-emerald-500/20 hover:bg-emerald-500 hover:text-black'}>
        {user.status === 'active' ? 'Disable' : 'Enable'}
      </Button>
    </div>
  );
}
