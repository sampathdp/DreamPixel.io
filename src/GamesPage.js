import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TopNav from './TopNav';
import CategorySlider from './CategorySlider';

const GamesPage = () => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null); // Track selected category

    // Fetch all games or games by selected category
    const fetchGames = (categoryId = null) => {
        setLoading(true);
        let url = 'http://localhost:5000/api/games';
        if (categoryId) {
            url = `http://localhost:5000/api/games/category/${categoryId}`;  // Fetch games by category
        }

        axios.get(url)
            .then(response => {
                if (Array.isArray(response.data.games)) {
                    setGames(response.data.games);
                } else {
                    throw new Error('Unexpected response format');
                }
            })
            .catch(err => {
                console.error('Error fetching games:', err);
                setError('Failed to load games. Please try again later.');
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        // Fetch all games on initial load
        fetchGames();
    }, []);

    // Handle category selection
    const handleCategorySelect = (categoryId) => {
        setSelectedCategory(categoryId);
        fetchGames(categoryId);  // Fetch games based on selected category
    };

    if (loading) {
        return <div className="text-center">Loading...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500">{error}</div>;
    }

    return (
        <div className="p-8 bg-gray-800 text-white">
            {/* Top Navigation - Visible on larger screens */}
            <TopNav />
            {/* Category Slider - Pass the handleCategorySelect function */}
            <CategorySlider onCategorySelect={handleCategorySelect} />
            <h2 className="text-4xl font-bold text-center mb-6">{selectedCategory ? 'Category Games' : 'All Games'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {games.length > 0 ? (
                    games.map((game) => (
                        <div key={game.id} className="bg-gray-700 rounded-lg p-6 hover:shadow-2xl transform hover:scale-105 transition-all duration-300 ease-in-out relative overflow-hidden">
                            <img 
                                src={game.thumbnailUrl ? `http://localhost:5000${game.thumbnailUrl}` : '/default-thumbnail.png'} 
                                alt={game.name} 
                                className="w-full h-40 object-cover rounded-md mb-4 transform hover:scale-110 transition-transform duration-500 ease-in-out" 
                                crossOrigin="anonymous"
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
        </div>
    );
};

export default GamesPage;
