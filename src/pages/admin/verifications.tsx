import { useState } from "react";
import { AdminLayout as Layout } from "@/components/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Copy, CheckCircle2, RefreshCw, KeyRound, AlertTriangle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getToken } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

interface PendingVerification {
  id: number;
  email: string;
  username: string;
  code: string;
  expiresAt: string;
  createdAt: string;
}

function usePendingVerifications() {
  return useQuery<{ verifications: PendingVerification[] }>({
    queryKey: ["admin", "pending-verifications"],
    queryFn: async () => {
      const token = getToken();
      const res = await fetch(`${import.meta.env.BASE_URL}api/admin/pending-verifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    refetchInterval: 15000,
  });
}

export default function AdminVerifications() {
  const { data, isLoading, refetch, isFetching } = usePendingVerifications();
  const { toast } = useToast();
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleCopy = (v: PendingVerification) => {
    navigator.clipboard.writeText(v.code);
    setCopiedId(v.id);
    toast({ title: "Copied", description: `Code ${v.code} copied for ${v.email}` });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatExpiry = (iso: string) => {
    const date = new Date(iso);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin <= 0) return "Expired";
    if (diffMin < 60) return `${diffMin}m remaining`;
    return `${Math.floor(diffMin / 60)}h ${diffMin % 60}m remaining`;
  };

  const isExpiringSoon = (iso: string) => {
    const date = new Date(iso);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    return diffMs < 5 * 60 * 1000;
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 flex items-center justify-center border border-cyan-500/20">
              <KeyRound className="h-5 w-5 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white">Pending Verifications</h1>
              <p className="text-zinc-500 text-sm">Active verification codes for users awaiting email</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching} className="gap-2 border-zinc-800 text-zinc-400 hover:text-amber-400 hover:border-amber-500/30 rounded-xl">
            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {/* Info Banner */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-amber-400 text-sm font-medium leading-relaxed">
              These codes are shown here because email delivery is unavailable (Resend sandbox mode). Once you verify a domain at resend.com/domains, codes will be sent by email instead and this list will stay empty.
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="premium-card rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-amber-900/20">
            <p className="text-xs text-zinc-500 uppercase tracking-wider font-bold">
              {data?.verifications?.length ?? 0} pending code{data?.verifications?.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-zinc-900/50">
                <TableRow className="border-zinc-800 hover:bg-transparent">
                  <TableHead className="text-zinc-500 font-bold text-xs uppercase tracking-wider">Email</TableHead>
                  <TableHead className="text-zinc-500 font-bold text-xs uppercase tracking-wider">Username</TableHead>
                  <TableHead className="text-zinc-500 font-bold text-xs uppercase tracking-wider">Code</TableHead>
                  <TableHead className="text-zinc-500 font-bold text-xs uppercase tracking-wider">Expires</TableHead>
                  <TableHead className="text-zinc-500 font-bold text-xs uppercase tracking-wider text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12">
                      <Loader2 className="animate-spin h-6 w-6 mx-auto text-amber-400" />
                    </TableCell>
                  </TableRow>
                ) : data?.verifications?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12 text-zinc-500">
                      No pending verifications — email delivery is working normally.
                    </TableCell>
                  </TableRow>
                ) : data?.verifications?.map((v) => (
                  <TableRow key={v.id} className="border-zinc-800 hover:bg-zinc-800/30 transition-colors">
                    <TableCell className="text-zinc-400">{v.email}</TableCell>
                    <TableCell className="font-bold text-white">{v.username}</TableCell>
                    <TableCell>
                      <span className="font-mono gold-gradient-text font-black text-lg tracking-widest">{v.code}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={isExpiringSoon(v.expiresAt) ? "destructive" : "secondary"} className={`font-mono text-xs font-bold ${
                        isExpiringSoon(v.expiresAt) ? "bg-red-500/20 text-red-400 border-red-500/30" : "bg-zinc-800 text-zinc-300 border-zinc-700"
                      }`}>
                        {formatExpiry(v.expiresAt)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopy(v)}
                        className="gap-2 border-amber-500/20 text-amber-400 hover:bg-amber-500/10 rounded-lg"
                      >
                        {copiedId === v.id ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        {copiedId === v.id ? "Copied!" : "Copy Code"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
