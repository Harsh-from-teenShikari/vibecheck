'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, ArrowLeft, Users, FileText, DollarSign, Activity } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function OperatorCampaignDetails() {
    const params = useParams();
    const router = useRouter();
    const [campaign, setCampaign] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCampaign = async () => {
            try {
                const response = await api.get(`/campaign/${params.id}`);
                setCampaign(response.data);
            } catch (error) {
                console.error('Failed to fetch campaign details', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCampaign();
    }, [params.id]);

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!campaign) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
                <h2 className="text-2xl font-bold">Campaign Not Found</h2>
                <Button onClick={() => router.push('/operator/campaigns')}>Back to Campaigns</Button>
            </div>
        );
    }

    return (
        <div className="flex-1 space-y-6 p-8 pt-6">
            <div className="flex items-center space-x-4">
                <Button variant="outline" size="icon" onClick={() => router.push('/operator/campaigns')}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">{campaign.name}</h2>
                    <div className="flex items-center space-x-2 mt-1">
                        <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'} className={campaign.status === 'active' ? 'bg-primary/20 text-primary hover:bg-primary/30' : ''}>
                            {campaign.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground pr-2 border-r border-border">ID: {campaign.id}</span>
                        <span className="text-sm text-muted-foreground">{new Date(campaign.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Reward Pool</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${campaign.rewardPool || 0}</div>
                        <p className="text-xs text-muted-foreground">Total budget allocated</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Participants</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">--</div>
                        <p className="text-xs text-muted-foreground">Creators joined</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Submissions</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">--</div>
                        <p className="text-xs text-muted-foreground">Total content submitted</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">AI Approval Rate</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">--%</div>
                        <p className="text-xs text-muted-foreground">Average acceptance</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Campaign Configuration</CardTitle>
                        <CardDescription>Rules and targeting options set for this campaign.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Campaign Type</p>
                                <p className="text-md font-semibold">{campaign.type}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Target Region</p>
                                <p className="text-md font-semibold">{campaign.region || 'Global'}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Target Niche</p>
                                <p className="text-md font-semibold">{campaign.targetNiche || 'Any'}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Min. Followers Req.</p>
                                <p className="text-md font-semibold">{campaign.minFollowers?.toLocaleString() || '0'}</p>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">Required Hashtags</p>
                            <div className="flex flex-wrap gap-2">
                                {Array.isArray(campaign.requiredHashtags) ? campaign.requiredHashtags.map((tag: string) => (
                                    <Badge key={tag} variant="secondary">{tag}</Badge>
                                )) : <Badge variant="secondary">None</Badge>}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
