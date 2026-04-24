import { useRef, useState } from "react";
import { Upload, X, FileText, Pill, ScanLine, FileQuestion } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { addFile, FileCategory } from "@/lib/store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  defaultCategory?: FileCategory;
  lockCategory?: boolean;
}

const MAX_BYTES = 25 * 1024 * 1024;

const categoryOptions: { value: FileCategory; label: string; icon: React.ComponentType<{ className?: string }>; accent: string }[] = [
  { value: "scan", label: "Scans", icon: ScanLine, accent: "text-primary" },
  { value: "report", label: "Lab Reports", icon: FileText, accent: "text-teal" },
  { value: "prescription", label: "Prescriptions", icon: Pill, accent: "text-success" },
  { value: "other", label: "Other Documents", icon: FileQuestion, accent: "text-muted-foreground" },
];

export function UploadModal({ open, onOpenChange, defaultCategory = "scan", lockCategory }: Props) {
  const [category, setCategory] = useState<FileCategory>(defaultCategory);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setTitle("");
    setNotes("");
    setFile(null);
    setDate(new Date().toISOString().slice(0, 10));
    setCategory(defaultCategory);
  };

  const onPick = (f: File | null) => {
    if (!f) return;
    if (f.size > MAX_BYTES) {
      toast.error("File is over 25 MB");
      return;
    }
    setFile(f);
    if (!title) setTitle(f.name.replace(/\.[^/.]+$/, ""));
  };

  const onSubmit = async () => {
    if (!file) {
      toast.error("Choose a file");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      addFile({
        category,
        title: title || file.name,
        date: new Date(date).toISOString(),
        notes,
        mimeType: file.type || "application/octet-stream",
        dataUrl: reader.result as string,
      });
      toast.success("Saved to your hub");
      onOpenChange(false);
      reset();
    };
    reader.onerror = () => toast.error("Could not read file");
    reader.readAsDataURL(file);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) reset(); }}>
      <DialogContent className="max-w-lg w-[calc(100%-1.5rem)] sm:w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 rounded-2xl">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl md:text-3xl">Upload Scans &amp; Documents</DialogTitle>
          <DialogDescription>Scans, prescriptions, lab reports — up to 25 MB each.</DialogDescription>
        </DialogHeader>

        {!lockCategory && (
          <div className="space-y-2">
            <Label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Category</Label>
            <div className="grid grid-cols-2 gap-2">
              {categoryOptions.map((c) => {
                const selected = category === c.value;
                return (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setCategory(c.value)}
                    className={cn(
                      "flex items-center gap-2 rounded-xl border p-3 text-left text-sm font-medium transition-smooth",
                      selected
                        ? "border-primary bg-primary/5 shadow-soft"
                        : "border-border bg-card hover:border-primary/40"
                    )}
                  >
                    <c.icon className={cn("h-4 w-4", c.accent)} />
                    <span>{c.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDrag(false);
            onPick(e.dataTransfer.files?.[0] || null);
          }}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "rounded-xl border-2 border-dashed p-7 text-center cursor-pointer transition-smooth",
            drag ? "border-primary bg-primary/10" : "border-border bg-accent/30 hover:bg-accent/50"
          )}
        >
          <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Upload className="h-5 w-5 text-primary" />
          </div>
          <p className="mt-3 font-medium">{file ? file.name : "Drag & drop or click to browse"}</p>
          <p className="text-xs text-muted-foreground mt-1">JPG, PNG, PDF, DICOM</p>
          <input ref={inputRef} type="file" accept="image/*,application/pdf,.dcm" hidden onChange={(e) => onPick(e.target.files?.[0] || null)} />
        </div>

        {file && (
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
            </div>
          </div>
        )}

        <DialogFooter className="flex-row items-center justify-between sm:justify-between">
          <p className="text-sm text-muted-foreground">{file ? "Ready to save" : "Add files to begin"}</p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button variant="hero" disabled={!file} onClick={onSubmit}>
              <Upload className="mr-1" /> Start upload
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { X };
