export type Page = 'Home' | 'Search' | 'Your Library' | 'Upload';

export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  artwork: string | null;
  url: string;
  audioQuality?: {
    format?: string;
    bitDepth?: number; // e.g., 16, 24
    bitrate?: number; // in kbps
    sampleRate?: number; // in Hz
  };
}