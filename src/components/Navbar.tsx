import { Search, Home, Library, Music, User, MoreHorizontal, ArrowLeft, Shield } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMusic } from "@/context/MusicContext";
import { useNavigation } from "@/context/NavigationContext";
import { ActivityModal } from "@/components/ActivityModal";
import { ProfileAvatar } from "@/components/ProfileAvatar";
import { AdminPanel } from "@/components/AdminPanel";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavbarProps {
  onAuthClick: () => void;
  onSignUpClick?: () => void;
}

export function Navbar({ onAuthClick, onSignUpClick }: NavbarProps) {
  const { user, setUser, searchQuery, setSearchQuery, setSelectedPlaylist, currentView, setCurrentView, selectedPlaylist } = useMusic();
  const { canGoBack, goBack } = useNavigation();
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);

  const handleHomeClick = () => {
    setCurrentView("home");
    setSelectedPlaylist(null);
  };

  const handleExploreClick = () => {
    setCurrentView("browse");
    setSelectedPlaylist(null);
  };

  const handleLibraryClick = () => {
    setCurrentView("library");
    setSelectedPlaylist(null);
  };

  return (
    <>
      <header className="h-16 bg-background/95 backdrop-blur-md border-b border-border/50 flex items-center justify-between px-6 gap-4 transition-all duration-300 sticky top-0 z-40">
        {/* Left: Logo and Navigation */}
        <div className="flex items-center gap-6 flex-shrink-0">
          {/* Logo */}
          <button 
            onClick={handleHomeClick}
            className="flex items-center gap-2 hover:scale-105 transition-transform duration-300 cursor-pointer group flex-shrink-0"
          >
            <img src="images/ghost.png" alt="Spookify Logo" className="h-8 w-8" />
            <span className="text-xl font-bold text-foreground hidden sm:inline">Spookify</span>
          </button>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={handleHomeClick}
              className={`px-3 py-2 rounded-full font-medium text-sm transition-all duration-300 ${
                currentView === "home" && !selectedPlaylist
                  ? "bg-foreground/10 text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
              }`}
            >
              <Home className="h-5 w-5" />
            </button>
            <button
              onClick={handleExploreClick}
              className={`px-3 py-2 rounded-full font-medium text-sm transition-all duration-300 flex items-center gap-2 ${
                currentView === "browse"
                  ? "bg-foreground/10 text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
              }`}
            >
              <Music className="h-5 w-5" />
            </button>
            <button
              onClick={handleLibraryClick}
              className={`px-3 py-2 rounded-full font-medium text-sm transition-all duration-300 ${
                currentView === "library"
                  ? "bg-foreground/10 text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
              }`}
            >
              <Library className="h-5 w-5" />
            </button>
          </nav>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-sm mx-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="What do you want to play?"
              className="pl-10 pr-4 h-10 bg-white/10 border border-white/20 text-white placeholder:text-white/50 hover:bg-white/20 focus:border-white focus:ring-2 focus:ring-white/30 transition-all duration-300 rounded-full text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Right: Actions and User */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Activity Modal */}
          <ActivityModal />

          {user ? (
            <>
              {/* Admin Button - Only for Admins */}
              {user.role === "admin" && (
                <button
                  onClick={() => setIsAdminPanelOpen(true)}
                  className="relative group p-2 rounded-lg transition-all duration-300 hover:bg-orange-500/20 hover:text-orange-400 text-muted-foreground"
                  title="Admin Panel"
                >
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 opacity-0 group-hover:opacity-20 blur transition-all duration-300" />
                  <Shield className="h-5 w-5 relative" />
                  <span className="absolute top-0 right-0 w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                </button>
              )}

              {/* Profile Avatar */}
              <ProfileAvatar 
                user={user} 
                onLogout={() => setUser(null)}
                onAdminClick={() => setIsAdminPanelOpen(true)}
              />
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button 
                onClick={onSignUpClick || onAuthClick}
                variant="ghost"
                size="sm"
                className="text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-foreground/5 rounded-full px-6 transition-all duration-300"
              >
                Sign up
              </Button>
              <Button 
                onClick={onAuthClick}
                size="sm"
                className="rounded-full border-0 bg-white text-black hover:bg-white/90 font-bold text-sm px-6 transition-all duration-300 shadow-lg"
              >
                Log in
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Admin Panel Modal */}
      <AdminPanel isOpen={isAdminPanelOpen} onClose={() => setIsAdminPanelOpen(false)} />
    </>
  );
}
