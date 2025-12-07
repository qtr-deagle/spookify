import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
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

  addSongToPlaylist: (songId: number, playlistId: string) => void;
  removeSongFromPlaylist: (songId: string, playlistId: string) => void;
  transferSong: (songId: string, fromPlaylistId: string, toPlaylistId: string) => void;
  createPlaylist: (name: string) => void;
  playNext: () => void;
  playPrevious: () => void;
  deletePlaylist: (playlistId: string) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export function MusicProvider({ children }: { children: ReactNode }) {
  const [songs, setSongs] = useState<Song[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [progress, setProgress] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch playlists from PHP API
  useEffect(() => {
    const fetchPlaylists = async () => {
      const res = await fetch(`/api/getPlaylists.php?user_id=${user?.id || 1}`);
      const data = await res.json();
      setPlaylists(data);
    };
    fetchPlaylists();
  }, [user]);

  // Fetch songs when a playlist is selected
  useEffect(() => {
    const fetchSongs = async () => {
      if (!selectedPlaylist) return;
      const res = await fetch(`/api/getSongs.php?playlist_id=${selectedPlaylist.id}`);
      const data = await res.json();
      setSongs(data);
      setSelectedPlaylist((prev) => prev ? { ...prev, songs: data } : prev); // ✅ inject songs
    };
    fetchSongs();
  }, [selectedPlaylist]);

  useEffect(() => {
    if (!selectedPlaylist) {
      const fetchAllSongs = async () => {
        try {
          const res = await fetch("/api/getSongs.php");
          const data = await res.json();
          setSongs(data);
        } catch (err) {
          console.error("Failed to load songs:", err);
        }
      };
      fetchAllSongs();
    }
  }, [selectedPlaylist]);

  useEffect(() => {
    if (!selectedPlaylist) {
      const fetchAllSongs = async () => {
        const res = await fetch("/api/getSongs.php");
        const data = await res.json();
        setSongs(data);
      };
      fetchAllSongs();
    }
  }, [selectedPlaylist]);

  const createPlaylist = async (name: string) => {
    const res = await fetch("/api/createPlaylist.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, user_id: user?.id || 1 }),
    });
    const newPlaylist = await res.json();
    setPlaylists(prev => [...prev, newPlaylist]);
  };

  const deletePlaylist = async (playlistId: string) => {
    await fetch("/api/deletePlaylist.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: playlistId }),
    });

    setPlaylists(prev => prev.filter(p => p.id !== playlistId));
    if (selectedPlaylist?.id === playlistId) {
      setSelectedPlaylist(null);
    }
  };

  // inside MusicProvider
  const transferSong = async (songId: number, fromPlaylistId: number, toPlaylistId: number) => {
    await fetch("/api/transferSong.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ song_id: songId, from_playlist_id: fromPlaylistId, to_playlist_id: toPlaylistId }),
    });

    // Refresh songs for the current playlist
    if (Number(selectedPlaylist?.id) === fromPlaylistId) {
      const res = await fetch(`/api/getSongs.php?playlist_id=${fromPlaylistId}`);
      const data = await res.json();
      setSongs(data);
      setSelectedPlaylist((prev) => prev ? { ...prev, songs: data } : prev);
    }
  };

  const addSongToPlaylist = async (songId: number, playlistId: string) => {
    await fetch("/api/addSongToPlaylist.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ song_id: songId, playlist_id: playlistId }),
    });

    if (selectedPlaylist?.id === playlistId) {
      const res = await fetch(`/api/getSongs.php?playlist_id=${playlistId}`);
      const data = await res.json();
      setSongs(data);
      setSelectedPlaylist((prev) => prev ? { ...prev, songs: data } : prev);
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
        addSongToPlaylist: () => { }, // implement with API
        removeSongFromPlaylist: () => { }, // implement with API
        transferSong: () => { }, // implement with API
        createPlaylist,
        playNext: () => { },
        playPrevious: () => { },
        deletePlaylist,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const context = useContext(MusicContext);
  if (!context) throw new Error("useMusic must be used within a MusicProvider");
  return context;
}