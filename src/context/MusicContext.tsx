import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import { Song, Playlist, User, Activity } from "@/types/music";

interface MusicContextType {
  songs: Song[];
  playlists: Playlist[];
  currentSong: Song | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  user: User | null;
  selectedPlaylist: Playlist | null;
  searchQuery: string;
  currentView: "home" | "library" | "browse" | "song-detail" | "pricing";
  filterByArtist: string | null;
  filterByGenre: string | null;
  activities: Activity[];
  selectedSongDetail: Song | null;
  likedSongs: string[]; // Array of song IDs
  loopMode: "off" | "all" | "one"; // Loop mode

  setCurrentSong: (song: Song | null) => void;
  setIsPlaying: (playing: boolean) => void;
  setVolume: (volume: number) => void;
  setProgress: (progress: number) => void;
  setUser: (user: User | null) => void;
  setSelectedPlaylist: (playlist: Playlist | null) => void;
  setSearchQuery: (query: string) => void;
  setCurrentView: (view: "home" | "library" | "browse" | "song-detail" | "pricing") => void;
  setFilterByArtist: (artist: string | null) => void;
  setFilterByGenre: (genre: string | null) => void;
  setSelectedSongDetail: (song: Song | null) => void;

  addSongToPlaylist: (songId: number, playlistId: number) => void;
  removeSongFromPlaylist: (songId: number, playlistId: number) => void;
  deleteSongFromPlaylist: (songId: number, playlistId: number) => void;
  transferSong: (songId: number, fromPlaylistId: number, toPlaylistId: number) => void;
  createPlaylist: (name: string) => void;
  playNext: () => void;
  playPrevious: () => void;
  deletePlaylist: (playlistId: string | number) => void;
  seek: (time: number) => void;
  addActivity: (activity: Activity) => void;
  clearActivities: () => void;
  toggleLoopMode: () => void;
  toggleLikeSong: (songId: string) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export function MusicProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [songs, setSongs] = useState<Song[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [progress, setProgress] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentView, setCurrentView] = useState<"home" | "library" | "browse" | "song-detail" | "pricing">("home");
  const [filterByArtist, setFilterByArtist] = useState<string | null>(null);
  const [filterByGenre, setFilterByGenre] = useState<string | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedSongDetail, setSelectedSongDetail] = useState<Song | null>(null);
  const [likedSongs, setLikedSongs] = useState<string[]>([]);
  const [loopMode, setLoopMode] = useState<"off" | "all" | "one">("off");

  // 🎵 Fetch playlists
  useEffect(() => {
    const fetchPlaylists = async () => {
      const res = await fetch(`/api/getPlaylists.php?user_id=${user?.id || 1}`);
      const data = await res.json();
      setPlaylists(data);
    };
    fetchPlaylists();
    
    // Listen for playlist updates
    const handlePlaylistsUpdated = () => {
      fetchPlaylists();
    };
    window.addEventListener('playlistsUpdated', handlePlaylistsUpdated);
    return () => window.removeEventListener('playlistsUpdated', handlePlaylistsUpdated);
  }, [user]);

  // 🎵 Load liked songs from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("likedSongs");
    if (saved) {
      setLikedSongs(JSON.parse(saved));
    }
  }, []);

  // 🎵 Clean up orphaned liked songs (songs that don't exist in the songs list)
  useEffect(() => {
    if (songs.length > 0 && likedSongs.length > 0) {
      const validSongIds = new Set(songs.map((s) => String(s.id)));
      const cleanedLikedSongs = likedSongs.filter((id) => validSongIds.has(id));
      
      // Only update if there were orphaned songs
      if (cleanedLikedSongs.length !== likedSongs.length) {
        setLikedSongs(cleanedLikedSongs);
        localStorage.setItem("likedSongs", JSON.stringify(cleanedLikedSongs));
      }
    }
  }, [songs]);

  // 🎵 Initialize songs on app load (one-time)
  useEffect(() => {
    const initSongs = async () => {
      try {
        console.log("Initializing songs on app load");
        const res = await fetch("/api/getSongs.php");
        if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch songs`);
        const data = await res.json();
        const songData = Array.isArray(data) ? data : [];
        console.log(`Initialized with ${songData.length} songs`);
        setSongs(songData);
      } catch (error) {
        console.error("Error initializing songs:", error);
      }
    };
    
    initSongs();
  }, []); // Only run once on app load

  // 🎵 Fetch songs - handles both global and playlist-specific songs
  useEffect(() => {
    let isMounted = true;
    
    const fetchSongs = async () => {
      try {
        if (selectedPlaylist) {
          console.log(`Fetching songs for playlist ${selectedPlaylist.id}`);
          const res = await fetch(`/api/getSongs.php?playlist_id=${selectedPlaylist.id}`);
          if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch playlist songs`);
          const data = await res.json();
          if (isMounted) {
            const songData = Array.isArray(data) ? data : [];
            console.log(`Got ${songData.length} songs for playlist`);
            setSongs(songData);
            setSelectedPlaylist((prev) => (prev ? { ...prev, songs: songData } : prev));
          }
        } else {
          console.log("Fetching all songs (no playlist selected)");
          const res = await fetch("/api/getSongs.php");
          if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch global songs`);
          const data = await res.json();
          if (isMounted) {
            const songData = Array.isArray(data) ? data : [];
            console.log(`Got ${songData.length} total songs from database`);
            setSongs(songData);
          }
        }
      } catch (error) {
        console.error("Error fetching songs:", error);
        if (isMounted) {
          console.log("Setting songs to empty array due to error");
          setSongs([]);
        }
      }
    };
    
    fetchSongs();
    
    return () => {
      isMounted = false;
    };
  }, [selectedPlaylist]);

  // 🔊 Handle song change
  useEffect(() => {
    if (!audioRef.current || !currentSong) return;
    audioRef.current.src = `/${currentSong.url}`;
    audioRef.current.currentTime = 0;
    setProgress(0);
  }, [currentSong]);

  // 🔊 Handle play/pause separately
  useEffect(() => {
    if (!audioRef.current || !currentSong) return;
    if (isPlaying) {
      audioRef.current.play().catch((err) => console.error("Playback failed:", err));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentSong]);

  // 🔊 Handle volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  // 🔊 Track progress and get duration from audio element
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const updateProgress = () => setProgress(audio.currentTime);
    const updateDuration = () => {
      // Get actual duration from audio file, not database
      if (currentSong && audio.duration && audio.duration !== Infinity) {
        setSongs((prev) =>
          prev.map((s) =>
            s.id === currentSong.id ? { ...s, duration: Math.round(audio.duration) } : s
          )
        );
      }
    };

    const handleSongEnd = () => {
      if (loopMode === "one") {
        // Replay the same song
        audio.currentTime = 0;
        audio.play().catch((err) => console.error("Playback failed:", err));
      } else if (loopMode === "all") {
        // Play next song, or loop back to first
        const idx = songs.findIndex((s) => s.id === currentSong?.id);
        const nextSong = songs[idx + 1] || songs[0];
        if (nextSong) {
          setCurrentSong(nextSong);
          setIsPlaying(true);
        }
      } else {
        // Loop mode is "off" - play next song
        if (!currentSong || songs.length === 0) return;
        const idx = songs.findIndex((s) => s.id === currentSong.id);
        const nextSong = songs[idx + 1];
        if (nextSong) {
          setProgress(0);
          setCurrentSong(nextSong);
          setIsPlaying(true);
        }
      }
    };
    
    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleSongEnd);
    
    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleSongEnd);
    };
  }, [currentSong, loopMode, songs]);

  // 🎵 Seek
  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
    setProgress(time);
  };

  // 🎵 Activities
  const addActivity = (activity: Activity) => {
    setActivities((prev) => [activity, ...prev]);
  };

  const clearActivities = () => {
    setActivities([]);
  };

  // 🎵 Playlist management
  const createPlaylist = async (name: string) => {
    const res = await fetch("/api/createPlaylist.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, user_id: user?.id || 1 }),
    });
    const newPlaylist = await res.json();
    setPlaylists((prev) => [...prev, newPlaylist]);

    // Add activity
    addActivity({
      id: Math.random().toString(36).substr(2, 9),
      type: "create_playlist",
      message: `Created playlist "${name}"`,
      timestamp: new Date(),
      playlistName: name,
    });
  };

  const deletePlaylist = async (playlistId: string | number) => {
    try {
      const playlistIdNum = Number(playlistId);
      const playlist = playlists.find((p) => p.id === playlistIdNum);
      
      const response = await fetch("/api/deletePlaylist.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: playlistIdNum }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setPlaylists((prev) => prev.filter((p) => p.id !== playlistIdNum));
        if (selectedPlaylist?.id === playlistIdNum) {
          setSelectedPlaylist(null);
        }

        // Add activity
        addActivity({
          id: Math.random().toString(36).substr(2, 9),
          type: "delete_playlist",
          message: `Deleted playlist "${playlist?.name || "Unnamed"}"`,
          timestamp: new Date(),
          playlistName: playlist?.name,
        });
        
        // Dispatch custom event to notify other components
        window.dispatchEvent(new CustomEvent('playlistsUpdated'));
      }
    } catch (error) {
      console.error("Error deleting playlist:", error);
      throw error;
    }
  };

  const transferSong = async (
    songId: number,
    fromPlaylistId: number,
    toPlaylistId: number
  ) => {
    await fetch("/api/transferSong.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        song_id: songId,
        from_playlist_id: fromPlaylistId,
        to_playlist_id: toPlaylistId,
      }),
    });

    // Refresh all playlists to update song counts
    const playlistRes = await fetch(`/api/getPlaylists.php?user_id=${user?.id || 1}`);
    const updatedPlaylists = await playlistRes.json();
    setPlaylists(updatedPlaylists);

    // Refresh songs for the current playlist
    if (Number(selectedPlaylist?.id) === fromPlaylistId) {
      const res = await fetch(`/api/getSongs.php?playlist_id=${fromPlaylistId}`);
      const data = await res.json();
      setSongs(data);
      setSelectedPlaylist((prev) => (prev ? { ...prev, songs: data } : prev));
    }
  };

  const addSongToPlaylist = async (songId: number, playlistId: number) => {
    try {
      const response = await fetch("/api/addSongToPlaylist.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ song_id: songId, playlist_id: playlistId }),
      });

      if (!response.ok) {
        throw new Error("Failed to add song to playlist");
      }

      // Refresh all playlists to update song counts
      const res = await fetch(`/api/getPlaylists.php?user_id=${user?.id || 1}`);
      const updatedPlaylists = await res.json();
      
      if (Array.isArray(updatedPlaylists)) {
        setPlaylists(updatedPlaylists);
      }

      // If the playlist we added to is selected, refresh songs
      if (selectedPlaylist?.id === Number(playlistId)) {
        const songRes = await fetch(`/api/getSongs.php?playlist_id=${playlistId}`);
        const data = await songRes.json();
        
        if (Array.isArray(data)) {
          setSongs(data);
          setSelectedPlaylist((prev) => (prev ? { ...prev, songs: data } : prev));
        }
      }

      // Add activity
      const playlist = updatedPlaylists.find((p) => p.id === playlistId);
      const song = songs.find((s) => s.id === String(songId));
      addActivity({
        id: Math.random().toString(36).substr(2, 9),
        type: "add_song",
        message: `Added "${song?.title || "song"}" to ${playlist?.name || "playlist"}`,
        timestamp: new Date(),
        songTitle: song?.title,
        playlistName: playlist?.name,
      });
    } catch (error) {
      console.error("Error adding song to playlist:", error);
    }
  };

  const removeSongFromPlaylist = async (songId: number, playlistId: number) => {
    await fetch("/api/removeSongFromPlaylist.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ song_id: songId, playlist_id: playlistId }),
    });

    // Refresh songs for the playlist being viewed
    if (selectedPlaylist?.id === Number(playlistId)) {
      const res = await fetch(`/api/getSongs.php?playlist_id=${playlistId}`);
      const data = await res.json();
      setSongs(data);
      setSelectedPlaylist((prev) => (prev ? { ...prev, songs: data, song_count: data.length } : prev));
    }

    // Always update the playlist count in the playlists list
    setPlaylists((prev) =>
      prev.map((p) =>
        p.id === Number(playlistId) ? { ...p, song_count: (p.song_count || 1) - 1 } : p
      )
    );
  };

  const deleteSongFromPlaylist = async (songId: number, playlistId: number) => {
    const song = songs.find((s) => s.id === String(songId));
    const playlist = playlists.find((p) => p.id === playlistId);
    
    await removeSongFromPlaylist(songId, playlistId);
    
    // Add activity
    addActivity({
      id: Math.random().toString(36).substr(2, 9),
      type: "remove_song",
      message: `Removed "${song?.title || "song"}" from ${playlist?.name || "playlist"}`,
      timestamp: new Date(),
      songTitle: song?.title,
      playlistName: playlist?.name,
    });
  };

  // 🎵 Next/Previous (basic stubs)
  const playNext = () => {
    if (!currentSong || songs.length === 0) return;
    const idx = songs.findIndex((s) => s.id === currentSong.id);
    const nextSong = songs[idx + 1];
    if (nextSong) {
      setProgress(0); // Reset progress when skipping
      setCurrentSong(nextSong);
      setIsPlaying(true);
    }
  };

  const playPrevious = () => {
    if (!currentSong || songs.length === 0) return;
    const idx = songs.findIndex((s) => s.id === currentSong.id);
    const prevSong = songs[idx - 1];
    if (prevSong) {
      setProgress(0); // Reset progress when skipping
      setCurrentSong(prevSong);
      setIsPlaying(true);
    }
  };

  // 🎵 Toggle liked songs
  const toggleLikeSong = (songId: string) => {
    setLikedSongs((prev) => {
      const updated = prev.includes(songId)
        ? prev.filter((id) => id !== songId)
        : [...prev, songId];
      localStorage.setItem("likedSongs", JSON.stringify(updated));
      return updated;
    });
  };

  // 🎵 Toggle loop mode
  const toggleLoopMode = () => {
    setLoopMode((prev) => {
      const modes: Array<"off" | "all" | "one"> = ["off", "all", "one"];
      const currentIndex = modes.indexOf(prev);
      return modes[(currentIndex + 1) % modes.length];
    });
  };

  return (
    <MusicContext.Provider
      value={{
        songs,
        playlists,
        currentSong,
        isPlaying,
        volume,
        progress,
        user,
        selectedPlaylist,
        searchQuery,
        currentView,
        filterByArtist,
        filterByGenre,
        activities,
        selectedSongDetail,
        likedSongs,
        loopMode,
        setCurrentSong,
        setIsPlaying,
        setVolume,
        setProgress,
        setUser,
        setSelectedPlaylist,
        setSearchQuery,
        setCurrentView,
        setFilterByArtist,
        setFilterByGenre,
        setSelectedSongDetail,
        addSongToPlaylist,
        removeSongFromPlaylist,
        deleteSongFromPlaylist,
        transferSong,
        createPlaylist,
        playNext,
        playPrevious,
        deletePlaylist,
        seek,
        addActivity,
        clearActivities,
        toggleLikeSong,
        toggleLoopMode,
      }}
    >
      {children}
      <audio ref={audioRef} />
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const context = useContext(MusicContext);
  if (!context) throw new Error("useMusic must be used within a MusicProvider");
  return context;
}