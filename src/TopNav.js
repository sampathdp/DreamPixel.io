import React, { useState } from 'react';
import { FiX, FiMenu } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const TopNav = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => setIsOpen(!isOpen);

    return (
        <div>
            {/* Top Navigation - Visible on larger screens */}
            <nav className="hidden md:flex justify-between items-center bg-gray-800 p-4 z-10 shadow-lg transition-all duration-300 ease-in-out transform hover:shadow-2xl">
                <h1 className="text-2xl font-bold text-white hover:text-indigo-400 transition-colors duration-300">MY GAME SITE</h1>
                <div className="space-x-6">
                    <Link to="/" className="text-white hover:text-gray-400 transition-colors duration-300">Home</Link>
                    <Link to="/about" className="text-white hover:text-gray-400 transition-colors duration-300">About</Link>
                    <Link to="/games" className="text-white hover:text-gray-400 transition-colors duration-300">Games</Link>
                </div>
            </nav>

            {/* Sidebar Toggle Button - Visible on mobile devices */}
            <button 
                onClick={toggleSidebar} 
                className="text-white p-4 md:hidden fixed top-4 right-4 z-20 focus:outline-none hover:scale-110 transition-transform duration-300 ease-in-out">
                {isOpen ? <FiX className="text-3xl" /> : <FiMenu className="text-3xl" />}
            </button>

            {/* Sidebar - Visible on mobile devices */}
            <div className={`fixed inset-y-0 left-0 w-64 bg-gray-900 text-white transform transition-transform duration-500 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:hidden z-30`}>
                <nav className="mt-4">
                    <ul className="space-y-2">
                        <li><Link to="/" className="block py-2 px-4 hover:bg-gray-700 transition-colors duration-300 ease-in-out" onClick={toggleSidebar}>Home</Link></li>
                        <li><Link to="/about" className="block py-2 px-4 hover:bg-gray-700 transition-colors duration-300 ease-in-out" onClick={toggleSidebar}>About</Link></li>
                        <li><Link to="/games" className="block py-2 px-4 hover:bg-gray-700 transition-colors duration-300 ease-in-out" onClick={toggleSidebar}>Games</Link></li>
                    </ul>
                </nav>
            </div>

            {/* Overlay - Visible when sidebar is open */}
            {isOpen && (
                <div 
                    onClick={toggleSidebar} 
                    className="fixed inset-0 bg-black opacity-50 transition-opacity duration-500 md:hidden z-20"></div>
            )}

            
        </div>
        
    );
};

export default TopNav;
