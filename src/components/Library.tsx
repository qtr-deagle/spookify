import { useState, useMemo } from "react";
import { Music, ArrowLeft, Clock, Plus, SortAsc, ListMusic, Sparkles, X, MoreVertical, Edit2, Trash2 } from "lucide-react";
import { Song, Playlist } from "@/types/music";
import { useMusic } from "@/context/MusicContext";
import { useNavigation } from "@/context/NavigationContext";
import { SongCard } from "./SongCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type LibraryTab = "all" | "playlists" | "albums" | "artists" | "recent";
type SortOrder = "date-added" | "artist" | "title";

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
  const [sortOrder, setSortOrder] = useState<SortOrder>("date-added");

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
  const filteredSongs = useMemo(() => {
    const filtered = songs.filter((song) => {
      const query = searchQuery.toLowerCase();
      return [song.title, song.artist].filter(Boolean).some((field) => field.toLowerCase().includes(query));
    });

    // Apply sorting
    return [...filtered].sort((a, b) => {
      switch (sortOrder) {
        case "artist":
          return a.artist.localeCompare(b.artist);
        case "title":
          return a.title.localeCompare(b.title);
        case "date-added":
        default:
          return 0; // Keep original order
      }
    });
  }, [songs, searchQuery, sortOrder]);

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
    <main className="flex-1 overflow-y-auto scrollbar-thin p-6 md:p-8 bg-background transition-all duration-300">
      {/* Header */}
      <div className="mb-10 animate-in fade-in slide-in-from-top">
        <div className="flex items-center justify-between gap-4 mb-2">
          <h1 className="text-4xl font-bold text-white">
            {selectedArtist ? `Songs by ${selectedArtist}` : selectedAlbum ? `${libraryData.albums.find((a) => a.id === selectedAlbum)?.name}` : "Your Library"}
          </h1>
          <Button variant="ghost" size="icon" className="text-white hover:bg-surface-hover rounded-full">
            <Plus className="h-6 w-6" />
          </Button>
        </div>
        <p className="text-muted-foreground">
          {selectedArtist
            ? `Showing all songs by ${selectedArtist}`
            : selectedAlbum
              ? `${libraryData.albums.find((a) => a.id === selectedAlbum)?.songs.length} songs in this album`
              : "Your music collection and playlists"}
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
          className="flex items-center gap-2 mb-6 p-2 hover:bg-surface-hover rounded-lg transition-all duration-200 text-muted-foreground hover:text-foreground"
          title="Go back"
        >
          <ArrowLeft className="h-4 w-4" />
          {selectedArtist ? "Back to Artists" : selectedAlbum ? "Back to Albums" : "Back"}
        </button>
      )}
      {/* Artist View - Show songs from selected artist */}
      {selectedArtist && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
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
          <TabsList className="mb-8">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="playlists">Playlists</TabsTrigger>
            <TabsTrigger value="recent">Recently Played</TabsTrigger>
            <TabsTrigger value="albums">Albums</TabsTrigger>
            <TabsTrigger value="artists">Artists</TabsTrigger>
          </TabsList>

          {/* All Tab - Show playlists and saved songs */}
          <TabsContent value="all" className="space-y-10">
            {/* Your Playlists Section */}
            <section>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white">Your Playlists</h2>
                <p className="text-muted-foreground text-sm">{filteredPlaylists.length} playlists</p>
              </div>
              {filteredPlaylists.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
                  {filteredPlaylists.map((playlist) => (
                    <PlaylistCard key={playlist.id} playlist={playlist} />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <EmptyPlaylistCard />
                  <DiscoverPlaylistsCard />
                </div>
              )}
            </section>

            {/* Saved Songs Section */}
            {filteredSongs.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Saved Songs</h2>
                    <p className="text-muted-foreground text-sm">{filteredSongs.length} songs in your library</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                  {filteredSongs.slice(0, 10).map((song, index) => {
                    const rowIndex = Math.floor(index / 5);
                    return (
                      <SongCard key={song.id} song={song} rowIndex={rowIndex} onAuthRequired={onAuthRequired} />
                    );
                  })}
                </div>
              </section>
            )}

            {filteredPlaylists.length === 0 && filteredSongs.length === 0 && (
              <EmptyState message="Start by creating a playlist or adding songs to your library" />
            )}
          </TabsContent>

          {/* Playlists Tab */}
          <TabsContent value="playlists">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white">{filteredPlaylists.length} Playlists</h3>
            </div>
            {filteredPlaylists.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
                {filteredPlaylists.map((playlist) => (
                  <PlaylistCard key={playlist.id} playlist={playlist} />
                ))}
              </div>
            ) : (
              <EmptyState message="No playlists found. Create one to get started!" />
            )}
          </TabsContent>

          {/* Recently Played Tab */}
          <TabsContent value="recent">
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white">Recently Played</h3>
              {filteredSongs.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                  {filteredSongs.slice(0, 20).map((song, index) => {
                    const rowIndex = Math.floor(index / 5);
                    return (
                      <SongCard key={song.id} song={song} rowIndex={rowIndex} onAuthRequired={onAuthRequired} />
                    );
                  })}
                </div>
              ) : (
                <EmptyState message="No recently played songs yet" />
              )}
            </div>
          </TabsContent>

          {/* Albums Tab */}
          <TabsContent value="albums">
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white">{filteredAlbums.length} Albums</h3>
              {filteredAlbums.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
                  {filteredAlbums.map((album) => (
                    <AlbumCard key={album.id} album={album} onSelectAlbum={setSelectedAlbum} />
                  ))}
                </div>
              ) : (
                <EmptyState message="No albums found" />
              )}
            </div>
          </TabsContent>

          {/* Artists Tab */}
          <TabsContent value="artists">
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white">{filteredArtists.length} Artists</h3>
              {filteredArtists.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
                  {filteredArtists.map((artist) => (
                    <ArtistCard key={artist.name} artist={artist} onSelectArtist={setSelectedArtist} />
                  ))}
                </div>
              ) : (
                <EmptyState message="No artists found" />
              )}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </main>
  );
}

