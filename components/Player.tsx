import React, { useRef, useEffect, useState } from 'react';
import { Song } from '../types';
import { PlayIcon, PauseIcon, SkipNextIcon, SkipPreviousIcon, VolumeUpIcon, MusicNoteIcon, ChevronDownIcon, ShuffleIcon, RepeatIcon } from './Icons';
import { formatDuration } from '../utils/formatters';

interface PlayerProps {
    song: Song;
    isPlaying: boolean;
    onTogglePlay: () => void;
    onNext: () => void;
    onPrev: () => void;
}

const Player: React.FC<PlayerProps> = ({ song, isPlaying, onTogglePlay, onNext, onPrev }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleCanPlay = () => {
            if (isPlaying) {
                const playPromise = audio.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        if (error.name !== 'AbortError') {
                            console.error("Error playing audio:", error);
                        }
                    });
                }
            }
        };

        if (audio.src !== song.url) {
            audio.src = song.url;
            audio.load();
            audio.addEventListener('canplay', handleCanPlay);
        } else {
            if (isPlaying) {
                const playPromise = audio.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        if (error.name !== 'AbortError') {
                            console.error("Error playing audio:", error);
                        }
                    });
                }
            } else {
                audio.pause();
            }
        }
        
        return () => {
            audio.removeEventListener('canplay', handleCanPlay);
        };

    }, [song, isPlaying]);


    useEffect(() => {
        if (!audioRef.current) return;
        audioRef.current.volume = volume;
    }, [volume]);

    useEffect(() => {
        document.body.style.overflow = isFullscreen ? 'hidden' : 'auto';
        return () => {
            document.body.style.overflow = 'auto';
        }
    }, [isFullscreen]);
    
    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setProgress(audioRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };
    
    const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (audioRef.current) {
            audioRef.current.currentTime = Number(event.target.value);
            setProgress(Number(event.target.value));
        }
    };

    const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setVolume(Number(event.target.value));
    };
    
    const ProgressBar = () => (
         <div className="flex items-center gap-2 w-full">
            <span className="text-xs text-gray-400 w-10 text-center">{formatDuration(progress)}</span>
            <input
                type="range"
                min="0"
                max={duration || 0}
                value={progress}
                onChange={handleSeek}
                className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <span className="text-xs text-gray-400 w-10 text-center">{formatDuration(duration)}</span>
        </div>
    );
    
    const playerClasses = `
        fixed bottom-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out
        ${isFullscreen ? 'inset-0 backdrop-blur-xl bg-black/30' : 'h-24'}
    `;

    const backgroundClasses = `
        absolute inset-0 transition-opacity duration-500
        ${isFullscreen ? 'bg-opacity-0' : 'bg-black bg-opacity-90 backdrop-blur-sm border-t border-gray-800'}
    `;

    const artworkContainerClasses = `
        absolute left-4 transition-all duration-500 ease-in-out
        ${isFullscreen ? 'top-1/2 -translate-y-1/2 w-full max-w-lg left-1/2 -translate-x-1/2' : 'top-4 w-16 h-16'}
    `;
    
    const artworkImageClasses = `
        aspect-square rounded-lg shadow-2xl transition-all duration-500 ease-in-out w-full
         ${isFullscreen ? 'max-w-sm mx-auto' : ''}
    `;

    const qualityDetails = song.audioQuality ? [
        song.audioQuality.bitDepth && `${song.audioQuality.bitDepth} BIT`,
        song.audioQuality.sampleRate && `${parseFloat((song.audioQuality.sampleRate / 1000).toFixed(1))} KHZ`,
        song.audioQuality.bitrate && `${song.audioQuality.bitrate} KBPS`,
        song.audioQuality.format
    ].filter(Boolean).join(' ') : null;


    return (
        <>
            <audio
                ref={audioRef}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={onNext}
            />
           <div className={playerClasses}>
                {song.artwork && (
                    <div 
                        className="absolute inset-0 w-full h-full bg-cover bg-center filter blur-3xl opacity-30 transition-opacity duration-500" 
                        style={{ backgroundImage: `url(${song.artwork})`, opacity: isFullscreen ? 0.4 : 0 }} 
                    />
                )}
                <div className={backgroundClasses}></div>

                <div className="relative w-full h-full flex flex-col items-center text-white">
                     {/* Fullscreen Only Elements */}
                    <div className={`w-full max-w-lg transition-opacity duration-300 ease-in-out ${isFullscreen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                        <div className="absolute top-8 right-8">
                            <button onClick={() => setIsFullscreen(false)} className="text-gray-400 hover:text-white">
                                <ChevronDownIcon className="w-8 h-8"/>
                            </button>
                        </div>
                    </div>

                    {/* Artwork */}
                    <div className={artworkContainerClasses}>
                        <div className={artworkImageClasses} onClick={() => setIsFullscreen(!isFullscreen)}>
                             {song.artwork ? (
                                <img src={song.artwork} alt={song.title} className="w-full h-full object-cover rounded-md" />
                            ): (
                                <div className={`w-full h-full flex items-center justify-center bg-gray-800 rounded-md`}>
                                    <MusicNoteIcon className={isFullscreen ? "w-24 h-24 text-gray-500" : "w-8 h-8 text-gray-500"} />
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* Song Info */}
                    <div className={`absolute left-24 top-4 right-4 transition-all duration-500 ease-in-out ${isFullscreen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                        <p className="font-bold truncate">{song.title}</p>
                        <p className="text-sm text-gray-400 truncate">{song.artist}</p>
                    </div>

                    {/* Fullscreen Song Info */}
                    <div className={`absolute top-1/2 mt-56 text-center w-full transition-opacity duration-300 ease-in-out ${isFullscreen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                        <h2 className="text-3xl font-bold truncate">{song.title}</h2>
                        <p className="text-lg text-gray-300 truncate">{song.artist}</p>
                        {qualityDetails && (
                           <div className="mt-4">
                                <div className="inline-block bg-black/40 backdrop-blur-sm rounded-full px-5 py-2">
                                    <p className="text-white text-sm font-bold tracking-widest">
                                        {qualityDetails}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    {/* Player Controls Container */}
                     <div className={`absolute w-full flex flex-col items-center justify-center transition-all duration-500 ease-in-out ${isFullscreen ? 'bottom-32 w-1/2 max-w-lg' : 'top-1/2 -translate-y-1/2 w-1/2'}`}>
                        <div className={`flex items-center gap-4 ${isFullscreen && 'gap-8 mb-4'}`}>
                            <button className={`text-gray-400 hover:text-white transition-colors ${!isFullscreen && 'hidden'}`}><ShuffleIcon className="w-6 h-6"/></button>
                            <button onClick={onPrev} className="text-gray-300 hover:text-white transition-colors"><SkipPreviousIcon className={isFullscreen ? "w-10 h-10" : "w-6 h-6"} /></button>
                            <button onClick={onTogglePlay} className={`bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform ${isFullscreen ? 'w-20 h-20 p-4' : 'w-10 h-10 p-2'}`}>
                                {isPlaying ? <PauseIcon className={isFullscreen ? "w-10 h-10" : "w-6 h-6"} /> : <PlayIcon className={isFullscreen ? "w-10 h-10" : "w-6 h-6"} />}
                            </button>
                            <button onClick={onNext} className="text-gray-300 hover:text-white transition-colors"><SkipNextIcon className={isFullscreen ? "w-10 h-10" : "w-6 h-6"} /></button>
                             <button className={`text-gray-400 hover:text-white transition-colors ${!isFullscreen && 'hidden'}`}><RepeatIcon className="w-6 h-6"/></button>
                        </div>
                        <div className="w-full mt-1">
                           <ProgressBar />
                        </div>
                    </div>
                    
                    {/* Volume Controls */}
                    <div className={`absolute flex items-center justify-end gap-2 transition-all duration-500 ease-in-out ${isFullscreen ? 'bottom-8 w-full max-w-xs' : 'top-1/2 -translate-y-1/2 right-4 w-1/4'}`}>
                        <VolumeUpIcon className="w-5 h-5" />
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volume}
                            onChange={handleVolumeChange}
                            className={`h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500 ${isFullscreen ? 'w-full' : 'w-24'}`}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Player;