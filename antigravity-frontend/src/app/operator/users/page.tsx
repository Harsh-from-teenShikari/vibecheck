'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Loader2 } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Search, ShieldBan, ShieldCheck, MoreHorizontal } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function OperatorUsers() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get('/identity/users');
                setUsers(response.data);
            } catch (error) {
                console.error('Failed to fetch users', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Identity & Trust Management</h2>
                    <p className="text-muted-foreground">
                        Monitor creator trust scores, enforce KYC policies, and moderate platform access.
                    </p>
                </div>
            </div>

            <div className="flex items-center space-x-2 my-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search users by handle or ID..."
                        className="pl-8 bg-muted/50 border-input"
                    />
                </div>
                <Button variant="outline">Filter by Status</Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Creator Registry</CardTitle>
                    <CardDescription>
                        Showing {users.length} registered creators on the network.
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
                                    <TableHead>Creator</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Trust Score</TableHead>
                                    <TableHead>KYC Status</TableHead>
                                    <TableHead>Total Earned</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((profile) => (
                                    <TableRow key={profile.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex flex-col">
                                                <span>@{profile.user?.email?.split('@')[0]}</span>
                                                <span className="text-xs text-muted-foreground">{profile.id}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">{profile.user?.email}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 w-16 bg-muted rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full ${profile.trustScore > 0.8 ? 'bg-green-500' : profile.trustScore > 0.5 ? 'bg-amber-500' : 'bg-red-500'}`}
                                                        style={{ width: `${profile.trustScore * 100}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm font-medium">{profile.trustScore.toFixed(2)}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={
                                                    profile.kycStatus === 'verified' ? 'border-green-500/50 text-green-500' :
                                                        profile.kycStatus === 'rejected' ? 'border-red-500/50 text-red-500' :
                                                            'border-amber-500/50 text-amber-500'
                                                }
                                            >
                                                {profile.kycStatus}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>$0.00</TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Moderation</DropdownMenuLabel>
                                                    <DropdownMenuItem>
                                                        <ShieldCheck className="mr-2 h-4 w-4 text-green-500" />
                                                        Approve KYC
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-red-500">
                                                        <ShieldBan className="mr-2 h-4 w-4" />
                                                        Suspend Account
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {users.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                                            No creators registered yet.
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
