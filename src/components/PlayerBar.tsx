import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useMusic } from "@/context/MusicContext";
import { Button } from "@/components/ui/button";

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
  } = useMusic();

  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  return (
    <footer className="h-24 bg-player-bg border-t border-border flex items-center justify-between px-6">
      {/* Song Info - Left */}
      <div className="flex items-center gap-4 min-w-[240px]">
        {currentSong ? (
          <>
            <img
              src={currentSong.cover}
              className="w-14 h-14 rounded object-cover"
            />
            <div>
              <p className="font-medium text-foreground truncate">{currentSong.title}</p>
              <p
                className="text-sm text-muted-foreground truncate hover:text-foreground cursor-pointer transition-colors duration-200"
                onClick={() => {
                  setCurrentView("browse");
                  setFilterByArtist(currentSong.artist);
                }}
              >
                {currentSong.artist}
              </p>
            </div>
          </>
        ) : (
          <div className="w-14 h-14 rounded bg-card flex items-center justify-center">
            <span className="text-muted-foreground text-xs">No song</span>
          </div>
        )}
      </div>

      {/* Player Controls - Center */}
      <div className="flex flex-col items-center gap-2 max-w-2xl flex-1 mr-28">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
            onClick={playPrevious}
            disabled={!currentSong}
          >
            <SkipBack className="h-5 w-5" />
          </Button>

          <Button
            size="icon"
            className="w-10 h-10 rounded-full bg-foreground hover:bg-foreground/90 text-background"
            onClick={() => setIsPlaying(!isPlaying)}
            disabled={!currentSong}
          >
            {isPlaying ? (
              <Pause className="h-5 w-5 fill-current" />
            ) : (
              <Play className="h-5 w-5 fill-current ml-0.5" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
            onClick={playNext}
            disabled={!currentSong}
          >
            <SkipForward className="h-5 w-5" />
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="w-full flex items-center gap-3">
          <span className="text-xs text-muted-foreground w-10 text-right">
            {formatTime(progress)}
          </span>
          <Slider
            value={[progress]}
            max={currentSong?.duration || 0}
            step={0.1}
            onValueChange={([val]) => seek(val)}
            className="flex-1"
            disabled={!currentSong}
          />
          <span className="text-xs text-muted-foreground w-10">
            {formatTime(currentSong?.duration || 0)}
          </span>
        </div>
      </div>

      {/* Volume Control - Right */}
      <div className="flex items-center gap-3 min-w-[160px] justify-end">
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground"
          onClick={() => setVolume(volume === 0 ? 70 : 0)}
        >
          {volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </Button>
        <Slider
          value={[volume]}
          max={100}
          step={1}
          onValueChange={([val]) => setVolume(val)}
          className="w-24"
        />
      </div>
    </footer>
  );
}
