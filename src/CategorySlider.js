import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CategorySlider = ({ onCategorySelect }) => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        // Fetch categories from the backend
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/categories');
                setCategories(response.data.categories); // Set categories from the response
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    return (
        <div className="category-slider flex overflow-x-auto space-x-4 p-4 bg-gray-900">
            {categories.length > 0 ? (
                categories.map((category) => (
                    <div
                        key={category.id}
                        className="category-item flex-shrink-0 bg-gray-800 text-white rounded-lg py-2 px-4 cursor-pointer"
                        onClick={() => onCategorySelect(category.id)}  // Pass category ID to parent
                    >
                        {category.name}
                    </div>
                ))
            ) : (
                <p className="text-white">No categories available</p>
            )}
        </div>
    );
};

export default CategorySlider;
