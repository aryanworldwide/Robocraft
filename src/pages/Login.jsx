import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { backend } from "@/api/client";
import { useAuth } from "@/lib/AuthContext";
import { appUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, Mail, Lock, Loader2, UserRound } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";

export default function Login() {
  const navigate = useNavigate();
  const { continueAsGuest } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await backend.auth.loginViaEmailPassword(email, password);
      window.location.href = appUrl("/");
    } catch (err) {
      if (err?.status === 401) setError("Incorrect email or password.");
      else if (err?.status === 404) setError("No account found with this email.");
      else if (err?.status === 403) setError("This account has been disabled.");
      else if (err?.message?.includes("network") || err?.message?.includes("fetch")) setError("Network error. Check your connection.");
      else setError(err?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };


  const handleGuest = () => {
    continueAsGuest();
    navigate("/class-selection");
  };

  return (
    <AuthLayout
      icon={LogIn}
      title="Welcome back"
      subtitle="Log in to your account"
      footer={
        <>
          Don't have an account?{" "}
          <Link to="/register" className="text-cyan-400 font-medium hover:underline">
            Create one
          </Link>
        </>
      }
    >

      <Button
        variant="outline"
        className="w-full h-12 text-sm font-medium mb-6 glass hover:bg-cyan-500/10 border-cyan-500/20 text-foreground hover:text-cyan-400"
        onClick={handleGuest}
      >
        <UserRound className="w-5 h-5 mr-2 text-cyan-400" />
        Continue as Guest
      </Button>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-cyan-500/10" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-transparent px-3 text-muted-foreground">or</span>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-muted-foreground">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              autoFocus
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 h-12 glass border-cyan-500/15 focus:border-cyan-500/40"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-muted-foreground">Password</Label>
            <Link to="/forgot-password" className="text-xs text-cyan-400 hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 h-12 glass border-cyan-500/15 focus:border-cyan-500/40"
              required
            />
          </div>
        </div>
        <Button type="submit" className="w-full h-12 font-medium bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white border-0" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Logging in...
            </>
          ) : (
            "Log in"
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}