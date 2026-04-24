import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Check, Copy, ExternalLink, RefreshCw, Share2, Shield, Lock, EyeOff, FileHeart, RotateCw } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QRCard } from "@/components/QRCard";
import { disableShare, enableShare, rotateShareToken, useStore } from "@/lib/store";
import { useRequireAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const durations = [
  { label: "15 min", ms: 15 * 60 * 1000 },
  { label: "1 hour", ms: 60 * 60 * 1000 },
  { label: "24 hours", ms: 24 * 60 * 60 * 1000 },
  { label: "Until I turn it off", ms: null },
];

const securityPoints = [
  { icon: Lock, title: "Encrypted at rest", desc: "Stored only in your browser hub." },
  { icon: Shield, title: "You hold the key", desc: "No admins, no third parties." },
  { icon: Share2, title: "QR-based sharing", desc: "One-tap, time-limited access." },
  { icon: EyeOff, title: "Revoke anytime", desc: "Disable or rotate in one click." },
];

function formatRemaining(ms: number) {
  if (ms <= 0) return "Expired";
  const sec = Math.floor(ms / 1000);
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h) return `${h}h ${m}m ${s}s`;
  if (m) return `${m}m ${s}s`;
  return `${s}s`;
}

const QR = () => {
  const ok = useRequireAuth();
  const share = useStore((s) => s.share);
  const user = useStore((s) => s.user);
  const [selectedMs, setSelectedMs] = useState<number | null>(60 * 60 * 1000);
  const [copied, setCopied] = useState(false);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!share.enabled || share.expiresAt === null) return;
    const i = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(i);
  }, [share.enabled, share.expiresAt]);

  // Auto-disable when expired
  useEffect(() => {
    if (share.enabled && share.expiresAt !== null && now > share.expiresAt) {
      disableShare();
    }
  }, [share.enabled, share.expiresAt, now]);

  const url = useMemo(() => `${window.location.origin}/doctor/${share.token}`, [share.token]);
  const remaining = share.expiresAt !== null ? share.expiresAt - now : null;
  const isLive = share.enabled && (share.expiresAt === null || now < share.expiresAt);

  const onCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Copied");
    setTimeout(() => setCopied(false), 1500);
  };

  const onShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "MediSync emergency view", url });
      } catch {}
    } else {
      onCopy();
    }
  };

  const onEnable = () => {
    enableShare(selectedMs);
    toast.success("Sharing is live");
  };

  const onDisable = () => {
    disableShare();
    toast.success("Sealed");
  };

  const onRotate = () => {
    rotateShareToken();
    toast.success("New token minted — old links revoked");
  };

  if (!ok || !user) return null;

  return (
    <AppShell title="QR Sharing">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left: QR card */}
        <Card className="bg-gradient-card p-6 lg:p-8 rounded-3xl">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className={cn("font-medium", isLive ? "bg-success/10 text-success border-success/30" : "bg-muted text-muted-foreground")}>
              <span className={cn("mr-1.5 h-2 w-2 rounded-full", isLive ? "bg-success animate-pulse" : "bg-muted-foreground/50")} />
              {isLive ? "Live · Sharing on" : "Sealed · Sharing off"}
            </Badge>
            {remaining !== null && isLive && (
              <span className="text-xs font-medium text-muted-foreground tabular-nums">
                {formatRemaining(remaining)}
              </span>
            )}
          </div>

          <div className="mt-6 flex flex-col items-center">
            <QRCard value={url} enabled={isLive} />
            <p className="mt-4 text-xs text-muted-foreground font-mono">token · {share.token.slice(0, 6)}…</p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-2">
            <Button variant="outline" asChild><Link to="/summary"><FileHeart className="mr-1 h-4 w-4" /> Health Summary</Link></Button>
            <Button variant="hero" onClick={onShare} disabled={!isLive}><Share2 className="mr-1 h-4 w-4" /> Share link</Button>
          </div>
        </Card>

        {/* Right: controls */}
        <div className="space-y-5">
          {/* Sharing duration */}
          <Card className="bg-gradient-card p-6">
            <h2 className="font-serif text-2xl">Doctor sharing</h2>
            <p className="text-sm text-muted-foreground mt-1">When a doctor scans this QR code, they&apos;ll see only your medical data. Pick how long this QR stays live.</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {durations.map((d) => (
                <button
                  key={d.label}
                  type="button"
                  onClick={() => setSelectedMs(d.ms)}
                  className={cn(
                    "rounded-xl border p-3 text-sm font-medium transition-smooth text-left",
                    selectedMs === d.ms ? "border-primary bg-primary/5 text-foreground" : "border-border bg-card hover:border-primary/40"
                  )}
                >
                  {d.label}
                </button>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {isLive ? (
                <Button variant="outline" onClick={onDisable}>Disable now</Button>
              ) : (
                <Button variant="hero" onClick={onEnable}><Share2 className="mr-1 h-4 w-4" /> Enable sharing</Button>
              )}
              <Button variant="ghost" onClick={onRotate}><RotateCw className="mr-1 h-4 w-4" /> Rotate token</Button>
            </div>
          </Card>

          {/* Direct link */}
          {isLive && (
            <Card className="bg-gradient-card p-6">
              <h2 className="font-serif text-2xl">Direct link</h2>
              <div className="mt-3 flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-xs font-mono text-muted-foreground">
                <code className="flex-1 truncate">{url}</code>
                <Button size="sm" variant="ghost" onClick={onCopy}>
                  {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <Button variant="link" className="px-0 mt-2" asChild>
                <a href={url} target="_blank" rel="noreferrer"><ExternalLink className="mr-1 h-3.5 w-3.5" /> Preview emergency view</a>
              </Button>
            </Card>
          )}

          {/* Security */}
          <Card className="bg-gradient-soft p-6 border-border/60">
            <h2 className="font-serif text-2xl">Security & privacy</h2>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {securityPoints.map((p) => (
                <div key={p.title} className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-lg bg-accent text-accent-foreground flex items-center justify-center shrink-0">
                    <p.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{p.title}</p>
                    <p className="text-xs text-muted-foreground">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
};

export default QR;
