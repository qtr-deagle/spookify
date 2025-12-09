import { Play, Plus, ArrowRightLeft, Trash2 } from "lucide-react";
import { Song } from "@/types/music";
import { useMusic } from "@/context/MusicContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SongCardProps {
  song: Song;
  showTransfer?: boolean;
  currentPlaylistId?: string;
  onAuthRequired?: () => void;
  rowIndex?: number;
}

export function SongCard({ song, showTransfer, currentPlaylistId, onAuthRequired, rowIndex = 0 }: SongCardProps) {
  const { setCurrentSong, setIsPlaying, playlists, addSongToPlaylist, transferSong, deleteSongFromPlaylist, user, setFilterByArtist, setCurrentView } = useMusic();

  const handlePlay = () => {
    setCurrentSong(song);
    setIsPlaying(true);
    console.log("Playing:", song.title, song.url);
  };

  const handleArtistClick = () => {
    setFilterByArtist(song.artist);
    setCurrentView("home");
  };

  return (
    <div 
      className="group bg-card rounded-lg p-4 hover:bg-surface-hover transition-all duration-300 cursor-pointer hover:shadow-xl hover:scale-[1.02] transform"
      style={{
        animation: `slideInUp 700ms ease-out forwards`,
        animationDelay: `${rowIndex * 150}ms`,
      }}
    >
      <div className="relative mb-4 overflow-hidden rounded-md">
        <img
          src={song.cover}
          alt={song.title}
          className="w-full aspect-square object-cover shadow-lg transition-transform duration-300 group-hover:scale-110"
        />
        <button
          onClick={handlePlay}
          className="absolute bottom-2 right-2 w-12 h-12 bg-primary rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-lg hover:scale-110 active:scale-95"
        >
          <Play className="h-5 w-5 text-primary-foreground fill-current ml-1" />
        </button>
      </div>

      <h3 className="font-semibold text-foreground truncate mb-1 transition-colors duration-200">{song.title}</h3>
      {/* Click artist to filter by that artist */}
      <button
        onClick={handleArtistClick}
        className="text-sm text-muted-foreground truncate hover:text-primary transition-colors hover:underline"
      >
        {song.artist}
      </button>

      <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
        {/* Add to Playlist */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 transition-all duration-200 hover:scale-110 active:scale-95"
              onClick={(e) => {
                if (!user && onAuthRequired) {
                  e.preventDefault();
                  onAuthRequired();
                }
              }}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          {user && (
            <DropdownMenuContent>
              {playlists.length > 0 ? (
                playlists.map((playlist) => (
                  <DropdownMenuItem
                    key={playlist.id}
                    onClick={() => {
                      // Always use addSongToPlaylist - simpler and works for all cases
                      addSongToPlaylist(Number(song.id), Number(playlist.id));
                    }}
                  >
                    Add to {playlist.name}
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="px-2 py-1.5 text-sm text-muted-foreground">
                  No playlists yet
                </div>
              )}
            </DropdownMenuContent>
          )}
        </DropdownMenu>

        {/* Transfer Song between playlists */}
        {showTransfer && currentPlaylistId && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 transition-all duration-200 hover:scale-110 active:scale-95">
                <ArrowRightLeft className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {playlists
                .filter((p) => String(p.id) !== currentPlaylistId)
                .map((playlist) => (
                  <DropdownMenuItem
                    key={playlist.id}
                    onClick={() =>
                      transferSong(
                        Number(song.id),                // song to move
                        Number(currentPlaylistId),      // from this playlist
                        Number(playlist.id)             // to target playlist
                      )
                    }
                  >
                    Move to {playlist.name}
                  </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Delete from Playlist */}
        {showTransfer && currentPlaylistId && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 transition-all duration-200 hover:scale-110 active:scale-95"
            onClick={() => deleteSongFromPlaylist(Number(song.id), Number(currentPlaylistId))}
          >
            <Trash2 className="h-4 w-4 text-white" />
          </Button>
        )}
      </div>
    </div>
  );
}