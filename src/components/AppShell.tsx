import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, ScanLine, ClipboardList, Pill, FileText, HeartPulse, AlertTriangle, QrCode, Settings, HelpCircle, LogOut, Menu, ScanSearch } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "./ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "./ui/sidebar";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { useStore, deleteAllData } from "@/lib/store";
import { sessionManager } from "@/lib/session";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { BottomNav } from "./BottomNav";
import { useState } from "react";
import { cn } from "@/lib/utils";

const recordsItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "My Scans", url: "/scans", icon: ScanLine },
  { title: "Health Summary", url: "/summary", icon: ClipboardList },
  { title: "Prescriptions", url: "/prescriptions", icon: Pill },
  { title: "Reports", url: "/reports", icon: FileText },
];

const healthItems = [
  { title: "Medications", url: "/medications", icon: HeartPulse },
  { title: "Allergies", url: "/allergies", icon: AlertTriangle },
];

const toolItems = [
  { title: "QR Code", url: "/qr", icon: QrCode },
  { title: "Scan QR", url: "/scan", icon: ScanSearch },
  { title: "Settings", url: "/settings", icon: Settings },
  { title: "Help & Support", url: "/help", icon: HelpCircle },
];

function AppSidebar() {
  const location = useLocation();
  const user = useStore((s) => s.user);
  const navigate = useNavigate();

  const isActive = (url: string) => location.pathname === url;

  const renderItem = (item: { title: string; url: string; icon: React.ComponentType<{ className?: string }> }) => (
    <SidebarMenuItem key={item.url}>
      <SidebarMenuButton asChild isActive={isActive(item.url)} className="data-[active=true]:bg-accent data-[active=true]:text-accent-foreground data-[active=true]:font-medium">
        <Link to={item.url}>
          <item.icon className="h-4 w-4" />
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );

  const handleLogout = () => {
    deleteAllData();
    navigate("/");
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <Link to="/dashboard" className="flex items-center gap-2 px-2 py-1.5">
          <Logo size="sm" showText={true} />
        </Link>
        <p className="px-2 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">Personal Health Hub</p>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Records</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{recordsItems.map(renderItem)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Health</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{healthItems.map(renderItem)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{toolItems.map(renderItem)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        {user && (
          <div className="flex items-center gap-3 rounded-lg p-2">
            <Avatar className="h-9 w-9 bg-gradient-hero">
              <AvatarFallback className="bg-gradient-hero text-primary-foreground font-semibold">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Log out">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}

function MobileNavSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useStore((s) => s.user);

  const groups = [
    { label: "Records", items: recordsItems },
    { label: "Health", items: healthItems },
    { label: "Tools", items: toolItems },
  ];

  const go = (url: string) => {
    onOpenChange(false);
    navigate(url);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-72 p-0 flex flex-col">
        <SheetHeader className="border-b border-border/60 p-4 text-left">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <Logo size="sm" showText />
          <p className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase mt-1">Personal Health Hub</p>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto p-3 space-y-5">
          {groups.map((g) => (
            <div key={g.label}>
              <p className="px-2 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase mb-1">{g.label}</p>
              <ul className="space-y-0.5">
                {g.items.map((it) => {
                  const active = location.pathname === it.url;
                  return (
                    <li key={it.url}>
                      <button
                        type="button"
                        onClick={() => go(it.url)}
                        className={cn(
                          "w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-smooth text-left",
                          active ? "bg-accent text-accent-foreground" : "text-foreground hover:bg-muted"
                        )}
                      >
                        <it.icon className="h-4 w-4" />
                        {it.title}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
        {user && (
          <div className="border-t border-border/60 p-3 flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-gradient-hero text-primary-foreground font-semibold">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
            <Button variant="ghost" size="icon" aria-label="Log out" onClick={() => { deleteAllData(); onOpenChange(false); navigate("/"); }}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

interface AppShellProps {
  children: React.ReactNode;
  title?: string;
  actions?: React.ReactNode;
}

export function AppShell({ children, title, actions }: AppShellProps) {
  const user = useStore((s) => s.user);
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-soft">
        <div className="hidden md:block">
          <AppSidebar />
        </div>
        <SidebarInset className="bg-transparent">
          <header className="sticky top-0 z-30 flex h-14 md:h-16 items-center gap-2 md:gap-3 border-b border-border/60 bg-background/85 backdrop-blur-md px-3 md:px-6">
            <Button variant="ghost" size="icon" className="md:hidden -ml-1 shrink-0" aria-label="Open menu" onClick={() => setMobileOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <SidebarTrigger className="hidden md:flex" />
            {title && <h1 className="page-title truncate min-w-0 flex-1 md:flex-initial">{title}</h1>}
            <div className="ml-auto flex items-center gap-1.5 md:gap-2 shrink-0">
              {actions}
              {user && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-gradient-hero text-primary-foreground font-semibold">
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{user.name}</span>
                        <span className="text-xs text-muted-foreground font-normal">{user.email}</span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/settings")}>
                      <Settings className="mr-2 h-4 w-4" /> Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/help")}>
                      <HelpCircle className="mr-2 h-4 w-4" /> Help
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        deleteAllData();
                        navigate("/");
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" /> Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6 lg:p-8 pb-24 md:pb-8 animate-fade-in">{children}</main>
          <BottomNav />
        </SidebarInset>
        <MobileNavSheet open={mobileOpen} onOpenChange={setMobileOpen} />
      </div>
    </SidebarProvider>
  );
}
