'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    Megaphone,
    Upload,
    CreditCard,
    ShieldAlert,
    BarChart,
    FileText,
    Activity,
    Users
} from 'lucide-react';

const creatorNavItems = [
    { title: 'Dashboard', href: '/creator/dashboard', icon: LayoutDashboard },
    { title: 'Campaigns', href: '/creator/campaigns', icon: Megaphone },
    { title: 'Submissions', href: '/creator/submissions', icon: Upload },
    { title: 'Payouts', href: '/creator/payouts', icon: CreditCard },
];

const operatorNavItems = [
    { title: 'Dashboard', href: '/operator/dashboard', icon: BarChart },
    { title: 'Campaigns', href: '/operator/campaigns', icon: Megaphone },
    { title: 'Verification', href: '/operator/verification', icon: ShieldAlert },
    { title: 'Ledger', href: '/operator/ledger', icon: FileText },
    { title: 'Drift', href: '/operator/drift', icon: Activity },
    { title: 'Users', href: '/operator/users', icon: Users },
];

interface SidebarProps {
    role: 'creator' | 'operator';
}

export function Sidebar({ role }: SidebarProps) {
    const pathname = usePathname();
    const navItems = role === 'creator' ? creatorNavItems : operatorNavItems;

    return (
        <nav className="hidden border-r bg-muted/40 md:block w-64 h-[calc(100vh-4rem)] sticky top-16">
            <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex-1 overflow-auto py-2">
                    <nav className="grid items-start px-2 text-sm font-medium lg:px-4 space-y-1">
                        <div className="mb-4 mt-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            {role === 'creator' ? 'Creator Space' : 'Control Plane'}
                        </div>
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                                        pathname === item.href
                                            ? 'bg-muted text-primary font-semibold'
                                            : ''
                                    )}
                                >
                                    <Icon className="h-4 w-4" />
                                    {item.title}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </div>
        </nav>
    );
}
