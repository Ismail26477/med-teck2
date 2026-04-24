import { useState, FormEvent, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login as storeLogin } from "@/lib/store";
import { sessionManager } from "@/lib/session";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (sessionManager.isLoggedIn()) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await storeLogin(email, password);
      sessionManager.setSession({
        userId: user._id,
        email: user.email,
        name: user.name,
      });
      toast.success("Welcome back");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Connection error or invalid credentials. Make sure the server is running.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-soft flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <Link to="/" className="inline-block">
          <Logo />
        </Link>
        <div className="mt-10">
          <h1 className="font-serif text-5xl">Welcome back</h1>
          <p className="mt-2 text-muted-foreground">Open your private health hub.</p>
        </div>

        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} className="h-12 bg-card" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="h-12 bg-card" />
          </div>
          <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
            {loading ? "Opening…" : "Open my health hub"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            New here?{" "}
            <Link to="/signup" className="font-semibold text-primary hover:underline">
              Create your health hub
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
