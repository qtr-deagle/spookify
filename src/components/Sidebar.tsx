import { Plus, Music, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMusic } from "@/context/MusicContext";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export function Sidebar() {
  const { playlists, selectedPlaylist, setSelectedPlaylist, createPlaylist, deletePlaylist } = useMusic();
  const [isCreating, setIsCreating] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");

  const handleCreate = () => {
    if (newPlaylistName.trim()) {
      createPlaylist(newPlaylistName.trim());
      setNewPlaylistName("");
      setIsCreating(false);
    }
  };

  return (
    <aside className="w-64 bg-background border-r border-border flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Your Playlists
          </h2>
          <Button
            variant="ghost"
            size="icon"
            className={`h-8 w-8 hover:text-foreground transition-colors duration-300 ${isCreating ? "text-primary" : "text-muted-foreground"
              }`}
            onClick={() => setIsCreating((prev) => !prev)}
          >
            <span
              className="flex items-center justify-center transition-transform duration-300 ease-in-out"
              style={{ transform: isCreating ? "rotate(180deg)" : "rotate(0deg)" }}
            >
              {isCreating ? (
                <Minus className="h-4 w-4 transition-opacity duration-300 opacity-100" />
              ) : (
                <Plus className="h-4 w-4 transition-opacity duration-300 opacity-100" />
              )}
            </span>
          </Button>


        </div>

        {isCreating && (
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Playlist name"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              className="h-8 text-sm"
              autoFocus
            />
            <Button size="sm" onClick={handleCreate} className="h-8">
              Add
            </Button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-2">
        {playlists.map((playlist) => (
          <div
            key={playlist.id}
            className={`w-full flex items-center gap-3 p-3 rounded-md transition-colors ${selectedPlaylist?.id === playlist.id
              ? "bg-surface-elevated text-foreground"
              : "text-muted-foreground hover:bg-surface-hover hover:text-foreground"
              }`}
          >
            <button
              onClick={() => setSelectedPlaylist(playlist)}
              className="flex items-center gap-3 flex-1 text-left"
            >
              {playlist.cover ? (
                <img
                  src={playlist.cover}
                  alt={playlist.name}
                  className="w-10 h-10 rounded object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded bg-card flex items-center justify-center">
                  <Music className="h-5 w-5 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1">
                <p className="font-medium text-sm truncate">{playlist.name}</p>
                <p className="text-xs text-muted-foreground">
                  {playlist.song_count ?? playlist.songs?.length ?? 0} songs
                </p>
              </div>
            </button>

            <button
              onClick={() => deletePlaylist(String(playlist.id))}
              className="text-muted-foreground hover:text-destructive transition-colors"
              title="Delete playlist"
            >
              <Minus className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </aside>
  );
}
