import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TopNav from './TopNav'; 

const Homepage = () => {
    const [games, setGames] = useState([]); // Initializing games as an empty array
    const [loading, setLoading] = useState(true); // Track loading state
    const [error, setError] = useState(null); // Track any errors

    useEffect(() => {
        // Fetch games data from the backend API
        axios.get('http://localhost:5000/api/games')
            .then(response => {
                // Check if response data is in the expected format
                if (Array.isArray(response.data.games)) {
                    setGames(response.data.games); // Update games state
                } else {
                    throw new Error('Unexpected response format');
                }
            })
            .catch(err => {
                console.error('Error fetching games data:', err);
                setError('Failed to load games. Please try again later.'); // Set error message
            })
            .finally(() => setLoading(false)); // Set loading to false once done
    }, []);

    if (loading) {
        return <div className="text-center">Loading...</div>; // Show loading state
    }

    if (error) {
        return <div className="text-center text-red-500">{error}</div>; // Show error message
    }

    return (
        <div className="relative min-h-screen bg-gray-50 text-white">
            {/* Top Navigation - Visible on larger screens */}
            <TopNav />

            {/* Hero Section */}
            <header className="relative bg-gradient-to-r from-purple-600 to-blue-600 text-center py-20 z-0">
                <h1 className="text-6xl font-extrabold tracking-wide mb-4 text-shadow-lg animate-pulse">Welcome to WebGL Game World</h1>
                <p className="text-xl mb-8">Play the best WebGL games directly in your browser!</p>
                <button className="px-8 py-4 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-700 hover:shadow-2xl hover:scale-105 transition-transform duration-300 ease-in-out">
                    Start Playing Now
                </button>
            </header>

            {/* Featured Games Section */}
            <section className="p-8 bg-gray-800">
                <h2 className="text-4xl font-bold text-center mb-6 text-shadow-md">Featured Games</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {games.length > 0 ? (
                        games.map((game) => (
                            <div key={game.id} className="bg-gray-700 rounded-lg p-6 hover:shadow-2xl transform hover:scale-105 transition-all duration-300 ease-in-out relative overflow-hidden">
                                <img 
                                    src={game.thumbnailUrl ? `http://localhost:5000${game.thumbnailUrl}` : '/default-thumbnail.png'} 
                                    alt={game.name} 
                                    className="w-full h-40 object-cover rounded-md mb-4 transform hover:scale-110 transition-transform duration-500 ease-in-out" 
                                    crossorigin="anonymous"
                               />
                                <h3 className="text-2xl font-semibold">{game.name}</h3>
                                <p className="text-sm mt-2 mb-4 opacity-80">{game.description || 'A short description of the WebGL game.'}</p>
                                <button 
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 hover:shadow-lg transition-all duration-300" 
                                    onClick={() => window.open(`http://localhost:5000${game.gameUrl}/index.html`, '_blank')}
                                >
                                    Play Now
                                </button>
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-40 rounded-lg pointer-events-none"></div>
                            </div>
                        ))
                    ) : (
                        <p>No games available</p>
                    )}
                </div>
            </section>

            {/* Popular Games Section */}
            <section className="p-8 bg-gray-800">
    <h2 className="text-4xl font-bold text-center mb-6 text-shadow-md">Featured Games</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {games.length > 0 ? (
            games.map((game) => (
                <div 
                    key={game.id} // Ensure each game has a unique key prop
                    className="bg-gray-700 rounded-lg p-6 hover:shadow-2xl transform hover:scale-105 transition-all duration-300 ease-in-out relative overflow-hidden"
                >
                    <img 
                        src={`http://localhost:5000${game.thumbnailUrl}`} 
                        alt={game.name} 
                        className="w-full h-40 object-cover rounded-md mb-4 transform hover:scale-110 transition-transform duration-500 ease-in-out" 
                        crossorigin="anonymous"
                    />
                    <h3 className="text-2xl font-semibold">{game.name}</h3>
                    <p className="text-sm mt-2 mb-4 opacity-80">{game.description || 'A short description of the WebGL game.'}</p>
                    <button 
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 hover:shadow-lg transition-all duration-300" 
                        onClick={() => window.open(`http://localhost:5000${game.gameUrl}/index.html`, '_blank')}
                    >
                        Play Now
                    </button>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-40 rounded-lg pointer-events-none"></div>
                </div>
            ))
        ) : (
            <p>No games available</p>
        )}
    </div>
</section>

            {/* Footer */}
            <footer className="py-8 bg-gray-800 text-center text-sm">
                <p>&copy; 2024 WebGL Game World. All rights reserved.</p>
                <p>Developed with ❤️ by Game Dev Team</p>
            </footer>
        </div>
    );
};

export default Homepage;
