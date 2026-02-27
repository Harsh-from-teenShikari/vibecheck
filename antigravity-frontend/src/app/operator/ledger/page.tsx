import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, ShieldCheck, Database, KeyRound } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const ledgerEntries = [
    { id: 'LED-001X', debit: 'Platform-Reserve', credit: 'Creator-User-A', amount: '$45.00', ref: 'Commission-9982', date: '2026-02-27T10:14:02Z' },
    { id: 'LED-001Y', debit: 'Creator-User-A', credit: 'Stripe-Payout', amount: '$150.00', ref: 'Payout-2201', date: '2026-02-27T11:00:00Z' },
    { id: 'LED-001Z', debit: 'Platform-Reserve', credit: 'Creator-User-B', amount: '$50.00', ref: 'Commission-9979', date: '2026-02-26T15:22:18Z' },
    { id: 'LED-002A', debit: 'Platform-Reserve', credit: 'Creator-User-C', amount: '$12.50', ref: 'Commission-9975', date: '2026-02-26T09:44:11Z' },
];

export default function OperatorLedgerPage() {
    return (
        <div className="flex flex-col gap-6 w-full">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Immutable Ledger</h1>
                    <p className="text-muted-foreground">
                        Double-entry financial records. Operations on this table are strictly append-only.
                    </p>
                </div>
                <Badge variant="outline" className="border-emerald-500/50 text-emerald-500 gap-1 pr-3">
                    <ShieldCheck className="h-3 w-3" /> System Verified
                </Badge>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-primary/5 border-primary/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Daily Transaction Volume</CardTitle>
                        <Database className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$14,250.00</div>
                        <p className="text-xs text-muted-foreground">
                            Across 3,420 entries
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Float Balance (Reserve)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$842,000.00</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ledger Hash Status</CardTitle>
                        <KeyRound className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-lg font-mono truncate text-emerald-500">0x4a2b...f91a</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Merkle tree intact
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <CardTitle>Global Ledger Entries</CardTitle>
                        <CardDescription>Real-time view of the financial engine.</CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search tx hash or account..."
                                className="pl-8 bg-background w-[250px]"
                            />
                        </div>
                        <Button variant="outline">Export CSV</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="font-mono text-xs">Tx ID</TableHead>
                                <TableHead>Debit Account (From)</TableHead>
                                <TableHead>Credit Account (To)</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                                <TableHead>Reference</TableHead>
                                <TableHead className="text-right">Timestamp</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {ledgerEntries.map((entry) => (
                                <TableRow key={entry.id}>
                                    <TableCell className="font-mono text-xs text-muted-foreground">{entry.id}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="font-mono text-xs">{entry.debit}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="font-mono text-xs bg-muted">{entry.credit}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right font-medium text-emerald-500">{entry.amount}</TableCell>
                                    <TableCell className="text-xs text-muted-foreground">{entry.ref}</TableCell>
                                    <TableCell className="text-right text-xs text-muted-foreground">{new Date(entry.date).toLocaleString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
