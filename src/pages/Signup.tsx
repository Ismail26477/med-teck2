import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { authAPI } from "@/lib/api";
import { sessionManager } from "@/lib/session";
import { toast } from "sonner";

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    bloodType: "",
    heightCm: "",
    weightKg: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const response = await authAPI.signup(
        form.name,
        form.email,
        form.password,
        new Date().toISOString()
      );
      if (response.success && response.data) {
        sessionManager.setSession({
          userId: response.data._id,
          email: response.data.email,
          name: response.data.name,
        });
        toast.success("Health hub created");
        navigate("/dashboard");
      } else {
        toast.error(response.error || "Signup failed");
        setLoading(false);
      }
    } catch (error) {
      toast.error("Connection error. Make sure the server is running.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-soft px-4 py-10">
      <div className="mx-auto w-full max-w-md">
        <Link to="/" className="inline-block">
          <Logo />
        </Link>
        <div className="mt-8">
          <h1 className="font-serif text-5xl leading-tight">Create your private health hub</h1>
          <p className="mt-3 text-muted-foreground">Just you. Your records. Your QR. No hospitals, no admins.</p>
        </div>

        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" required placeholder="Aarav Mehta" className="h-12 bg-card" value={form.name} onChange={(e) => set("name")(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input id="age" type="number" min={0} max={120} placeholder="32" className="h-12 bg-card" value={form.age} onChange={(e) => set("age")(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Gender</Label>
            <Select value={form.gender} onValueChange={set("gender")}>
              <SelectTrigger className="h-12 bg-card"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="nonbinary">Non-binary</SelectItem>
                <SelectItem value="other">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Blood group</Label>
            <Select value={form.bloodType} onValueChange={set("bloodType")}>
              <SelectTrigger className="h-12 bg-card"><SelectValue placeholder="—" /></SelectTrigger>
              <SelectContent>
                {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input id="height" type="number" placeholder="170" className="h-12 bg-card" value={form.heightCm} onChange={(e) => set("heightCm")(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input id="weight" type="number" placeholder="65" className="h-12 bg-card" value={form.weightKg} onChange={(e) => set("weightKg")(e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required placeholder="you@example.com" className="h-12 bg-card" value={form.email} onChange={(e) => set("email")(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required minLength={6} className="h-12 bg-card" value={form.password} onChange={(e) => set("password")(e.target.value)} />
          </div>

          <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
            {loading ? "Creating…" : "Create my health hub"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already have a health hub?{" "}
            <Link to="/login" className="font-semibold text-primary hover:underline">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
