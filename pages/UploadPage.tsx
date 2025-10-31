import React, { useState } from 'react';
import { UploadIcon } from '../components/Icons';

interface UploadPageProps {
    onUploadClick: () => void;
    onFileDrop: (event: React.DragEvent<HTMLDivElement>) => void;
}

const UploadPage: React.FC<UploadPageProps> = ({ onUploadClick, onFileDrop }) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };
    
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        onFileDrop(e);
    };

    return (
        <div className="flex flex-col items-center justify-center h-full text-center">
             <div 
                className={`w-full max-w-2xl border-4 border-dashed rounded-xl p-12 transition-colors duration-300 ${isDragging ? 'border-purple-500 bg-gray-800' : 'border-gray-600 hover:border-gray-500'}`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
             >
                <UploadIcon className="w-24 h-24 mx-auto text-gray-400 mb-6" />
                <h1 className="text-3xl font-bold text-white mb-2">Drag & drop your music</h1>
                <p className="text-gray-400 mb-6">or click to browse</p>
                <button 
                    onClick={onUploadClick}
                    className="bg-purple-600 text-white font-semibold py-3 px-8 rounded-full hover:bg-purple-700 transition-all duration-300 transform hover:scale-105"
                >
                    Select Files
                </button>
                 <p className="text-xs text-gray-500 mt-8">Only high-resolution FLAC and WAV formats are supported.</p>
            </div>
        </div>
    );
};

export default UploadPage;