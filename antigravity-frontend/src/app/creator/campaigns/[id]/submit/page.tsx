'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import {
    Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, ArrowLeft, UploadCloud, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { use } from 'react';

export default function CampaignSubmitPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const campaignId = resolvedParams.id;
    const router = useRouter();

    const [campaign, setCampaign] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [contentUrl, setContentUrl] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await api.get(`/campaign/${campaignId}`);
                setCampaign(response.data);
            } catch (err) {
                console.error("Failed to fetch campaign details", err);
                setError('Could not load campaign context for submission.');
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [campaignId]);

    const handleSubmit = async () => {
        setSubmitting(true);
        setError('');

        try {
            // Again, hardcoded ID for demo until true Auth JWTs are wired
            await api.post('/submission', {
                campaignId,
                contentUrl,
                creatorId: 'cmm52kg4m0001ousgqsaed3mv'
            });

            setSuccess(true);
            setTimeout(() => {
                router.push('/creator/submissions');
            }, 2000);
        } catch (err: any) {
            console.error("Failed to submit", err);
            setError(err.response?.data?.message || 'Failed to analyze and submit content.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error && !campaign) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
                <div className="text-destructive font-medium border border-destructive/20 bg-destructive/10 p-4 rounded-xl">
                    {error}
                </div>
                <Button variant="outline" asChild>
                    <Link href="/creator/campaigns"><ArrowLeft className="h-4 w-4 mr-2" /> Back to Discovery</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="flex-1 space-y-8 p-4 md:p-8 pt-6 max-w-2xl mx-auto">
            <Button variant="ghost" asChild className="mb-4">
                <Link href={`/creator/campaigns/${campaignId}`}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Details
                </Link>
            </Button>

            <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Submit Content</h2>
                <p className="text-muted-foreground">
                    You are submitting performance material for the <strong className="text-foreground">{campaign.name}</strong> campaign. Our AI will automatically verify your compliance.
                </p>
            </div>

            {success ? (
                <Card className="border-emerald-500/50 bg-emerald-500/10">
                    <CardContent className="flex flex-col items-center justify-center py-12 gap-4">
                        <CheckCircle2 className="h-16 w-16 text-emerald-500" />
                        <div className="text-center">
                            <h3 className="text-xl font-bold text-emerald-500">Submission Successful!</h3>
                            <p className="text-sm text-emerald-500/80 mt-1">Redirecting to your submission dashboard...</p>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Card className="border-primary/50 shadow-lg shadow-primary/5">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <UploadCloud className="h-5 w-5 text-primary" /> Content URL
                        </CardTitle>
                        <CardDescription>
                            Paste the direct URL to your TikTok, Instagram Reel, or YouTube Short.
                        </CardDescription>
                    </CardHeader>
                    <div>
                        <CardContent className="space-y-6">
                            {error && (
                                <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-lg border border-destructive/20">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="url">Direct Post Link</Label>
                                <Input
                                    id="url"
                                    type="url"
                                    required
                                    placeholder="https://tiktok.com/@user/video/123456789"
                                    className="h-12 bg-background text-lg"
                                    value={contentUrl}
                                    onChange={(e) => setContentUrl(e.target.value)}
                                />
                            </div>

                            <div className="p-4 bg-muted/40 rounded-xl space-y-2">
                                <h4 className="text-sm font-semibold">Pre-flight Checklist:</h4>
                                <ul className="text-sm text-muted-foreground list-disc pl-4 space-y-1">
                                    <li>Ensure your post is strictly Public.</li>
                                    <li>Watermarks from other platforms will result in immediate rejection.</li>
                                    <li>You must include the required hashtags: <span className="font-mono text-primary">{campaign.requiredHashtags?.join(', ') || 'None'}</span></li>
                                </ul>
                            </div>
                        </CardContent>
                        <CardFooter className="bg-muted/20 border-t pt-6">
                            <Button size="lg" className="w-full text-md font-bold" onClick={handleSubmit} disabled={submitting || !contentUrl}>
                                {submitting ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : null}
                                Run AI Analysis & Submit
                            </Button>
                        </CardFooter>
                    </div>
                </Card>
            )}
        </div>
    );
}
