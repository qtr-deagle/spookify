import { Plus, Music, Minus, X, Globe, Edit2, Trash2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMusic } from "@/context/MusicContext";
import { useState } from "react";
import { Input } from "@/components/ui/input";

interface SidebarProps {
  onAuthRequired?: () => void;
}

export function Sidebar({ onAuthRequired }: SidebarProps) {
  const { playlists, selectedPlaylist, setSelectedPlaylist, createPlaylist, deletePlaylist, user, setCurrentView } = useMusic();
  const [isCreatingModal, setIsCreatingModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      createPlaylist(newPlaylistName.trim());
      setNewPlaylistName("");
      setIsCreatingModal(false);
    }
  };

  return (
    <aside className="w-80 bg-background flex flex-col h-full gap-0">
      {/* Header */}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Your Library</h2>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-surface-hover text-white"
            onClick={() => {
              if (!user) {
                onAuthRequired?.();
                return;
              }
              setIsCreatingModal(true);
            }}
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-4 my-4">
        {playlists.length > 0 ? (
          <div className="space-y-2">
            {playlists.map((playlist) => (
              <SidebarPlaylistItem
                key={playlist.id}
                playlist={playlist}
                isSelected={selectedPlaylist?.id === playlist.id}
                onSelect={() => {
                  setSelectedPlaylist(playlist);
                  setCurrentView("home");
                }}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">

            {/* Browse Podcasts Card */}
            <div className="bg-surface-hover/50 rounded-xl p-6 hover:bg-surface-hover transition-all duration-300">
              <h3 className="text-xl font-bold text-white mb-2">Let's find some podcasts to follow</h3>
              <p className="text-white/70 text-sm mb-4">We'll keep you updated on new episodes</p>
              <Button 
                onClick={() => setCurrentView("browse")}
                className="bg-white hover:bg-white/90 text-black font-bold rounded-full px-6 py-2 text-sm"
              >
                Browse podcasts
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 p-4 space-y-4">
        {/* Premium CTA - Only for free users */}
        {!user || user.subscription === "free" ? (
          <Button
            onClick={() => setCurrentView("pricing")}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-full py-2 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
          >
            <Zap className="h-4 w-4" />
            <span>Upgrade to Premium</span>
          </Button>
        ) : null}

        {/* Footer Links */}
        <div className="space-y-3 text-xs">
          <div className="flex flex-wrap gap-2">
            <a href="#" className="text-muted-foreground hover:text-white transition-colors">Legal</a>
            <a href="#" className="text-muted-foreground hover:text-white transition-colors">Safety & Privacy Center</a>
            <a href="#" className="text-muted-foreground hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="text-muted-foreground hover:text-white transition-colors">Cookies</a>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href="#" className="text-muted-foreground hover:text-white transition-colors">About Ads</a>
            <a href="#" className="text-muted-foreground hover:text-white transition-colors">Accessibility</a>
          </div>
        </div>

        {/* Cookies Heading */}
        <div>
          <p className="text-white font-semibold text-sm mb-3">Cookies</p>
        </div>

        {/* Language Selector */}
        <Button
          variant="outline"
          className="w-full border-border bg-transparent hover:bg-surface-hover text-white rounded-full py-2 flex items-center justify-center gap-2"
        >
          <Globe className="h-4 w-4" />
          <span>English</span>
        </Button>
      </div>

      {/* Create Playlist Modal */}
      {isCreatingModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-zinc-900 rounded-2xl p-8 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 border border-zinc-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Create a playlist</h2>
              <button
                onClick={() => setIsCreatingModal(false)}
                className="text-muted-foreground hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-white block mb-2">Playlist name</label>
                <Input
                  type="text"
                  placeholder="Enter playlist name"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreatePlaylist()}
                  autoFocus
                  className="bg-surface-hover border-surface-hover/50 text-white placeholder:text-muted-foreground focus:border-orange-500 focus:ring-orange-500/50 rounded-lg py-2 px-3"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => setIsCreatingModal(false)}
                  variant="ghost"
                  className="flex-1 text-white hover:bg-surface-hover"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreatePlaylist}
                  disabled={!newPlaylistName.trim()}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold disabled:opacity-50"
                >
                  Create
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

// Sidebar Playlist Item with Rename/Delete
function SidebarPlaylistItem({
  playlist,
  isSelected,
  onSelect,
}: {
  playlist: any;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const { deletePlaylist } = useMusic();
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(playlist.name);
  const [isHovering, setIsHovering] = useState(false);

  const handleRename = async () => {
    if (newName.trim() && newName !== playlist.name) {
      try {
        const formData = new FormData();
        formData.append("playlist_id", playlist.id.toString());
        formData.append("name", newName.trim());
        
        const response = await fetch("/api/updatePlaylist.php", {
          method: "POST",
          body: formData,
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
          setIsRenaming(false);
          window.dispatchEvent(new CustomEvent('playlistsUpdated'));
        } else {
          throw new Error(result.error || "Failed to rename playlist");
        }
      } catch (error) {
        console.error("Failed to rename playlist:", error);
        alert("Failed to rename playlist. Please try again.");
      }
    } else {
      setIsRenaming(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${playlist.name}"?`)) {
      return;
    }
    try {
      await deletePlaylist(playlist.id);
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete playlist. Please try again.");
    }
  };

  return (
    <div
      className="group relative w-full"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div
        onClick={onSelect}
        className={`group w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-300 cursor-pointer ${
          isSelected
            ? "bg-surface-hover text-white"
            : "text-muted-foreground hover:bg-surface-hover/50 hover:text-white"
        }`}
      >
        <div className="w-12 h-12 rounded bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center flex-shrink-0">
          <Music className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-white truncate">{playlist.name}</p>
          <p className="text-xs text-muted-foreground">{playlist.song_count ?? 0} songs</p>
        </div>
      </div>

      {/* Action Buttons - Show on Hover */}
      {isHovering && !isRenaming && (
        <div className="absolute top-2 right-2 flex gap-1 z-20">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsRenaming(true);
            }}
            className="p-1.5 rounded bg-orange-500 hover:bg-orange-600 text-white transition-all"
            title="Rename"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            className="p-1.5 rounded bg-red-500 hover:bg-red-600 text-white transition-all"
            title="Delete"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Rename Modal */}
      {isRenaming && (
        <div
          className="absolute inset-0 bg-black/80 flex items-center justify-center z-50 rounded-lg"
          onClick={() => setIsRenaming(false)}
        >
          <div
            className="bg-zinc-900 rounded-lg p-3 w-[85%] border border-zinc-800"
            onClick={(e) => e.stopPropagation()}
          >
            <Input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleRename();
                if (e.key === "Escape") setIsRenaming(false);
              }}
              autoFocus
              className="bg-surface-hover border-surface-hover/50 text-white placeholder:text-muted-foreground focus:border-orange-500 focus:ring-orange-500/50 rounded-lg py-1.5 px-2 mb-2 text-sm"
            />
            <div className="flex gap-2 text-xs">
              <button
                onClick={() => setIsRenaming(false)}
                className="flex-1 px-2 py-1 rounded bg-surface-hover hover:bg-surface-hover/80 text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRename}
                className="flex-1 px-2 py-1 rounded bg-orange-500 hover:bg-orange-600 text-white font-bold transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
