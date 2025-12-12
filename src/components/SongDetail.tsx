import { useState, useMemo } from "react";
import { ArrowLeft, Play, Pause, Plus, MoreVertical, Heart } from "lucide-react";
import { Song } from "@/types/music";
import { useMusic } from "@/context/MusicContext";
import { Button } from "@/components/ui/button";

interface SongDetailProps {
  song: Song;
  onAuthRequired?: () => void;
}

export function SongDetail({ song, onAuthRequired }: SongDetailProps) {
  const { songs, setCurrentSong, setIsPlaying, user, setCurrentView, likedSongs, toggleLikeSong, currentSong, isPlaying } = useMusic();
  const [showLyrics, setShowLyrics] = useState(true);

  // Get all songs by the same artist
  const relatedSongs = useMemo(() => {
    return songs
      .filter((s) => s.artist === song.artist && s.id !== song.id)
      .slice(0, 4);
  }, [songs, song]);

  const isLiked = likedSongs.includes(String(song.id));

  const handlePlay = () => {
    setCurrentSong(song);
    setIsPlaying(true);
  };

  const handleAddToPlaylist = () => {
    if (!user) {
      onAuthRequired?.();
      return;
    }
    // TODO: Open add to playlist modal
  };

  const handleLike = () => {
    toggleLikeSong(String(song.id));
  };

  return (
    <div className="w-full bg-gradient-to-b from-orange-500/10 via-background to-background overflow-y-auto scrollbar-thin">
      {/* Header with Back Button */}
      <div className="sticky top-0 bg-gradient-to-b from-black/50 to-transparent backdrop-blur-sm p-4 z-40">
        <button
          onClick={() => setCurrentView("home")}
          className="p-2 rounded-full hover:bg-white/20 transition-all text-white"
          title="Back"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
      </div>

      <div className="p-6 md:p-12 max-w-6xl mx-auto">
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Album Art */}
          <div className="md:col-span-1">
            <div className="sticky top-24">
              <div className="relative aspect-square rounded-xl overflow-hidden shadow-2xl">
                <img
                  src={song.cover}
                  alt={song.title}
                  className="w-full h-full object-cover"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-50" />
              </div>

              {/* Play Button Overlay */}
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => {
                    if (currentSong?.id === song.id) {
                      // Toggle play/pause if same song
                      setIsPlaying(!isPlaying);
                    } else {
                      // Play new song
                      setCurrentSong(song);
                      setIsPlaying(true);
                    }
                  }}
                  className={`flex-1 rounded-full py-3 font-bold flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl ${
                    currentSong?.id === song.id && isPlaying
                      ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                      : "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                  } text-white`}
                >
                  {currentSong?.id === song.id && isPlaying ? (
                    <>
                      <Pause className="h-5 w-5 fill-current" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-5 w-5 fill-current" />
                      Play
                    </>
                  )}
                </button>
                <button
                  onClick={handleLike}
                  className={`p-3 rounded-full transition-all duration-300 ${
                    isLiked
                      ? "bg-orange-500 text-white"
                      : "bg-surface-hover hover:bg-surface-hover/80 text-white"
                  }`}
                  title="Like song"
                >
                  <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
                </button>
                <button
                  onClick={handleAddToPlaylist}
                  className="p-3 rounded-full bg-surface-hover hover:bg-surface-hover/80 text-white transition-all duration-300"
                  title="Add to playlist"
                >
                  <Plus className="h-5 w-5" />
                </button>
                <button className="p-3 rounded-full bg-surface-hover hover:bg-surface-hover/80 text-white transition-all duration-300">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Song Info */}
          <div className="md:col-span-2">
            {/* Type Badge */}
            <span className="inline-block px-3 py-1 bg-orange-500/20 border border-orange-500/50 rounded-full text-orange-400 text-xs font-bold mb-4">
              Single
            </span>

            {/* Title */}
            <h1 className="text-5xl md:text-6xl font-black text-white mb-4 leading-tight">
              {song.title}
            </h1>

            {/* Artist */}
            <p className="text-xl text-white/80 mb-6">{song.artist}</p>

            {/* Metadata */}
            <div className="space-y-4 text-white/70 text-sm mb-10">
              <p>
                <span className="font-semibold text-white">Release Date:</span> November 14, 2025
              </p>
              <p>
                <span className="font-semibold text-white">Genre:</span> {song.genre || "Music"}
              </p>
              <p>
                <span className="font-semibold text-white">Duration:</span> {song.duration || "3:15"}
              </p>
            </div>

            {/* Description */}
            <div className="mb-12">
              <p className="text-white/80 leading-relaxed">
                Experience the magic of {song.title} by {song.artist}. A captivating musical journey
                that combines heartfelt emotions with modern production.
              </p>
            </div>

            {/* Song Info Sections */}
            <div className="space-y-8">
              {/* Credits */}
              <div>
                <h3 className="text-lg font-bold text-white mb-3">Credits</h3>
                <div className="space-y-2 text-sm text-white/70">
                  <p>
                    <span className="font-semibold text-white">Artist:</span> {song.artist}
                  </p>
                  <p>
                    <span className="font-semibold text-white">Producer:</span> {song.artist}
                  </p>
                </div>
              </div>

              {/* About */}
              <div>
                <h3 className="text-lg font-bold text-white mb-3">About this song</h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  © 2025 Entertainment under exclusive license to Music Platform
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* More by Artist Section */}
        {relatedSongs.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-black text-white">More by {song.artist}</h2>
              <button className="text-orange-400 hover:text-orange-300 text-sm font-bold transition-colors">
                See discography
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedSongs.map((relatedSong) => (
                <div
                  key={relatedSong.id}
                  onClick={() => {
                    setCurrentSong(relatedSong);
                    setIsPlaying(true);
                  }}
                  className="group bg-surface-hover/50 rounded-lg p-4 hover:bg-surface-hover transition-all duration-300 cursor-pointer hover:shadow-xl transform hover:scale-[1.02]"
                >
                  <div className="relative mb-4 overflow-hidden rounded-md">
                    <img
                      src={relatedSong.cover}
                      alt={relatedSong.title}
                      className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <button className="absolute bottom-2 right-2 p-3 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 shadow-lg">
                      <Play className="h-5 w-5 fill-current" />
                    </button>
                  </div>

                  <h3 className="font-bold text-white truncate mb-1">{relatedSong.title}</h3>
                  <p className="text-sm text-white/60 truncate mb-2">{relatedSong.artist}</p>
                  <p className="text-xs text-white/40">2025</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Lyrics Section */}
        {song.lyrics && (
          <section className="mb-16">
            <h2 className="text-3xl font-black text-white mb-6">Lyrics</h2>
            <div className="bg-gradient-to-br from-orange-500/5 via-surface-hover/20 to-surface-hover/10 border border-orange-500/30 rounded-2xl p-8 md:p-12 backdrop-blur-sm">
              <div className="text-white/90 text-lg leading-relaxed whitespace-pre-wrap space-y-3">
                {song.lyrics.split('\n').map((line, index) => {
                  // Check if line contains bracketed section headers like [Chorus], [Verse], etc.
                  const isSectionHeader = /^\s*\[.+\]\s*$/.test(line);
                  
                  if (isSectionHeader) {
                    return (
                      <div
                        key={index}
                        className="text-orange-400 font-bold text-lg tracking-wide my-4 uppercase"
                      >
                        {line}
                      </div>
                    );
                  }
                  
                  // Regular lyrics line
                  return (
                    <div key={index} className="font-medium">
                      {line || '\u200B'}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* No Lyrics Message */}
        {!song.lyrics && (
          <section className="mb-16">
            <h2 className="text-3xl font-black text-white mb-6">Lyrics</h2>
            <div className="bg-gradient-to-br from-surface-hover/20 to-surface-hover/5 border border-white/10 rounded-xl p-12 text-center">
              <p className="text-white/60 text-lg">
                Lyrics for this song are not available yet.
              </p>
            </div>
          </section>
        )}

        {/* Footer Info */}
        <div className="border-t border-white/10 pt-12 text-white/60 text-xs space-y-4">
          <p>© 2025 Entertainment under exclusive license to Music Platform</p>
          <div className="flex gap-6 flex-wrap">
            <a href="#" className="hover:text-white transition-colors">Legal</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
            <a href="#" className="hover:text-white transition-colors">Accessibility</a>
          </div>
        </div>
      </div>
    </div>
  );
}
