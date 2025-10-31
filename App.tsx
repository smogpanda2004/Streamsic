import React, { useState, useRef, useCallback } from 'react';
import { Page, Song } from './types';
import Sidebar from './components/Sidebar';
import HomePage from './pages/HomePage';
import LibraryPage from './pages/LibraryPage';
import SearchPage from './pages/SearchPage';
import UploadPage from './pages/UploadPage';
import Player from './components/Player';
import { formatDuration } from './utils/formatters';

// Extend the Window interface to include jsmediatags
declare global {
    interface Window {
        jsmediatags: any;
        webkitAudioContext: typeof AudioContext
    }
}

const App: React.FC = () => {
    const [page, setPage] = useState<Page>('Home');
    const [songs, setSongs] = useState<Song[]>([]);
    const [currentSongIndex, setCurrentSongIndex] = useState<number | null>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const audioContextRef = useRef<AudioContext | null>(null);

    if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    const processFiles = (files: FileList | null) => {
        if (!files || files.length === 0 || !audioContextRef.current) return;
        
        const audioContext = audioContextRef.current;
        const newSongs: Song[] = [];
        
        const supportedFormats = ['flac', 'wav'];
        const validFiles = Array.from(files).filter(file => {
            const extension = file.name.split('.').pop()?.toLowerCase();
            return extension && supportedFormats.includes(extension);
        });

        if (validFiles.length === 0) {
            alert('No supported files found. Please upload FLAC or WAV files.');
            return;
        }

        let filesProcessed = 0;

        const onProcessComplete = () => {
            filesProcessed++;
            if (filesProcessed === validFiles.length) {
                setSongs(prevSongs => [...prevSongs, ...newSongs].sort((a, b) => a.title.localeCompare(b.title)));
                setPage('Your Library');
            }
        };

        validFiles.forEach((file, index) => {
            const url = URL.createObjectURL(file);
            const audio = new Audio(url);
            
            const extension = file.name.split('.').pop()?.toLowerCase();
            const format = extension?.toUpperCase() || '';
            const bitDepth = 24; // Assumption for high-res lossless formats

            audio.onloadedmetadata = () => {
                const duration = audio.duration;
                const reader = new FileReader();

                reader.onload = (e) => {
                    const arrayBuffer = e.target?.result as ArrayBuffer;
                    audioContext.decodeAudioData(arrayBuffer, (buffer) => {
                        const sampleRate = buffer.sampleRate;
                        const bitrate = Math.round((file.size * 8) / duration / 1000); // kbps

                        window.jsmediatags.read(file, {
                            onSuccess: (tag: any) => {
                                const tags = tag.tags;
                                let artwork: string | null = null;
                                if (tags.picture) {
                                    const { data, format } = tags.picture;
                                    let base64String = "";
                                    for (let i = 0; i < data.length; i++) {
                                        base64String += String.fromCharCode(data[i]);
                                    }
                                    artwork = `data:${format};base64,${window.btoa(base64String)}`;
                                }
                                newSongs.push({
                                    id: `${Date.now()}-${index}`,
                                    title: tags.title || file.name.replace(/\.[^/.]+$/, ""),
                                    artist: tags.artist || 'Unknown Artist',
                                    album: tags.album || 'Unknown Album',
                                    duration: formatDuration(duration),
                                    url, artwork,
                                    audioQuality: { format, bitrate, sampleRate, bitDepth }
                                });
                                onProcessComplete();
                            },
                            onError: () => {
                                newSongs.push({
                                    id: `${Date.now()}-${index}`,
                                    title: file.name.replace(/\.[^/.]+$/, ""),
                                    artist: 'Unknown Artist',
                                    album: 'Unknown Album',
                                    duration: formatDuration(duration),
                                    url, artwork: null,
                                    audioQuality: { format, bitrate, sampleRate, bitDepth }
                                });
                                onProcessComplete();
                            },
                        });
                    }, (decodeError) => {
                        console.error('Error decoding audio data:', decodeError);
                        // Fallback if decoding fails, but we still have duration
                         newSongs.push({
                            id: `${Date.now()}-${index}`,
                            title: file.name.replace(/\.[^/.]+$/, ""),
                            artist: 'Unknown Artist',
                            album: 'Unknown Album',
                            duration: formatDuration(duration),
                            url, artwork: null,
                            audioQuality: { format, bitDepth }
                        });
                        onProcessComplete();
                    });
                };

                reader.onerror = (error) => {
                    console.error('FileReader error:', error);
                    onProcessComplete();
                };

                reader.readAsArrayBuffer(file);
            };

            audio.onerror = () => {
                console.error(`Error loading audio file: ${file.name}`);
                onProcessComplete();
            }
        });
    };
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        processFiles(event.target.files);
    };

    const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
        processFiles(event.dataTransfer.files);
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const playSong = (songId: string) => {
        const songIndex = songs.findIndex(s => s.id === songId);
        if (songIndex !== -1) {
            setCurrentSongIndex(songIndex);
            setIsPlaying(true);
        }
    };
    
    const togglePlayPause = useCallback(() => {
        if(currentSongIndex !== null) {
            setIsPlaying(prev => !prev);
        } else if (songs.length > 0) {
            setCurrentSongIndex(0);
            setIsPlaying(true);
        }
    }, [currentSongIndex, songs]);

    const playNext = useCallback(() => {
        if (currentSongIndex !== null) {
            const nextIndex = (currentSongIndex + 1) % songs.length;
            setCurrentSongIndex(nextIndex);
            setIsPlaying(true);
        }
    }, [currentSongIndex, songs]);

    const playPrev = useCallback(() => {
        if (currentSongIndex !== null) {
            const prevIndex = (currentSongIndex - 1 + songs.length) % songs.length;
            setCurrentSongIndex(prevIndex);
            setIsPlaying(true);
        }
    }, [currentSongIndex, songs]);

    const currentSong = currentSongIndex !== null ? songs[currentSongIndex] : null;
    
    return (
        <div className="flex h-screen bg-black overflow-hidden">
            <Sidebar currentPage={page} setPage={setPage} />
            <main className="flex-1 flex flex-col overflow-y-auto">
                 <div className="flex-1 p-8 pb-24">
                    {page === 'Home' && <HomePage songs={songs} onPlaySong={playSong} setPage={setPage} />}
                    {page === 'Your Library' && <LibraryPage songs={songs} onPlaySong={playSong} setPage={setPage} />}
                    {page === 'Search' && <SearchPage songs={songs} onPlaySong={playSong} setPage={setPage} />}
                    {page === 'Upload' && <UploadPage onUploadClick={handleUploadClick} onFileDrop={handleFileDrop} />}
                 </div>
            </main>
             <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                multiple
                accept=".flac,.wav,audio/flac,audio/wav"
            />
            {currentSong && (
                <Player 
                    song={currentSong} 
                    isPlaying={isPlaying}
                    onTogglePlay={togglePlayPause}
                    onNext={playNext}
                    onPrev={playPrev}
                />
            )}
        </div>
    );
};

export default App;