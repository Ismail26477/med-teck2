import { useNavigate } from "react-router-dom";
import {
  ScanLine, Pill, FileText, HeartPulse, ClipboardList, Plus, QrCode,
  Droplet, User, Ruler, Weight, CalendarCheck, Pencil, ArrowRight, Upload,
  Activity, ShieldCheck, Lock, Eye, Share2,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRequireAuth } from "@/hooks/use-auth";
import { useStore } from "@/lib/store";
import { useState } from "react";
import { UploadModal } from "@/components/UploadModal";
import { FileCategory } from "@/lib/store";

const Dashboard = () => {
  const ok = useRequireAuth();
  const navigate = useNavigate();
  const user = useStore((s) => s.user);
  const files = useStore((s) => s.files);
  const medications = useStore((s) => s.medications);
  const share = useStore((s) => s.share);

  const [uploadOpen, setUploadOpen] = useState(false);
  const [defaultCat, setDefaultCat] = useState<FileCategory>("scan");

  if (!ok || !user) return null;

  const openUpload = (cat: FileCategory) => {
    setDefaultCat(cat);
    setUploadOpen(true);
  };

  const scanCount = files.filter((f) => f.category === "scan").length;
  const reportCount = files.filter((f) => f.category === "report").length;
  const rxCount = files.filter((f) => f.category === "prescription").length;

  const stats = [
    { icon: ScanLine, label: "SCANS", value: scanCount, accent: "bg-accent text-accent-foreground", to: "/scans" },
    { icon: Pill, label: "PRESCRIPTIONS", value: rxCount, accent: "bg-success/15 text-success", to: "/prescriptions" },
    { icon: FileText, label: "REPORTS", value: reportCount, accent: "bg-teal/15 text-teal", to: "/reports" },
    { icon: HeartPulse, label: "MEDICATIONS", value: medications.length, accent: "bg-warning/15 text-warning", to: "/medications" },
  ];

  const quickActions = [
    { icon: ScanLine, label: "Add scan", cat: "scan" as FileCategory, accent: "bg-accent text-accent-foreground" },
    { icon: Pill, label: "Add prescription", cat: "prescription" as FileCategory, accent: "bg-success/15 text-success" },
    { icon: FileText, label: "Add lab report", cat: "report" as FileCategory, accent: "bg-teal/15 text-teal" },
    { icon: HeartPulse, label: "Log medication", to: "/medications", accent: "bg-warning/15 text-warning" },
    { icon: ClipboardList, label: "Health summary", to: "/summary", accent: "bg-primary/10 text-primary" },
    { icon: Pencil, label: "Update profile", to: "/settings", accent: "bg-teal/15 text-teal" },
  ];

  // Age from DOB
  const age = user.dob ? new Date().getFullYear() - new Date(user.dob).getFullYear() : null;

  // Recent scans (last 3 of category scan)
  const recentScans = [...files]
    .filter((f) => f.category === "scan")
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 3);

  // Recent activity (mock based on data)
  const activity = [
    share.enabled && { icon: Share2, label: "Sharing enabled with expiry", time: "Just now", accent: "bg-success/15 text-success" },
    { icon: Activity, label: "Updated health profile", time: "Today", accent: "bg-primary/10 text-primary" },
    { icon: ShieldCheck, label: "Health hub created", time: new Date(user.createdAt).toLocaleDateString(), accent: "bg-teal/15 text-teal" },
  ].filter(Boolean) as { icon: React.ComponentType<{ className?: string }>; label: string; time: string; accent: string }[];

  return (
    <AppShell
      title="Dashboard"
      actions={
        <Button variant="hero" size="icon" className="rounded-xl" onClick={() => openUpload("scan")} aria-label="Quick upload">
          <Plus />
        </Button>
      }
    >
      {/* Welcome hero card */}
      <Card className="bg-gradient-welcome text-primary-foreground border-0 p-5 sm:p-6 md:p-8 rounded-3xl shadow-elegant relative overflow-hidden animate-slide-up">
        <div className="absolute inset-0 grid-bg opacity-15 pointer-events-none" />
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="min-w-0">
            <p className="eyebrow text-primary-foreground/80">Welcome back</p>
            <h2 className="page-title mt-2 text-primary-foreground">Hello, {user.name.split(" ")[0]}.</h2>
            <p className="mt-3 text-sm md:text-base text-primary-foreground/90 leading-relaxed max-w-md">
              Your full medical history, one tap away. Manage records, share your QR in emergencies, and keep your vitals in check.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 md:flex-col md:items-end">
            <Button variant="secondary" size="sm" className="rounded-xl" onClick={() => navigate("/qr")}>
              <QrCode className="mr-1 h-4 w-4" /> My QR
            </Button>
            <Button variant="outline" size="sm" className="rounded-xl bg-transparent border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground" onClick={() => navigate("/summary")}>
              <ClipboardList className="mr-1 h-4 w-4" /> Health Summary
            </Button>
          </div>
        </div>
      </Card>

      {/* Stats grid */}
      <div className="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {stats.map((s, i) => (
          <Card
            key={s.label}
            className="bg-card p-4 md:p-5 rounded-2xl hover-lift cursor-pointer animate-fade-in border-border/60"
            style={{ animationDelay: `${i * 60}ms` }}
            onClick={() => navigate(s.to)}
          >
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${s.accent}`}>
              <s.icon className="h-5 w-5" />
            </div>
            <p className="mt-3 font-serif text-3xl md:text-4xl leading-none">{s.value}</p>
            <p className="eyebrow mt-2">{s.label}</p>
          </Card>
        ))}
      </div>

      {/* Two-column: Quick actions + Health summary */}
      <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5">
        {/* Quick actions (spans 2 cols on lg) */}
        <Card className="lg:col-span-2 bg-gradient-card p-5 md:p-6 rounded-2xl animate-fade-in border-border/60">
          <div className="flex items-center justify-between">
            <h2 className="section-title">Quick actions</h2>
            <span className="text-xs text-primary font-medium">One tap, fewer steps.</span>
          </div>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {quickActions.map((a) => (
              <button
                key={a.label}
                type="button"
                onClick={() => (a.to ? navigate(a.to) : a.cat && openUpload(a.cat))}
                className="rounded-2xl border border-border bg-card p-4 text-left hover-lift transition-smooth"
              >
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${a.accent}`}>
                  <a.icon className="h-5 w-5" />
                </div>
                <p className="mt-3 font-medium text-sm">{a.label}</p>
              </button>
            ))}
          </div>
        </Card>

        {/* Health summary */}
        <Card className="bg-card p-5 md:p-6 rounded-2xl animate-fade-in border-border/60 flex flex-col">
          <div className="flex items-center justify-between">
            <h2 className="section-title">Health summary</h2>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate("/settings")} aria-label="Edit profile">
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2.5 flex-1">
            <SummaryStat icon={Droplet} label="BLOOD" value={user.bloodType || "—"} accent="text-destructive" />
            <SummaryStat icon={User} label="AGE" value={age ? `${age} yrs` : "—"} accent="text-primary" />
            <SummaryStat icon={Ruler} label="HEIGHT" value={user.heightCm ? `${user.heightCm} cm` : "—"} accent="text-teal" />
            <SummaryStat icon={Weight} label="WEIGHT" value={user.weightKg ? `${user.weightKg} kg` : "—"} accent="text-success" />
          </div>
          <div className="mt-2.5 rounded-xl border border-border bg-muted/40 p-3">
            <div className="flex items-center gap-2 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
              <CalendarCheck className="h-3.5 w-3.5" /> Last checkup
            </div>
            <p className="mt-1 text-sm font-medium">Not recorded</p>
          </div>
          <Button variant="ghost" size="sm" className="mt-3 justify-center text-primary" onClick={() => navigate("/summary")}>
            View full summary <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Button>
        </Card>
      </div>

      {/* Recent scans + Recent activity */}
      <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5">
        <Card className="lg:col-span-2 bg-card p-5 md:p-6 rounded-2xl border-border/60">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="section-title">Recent scans</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Your latest uploads</p>
            </div>
            <Button variant="ghost" size="sm" className="text-primary" onClick={() => navigate("/scans")}>
              View all <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </div>
          {recentScans.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-dashed border-border bg-muted/30 p-8 text-center">
              <div className="mx-auto h-11 w-11 rounded-full bg-primary/10 flex items-center justify-center">
                <Upload className="h-5 w-5 text-primary" />
              </div>
              <p className="mt-3 font-serif text-lg">No uploads yet</p>
              <p className="text-xs text-muted-foreground mt-1">Add a scan, prescription, or report.</p>
              <Button variant="hero" size="sm" className="mt-4 rounded-xl" onClick={() => openUpload("scan")}>
                <Plus className="mr-1 h-4 w-4" /> Upload Scans &amp; Documents
              </Button>
            </div>
          ) : (
            <ul className="mt-4 space-y-2">
              {recentScans.map((f) => (
                <li key={f._id} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 hover-lift">
                  <div className="h-10 w-10 rounded-lg bg-accent text-accent-foreground flex items-center justify-center shrink-0">
                    <ScanLine className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{f.title}</p>
                    <p className="text-xs text-muted-foreground">{new Date(f.date).toLocaleDateString()}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="bg-card p-5 md:p-6 rounded-2xl border-border/60">
          <h2 className="section-title">Recent activity</h2>
          <ul className="mt-4 space-y-3">
            {activity.map((a, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${a.accent}`}>
                  <a.icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium leading-tight">{a.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{a.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* My QR + Security & Privacy */}
      <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
        <Card className="bg-card p-5 md:p-6 rounded-2xl border-border/60">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <QrCode className="h-5 w-5" />
            </div>
            <h2 className="section-title">My QR Code</h2>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">Your private medical key. Sealed by default — share only when you choose.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="hero" size="sm" className="rounded-xl" onClick={() => navigate("/qr")}>
              <QrCode className="mr-1 h-4 w-4" /> Open QR
            </Button>
            <Button variant="outline" size="sm" className="rounded-xl" onClick={() => navigate("/summary")}>
              <ClipboardList className="mr-1 h-4 w-4" /> Health Summary
            </Button>
          </div>
        </Card>

        <Card className="bg-card p-5 md:p-6 rounded-2xl border-border/60">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-success/15 text-success flex items-center justify-center">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h2 className="section-title">Security &amp; privacy</h2>
          </div>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li className="flex items-center gap-2.5">
              <Lock className="h-4 w-4 text-success" />
              <span>Data is encrypted on your device</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Eye className="h-4 w-4 text-primary" />
              <span>Only you can access this health hub</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Share2 className="h-4 w-4 text-teal" />
              <span>Sharing only via your private QR</span>
            </li>
          </ul>
        </Card>
      </div>

      <UploadModal open={uploadOpen} onOpenChange={setUploadOpen} defaultCategory={defaultCat} />
    </AppShell>
  );
};

function SummaryStat({ icon: Icon, label, value, accent }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; accent: string }) {
  return (
    <div className="rounded-xl border border-border bg-muted/30 p-2.5">
      <div className="flex items-center gap-1.5 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
        <Icon className={`h-3.5 w-3.5 ${accent}`} /> {label}
      </div>
      <p className="mt-1 text-sm font-medium truncate">{value}</p>
    </div>
  );
}

export default Dashboard;
