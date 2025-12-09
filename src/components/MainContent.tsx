import { useMusic } from "@/context/MusicContext";
import { useNavigation } from "@/context/NavigationContext";
import { SongCard } from "./SongCard";
import { Music, X, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Explore } from "./Explore";
import { Library } from "./Library";

export function MainContent({ onAuthRequired }: { onAuthRequired?: () => void }) {
  const { songs, selectedPlaylist, searchQuery, currentView, playlists, filterByArtist, setFilterByArtist, filterByGenre, setFilterByGenre } = useMusic();
  const { goBack } = useNavigation();

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

  return (
    <main className="flex-1 overflow-y-auto scrollbar-thin p-6 bg-background transition-all duration-300">

      <div className="mb-8 animate-in fade-in slide-in-from-top">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-foreground">{viewTitle}</h1>
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 animate-in fade-in">
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
          <p className="text-lg">
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
