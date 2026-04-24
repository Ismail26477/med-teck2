import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";

const NotFound = () => (
  <div className="min-h-screen bg-gradient-soft flex flex-col items-center justify-center px-4 text-center">
    <Logo size="lg" />
    <h1 className="mt-10 font-serif text-7xl">404</h1>
    <p className="mt-2 text-muted-foreground text-lg">This page didn't make it to your hub.</p>
    <Button variant="hero" size="lg" asChild className="mt-8">
      <Link to="/">Back home</Link>
    </Button>
  </div>
);

export default NotFound;
