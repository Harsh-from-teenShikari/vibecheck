"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ExternalLink, CheckCircle2, XCircle, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api } from '@/lib/api';
import Link from 'next/link';
import Cookies from 'js-cookie';

interface Submission {
    id: string;
    campaignId: string;
    contentUrl: string;
    status: string;
    aiConfidence?: number;
    createdAt: string;
}

export default function CreatorSubmissionsPage() {
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchSubmissions = async () => {
        setLoading(true);
        try {
            // For now, getting all submissions as we don't have the creator ID easily available in frontend state
            // In a real app we'd decode the JWT or have an auth context
            const response = await api.get('/submission');
            setSubmissions(response.data);
            setError('');
        } catch (err: any) {
            console.error("Failed to fetch submissions:", err);
            setError('Failed to load submissions. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubmissions();
    }, []);

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
                    <Link href="/creator/campaigns">Join a Campaign to Submit</Link>
                </Button>
            </div>

            {error && (
                <div className="p-4 bg-destructive/10 text-destructive rounded-md border border-destructive/20">
                    {error}
                </div>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Recent Submissions</CardTitle>
                    <CardDescription>A list of your recent content submissions.</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center p-8">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : submissions.length === 0 ? (
                        <div className="text-center p-8 text-muted-foreground">
                            No submissions found.
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Campaign ID</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>AI Confidence</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {submissions.map((sub) => (
                                    <TableRow key={sub.id}>
                                        <TableCell className="font-medium text-xs font-mono">{sub.id.substring(0, 8)}...</TableCell>
                                        <TableCell className="text-xs font-mono">{sub.campaignId.substring(0, 8)}...</TableCell>
                                        <TableCell>{new Date(sub.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            {sub.status.toUpperCase() === 'APPROVED' && <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/20"><CheckCircle2 className="w-3 h-3 mr-1" /> Approved</Badge>}
                                            {(sub.status.toUpperCase() === 'PENDING' || sub.status.toUpperCase() === 'DRAFT') && <Badge variant="outline"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>}
                                            {sub.status.toUpperCase() === 'UNDER_REVIEW' && <Badge className="bg-blue-500/20 text-blue-500 hover:bg-blue-500/20" variant="secondary"><Clock className="w-3 h-3 mr-1" /> Under Review</Badge>}
                                            {sub.status.toUpperCase() === 'REJECTED' && <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" /> Rejected</Badge>}
                                            {sub.status.toUpperCase() === 'FLAGGED' && <Badge variant="secondary" className="bg-amber-500/20 text-amber-500 hover:bg-amber-500/20"><AlertCircle className="w-3 h-3 mr-1" /> Flagged</Badge>}
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
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
                                                <a href={sub.contentUrl} target="_blank" rel="noopener noreferrer">
                                                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                                                    <span className="sr-only">Details</span>
                                                </a>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
