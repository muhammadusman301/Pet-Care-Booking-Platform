import React, { useState } from 'react';
import axios from 'axios';




const Register = ({ setView }) => {
    const [role, setRole] = useState('Owner');
    const [formData, setFormData] = useState({
        username: '', email: '', password: '',
        // Owner Details
        pet_name: '', pet_breed: '', pet_age: '', medical_notes: '',
        // Provider Details
        service_type: 'Veterinary Consultation', price: '', available_days: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://127.0.0.1:8000/api/register/', { ...formData, role });
            alert("System Provisioned. Please sign in to your new workspace.");
            setView('login'); // Send to login page
        } catch (err) {
            alert(err.response?.data?.error || "Registration failed. Check network.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] py-12">
            <div className="bg-white p-10 rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-black tracking-tighter text-slate-900">SYSTEM <span className="text-indigo-600">ONBOARDING</span></h1>
                    <p className="text-slate-400 text-xs mt-2 font-bold uppercase tracking-widest">Select your operating mode</p>
                </div>

                {/* Role Toggle */}
                <div className="flex gap-4 mb-8">
                    <button type="button" onClick={() => setRole('Owner')} 
                        className={`flex-1 py-3 font-bold text-xs uppercase tracking-widest border-b-2 transition ${role === 'Owner' ? 'border-indigo-600 text-indigo-600' : 'border-slate-200 text-slate-400 hover:text-slate-600'}`}>
                        Pet Owner (Buyer)
                    </button>
                    <button type="button" onClick={() => setRole('Provider')} 
                        className={`flex-1 py-3 font-bold text-xs uppercase tracking-widest border-b-2 transition ${role === 'Provider' ? 'border-emerald-600 text-emerald-600' : 'border-slate-200 text-slate-400 hover:text-slate-600'}`}>
                        Service Provider (Seller)
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Core Credentials (Always Visible) */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Username</label>
                            <input type="text" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" 
                                onChange={(e) => setFormData({...formData, username: e.target.value})} required />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Email</label>
                            <input type="email" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" 
                                onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Password</label>
                        <input type="password" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" 
                            onChange={(e) => setFormData({...formData, password: e.target.value})} required />
                    </div>

                    <hr className="border-slate-100" />

                    {/* Conditional Deep Details */}
                    {role === 'Owner' ? (
                        <div className="space-y-4">
                            <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest">Initial Asset Profile (Pet)</h3>
                            <div className="grid grid-cols-3 gap-4">
                                <input type="text" placeholder="Pet Name" className="col-span-1 bg-slate-50 border border-slate-200 p-3 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500" onChange={(e) => setFormData({...formData, pet_name: e.target.value})} required />
                                <input type="text" placeholder="Breed" className="col-span-1 bg-slate-50 border border-slate-200 p-3 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500" onChange={(e) => setFormData({...formData, pet_breed: e.target.value})} required />
                                <input type="number" placeholder="Age" className="col-span-1 bg-slate-50 border border-slate-200 p-3 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500" onChange={(e) => setFormData({...formData, pet_age: e.target.value})} required />
                            </div>
                            <textarea placeholder="Medical Notes (Optional)" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500" onChange={(e) => setFormData({...formData, medical_notes: e.target.value})}></textarea>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <h3 className="text-xs font-black text-emerald-600 uppercase tracking-widest">Initial Business Profile (Gig)</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <select className="bg-slate-50 border border-slate-200 p-3 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500" onChange={(e) => setFormData({...formData, service_type: e.target.value})}>
                                    <option>Veterinary Consultation</option>
                                    <option>Professional Grooming</option>
                                    <option>Behavioral Training</option>
                                    <option>Pet Sitting & Boarding</option>
                                </select>
                                <input type="number" placeholder="Base Price ($)" className="bg-slate-50 border border-slate-200 p-3 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500" onChange={(e) => setFormData({...formData, price: e.target.value})} required />
                            </div>
                            <input type="text" placeholder="Availability (e.g., Mon-Fri, 9am-5pm)" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500" onChange={(e) => setFormData({...formData, available_days: e.target.value})} required />
                        </div>
                    )}

                    <button className={`w-full text-white font-bold py-4 rounded-xl shadow-lg transition ${role === 'Owner' ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100'}`}>
                        Execute Provisioning
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button onClick={() => setView('login')} className="text-xs font-bold text-slate-500 hover:text-slate-800 tracking-widest uppercase">
                        Existing User? Authenticate Here
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Register;
