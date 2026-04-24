import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ShieldAlert, AlertTriangle, HeartPulse, Phone, User, Loader } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const severityColor: Record<string, string> = {
  mild: "bg-warning/15 text-warning border-warning/30",
  moderate: "bg-warning/25 text-warning border-warning/40",
  severe: "bg-destructive/15 text-destructive border-destructive/30",
};

interface PatientData {
  user: {
    _id: string;
    name: string;
    email: string;
    bloodType?: string;
    dateOfBirth?: string;
    emergencyContact?: string;
    emergencyPhone?: string;
  };
  allergies: Array<{
    _id: string;
    name: string;
    severity: string;
    notes?: string;
  }>;
  medications: Array<{
    _id: string;
    name: string;
    dose: string;
    frequency: string;
    prescriber?: string;
    notes?: string;
  }>;
  conditions: Array<{
    _id: string;
    name: string;
    notes?: string;
  }>;
}

const DoctorView = () => {
  const { token = "" } = useParams();
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const validateAndFetchData = async () => {
      try {
        console.log('[v0] Validating share token:', token);
        const response = await fetch(`/api/share/validate/${token}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.error || 'Invalid or expired token');
          toast.error(errorData.error || 'Invalid or expired token');
          return;
        }

        const data = await response.json();
        if (data.success) {
          console.log('[v0] Token validated successfully');
          setPatientData(data.data);
          toast.success('Patient data loaded successfully');
        } else {
          setError(data.error || 'Failed to fetch patient data');
          toast.error(data.error || 'Failed to fetch patient data');
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to load patient data';
        console.error('[v0] Error validating token:', err);
        setError(errorMsg);
        toast.error(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      validateAndFetchData();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-soft flex items-center justify-center px-4">
        <Card className="max-w-md w-full p-8 text-center bg-gradient-card">
          <div className="mx-auto h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-primary animate-spin">
            <Loader className="h-6 w-6" />
          </div>
          <h1 className="mt-4 font-serif text-3xl">Loading patient data</h1>
          <p className="mt-2 text-muted-foreground text-sm">
            Validating access and fetching medical information...
          </p>
        </Card>
      </div>
    );
  }

  if (error || !patientData) {
    return (
      <div className="min-h-screen bg-gradient-soft flex items-center justify-center px-4">
        <Card className="max-w-md w-full p-8 text-center bg-gradient-card">
          <div className="mx-auto h-14 w-14 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
            <ShieldAlert />
          </div>
          <h1 className="mt-4 font-serif text-3xl">Access denied</h1>
          <p className="mt-2 text-muted-foreground">
            {error || 'This QR code is invalid, sealed, expired or no longer accessible. Please ask the patient to generate a new QR code.'}
          </p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 inline-block px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Go back
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-soft">
      {/* Banner */}
      <div className="bg-blue-600 text-white">
        <div className="container py-3 flex items-center gap-3 text-sm font-semibold tracking-wide uppercase">
          <User className="h-4 w-4" />
          Patient Medical Information
        </div>
      </div>

      <main className="container max-w-3xl py-8 space-y-6">
        <div className="flex items-center justify-between">
          <Logo />
          <Badge variant="outline" className="bg-success/10 text-success border-success/30">
            <span className="h-2 w-2 rounded-full bg-success mr-1.5 animate-pulse" />
            Data access granted
          </Badge>
        </div>

        {/* Patient Info */}
        <Card className="p-6 bg-gradient-card">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-full bg-gradient-hero flex items-center justify-center text-white">
              <User className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Patient</p>
              <h1 className="font-serif text-3xl">{patientData.user.name}</h1>
              <p className="text-sm text-muted-foreground mt-1">{patientData.user.email}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-sm">
                {patientData.user.bloodType && (
                  <Badge variant="secondary">Blood {patientData.user.bloodType}</Badge>
                )}
                {patientData.user.dateOfBirth && (
                  <Badge variant="secondary">DOB: {patientData.user.dateOfBirth}</Badge>
                )}
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
          {patientData.allergies.length === 0 ? (
            <p className="text-muted-foreground text-sm">No known allergies recorded.</p>
          ) : (
            <ul className="space-y-2">
              {patientData.allergies.map((a) => (
                <li key={a._id} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div>
                    <p className="font-medium">{a.name}</p>
                    {a.notes && <p className="text-sm text-muted-foreground">{a.notes}</p>}
                  </div>
                  <Badge className={severityColor[a.severity]} variant="outline">
                    {a.severity}
                  </Badge>
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
          {patientData.medications.length === 0 ? (
            <p className="text-muted-foreground text-sm">No medications recorded.</p>
          ) : (
            <ul className="space-y-2">
              {patientData.medications.map((m) => (
                <li key={m._id} className="rounded-lg border border-border p-3">
                  <p className="font-medium">
                    {m.name} <span className="text-muted-foreground font-normal">— {m.dose}</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {m.frequency}
                    {m.prescriber ? ` · ${m.prescriber}` : ""}
                  </p>
                  {m.notes && <p className="text-sm text-muted-foreground mt-1">{m.notes}</p>}
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Conditions */}
        {patientData.conditions.length > 0 && (
          <Card className="p-6 bg-gradient-card">
            <h2 className="font-serif text-2xl mb-3">Medical Conditions</h2>
            <ul className="space-y-2">
              {patientData.conditions.map((c) => (
                <li key={c._id} className="rounded-lg border border-border p-3">
                  <p className="font-medium">{c.name}</p>
                  {c.notes && <p className="text-sm text-muted-foreground mt-1">{c.notes}</p>}
                </li>
              ))}
            </ul>
          </Card>
        )}

        {/* Emergency Contacts */}
        {(patientData.user.emergencyContact || patientData.user.emergencyPhone) && (
          <Card className="p-6 bg-gradient-card">
            <div className="flex items-center gap-2 mb-4">
              <Phone className="h-4 w-4 text-primary" />
              <h2 className="font-serif text-2xl">Emergency contact</h2>
            </div>
            <div className="rounded-lg border border-border p-3">
              {patientData.user.emergencyContact && (
                <p className="font-medium">{patientData.user.emergencyContact}</p>
              )}
              {patientData.user.emergencyPhone && (
                <a
                  href={`tel:${patientData.user.emergencyPhone}`}
                  className="text-primary font-semibold hover:underline"
                >
                  {patientData.user.emergencyPhone}
                </a>
              )}
            </div>
          </Card>
        )}

        <p className="text-center text-xs text-muted-foreground pt-4">
          Read-only medical information shared via MediSync QR code. This data is time-limited and can be revoked at any time by the patient.
        </p>
      </main>
    </div>
  );
};

export default DoctorView;
