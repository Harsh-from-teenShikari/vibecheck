'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Loader2 } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, MoreHorizontal } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function OperatorCampaigns() {
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [sheetOpen, setSheetOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [newCampaign, setNewCampaign] = useState({
        name: '',
        type: 'CLIPPING',
        region: 'Global',
        minFollowers: 0,
        targetNiche: '',
        targetMetric: 0,
        targetReward: 0,
        rewardPool: 0,
        requiredHashtags: ''
    });

    // Edit Modal State
    const [editSheetOpen, setEditSheetOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editCampaignId, setEditCampaignId] = useState('');
    const [editCampaignData, setEditCampaignData] = useState({
        name: '',
        type: 'CLIPPING',
        region: 'Global',
        minFollowers: 0,
        targetNiche: '',
        targetMetric: 0,
        targetReward: 0,
        rewardPool: 0,
        requiredHashtags: ''
    });

    const fetchCampaigns = async () => {
        try {
            const response = await api.get('/campaign');
            setCampaigns(response.data);
        } catch (error) {
            console.error('Failed to fetch campaigns', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const handleCreateCampaign = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsCreating(true);
        try {
            const payload = {
                ...newCampaign,
                minFollowers: Number(newCampaign.minFollowers),
                targetMetric: Number(newCampaign.targetMetric),
                targetReward: Number(newCampaign.targetReward),
                rewardPool: Number(newCampaign.rewardPool),
                requiredHashtags: newCampaign.requiredHashtags.split(',').map(s => s.trim()).filter(Boolean)
            };
            await api.post('/campaign', payload);

            // Close and refresh
            setSheetOpen(false);
            setLoading(true);
            await fetchCampaigns();

            // Reset form
            setNewCampaign({
                name: '', type: 'CLIPPING', region: 'Global', minFollowers: 0, targetNiche: '', targetMetric: 0, targetReward: 0, rewardPool: 0, requiredHashtags: ''
            });
        } catch (error) {
            console.error('Failed to create campaign', error);
        } finally {
            setIsCreating(false);
        }
    };

    const handleActivate = async (id: string) => {
        try {
            await api.patch(`/campaign/${id}/activate`);
            setLoading(true);
            await fetchCampaigns();
        } catch (error) {
            console.error('Failed to activate campaign', error);
        }
    };

    const handlePause = async (id: string) => {
        try {
            await api.patch(`/campaign/${id}/pause`);
            setLoading(true);
            await fetchCampaigns();
        } catch (error) {
            console.error('Failed to pause campaign', error);
        }
    };

    const handleOpenEdit = (campaign: any) => {
        setEditCampaignId(campaign.id);
        setEditCampaignData({
            name: campaign.name || '',
            type: campaign.type || 'CLIPPING',
            region: campaign.region || 'Global',
            minFollowers: campaign.minFollowers || 0,
            targetNiche: campaign.targetNiche || '',
            targetMetric: campaign.targetMetric || 0,
            targetReward: campaign.targetReward || 0,
            rewardPool: campaign.rewardPool || 0,
            requiredHashtags: Array.isArray(campaign.requiredHashtags)
                ? campaign.requiredHashtags.join(', ')
                : campaign.requiredHashtags || ''
        });
        setEditSheetOpen(true);
    };

    const handleEditCampaign = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsEditing(true);
        try {
            const payload = {
                ...editCampaignData,
                minFollowers: Number(editCampaignData.minFollowers),
                targetMetric: Number(editCampaignData.targetMetric),
                targetReward: Number(editCampaignData.targetReward),
                rewardPool: Number(editCampaignData.rewardPool),
                requiredHashtags: typeof editCampaignData.requiredHashtags === 'string'
                    ? editCampaignData.requiredHashtags.split(',').map(s => s.trim()).filter(Boolean)
                    : editCampaignData.requiredHashtags
            };
            await api.patch(`/campaign/${editCampaignId}`, payload);

            setEditSheetOpen(false);
            setLoading(true);
            await fetchCampaigns();
        } catch (error) {
            console.error('Failed to edit campaign', error);
        } finally {
            setIsEditing(false);
        }
    };

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Campaign Management</h2>
                    <p className="text-muted-foreground">
                        Create, monitor, and adjust active performance campaigns across the network.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                        <SheetTrigger asChild>
                            <Button>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                New Campaign
                            </Button>
                        </SheetTrigger>
                        <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
                            <SheetHeader>
                                <SheetTitle>Create New Campaign</SheetTitle>
                                <SheetDescription>
                                    Deploy a new performance campaign to the network. Creators will instantly be able to clip and submit.
                                </SheetDescription>
                            </SheetHeader>
                            <form onSubmit={handleCreateCampaign} className="space-y-6 mt-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Campaign Name</Label>
                                    <Input
                                        id="name"
                                        required
                                        value={newCampaign.name}
                                        onChange={(e) => setNewCampaign(prev => ({ ...prev, name: e.target.value }))}
                                        placeholder="e.g. Summer SaaS Launch"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="type">Campaign Type</Label>
                                    <select
                                        id="type"
                                        required
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                                        value={newCampaign.type}
                                        onChange={(e) => setNewCampaign(prev => ({ ...prev, type: e.target.value }))}
                                    >
                                        <option value="CLIPPING">Clipping (CPA)</option>
                                        <option value="AFFILIATE">Affiliate (RevShare)</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="region">Region Target</Label>
                                        <Input
                                            id="region"
                                            required
                                            value={newCampaign.region}
                                            onChange={(e) => setNewCampaign(prev => ({ ...prev, region: e.target.value }))}
                                            placeholder="e.g. Global"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="targetNiche">Target Niche</Label>
                                        <Input
                                            id="targetNiche"
                                            required
                                            value={newCampaign.targetNiche}
                                            onChange={(e) => setNewCampaign(prev => ({ ...prev, targetNiche: e.target.value }))}
                                            placeholder="e.g. Tech, Finance"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="targetMetric">Target Metric (Views)</Label>
                                        <Input
                                            id="targetMetric"
                                            type="number"
                                            required
                                            min="0"
                                            value={newCampaign.targetMetric}
                                            onChange={(e) => setNewCampaign(prev => ({ ...prev, targetMetric: Number(e.target.value) }))}
                                            placeholder="e.g. 10000"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="targetReward">Reward on Hit ($)</Label>
                                        <Input
                                            id="targetReward"
                                            type="number"
                                            required
                                            min="0"
                                            value={newCampaign.targetReward}
                                            onChange={(e) => setNewCampaign(prev => ({ ...prev, targetReward: Number(e.target.value) }))}
                                            placeholder="e.g. 50"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="rewardPool">Total Funding Pool ($)</Label>
                                        <Input
                                            id="rewardPool"
                                            type="number"
                                            required
                                            min="0"
                                            value={newCampaign.rewardPool}
                                            onChange={(e) => setNewCampaign(prev => ({ ...prev, rewardPool: Number(e.target.value) }))}
                                            placeholder="e.g. 10000"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="minFollowers">Min Followers Req.</Label>
                                        <Input
                                            id="minFollowers"
                                            type="number"
                                            required
                                            min="0"
                                            value={newCampaign.minFollowers}
                                            onChange={(e) => setNewCampaign(prev => ({ ...prev, minFollowers: Number(e.target.value) }))}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="hashtags">Required Hashtags (Comma separated)</Label>
                                    <Input
                                        id="hashtags"
                                        required
                                        value={newCampaign.requiredHashtags}
                                        onChange={(e) => setNewCampaign(prev => ({ ...prev, requiredHashtags: e.target.value }))}
                                        placeholder="e.g. #tech, #saas"
                                    />
                                </div>

                                <SheetFooter className="mt-8">
                                    <Button type="submit" disabled={isCreating} className="w-full">
                                        {isCreating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                        Launch Campaign
                                    </Button>
                                </SheetFooter>
                            </form>
                        </SheetContent>
                    </Sheet>

                    {/* EDIT CAMPAIGN SHEET */}
                    <Sheet open={editSheetOpen} onOpenChange={setEditSheetOpen}>
                        <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
                            <SheetHeader>
                                <SheetTitle>Edit Campaign</SheetTitle>
                                <SheetDescription>
                                    Modify campaign details. Changes reflect immediately to all participating creators.
                                </SheetDescription>
                            </SheetHeader>
                            <form onSubmit={handleEditCampaign} className="space-y-6 mt-6">
                                <div className="space-y-2">
                                    <Label htmlFor="edit-name">Campaign Name</Label>
                                    <Input
                                        id="edit-name"
                                        required
                                        value={editCampaignData.name}
                                        onChange={(e) => setEditCampaignData(prev => ({ ...prev, name: e.target.value }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-type">Campaign Type</Label>
                                    <select
                                        id="edit-type"
                                        required
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                        value={editCampaignData.type}
                                        onChange={(e) => setEditCampaignData(prev => ({ ...prev, type: e.target.value }))}
                                    >
                                        <option value="CLIPPING">Clipping (CPA)</option>
                                        <option value="AFFILIATE">Affiliate (RevShare)</option>
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-region">Region Target</Label>
                                        <Input
                                            id="edit-region"
                                            required
                                            value={editCampaignData.region}
                                            onChange={(e) => setEditCampaignData(prev => ({ ...prev, region: e.target.value }))}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-targetNiche">Target Niche</Label>
                                        <Input
                                            id="edit-targetNiche"
                                            required
                                            value={editCampaignData.targetNiche}
                                            onChange={(e) => setEditCampaignData(prev => ({ ...prev, targetNiche: e.target.value }))}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-targetMetric">Target Metric (Views)</Label>
                                        <Input
                                            id="edit-targetMetric"
                                            type="number"
                                            required
                                            min="0"
                                            value={editCampaignData.targetMetric}
                                            onChange={(e) => setEditCampaignData(prev => ({ ...prev, targetMetric: Number(e.target.value) }))}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-targetReward">Reward on Hit ($)</Label>
                                        <Input
                                            id="edit-targetReward"
                                            type="number"
                                            required
                                            min="0"
                                            value={editCampaignData.targetReward}
                                            onChange={(e) => setEditCampaignData(prev => ({ ...prev, targetReward: Number(e.target.value) }))}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-rewardPool">Total Funding Pool ($)</Label>
                                        <Input
                                            id="edit-rewardPool"
                                            type="number"
                                            required
                                            min="0"
                                            value={editCampaignData.rewardPool}
                                            onChange={(e) => setEditCampaignData(prev => ({ ...prev, rewardPool: Number(e.target.value) }))}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-minFollowers">Min Followers Req.</Label>
                                        <Input
                                            id="edit-minFollowers"
                                            type="number"
                                            required
                                            min="0"
                                            value={editCampaignData.minFollowers}
                                            onChange={(e) => setEditCampaignData(prev => ({ ...prev, minFollowers: Number(e.target.value) }))}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-hashtags">Required Hashtags (Comma separated)</Label>
                                    <Input
                                        id="edit-hashtags"
                                        required
                                        value={editCampaignData.requiredHashtags}
                                        onChange={(e) => setEditCampaignData(prev => ({ ...prev, requiredHashtags: e.target.value }))}
                                    />
                                </div>
                                <SheetFooter className="mt-8">
                                    <Button type="submit" disabled={isEditing} className="w-full">
                                        {isEditing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                        Save Changes
                                    </Button>
                                </SheetFooter>
                            </form>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Active Campaigns</CardTitle>
                    <CardDescription>
                        You are currently running {campaigns.filter(c => c.status === 'active').length} active campaigns.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center p-8">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Campaign Name</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Budget</TableHead>
                                    <TableHead>Spent</TableHead>
                                    <TableHead>Submissions</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {campaigns.map((campaign) => (
                                    <TableRow key={campaign.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex flex-col">
                                                <span>{campaign.name}</span>
                                                <span className="text-xs text-muted-foreground">{campaign.id}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="font-mono text-xs">
                                                {campaign.type}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={campaign.status === 'active' ? 'default' : 'secondary'}
                                                className={campaign.status === 'active' ? 'bg-primary/20 text-primary hover:bg-primary/30' : ''}
                                            >
                                                {campaign.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>${campaign.rewardPool || 0}</TableCell>
                                        <TableCell>$-</TableCell>
                                        <TableCell>-</TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    {campaign.status !== 'active' && (
                                                        <DropdownMenuItem onClick={() => handleActivate(campaign.id)} className="text-emerald-500 font-medium">
                                                            Activate Campaign
                                                        </DropdownMenuItem>
                                                    )}
                                                    {campaign.status !== 'paused' && (
                                                        <DropdownMenuItem onClick={() => handlePause(campaign.id)} className="text-amber-500 font-medium">
                                                            Pause Campaign
                                                        </DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => window.location.href = `/operator/campaigns/${campaign.id}`}>View Details</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleOpenEdit(campaign)}>Edit Campaign</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {campaigns.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                                            No campaigns found. Create one to get started.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
