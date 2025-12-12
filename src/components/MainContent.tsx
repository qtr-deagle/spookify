import { useMusic } from "@/context/MusicContext";
import { useNavigation } from "@/context/NavigationContext";
import { SongCard } from "./SongCard";
import { SongDetail } from "./SongDetail";
import { Music, X, ArrowLeft, Play, Pause, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Explore } from "./Explore";
import { Library } from "./Library";
import { Pricing } from "./Pricing";

export function MainContent({ onAuthRequired }: { onAuthRequired?: () => void }) {
  const { songs, selectedPlaylist, searchQuery, currentView, playlists, filterByArtist, setFilterByArtist, filterByGenre, setFilterByGenre, user, setCurrentSong, setIsPlaying, selectedSongDetail, setSelectedSongDetail, setCurrentView, currentSong, isPlaying } = useMusic();
  const { goBack } = useNavigation();

  // Show Song Detail page
  if (currentView === "song-detail" && selectedSongDetail) {
    return <SongDetail song={selectedSongDetail} onAuthRequired={onAuthRequired} />;
  }

  // Show Pricing page
  if (currentView === "pricing") {
    return <Pricing />;
  }

  // Show Explore page for browse view
  if (currentView === "browse") {
    return <Explore onAuthRequired={onAuthRequired} />;
  }

  // Show Library page for library view
  if (currentView === "library") {
    return <Library onAuthRequired={onAuthRequired} />;
  }

  // Filter songs based on current view
  let displaySongs = songs;
  let viewTitle = "Browse All";
  let viewDescription = "";

  if (currentView === "home") {
    if (filterByGenre) {
      viewTitle = `Songs in ${filterByGenre}`;
      viewDescription = `Showing all ${filterByGenre} songs`;
    } else if (filterByArtist) {
      viewTitle = `Songs by ${filterByArtist}`;
      viewDescription = `Showing all songs by ${filterByArtist}`;
    } else if (selectedPlaylist) {
      viewTitle = selectedPlaylist.name;
      viewDescription = `${selectedPlaylist.songs?.length || songs.length} songs in this playlist`;
    } else {
      viewTitle = "Home";
      viewDescription = `${songs.length} songs available`;
    }
  }

  let filteredSongs = displaySongs.filter((song) => {
    // Apply genre filter if set
    if (filterByGenre && song.genre !== filterByGenre) {
      return false;
    }

    // Apply artist filter if set
    if (filterByArtist && song.artist !== filterByArtist) {
      return false;
    }

    // Apply search filter
    const query = searchQuery.toLowerCase();
    return [song.title, song.artist]
      .filter(Boolean)
      .some((field) => field.toLowerCase().includes(query));
  });

  // Get trending songs (first 5)
  const trendingSongs = songs.slice(0, 5);
  const featuredSong = trendingSongs[0];
  const heroSong = featuredSong;

  // Get personalized greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // Home page with hero section
  if (currentView === "home" && !filterByGenre && !filterByArtist && !selectedPlaylist) {
    return (
      <main className="flex-1 overflow-y-auto scrollbar-thin bg-background transition-all duration-300">
        {/* Hero Section */}
        <section className="relative h-96 bg-gradient-to-b from-orange-500/20 via-background to-background overflow-hidden">
          {/* Hero Background with Image */}
          {heroSong && (
            <>
              <div className="absolute inset-0 opacity-40">
                <img
                  src={heroSong.cover}
                  alt={heroSong.title}
                  className="w-full h-full object-cover blur-md scale-110"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-transparent" />
            </>
          )}

          {/* Hero Content */}
          <div className="relative h-full flex items-end p-8 md:p-12">
            <div className="max-w-2xl">
              <p className="text-orange-400 font-semibold text-sm mb-2 flex items-center gap-2">
                <Zap className="h-4 w-4" />
                TRENDING NOW
              </p>
              <h2 className="text-5xl md:text-6xl font-black text-white mb-3 leading-tight">
                {heroSong?.title}
              </h2>
              <p className="text-white/80 text-lg mb-6">{heroSong?.artist}</p>
              <Button
                onClick={() => {
                  if (heroSong) {
                    // If clicking the same song
                    if (currentSong?.id === heroSong.id) {
                      // Toggle play/pause
                      setIsPlaying(!isPlaying);
                    } else {
                      // Play new song and navigate to detail
                      setCurrentSong(heroSong);
                      setIsPlaying(true);
                      setSelectedSongDetail(heroSong);
                      setCurrentView("song-detail");
                    }
                  }
                }}
                className={`rounded-full px-8 py-3 font-bold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 ${
                  currentSong?.id === heroSong?.id && isPlaying
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                    : "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                } text-white`}
              >
                {currentSong?.id === heroSong?.id && isPlaying ? (
                  <>
                    <Pause className="h-5 w-5 fill-current" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5 fill-current" />
                    Play Now
                  </>
                )}
              </Button>
            </div>
          </div>
        </section>

        {/* Personalized Greeting & Content */}
        <div className="p-8 md:p-12">
          {/* Greeting */}
          <div className="mb-12 animate-in fade-in slide-in-from-top">
            <div className="bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-transparent rounded-2xl border border-orange-500/20 p-8 md:p-10 backdrop-blur-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-orange-400 via-amber-400 to-orange-300 bg-clip-text text-transparent mb-3">
                    {getGreeting()}, {user?.username || "Music Lover"}!
                  </h3>
                  <p className="text-lg text-white/90 font-semibold mb-2">Ready to discover something new?</p>
                  <p className="text-sm text-orange-300/80">Explore trending tracks, your saved favorites, and fresh recommendations</p>
                </div>
              </div>
            </div>
          </div>

          {/* Featured Tracks Section */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h4 className="text-2xl font-bold text-white">Featured Tracks</h4>
                <p className="text-muted-foreground text-sm">Trending right now</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {trendingSongs.map((song, index) => (
                <SongCard
                  key={song.id}
                  song={song}
                  rowIndex={index}
                  onAuthRequired={onAuthRequired}
                />
              ))}
            </div>
          </section>

          {/* All Songs Section */}
          {songs.length > 0 && (
            <section>
              <div className="mb-6">
                <h4 className="text-2xl font-bold text-white">All Songs</h4>
                <p className="text-muted-foreground text-sm">Browse our complete collection</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 animate-in fade-in">
                {songs.map((song, index) => (
                  <SongCard
                    key={song.id}
                    song={song}
                    rowIndex={index}
                    onAuthRequired={onAuthRequired}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto scrollbar-thin p-6 md:p-8 bg-background transition-all duration-300">

      <div className="mb-8 animate-in fade-in slide-in-from-top">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">{viewTitle}</h1>
          {filterByGenre && !filterByArtist && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setFilterByGenre(null);
              }}
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
              Clear filter
            </Button>
          )}
        </div>
        <p className="text-muted-foreground">{viewDescription}</p>
      </div>
      {filterByArtist && (
        <button
          onClick={() => {
            setFilterByArtist(null);
            goBack();
          }}
          className="flex items-center gap-2 p-2 hover:bg-surface-hover rounded-lg transition-all duration-200 text-muted-foreground hover:text-foreground mb-4"
          title="Go back"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="text-sm font-medium">Go Back</span>
        </button>
      )}
      {filteredSongs.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 animate-in fade-in">
          {filteredSongs.map((song, index) => {
            const rowIndex = Math.floor(index / 5);
            return (
              <SongCard
                key={song.id}
                song={song}
                rowIndex={rowIndex}
                showTransfer={!!selectedPlaylist}
                currentPlaylistId={String(selectedPlaylist?.id)}
                onAuthRequired={onAuthRequired}
              />
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground animate-in fade-in">
          <Music className="h-16 w-16 mb-4 opacity-50" />
          <p className="text-lg font-semibold">
            {searchQuery ? "No songs found" : "No songs in this view"}
          </p>
          <p className="text-sm">
            {searchQuery ? "Try a different search" : "Add some songs to get started"}
          </p>
        </div>
      )}
    </main>
  );
}
