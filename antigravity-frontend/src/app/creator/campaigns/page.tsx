"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Filter, Play, DollarSign, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import Link from 'next/link';

interface Campaign {
    id: string;
    title: string;
    description: string;
    rewardPool: number;
    platform: string;
    metricsReq: any;
    status: string;
}

export default function CreatorCampaignsPage() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const response = await api.get('/campaign');
                setCampaigns(response.data);
            } catch (err: any) {
                console.error("Failed to fetch campaigns:", err);
                setError('Failed to load campaigns. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchCampaigns();
    }, []);

    return (
        <div className="flex flex-col gap-6 w-full">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Campaign Discovery</h1>
                    <p className="text-muted-foreground">
                        Find and apply to new marketing campaigns.
                    </p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search campaigns..."
                        className="pl-8 bg-background"
                    />
                </div>
                <Button variant="outline" className="shrink-0 gap-2">
                    <Filter className="h-4 w-4" /> Filters
                </Button>
            </div>

            {error && (
                <div className="p-4 bg-destructive/10 text-destructive rounded-md border border-destructive/20">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="flex items-center justify-center p-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            ) : campaigns.length === 0 && !error ? (
                <div className="text-center p-12 border rounded-xl bg-muted/20 text-muted-foreground">
                    No active campaigns found at the moment. Check back later!
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {campaigns.map((campaign) => (
                        <Card key={campaign.id} className="flex flex-col transition-all hover:shadow-md hover:border-primary/50">
                            <CardHeader>
                                <div className="flex items-center justify-between mb-2">
                                    <Badge variant="outline" className={campaign.platform === 'TIKTOK' ? "text-primary border-primary/50" : "text-blue-500 border-blue-500/50"}>
                                        {campaign.platform}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground flex items-center font-medium">
                                        <Play className="h-3 w-3 mr-1" /> {campaign.status}
                                    </span>
                                </div>
                                <CardTitle>{campaign.title}</CardTitle>
                                <CardDescription className="line-clamp-2">
                                    {campaign.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Min. Views Req:</span>
                                        <span className="font-medium">{campaign.metricsReq?.minViews || 0}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Reward Pool:</span>
                                        <span className="font-medium text-primary flex items-center">
                                            <DollarSign className="h-3 w-3" />
                                            {campaign.rewardPool}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Requirements:</span>
                                        <span className="font-medium truncate max-w-[120px]">{campaign.metricsReq?.requiredHashtags?.join(', ') || 'None'}</span>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button asChild className="w-full">
                                    <Link href={`/creator/campaigns/${campaign.id}`}>
                                        View Details & Join
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
