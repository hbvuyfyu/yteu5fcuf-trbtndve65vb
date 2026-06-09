import { AdminLayout as Layout } from "@/components/admin-layout";
import { useListAdmins } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

export default function AdminAdmins() {
  const { data, isLoading } = useListAdmins();

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-black tracking-tight uppercase text-white">Admins</h2>
          <p className="text-zinc-500">Manage administrative access.</p>
        </div>

        <Card className="dark-card">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-zinc-800/50">
                  <TableRow className="border-zinc-800 hover:bg-transparent">
                    <TableHead className="text-zinc-500 font-bold">User ID</TableHead>
                    <TableHead className="text-zinc-500 font-bold">Username</TableHead>
                    <TableHead className="text-zinc-500 font-bold">Email</TableHead>
                    <TableHead className="text-zinc-500 font-bold">Role</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow><TableCell colSpan={4} className="text-center py-8"><Loader2 className="animate-spin h-6 w-6 mx-auto text-yellow-400" /></TableCell></TableRow>
                  ) : data?.admins?.map(admin => (
                    <TableRow key={admin.id} className="border-zinc-800 hover:bg-zinc-800/30">
                      <TableCell className="font-mono text-xs text-zinc-400">{admin.userId}</TableCell>
                      <TableCell className="font-bold text-white">{admin.username}</TableCell>
                      <TableCell className="text-zinc-400">{admin.email}</TableCell>
                      <TableCell>
                        <Badge variant={admin.role === 'super_admin' ? 'default' : 'secondary'} className={`uppercase tracking-wider text-[10px] ${admin.role === 'super_admin' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' : 'bg-zinc-700 text-zinc-300'}`}>
                          {admin.role.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  {data?.admins?.length === 0 && (
                    <TableRow><TableCell colSpan={4} className="text-center py-8 text-zinc-500">No admins found.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
