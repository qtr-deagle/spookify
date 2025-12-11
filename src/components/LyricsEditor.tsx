import { useState, useEffect } from "react";
import { Music, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMusic } from "@/context/MusicContext";

export function LyricsEditor() {
  const { songs, user } = useMusic();
  const [selectedSong, setSelectedSong] = useState<any>(null);
  const [lyrics, setLyrics] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Only allow admins
  if (user?.role !== "admin") {
    return (
      <div className="p-8 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400">
        <p>You don't have permission to access this page.</p>
      </div>
    );
  }

  const handleSelectSong = (song: any) => {
    setSelectedSong(song);
    setLyrics(song.lyrics || "");
    setMessage("");
  };

  const handleSaveLyrics = async () => {
    if (!selectedSong || !lyrics.trim()) {
      setMessage("Please enter lyrics");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/updateSongLyrics.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          song_id: selectedSong.id,
          lyrics: lyrics.trim(),
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("✓ Lyrics saved successfully!");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("✗ Error saving lyrics");
      }
    } catch (error) {
      setMessage("✗ Error saving lyrics");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex-1 overflow-y-auto scrollbar-thin p-6 md:p-8 bg-background transition-all duration-300">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Lyrics Editor</h1>
          <p className="text-muted-foreground">Add or update song lyrics</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Songs List */}
          <div className="lg:col-span-1">
            <div className="bg-surface-hover/30 border border-orange-500/20 rounded-xl p-4">
              <h2 className="text-lg font-bold text-white mb-4">Songs</h2>
              <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-thin">
                {songs.map((song) => (
                  <button
                    key={song.id}
                    onClick={() => handleSelectSong(song)}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                      selectedSong?.id === song.id
                        ? "bg-orange-500 text-white"
                        : "bg-surface-hover/50 hover:bg-surface-hover text-white/80 hover:text-white"
                    }`}
                  >
                    <p className="font-semibold text-sm truncate">{song.title}</p>
                    <p className="text-xs opacity-75 truncate">{song.artist}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Lyrics Editor */}
          <div className="lg:col-span-2">
            {selectedSong ? (
              <div className="space-y-4">
                {/* Song Info */}
                <div className="bg-surface-hover/30 border border-orange-500/20 rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <img
                      src={selectedSong.cover}
                      alt={selectedSong.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {selectedSong.title}
                      </h3>
                      <p className="text-muted-foreground">{selectedSong.artist}</p>
                    </div>
                  </div>
                </div>

                {/* Lyrics Textarea */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-white block">
                    Lyrics
                  </label>
                  <textarea
                    value={lyrics}
                    onChange={(e) => setLyrics(e.target.value)}
                    placeholder="Enter song lyrics here..."
                    className="w-full h-96 bg-surface-hover/30 border border-orange-500/20 rounded-lg p-4 text-white placeholder:text-muted-foreground/50 focus:border-orange-500 focus:ring-orange-500/50 resize-none"
                  />
                </div>

                {/* Message */}
                {message && (
                  <div
                    className={`p-3 rounded-lg text-sm font-semibold ${
                      message.includes("✓")
                        ? "bg-green-500/20 border border-green-500/50 text-green-400"
                        : "bg-red-500/20 border border-red-500/50 text-red-400"
                    }`}
                  >
                    {message}
                  </div>
                )}

                {/* Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={handleSaveLyrics}
                    disabled={isLoading}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Save className="h-5 w-5" />
                    {isLoading ? "Saving..." : "Save Lyrics"}
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectedSong(null);
                      setLyrics("");
                      setMessage("");
                    }}
                    variant="ghost"
                    className="text-white hover:bg-surface-hover"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-surface-hover/20 border border-white/10 rounded-xl p-12 text-center">
                <Music className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Select a song from the list to add or edit lyrics
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
