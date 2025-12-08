export interface Song {
  id: string;
  title: string;
  artist_id: number;   // resolved via join
  album_id: number;
  artist: string;    // resolved via join
  duration: number; // keep numeric for math
  cover: string;
  url: string;
}

export interface Playlist {
  id: number;
  name: string;
  songs: Song[];
  cover?: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
}