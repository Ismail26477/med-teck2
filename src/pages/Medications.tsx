import { useState } from "react";
import { Plus, HeartPulse, Trash2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { addMedication, deleteMedication, useStore } from "@/lib/store";
import { useRequireAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

const Medications = () => {
  const ok = useRequireAuth();
  const meds = useStore((s) => s.medications);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", dose: "", frequency: "", prescriber: "" });

  if (!ok) return null;

  const submit = () => {
    if (!form.name.trim()) return toast.error("Name required");
    addMedication({ name: form.name.trim(), dose: form.dose, frequency: form.frequency, prescriber: form.prescriber });
    toast.success("Medication added");
    setForm({ name: "", dose: "", frequency: "", prescriber: "" });
    setOpen(false);
  };

  return (
    <AppShell title="Medications" actions={<Button variant="hero" size="icon" className="rounded-xl" onClick={() => setOpen(true)}><Plus /></Button>}>
      {meds.length === 0 ? (
        <Card className="border-dashed bg-transparent p-10 text-center">
          <div className="mx-auto h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center"><HeartPulse /></div>
          <h2 className="font-serif text-3xl mt-4">No medications yet</h2>
          <p className="mt-2 text-muted-foreground">Track everything you take so it's ready when it matters.</p>
          <Button variant="hero" size="lg" className="mt-6" onClick={() => setOpen(true)}><Plus className="mr-1" /> Add medication</Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {meds.map((m) => (
            <Card key={m.id} className="bg-gradient-card p-4 flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0"><HeartPulse className="h-4 w-4" /></div>
              <div className="flex-1 min-w-0">
                <p className="font-medium">{m.name} <span className="text-muted-foreground font-normal">— {m.dose}</span></p>
                <p className="text-sm text-muted-foreground">{m.frequency}{m.prescriber ? ` · ${m.prescriber}` : ""}</p>
              </div>
              <Button variant="ghost" size="icon" className="text-destructive" onClick={() => { deleteMedication(m.id); toast.success("Deleted"); }}><Trash2 className="h-4 w-4" /></Button>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-serif text-3xl">Add medication</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Atorvastatin" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Dose</Label><Input value={form.dose} onChange={(e) => setForm({ ...form, dose: e.target.value })} placeholder="20 mg" /></div>
              <div className="space-y-2"><Label>Frequency</Label><Input value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value })} placeholder="Daily" /></div>
            </div>
            <div className="space-y-2"><Label>Prescriber</Label><Input value={form.prescriber} onChange={(e) => setForm({ ...form, prescriber: e.target.value })} placeholder="Dr. Mehta" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="hero" onClick={submit}>Add medication</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
};
export default Medications;
