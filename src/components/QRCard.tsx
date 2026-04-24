import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Download, Printer } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface Props {
  value: string;
  enabled: boolean;
  size?: number;
}

export function QRCard({ value, enabled, size = 280 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dataUrl, setDataUrl] = useState("");

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, value, {
        width: size,
        margin: 2,
        errorCorrectionLevel: "H",
        color: { dark: "#0c2340", light: "#ffffff" },
      }).catch(() => {});
    }
    QRCode.toDataURL(value, {
      width: size * 2,
      margin: 2,
      errorCorrectionLevel: "H",
      color: { dark: "#0c2340", light: "#ffffff" },
    }).then(setDataUrl).catch(() => {});
  }, [value, size]);

  const onDownload = () => {
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = "medisync-qr.png";
    a.click();
  };

  const onPrint = () => {
    const w = window.open("", "_blank", "width=600,height=800");
    if (!w) return;
    w.document.write(`
      <html><head><title>MediSync QR</title>
      <style>body{font-family:system-ui,sans-serif;text-align:center;padding:48px;color:#0c2340}h1{font-family:Georgia,serif;font-weight:400}img{margin-top:24px;border:1px solid #e5e7eb;border-radius:16px;padding:16px;background:#fff}p{color:#64748b;font-size:13px;margin-top:24px;word-break:break-all}</style>
      </head><body>
      <h1>MediSync · Emergency QR</h1>
      <img src="${dataUrl}" width="320" height="320" alt="QR" />
      <p>${value}</p>
      <p style="margin-top:8px">Scan to view emergency medical info.</p>
      <script>window.onload=()=>window.print()</script>
      </body></html>
    `);
    w.document.close();
  };

  return (
    <div className="flex flex-col items-center">
      <div className={cn("relative rounded-2xl bg-white p-4 shadow-soft transition-smooth", !enabled && "opacity-90")}>
        <canvas ref={canvasRef} className={cn(!enabled && "blur-md grayscale")} />
        {!enabled && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-card/60 backdrop-blur-sm rounded-2xl">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
            <p className="mt-3 font-serif text-xl">QR is sealed</p>
            <p className="text-xs text-muted-foreground">Tap "Enable sharing" to turn on</p>
          </div>
        )}
      </div>
      <div className="mt-4 flex gap-2 w-full max-w-[280px]">
        <Button variant="outline" className="flex-1" onClick={onDownload} disabled={!enabled}><Download className="mr-1 h-4 w-4" /> PNG</Button>
        <Button variant="outline" className="flex-1" onClick={onPrint} disabled={!enabled}><Printer className="mr-1 h-4 w-4" /> Print</Button>
      </div>
    </div>
  );
}
