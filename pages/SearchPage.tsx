import React, { useState, useMemo } from 'react';
import { Song, Page } from '../types';
import SongCard from '../components/SongCard';
import { SearchIcon, UploadIcon } from '../components/Icons';

interface SearchPageProps {
    songs: Song[];
    onPlaySong: (songId: string) => void;
    setPage: (page: Page) => void;
}

const SearchPage: React.FC<SearchPageProps> = ({ songs, onPlaySong, setPage }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredSongs = useMemo(() => {
        if (!searchTerm) return songs;
        return songs.filter(song => 
            song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            song.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
            song.album.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, songs]);

    const hasSongs = songs.length > 0;
    const hasResults = filteredSongs.length > 0;

    return (
        <div>
            <div className="relative mb-8 max-w-lg">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="What do you want to listen to?"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[#282828] text-white border-none rounded-full py-3 pl-10 pr-4 focus:ring-2 focus:ring-purple-500"
                    disabled={!hasSongs}
                />
            </div>

            <h2 className="text-2xl font-bold text-white mb-4">
                {searchTerm ? `Results for "${searchTerm}"` : 'Browse all music'}
            </h2>

            {!hasSongs && !searchTerm ? (
                <div className="text-center py-10 px-6 bg-[#181818] rounded-lg">
                    <h3 className="text-xl font-bold text-white mb-2">Your library is empty</h3>
                    <p className="text-gray-400 mb-6">Upload some music to start searching.</p>
                     <button 
                        onClick={() => setPage('Upload')}
                        className="bg-purple-600 text-white font-semibold py-2 px-6 rounded-full hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-2"
                    >
                        <UploadIcon className="w-5 h-5" />
                        Upload Music
                    </button>
                </div>
            ) : !hasResults && searchTerm ? (
                 <div className="text-center py-10 px-6">
                    <h3 className="text-xl font-bold text-white mb-2">No results found</h3>
                    <p className="text-gray-400">Try a different search term.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {filteredSongs.map(song => (
                        <SongCard key={song.id} song={song} onPlay={onPlaySong} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchPage;