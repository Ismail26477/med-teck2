import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export function Logo({ size = "md", showText = true, className }: LogoProps) {
  const dims = size === "sm" ? "h-8 w-8" : size === "lg" ? "h-12 w-12" : "h-10 w-10";
  const iconSize = size === "sm" ? 16 : size === "lg" ? 24 : 20;
  const textSize = size === "sm" ? "text-lg" : size === "lg" ? "text-3xl" : "text-2xl";

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="relative">
        <div className={cn("rounded-full bg-gradient-hero flex items-center justify-center shadow-soft", dims)}>
          <Lock className="text-primary-foreground" size={iconSize} strokeWidth={2.5} />
        </div>
        <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-success ring-2 ring-background" />
      </div>
      {showText && <span className={cn("font-serif text-foreground", textSize)}>MediSync</span>}
    </div>
  );
}
