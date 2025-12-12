import { Search, Home, Library, Music, User, MoreHorizontal, ArrowLeft, Shield, Zap, X, Play } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMusic } from "@/context/MusicContext";
import { useNavigation } from "@/context/NavigationContext";
import { ActivityModal } from "@/components/ActivityModal";
import { ProfileAvatar } from "@/components/ProfileAvatar";
import { AdminPanel } from "@/components/AdminPanel";
import { SubscriptionModal } from "@/components/SubscriptionModal";
import { useState, useMemo } from "react";
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
  const { user, setUser, searchQuery, setSearchQuery, setSelectedPlaylist, currentView, setCurrentView, selectedPlaylist, songs, setCurrentSong, setIsPlaying } = useMusic();
  const { canGoBack, goBack } = useNavigation();
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

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

  // Filter songs based on search query
  const filteredSongs = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return songs.filter((song) => 
      song.title.toLowerCase().includes(query) || 
      song.artist.toLowerCase().includes(query)
    ).slice(0, 8); // Limit to 8 results
  }, [searchQuery, songs]);

  // Handle song click from search results
  const handleSongClick = (song: any) => {
    setCurrentSong(song);
    setIsPlaying(true);
    setIsSearchOpen(false);
    setSearchQuery("");
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
          <div className="relative group w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
            <Input
              placeholder="What do you want to play?"
              className="pl-10 pr-4 h-10 bg-white/10 border border-white/20 text-white placeholder:text-white/50 hover:bg-white/20 focus:border-white focus:ring-2 focus:ring-white/30 transition-all duration-300 rounded-full text-sm w-full"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => searchQuery && setIsSearchOpen(true)}
              onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
            />

            {/* Search Results Dropdown */}
            {isSearchOpen && filteredSongs.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-gradient-to-b from-zinc-900/95 to-black/95 backdrop-blur-md border border-white/10 rounded-lg shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="max-h-96 overflow-y-auto scrollbar-thin">
                  {filteredSongs.map((song, index) => (
                    <button
                      key={song.id}
                      onClick={() => handleSongClick(song)}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/10 transition-all duration-200 group text-left border-b border-white/5 last:border-b-0"
                    >
                      {/* Song Cover */}
                      <div className="flex-shrink-0 relative rounded-md overflow-hidden w-10 h-10">
                        <img 
                          src={song.cover} 
                          alt={song.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                          <Play className="h-3.5 w-3.5 text-white fill-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      </div>

                      {/* Song Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate group-hover:text-orange-400 transition-colors duration-200">
                          {song.title}
                        </p>
                        <p className="text-xs text-muted-foreground/70 truncate group-hover:text-muted-foreground/90 transition-colors duration-200">
                          {song.artist}
                        </p>
                      </div>

                      {/* Play Icon */}
                      <Play className="h-4 w-4 text-muted-foreground/50 group-hover:text-orange-400 transition-all duration-200 fill-current opacity-0 group-hover:opacity-100" />
                    </button>
                  ))}
                </div>

                {/* Results Footer */}
                <div className="px-4 py-2 bg-white/5 border-t border-white/10 text-xs text-muted-foreground/70 text-center">
                  {filteredSongs.length === 8 && songs.filter(s => 
                    s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                    s.artist.toLowerCase().includes(searchQuery.toLowerCase())
                  ).length > 8 
                    ? `Showing 8 of ${songs.filter(s => 
                        s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        s.artist.toLowerCase().includes(searchQuery.toLowerCase())
                      ).length} results`
                    : `${filteredSongs.length} result${filteredSongs.length !== 1 ? 's' : ''} found`
                  }
                </div>
              </div>
            )}

            {/* No Results State */}
            {isSearchOpen && searchQuery && filteredSongs.length === 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-gradient-to-b from-zinc-900/95 to-black/95 backdrop-blur-md border border-white/10 rounded-lg shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-8 flex flex-col items-center justify-center text-center">
                  <Search className="h-8 w-8 text-muted-foreground/50 mb-2" />
                  <p className="text-sm text-muted-foreground">No songs found</p>
                  <p className="text-xs text-muted-foreground/50 mt-1">Try searching for a song title or artist</p>
                </div>
              </div>
            )}

            {/* Clear button for search input */}
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setIsSearchOpen(false);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded transition-colors duration-200 z-10"
              >
                <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
              </button>
            )}
          </div>
        </div>

        {/* Right: Actions and User */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Activity Modal */}
          <ActivityModal />

          {/* Subscription Button - For logged-in users */}
          {user && user.subscription !== "premium" && user.subscription !== "pro" && (
            <button
              onClick={() => setIsSubscriptionOpen(true)}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/20 to-amber-500/20 hover:from-orange-500/30 hover:to-amber-500/30 text-orange-400 hover:text-orange-300 transition-all duration-300 border border-orange-500/30 hover:border-orange-500/50 font-semibold text-sm group"
              title="Upgrade to Premium"
            >
              <Zap className="h-4 w-4 group-hover:scale-110 transition-transform" />
              <span className="hidden md:inline">Upgrade</span>
            </button>
          )}

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

      {/* Subscription Modal */}
      <SubscriptionModal isOpen={isSubscriptionOpen} onClose={() => setIsSubscriptionOpen(false)} />
    </>
  );
}
