import { Play, Plus, ArrowRightLeft, Trash2, MoreVertical } from "lucide-react";
import { Song } from "@/types/music";
import { useMusic } from "@/context/MusicContext";
import { Button } from "@/components/ui/button";
import { SongDetail } from "./SongDetail";
import { useState } from "react";
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
  cardType?: "song" | "album" | "artist" | "radio";
}

export function SongCard({ song, showTransfer, currentPlaylistId, onAuthRequired, rowIndex = 0, cardType = "song" }: SongCardProps) {
  const { setCurrentSong, setIsPlaying, playlists, addSongToPlaylist, transferSong, deleteSongFromPlaylist, user, setFilterByArtist, setCurrentView, setSelectedSongDetail } = useMusic();

  const handlePlay = () => {
    setCurrentSong(song);
    setIsPlaying(true);
    console.log("Playing:", song.title, song.url);
  };

  const handleArtistClick = () => {
    setFilterByArtist(song.artist);
    setCurrentView("home");
  };

  // Radio-style card (horizontal/wide)
  if (cardType === "radio") {
    return (
      <div
        className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-500/10 backdrop-blur-sm p-4 hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] cursor-pointer border border-orange-500/20 hover:border-orange-500/50"
        style={{
          animation: `slideInUp 700ms ease-out forwards`,
          animationDelay: `${rowIndex * 150}ms`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 opacity-0 group-hover:opacity-5 transition-all duration-500" />
        
        <div className="relative flex items-start gap-4">
          <div className="relative flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden shadow-lg">
            <img
              src={song.cover}
              alt={song.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
            <button
              onClick={handlePlay}
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                <Play className="h-5 w-5 text-white fill-white ml-0.5" />
              </div>
            </button>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-foreground truncate text-lg mb-1 group-hover:text-orange-400 transition-colors duration-300">{song.title}</h3>
            <button
              onClick={handleArtistClick}
              className="text-sm text-muted-foreground truncate hover:text-orange-400 transition-colors duration-300 block mb-2"
            >
              With {song.artist}
            </button>
            <p className="text-xs text-muted-foreground opacity-75">Lorem ipsum dolor sit amet</p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex-shrink-0 p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-orange-500/20 rounded-lg text-muted-foreground hover:text-orange-400">
                <MoreVertical className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handlePlay}>
                <Play className="h-4 w-4 mr-2" />
                Play
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={(e) => {
                  if (!user && onAuthRequired) {
                    e.preventDefault();
                    onAuthRequired();
                  }
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add to Playlist
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    );
  }

  // Album/Artist card (styled like Spotify radio with circular images)
  if (cardType === "album" || cardType === "artist") {
    return (
      <div
        className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-400 via-teal-400 to-emerald-500 p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.04] cursor-pointer"
        style={{
          animation: `slideInUp 700ms ease-out forwards`,
          animationDelay: `${rowIndex * 150}ms`,
        }}
      >
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-500" />
        
        <div className="relative flex flex-col h-full justify-between">
          {/* Radio Badge */}
          <div className="flex items-center gap-1.5 mb-6">
            <div className="w-5 h-5 bg-black/40 rounded-full flex items-center justify-center flex-shrink-0">
              <Play className="h-2.5 w-2.5 text-white fill-white" />
            </div>
            <span className="text-[10px] font-bold text-black/70 tracking-widest">RADIO</span>
          </div>

          {/* Circular Images (3 overlapping circles) */}
          <div className="flex justify-center items-center gap-0 mb-8 relative h-24">
            {/* First circle */}
            <div className="w-14 h-14 rounded-full overflow-hidden shadow-lg border-3 border-white/40 flex-shrink-0 -mr-3 z-0">
              <img
                src={song.cover}
                alt={song.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            {/* Middle circle (main) */}
            <div className="relative w-24 h-24 rounded-full overflow-hidden shadow-xl border-4 border-white/50 flex-shrink-0 z-10">
              <img
                src={song.cover}
                alt={song.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <button
                onClick={handlePlay}
                className="absolute inset-0 w-full h-full rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/30 hover:bg-black/40"
              >
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                  <Play className="h-5 w-5 text-black fill-black -ml-1 -mt-0.5" />
                </div>
              </button>
            </div>
            {/* Third circle */}
            <div className="w-14 h-14 rounded-full overflow-hidden shadow-lg border-3 border-white/40 flex-shrink-0 -ml-3 z-0">
              <img
                src={song.cover}
                alt={song.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
          </div>

          {/* Title and Artist */}
          <div className="text-center space-y-1.5">
            <h3 className="font-bold text-black text-lg leading-snug">{song.title}</h3>
            <button
              onClick={handleArtistClick}
              className="text-xs text-black/80 hover:text-black transition-colors duration-300 block w-full"
            >
              With {song.artist}
            </button>
            <p className="text-[11px] text-black/60 leading-tight">And more</p>
          </div>
        </div>
      </div>
    );
  }

  // Default song card (original style enhanced)
  return (
    <div 
      className="group bg-gradient-to-b from-surface-hover/50 to-card rounded-xl p-4 hover:bg-gradient-to-b hover:from-surface-hover hover:to-surface-hover transition-all duration-500 cursor-pointer hover:shadow-2xl hover:scale-[1.03] transform border border-border/30 hover:border-orange-500/50"
      style={{
        animation: `slideInUp 700ms ease-out forwards`,
        animationDelay: `${rowIndex * 150}ms`,
      }}
      onClick={() => {
        setSelectedSongDetail(song);
        setCurrentView("song-detail");
      }}
    >
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none" style={{
        boxShadow: "inset 0 0 20px rgba(249, 115, 22, 0.1)",
      }} />

      <div className="relative mb-4 overflow-hidden rounded-lg">
        <div className="relative pt-[100%]">
          <img
            src={song.cover}
            alt={song.title}
            className="absolute inset-0 w-full h-full object-cover shadow-lg transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300" />
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePlay();
          }}
          className="absolute bottom-3 right-3 w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 shadow-xl hover:shadow-2xl hover:scale-110 active:scale-95"
          title="Play song"
        >
          <Play className="h-5 w-5 text-white fill-white ml-1" />
        </button>
      </div>

      <h3 className="font-semibold text-foreground truncate mb-1 transition-colors duration-300 group-hover:text-orange-400">{song.title}</h3>
      <button
        onClick={handleArtistClick}
        className="text-sm text-muted-foreground truncate hover:text-orange-400 transition-colors duration-300"
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
              className="h-8 w-8 transition-all duration-200 hover:scale-110 active:scale-95 hover:bg-orange-500/20 hover:text-orange-400"
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
              <Button variant="ghost" size="icon" className="h-8 w-8 transition-all duration-200 hover:scale-110 active:scale-95 hover:bg-orange-500/20 hover:text-orange-400">
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
                        Number(song.id),
                        Number(currentPlaylistId),
                        Number(playlist.id)
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
            className="h-8 w-8 transition-all duration-200 hover:scale-110 active:scale-95 hover:bg-red-500/20 hover:text-red-400"
            onClick={() => deleteSongFromPlaylist(Number(song.id), Number(currentPlaylistId))}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}