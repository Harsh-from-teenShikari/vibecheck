import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, ShieldAlert, BarChart3, TrendingDown, Users } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function OperatorDashboardPage() {
    return (
        <div className="flex flex-col gap-6 w-full">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Control Plane</h1>
                <p className="text-muted-foreground">
                    System health, verification metrics, and drift monitoring.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Network Load</CardTitle>
                        <Activity className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">128 req/s</div>
                        <p className="text-xs text-muted-foreground">
                            +14% from last hour
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Verifications</CardTitle>
                        <ShieldAlert className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">42</div>
                        <p className="text-xs text-amber-500 mt-1 flex items-center">
                            Requires manual review
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Fraud Detection Rate</CardTitle>
                        <TrendingDown className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1.2%</div>
                        <p className="text-xs text-emerald-500 mt-1 flex items-center">
                            Target: &lt; 2.0%
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Creators</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1,402</div>
                        <p className="text-xs text-muted-foreground">
                            +82 this week
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>System Drift Monitor</CardTitle>
                        <CardDescription>
                            AI model confidence and approval rate drift over the last 24 hours.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-center justify-center border-t border-border/50">
                        {/* Chart Placeholder */}
                        <div className="flex flex-col items-center text-muted-foreground">
                            <BarChart3 className="h-10 w-10 mb-2 opacity-20" />
                            <p className="text-sm">Metrics visualization</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Escalated Submissions</CardTitle>
                        <CardDescription>
                            Items flagged by fraud heuristics requiring manual operator review.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                { id: 'SUB-9982', risk: 'High', reason: 'Bot Activity Pattern' },
                                { id: 'SUB-9811', risk: 'Medium', reason: 'Low AI Confidence' },
                                { id: 'SUB-9742', risk: 'High', reason: 'Banned Keyword Detected' },
                            ].map((item) => (
                                <div key={item.id} className="flex items-center justify-between p-3 rounded-xl border bg-card/50">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium">{item.id}</span>
                                        <span className="text-xs text-muted-foreground">{item.reason}</span>
                                    </div>
                                    <Badge variant={item.risk === 'High' ? 'destructive' : 'secondary'} className={item.risk === 'Medium' ? 'bg-amber-500/20 text-amber-500' : ''}>
                                        {item.risk} Risk
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Audit Logs</CardTitle>
                    <CardDescription>System-wide actions and configuration changes.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Timestamp</TableHead>
                                <TableHead>Actor</TableHead>
                                <TableHead>Action</TableHead>
                                <TableHead>Entity</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {[
                                { time: '10 mins ago', actor: 'System Worker', action: 'Process Payout Batch', entity: 'Payout' },
                                { time: '1 hr ago', actor: 'Admin O-221', action: 'Updated Campaign Reward', entity: 'Campaign #CPN-890' },
                                { time: '2 hrs ago', actor: 'AI Verifier', action: 'Flagged Submission', entity: 'Submission #SUB-9982' },
                            ].map((log, i) => (
                                <TableRow key={i}>
                                    <TableCell className="text-muted-foreground">{log.time}</TableCell>
                                    <TableCell className="font-medium">{log.actor}</TableCell>
                                    <TableCell>{log.action}</TableCell>
                                    <TableCell>{log.entity}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
