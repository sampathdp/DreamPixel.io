import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPanel = () => {
    const [gameName, setGameName] = useState('');
    const [description, setDescription] = useState('');
    const [thumbnail, setThumbnail] = useState(null);
    const [webglFolder, setWebglFolder] = useState(null);
    const [uploadStatus, setUploadStatus] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [newCategory, setNewCategory] = useState('');
    const [categories, setCategories] = useState([]);  // Ensure categories is an array
    const [activeTab, setActiveTab] = useState('uploadGame');

    // Fetch categories on component mount
useEffect(() => {
    const fetchCategories = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/categories');
            const data = await response.json();
            
            // Access the categories property of the response object
            if (Array.isArray(data.categories)) {
                setCategories(data.categories); // Set the state with the categories array
            } else {
                console.error('Unexpected response format:', data);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    fetchCategories();
}, []);

    
    // Handle new category submission
    const handleCategorySubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/add-category', { categoryName: newCategory });
            setCategories([...categories, { id: response.data.categoryId, name: newCategory }]);
            setNewCategory(''); // Clear input field
        } catch (error) {
            console.error('Error adding category:', error);
        }
    };

    const handleGameSubmit = async (e) => {
        e.preventDefault();

        // Create form data to submit file uploads and game data
        const formData = new FormData();
        formData.append('gameName', gameName);
        formData.append('description', description);
        formData.append('thumbnail', thumbnail);
        formData.append('webglFolder', webglFolder);
        formData.append('categoryId', categoryId);

        try {
            
            setUploadStatus('Upload successful!');
            
            // Clear form details
            setGameName('');
            setDescription('');
            setThumbnail(null); // Clear the thumbnail state
            setWebglFolder(null); // Clear the webglFolder state
            setCategoryId('');

        } catch (error) {
            console.error('Error uploading the game:', error);
            setUploadStatus('Error uploading game.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
            <div className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-lg">
                <div className="flex space-x-4 mb-6">
                    <button
                        onClick={() => setActiveTab('uploadGame')}
                        className={`w-full py-2 rounded-md ${activeTab === 'uploadGame' ? 'bg-blue-600' : 'bg-gray-700'} text-white font-bold`}
                    >
                        Upload Game
                    </button>
                    <button
                        onClick={() => setActiveTab('addCategory')}
                        className={`w-full py-2 rounded-md ${activeTab === 'addCategory' ? 'bg-blue-600' : 'bg-gray-700'} text-white font-bold`}
                    >
                        Add Category
                    </button>
                </div>

                {activeTab === 'uploadGame' && (
                    <div>
                        <h2 className="text-3xl font-bold mb-6 text-center">Upload WebGL Game</h2>
                        <form onSubmit={handleGameSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium mb-1">Game Name:</label>
                                <input
                                    type="text"
                                    value={gameName}
                                    onChange={(e) => setGameName(e.target.value)}
                                    className="w-full p-3 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Description:</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full p-3 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows="4"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Category:</label>
                                <select
                                    value={categoryId}
                                    onChange={(e) => setCategoryId(e.target.value)}
                                    className="w-full p-3 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Select a Category</option>
                                    {categories && categories.map(category => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Thumbnail (Image):</label>
                                <input
                                    type="file"
                                    onChange={(e) => setThumbnail(e.target.files[0])}
                                    accept="image/*"
                                    className="w-full bg-gray-700 text-white rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">WebGL Game Folder (ZIP):</label>
                                <input
                                    type="file"
                                    onChange={(e) => setWebglFolder(e.target.files[0])}
                                    accept=".zip"
                                    className="w-full bg-gray-700 text-white rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-600 py-3 rounded-lg text-white font-bold hover:bg-blue-700 transition-all"
                            >
                                Upload Game
                            </button>

                            {uploadStatus && <p className="mt-4 text-center">{uploadStatus}</p>}
                        </form>
                    </div>
                )}

                {activeTab === 'addCategory' && (
                    <div className="mt-8">
                        <h2 className="text-2xl font-bold mb-4 text-center">Add Category</h2>
                        <form onSubmit={handleCategorySubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium mb-1">New Category Name:</label>
                                <input
                                    type="text"
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                    className="w-full p-3 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-green-600 py-3 rounded-lg text-white font-bold hover:bg-green-700 transition-all"
                            >
                                Add Category
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPanel;
