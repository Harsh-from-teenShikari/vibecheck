'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Loader2 } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Wallet, ArrowUpRight, Clock, CheckCircle2, History } from 'lucide-react';

export default function CreatorPayouts() {
    const [payouts, setPayouts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPayouts = async () => {
            try {
                // Using mock-user-id for current dev cycle
                const response = await api.get('/payouts/history/mock-user-id');
                setPayouts(response.data);
            } catch (error) {
                console.error('Failed to fetch payouts', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPayouts();
    }, []);

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Earnings & Payouts</h2>
                    <p className="text-muted-foreground">
                        Manage your withdrawing methods and view your payment history.
                    </p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-gradient-to-br from-primary/10 via-background to-background border-primary/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
                        <Wallet className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">$2,450.00</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Ready for withdrawal
                        </p>
                        <Button className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground">
                            Withdraw Funds
                            <ArrowUpRight className="ml-2 h-4 w-4" />
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                        <Clock className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$340.00</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            4 submissions queued
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
                        <History className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$12,450.00</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Lifetime platform earnings
                        </p>
                    </CardContent>
                </Card>
            </div>

            <h3 className="text-xl font-bold mt-8 mb-4">Payout History</h3>
            <Card>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="flex justify-center p-8">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Transaction ID</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Method</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {payouts.map((payout) => (
                                    <TableRow key={payout.id}>
                                        <TableCell className="font-medium text-muted-foreground">
                                            {payout.id}
                                        </TableCell>
                                        <TableCell>{new Date(payout.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell>{payout.currency || 'USD'}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={
                                                    payout.status === 'completed' ? 'border-green-500/50 text-green-500 bg-green-500/10' :
                                                        payout.status === 'failed' ? 'border-red-500/50 text-red-500 bg-red-500/10' :
                                                            'border-amber-500/50 text-amber-500 bg-amber-500/10'
                                                }
                                            >
                                                {payout.status === 'completed' && <CheckCircle2 className="mr-1 h-3 w-3" />}
                                                {payout.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right font-bold">${payout.amount}</TableCell>
                                    </TableRow>
                                ))}
                                {payouts.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                                            No payout history yet.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
