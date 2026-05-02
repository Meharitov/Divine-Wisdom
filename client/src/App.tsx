import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import LoginPage from "@/pages/login";
import { useAuth, useLogout } from "@/hooks/use-auth";
import { Loader2, LogOut } from "lucide-react";

function AuthGate() {
  const { user, isLoading } = useAuth();
  const logoutMutation = useLogout();
  const qc = useQueryClient();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary/50" />
      </div>
    );
  }

  if (!user) {
    return (
      <LoginPage
        onSuccess={() => {
          qc.invalidateQueries({ queryKey: ["/api/auth/me"] });
        }}
      />
    );
  }

  return (
    <>
      {/* Logout bar */}
      <div className="fixed top-0 right-0 z-50 p-4">
        <div className="flex items-center gap-3 bg-card/90 backdrop-blur border border-border/60 rounded-full px-4 py-2 shadow-sm">
          <span className="text-sm font-display text-foreground/70">
            {user.username}
          </span>
          <div className="w-px h-4 bg-border" />
          <button
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
            data-testid="button-logout"
            className="flex items-center gap-1.5 text-sm font-body text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50"
          >
            {logoutMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <LogOut className="w-4 h-4" />
            )}
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen selection:bg-primary/20 selection:text-primary">
          <AuthGate />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
