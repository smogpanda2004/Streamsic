
import React from 'react';
import { Song } from '../types';
import { MusicNoteIcon } from './Icons';

interface SongCardProps {
    song: Song;
    onPlay: (songId: string) => void;
}

const SongCard: React.FC<SongCardProps> = ({ song, onPlay }) => {
    return (
        <div 
            className="bg-[#181818] p-4 rounded-lg hover:bg-[#282828] transition-colors duration-300 cursor-pointer group"
            onClick={() => onPlay(song.id)}
        >
            <div className="relative mb-4">
                <div className="aspect-square bg-gray-800 rounded-md flex items-center justify-center">
                    {song.artwork ? (
                        <img src={song.artwork} alt={song.title} className="w-full h-full object-cover rounded-md" />
                    ) : (
                        <MusicNoteIcon className="w-12 h-12 text-gray-500" />
                    )}
                </div>
            </div>
            <h3 className="text-white font-bold truncate">{song.title}</h3>
            <p className="text-gray-400 text-sm truncate">{song.artist}</p>
            <p className="text-gray-400 text-sm">{`${song.album} • ${song.duration}`}</p>
        </div>
    );
};

export default SongCard;
