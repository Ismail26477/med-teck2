import { useParams } from "react-router-dom";
import { ShieldAlert, AlertTriangle, HeartPulse, Phone, User } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { isShareValid, useStore } from "@/lib/store";

const severityColor: Record<string, string> = {
  mild: "bg-warning/15 text-warning border-warning/30",
  moderate: "bg-warning/25 text-warning border-warning/40",
  severe: "bg-destructive/15 text-destructive border-destructive/30",
};

const Emergency = () => {
  const { token = "" } = useParams();
  const user = useStore((s) => s.user);
  const allergies = useStore((s) => s.allergies);
  const medications = useStore((s) => s.medications);
  const conditions = useStore((s) => s.conditions);

  const valid = isShareValid(token);

  if (!valid) {
    return (
      <div className="min-h-screen bg-gradient-soft flex items-center justify-center px-4">
        <Card className="max-w-md w-full p-8 text-center bg-gradient-card">
          <div className="mx-auto h-14 w-14 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
            <ShieldAlert />
          </div>
          <h1 className="mt-4 font-serif text-3xl">Access denied</h1>
          <p className="mt-2 text-muted-foreground">
            This emergency link is sealed, expired or invalid. Ask the patient to enable sharing or rotate their QR.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-soft">
      {/* Banner */}
      <div className="bg-destructive text-destructive-foreground">
        <div className="container py-3 flex items-center gap-3 text-sm font-semibold tracking-wide uppercase">
          <ShieldAlert className="h-4 w-4" />
          Emergency Medical Info
        </div>
      </div>

      <main className="container max-w-3xl py-8 space-y-6">
        <div className="flex items-center justify-between">
          <Logo />
          <Badge variant="outline" className="bg-success/10 text-success border-success/30">
            <span className="h-2 w-2 rounded-full bg-success mr-1.5" />
            Live access
          </Badge>
        </div>

        {/* Patient */}
        <Card className="p-6 bg-gradient-card">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-full bg-gradient-hero flex items-center justify-center text-primary-foreground">
              <User />
            </div>
            <div className="flex-1">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Patient</p>
              <h1 className="font-serif text-3xl">{user?.name || "Anonymous"}</h1>
              <div className="mt-3 flex flex-wrap gap-2 text-sm">
                {user?.bloodType && <Badge variant="secondary">Blood {user.bloodType}</Badge>}
                {user?.heightCm && <Badge variant="secondary">{user.heightCm} cm</Badge>}
                {user?.weightKg && <Badge variant="secondary">{user.weightKg} kg</Badge>}
              </div>
            </div>
          </div>
        </Card>

        {/* Allergies */}
        <Card className="p-6 bg-gradient-card">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <h2 className="font-serif text-2xl">Allergies</h2>
          </div>
          {allergies.length === 0 ? (
            <p className="text-muted-foreground text-sm">No known allergies recorded.</p>
          ) : (
            <ul className="space-y-2">
              {allergies.map((a) => (
                <li key={a.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div>
                    <p className="font-medium">{a.name}</p>
                    {a.notes && <p className="text-sm text-muted-foreground">{a.notes}</p>}
                  </div>
                  <Badge className={severityColor[a.severity]} variant="outline">{a.severity}</Badge>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Medications */}
        <Card className="p-6 bg-gradient-card">
          <div className="flex items-center gap-2 mb-4">
            <HeartPulse className="h-4 w-4 text-primary" />
            <h2 className="font-serif text-2xl">Current medications</h2>
          </div>
          {medications.length === 0 ? (
            <p className="text-muted-foreground text-sm">No medications recorded.</p>
          ) : (
            <ul className="space-y-2">
              {medications.map((m) => (
                <li key={m.id} className="rounded-lg border border-border p-3">
                  <p className="font-medium">{m.name} <span className="text-muted-foreground font-normal">— {m.dose}</span></p>
                  <p className="text-sm text-muted-foreground">{m.frequency}{m.prescriber ? ` · ${m.prescriber}` : ""}</p>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Conditions */}
        {conditions.length > 0 && (
          <Card className="p-6 bg-gradient-card">
            <h2 className="font-serif text-2xl mb-3">Conditions</h2>
            <div className="flex flex-wrap gap-2">
              {conditions.map((c) => <Badge key={c.id} variant="secondary">{c.name}</Badge>)}
            </div>
          </Card>
        )}

        {/* Contacts */}
        <Card className="p-6 bg-gradient-card">
          <div className="flex items-center gap-2 mb-4">
            <Phone className="h-4 w-4 text-primary" />
            <h2 className="font-serif text-2xl">Emergency contacts</h2>
          </div>
          {!user?.emergencyContacts.length ? (
            <p className="text-muted-foreground text-sm">No emergency contacts on file.</p>
          ) : (
            <ul className="space-y-2">
              {user.emergencyContacts.map((c) => (
                <li key={c.id} className="rounded-lg border border-border p-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium">{c.name}</p>
                    <p className="text-sm text-muted-foreground">{c.relationship}</p>
                  </div>
                  <a href={`tel:${c.phone}`} className="text-primary font-semibold hover:underline">{c.phone}</a>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <p className="text-center text-xs text-muted-foreground pt-4">
          Read-only emergency view shared via MediSync. Disable or rotate at any time.
        </p>
      </main>
    </div>
  );
};

export default Emergency;
