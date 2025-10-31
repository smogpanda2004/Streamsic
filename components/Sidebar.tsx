
import React from 'react';
import { Page } from '../types';
import { HomeIcon, SearchIcon, LibraryIcon, PlusIcon, UploadIcon } from './Icons';

interface SidebarProps {
    currentPage: Page;
    setPage: (page: Page) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setPage }) => {
    const navItems: { name: Page; icon: React.ReactNode }[] = [
        { name: 'Home', icon: <HomeIcon className="w-6 h-6" /> },
        { name: 'Search', icon: <SearchIcon className="w-6 h-6" /> },
        { name: 'Your Library', icon: <LibraryIcon className="w-6 h-6" /> },
        { name: 'Upload', icon: <UploadIcon className="w-6 h-6" /> },
    ];

    return (
        <aside className="w-64 bg-black text-gray-300 p-2 flex flex-col flex-shrink-0">
            <div className="px-4 py-2 mb-4">
                <h1 className="text-2xl font-bold tracking-wider text-white">STREAMSIC</h1>
            </div>
            <nav className="flex-1">
                <ul>
                    {navItems.map((item) => (
                        <li key={item.name}>
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setPage(item.name);
                                }}
                                className={`flex items-center gap-4 px-4 py-2 rounded-md font-semibold transition-colors duration-200 ${
                                    currentPage === item.name
                                        ? 'bg-purple-600 text-white'
                                        : 'hover:bg-gray-800'
                                }`}
                            >
                                {item.icon}
                                {item.name}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
            <div>
                <div className="border-t border-gray-800 my-2"></div>
                <div className="px-4 py-2 flex justify-between items-center">
                    <span className="font-semibold">PLAYLISTS</span>
                    <button className="text-gray-400 hover:text-white transition-colors duration-200">
                        <PlusIcon className="w-6 h-6" />
                    </button>
                </div>
                {/* Playlist items would go here */}
            </div>
             <div className="mt-auto p-4">
                <button className="w-full bg-gray-200 text-black font-bold py-2 px-4 rounded-full hover:bg-white transition-transform duration-200 transform hover:scale-105">
                    Sign out
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;