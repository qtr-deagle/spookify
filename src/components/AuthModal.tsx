import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMusic } from "@/context/MusicContext";
import { toast } from "sonner";
import { X, Shield, Music } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialIsLogin?: boolean;
}

export function AuthModal({ isOpen, onClose, initialIsLogin = true }: AuthModalProps) {
  const { setUser } = useMusic();
  const [isLogin, setIsLogin] = useState(initialIsLogin);
  const [selectedRole, setSelectedRole] = useState<"user" | "admin">("user");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      action: isLogin ? "login" : "register",
      email: formData.email,
      password: formData.password,
      role: selectedRole,
      ...(isLogin ? {} : { username: formData.username }),
    };

    try {
      const response = await fetch("/api/auth.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.status === "success") {
        setUser({
          id: result.user?.id || "1",
          username: result.user?.username || formData.username || formData.email.split("@")[0],
          email: formData.email,
          role: result.user?.role || selectedRole,
        });
        toast.success(result.message, {
          className: "text-white"
        });
        onClose();
      } else {
        toast.error(result.message || "Something went wrong.", {
          className: "text-white"
        });

      }
    } catch (error) {
      console.error("Auth error:", error);
      toast.error("Server error. Please try again.", {
        className: "text-white"
      });
    }

    setFormData({ username: "", email: "", password: "" });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-background border border-orange-500/30 rounded-2xl w-full max-w-lg p-6 relative shadow-2xl shadow-orange-500/20 max-h-[95vh] overflow-y-auto">
        {/* Glowing background elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-orange-500/20 to-transparent rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-orange-500/20 to-transparent rounded-full blur-3xl -z-10" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-orange-500/20 rounded-lg transition-all duration-200 text-muted-foreground hover:text-orange-400"
          title="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img
            src="/images/ghost.png"
            alt="Ghost"
            className="w-24 h-24 drop-shadow-lg hover:drop-shadow-2xl transition-all duration-300"
          />
        </div>

        {/* Title */}
        <div className="text-center mb-4">
          <img
            src="/images/text.png"
            alt="SPOOK!FY Logo"
            className="w-40 h-auto mx-auto drop-shadow-lg"
          />
        </div>

        {/* Role Selection - Only for Registration */}
        {!isLogin && (
          <div className="mb-4 space-y-2">
            <Label className="text-white text-xs font-semibold block">Select Your Role</Label>
            <div className="grid grid-cols-2 gap-2">
              {/* User Role */}
              <button
                type="button"
                onClick={() => setSelectedRole("user")}
                className={`relative p-3 rounded-lg border-2 transition-all duration-300 group ${
                  selectedRole === "user"
                    ? "border-orange-500 bg-gradient-to-br from-orange-500/20 to-amber-500/20 shadow-lg shadow-orange-500/30"
                    : "border-border hover:border-orange-500/50 bg-surface-hover/30"
                }`}
              >
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 opacity-0 group-hover:opacity-10 transition-all duration-300" />
                <Music className={`h-4 w-4 mx-auto mb-1 transition-all duration-300 ${selectedRole === "user" ? "text-orange-400" : "text-muted-foreground group-hover:text-orange-400"}`} />
                <p className={`text-xs font-semibold text-center ${selectedRole === "user" ? "text-orange-300" : "text-muted-foreground"}`}>User</p>
                <p className="text-xs text-muted-foreground mt-0.5 text-center">Listen & create</p>
              </button>

              {/* Admin Role */}
              <button
                type="button"
                onClick={() => setSelectedRole("admin")}
                className={`relative p-3 rounded-lg border-2 transition-all duration-300 group ${
                  selectedRole === "admin"
                    ? "border-orange-600 bg-gradient-to-br from-orange-600/20 to-orange-500/20 shadow-lg shadow-orange-600/30"
                    : "border-border hover:border-orange-600/50 bg-surface-hover/30"
                }`}
              >
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-orange-600 to-orange-500 opacity-0 group-hover:opacity-10 transition-all duration-300" />
                <Shield className={`h-4 w-4 mx-auto mb-1 transition-all duration-300 ${selectedRole === "admin" ? "text-orange-500" : "text-muted-foreground group-hover:text-orange-500"}`} />
                <p className={`text-xs font-semibold text-center ${selectedRole === "admin" ? "text-orange-400" : "text-muted-foreground"}`}>Admin</p>
                <p className="text-xs text-muted-foreground mt-0.5 text-center">Manage platform</p>
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="email" className="text-white text-xs font-semibold">
              Email or username
            </Label>
            <Input
              id="email"
              type="text"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="user@example.com"
              className="bg-transparent border border-white/30 text-white placeholder:text-white/40 rounded-lg h-10 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all duration-300"
            />
          </div>

          {!isLogin && (
            <div className="space-y-1">
              <Label htmlFor="username" className="text-white text-xs font-semibold">
                Username
              </Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="Choose a username"
                className="bg-transparent border border-white/30 text-white placeholder:text-white/40 rounded-lg h-10 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all duration-300"
              />
            </div>
          )}

          <div className="space-y-1">
            <Label htmlFor="password" className="text-white text-xs font-semibold">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Enter your password"
              className="bg-transparent border border-white/30 text-white placeholder:text-white/40 rounded-lg h-10 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all duration-300"
            />
          </div>

          {isLogin && (
            <div className="text-right">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-white text-sm underline hover:text-orange-400 transition-colors"
              >
                Forgot your password?
              </button>
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-lg h-12 rounded-full transition-all duration-300 shadow-lg shadow-orange-500/50 hover:shadow-orange-500/80"
          >
            {isLogin ? "Log in" : "Sign up"}
          </Button>
        </form>

        <p className="text-center text-white mt-8 space-y-2">
          <div className="text-sm text-white/80">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </div>
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setSelectedRole("user"); // Reset role when switching modes
            }}
            className="block w-full text-white font-bold text-lg hover:text-orange-400 transition-colors"
          >
            {isLogin ? "Sign up" : "Log in"}
          </button>
        </p>
      </div>
    </div>
  );
}
