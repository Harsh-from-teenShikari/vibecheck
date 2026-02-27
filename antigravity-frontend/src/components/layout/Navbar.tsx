import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Orbit } from 'lucide-react';

export function Navbar() {
    return (
        <nav className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center">
                <div className="ml-4 mr-4 hidden md:flex">
                    <Link href="/" className="mr-6 flex items-center space-x-2">
                        <Orbit className="h-6 w-6 text-primary" />
                        <span className="hidden font-bold sm:inline-block">
                            Antigravity
                        </span>
                    </Link>
                    <nav className="flex items-center space-x-6 text-sm font-medium">
                        <Link
                            href="/creator/dashboard"
                            className="transition-colors hover:text-foreground/80 text-foreground/60"
                        >
                            Creators
                        </Link>
                        <Link
                            href="/operator/dashboard"
                            className="transition-colors hover:text-foreground/80 text-foreground/60"
                        >
                            Operators
                        </Link>
                    </nav>
                </div>
                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end mr-4">
                    <nav className="flex items-center space-x-2">
                        <Button variant="ghost" className="hidden sm:inline-flex">
                            Sign In
                        </Button>
                        <Button>Get Started</Button>
                    </nav>
                </div>
            </div>
        </nav>
    );
}
