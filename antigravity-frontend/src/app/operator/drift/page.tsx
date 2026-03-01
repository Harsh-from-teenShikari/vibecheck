'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, AlertTriangle, CheckCircle2, TrendingDown } from 'lucide-react';

const driftMetrics = [
    {
        campaign: 'Summer SaaS Launch',
        approvalRate: '85%',
        avgConfidence: '92%',
        fraudFlags: 12,
        status: 'Stable',
    },
    {
        campaign: 'Trading Strategy E-Book',
        approvalRate: '45%',
        avgConfidence: '65%',
        fraudFlags: 89,
        status: 'Drifting',
    },
    {
        campaign: 'Discord Community Promo',
        approvalRate: '98%',
        avgConfidence: '96%',
        fraudFlags: 1,
        status: 'Stable',
    },
];

export default function OperatorDrift() {
    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">AI Drift Analytics</h2>
                    <p className="text-muted-foreground">
                        Monitor the performance and confidence of the AI verification models across active campaigns.
                    </p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Global AI Confidence</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">84.3%</div>
                        <p className="text-xs text-muted-foreground">
                            -2.1% from last week
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Model Drift Alerts</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">3</div>
                        <p className="text-xs text-muted-foreground">
                            Campaigns requiring manual rule tuning
                        </p>
                    </CardContent>
                </Card>
            </div>

            <h3 className="text-xl font-bold mt-8 mb-4">Campaign Level Diagnostics</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {driftMetrics.map((metric) => (
                    <Card key={metric.campaign} className={metric.status === 'Drifting' ? 'border-amber-500/50' : ''}>
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-lg">{metric.campaign}</CardTitle>
                                <Badge variant={metric.status === 'Drifting' ? 'destructive' : 'default'} className={metric.status === 'Stable' ? 'bg-green-500/20 text-green-500 hover:bg-green-500/30' : ''}>
                                    {metric.status}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4 text-sm mt-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Approval Rate</span>
                                    <span className="font-medium flex items-center">
                                        {metric.approvalRate}
                                        {metric.status === 'Drifting' && <TrendingDown className="ml-2 h-4 w-4 text-red-500" />}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Avg Confidence</span>
                                    <span className="font-medium">{metric.avgConfidence}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Fraud Flags</span>
                                    <span className="font-medium text-amber-500">{metric.fraudFlags}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
