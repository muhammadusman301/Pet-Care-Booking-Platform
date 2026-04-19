import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Auth from './Auth';
import Dashboard from './Dashboard';
import ProviderDashboard from './ProviderDashboard';





const App = () => {
    const [token, setToken] = useState(localStorage.getItem('access_token'));
    const [isProvider, setIsProvider] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (token) {
            axios.get('http://127.0.0.1:8000/api/auth/me/', { headers: { Authorization: `Bearer ${token}` } })
            .then(res => {
                setIsProvider(res.data.is_provider);
                setIsLoading(false);
            })
            .catch(() => {
                localStorage.removeItem('access_token');
                setToken(null);
                setIsLoading(false);
            });
        } else {
            setIsLoading(false);
        }
    }, [token]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                <h2 className="text-indigo-600 font-black tracking-widest uppercase text-sm">Authenticating</h2>
            </div>
        );
    }

    if (!token) return <Auth setToken={setToken} />;

    return isProvider ? <ProviderDashboard token={token} /> : <Dashboard token={token} />;
};

export default App;
