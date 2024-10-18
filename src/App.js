import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './Homepage';
import AdminLogin from './Admin/AdminLogin';
import AdminPanel from './Admin/AdminPanel'; // Ensure you have this import
import GamesPage from './GamesPage'; // Create a GamesPage component

function App() {
    return (
        <Router>
            <Routes>
            <Route path="/" element={<Homepage />} />
            
                <Route path="/admin/admin-login" element={<AdminLogin />} />
                <Route path="/admin/AdminPanel" element={<AdminPanel />} /> {/* Ensure this route is correct */}
                <Route path="/games" element={<GamesPage />} />  {/* Games Route */}            
            </Routes>
        </Router>
    );
}

export default App;
