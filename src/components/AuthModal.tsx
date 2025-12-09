import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMusic } from "@/context/MusicContext";
import { toast } from "sonner";
import { X } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { setUser } = useMusic();
  const [isLogin, setIsLogin] = useState(true);
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
          id: result.user?.id || "1", // optional: return user ID from PHP
          username: result.user?.username || formData.username || formData.email.split("@")[0],
          email: formData.email,
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
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-black border border-border rounded-2xl w-full max-w-sm p-8 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-surface-hover rounded-lg transition-all duration-200 text-muted-foreground hover:text-foreground"
          title="Close"
        >
          <X className="h-5 w-5" />
        </button>
        {/* Logo */}
        <div className="flex justify-center mb-6">
          {/* Ghost emoji */}
          <img
            src="/images/ghost.png"   // replace with your actual image path
            alt="Ghost"
            className="w-32 h-32"     // adjust size as needed
          />
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <img
            src="/images/text.png"   // replace with your actual logo path
            alt="SPOOK!FY Logo"
            className="w-48 h-auto mx-auto"   // adjust size as needed
          />
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white text-sm font-semibold">
              Email or username
            </Label>
            <Input
              id="email"
              type="text"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="user@example.com"
              className="bg-transparent border border-white/30 text-white placeholder:text-white/40 rounded-lg h-12 focus:border-orange-500 focus:outline-none"
            />
          </div>

          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="username" className="text-white text-sm font-semibold">
                Username
              </Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder=""
                className="bg-transparent border border-white/30 text-white placeholder:text-white/40 rounded-lg h-12 focus:border-orange-500 focus:outline-none"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="password" className="text-white text-sm font-semibold">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder=""
              className="bg-transparent border border-white/30 text-white placeholder:text-white/40 rounded-lg h-12 focus:border-orange-500 focus:outline-none"
            />
          </div>

          {isLogin && (
            <div className="text-right">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-white text-sm underline hover:text-orange-500 transition-colors"
              >
                Forgot your password?
              </button>
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg h-12 rounded-full transition-all duration-200"
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
            onClick={() => setIsLogin(!isLogin)}
            className="block w-full text-white font-bold text-lg hover:text-orange-500 transition-colors"
          >
            {isLogin ? "Sign up" : "Log in"}
          </button>
        </p>
      </div>
    </div>
  );
}
