import { useMusic } from "@/context/MusicContext";
import { SongCard } from "./SongCard";
import { Music } from "lucide-react";

export function MainContent() {
  const { songs, selectedPlaylist, searchQuery } = useMusic();

  const displaySongs = selectedPlaylist ? songs : songs;


  const filteredSongs = displaySongs.filter((song) => {
    const query = searchQuery.toLowerCase();
    return [song.title, song.artist, song.album]
      .filter(Boolean)
      .some((field) => field.toLowerCase().includes(query));
  });

  return (
    <main className="flex-1 overflow-y-auto scrollbar-thin p-6 bg-background">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {selectedPlaylist ? selectedPlaylist.name : "Browse All"}
        </h1>
        <p className="text-muted-foreground">
          {selectedPlaylist
            ? `${songs.length} songs in this playlist`
            : `${songs.length} songs available`}
        </p>
      </div>

      {filteredSongs.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredSongs.map((song) => (
            <SongCard
              key={song.id}
              song={song}
              showTransfer={!!selectedPlaylist}
              currentPlaylistId={selectedPlaylist?.id}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Music className="h-16 w-16 mb-4 opacity-50" />
          <p className="text-lg">
            {searchQuery ? "No songs found" : "No songs in this playlist"}
          </p>
          <p className="text-sm">
            {searchQuery ? "Try a different search" : "Add some songs to get started"}
          </p>
        </div>
      )}
    </main>
  );
}
