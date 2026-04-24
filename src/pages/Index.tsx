import { Link } from "react-router-dom";
import { ArrowRight, Shield, ScanLine, QrCode, Lock, Zap, FileHeart } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const features = [
  { icon: Shield, title: "Private by default", desc: "Your records live in your browser hub. No admins, no third parties." },
  { icon: QrCode, title: "QR-based sharing", desc: "Generate a one-tap QR for ER staff. Time-limited and revocable." },
  { icon: ScanLine, title: "Scans & reports", desc: "Keep X-rays, MRIs, prescriptions and lab reports in one place." },
  { icon: FileHeart, title: "Health summary", desc: "Allergies, meds, conditions and contacts ready in seconds." },
  { icon: Lock, title: "You hold the key", desc: "Encrypted at rest. Sealed unless you flip sharing on." },
  { icon: Zap, title: "Built for emergencies", desc: "Quick access view designed for first responders." },
];

const Index = () => {
  return (
    <div className="min-h-screen texture-bg">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-50 pointer-events-none" />
        <div className="container relative py-14 md:py-28">
          <div className="max-w-3xl animate-slide-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 backdrop-blur px-3 py-1.5 text-xs font-medium text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
              Private by default · You hold the key
            </div>
            <h1 className="mt-6 font-serif text-5xl md:text-7xl leading-[1.05] tracking-tight">
              Your health,{" "}
              <span className="italic text-gradient">in your pocket</span>.
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
              MediSync is your personal health hub for X-rays, prescriptions and reports. Generate a private QR you control —
              keep it sealed, or flip it on for an ER visit. Nobody sees your records unless you say so.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <Button variant="hero" size="xl" asChild>
                <Link to="/signup">
                  Create my health hub <ArrowRight className="ml-1" />
                </Link>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <Link to="/scan">
                  <ScanLine className="mr-1" /> Emergency view
                </Link>
              </Button>
            </div>
          </div>

          {/* Hero pill stats */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl animate-fade-in">
            <div>
              <p className="font-serif text-3xl">You</p>
              <p className="text-[11px] tracking-widest text-muted-foreground uppercase mt-0.5">One owner</p>
            </div>
            <div>
              <p className="font-serif text-3xl">Scans · PDF · Rx</p>
              <p className="text-[11px] tracking-widest text-muted-foreground uppercase mt-0.5">Files</p>
            </div>
            <div>
              <p className="font-serif text-3xl">QR-based</p>
              <p className="text-[11px] tracking-widest text-muted-foreground uppercase mt-0.5">Access</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container py-16 md:py-24">
        <div className="max-w-2xl animate-fade-in">
          <h2 className="font-serif text-4xl md:text-5xl">Everything in one calm, private hub.</h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Built for people, not paperwork. Add records once and find them whenever you need them.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <Card
              key={f.title}
              className="bg-gradient-card border-border/60 p-6 shadow-soft hover-lift animate-slide-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="h-11 w-11 rounded-xl bg-accent flex items-center justify-center text-accent-foreground">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-serif text-2xl">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-24">
        <div className="rounded-3xl bg-gradient-hero text-primary-foreground p-10 md:p-16 shadow-elegant relative overflow-hidden animate-fade-in">
          <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
          <div className="relative max-w-2xl text-center mx-auto">
            <h2 className="font-serif text-4xl md:text-5xl text-primary-foreground">
              Take your records back.<br />
              <span className="italic">Carry them. Control them.</span>
            </h2>
            <p className="mt-4 text-primary-foreground/85 text-base md:text-lg">
              Free to start. Your data stays in your browser — backend swap is one line of code away when you're ready.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/signup">Create my health hub</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="bg-transparent border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
                <Link to="/about">How it works</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/60 py-8">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <Logo size="sm" /> 
          <p>© {new Date().getFullYear()} MediSync · Demo build — your data stays in your browser.</p>
          <div className="flex gap-6">
            <Link to="/about" className="hover:text-foreground">About</Link>
            <Link to="/help" className="hover:text-foreground">Help</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
