import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
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
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background:
          "linear-gradient(135deg, #0d2b6e 0%, #0a4f2e 60%, #0d6e4f 100%)",
      }}
    >
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl"
          style={{ background: "rgba(29,78,216,0.25)" }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full blur-3xl"
          style={{ background: "rgba(22,163,74,0.22)" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-3xl"
          style={{ background: "rgba(56,189,248,0.12)" }}
        />
      </div>

      <Card
        data-ocid="login.card"
        className={`w-full max-w-sm relative shadow-2xl border-0 overflow-hidden ${
          shaking ? "animate-[shake_0.4s_ease-in-out]" : ""
        }`}
        style={{
          background: "#0f1e45",
          border: "1px solid rgba(56,189,248,0.15)",
        }}
      >
        {/* Top gradient bar */}
        <div
          style={{
            height: "5px",
            background:
              "linear-gradient(90deg, #1d4ed8 0%, #16a34a 50%, #0ea5e9 100%)",
            width: "100%",
          }}
        />

        <CardHeader className="pb-4 pt-8 text-center">
          {/* Logo */}
          <div
            className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg"
            style={{
              background: "linear-gradient(135deg, #1d4ed8 0%, #16a34a 100%)",
            }}
          >
            <svg
              role="img"
              aria-label="CF Sports Repair logo"
              viewBox="0 0 40 40"
              width="32"
              height="32"
              fill="none"
            >
              <title>CF Sports Repair logo</title>
              <circle cx="20" cy="20" r="18" stroke="white" strokeWidth="2.5" />
              <line
                x1="10"
                y1="20"
                x2="30"
                y2="20"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <line
                x1="20"
                y1="10"
                x2="20"
                y2="30"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <line
                x1="13"
                y1="13"
                x2="27"
                y2="27"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <line
                x1="27"
                y1="13"
                x2="13"
                y2="27"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <h1 className="text-xl font-bold" style={{ color: "#e0f2fe" }}>
            CF Sports Repair
          </h1>
          <p className="text-sm" style={{ color: "#7dd3fc" }}>
            Admin Dashboard
          </p>
        </CardHeader>

        <CardContent className="pb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="password"
                style={{ color: "#bae6fd", fontWeight: 600 }}
              >
                Password
              </Label>
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
                  className={`pr-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 ${
                    error
                      ? "border-red-500 focus-visible:ring-red-500"
                      : "focus-visible:ring-blue-400"
                  }`}
                  autoFocus
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: "#7dd3fc" }}
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
                  className="text-xs mt-1"
                  style={{ color: "#fca5a5" }}
                >
                  {error}
                </p>
              )}
            </div>

            <Button
              type="submit"
              data-ocid="login.submit_button"
              className="w-full font-bold text-white shadow-md hover:opacity-90 transition-opacity"
              style={{
                background: "linear-gradient(90deg, #1d4ed8 0%, #16a34a 100%)",
                border: "none",
              }}
            >
              Login
            </Button>
          </form>

          <p className="text-center text-xs mt-6" style={{ color: "#475569" }}>
            CF Sports Repair{" "}
            <span style={{ color: "#38bdf8", fontWeight: 700 }}>Admin</span>{" "}
            Portal
          </p>
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
