import { Play, Plus, ArrowRightLeft } from "lucide-react";
import { Song } from "@/types/music";
import { useMusic } from "@/context/MusicContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SongCardProps {
  song: Song;
  showTransfer?: boolean;
  currentPlaylistId?: string;
}

export function SongCard({ song, showTransfer, currentPlaylistId }: SongCardProps) {
  const { setCurrentSong, setIsPlaying, playlists, addSongToPlaylist, transferSong } = useMusic();

  const handlePlay = () => {
    setCurrentSong(song);
    setIsPlaying(true);
  };

  return (
    <div className="group bg-card rounded-lg p-4 hover:bg-surface-hover transition-all duration-200 cursor-pointer">
      <div className="relative mb-4">
        <img
          src={song.cover}
          alt={song.album}
          className="w-full aspect-square object-cover rounded-md shadow-lg"
        />
        <button
          onClick={handlePlay}
          className="absolute bottom-2 right-2 w-12 h-12 bg-primary rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200 shadow-lg hover:scale-105"
        >
          <Play className="h-5 w-5 text-primary-foreground fill-current ml-1" />
        </button>
      </div>

      <h3 className="font-semibold text-foreground truncate mb-1">{song.title}</h3>
      <p className="text-sm text-muted-foreground truncate">{song.artist}</p>

      <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Plus className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {playlists.map((playlist) => (
              <DropdownMenuItem
                key={playlist.id}
                onClick={() => addSongToPlaylist(song.id, playlist.id)}
              >
                Add to {playlist.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {showTransfer && currentPlaylistId && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Plus className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {playlists.map((playlist) => (
                <DropdownMenuItem
                  key={playlist.id}
                  onClick={() => addSongToPlaylist(Number(song.id), String(playlist.id))}
                >
                  Add to {playlist.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}
