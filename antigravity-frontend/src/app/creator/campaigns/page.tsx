import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Filter, Play, DollarSign } from 'lucide-react';

export default function CreatorCampaignsPage() {
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

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card key={i} className="flex flex-col transition-all hover:shadow-md hover:border-primary/50">
                        <CardHeader>
                            <div className="flex items-center justify-between mb-2">
                                <Badge variant="outline" className={i % 2 === 0 ? "text-blue-500 border-blue-500/50" : "text-primary border-primary/50"}>
                                    {i % 2 === 0 ? 'Affiliate' : 'Clipping'}
                                </Badge>
                                <span className="text-xs text-muted-foreground flex items-center font-medium">
                                    <Play className="h-3 w-3 mr-1" /> Active
                                </span>
                            </div>
                            <CardTitle>Campaign Header {i}</CardTitle>
                            <CardDescription>
                                Brief description of the campaign goals and target audience. Looking for engaging content.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Min. Followers:</span>
                                    <span className="font-medium">10,000</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Reward Pool:</span>
                                    <span className="font-medium text-primary flex items-center">
                                        <DollarSign className="h-3 w-3" />
                                        {5000 * i}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Requirements:</span>
                                    <span className="font-medium">#ad #sponsor</span>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full">Apply Now</Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
