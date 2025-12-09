import { useState, useMemo } from "react";
import { Music, ArrowLeft } from "lucide-react";
import { Song, Playlist } from "@/types/music";
import { useMusic } from "@/context/MusicContext";
import { useNavigation } from "@/context/NavigationContext";
import { SongCard } from "./SongCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type LibraryTab = "all" | "playlists" | "albums" | "artists";

interface LibraryArtist {
  name: string;
  songCount: number;
  cover?: string;
}

interface LibraryAlbum {
  id: number;
  name: string;
  songs: Song[];
  cover?: string;
}

export function Library({ onAuthRequired }: { onAuthRequired?: () => void }) {
  const { songs, playlists, user, setCurrentView, searchQuery, setSelectedPlaylist } = useMusic();
  const { canGoBack, goBack } = useNavigation();
  const [activeTab, setActiveTab] = useState<LibraryTab>("all");
  const [selectedArtist, setSelectedArtist] = useState<string | null>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<number | null>(null);

  // Derive albums and artists from songs data
  const libraryData = useMemo(() => {
    // Group songs by album
    const albumMap = new Map<number, Song[]>();
    songs.forEach((song) => {
      if (!albumMap.has(song.album_id)) {
        albumMap.set(song.album_id, []);
      }
      albumMap.get(song.album_id)!.push(song);
    });

    const albums: LibraryAlbum[] = Array.from(albumMap.entries()).map(([albumId, albumSongs]) => ({
      id: albumId,
      name: `Album ${albumId}`, // Album names could be stored separately if available
      songs: albumSongs,
      cover: albumSongs[0]?.cover,
    }));

    // Group songs by artist
    const artistMap = new Map<string, Song[]>();
    songs.forEach((song) => {
      if (!artistMap.has(song.artist)) {
        artistMap.set(song.artist, []);
      }
      artistMap.get(song.artist)!.push(song);
    });

    const artists: LibraryArtist[] = Array.from(artistMap.entries())
      .map(([artistName, artistSongs]) => ({
        name: artistName,
        songCount: artistSongs.length,
        cover: artistSongs[0]?.cover,
      }))
      .sort((a, b) => b.songCount - a.songCount);

    return { albums, artists };
  }, [songs]);

  // Filter items based on search query
  const filteredSongs = useMemo(
    () =>
      songs.filter((song) => {
        const query = searchQuery.toLowerCase();
        return [song.title, song.artist].filter(Boolean).some((field) => field.toLowerCase().includes(query));
      }),
    [songs, searchQuery]
  );

  const filteredAlbums = useMemo(
    () =>
      libraryData.albums.filter((album) => {
        const query = searchQuery.toLowerCase();
        return album.songs.some(
          (song) =>
            song.title.toLowerCase().includes(query) ||
            song.artist.toLowerCase().includes(query)
        );
      }),
    [libraryData.albums, searchQuery]
  );

  const filteredArtists = useMemo(
    () =>
      libraryData.artists.filter((artist) => {
        const query = searchQuery.toLowerCase();
        return artist.name.toLowerCase().includes(query);
      }),
    [libraryData.artists, searchQuery]
  );

  const filteredPlaylists = useMemo(
    () =>
      playlists.filter((playlist) => {
        const query = searchQuery.toLowerCase();
        return playlist.name.toLowerCase().includes(query);
      }),
    [playlists, searchQuery]
  );

  return (
    <main className="flex-1 overflow-y-auto scrollbar-thin p-6 bg-background transition-all duration-300">
      {/* Back Button */}

      {/* Header */}
      <div className="mb-8 animate-in fade-in slide-in-from-top">
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-foreground">
            {selectedArtist ? `Songs by ${selectedArtist}` : selectedAlbum ? `${libraryData.albums.find((a) => a.id === selectedAlbum)?.name}` : "Library"}
          </h1>
        </div>
        <p className="text-muted-foreground">
          {selectedArtist
            ? `Showing all songs by ${selectedArtist}`
            : selectedAlbum
              ? `${libraryData.albums.find((a) => a.id === selectedAlbum)?.songs.length} songs in this album`
              : activeTab === "all" && "Browse all your content"
          }
          {!selectedArtist && !selectedAlbum && activeTab === "playlists" && `${filteredPlaylists.length} playlists`}
          {!selectedArtist && !selectedAlbum && activeTab === "albums" && `${filteredAlbums.length} albums`}
          {!selectedArtist && !selectedAlbum && activeTab === "artists" && `${filteredArtists.length} artists`}
        </p>
      </div>
      {(canGoBack || selectedArtist || selectedAlbum) && (
        <button
          onClick={() => {
            if (selectedArtist) {
              setSelectedArtist(null);
            } else if (selectedAlbum) {
              setSelectedAlbum(null);
            } else {
              setSelectedPlaylist(null);
              goBack();
            }
          }}
          className="flex items-center gap-2 mb-6 text-muted-foreground hover:text-foreground transition-colors"
          title="Go back"
        >
          <ArrowLeft className="h-4 w-4" />
          {selectedArtist ? "Back to Artists" : selectedAlbum ? "Back to Albums" : "Back"}
        </button>
      )}
      {/* Artist View - Show songs from selected artist */}
      {selectedArtist && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {songs
            .filter((song) => song.artist === selectedArtist)
            .map((song, index) => {
              const rowIndex = Math.floor(index / 5);
              return (
                <SongCard key={song.id} song={song} rowIndex={rowIndex} onAuthRequired={onAuthRequired} />
              );
            })}
        </div>
      )}

      {/* Album View - Show songs from selected album */}
      {selectedAlbum && (
        <div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {libraryData.albums
              .find((album) => album.id === selectedAlbum)
              ?.songs.map((song, index) => {
                const rowIndex = Math.floor(index / 5);
                return (
                  <SongCard key={song.id} song={song} rowIndex={rowIndex} onAuthRequired={onAuthRequired} />
                );
              })}
          </div>
        </div>
      )}

      {/* Tabs - only show when not viewing artist or album */}
      {!selectedArtist && !selectedAlbum && (
        <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as LibraryTab)} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="playlists">Playlists</TabsTrigger>
            <TabsTrigger value="albums">Albums</TabsTrigger>
            <TabsTrigger value="artists">Artists</TabsTrigger>
          </TabsList>

          {/* All Tab - Show both playlists and recent songs */}
          <TabsContent value="all" className="space-y-8">
            {/* Playlists Section */}
            {filteredPlaylists.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4 text-foreground">Your Playlists</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {filteredPlaylists.map((playlist) => (
                    <PlaylistCard key={playlist.id} playlist={playlist} />
                  ))}
                </div>
              </div>
            )}

            {/* Artists Section */}
            {filteredArtists.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4 text-foreground">Top Artists</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {filteredArtists.slice(0, 10).map((artist) => (
                    <ArtistCard key={artist.name} artist={artist} onSelectArtist={setSelectedArtist} />
                  ))}
                </div>
              </div>
            )}

            {/* Recent Songs */}
            {filteredSongs.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4 text-foreground">All Songs</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {filteredSongs.slice(0, 20).map((song, index) => {
                    const rowIndex = Math.floor(index / 5);
                    return (
                      <SongCard key={song.id} song={song} rowIndex={rowIndex} onAuthRequired={onAuthRequired} />
                    );
                  })}
                </div>
              </div>
            )}

            {filteredPlaylists.length === 0 && filteredArtists.length === 0 && filteredSongs.length === 0 && (
              <EmptyState />
            )}
          </TabsContent>

          {/* Playlists Tab */}
          <TabsContent value="playlists">
            {filteredPlaylists.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {filteredPlaylists.map((playlist) => (
                  <PlaylistCard key={playlist.id} playlist={playlist} />
                ))}
              </div>
            ) : (
              <EmptyState message="No playlists found. Create one to get started!" />
            )}
          </TabsContent>

          {/* Albums Tab */}
          <TabsContent value="albums">
            {filteredAlbums.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {filteredAlbums.map((album) => (
                  <AlbumCard key={album.id} album={album} onSelectAlbum={setSelectedAlbum} />
                ))}
              </div>
            ) : (
              <EmptyState message="No albums found" />
            )}
          </TabsContent>

          {/* Artists Tab */}
          <TabsContent value="artists">
            {filteredArtists.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {filteredArtists.map((artist) => (
                  <ArtistCard key={artist.name} artist={artist} onSelectArtist={setSelectedArtist} />
                ))}
              </div>
            ) : (
              <EmptyState message="No artists found" />
            )}
          </TabsContent>
        </Tabs>
      )}
    </main>
  );
}