// Playlist Card Component
function PlaylistCard({ playlist }: { playlist: Playlist }) {
  const { setSelectedPlaylist, setCurrentView, deletePlaylist } = useMusic();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(playlist.name);

  const handleClick = () => {
    setSelectedPlaylist(playlist);
    setCurrentView("home");
  };

  const handleRename = async () => {
    if (newName.trim() && newName !== playlist.name) {
      // Call API to rename playlist
      try {
        const formData = new FormData();
        formData.append("playlist_id", playlist.id.toString());
        formData.append("name", newName.trim());
        
        const response = await fetch("/api/updatePlaylist.php", {
          method: "POST",
          body: formData,
        });
        
        if (response.ok) {
          // Update local state instead of reloading
          setIsRenaming(false);
          setIsMenuOpen(false);
          // Trigger a re-fetch of playlists
          window.dispatchEvent(new CustomEvent('playlistsUpdated'));
        }
      } catch (error) {
        console.error("Failed to rename playlist:", error);
      }
    } else {
      setIsRenaming(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${playlist.name}"? This action cannot be undone.`)) {
      return;
    }
    
    try {
      // Use context function which updates state properly
      deletePlaylist(playlist.id);
      setIsMenuOpen(false);
    } catch (error) {
      console.error("Failed to delete playlist:", error);
    }
  };

  return (
    <div className="group relative aspect-square bg-gradient-to-br from-orange-600 to-orange-500 rounded-lg p-4 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 transform">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300" />

      {/* Menu Button */}
      <div className="absolute top-2 right-2 z-20">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsMenuOpen(!isMenuOpen);
          }}
          className="p-2 rounded-full bg-black/40 hover:bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300"
        >
          <MoreVertical className="h-4 w-4 text-white" />
        </button>

        {/* Dropdown Menu */}
        {isMenuOpen && (
          <div className="absolute top-10 right-0 bg-zinc-900 border border-zinc-800 rounded-lg shadow-lg overflow-hidden w-40 z-30">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsRenaming(true);
                setIsMenuOpen(false);
              }}
              className="w-full px-4 py-2 text-sm text-white hover:bg-surface-hover flex items-center gap-2 transition-colors"
            >
              <Edit2 className="h-4 w-4" />
              Rename
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              className="w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/20 flex items-center gap-2 transition-colors border-t border-zinc-800"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Rename Modal */}
      {isRenaming && (
        <div
          className="absolute inset-0 bg-black/80 flex items-center justify-center z-50 rounded-lg"
          onClick={(e) => {
            e.stopPropagation();
            setIsRenaming(false);
          }}
        >
          <div
            className="bg-zinc-900 rounded-lg p-4 w-[90%] border border-zinc-800"
            onClick={(e) => e.stopPropagation()}
          >
            <Input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleRename();
                if (e.key === "Escape") setIsRenaming(false);
              }}
              autoFocus
              className="bg-surface-hover border-surface-hover/50 text-white placeholder:text-muted-foreground focus:border-orange-500 focus:ring-orange-500/50 rounded-lg py-2 px-3 mb-3"
            />
            <div className="flex gap-2 text-xs">
              <button
                onClick={() => setIsRenaming(false)}
                className="flex-1 px-2 py-1 rounded bg-surface-hover hover:bg-surface-hover/80 text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRename}
                className="flex-1 px-2 py-1 rounded bg-orange-500 hover:bg-orange-600 text-white font-bold transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div
        className="relative h-full flex flex-col justify-between"
        onClick={handleClick}
      >
        <div>
          <Music className="h-8 w-8 text-white/90 mb-2" />
        </div>
        <div className="text-left">
          <p className="font-bold text-white truncate text-sm">{playlist.name}</p>
          <p className="text-white/70 text-xs mt-1">{playlist.song_count ?? 0} songs</p>
        </div>
      </div>
    </div>
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

      <h3 className="font-bold text-foreground truncate mb-1">{album.name}</h3>
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

      <h3 className="font-bold text-foreground truncate mb-1">{artist.name}</h3>
      <p className="text-sm text-muted-foreground">{artist.songCount} songs</p>
    </button>
  );
}

