import React from 'react';
import { Song, Page } from '../types';
import SongCard from '../components/SongCard';
import { UploadIcon } from '../components/Icons';

interface LibraryPageProps {
    songs: Song[];
    onPlaySong: (songId: string) => void;
    setPage: (page: Page) => void;
}

const LibraryPage: React.FC<LibraryPageProps> = ({ songs, onPlaySong, setPage }) => {
    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Your Library</h1>
                    <p className="text-gray-400">Your personal music collection</p>
                </div>
            </div>
            
            {songs.length === 0 ? (
                 <div className="flex flex-col items-center justify-center h-full text-center mt-16">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-24 h-24 text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-12v13c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 6l12-3" />
                    </svg>
                    <h2 className="text-2xl font-bold text-white mb-2">Songs you upload will appear here</h2>
                    <p className="text-gray-400 mb-6">Start building your personal library.</p>
                     <button 
                        onClick={() => setPage('Upload')}
                        className="bg-purple-600 text-white font-semibold py-3 px-8 rounded-full hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-2"
                    >
                        <UploadIcon className="w-6 h-6" />
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

export default LibraryPage;