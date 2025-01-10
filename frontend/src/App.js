// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import Home from './components/Home';
import CollectionPoints from './pages/CollectionPoints';
import Devices from './pages/DevicesAdmin';
import DevicesUser from './pages/DevicesUser';
import UserProfil from './pages/UserProfil';
import UsersAdmin from './pages/UsersAdmin';
import Depots from './pages/Depots';
import DepotsHistory from './pages/DepotsHistory';
import DepotsHistoryAdmin from './pages/DepotsHistoryAdmin';

import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/" element={<Home />} />
                <Route path="/collection-points" element={<CollectionPoints />} />
                <Route path="/depots" element={<ProtectedRoute element={<Depots />} />} />
                <Route path="/depots-history" element={<ProtectedRoute element={<DepotsHistory />} />} />
                <Route path="/depots-history-admin" element={<ProtectedRoute element={<DepotsHistoryAdmin />} />} />
                {/* Redirection selon le rôle */}
                <Route path="/userProfil" element={<UserProfil />} />
                <Route path="/users-admin" element={<UsersAdmin />} />

                <Route path="/devices-admin" element={<Devices />} />
                <Route path="/devices" element={<DevicesUser />} />
            </Routes>
        </Router>
    );
};

export default App;
