import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Wrench } from "lucide-react";
import { useState } from "react";

interface LoginPageProps {
  onLogin: () => void;
}

const PASSWORD = "sports@2024";

export function LoginPage({ onLogin }: LoginPageProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [shaking, setShaking] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password === PASSWORD) {
      onLogin();
    } else {
      setError("Incorrect password. Please try again.");
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
    }
  }

  return (
    <div className="min-h-screen sidebar-gradient flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-white/5" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-white/5" />
      </div>

      <Card
        data-ocid="login.card"
        className={`w-full max-w-sm relative shadow-2xl border-0 ${
          shaking ? "animate-[shake_0.4s_ease-in-out]" : ""
        }`}
      >
        <CardHeader className="pb-4 pt-8 text-center">
          <div className="mx-auto w-16 h-16 rounded-2xl sidebar-gradient flex items-center justify-center mb-4 shadow-lg">
            <Wrench className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-xl font-bold text-foreground">Sports Repair</h1>
          <p className="text-sm text-muted-foreground">Admin Dashboard</p>
        </CardHeader>

        <CardContent className="pb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  data-ocid="login.input"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter your password"
                  className={`pr-10 ${error ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  autoFocus
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setShowPassword((v) => !v)}
                  data-ocid="login.toggle"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {error && (
                <p
                  data-ocid="login.error_state"
                  className="text-xs text-destructive mt-1"
                >
                  {error}
                </p>
              )}
            </div>

            <Button
              type="submit"
              data-ocid="login.submit_button"
              className="w-full"
            >
              Login
            </Button>
          </form>
        </CardContent>
      </Card>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
      `}</style>
    </div>
  );
}
