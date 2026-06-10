import { AdminLayout as Layout } from "@/components/admin-layout";
import { useListAdmins } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, ShieldCheck } from "lucide-react";

export default function AdminAdmins() {
  const { data, isLoading } = useListAdmins();

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500/20 to-teal-600/10 flex items-center justify-center border border-teal-500/20">
            <ShieldCheck className="h-5 w-5 text-teal-400" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white">Admins</h1>
            <p className="text-zinc-500 text-sm">Manage administrative access</p>
          </div>
        </div>

        {/* Table */}
        <div className="premium-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-zinc-900/50">
                <TableRow className="border-zinc-800 hover:bg-transparent">
                  <TableHead className="text-zinc-500 font-bold text-xs uppercase tracking-wider">User ID</TableHead>
                  <TableHead className="text-zinc-500 font-bold text-xs uppercase tracking-wider">Username</TableHead>
                  <TableHead className="text-zinc-500 font-bold text-xs uppercase tracking-wider">Email</TableHead>
                  <TableHead className="text-zinc-500 font-bold text-xs uppercase tracking-wider">Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={4} className="text-center py-12"><Loader2 className="animate-spin h-6 w-6 mx-auto text-amber-400" /></TableCell></TableRow>
                ) : data?.admins?.map(admin => (
                  <TableRow key={admin.id} className="border-zinc-800 hover:bg-zinc-800/30 transition-colors">
                    <TableCell className="font-mono text-xs text-zinc-400">{admin.userId}</TableCell>
                    <TableCell className="font-bold text-white">{admin.username}</TableCell>
                    <TableCell className="text-zinc-400">{admin.email}</TableCell>
                    <TableCell>
                      <Badge variant={admin.role === 'super_admin' ? 'default' : 'secondary'} className={`uppercase tracking-wider text-[10px] font-bold ${
                        admin.role === 'super_admin' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                      }`}>
                        {admin.role.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {data?.admins?.length === 0 && (
                  <TableRow><TableCell colSpan={4} className="text-center py-12 text-zinc-500">No admins found.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
