import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Activity, CreditCard, Star, TrendingUp, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function CreatorDashboardPage() {
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
                        <div className="text-2xl font-bold">$1,245.00</div>
                        <p className="text-xs text-muted-foreground">
                            +20.1% from last month
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12</div>
                        <p className="text-xs text-muted-foreground">
                            4 under AI review
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
                            <div className="text-2xl font-bold">0.92</div>
                            <Badge variant="secondary" className="bg-primary/20 text-primary hover:bg-primary/20">Excellent</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Top 5% of network
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">4.2%</div>
                        <p className="text-xs text-muted-foreground">
                            +1.2% this week
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
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex items-center">
                                    <span className="relative flex h-2 w-2 mr-4">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                    </span>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none">
                                            Submission Approved
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Campaign #CPN-{890 + i} • AI Verification Passed
                                        </p>
                                    </div>
                                    <div className="ml-auto font-medium text-primary">+$45.00</div>
                                </div>
                            ))}
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
                            <div className="flex items-center justify-between p-4 rounded-xl border bg-card/50">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                                        <CheckCircle2 className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold">Nike Run Club</h4>
                                        <p className="text-xs text-muted-foreground">Clipping Campaign</p>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm">Submit</Button>
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-xl border bg-card/50">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                                        <CheckCircle2 className="h-5 w-5 text-blue-500" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold">WebFlow Partner</h4>
                                        <p className="text-xs text-muted-foreground">Affiliate Campaign</p>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm">Stats</Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
