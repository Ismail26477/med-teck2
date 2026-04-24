import { Link } from "react-router-dom";
import { Pencil, Droplet, Heart, Ruler, Scale, Activity, Calendar, Phone, Mail, AlertTriangle, MapPin, FileText, Pill, ClipboardList } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { useRequireAuth } from "@/hooks/use-auth";
import { differenceInYears } from "date-fns";

const Summary = () => {
  const ok = useRequireAuth();
  const user = useStore((s) => s.user);
  const allergies = useStore((s) => s.allergies);
  const meds = useStore((s) => s.medications);
  const conditions = useStore((s) => s.conditions);
  const files = useStore((s) => s.files);

  if (!ok || !user) return null;

  const age = user.dob ? differenceInYears(new Date(), new Date(user.dob)) : null;
  const bmi = user.heightCm && user.weightKg
    ? (user.weightKg / Math.pow(user.heightCm / 100, 2)).toFixed(1)
    : null;

  return (
    <AppShell title="Health Summary">
      <div className="space-y-5">
        {/* Profile header */}
        <Card className="header-card">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-accent text-accent-foreground flex items-center justify-center shrink-0">
                <ClipboardList className="h-5 w-5" />
              </div>
              <div>
                <h2 className="page-title">{user.name}</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {age !== null ? `${age} yrs` : "Age —"}{user.gender ? ` · ${user.gender}` : ""}
                </p>
              </div>
            </div>
            <Button variant="outline" asChild>
              <Link to="/settings"><Pencil className="mr-2 h-4 w-4" /> Edit profile</Link>
            </Button>
          </div>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <Stat icon={Droplet} label="Blood" value={user.bloodType || "—"} />
            <Stat icon={Heart} label="Age" value={age !== null ? `${age}` : "—"} />
            <Stat icon={Ruler} label="Height" value={user.heightCm ? `${user.heightCm} cm` : "—"} />
            <Stat icon={Scale} label="Weight" value={user.weightKg ? `${user.weightKg} kg` : "—"} />
            <Stat icon={Activity} label="BMI" value={bmi || "—"} />
            <Stat icon={Calendar} label="Last checkup" value="—" />
          </div>
        </Card>

        {/* Critical info & contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Card className="header-card">
            <h3 className="section-title flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" /> Critical info
            </h3>
            <div className="mt-4 space-y-4">
              <Field label="Allergies">
                {allergies.length === 0 ? "None recorded" : allergies.map((a) => `${a.name} (${a.severity})`).join(", ")}
              </Field>
              <Field label="Conditions">
                {conditions.length === 0 ? "None recorded" : conditions.map((c) => c.name).join(", ")}
              </Field>
              <Field label="Current medications">
                {meds.length === 0 ? "None recorded" : meds.map((m) => `${m.name} ${m.dose}`).join(", ")}
              </Field>
            </div>
          </Card>

          <Card className="header-card">
            <h3 className="section-title flex items-center gap-2">
              <Phone className="h-5 w-5 text-primary" /> Contact
            </h3>
            <div className="mt-4 space-y-4">
              <Field icon={Phone} label="Phone">{user.emergencyContacts?.[0]?.phone || "—"}</Field>
              <Field icon={Mail} label="Email">{user.email}</Field>
              <Field icon={AlertTriangle} label="Emergency contact">
                {user.emergencyContacts?.[0]
                  ? `${user.emergencyContacts[0].name} (${user.emergencyContacts[0].relationship}) · ${user.emergencyContacts[0].phone}`
                  : "—"}
              </Field>
              <Field icon={MapPin} label="Address">—</Field>
            </div>
          </Card>
        </div>

        {/* Counts */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <CountCard icon={FileText} label="RECORDS" value={files.length} accent="bg-accent text-accent-foreground" />
          <CountCard icon={Pill} label="MEDICATIONS" value={meds.length} accent="bg-success/15 text-success" />
          <CountCard icon={Calendar} label="APPOINTMENTS" value={0} accent="bg-teal/15 text-teal" />
        </div>
      </div>
    </AppShell>
  );
};

function Stat({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-background/40 p-3.5">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted-foreground">
        <Icon className="h-3.5 w-3.5 text-primary" /> {label}
      </div>
      <p className="mt-1 font-serif text-2xl">{value}</p>
    </div>
  );
}

function Field({ icon: Icon, label, children }: { icon?: React.ComponentType<{ className?: string }>; label: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-border/50 pb-3 last:border-0 last:pb-0">
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
        {Icon && <Icon className="h-3 w-3" />} {label}
      </p>
      <p className="mt-1 text-sm font-medium text-foreground break-words">{children}</p>
    </div>
  );
}

function CountCard({ icon: Icon, label, value, accent }: { icon: React.ComponentType<{ className?: string }>; label: string; value: number; accent: string }) {
  return (
    <Card className="bg-card border border-border/60 p-4 md:p-5 rounded-2xl flex items-center gap-3">
      <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${accent}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="font-serif text-3xl leading-none">{value}</p>
        <p className="text-[11px] font-semibold tracking-widest text-muted-foreground mt-1">{label}</p>
      </div>
    </Card>
  );
}

export default Summary;
