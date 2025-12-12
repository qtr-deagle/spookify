export interface Song {
  id: string;
  title: string;
  artist_id: number;   // resolved via join
  album_id: number;
  artist: string;    // resolved via join
  duration: number; // keep numeric for math
  cover: string;
  url: string;
  genre?: string;
  lyrics?: string;  // Song lyrics
}

export interface Playlist {
  id: number;
  name: string;
  songs: Song[];
  cover?: string;
  song_count?: number;
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: "user" | "admin";
  subscription?: "free" | "premium" | "pro";
  subscriptionDate?: string;
}

export interface Activity {
  id: string;
  type: "add_song" | "remove_song" | "create_playlist" | "delete_playlist";
  message: string;
  timestamp: Date;
  songTitle?: string;
  playlistName?: string;
}