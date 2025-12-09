import { Plus, Music, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMusic } from "@/context/MusicContext";
import { useState } from "react";
import { Input } from "@/components/ui/input";

interface SidebarProps {
  onAuthRequired?: () => void;
}

export function Sidebar({ onAuthRequired }: SidebarProps) {
  const { playlists, selectedPlaylist, setSelectedPlaylist, createPlaylist, deletePlaylist, user, setCurrentView } = useMusic();
  const [isCreating, setIsCreating] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");

  const handleCreateClick = () => {
    if (!user && onAuthRequired) {
      onAuthRequired();
      return;
    }
    setIsCreating((prev) => !prev);
  };

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
            onClick={handleCreateClick}
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
            className={`group w-full flex items-center gap-3 p-3 rounded-md transition-all duration-300 transform hover:scale-102 ${selectedPlaylist?.id === playlist.id
              ? "bg-surface-elevated text-foreground shadow-md"
              : "text-muted-foreground hover:bg-surface-hover hover:text-foreground"
              }`}
          >
            <button
              onClick={() => {
                setSelectedPlaylist(playlist);
                setCurrentView("home");
              }}
              className="flex items-center gap-3 flex-1 text-left"
            >
              {playlist.cover ? (
                <img
                  src={playlist.cover}
                  alt={playlist.name}
                  className="w-10 h-10 rounded object-cover transition-transform duration-300 hover:scale-110"
                />
              ) : (
                <div className="w-10 h-10 rounded bg-card flex items-center justify-center transition-all duration-300 group-hover:bg-primary/20">
                  <Music className="h-5 w-5 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1 transition-all duration-300">
                <p className="font-medium text-sm truncate">{playlist.name}</p>
                <p className="text-xs text-muted-foreground transition-colors duration-300">
                  {playlist.song_count ?? playlist.songs?.length ?? 0} songs
                </p>
              </div>
            </button>

            <button
              onClick={() => deletePlaylist(String(playlist.id))}
              className="text-muted-foreground hover:text-destructive transition-all duration-200 hover:scale-110 opacity-0 group-hover:opacity-100"
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
