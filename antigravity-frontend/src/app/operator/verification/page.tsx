'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Loader2 } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle2, XCircle, AlertTriangle, PlayCircle } from 'lucide-react';

export default function OperatorVerification() {
    const [flaggedSubmissions, setFlaggedSubmissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFlagged = async () => {
            try {
                const response = await api.get('/submission/flagged');
                setFlaggedSubmissions(response.data);
            } catch (error) {
                console.error('Failed to fetch flagged submissions', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFlagged();
    }, []);

    const handleVerify = async (id: string, status: 'approved' | 'rejected') => {
        try {
            await api.patch(`/submission/${id}/verify`, { status });
            // Optimistic update
            setFlaggedSubmissions(prev => prev.filter(sub => sub.id !== id));
        } catch (error) {
            console.error('Failed to verify submission', error);
        }
    };

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Manual Verification Queue</h2>
                    <p className="text-muted-foreground">
                        Review submissions flagged by the AI verification and fraud detection engines.
                    </p>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center p-12 w-full">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            ) : flaggedSubmissions.length === 0 ? (
                <div className="text-center p-12 border rounded-xl bg-muted/20 text-muted-foreground w-full">
                    Queue is clear! No flagged submissions awaiting manual verification.
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {flaggedSubmissions.map((submission) => (
                        <Card key={submission.id} className="flex flex-col">
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <CardTitle className="text-lg">@{submission.creator?.user?.email?.split('@')[0] || 'unknown'}</CardTitle>
                                    <Badge variant={(submission.fraudScore || 0) > 0.8 ? 'destructive' : 'secondary'}>
                                        Risk: {submission.fraudScore || 0}
                                    </Badge>
                                </div>
                                <CardDescription>{new Date(submission.createdAt).toLocaleString()}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Campaign:</span>
                                        <span className="font-medium">{submission.campaign?.name || 'Unknown'}</span>
                                    </div>
                                    <div className="flex justify-between items-center rounded-md bg-muted/50 p-2 mt-2">
                                        <span className="flex items-center text-amber-500">
                                            <AlertTriangle className="mr-2 h-4 w-4" />
                                            Flag Reason:
                                        </span>
                                        <span className="font-semibold text-right max-w-[150px] truncate">Manual Review Required</span>
                                    </div>

                                    <a
                                        href={submission.contentData?.url || '#'}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="aspect-video w-full bg-muted rounded-md mt-4 flex items-center justify-center relative overflow-hidden group border border-border cursor-pointer hover:border-primary/50 transition-colors"
                                    >
                                        <PlayCircle className="h-10 w-10 text-muted-foreground opacity-50 group-hover:opacity-100 transition-opacity" />
                                        <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded flex items-center">
                                            View Details
                                        </span>
                                    </a>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between pt-4 border-t">
                                <Button
                                    variant="outline"
                                    className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                                    onClick={() => handleVerify(submission.id, 'rejected')}
                                >
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Reject
                                </Button>
                                <Button
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                    onClick={() => handleVerify(submission.id, 'approved')}
                                >
                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                    Approve
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
