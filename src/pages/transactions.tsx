import { useState } from "react";
import { Layout } from "@/components/layout";
import { useListTransactions, ListTransactionsType } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function Transactions() {
  const [page, setPage] = useState(1);
  const [type, setType] = useState<ListTransactionsType | "all">("all");
  const limit = 10;

  const { data, isLoading } = useListTransactions({
    page,
    limit,
    ...(type !== "all" && { type: type as ListTransactionsType })
  });

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-center">
          <div>
            <h2 className="text-3xl font-black tracking-tight uppercase text-white">Transactions</h2>
            <p className="text-zinc-500">History of your earnings and withdrawals.</p>
          </div>

          <Select value={type} onValueChange={(v) => { setType(v as ListTransactionsType | "all"); setPage(1); }}>
            <SelectTrigger className="w-[180px] bg-zinc-900 border-zinc-800 text-white">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800">
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="earning">Earnings</SelectItem>
              <SelectItem value="withdrawal">Withdrawals</SelectItem>
              <SelectItem value="adjustment">Adjustments</SelectItem>
              <SelectItem value="refund">Refunds</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card className="dark-card overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-zinc-800/50">
                  <TableRow className="border-zinc-800 hover:bg-transparent">
                    <TableHead className="font-bold text-zinc-500">Date</TableHead>
                    <TableHead className="font-bold text-zinc-500">Type</TableHead>
                    <TableHead className="font-bold text-zinc-500">Description</TableHead>
                    <TableHead className="font-bold text-zinc-500">Status</TableHead>
                    <TableHead className="font-bold text-zinc-500 text-right">Amount (USDT)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i} className="border-zinc-800">
                        <TableCell><Skeleton className="h-4 w-24 bg-zinc-800" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-20 bg-zinc-800" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-48 bg-zinc-800" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-16 bg-zinc-800" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-4 w-16 ml-auto bg-zinc-800" /></TableCell>
                      </TableRow>
                    ))
                  ) : data?.transactions?.length ? (
                    data.transactions.map((tx) => (
                      <TableRow key={tx.id} className="border-zinc-800 hover:bg-zinc-800/30">
                        <TableCell className="text-zinc-400 whitespace-nowrap">
                          {new Date(tx.createdAt).toLocaleDateString()} {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`
                            ${tx.type === 'earning' ? 'text-yellow-400 border-yellow-500/20 bg-yellow-500/10' : ''}
                            ${tx.type === 'withdrawal' ? 'text-blue-400 border-blue-500/20 bg-blue-500/10' : ''}
                            uppercase tracking-wider text-[10px]
                          `}>
                            {tx.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium text-white">{tx.description}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="uppercase tracking-wider text-[10px] bg-zinc-800 text-zinc-400 border-zinc-700">{tx.status}</Badge>
                        </TableCell>
                        <TableCell className={`text-right font-bold ${parseFloat(tx.amount) > 0 ? 'text-yellow-400' : 'text-white'}`}>
                          {parseFloat(tx.amount) > 0 ? '+' : ''}{tx.amount}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-32 text-center text-zinc-500">
                        No transactions found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {data && data.total > 0 && (
              <div className="flex items-center justify-between p-4 border-t border-zinc-800 bg-zinc-900/30">
                <div className="text-sm text-zinc-500">
                  Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, data.total)} of {data.total}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="border-zinc-800 text-zinc-400 hover:text-white hover:border-yellow-500/30"
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => p + 1)}
                    disabled={page * limit >= data.total}
                    className="border-zinc-800 text-zinc-400 hover:text-white hover:border-yellow-500/30"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
