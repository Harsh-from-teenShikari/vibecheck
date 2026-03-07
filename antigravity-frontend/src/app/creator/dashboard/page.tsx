"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Activity, CreditCard, Star, TrendingUp, CheckCircle2, Loader2, PlayCircle } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import Cookies from 'js-cookie';

export default function CreatorDashboardPage() {
    const [metrics, setMetrics] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMetrics = async () => {
            const userId = Cookies.get('user_id');
            if (!userId) {
                setLoading(false);
                return;
            }

            try {
                const response = await api.get(`/identity/dashboard/${userId}`);
                setMetrics(response.data);
            } catch (error) {
                console.error('Failed to fetch creator dashboard metrics', error);
            } finally {
                setLoading(false);
            }
        };
        fetchMetrics();
    }, []);

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center p-8 w-full">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }
    return (
        <div className="flex flex-col gap-6 w-full">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">
                        Welcome back. Here's an overview of your performance and earnings.
                    </p>
                </div>
                <Button className="shrink-0" asChild>
                    <Link href="/creator/campaigns">Find Campaigns</Link>
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Metric Cards */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${(metrics?.availableBalance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                        <p className="text-xs text-muted-foreground">
                            Ready for payout
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics?.pendingApprovals || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            Under AI or Manual review
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Trust Score</CardTitle>
                        <Star className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-baseline gap-2">
                            <div className="text-2xl font-bold">{(metrics?.trustScore || 0).toFixed(2)}</div>
                            <Badge variant="secondary" className="bg-primary/20 text-primary hover:bg-primary/20">
                                {metrics?.trustScore && metrics.trustScore > 0.8 ? 'Excellent' : 'Good'}
                            </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Network Rating
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics?.conversionRate ? `${metrics.conversionRate}%` : '0%'}</div>
                        <p className="text-xs text-muted-foreground">
                            Approval Ratio
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>
                            Your latest submissions and payout events.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            {metrics?.recentActivity?.length > 0 ? (
                                metrics.recentActivity.map((activity: any) => (
                                    <div key={activity.id} className="flex items-center">
                                        <span className="relative flex h-2 w-2 mr-4">
                                            {activity.type.includes('Approved') ? (
                                                <>
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                                </>
                                            ) : (
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-muted-foreground"></span>
                                            )}
                                        </span>
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium leading-none">
                                                {activity.type}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {activity.details} • {new Date(activity.time).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="ml-auto font-medium text-primary">{activity.amount}</div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-4 text-muted-foreground text-sm">
                                    No recent activity.
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Active Campaigns</CardTitle>
                        <CardDescription>
                            Campaigns you are currently clipped to.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {metrics?.activeCampaigns?.length > 0 ? (
                                metrics.activeCampaigns.map((campaign: any) => (
                                    <div key={campaign.id} className="flex items-center justify-between p-4 rounded-xl border bg-card/50">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                                                {campaign.type === 'CLIPPING' ?
                                                    <PlayCircle className="h-5 w-5 text-primary" /> :
                                                    <CheckCircle2 className="h-5 w-5 text-blue-500" />
                                                }
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-semibold">{campaign.name}</h4>
                                                <p className="text-xs text-muted-foreground">{campaign.type} Campaign • ${campaign.rewardPool} Pool</p>
                                            </div>
                                        </div>
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={`/creator/campaigns/${campaign.id}`}>View</Link>
                                        </Button>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-4 text-muted-foreground text-sm flex flex-col items-center gap-2">
                                    <p>You haven't joined any campaigns yet.</p>
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href="/creator/campaigns">Browse Campaigns</Link>
                                    </Button>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
