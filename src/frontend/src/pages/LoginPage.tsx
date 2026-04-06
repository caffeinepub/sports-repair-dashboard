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
          "linear-gradient(135deg, #0a2540 0%, #0d4f3c 50%, #1565C0 100%)",
      }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full"
          style={{ background: "rgba(21,101,192,0.18)" }}
        />
        <div
          className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full"
          style={{ background: "rgba(27,94,32,0.15)" }}
        />
      </div>

      <Card
        data-ocid="login.card"
        className={`w-full max-w-sm relative shadow-2xl border-0 overflow-hidden ${
          shaking ? "animate-[shake_0.4s_ease-in-out]" : ""
        }`}
        style={{ background: "#ffffff" }}
      >
        {/* Blue top accent bar */}
        <div
          style={{
            height: "6px",
            background: "linear-gradient(90deg, #1565C0, #2e7d32)",
            width: "100%",
          }}
        />

        <CardHeader className="pb-4 pt-8 text-center">
          {/* Logo mark */}
          <div
            className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg"
            style={{ background: "linear-gradient(135deg, #1565C0, #2e7d32)" }}
          >
            <svg
              role="img"
              aria-label="Sports Repair logo"
              viewBox="0 0 40 40"
              width="32"
              height="32"
              fill="none"
            >
              <title>Sports Repair logo</title>
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
          <h1 className="text-xl font-bold" style={{ color: "#0a2540" }}>
            Sports Repair
          </h1>
          <p className="text-sm" style={{ color: "#666666" }}>
            Admin Dashboard
          </p>
        </CardHeader>

        <CardContent className="pb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="password"
                style={{ color: "#0a2540", fontWeight: 600 }}
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
                  className={`pr-10 ${
                    error
                      ? "border-red-600 focus-visible:ring-red-600"
                      : "border-gray-300 focus-visible:ring-blue-500"
                  }`}
                  autoFocus
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: "#888" }}
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
                  style={{ color: "#c62828" }}
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
                background: "linear-gradient(90deg, #1565C0, #2e7d32)",
                border: "none",
              }}
            >
              Login
            </Button>
          </form>

          <p className="text-center text-xs mt-6" style={{ color: "#999" }}>
            Sports Repair{" "}
            <span style={{ color: "#1565C0", fontWeight: 700 }}>Admin</span>{" "}
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
