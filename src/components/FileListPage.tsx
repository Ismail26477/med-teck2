import { useMemo, useState } from "react";
import { Plus, ScanLine, Search, Upload, Pill, FileText, FileQuestion } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { UploadModal } from "@/components/UploadModal";
import { FileCard } from "@/components/FileCard";
import { useStore, FileCategory } from "@/lib/store";
import { useRequireAuth } from "@/hooks/use-auth";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Props {
  category: FileCategory;
  title: string;
  emptyTitle: string;
  emptyHint: string;
  uploadLabel: string;
  pageDescription?: string;
}

const iconMap: Record<FileCategory, React.ComponentType<{ className?: string }>> = {
  scan: ScanLine,
  prescription: Pill,
  report: FileText,
  other: FileQuestion,
};

const accentMap: Record<FileCategory, string> = {
  scan: "bg-accent text-accent-foreground",
  prescription: "bg-success/15 text-success",
  report: "bg-teal/15 text-teal",
  other: "bg-muted text-muted-foreground",
};

type Sort = "newest" | "oldest" | "name" | "largest";

export function FileListPage({ category, title, emptyTitle, emptyHint, uploadLabel, pageDescription }: Props) {
  const ok = useRequireAuth();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<Sort>("newest");
  const files = useStore((s) => s.files);

  const list = useMemo(() => {
    const filtered = files.filter((f) => f.category === category && f.title.toLowerCase().includes(q.toLowerCase()));
    const sorted = [...filtered];
    if (sort === "newest") sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    else if (sort === "oldest") sorted.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    else if (sort === "name") sorted.sort((a, b) => a.title.localeCompare(b.title));
    else if (sort === "largest") sorted.sort((a, b) => (b.dataUrl?.length || 0) - (a.dataUrl?.length || 0));
    return sorted;
  }, [files, category, q, sort]);

  if (!ok) return null;

  const Icon = iconMap[category];
  const accent = accentMap[category];

  return (
    <AppShell
      title={title}
      actions={
        <>
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={`Search ${title.toLowerCase()}…`}
              className="pl-9 h-10 w-72 bg-card rounded-full"
            />
          </div>
          <Button variant="hero" size="sm" className="rounded-xl md:h-10" onClick={() => setOpen(true)} aria-label={uploadLabel}>
            <Plus className="mr-1 h-4 w-4" /> <span className="hidden sm:inline">Upload</span>
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        {/* Mobile search */}
        <div className="relative md:hidden">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Search ${title.toLowerCase()}…`} className="pl-9 h-11 bg-card" />
        </div>

        {/* Header card */}
        <Card className="header-card flex items-center gap-4">
          <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${accent}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="section-title">{title}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {list.length} records stored privately on your device.
            </p>
          </div>
          <Select value={sort} onValueChange={(v) => setSort(v as Sort)}>
            <SelectTrigger className="w-[150px] hidden sm:flex">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="oldest">Oldest first</SelectItem>
              <SelectItem value="name">Name (A–Z)</SelectItem>
              <SelectItem value="largest">Largest first</SelectItem>
            </SelectContent>
          </Select>
        </Card>

        {list.length === 0 ? (
          <Card className="bg-card border border-border/60 p-10 md:p-16 text-center rounded-2xl animate-fade-in">
            <div className={`mx-auto h-14 w-14 rounded-2xl flex items-center justify-center ${accent}`}>
              <Icon className="h-6 w-6" />
            </div>
            <h2 className="page-title mt-4">{emptyTitle}</h2>
            <p className="mt-3 text-muted-foreground max-w-md mx-auto text-sm md:text-base">{pageDescription || emptyHint}</p>
            <Button variant="hero" size="lg" className="mt-6" onClick={() => setOpen(true)}>
              <Upload className="mr-1" /> {uploadLabel}
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {list.map((f) => <FileCard key={f._id} file={f} />)}
          </div>
        )}
      </div>

      <UploadModal open={open} onOpenChange={setOpen} defaultCategory={category} lockCategory />
    </AppShell>
  );
}
