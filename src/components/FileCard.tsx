import { useState } from "react";
import { format } from "date-fns";
import { FileText, Image as ImageIcon, Trash2, Eye } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { deleteFile, FileRecord } from "@/lib/store";
import { toast } from "sonner";

interface Props {
  file: FileRecord;
}

export function FileCard({ file }: Props) {
  const [viewerOpen, setViewerOpen] = useState(false);
  const isImage = file.mimeType.startsWith("image/");
  const isPdf = file.mimeType === "application/pdf";

  return (
    <>
      <Card className="bg-gradient-card overflow-hidden group hover:shadow-elegant transition-smooth">
        <button
          type="button"
          onClick={() => setViewerOpen(true)}
          className="block w-full aspect-[4/3] bg-accent/40 relative overflow-hidden"
          aria-label={`View ${file.title}`}
        >
          {isImage && file.dataUrl ? (
            <img src={file.dataUrl} alt={file.title} className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground gap-2">
              <FileText className="h-10 w-10" />
              <span className="text-xs uppercase tracking-widest">{isPdf ? "PDF" : file.mimeType.split("/")[1] || "File"}</span>
            </div>
          )}
        </button>
        <div className="p-4">
          <p className="font-medium truncate">{file.title}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{format(new Date(file.date), "PP")}</p>
          {file.notes && <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{file.notes}</p>}
          <div className="mt-3 flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setViewerOpen(true)}>
              <Eye className="h-3.5 w-3.5" /> View
            </Button>
            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive ml-auto" onClick={() => { deleteFile(file._id || ""); toast.success("Deleted"); }}>
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </Card>

      <Dialog open={viewerOpen} onOpenChange={setViewerOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">{file.title}</DialogTitle>
          </DialogHeader>
          <div className="rounded-lg overflow-hidden bg-muted">
            {isImage && file.dataUrl ? (
              <img src={file.dataUrl} alt={file.title} className="w-full h-auto max-h-[70vh] object-contain mx-auto" />
            ) : isPdf && file.dataUrl ? (
              <iframe src={file.dataUrl} className="w-full h-[70vh]" title={file.title} />
            ) : (
              <div className="p-12 text-center text-muted-foreground">
                <FileText className="h-10 w-10 mx-auto" />
                <p className="mt-2">Document preview available in your hub. File saved: {file.title}</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
