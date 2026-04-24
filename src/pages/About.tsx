import { SiteHeader } from "@/components/SiteHeader";

const About = () => (
  <div className="min-h-screen bg-gradient-soft">
    <SiteHeader />
    <main className="container max-w-3xl py-16">
      <h1 className="font-serif text-5xl md:text-6xl">About MediSync</h1>
      <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
        MediSync is a personal health hub built around a simple idea: your medical records belong to you.
        We give you a private place to store scans, prescriptions, allergies and conditions — and a one-tap QR
        you can flip on for an ER visit and back off when it's over.
      </p>
      <h2 className="mt-12 font-serif text-3xl">How it works</h2>
      <div className="mt-4 space-y-4 text-muted-foreground">
        <p>Your records are stored only in your browser hub. There is no server account, no admin, no third party.</p>
        <p>Sharing is sealed by default. When you enable it, MediSync mints a fresh access token used by your QR. Disable or rotate it any time.</p>
        <p>For emergencies, the public view shows only the essentials a clinician needs — blood type, allergies, current meds and contacts.</p>
      </div>
    </main>
  </div>
);
export default About;
