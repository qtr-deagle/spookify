import { useState, useEffect } from "react";
import { ChevronRight, Music, ArrowLeft, Zap, Flame, Sparkles, Music2, Radio, TrendingUp } from "lucide-react";
import { Song } from "@/types/music";
import { useMusic } from "@/context/MusicContext";
import { SongCard } from "./SongCard";
import { Button } from "@/components/ui/button";

interface GenreWithSongs {
  name: string;
  color: string;
  songs: Song[];
  description: string;
}

interface MoodCategory {
  name: string;
  emoji: string;
  icon: React.ReactNode;
  description: string;
  color: string;
  genres: string[];
}

const MOOD_CATEGORIES: MoodCategory[] = [
  {
    name: "Workout",
    emoji: "💪",
    icon: <Flame className="h-5 w-5" />,
    description: "High-energy tracks to push you",
    color: "from-red-500 to-orange-500",
    genres: ["EDM", "Hiphop", "Dance/Disco"],
  },
  {
    name: "Chill",
    emoji: "😎",
    icon: <Sparkles className="h-5 w-5" />,
    description: "Relax and unwind",
    color: "from-blue-500 to-purple-500",
    genres: ["Soul", "Indie", "Folk/Acoustic"],
  },
  {
    name: "Focus",
    emoji: "🎯",
    icon: <Music2 className="h-5 w-5" />,
    description: "Concentrate in style",
    color: "from-amber-500 to-orange-500",
    genres: ["Electronic", "Indie", "Alt-Pop"],
  },
  {
    name: "Party",
    emoji: "🎉",
    icon: <Radio className="h-5 w-5" />,
    description: "Dance all night long",
    color: "from-pink-500 to-red-500",
    genres: ["Dance/Disco", "EDM", "Kpop"],
  },
  {
    name: "Romance",
    emoji: "💕",
    icon: <Sparkles className="h-5 w-5" />,
    description: "Love in the air",
    color: "from-rose-500 to-pink-500",
    genres: ["Love", "Soul/R&B", "Pop"],
  },
  {
    name: "Discover",
    emoji: "🔮",
    icon: <Zap className="h-5 w-5" />,
    description: "Find your next favorite",
    color: "from-purple-500 to-indigo-500",
    genres: ["OPM", "Kpop", "Country"],
  },
];

const GENRE_DESCRIPTIONS: Record<string, string> = {
  Trending: "Discover what's hot right now",
  "Dance/Disco": "Get your groove on with infectious beats",
  "Alt-Pop": "Modern pop with an alternative twist",
  EDM: "Electronic dance music energy",
  "Indie/Alt": "Independent and alternative sounds",
  Country: "Country vibes and storytelling",
  "Country/Folk": "Folk-inspired country classics",
  "Soul/R&B": "Smooth soul and R&B tracks",
  "Folk/Acoustic": "Acoustic folk masterpieces",
  "R&B": "Rhythm and blues excellence",
  Pop: "Popular pop hits",
  OPM: "Original Pilipinas Music",
  Kpop: "Korean pop sensation",
  Hiphop: "Hip-hop and rap beats",
  Love: "Love songs and romance",
  Rock: "Rock and roll energy",
  Soul: "Pure soul music",
  Electronic: "Electronic music productions",
  Metal: "Heavy metal intensity",
  Indie: "Independent music scenes",
};

const GENRE_COLORS: Record<string, string> = {
  Trending: "from-yellow-500 via-orange-400 to-black",
  "Dance/Disco": "from-yellow-500 via-orange-400 to-black",
  "Alt-Pop": "from-pink-400 to-red-600",
  EDM: "from-blue-600 to-purple-900",
  "Indie/Alt": "from-purple-500 to-pink-500",
  Country: "from-orange-600 to-yellow-600",
  "Country/Folk": "from-orange-600 to-yellow-600",
  "Soul/R&B": "from-blue-400 to-purple-600",
  "Folk/Acoustic": "from-green-600 to-yellow-600",
  "R&B": "from-blue-600 to-purple-900",
  Pop: "from-pink-400 to-red-600",
  OPM: "from-orange-400 to-red-600",
  Kpop: "from-pink-400 to-purple-600",
  Hiphop: "from-green-400 to-cyan-500",
  Love: "from-red-400 via-pink-400 to-red-700",
  Rock: "from-orange-500 to-yellow-600",
  Soul: "from-blue-400 to-cyan-500",
  Electronic: "from-cyan-400 to-teal-600",
  Metal: "from-purple-600 to-purple-900",
  Indie: "from-gray-600 to-gray-900",
};

