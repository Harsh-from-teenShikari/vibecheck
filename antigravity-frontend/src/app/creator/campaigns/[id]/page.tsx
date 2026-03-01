'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import {
    Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, ArrowLeft, Users, DollarSign, Target, Globe, Hash } from 'lucide-react';
import Link from 'next/link';
import { use } from 'react';

export default function CampaignDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const campaignId = resolvedParams.id;
    const router = useRouter();

    const [campaign, setCampaign] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [joining, setJoining] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await api.get(`/campaign/${campaignId}`);
                setCampaign(response.data);
            } catch (err) {
                console.error("Failed to fetch campaign details", err);
                setError('Could not load campaign details. It may not exist.');
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [campaignId]);

    const handleJoin = async () => {
        setJoining(true);
        try {
            // Hardcoding a creator ID since auth context isn't fully robust here yet.
            // In a real app this would come from a JWT decoding or a centralized auth store.
            const dummyCreatorId = 'cmm52kg4m0001ousgqsaed3mv';

            await api.post(`/campaign/${campaignId}/join`, {
                creatorId: dummyCreatorId
            });

            // Redirect to the new submission form specifically targeted for this campaign
            router.push(`/creator/campaigns/${campaignId}/submit`);
        } catch (err: any) {
            console.error("Failed to join campaign", err);
            setError(err.response?.data?.message || 'Failed to join campaign. You may be already joined!');
        } finally {
            setJoining(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !campaign) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
                <div className="text-destructive font-medium border border-destructive/20 bg-destructive/10 p-4 rounded-xl">
                    {error || 'Campaign not found'}
                </div>
                <Button variant="outline" asChild>
                    <Link href="/creator/campaigns"><ArrowLeft className="h-4 w-4 mr-2" /> Back to Discovery</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="flex-1 space-y-8 p-4 md:p-8 pt-6 max-w-4xl mx-auto">
            <Button variant="ghost" asChild className="mb-4">
                <Link href="/creator/campaigns">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Campaigns
                </Link>
            </Button>

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent pb-2">
                        {campaign.name}
                    </h2>
                    <div className="flex items-center gap-3 mt-2">
                        <Badge variant="outline" className="font-mono">{campaign.type}</Badge>
                        <Badge variant="secondary" className="capitalize">{campaign.status}</Badge>
                        <span className="text-xs text-muted-foreground font-mono">ID: {campaign.id}</span>
                    </div>
                </div>
                <Button size="lg" className="w-full md:w-auto font-bold text-md tracking-wide" onClick={handleJoin} disabled={joining || campaign.status !== 'active'}>
                    {joining ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : null}
                    {campaign.status !== 'active' ? 'Campaign Inactive' : 'Join Campaign & Submit'}
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-primary/20 bg-gradient-to-br from-background to-primary/5">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Target className="h-5 w-5 text-primary" /> Requirements
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center pb-2 border-b border-white/5">
                            <span className="text-muted-foreground flex items-center gap-2"><Globe className="h-4 w-4" /> Region Target</span>
                            <span className="font-semibold">{campaign.region || 'Global'}</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-white/5">
                            <span className="text-muted-foreground flex items-center gap-2"><Users className="h-4 w-4" /> Min Followers</span>
                            <span className="font-semibold">{campaign.minFollowers?.toLocaleString() || 0}</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-white/5">
                            <span className="text-muted-foreground flex items-center gap-2"><Target className="h-4 w-4" /> Target Niche</span>
                            <span className="font-semibold">{campaign.targetNiche || 'Any'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground flex items-center gap-2"><Hash className="h-4 w-4" /> Required Hashtags</span>
                            <div className="space-x-1">
                                {campaign.requiredHashtags?.length > 0 ? (
                                    campaign.requiredHashtags.map((tag: string) => (
                                        <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                                    ))
                                ) : (
                                    <span className="font-semibold text-muted-foreground">None</span>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <DollarSign className="h-5 w-5 text-emerald-500" /> Economics
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-col gap-1 p-4 bg-muted/40 rounded-xl border border-white/5">
                            <span className="text-sm text-muted-foreground uppercase tracking-widest font-semibold">Total Reward Pool</span>
                            <span className="text-4xl font-black text-emerald-500">${campaign.rewardPool?.toLocaleString() || 0}</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed mt-4">
                            By joining this campaign, {campaign.type === 'CLIPPING' ? 'you will earn a flat CPA for every 10k verified views on your submitted clips. All payouts are instantly settled to your ledger balance.' : 'you will earn a revenue share off tracked affiliate conversions sourced directly from your assigned tracking URL.'}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="mt-8 p-6 bg-primary/5 rounded-2xl border border-primary/20 text-center">
                <h3 className="font-bold text-lg mb-2">Ready to start earning?</h3>
                <p className="text-muted-foreground mb-4">You first need to permanently join this campaign to retrieve your tracking links and upload portals.</p>
                <Button variant="default" onClick={handleJoin} disabled={joining || campaign.status !== 'active'}>
                    {joining ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : null}
                    Acknowledge Requirements & Join
                </Button>
            </div>
        </div>
    );
}
