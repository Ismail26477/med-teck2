import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import jsQR from "jsqr";
import { Camera, ScanLine, Search, ShieldAlert, X, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/Logo";
import { toast } from "sonner";

const ScanQR = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const [active, setActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manual, setManual] = useState("");

  const stop = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setActive(false);
  };

  useEffect(() => () => stop(), []);

  const handleDetected = (text: string) => {
    stop();
    toast.success("QR detected");
    // Accept either full URL or bare token
    try {
      const url = new URL(text);
      const m = url.pathname.match(/\/emergency\/([\w-]+)/);
      if (m) {
        navigate(`/emergency/${m[1]}`);
        return;
      }
    } catch {
      /* not a URL */
    }
    if (/^[a-f0-9-]{6,}$/i.test(text)) {
      navigate(`/emergency/${text}`);
    } else {
      toast.error("Not a MediSync QR");
    }
  };

  const tick = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) {
      rafRef.current = requestAnimationFrame(tick);
      return;
    }
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(img.data, img.width, img.height, { inversionAttempts: "dontInvert" });
    if (code?.data) {
      handleDetected(code.data);
      return;
    }
    rafRef.current = requestAnimationFrame(tick);
  };

  const start = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setActive(true);
      rafRef.current = requestAnimationFrame(tick);
    } catch (e) {
      setError("Camera blocked. Allow camera access or paste the link below.");
      toast.error("Camera unavailable");
    }
  };

  const onManual = () => {
    if (!manual.trim()) return;
    handleDetected(manual.trim());
  };

  return (
    <div className="min-h-screen texture-bg">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/85 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" aria-label="MediSync home"><Logo size="sm" /></Link>
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-1 h-4 w-4" /> Back
          </Button>
        </div>
      </header>
      <main className="container py-8 max-w-xl mx-auto space-y-5 animate-fade-in">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-primary">Emergency view</p>
          <h1 className="font-serif text-3xl md:text-4xl mt-1">Scan a MediSync QR</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Point your camera at a MediSync code. You'll only see what its owner has chosen to share.
          </p>
        </div>

        <Card className="bg-gradient-card p-3 md:p-4 rounded-2xl overflow-hidden">
          <div className="relative aspect-square w-full rounded-xl bg-foreground/95 overflow-hidden">
            <video
              ref={videoRef}
              className="absolute inset-0 h-full w-full object-cover"
              playsInline
              muted
            />
            <canvas ref={canvasRef} className="hidden" />

            {!active && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-primary-foreground">
                <div className="h-14 w-14 rounded-2xl bg-primary-foreground/10 backdrop-blur flex items-center justify-center">
                  <ScanLine className="h-6 w-6" />
                </div>
                <p className="mt-3 font-serif text-2xl">Camera off</p>
                <p className="text-xs text-primary-foreground/70 mt-1">Tap start to enable scanning</p>
              </div>
            )}

            {active && (
              <>
                {/* Scanner reticle */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="relative h-3/5 w-3/5 max-w-[260px] max-h-[260px]">
                    <span className="absolute top-0 left-0 h-8 w-8 border-t-4 border-l-4 border-primary-foreground rounded-tl-xl" />
                    <span className="absolute top-0 right-0 h-8 w-8 border-t-4 border-r-4 border-primary-foreground rounded-tr-xl" />
                    <span className="absolute bottom-0 left-0 h-8 w-8 border-b-4 border-l-4 border-primary-foreground rounded-bl-xl" />
                    <span className="absolute bottom-0 right-0 h-8 w-8 border-b-4 border-r-4 border-primary-foreground rounded-br-xl" />
                    <div className="absolute left-2 right-2 top-1/2 h-0.5 bg-primary-foreground/70 shadow-glow animate-pulse" />
                  </div>
                </div>
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute top-3 right-3 rounded-full"
                  aria-label="Stop scanner"
                  onClick={stop}
                >
                  <X />
                </Button>
              </>
            )}
          </div>

          <div className="mt-3 flex items-center justify-between gap-2 px-1">
            <p className="text-xs text-muted-foreground">
              {active ? "Looking for QR…" : error || "Camera idle"}
            </p>
            {active ? (
              <Button variant="outline" onClick={stop}>Stop</Button>
            ) : (
              <Button variant="hero" onClick={start}>
                <Camera className="mr-1 h-4 w-4" /> Start scanner
              </Button>
            )}
          </div>
        </Card>

        <Card className="p-5 rounded-2xl">
          <h2 className="font-serif text-2xl">Manual lookup</h2>
          <p className="text-sm text-muted-foreground mt-1">Paste a MediSync token or emergency link.</p>
          <div className="mt-3 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={manual}
                onChange={(e) => setManual(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onManual()}
                placeholder="Token or /emergency/… link"
                className="pl-9 h-11 bg-card font-mono text-sm"
              />
            </div>
            <Button variant="hero" onClick={onManual}>Open</Button>
          </div>
        </Card>

        <Card className="p-4 rounded-2xl bg-accent/40 border-accent">
          <div className="flex items-start gap-3">
            <ShieldAlert className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              If a QR has been revoked or never enabled, you'll see an "access denied" page instead. Owners can rotate or seal their link at any time.
            </p>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default ScanQR;
