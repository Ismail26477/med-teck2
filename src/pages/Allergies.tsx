import { useState } from "react";
import { Plus, AlertTriangle, Trash2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addAllergy, deleteAllergy, Severity, useStore } from "@/lib/store";
import { useRequireAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

const severityClass: Record<Severity, string> = {
  mild: "bg-warning/15 text-warning border-warning/30",
  moderate: "bg-warning/30 text-warning border-warning/40",
  severe: "bg-destructive/15 text-destructive border-destructive/30",
};

const Allergies = () => {
  const ok = useRequireAuth();
  const allergies = useStore((s) => s.allergies);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [severity, setSeverity] = useState<Severity>("mild");
  const [notes, setNotes] = useState("");

  if (!ok) return null;

  const submit = () => {
    if (!name.trim()) return toast.error("Name is required");
    addAllergy({ name: name.trim(), severity, notes });
    toast.success("Allergy added");
    setName(""); setSeverity("mild"); setNotes(""); setOpen(false);
  };

  return (
    <AppShell
      title="Allergies"
      actions={<Button variant="hero" size="icon" className="rounded-xl" onClick={() => setOpen(true)} aria-label="Add allergy"><Plus /></Button>}
    >
      {allergies.length === 0 ? (
        <Card className="border-dashed bg-transparent p-10 text-center">
          <div className="mx-auto h-14 w-14 rounded-2xl bg-warning/10 text-warning flex items-center justify-center"><AlertTriangle /></div>
          <h2 className="font-serif text-3xl mt-4">No allergies recorded</h2>
          <p className="mt-2 text-muted-foreground">Add anything that's caused a reaction — drugs, foods, environment.</p>
          <Button variant="hero" size="lg" className="mt-6" onClick={() => setOpen(true)}><Plus className="mr-1" /> Add allergy</Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {allergies.map((a) => (
            <Card key={a.id} className="bg-gradient-card p-4 flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-warning/15 text-warning flex items-center justify-center shrink-0"><AlertTriangle className="h-4 w-4" /></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium">{a.name}</p>
                  <Badge variant="outline" className={severityClass[a.severity]}>{a.severity}</Badge>
                </div>
                {a.notes && <p className="text-sm text-muted-foreground mt-1">{a.notes}</p>}
              </div>
              <Button variant="ghost" size="icon" className="text-destructive" onClick={() => { deleteAllergy(a.id); toast.success("Deleted"); }}><Trash2 className="h-4 w-4" /></Button>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-serif text-3xl">Add allergy</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Penicillin, peanuts…" /></div>
            <div className="space-y-2">
              <Label>Severity</Label>
              <Select value={severity} onValueChange={(v) => setSeverity(v as Severity)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="mild">Mild</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="severe">Severe</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Notes</Label><Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="hero" onClick={submit}>Add allergy</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
};
export default Allergies;