// Empty State Component
function EmptyState({ message = "No content found" }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
      <Music className="h-16 w-16 mb-4 opacity-50" />
      <p className="text-lg font-semibold">{message}</p>
    </div>
  );
}

// Empty Playlist Card - Create First Playlist
function EmptyPlaylistCard() {
  const { createPlaylist } = useMusic();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [playlistName, setPlaylistName] = useState("");

  const handleCreatePlaylist = () => {
    if (playlistName.trim()) {
      createPlaylist(playlistName);
      setPlaylistName("");
      setIsModalOpen(false);
    }
  };

  return (
    <>
      

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-surface rounded-2xl p-8 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Create a playlist</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-white block mb-2">Playlist name</label>
                <Input
                  type="text"
                  placeholder="Enter playlist name"
                  value={playlistName}
                  onChange={(e) => setPlaylistName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreatePlaylist()}
                  autoFocus
                  className="bg-surface-hover border-surface-hover/50 text-white placeholder:text-muted-foreground focus:border-orange-500 focus:ring-orange-500/50 rounded-lg py-2 px-3"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => setIsModalOpen(false)}
                  variant="ghost"
                  className="flex-1 text-white hover:bg-surface-hover"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreatePlaylist}
                  disabled={!playlistName.trim()}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold disabled:opacity-50"
                >
                  Create
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Discover Playlists Card
function DiscoverPlaylistsCard() {
  const { setCurrentView } = useMusic();
  
  return (
    <div className="bg-surface-hover/50 rounded-xl p-6 hover:bg-surface-hover transition-all duration-300">
      <h3 className="text-xl font-bold text-white mb-2">Let's find some podcasts to follow</h3>
      <p className="text-white/70 text-sm mb-4">We'll keep you updated on new episodes</p>
      <Button 
        onClick={() => setCurrentView("browse")}
        className="bg-white hover:bg-white/90 text-black font-bold rounded-full px-6 py-2 text-sm"
      >
        Browse podcasts
      </Button>
    </div>
  );
}
