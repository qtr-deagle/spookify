import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Heart, Music } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useMusic } from "@/context/MusicContext";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";

export function PlayerBar() {
  const {
    currentSong,
    isPlaying,
    setIsPlaying,
    volume,
    setVolume,
    progress,
    setProgress,
    playNext,
    playPrevious,
    seek,
    setCurrentView,
    setFilterByArtist,
    setSelectedSongDetail,
    setCurrentView: setView,
  } = useMusic();
  const [isLiked, setIsLiked] = useState(false);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Update duration when audio loads
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    return () => audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
  }, []);

  // Update duration when song changes
  useEffect(() => {
    if (audioRef.current && currentSong) {
      audioRef.current.src = currentSong.url;
      audioRef.current.load();
    }
  }, [currentSong]);

  function formatTime(seconds: number) {
    if (!isFinite(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  const handleSongClick = () => {
    if (currentSong) {
      setSelectedSongDetail(currentSong);
      setView("song-detail");
    }
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black via-zinc-950 to-zinc-900/80 backdrop-blur-md border-t border-orange-500/30 px-3 md:px-6 py-2 md:py-3 z-40">
      {/* Hidden audio element for duration tracking */}
      <audio ref={audioRef} crossOrigin="anonymous" />

      {/* Main Player Container */}
      <div className="flex flex-col gap-2 md:gap-3 max-w-full">
        {/* Progress Bar (Full Width) */}
        <div className="w-full flex items-center gap-2 group">
          <span className="text-xs text-muted-foreground/70 w-10 text-right tabular-nums group-hover:text-muted-foreground transition-colors">
            {formatTime(progress)}
          </span>
          <Slider
            value={[progress]}
            max={duration || 0}
            step={0.1}
            onValueChange={([val]) => seek(val)}
            className="flex-1"
            disabled={!currentSong}
          />
          <span className="text-xs text-muted-foreground/70 w-10 tabular-nums group-hover:text-muted-foreground transition-colors">
            {formatTime(duration)}
          </span>
        </div>

        {/* Main Control Row */}
        <div className="flex items-center justify-between gap-2 md:gap-4">
          {/* Song Info - Left */}
          <div 
            onClick={handleSongClick}
            className="flex items-center gap-2 md:gap-3 min-w-0 flex-shrink-0 md:flex-1 cursor-pointer group"
          >
            {currentSong ? (
              <>
                <div className="relative flex-shrink-0 overflow-hidden rounded-md shadow-md group-hover:shadow-lg transition-all duration-300">
                  <img
                    src={currentSong.cover}
                    alt={currentSong.title}
                    className="w-12 h-12 md:w-14 md:h-14 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Play className="h-4 w-4 text-white fill-white" />
                  </div>
                </div>

                <div className="flex-1 min-w-0 hidden sm:block">
                  <p className="text-xs md:text-sm font-bold text-white truncate group-hover:text-orange-400 transition-colors duration-200">
                    {currentSong.title}
                  </p>
                  <p className="text-xs text-muted-foreground/80 truncate group-hover:text-orange-300 transition-colors duration-200">
                    {currentSong.artist}
                  </p>
                </div>
              </>
            ) : (
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-md bg-surface-hover/50 flex items-center justify-center flex-shrink-0">
                <Music className="h-5 w-5 text-muted-foreground/50" />
              </div>
            )}
          </div>

          {/* Player Controls - Center */}
          <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
            {/* Like Button */}
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 md:h-8 md:w-8 text-muted-foreground hover:text-orange-400 transition-all duration-200 hover:scale-110 active:scale-95"
              onClick={() => setIsLiked(!isLiked)}
              disabled={!currentSong}
              title="Like song"
            >
              <Heart className={`h-4 w-4 md:h-5 md:w-5 ${isLiked ? "fill-orange-400 text-orange-400" : ""}`} />
            </Button>

            {/* Previous Button */}
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 md:h-8 md:w-8 text-muted-foreground hover:text-white transition-all duration-200 hover:scale-110 active:scale-95"
              onClick={playPrevious}
              disabled={!currentSong}
              title="Previous"
            >
              <SkipBack className="h-4 w-4 md:h-5 md:w-5" />
            </Button>

            {/* Play/Pause Button */}
            <Button
              size="icon"
              className="h-9 w-9 md:h-10 md:w-10 rounded-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 hover:from-orange-600 hover:via-amber-600 hover:to-orange-600 text-white shadow-lg hover:shadow-2xl transition-all duration-200 hover:scale-110 active:scale-95"
              onClick={() => setIsPlaying(!isPlaying)}
              disabled={!currentSong}
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4 md:h-5 md:w-5 fill-current" />
              ) : (
                <Play className="h-4 w-4 md:h-5 md:w-5 fill-current ml-0.5" />
              )}
            </Button>

            {/* Next Button */}
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 md:h-8 md:w-8 text-muted-foreground hover:text-white transition-all duration-200 hover:scale-110 active:scale-95"
              onClick={playNext}
              disabled={!currentSong}
              title="Next"
            >
              <SkipForward className="h-4 w-4 md:h-5 md:w-5" />
            </Button>
          </div>

          {/* Volume Control - Right */}
          <div className="flex items-center gap-1 md:gap-2 min-w-0 flex-shrink-0 md:flex-1 justify-end">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 md:h-8 md:w-8 text-muted-foreground hover:text-orange-400 transition-all duration-200 hover:scale-110 active:scale-95"
              onClick={() => setVolume(volume === 0 ? 70 : 0)}
              title={volume === 0 ? "Unmute" : "Mute"}
            >
              {volume === 0 ? (
                <VolumeX className="h-4 w-4 md:h-5 md:w-5" />
              ) : (
                <Volume2 className="h-4 w-4 md:h-5 md:w-5" />
              )}
            </Button>
            <div className="hidden sm:flex items-center gap-1 md:gap-2 w-20 md:w-24">
              <Slider
                value={[volume]}
                max={100}
                step={1}
                onValueChange={([val]) => setVolume(val)}
                className="flex-1"
              />
              <span className="text-xs text-muted-foreground/70 w-5 text-right tabular-nums">
                {volume}
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