export function Explore({ onAuthRequired }: { onAuthRequired?: () => void }) {
  const { searchQuery, setFilterByGenre, setCurrentView } = useMusic();
  const [genres, setGenres] = useState<GenreWithSongs[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        // Fetch all songs to get unique genres
        const songsRes = await fetch("/api/getSongs.php");
        const allSongs: Song[] = await songsRes.json();

        // Group songs by genre
        const genreMap = new Map<string, Song[]>();

        allSongs.forEach((song) => {
          const genre = song.genre || "Trending";
          if (!genreMap.has(genre)) {
            genreMap.set(genre, []);
          }
          genreMap.get(genre)!.push(song);
        });

        // Convert to array and add Trending first
        const genresArray: GenreWithSongs[] = [];

        // Add Trending first (top 5 most popular songs)
        genresArray.push({
          name: "Trending",
          color: GENRE_COLORS["Trending"],
          songs: allSongs.slice(0, 5),
          description: GENRE_DESCRIPTIONS["Trending"],
        });

        // Add other genres
        genreMap.forEach((songs, genre) => {
          if (genre !== "Trending") {
            genresArray.push({
              name: genre,
              color: GENRE_COLORS[genre] || "from-gray-600 to-gray-900",
              songs: songs.slice(0, 10),
              description: GENRE_DESCRIPTIONS[genre] || "Explore this genre",
            });
          }
        });

        setGenres(genresArray);
      } catch (error) {
        console.error("Error fetching genres:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

  if (loading) {
    return (
      <main className="flex-1 overflow-y-auto scrollbar-thin p-8 bg-background">
        <div className="animate-pulse space-y-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-4">
              <div className="h-8 w-40 bg-surface-hover rounded" />
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {[...Array(6)].map((_, j) => (
                  <div key={j} className="aspect-square bg-surface-hover rounded-lg" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    );
  }

  if (genres.length === 0) {
    return (
      <main className="flex-1 overflow-y-auto scrollbar-thin p-8 bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-muted-foreground">
          <Music className="h-16 w-16 opacity-50" />
          <p className="text-lg">No genres available yet</p>
        </div>
      </main>
    );
  }

  // If a mood is selected, show songs from that mood's genres
  if (selectedMood) {
    const mood = MOOD_CATEGORIES.find((m) => m.name === selectedMood);
    if (!mood) return null;

    const moodSongs = genres
      .filter((g) => mood.genres.includes(g.name))
      .flatMap((g) => g.songs)
      .slice(0, 20);

    return (
      <main className="flex-1 overflow-y-auto scrollbar-thin p-6 md:p-8 bg-background transition-all duration-300">
        <button
          onClick={() => setSelectedMood(null)}
          className="flex items-center gap-2 p-2 hover:bg-surface-hover rounded-lg transition-all duration-200 text-muted-foreground hover:text-foreground mb-6"
          title="Go back"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="text-sm font-medium">Go Back</span>
        </button>

        <div className="mb-8 animate-in fade-in slide-in-from-top">
          <div className="flex items-center gap-3 mb-2">
            <div className={`text-3xl`}>{mood.emoji}</div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">{mood.name}</h1>
          </div>
          <p className="text-muted-foreground">{mood.description}</p>
        </div>

        {moodSongs.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 animate-in fade-in">
            {moodSongs.map((song, index) => {
              const rowIndex = Math.floor(index / 5);
              return (
                <SongCard
                  key={song.id}
                  song={song}
                  rowIndex={rowIndex}
                  onAuthRequired={onAuthRequired}
                />
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Music className="h-16 w-16 mb-4 opacity-50" />
            <p className="text-lg">No songs found</p>
          </div>
        )}
      </main>
    );
  }

  // If a genre is selected, show filtered songs for that genre
  if (selectedGenre) {
    const genreData = genres.find((g) => g.name === selectedGenre);
    if (!genreData) return null;

    const filteredSongs = genreData.songs.filter((song) => {
      const query = searchQuery.toLowerCase();
      return [song.title, song.artist]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(query));
    });

    return (
      <main className="flex-1 overflow-y-auto scrollbar-thin p-6 md:p-8 bg-background transition-all duration-300">
        <button
          onClick={() => setSelectedGenre(null)}
          className="flex items-center gap-2 p-2 hover:bg-surface-hover rounded-lg transition-all duration-200 text-muted-foreground hover:text-foreground mb-6"
          title="Go back"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="text-sm font-medium">Go Back</span>
        </button>

        <div className="mb-8 animate-in fade-in slide-in-from-top">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{selectedGenre}</h1>
          <p className="text-muted-foreground">{genreData.description}</p>
        </div>

        {filteredSongs.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 animate-in fade-in">
            {filteredSongs.map((song, index) => {
              const rowIndex = Math.floor(index / 5);
              return (
                <SongCard
                  key={song.id}
                  song={song}
                  rowIndex={rowIndex}
                  onAuthRequired={onAuthRequired}
                />
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Music className="h-16 w-16 mb-4 opacity-50" />
            <p className="text-lg">No songs found</p>
          </div>
        )}
      </main>
    );
  }

  // Show mood categories and genre grid
  return (
    <main className="flex-1 overflow-y-auto scrollbar-thin p-6 md:p-8 bg-background">
      {/* Header */}
      <div className="mb-10 animate-in fade-in slide-in-from-top">
        <h1 className="text-4xl font-bold text-white mb-2">Explore</h1>
        <p className="text-muted-foreground">Discover music for every mood and moment</p>
      </div>

      {/* Mood Categories Section */}
      <section className="mb-14">
        <h2 className="text-2xl font-bold text-white mb-6">Browse by Mood</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {MOOD_CATEGORIES.map((mood) => (
            <button
              key={mood.name}
              onClick={() => setSelectedMood(mood.name)}
              className={`group relative bg-gradient-to-br ${mood.color} rounded-lg p-4 h-32 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 transform`}
            >
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all duration-300" />

              {/* Content */}
              <div className="relative h-full flex flex-col justify-between z-10">
                <div className="text-3xl">{mood.emoji}</div>
                <div className="text-left">
                  <h3 className="text-white font-bold text-lg">{mood.name}</h3>
                  <p className="text-white/80 text-xs mt-1">{mood.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Trending Artists Section */}
      {genres.length > 0 && (
        <section className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Trending Now</h2>
              <p className="text-muted-foreground text-sm">What's popular this week</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {genres[0]?.songs.map((song, index) => (
              <SongCard
                key={song.id}
                song={song}
                rowIndex={index}
                onAuthRequired={onAuthRequired}
              />
            ))}
          </div>
        </section>
      )}

      {/* Genre Grid */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Browse Genres</h2>
            <p className="text-muted-foreground text-sm">Find your favorite sounds</p>
          </div>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
          {genres.map((genre) => (
            <GenreCard
              key={genre.name}
              genre={genre}
              onAuthRequired={onAuthRequired}
              onSelectGenre={() => setSelectedGenre(genre.name)}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

interface GenreCardProps {
  genre: GenreWithSongs;
  onAuthRequired?: () => void;
  onSelectGenre: () => void;
}

function GenreCard({ genre, onSelectGenre }: GenreCardProps) {
  const featuredSong = genre.songs[0];

  return (
    <button
      onClick={onSelectGenre}
      className={`group relative aspect-square rounded-lg p-4 bg-gradient-to-br ${genre.color} overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 transform`}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-between p-4 z-10">
        <div>
          <h3 className="text-lg font-bold text-white text-left">{genre.name}</h3>
        </div>

        {/* Song count and preview */}
        {featuredSong && (
          <div className="text-left">
            <p className="text-white/90 text-xs font-semibold line-clamp-1">{featuredSong.title}</p>
            <p className="text-white/70 text-xs">{genre.songs.length} songs</p>
          </div>
        )}
      </div>
    </button>
  );
}
