import React, { useState } from 'react';
import axios from 'axios';

const Auth = ({ setToken }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [role, setRole] = useState('Owner');
    const [formData, setFormData] = useState({
        username: '', email: '', password: '', location: '',
        pet_name: '', pet_breed: '', pet_age: '',
        years_experience: '', certifications: '', bio: ''
    });

    const handleAuth = async (e) => {
        e.preventDefault();
        try {
            if (isLogin) {
                const res = await axios.post('http://127.0.0.1:8000/api/token/', { username: formData.username, password: formData.password });
                localStorage.setItem('access_token', res.data.access);
                setToken(res.data.access);
            } else {
                await axios.post('http://127.0.0.1:8000/api/register/', { ...formData, role });
                alert("Account Provisioned! You can now log in.");
                setIsLogin(true);
            }
        } catch (err) { alert(err.response?.data?.error || "Authentication failed."); }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#F1F5F9] py-10 font-sans">
            <div className="bg-white p-10 rounded-2xl shadow-xl border border-slate-200 w-full max-w-xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tighter">PET<span className="text-indigo-600">MARKET</span></h1>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{isLogin ? 'Secure System Login' : 'Marketplace Onboarding'}</p>
                </div>

                {!isLogin && (
                    <div className="flex gap-2 mb-6">
                        <button type="button" onClick={() => setRole('Owner')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest rounded-lg transition ${role === 'Owner' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>Buyer (Owner)</button>
                        <button type="button" onClick={() => setRole('Provider')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest rounded-lg transition ${role === 'Provider' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>Seller (Provider)</button>
                    </div>
                )}

                <form onSubmit={handleAuth} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <input type="text" placeholder="Username" className="w-full bg-slate-50 border p-3 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500" onChange={(e) => setFormData({...formData, username: e.target.value})} required />
                        <input type="password" placeholder="Password" className="w-full bg-slate-50 border p-3 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500" onChange={(e) => setFormData({...formData, password: e.target.value})} required />
                    </div>

                    {!isLogin && (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <input type="email" placeholder="Email Address" className="w-full bg-slate-50 border p-3 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500" onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                                <input type="text" placeholder="City, Postcode (e.g. London, E1)" className="w-full bg-slate-50 border p-3 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500" onChange={(e) => setFormData({...formData, location: e.target.value})} required />
                            </div>

                            <hr className="my-4 border-slate-100" />

                            {role === 'Owner' ? (
                                <div className="space-y-4">
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Initial Pet Asset</h3>
                                    <div className="grid grid-cols-3 gap-4">
                                        <input type="text" placeholder="Pet Name" className="bg-slate-50 border p-3 rounded-lg text-sm outline-none" onChange={(e) => setFormData({...formData, pet_name: e.target.value})} required />
                                        <input type="text" placeholder="Breed" className="bg-slate-50 border p-3 rounded-lg text-sm outline-none" onChange={(e) => setFormData({...formData, pet_breed: e.target.value})} required />
                                        <input type="number" placeholder="Age" className="bg-slate-50 border p-3 rounded-lg text-sm outline-none" onChange={(e) => setFormData({...formData, pet_age: e.target.value})} required />
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Professional Identity</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input type="number" placeholder="Years of Experience" className="bg-slate-50 border p-3 rounded-lg text-sm outline-none" onChange={(e) => setFormData({...formData, years_experience: e.target.value})} required />
                                        <input type="text" placeholder="Certifications (e.g. CPR)" className="bg-slate-50 border p-3 rounded-lg text-sm outline-none" onChange={(e) => setFormData({...formData, certifications: e.target.value})} />
                                    </div>
                                    <textarea placeholder="Professional Bio (Who are you?)" className="w-full bg-slate-50 border p-3 rounded-lg text-sm outline-none" rows="2" onChange={(e) => setFormData({...formData, bio: e.target.value})} required></textarea>
                                </div>
                            )}
                        </>
                    )}
                    <button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition shadow-lg mt-4">
                        {isLogin ? 'Authenticate' : 'Complete Provisioning'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button onClick={() => setIsLogin(!isLogin)} className="text-xs font-bold text-indigo-600 hover:underline uppercase tracking-widest">
                        {isLogin ? 'Create New Account' : 'Existing User? Log In'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Auth;