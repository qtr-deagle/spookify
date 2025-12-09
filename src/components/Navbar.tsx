import { Search, Home, Library, Music, User, MoreHorizontal, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMusic } from "@/context/MusicContext";
import { useNavigation } from "@/context/NavigationContext";
import { ActivityModal } from "@/components/ActivityModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavbarProps {
  onAuthClick: () => void;
}

export function Navbar({ onAuthClick }: NavbarProps) {
  const { user, setUser, searchQuery, setSearchQuery, setSelectedPlaylist, currentView, setCurrentView, selectedPlaylist } = useMusic();
  const { canGoBack, goBack } = useNavigation();

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
    <header className="h-20 bg-background border-b border-border flex items-center justify-between px-6 gap-4 transition-all duration-300">
      {/* Back Button + Logo - positioned to the left */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {canGoBack && (
          <button
            onClick={goBack}
            className="p-2 hover:bg-surface-hover rounded-lg transition-all duration-200 text-muted-foreground hover:text-foreground"
            title="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}
        <button 
          onClick={handleHomeClick}
          className="flex items-center gap-2 hover:scale-105 transition-transform duration-300 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center group-hover:shadow-lg group-hover:shadow-primary/50 transition-all duration-300">
            <img src="images/ghost.png" alt="Spookify Logo" className="h-6 w-6 text-background" />
          </div>
          <span className="text-2xl font-bold text-foreground hidden sm:inline">Spookify</span>
        </button>
      </div>

      {/* Navigation Links - Centered */}
      <nav className="flex items-center gap-6 flex-1 justify-center">
        <button
          onClick={handleHomeClick}
          className={`font-semibold transition-all duration-300 relative px-2 py-1 ${
            currentView === "home" && !selectedPlaylist
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Home
          {currentView === "home" && !selectedPlaylist && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary transition-all duration-300" />
          )}
        </button>
        <button
          onClick={handleExploreClick}
          className={`font-semibold transition-all duration-300 relative px-2 py-1 ${
            currentView === "browse"
              ? "text-white"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Explore
          {currentView === "browse" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary transition-all duration-300" />
          )}
        </button>
        <button
          onClick={handleLibraryClick}
          className={`font-semibold transition-all duration-300 relative px-2 py-1 ${
            currentView === "library"
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Library
          {currentView === "library" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary transition-all duration-300" />
          )}
        </button>
      </nav>

      {/* Search */}
      <div className="flex-1 max-w-sm transition-all duration-300">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="What do you want to play?"
            className="pl-10 pr-4 h-10 bg-card border-border focus:ring-primary transition-all duration-300 rounded-full text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Right Icons - positioned to the right */}
      <div className="flex items-center gap-4 flex-shrink-0">
        <ActivityModal />

        {user ? (
          <>
            <div className="flex items-center gap-3 px-4 py-2 bg-surface-hover rounded-full transition-all duration-300 hover:bg-surface-elevated">
              <User className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-semibold text-foreground">{user.username}</span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-muted-foreground hover:text-foreground transition-colors duration-300">
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setUser(null)}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <Button 
            onClick={onAuthClick}
            variant="outline"
            size="sm"
            className="rounded-full border-primary text-primary hover:bg-primary hover:text-background transition-all duration-300"
          >
            Login / Register
          </Button>
        )}
      </div>
    </header>
  );
}
