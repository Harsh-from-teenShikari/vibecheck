import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ExternalLink, CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const submissions = [
    { id: 'SUB-9982', campaign: 'Nike Run Club', date: '2026-02-27', status: 'approved', reward: '$45.00', aiConfidence: 0.98 },
    { id: 'SUB-9981', campaign: 'WebFlow Partner', date: '2026-02-26', status: 'pending', reward: 'TBD', aiConfidence: null },
    { id: 'SUB-9980', campaign: 'Gymshark Summer', date: '2026-02-25', status: 'rejected', reward: '$0.00', aiConfidence: 0.45 },
    { id: 'SUB-9979', campaign: 'Nike Run Club', date: '2026-02-24', status: 'approved', reward: '$50.00', aiConfidence: 0.99 },
    { id: 'SUB-9978', campaign: 'Vercel Launch', date: '2026-02-24', status: 'under_review', reward: 'TBD', aiConfidence: 0.75 },
];

export default function CreatorSubmissionsPage() {
    return (
        <div className="flex flex-col gap-6 w-full">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Submissions</h1>
                    <p className="text-muted-foreground">
                        Track your campaign submissions and review AI verification statuses.
                    </p>
                </div>
                <Button asChild>
                    <Link href="/creator/campaigns">New Submission</Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Submissions</CardTitle>
                    <CardDescription>A list of your recent content submissions.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Campaign</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>AI Confidence</TableHead>
                                <TableHead className="text-right">Estimated Reward</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {submissions.map((sub) => (
                                <TableRow key={sub.id}>
                                    <TableCell className="font-medium">{sub.id}</TableCell>
                                    <TableCell>{sub.campaign}</TableCell>
                                    <TableCell>{sub.date}</TableCell>
                                    <TableCell>
                                        {sub.status === 'approved' && <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/20"><CheckCircle2 className="w-3 h-3 mr-1" /> Approved</Badge>}
                                        {sub.status === 'pending' && <Badge variant="outline"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>}
                                        {sub.status === 'rejected' && <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" /> Rejected</Badge>}
                                        {sub.status === 'under_review' && <Badge variant="secondary" className="bg-amber-500/20 text-amber-500 hover:bg-amber-500/20"><AlertCircle className="w-3 h-3 mr-1" /> Manual Review</Badge>}
                                    </TableCell>
                                    <TableCell>
                                        {sub.aiConfidence ? (
                                            <span className={sub.aiConfidence > 0.9 ? 'text-emerald-500' : sub.aiConfidence > 0.7 ? 'text-amber-500' : 'text-destructive'}>
                                                {(sub.aiConfidence * 100).toFixed(0)}%
                                            </span>
                                        ) : (
                                            <span className="text-muted-foreground">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right font-medium">{sub.reward}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                            <ExternalLink className="h-4 w-4 text-muted-foreground" />
                                            <span className="sr-only">Details</span>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
