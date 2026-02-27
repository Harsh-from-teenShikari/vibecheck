import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, Shield, Repeat } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full py-20 md:py-32 lg:py-48 overflow-hidden">
          <div className="absolute inset-0 bg-background bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background"></div>
          <div className="container relative px-4 md:px-6 z-10">
            <div className="flex flex-col items-center space-y-8 text-center">
              <div className="space-y-4 max-w-4xl">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                  Industrial-Grade Performance Marketing
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join the Antigravity Performance Network. AI-verified, financially immutable infrastructure for Clipping and Affiliate campaigns.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="h-12 px-8 font-semibold" asChild>
                  <Link href="/creator/dashboard">
                    Creator Portal <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="h-12 px-8 font-semibold" asChild>
                  <Link href="/operator/dashboard">
                    Control Plane
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
              <div className="group relative flex flex-col items-center space-y-4 text-center p-6 rounded-2xl bg-card border transition-all hover:bg-muted/50 hover:border-primary/50 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="p-3 rounded-full bg-primary/10 text-primary mb-2">
                  <Shield className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">Fraud-Proof Ledger</h3>
                <p className="text-sm text-muted-foreground">
                  Double-entry accounting ensures financial immutability. Every payout and commission is verified and undeniable.
                </p>
              </div>
              <div className="group relative flex flex-col items-center space-y-4 text-center p-6 rounded-2xl bg-card border transition-all hover:bg-muted/50 hover:border-primary/50 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="p-3 rounded-full bg-primary/10 text-primary mb-2">
                  <Zap className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">Tiered AI Verification</h3>
                <p className="text-sm text-muted-foreground">
                  Intelligent processing pipeline automatically verifies submissions with structured outputs and automated escalation.
                </p>
              </div>
              <div className="group relative flex flex-col items-center space-y-4 text-center p-6 rounded-2xl bg-card border transition-all hover:bg-muted/50 hover:border-primary/50 overflow-hidden sm:col-span-2 lg:col-span-1">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="p-3 rounded-full bg-primary/10 text-primary mb-2">
                  <Repeat className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">Dynamic Economics</h3>
                <p className="text-sm text-muted-foreground">
                  Campaign distributions optimized via trust scores and real-time heuristics to maximize network efficiency.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full py-6 border-t px-4 md:px-6 flex flex-col sm:flex-row items-center justify-between">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Antigravity Performance Network. All rights reserved.
        </p>
        <nav className="flex gap-4 sm:gap-6 mt-4 sm:mt-0">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
