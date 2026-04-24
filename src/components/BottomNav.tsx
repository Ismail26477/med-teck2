import { Link, useLocation } from "react-router-dom";
import { Home, ScanLine, QrCode, ClipboardList, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/dashboard", label: "Home", icon: Home },
  { to: "/scans", label: "Scans", icon: ScanLine },
  { to: "/qr", label: "QR", icon: QrCode },
  { to: "/summary", label: "Summary", icon: ClipboardList },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function BottomNav() {
  const { pathname } = useLocation();
  return (
    <nav
      aria-label="Primary"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border/60 bg-background/95 backdrop-blur-md pb-safe-bottom"
    >
      <ul className="grid grid-cols-5">
        {items.map((it) => {
          const active = pathname === it.to || (it.to !== "/dashboard" && pathname.startsWith(it.to));
          const Icon = it.icon;
          return (
            <li key={it.to}>
              <Link
                to={it.to}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium transition-smooth",
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <span
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-lg transition-smooth",
                    active ? "bg-primary/10" : "bg-transparent"
                  )}
                >
                  <Icon className="h-[18px] w-[18px]" />
                </span>
                {it.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
