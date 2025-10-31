import React from 'react';
import { Song, Page } from '../types';
import SongCard from '../components/SongCard';
import { UploadIcon } from '../components/Icons';

interface HomePageProps {
    songs: Song[];
    onPlaySong: (songId: string) => void;
    setPage: (page: Page) => void;
}

const HomePage: React.FC<HomePageProps> = ({ songs, onPlaySong, setPage }) => {
    const greeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-4">{greeting()}</h1>
            <p className="text-gray-400 mb-8">Discover your next favorite song</p>
            
            <h2 className="text-2xl font-bold text-white mb-4">All Songs</h2>
             {songs.length === 0 ? (
                <div className="text-center py-10 px-6 bg-[#181818] rounded-lg">
                    <h3 className="text-xl font-bold text-white mb-2">Your collection is empty</h3>
                    <p className="text-gray-400 mb-6">Upload your first song to get started.</p>
                    <button 
                        onClick={() => setPage('Upload')}
                        className="bg-purple-600 text-white font-semibold py-2 px-6 rounded-full hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-2"
                    >
                        <UploadIcon className="w-5 h-5" />
                        Upload Music
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {songs.map(song => (
                        <SongCard key={song.id} song={song} onPlay={onPlaySong} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default HomePage;