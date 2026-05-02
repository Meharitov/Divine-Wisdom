import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Loader2, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LoginPageProps {
  onSuccess: () => void;
}

export default function LoginPage({ onSuccess }: LoginPageProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        onSuccess();
      } else {
        const data = await res.json();
        toast({
          title: "Access Denied",
          description: data.message || "Invalid credentials.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        {/* Icon & Title */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center mb-5"
          >
            <div className="p-4 rounded-full bg-primary/10 text-primary">
              <BookOpen className="w-7 h-7" />
            </div>
          </motion.div>
          <h1 className="text-4xl font-display text-foreground mb-2">
            Divine Wisdom
          </h1>
          <p className="text-muted-foreground font-body text-base">
            Enter your credentials to access this sanctuary.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-card border border-border/60 rounded-2xl p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div className="space-y-1.5">
              <label className="text-sm font-display text-foreground/70 tracking-wide uppercase block">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                disabled={isLoading}
                data-testid="input-username"
                className="w-full px-4 py-3 rounded-lg bg-background border border-input text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all font-body"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-display text-foreground/70 tracking-wide uppercase block">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  disabled={isLoading}
                  data-testid="input-password"
                  className="w-full px-4 py-3 pr-12 rounded-lg bg-background border border-input text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all font-body"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-primary transition-colors p-1"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading || !username || !password}
              data-testid="button-login"
              className="w-full flex items-center justify-center gap-2 px-6 py-3 mt-2 rounded-lg bg-primary text-primary-foreground font-display tracking-wide text-base transition-all duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Enter"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground/50 mt-6 font-body">
          Access is restricted to authorized users only.
        </p>
      </motion.div>
    </div>
  );
}
