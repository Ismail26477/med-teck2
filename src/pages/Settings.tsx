import { useRef, useState } from "react";
import { Download, Trash2, Upload, UserCog, Plus, Phone, X } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { deleteAllData, exportData, importData, updateProfile, useStore } from "@/lib/store";
import { useRequireAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Settings = () => {
  const ok = useRequireAuth();
  const navigate = useNavigate();
  const user = useStore((s) => s.user);
  const importRef = useRef<HTMLInputElement>(null);
  const [contactForm, setContactForm] = useState({ name: "", relationship: "", phone: "" });

  if (!ok || !user) return null;

  const onProfile = (patch: Parameters<typeof updateProfile>[0]) => {
    updateProfile(patch);
    toast.success("Saved");
  };

  const onExport = () => {
    const blob = new Blob([exportData()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `medisync-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const onImport = (file: File) => {
    const r = new FileReader();
    r.onload = () => {
      try {
        importData(String(r.result));
        toast.success("Data imported");
      } catch {
        toast.error("Could not parse file");
      }
    };
    r.readAsText(file);
  };

  const addContact = () => {
    if (!contactForm.name || !contactForm.phone) return toast.error("Name and phone required");
    onProfile({
      emergencyContacts: [
        ...user.emergencyContacts,
        { id: crypto.randomUUID(), ...contactForm },
      ],
    });
    setContactForm({ name: "", relationship: "", phone: "" });
  };

  const removeContact = (id: string) => onProfile({ emergencyContacts: user.emergencyContacts.filter((c) => c.id !== id) });

  return (
    <AppShell title="Settings">
      <div className="space-y-5 max-w-2xl">
        <Card className="bg-gradient-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <UserCog className="h-4 w-4 text-primary" />
            <h2 className="font-serif text-2xl">Profile</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Name"><Input defaultValue={user.name} onBlur={(e) => onProfile({ name: e.target.value })} /></Field>
            <Field label="Email"><Input defaultValue={user.email} onBlur={(e) => onProfile({ email: e.target.value })} /></Field>
            <Field label="Blood type">
              <Select defaultValue={user.bloodType} onValueChange={(v) => onProfile({ bloodType: v })}>
                <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
                <SelectContent>{["A+","A-","B+","B-","AB+","AB-","O+","O-"].map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label="Date of birth"><Input type="date" defaultValue={user.dob?.slice(0, 10)} onBlur={(e) => onProfile({ dob: e.target.value ? new Date(e.target.value).toISOString() : undefined })} /></Field>
            <Field label="Height (cm)"><Input type="number" defaultValue={user.heightCm} onBlur={(e) => onProfile({ heightCm: Number(e.target.value) || undefined })} /></Field>
            <Field label="Weight (kg)"><Input type="number" defaultValue={user.weightKg} onBlur={(e) => onProfile({ weightKg: Number(e.target.value) || undefined })} /></Field>
          </div>
        </Card>

        <Card className="bg-gradient-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Phone className="h-4 w-4 text-primary" />
            <h2 className="font-serif text-2xl">Emergency contacts</h2>
          </div>
          {user.emergencyContacts.length > 0 && (
            <ul className="space-y-2 mb-4">
              {user.emergencyContacts.map((c) => (
                <li key={c.id} className="rounded-lg border border-border p-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.relationship} · {c.phone}</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeContact(c.id)} className="text-destructive"><X className="h-4 w-4" /></Button>
                </li>
              ))}
            </ul>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <Input placeholder="Name" value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })} />
            <Input placeholder="Relationship" value={contactForm.relationship} onChange={(e) => setContactForm({ ...contactForm, relationship: e.target.value })} />
            <Input placeholder="Phone" value={contactForm.phone} onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })} />
          </div>
          <Button variant="soft" className="mt-3" onClick={addContact}><Plus className="mr-1 h-4 w-4" /> Add contact</Button>
        </Card>

        <Card className="bg-gradient-card p-6">
          <h2 className="font-serif text-2xl">Your data</h2>
          <p className="text-sm text-muted-foreground mt-1">Export everything as JSON, or import a backup.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="outline" onClick={onExport}><Download className="mr-1 h-4 w-4" /> Export JSON</Button>
            <Button variant="outline" onClick={() => importRef.current?.click()}><Upload className="mr-1 h-4 w-4" /> Import JSON</Button>
            <input ref={importRef} type="file" accept="application/json" hidden onChange={(e) => e.target.files?.[0] && onImport(e.target.files[0])} />
          </div>
        </Card>

        <Card className="bg-gradient-card p-6 border-destructive/20">
          <h2 className="font-serif text-2xl text-destructive">Danger zone</h2>
          <p className="text-sm text-muted-foreground mt-1">Permanently erase your hub from this device.</p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="mt-4"><Trash2 className="mr-1 h-4 w-4" /> Delete all data</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete everything?</AlertDialogTitle>
                <AlertDialogDescription>This wipes your profile, records and sharing state. This cannot be undone.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => { deleteAllData(); navigate("/"); toast.success("All data deleted"); }} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </Card>
      </div>
    </AppShell>
  );
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

export default Settings;
