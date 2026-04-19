import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ setToken, setView }) => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });


    

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://127.0.0.1:8000/api/token/', credentials);
            localStorage.setItem('access_token', res.data.access);
            setToken(res.data.access);
        } catch (err) { alert("Invalid Credentials"); }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
            <div className="bg-white p-10 rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md">
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-black tracking-tighter text-slate-900">SYSTEM <span className="text-indigo-600">LOGIN</span></h1>
                    <p className="text-slate-400 text-xs mt-2 font-bold uppercase tracking-widest">Authentication Required</p>
                </div>
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Username</label>
                        <input type="text" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" 
                            onChange={(e) => setCredentials({...credentials, username: e.target.value})} required />
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Password</label>
                        <input type="password" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" 
                            onChange={(e) => setCredentials({...credentials, password: e.target.value})} required />
                    </div>
                    <button className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-slate-800 transition">
                        Authorize Session
                    </button>
                </form>
                <div className="mt-6 text-center">
                    <button onClick={() => setView('register')} className="text-xs font-bold text-slate-500 hover:text-indigo-600 tracking-widest uppercase">
                        New User? Provision Account
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