// Playlist Card Component
function PlaylistCard({ playlist }: { playlist: Playlist }) {
  const { setSelectedPlaylist, setCurrentView } = useMusic();

  const handleClick = () => {
    setSelectedPlaylist(playlist);
    setCurrentView("home");
  };

  return (
    <button
      onClick={handleClick}
      className="group relative aspect-square bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg p-4 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 transform"
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300" />

      {/* Content */}
      <div className="relative h-full flex flex-col justify-between">
        <div>
          <Music className="h-8 w-8 text-white/80 mb-2" />
        </div>
        <div className="text-left">
          <p className="font-semibold text-white truncate text-sm">{playlist.name}</p>
          <p className="text-white/70 text-xs">{playlist.song_count ?? 0} songs</p>
        </div>
      </div>
    </button>
  );
}

// Album Card Component
function AlbumCard({ album, onSelectAlbum }: { album: LibraryAlbum; onSelectAlbum: (albumId: number) => void }) {
  const handleClick = () => {
    onSelectAlbum(album.id);
  };

  return (
    <button
      onClick={handleClick}
      className="group bg-card rounded-lg p-4 hover:bg-surface-hover transition-all duration-300 cursor-pointer hover:shadow-xl hover:scale-[1.02] transform overflow-hidden text-left w-full"
    >
      <div className="relative mb-4 overflow-hidden rounded-md">
        {album.cover ? (
          <img
            src={album.cover}
            alt={album.name}
            className="w-full aspect-square object-cover shadow-lg transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="w-full aspect-square bg-surface-hover flex items-center justify-center">
            <Music className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
      </div>

      <h3 className="font-semibold text-foreground truncate mb-1">{album.name}</h3>
      <p className="text-sm text-muted-foreground">{album.songs.length} songs</p>
    </button>
  );
}

// Artist Card Component
function ArtistCard({ artist, onSelectArtist }: { artist: LibraryArtist; onSelectArtist: (artistName: string) => void }) {
  const handleClick = () => {
    onSelectArtist(artist.name);
  };

  return (
    <button
      onClick={handleClick}
      className="group bg-card rounded-lg p-4 hover:bg-surface-hover transition-all duration-300 cursor-pointer hover:shadow-xl hover:scale-[1.02] transform overflow-hidden text-left w-full"
    >
      <div className="relative mb-4 overflow-hidden rounded-full aspect-square">
        {artist.cover ? (
          <img
            src={artist.cover}
            alt={artist.name}
            className="w-full h-full object-cover shadow-lg transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-surface-hover flex items-center justify-center">
            <Music className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
      </div>

      <h3 className="font-semibold text-foreground truncate mb-1">{artist.name}</h3>
      <p className="text-sm text-muted-foreground">{artist.songCount} songs</p>
    </button>
  );
}

// Empty State Component
function EmptyState({ message = "No content found" }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
      <Music className="h-16 w-16 mb-4 opacity-50" />
      <p className="text-lg">{message}</p>
    </div>
  );
}
