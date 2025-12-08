import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import { Song, Playlist, User } from "@/types/music";

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

  setCurrentSong: (song: Song | null) => void;
  setIsPlaying: (playing: boolean) => void;
  setVolume: (volume: number) => void;
  setProgress: (progress: number) => void;
  setUser: (user: User | null) => void;
  setSelectedPlaylist: (playlist: Playlist | null) => void;
  setSearchQuery: (query: string) => void;

  addSongToPlaylist: (songId: number, playlistId: number) => void;
  removeSongFromPlaylist: (songId: number, playlistId: number) => void;
  transferSong: (songId: number, fromPlaylistId: number, toPlaylistId: number) => void;
  createPlaylist: (name: string) => void;
  playNext: () => void;
  playPrevious: () => void;
  deletePlaylist: (playlistId: string) => void;
  seek: (time: number) => void;
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

  // 🎵 Fetch playlists
  useEffect(() => {
    const fetchPlaylists = async () => {
      const res = await fetch(`/api/getPlaylists.php?user_id=${user?.id || 1}`);
      const data = await res.json();
      setPlaylists(data);
    };
    fetchPlaylists();
  }, [user]);

  // 🎵 Fetch songs when playlist changes
  useEffect(() => {
    const fetchSongs = async () => {
      if (selectedPlaylist) {
        const res = await fetch(`/api/getSongs.php?playlist_id=${selectedPlaylist.id}`);
        const data = await res.json();
        setSongs(data);
        setSelectedPlaylist((prev) => (prev ? { ...prev, songs: data } : prev));
      } else {
        const res = await fetch("/api/getSongs.php");
        const data = await res.json();
        setSongs(data);
      }
    };
    fetchSongs();
  }, [selectedPlaylist]);

  // 🔊 Handle play/pause
  useEffect(() => {
    if (!audioRef.current || !currentSong) return;
    audioRef.current.src = `/${currentSong.url}`;
    if (isPlaying) {
      audioRef.current.play().catch((err) => console.error("Playback failed:", err));
    } else {
      audioRef.current.pause();
    }
  }, [currentSong, isPlaying]);

  // 🔊 Handle volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  // 🔊 Track progress
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const updateProgress = () => setProgress(audio.currentTime);
    audio.addEventListener("timeupdate", updateProgress);
    return () => audio.removeEventListener("timeupdate", updateProgress);
  }, []);

  // 🎵 Seek
  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setProgress(time);
    }
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
  };

  const deletePlaylist = async (playlistId: string) => {
    await fetch("/api/deletePlaylist.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: playlistId }),
    });
    setPlaylists((prev) => prev.filter((p) => p.id !== Number(playlistId)));
    if (selectedPlaylist?.id === Number(playlistId)) {
      setSelectedPlaylist(null);
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

    // Refresh songs for the current playlist
    if (Number(selectedPlaylist?.id) === fromPlaylistId) {
      const res = await fetch(`/api/getSongs.php?playlist_id=${fromPlaylistId}`);
      const data = await res.json();
      setSongs(data);
      setSelectedPlaylist((prev) => (prev ? { ...prev, songs: data } : prev));
    }
  };

  const addSongToPlaylist = async (songId: number, playlistId: number) => {
    await fetch("/api/addSongToPlaylist.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ song_id: songId, playlist_id: playlistId }),
    });

    if (selectedPlaylist?.id === Number(playlistId)) {
      const res = await fetch(`/api/getSongs.php?playlist_id=${playlistId}`);
      const data = await res.json();
      setSongs(data);
      setSelectedPlaylist((prev) => (prev ? { ...prev, songs: data } : prev));
    }
  };

  const removeSongFromPlaylist = async (songId: number, playlistId: number) => {
    await fetch("/api/removeSongFromPlaylist.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ song_id: songId, playlist_id: playlistId }),
    });

    if (selectedPlaylist?.id === Number(playlistId)) {
      const res = await fetch(`/api/getSongs.php?playlist_id=${playlistId}`);
      const data = await res.json();
      setSongs(data);
      setSelectedPlaylist((prev) => (prev ? { ...prev, songs: data } : prev));
    }
  };

  // 🎵 Next/Previous (basic stubs)
  const playNext = () => {
    if (!currentSong || songs.length === 0) return;
    const idx = songs.findIndex((s) => s.id === currentSong.id);
    const nextSong = songs[idx + 1];
    if (nextSong) {
      setCurrentSong(nextSong);
      setIsPlaying(true);
    }
  };

  const playPrevious = () => {
    if (!currentSong || songs.length === 0) return;
    const idx = songs.findIndex((s) => s.id === currentSong.id);
    const prevSong = songs[idx - 1];
    if (prevSong) {
      setCurrentSong(prevSong);
      setIsPlaying(true);
    }
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
        setCurrentSong,
        setIsPlaying,
        setVolume,
        setProgress,
        setUser,
        setSelectedPlaylist,
        setSearchQuery,
        addSongToPlaylist,
        removeSongFromPlaylist,
        transferSong,
        createPlaylist,
        playNext,
        playPrevious,
        deletePlaylist,
        seek,
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