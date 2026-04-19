import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReviewForm from './ReviewForm';

// IMPORTING OUR MODULAR TABS
import OrderDeskTab from './components/OrderDeskTab';
import MyGigsTab from './components/MyGigsTab';
import FinancialsTab from './components/FinancialsTab';

const ProviderDashboard = ({ token }) => {
    // 1. Data State
    const [tasks, setTasks] = useState([]);
    const [services, setServices] = useState([]);
    const [messages, setMessages] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [reviews, setReviews] = useState([]);
    
    // 2. UI Routing State
    const [activeTab, setActiveTab] = useState('orders'); 
    
    // 3. Modal States
    const [activeChat, setActiveChat] = useState(null); 
    const [showProfile, setShowProfile] = useState(false);
    const [viewingPet, setViewingPet] = useState(null);
    const [showCreateGig, setShowCreateGig] = useState(false);
    const [editingGig, setEditingGig] = useState(null);
    const [reviewingTask, setReviewingTask] = useState(null);
    const [viewingPublicProfile, setViewingPublicProfile] = useState(null); // NEW: Public Profile Modal
    const [viewingImage, setViewingImage] = useState(null); // NEW: Full-Screen Image View
    
    // 4. Form States
    const [newMessage, setNewMessage] = useState('');
    const [profileData, setProfileData] = useState({ 
        username: '', email: '', password: '', phone: '', location: '', bio: '', profile_image_url: '', years_experience: '', certifications: '', service_radius: '' 
    });

    const config = { headers: { Authorization: `Bearer ${token}` } };

    const loadData = async () => {
        try {
            const timestamp = new Date().getTime();
            const [taskRes, serviceRes, msgRes, invRes, profileRes, reviewRes] = await Promise.all([
                axios.get(`http://127.0.0.1:8000/api/bookings/?t=${timestamp}`, config),
                axios.get(`http://127.0.0.1:8000/api/services/?t=${timestamp}`, config),
                axios.get(`http://127.0.0.1:8000/api/messages/?t=${timestamp}`, config),
                axios.get(`http://127.0.0.1:8000/api/invoices/?t=${timestamp}`, config),
                axios.get(`http://127.0.0.1:8000/api/auth/me/?t=${timestamp}`, config),
                axios.get(`http://127.0.0.1:8000/api/reviews/?t=${timestamp}`, config)
            ]);
            
            setTasks(taskRes.data); setServices(serviceRes.data); setMessages(msgRes.data); setInvoices(invRes.data); setReviews(reviewRes.data);
            
            if (!showProfile) {
                setProfileData({
                    username: profileRes.data.username, email: profileRes.data.email, password: '', 
                    phone: profileRes.data.phone || '', location: profileRes.data.location || '', 
                    bio: profileRes.data.bio || '', profile_image_url: profileRes.data.profile_image_url || '',
                    years_experience: profileRes.data.years_experience || 0, certifications: profileRes.data.certifications || '', service_radius: profileRes.data.service_radius || 5
                });
            }
        } catch (err) { console.error(err); }
    };

    useEffect(() => { loadData(); const interval = setInterval(loadData, 10000); return () => clearInterval(interval); }, [token]);

    const updateProfile = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...profileData }; if (!payload.password) delete payload.password;
            await axios.put('http://127.0.0.1:8000/api/auth/me/', payload, config); 
            alert("Portfolio updated!"); setShowProfile(false); loadData();
        } catch (err) { alert("Update failed."); }
    };

    const handleCreateGig = async (formData) => { try { await axios.post('http://127.0.0.1:8000/api/services/', formData, config); alert("Gig Published!"); setShowCreateGig(false); loadData(); } catch (err) { alert("Failed to create gig."); } };
    const handleUpdateGig = async (formData) => { try { await axios.put(`http://127.0.0.1:8000/api/services/${editingGig.id}/`, formData, config); alert("Gig Updated!"); setEditingGig(null); loadData(); } catch (err) { alert("Failed to update gig."); } };
    const handleDeleteGig = async (id) => { if (window.confirm("Delete this gig?")) { try { await axios.delete(`http://127.0.0.1:8000/api/services/${id}/`, config); loadData(); } catch (err) { alert("Delete failed."); } } };
    const updateTaskStatus = async (taskId, newStatus) => { try { await axios.patch(`http://127.0.0.1:8000/api/bookings/${taskId}/`, { status: newStatus }, config); loadData(); } catch (err) { alert("Status update failed."); } };
    const openChat = async (task) => { setActiveChat(task); await axios.post('http://127.0.0.1:8000/api/messages/mark_read/', { booking_context: task.id }, config); loadData(); };
    const sendChatMessage = async (e) => { e.preventDefault(); try { await axios.post('http://127.0.0.1:8000/api/messages/', { receiver: activeChat.owner_id, booking_context: activeChat.id, content: newMessage }, config); setNewMessage(''); loadData(); } catch (err) { alert("Failed to send message."); } };

    const BooleanDetail = ({ label, value }) => (
        <div className="flex justify-between items-center py-2 border-b border-slate-800 last:border-0">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">{label}</span>
            <span className={`text-xs font-black ${value ? 'text-emerald-400' : 'text-slate-500'}`}>{value ? '✓ YES' : '✕ NO'}</span>
        </div>
    );

    const totalEarnings = invoices.filter(inv => inv.is_paid).reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
    const maxGigsReached = services.length >= 3;

    return (
        <div className="min-h-screen bg-[#0F172A] font-sans text-slate-300">
            <header className="bg-slate-900 border-b border-slate-800 px-8 py-4 flex justify-between items-center sticky top-0 z-40 shadow-xl">
                <div className="flex items-center gap-8">
                    <h1 className="text-2xl font-black text-white tracking-tighter">PET<span className="text-emerald-500">MARKET</span></h1>
                    <nav className="hidden md:flex gap-2 bg-slate-800 p-1 rounded-lg border border-slate-700">
                        <button onClick={() => setActiveTab('orders')} className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-md transition ${activeTab === 'orders' ? 'bg-slate-700 shadow-sm text-emerald-400' : 'text-slate-400 hover:text-white'}`}>Order Desk</button>
                        <button onClick={() => setActiveTab('gigs')} className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-md transition ${activeTab === 'gigs' ? 'bg-slate-700 shadow-sm text-emerald-400' : 'text-slate-400 hover:text-white'}`}>My Gigs</button>
                        <button onClick={() => setActiveTab('financials')} className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-md transition ${activeTab === 'financials' ? 'bg-slate-700 shadow-sm text-emerald-400' : 'text-slate-400 hover:text-white'}`}>Financials</button>
                    </nav>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => setShowProfile(true)} className="flex items-center gap-2 text-xs font-bold text-emerald-400 border border-emerald-900 bg-emerald-900/30 px-4 py-2 rounded-lg transition uppercase tracking-widest">
                        {profileData.profile_image_url && <img src={profileData.profile_image_url} alt="Avatar" className="w-5 h-5 rounded-full object-cover" />} Business Profile
                    </button>
                    <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="text-xs font-bold text-slate-400 border border-slate-700 px-4 py-2 rounded-lg transition uppercase tracking-widest">Exit</button>
                </div>
            </header>

            <main className="p-8 max-w-7xl mx-auto">
                {activeTab === 'orders' && (
                    <OrderDeskTab tasks={tasks} messages={messages} reviews={reviews} setViewingPet={setViewingPet} updateTaskStatus={updateTaskStatus} setReviewingTask={setReviewingTask} openChat={openChat} setViewingPublicProfile={setViewingPublicProfile} />
                )}

                {activeTab === 'gigs' && (
                    <MyGigsTab services={services} showCreateGig={showCreateGig} setShowCreateGig={setShowCreateGig} editingGig={editingGig} setEditingGig={setEditingGig} maxGigsReached={maxGigsReached} handleCreateGig={handleCreateGig} handleUpdateGig={handleUpdateGig} handleDeleteGig={handleDeleteGig} />
                )}

                {activeTab === 'financials' && (
                    <FinancialsTab totalEarnings={totalEarnings} />
                )}
            </main>

            {/* PUBLIC PROFILE MODAL (SOCIAL MEDIA STYLE) */}
            {viewingPublicProfile && (
                <div className="fixed inset-0 bg-slate-900/80 flex items-center justify-center p-4 z-[70] backdrop-blur-sm">
                    <div className="bg-slate-900 border border-slate-700 p-8 rounded-3xl w-full max-w-md shadow-2xl relative text-center">
                        <button onClick={() => setViewingPublicProfile(null)} className="absolute top-6 right-6 text-slate-500 hover:text-red-500 font-black text-lg transition">✕</button>
                        
                        {viewingPublicProfile.avatar ? (
                            <img 
                                src={viewingPublicProfile.avatar} 
                                alt="Profile" 
                                className="w-32 h-32 rounded-full object-cover mx-auto mb-4 border-4 border-emerald-900/50 shadow-md cursor-pointer hover:border-emerald-500 transition" 
                                onClick={() => setViewingImage(viewingPublicProfile.avatar)} 
                            />
                        ) : (
                            <div className="w-32 h-32 bg-slate-800 rounded-full flex items-center justify-center text-emerald-500 font-black text-5xl mx-auto mb-4 border-4 border-slate-700">
                                {viewingPublicProfile.name.charAt(0)}
                            </div>
                        )}
                        
                        <h2 className="text-3xl font-black text-white">{viewingPublicProfile.name}</h2>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1 mb-4">📍 {viewingPublicProfile.location || 'Location Not Specified'}</p>
                        
                        <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 text-sm text-slate-300 italic whitespace-pre-wrap">
                            "{viewingPublicProfile.bio || 'This user has not provided a bio yet.'}"
                        </div>
                    </div>
                </div>
            )}

            {/* FULL SCREEN IMAGE VIEWER */}
            {viewingImage && (
                <div className="fixed inset-0 bg-slate-900/95 flex items-center justify-center p-4 z-[100] backdrop-blur-sm" onClick={() => setViewingImage(null)}>
                    <button onClick={() => setViewingImage(null)} className="absolute top-6 right-6 text-white hover:text-red-500 font-black text-2xl transition">✕</button>
                    <img src={viewingImage} alt="Expanded View" className="max-w-full max-h-[90vh] rounded-2xl shadow-2xl object-contain border-4 border-slate-700" />
                </div>
            )}

            {reviewingTask && (
                <ReviewForm bookingId={reviewingTask.id} revieweeId={reviewingTask.revieweeId} revieweeName={reviewingTask.revieweeName} token={token} isDark={true} onCancel={() => setReviewingTask(null)} onSuccess={() => { setReviewingTask(null); loadData(); }} />
            )}

            {/* DEEP PET INSPECTION MODAL */}
            {viewingPet && (
                <div className="fixed inset-0 bg-slate-900/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <div className="bg-slate-900 rounded-3xl w-full max-w-4xl shadow-2xl flex flex-col md:flex-row overflow-hidden max-h-[90vh] border border-slate-700">
                        {/* LEFT SIDE: Basics & Medical */}
                        <div className="md:w-1/2 bg-slate-800 p-8 overflow-y-auto border-r border-slate-700">
                            <div className="flex items-center gap-4 mb-6 border-b border-slate-700 pb-6">
                                {viewingPet.pet_photo_url ? (
                                    <img 
                                        src={viewingPet.pet_photo_url} 
                                        alt="Pet" 
                                        className="w-20 h-20 rounded-full object-cover border-2 border-emerald-500/30 cursor-pointer hover:border-emerald-500 transition" 
                                        onClick={() => setViewingImage(viewingPet.pet_photo_url)}
                                    />
                                ) : (
                                    <div className="w-20 h-20 bg-slate-700 rounded-full flex items-center justify-center text-emerald-500 font-black text-3xl">
                                        {viewingPet.name.charAt(0)}
                                    </div>
                                )}
                                <div><h2 className="text-3xl font-black text-white leading-tight">{viewingPet.name}</h2><p className="text-xs font-bold text-emerald-400 uppercase tracking-widest">{viewingPet.breed} • {viewingPet.age} Yrs • {viewingPet.gender}</p></div>
                            </div>
                            
                            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Health & Medical Profile</h3>
                            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-700 mb-6 space-y-2">
                                <div className="flex justify-between text-sm"><span className="text-slate-400">Vaccinations</span><span className={`font-bold ${viewingPet.vaccination_status === 'Up to date' ? 'text-emerald-400' : 'text-red-400'}`}>{viewingPet.vaccination_status}</span></div>
                                <div className="flex justify-between text-sm"><span className="text-slate-400">Weight</span><span className="font-bold text-white">{viewingPet.weight} kg</span></div>
                                <div className="flex justify-between text-sm"><span className="text-slate-400">Vet Clinic</span><span className="font-bold text-white">{viewingPet.vet_clinic_name || 'N/A'}</span></div>
                                {viewingPet.medical_conditions && (
                                    <div className="pt-3 mt-3 border-t border-slate-700">
                                        <p className="text-[10px] text-red-400 font-bold uppercase tracking-widest mb-1">Medical Conditions</p>
                                        <p className="text-sm text-slate-300">{viewingPet.medical_conditions}</p>
                                    </div>
                                )}
                                {viewingPet.allergies && (
                                    <div className="pt-3">
                                        <p className="text-[10px] text-red-400 font-bold uppercase tracking-widest mb-1">Allergies</p>
                                        <p className="text-sm text-slate-300">{viewingPet.allergies}</p>
                                    </div>
                                )}
                            </div>

                            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Owner Instructions</h3>
                            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-700 mb-6">
                                <p className="text-sm text-slate-300 whitespace-pre-wrap">{viewingPet.owner_instructions || "No special instructions provided."}</p>
                            </div>

                            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Community Trust (Owner Reviews)</h3>
                            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-700">
                                {reviews.filter(r => r.reviewee === viewingPet.owner_id).length === 0 ? (
                                    <p className="text-sm text-slate-500 italic">This owner has no reviews yet.</p>
                                ) : (
                                    <div className="space-y-4">
                                        {reviews.filter(r => r.reviewee === viewingPet.owner_id).map(r => (
                                            <div key={r.id} className="p-4 bg-slate-800 rounded-xl border border-slate-700">
                                                <div className="flex items-center gap-3 mb-2">
                                                    {r.reviewer_avatar ? (
                                                        <img src={r.reviewer_avatar} alt="User" className="w-6 h-6 rounded-full object-cover" />
                                                    ) : (
                                                        <div className="w-6 h-6 bg-emerald-900/50 rounded-full flex items-center justify-center text-[10px] font-black text-emerald-500">
                                                            {r.reviewer_name.charAt(0)}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="text-[10px] font-bold text-white">{r.reviewer_name}</p>
                                                        <p className="text-[8px] text-amber-500">{'⭐'.repeat(r.rating)}</p>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-slate-400">"{r.comment}"</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* RIGHT SIDE: Behaviour & Routine */}
                        <div className="md:w-1/2 bg-slate-900 p-8 overflow-y-auto relative">
                            <button onClick={() => setViewingPet(null)} className="absolute top-6 right-6 text-slate-500 hover:text-red-500 font-black text-lg transition">✕</button>
                            
                            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Behavioural Profile</h3>
                            <div className="grid grid-cols-1 gap-y-1 mb-6">
                                <div className="flex justify-between items-center py-2 border-b border-slate-800"><span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Temperament</span><span className="text-sm font-black text-white">{viewingPet.temperament}</span></div>
                                <div className="flex justify-between items-center py-2 border-b border-slate-800"><span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Good with Dogs</span><span className="text-sm font-black text-white">{viewingPet.good_with_dogs}</span></div>
                                <div className="flex justify-between items-center py-2 border-b border-slate-800"><span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Good with Children</span><span className="text-sm font-black text-white">{viewingPet.good_with_children}</span></div>
                                <BooleanDetail label="Separation Anxiety" value={viewingPet.separation_anxiety} />
                                <BooleanDetail label="Bite History" value={viewingPet.bite_history} />
                                <BooleanDetail label="Escape Risk" value={viewingPet.escape_risk} />
                                <BooleanDetail label="Dangerous Breed (UK Law)" value={viewingPet.dangerous_dog_breed} />
                            </div>

                            {viewingPet.triggers && (
                                <div className="bg-red-900/10 border border-red-900/30 p-4 rounded-xl mb-6">
                                    <h4 className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-1">Known Triggers</h4>
                                    <p className="text-sm text-red-200">{viewingPet.triggers}</p>
                                </div>
                            )}

                            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Daily Routine & Handling</h3>
                            <div className="space-y-2">
                                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                                    <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest mb-1">Feeding</p>
                                    <p className="text-sm text-slate-300">{viewingPet.feeding_schedule || 'Not specified'} • {viewingPet.food_brand}</p>
                                </div>
                                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                                    <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest mb-1">Walking</p>
                                    <p className="text-sm text-slate-300">{viewingPet.walk_frequency || 'Not specified'} • {viewingPet.walk_duration}</p>
                                </div>
                                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                                    <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest mb-1">Handling Notes</p>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {viewingPet.leash_trained && <span className="bg-slate-700 text-[9px] font-bold uppercase px-2 py-1 rounded text-slate-300 border border-slate-600">Leash Trained</span>}
                                        {viewingPet.house_trained && <span className="bg-slate-700 text-[9px] font-bold uppercase px-2 py-1 rounded text-slate-300 border border-slate-600">House Trained</span>}
                                        {!viewingPet.bath_friendly && <span className="bg-amber-900/30 text-[9px] font-bold uppercase px-2 py-1 rounded text-amber-400 border border-amber-900/50">Dislikes Baths</span>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Profile Settings Modal */}
            {showProfile && (
                <div className="fixed inset-0 bg-slate-900/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <div className="bg-slate-900 p-8 rounded-3xl w-full max-w-md border border-slate-700 shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <div><h2 className="text-2xl font-black text-white">Business Profile</h2></div>
                            <button onClick={() => setShowProfile(false)} className="text-slate-500 hover:text-red-500 font-bold text-sm transition">✕ Close</button>
                        </div>
                        <form onSubmit={updateProfile} className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Upload Avatar (From PC)</label>
                                <input 
                                    type="file" accept="image/*"
                                    className="w-full bg-slate-800 border border-slate-700 p-2 rounded-xl text-sm text-slate-300 outline-none focus:border-emerald-500 cursor-pointer" 
                                    onChange={e => {
                                        const file = e.target.files[0];
                                        const reader = new FileReader();
                                        reader.onloadend = () => setProfileData({...profileData, profile_image_url: reader.result});
                                        if (file) reader.readAsDataURL(file);
                                    }} 
                                />
                                {profileData.profile_image_url && <img src={profileData.profile_image_url} alt="Preview" className="h-16 w-16 object-cover mt-2 rounded-xl shadow-sm border border-slate-700" />}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Email</label><input type="email" className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl text-sm text-white outline-none focus:border-emerald-500" value={profileData.email} onChange={e => setProfileData({...profileData, email: e.target.value})} required /></div>
                                <div><label className="text-[10px] font-black text-slate-500 uppercase block mb-1">New Password</label><input type="password" placeholder="Leave blank to keep" className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl text-sm text-white outline-none focus:border-emerald-500" value={profileData.password} onChange={e => setProfileData({...profileData, password: e.target.value})} /></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Location</label><input type="text" className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl text-sm text-white outline-none focus:border-emerald-500" value={profileData.location} onChange={e => setProfileData({...profileData, location: e.target.value})} required /></div>
                                <div><label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Radius (Miles)</label><input type="number" className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl text-sm text-white outline-none focus:border-emerald-500" value={profileData.service_radius} onChange={e => setProfileData({...profileData, service_radius: e.target.value})} /></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Years Exp.</label><input type="number" className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl text-sm text-white outline-none focus:border-emerald-500" value={profileData.years_experience} onChange={e => setProfileData({...profileData, years_experience: e.target.value})} /></div>
                                <div><label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Phone</label><input type="text" className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl text-sm text-white outline-none focus:border-emerald-500" value={profileData.phone} onChange={e => setProfileData({...profileData, phone: e.target.value})} /></div>
                            </div>
                            <div><label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Certifications</label><input type="text" className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl text-sm text-white outline-none focus:border-emerald-500" value={profileData.certifications} onChange={e => setProfileData({...profileData, certifications: e.target.value})} /></div>
                            <div><label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Bio</label><textarea rows="2" className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl text-sm text-white outline-none focus:border-emerald-500" value={profileData.bio} onChange={e => setProfileData({...profileData, bio: e.target.value})} /></div>
                            <button type="submit" className="w-full bg-emerald-600 text-white font-black uppercase tracking-widest py-4 rounded-xl text-xs mt-4 shadow-lg hover:bg-emerald-500 transition">Save Profile</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Chat Modal */}
            {activeChat && (
                <div className="fixed inset-0 bg-slate-900/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <div className="bg-slate-900 p-6 rounded-3xl w-full max-w-lg border border-slate-700 shadow-2xl flex flex-col h-[600px]">
                        <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-4">
                            <div><h2 className="text-lg font-black text-white">Client Inbox</h2><p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{activeChat.owner_name}</p></div>
                            <button onClick={() => setActiveChat(null)} className="text-slate-500 hover:text-red-500 font-bold text-sm transition uppercase tracking-widest">✕ Close</button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-800/50 rounded-2xl mb-4 border border-slate-800">
                            {messages.filter(m => m.booking_context === activeChat.id).map(msg => {
                                const isMe = msg.sender !== activeChat.owner_id;
                                return (
                                    <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">{msg.sender_name}</span>
                                        <div className={`p-3 rounded-2xl max-w-[80%] text-sm shadow-sm ${isMe ? 'bg-emerald-600 text-white rounded-tr-sm' : 'bg-slate-700 border border-slate-600 text-white rounded-tl-sm'}`}>
                                            {msg.content}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        <form onSubmit={sendChatMessage} className="flex gap-2">
                            <input type="text" className="flex-1 bg-slate-800 border border-slate-700 p-4 rounded-xl text-sm text-white outline-none focus:border-emerald-500 transition" placeholder="Type your message..." value={newMessage} onChange={e => setNewMessage(e.target.value)} required />
                            <button type="submit" className="bg-emerald-600 text-white px-6 font-black uppercase tracking-widest text-xs rounded-xl shadow-lg hover:bg-emerald-500 transition">Send</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProviderDashboard;
