import { SiteHeader } from "@/components/SiteHeader";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "Where are my records stored?", a: "Locally in your browser hub. Nothing leaves your device unless you choose to share." },
  { q: "What does the QR code share?", a: "Only your read-only emergency summary — name, blood type, allergies, current medications and emergency contacts." },
  { q: "Can I revoke access?", a: "Yes. Disable sharing or rotate the token from the QR page. Old links stop working immediately." },
  { q: "How do time limits work?", a: "Pick 15 minutes, 1 hour, 24 hours, or until you turn it off. Once it expires the QR seals itself automatically." },
  { q: "Can I export my data?", a: "Yes — Settings → Export gives you a JSON file with everything in your hub." },
];

const Help = () => (
  <div className="min-h-screen bg-gradient-soft">
    <SiteHeader />
    <main className="container max-w-3xl py-16">
      <h1 className="font-serif text-5xl md:text-6xl">Help & FAQ</h1>
      <p className="mt-4 text-muted-foreground">Quick answers to the most common questions.</p>

      <Accordion type="single" collapsible className="mt-10">
        {faqs.map((f, i) => (
          <AccordionItem key={i} value={`item-${i}`} className="border-border">
            <AccordionTrigger className="text-left font-medium text-lg">{f.q}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-base">{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </main>
  </div>
);
export default Help;
