import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReviewForm from './ReviewForm';
import MarketplaceTab from './components/MarketplaceTab';
import OwnerBookingsTab from './components/OwnerBookingsTab';
import MyPetsTab from './components/MyPetsTab';

const Dashboard = ({ token }) => {
    // 1. Data State
    const [pets, setPets] = useState([]);
    const [gigs, setGigs] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [messages, setMessages] = useState([]);
    const [reviews, setReviews] = useState([]);
    
    // 2. UI Routing State
    const [activeTab, setActiveTab] = useState('marketplace'); 
    const [searchLocation, setSearchLocation] = useState('');
    
    // 3. Modal States
    const [activeGig, setActiveGig] = useState(null); 
    const [activeChat, setActiveChat] = useState(null); 
    const [showProfile, setShowProfile] = useState(false);
    const [showCreatePet, setShowCreatePet] = useState(false);
    const [editingPet, setEditingPet] = useState(null);
    const [reviewingBooking, setReviewingBooking] = useState(null);
    const [viewingPublicProfile, setViewingPublicProfile] = useState(null); 
    const [viewingImage, setViewingImage] = useState(null); 
    
    // 4. Form States
    const [bookingForm, setBookingForm] = useState({ pet: '' });
    const [newMessage, setNewMessage] = useState('');
    const [profileData, setProfileData] = useState({ 
        username: '', email: '', password: '', phone: '', location: '', bio: '', profile_image_url: '', property_type: '', emergency_contact: '' 
    });

    const config = { headers: { Authorization: `Bearer ${token}` } };

    const loadData = async () => {
        try {
            const timestamp = new Date().getTime(); 
            const gigUrl = searchLocation ? `http://127.0.0.1:8000/api/services/?location=${searchLocation}&t=${timestamp}` : `http://127.0.0.1:8000/api/services/?t=${timestamp}`;

            const [petRes, gigRes, bookRes, invRes, msgRes, profileRes, reviewRes] = await Promise.all([
                axios.get(`http://127.0.0.1:8000/api/pets/?t=${timestamp}`, config),
                axios.get(gigUrl, config),
                axios.get(`http://127.0.0.1:8000/api/bookings/?t=${timestamp}`, config),
                axios.get(`http://127.0.0.1:8000/api/invoices/?t=${timestamp}`, config),
                axios.get(`http://127.0.0.1:8000/api/messages/?t=${timestamp}`, config),
                axios.get(`http://127.0.0.1:8000/api/auth/me/?t=${timestamp}`, config),
                axios.get(`http://127.0.0.1:8000/api/reviews/?t=${timestamp}`, config)
            ]);
            
            setPets(petRes.data); setGigs(gigRes.data); setBookings(bookRes.data); setInvoices(invRes.data); setMessages(msgRes.data); setReviews(reviewRes.data);
            
            if (!showProfile) {
                setProfileData({
                    username: profileRes.data.username, email: profileRes.data.email, password: '', 
                    phone: profileRes.data.phone || '', location: profileRes.data.location || '', 
                    bio: profileRes.data.bio || '', profile_image_url: profileRes.data.profile_image_url || '',
                    property_type: profileRes.data.property_type || '', emergency_contact: profileRes.data.emergency_contact || ''
                });
            }
        } catch (err) { console.error("Data load error:", err); }
    };

    useEffect(() => { loadData(); const interval = setInterval(loadData, 10000); return () => clearInterval(interval); }, [searchLocation, token]);

    const updateProfile = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...profileData }; if (!payload.password) delete payload.password; 
            await axios.put('http://127.0.0.1:8000/api/auth/me/', payload, config);
            alert("Owner settings updated successfully!"); setShowProfile(false); loadData();
        } catch (err) { alert("Failed to update profile."); }
    };

    const handleCreatePet = async (formData) => { try { await axios.post('http://127.0.0.1:8000/api/pets/', formData, config); alert("Pet Asset Registered!"); setShowCreatePet(false); loadData(); } catch (err) { alert("Pet registration failed."); } };
    const handleUpdatePet = async (formData) => { try { await axios.put(`http://127.0.0.1:8000/api/pets/${editingPet.id}/`, formData, config); alert("Pet Details Updated!"); setEditingPet(null); loadData(); } catch (err) { alert("Failed to update pet details."); } };
    const handleDeletePet = async (id) => { if (window.confirm("Are you sure you want to permanently delete this pet profile?")) { try { await axios.delete(`http://127.0.0.1:8000/api/pets/${id}/`, config); loadData(); } catch (err) { alert("Failed to delete pet."); } } };

    const submitBookingRequest = async (e) => {
        e.preventDefault();
        try { await axios.post('http://127.0.0.1:8000/api/bookings/', { pet: bookingForm.pet, provider: activeGig.provider }, config); alert("Request sent to Provider! Check 'My Bookings' to track status."); setActiveGig(null); setActiveTab('bookings'); loadData(); } 
        catch (err) { alert("Failed to send request. You may already have an active request."); }
    };

    const proposeTime = async (bookingId, date, time) => { try { await axios.patch(`http://127.0.0.1:8000/api/bookings/${bookingId}/`, { status: 'Time Proposed', service_date: date, time_slot: time }, config); alert("Time proposal sent to provider!"); loadData(); } catch (err) { alert(err.response?.data?.non_field_errors || "Scheduling failed."); } };
    const processPayment = async (invoiceId) => { try { await axios.patch(`http://127.0.0.1:8000/api/invoices/${invoiceId}/`, { is_paid: true }, config); loadData(); } catch (err) { alert("Payment Failed."); } };
    const openChat = async (booking) => { setActiveChat(booking); await axios.post('http://127.0.0.1:8000/api/messages/mark_read/', { booking_context: booking.id }, config); loadData(); };
    const sendChatMessage = async (e) => { e.preventDefault(); try { await axios.post('http://127.0.0.1:8000/api/messages/', { receiver: activeChat.provider, booking_context: activeChat.id, content: newMessage }, config); setNewMessage(''); loadData(); } catch (err) { alert("Failed to send message."); } };

    const handleDeleteBooking = async (id) => {
        if (window.confirm("Are you sure you want to cancel/delete this booking?")) {
            try { await axios.delete(`http://127.0.0.1:8000/api/bookings/${id}/`, config); alert("Booking cancelled and removed successfully."); loadData(); } 
            catch (err) { alert(err.response?.data?.detail || err.response?.data?.non_field_errors || "Failed to delete."); }
        }
    };

    const BooleanDetail = ({ label, value }) => (
        <div className="flex justify-between items-center py-3 border-b border-slate-100 last:border-0">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">{label}</span>
            <span className={`text-sm font-black ${value ? 'text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md' : 'text-slate-400'}`}>{value ? '✓ YES' : '✕ NO'}</span>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
            {/* HEADER */}
            <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-40 shadow-sm">
                <div className="flex items-center gap-8">
                    <h1 className="text-2xl font-black text-slate-900 tracking-tighter">PET<span className="text-indigo-600">MARKET</span></h1>
                    <nav className="hidden md:flex gap-1 bg-slate-100 p-1 rounded-lg">
                        <button onClick={() => setActiveTab('marketplace')} className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-md transition ${activeTab === 'marketplace' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}>Marketplace</button>
                        <button onClick={() => setActiveTab('bookings')} className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-md transition ${activeTab === 'bookings' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}>My Bookings</button>
                        <button onClick={() => setActiveTab('pets')} className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-md transition ${activeTab === 'pets' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}>My Pets</button>
                    </nav>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => setShowProfile(true)} className="flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-800 uppercase tracking-widest border border-indigo-100 bg-indigo-50 px-4 py-2 rounded-lg transition">
                        {profileData.profile_image_url && <img src={profileData.profile_image_url} alt="Avatar" className="w-5 h-5 rounded-full object-cover" />}
                        Profile Settings
                    </button>
                    <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="text-xs font-bold text-slate-400 hover:text-red-600 uppercase tracking-widest border border-slate-200 px-4 py-2 rounded-lg transition">Logout</button>
                </div>
            </header>
            
            <main className="p-8 max-w-6xl mx-auto">
                {activeTab === 'marketplace' && (
                    <MarketplaceTab gigs={gigs} searchLocation={searchLocation} setSearchLocation={setSearchLocation} setActiveGig={setActiveGig} setViewingPublicProfile={setViewingPublicProfile} />
                )}

                {activeTab === 'bookings' && (
                    <OwnerBookingsTab bookings={bookings} invoices={invoices} messages={messages} reviews={reviews} proposeTime={proposeTime} processPayment={processPayment} openChat={openChat} setReviewingBooking={setReviewingBooking} handleDeleteBooking={handleDeleteBooking} setViewingPublicProfile={setViewingPublicProfile} />
                )}

                {activeTab === 'pets' && (
                    <MyPetsTab pets={pets} showCreatePet={showCreatePet} setShowCreatePet={setShowCreatePet} editingPet={editingPet} setEditingPet={setEditingPet} handleCreatePet={handleCreatePet} handleUpdatePet={handleUpdatePet} handleDeletePet={handleDeletePet} />
                )}
            </main>

            {/* PUBLIC PROFILE MODAL */}
            {viewingPublicProfile && (
                <div className="fixed inset-0 bg-slate-900/80 flex items-center justify-center p-4 z-[70] backdrop-blur-sm">
                    <div className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl relative text-center">
                        <button onClick={() => setViewingPublicProfile(null)} className="absolute top-6 right-6 text-slate-400 hover:text-red-500 font-black text-lg transition">✕</button>
                        
                        {viewingPublicProfile.avatar ? (
                            <img 
                                src={viewingPublicProfile.avatar} 
                                alt="Profile" 
                                className="w-32 h-32 rounded-full object-cover mx-auto mb-4 border-4 border-indigo-100 shadow-md cursor-pointer hover:border-indigo-300 transition" 
                                onClick={() => setViewingImage(viewingPublicProfile.avatar)} 
                            />
                        ) : (
                            <div className="w-32 h-32 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-500 font-black text-5xl mx-auto mb-4 border-4 border-indigo-200">
                                {viewingPublicProfile.name.charAt(0)}
                            </div>
                        )}
                        
                        <h2 className="text-3xl font-black text-slate-900">{viewingPublicProfile.name}</h2>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1 mb-4">📍 {viewingPublicProfile.location || 'Location Not Specified'}</p>
                        
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-sm text-slate-600 italic whitespace-pre-wrap">
                            "{viewingPublicProfile.bio || 'This user has not provided a bio yet.'}"
                        </div>
                        
                        {viewingPublicProfile.role === 'Provider' && viewingPublicProfile.experience > 0 && (
                            <div className="mt-4 flex justify-center gap-2">
                                <span className="bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase px-3 py-1 rounded-full">{viewingPublicProfile.experience} Yrs Exp</span>
                            </div>
                        )}
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

            {reviewingBooking && (
                <ReviewForm bookingId={reviewingBooking.id} revieweeId={reviewingBooking.revieweeId} revieweeName={reviewingBooking.revieweeName} token={token} isDark={false} onCancel={() => setReviewingBooking(null)} onSuccess={() => { setReviewingBooking(null); loadData(); }} />
            )}

            {/* PROFILE SETTINGS MODAL */}
            {showProfile && (
                <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <div className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6"><div><h2 className="text-2xl font-black text-slate-900">Owner Details</h2></div><button onClick={() => setShowProfile(false)} className="text-slate-400 hover:text-red-500 font-bold text-sm transition">✕ Close</button></div>
                        <form onSubmit={updateProfile} className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Upload Avatar (From PC)</label>
                                <input 
                                    type="file" accept="image/*"
                                    className="w-full border border-slate-200 p-2 rounded-xl text-sm bg-slate-50 outline-none focus:border-indigo-500 cursor-pointer" 
                                    onChange={e => {
                                        const file = e.target.files[0];
                                        const reader = new FileReader();
                                        reader.onloadend = () => setProfileData({...profileData, profile_image_url: reader.result});
                                        if (file) reader.readAsDataURL(file);
                                    }} 
                                />
                                {profileData.profile_image_url && <img src={profileData.profile_image_url} alt="Preview" className="h-16 w-16 object-cover mt-2 rounded-xl shadow-sm border border-slate-200" />}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Email Address</label><input type="email" className="w-full border border-slate-200 p-3 rounded-xl text-sm bg-slate-50 outline-none focus:border-indigo-500" value={profileData.email} onChange={e => setProfileData({...profileData, email: e.target.value})} required /></div>
                                <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">New Password</label><input type="password" placeholder="Leave blank to keep" className="w-full border border-slate-200 p-3 rounded-xl text-sm bg-slate-50 outline-none focus:border-indigo-500 placeholder-slate-400" value={profileData.password} onChange={e => setProfileData({...profileData, password: e.target.value})} /></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">City, Postcode</label><input type="text" className="w-full border border-slate-200 p-3 rounded-xl text-sm bg-slate-50 outline-none focus:border-indigo-500" value={profileData.location} onChange={e => setProfileData({...profileData, location: e.target.value})} required /></div>
                                <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Phone</label><input type="text" className="w-full border border-slate-200 p-3 rounded-xl text-sm bg-slate-50 outline-none focus:border-indigo-500" value={profileData.phone} onChange={e => setProfileData({...profileData, phone: e.target.value})} /></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Emergency Contact</label><input type="text" className="w-full border border-slate-200 p-3 rounded-xl text-sm bg-slate-50 outline-none focus:border-indigo-500" value={profileData.emergency_contact} onChange={e => setProfileData({...profileData, emergency_contact: e.target.value})} placeholder="Name & Number" /></div>
                                <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Property Type</label><input type="text" className="w-full border border-slate-200 p-3 rounded-xl text-sm bg-slate-50 outline-none focus:border-indigo-500" value={profileData.property_type} onChange={e => setProfileData({...profileData, property_type: e.target.value})} placeholder="e.g. House with Yard" /></div>
                            </div>
                            <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">About Me & My Home</label><textarea rows="2" className="w-full border border-slate-200 p-3 rounded-xl text-sm bg-slate-50 outline-none focus:border-indigo-500" value={profileData.bio} onChange={e => setProfileData({...profileData, bio: e.target.value})} /></div>
                            <button type="submit" className="w-full bg-indigo-600 text-white font-black uppercase tracking-widest py-4 rounded-xl text-xs shadow-lg hover:bg-indigo-700 transition mt-4">Securely Save Profile</button>
                        </form>
                    </div>
                </div>
            )}

            {/* CHAT MODAL */}
            {activeChat && (
                <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <div className="bg-white p-6 rounded-3xl w-full max-w-lg shadow-2xl flex flex-col h-[600px] border border-slate-200">
                        <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-4">
                            <div><h2 className="text-lg font-black text-slate-900">Inbox</h2><p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{activeChat.provider_name}</p></div>
                            <button onClick={() => setActiveChat(null)} className="text-slate-400 hover:text-red-500 font-bold text-sm transition uppercase tracking-widest">✕ Close</button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 rounded-2xl mb-4 border border-slate-100">
                            {messages.filter(m => m.booking_context === activeChat.id).map(msg => {
                                const isMe = msg.sender !== activeChat.provider;
                                return (
                                    <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">{msg.sender_name}</span>
                                        <div className={`p-3 rounded-2xl max-w-[80%] text-sm shadow-sm ${isMe ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm'}`}>
                                            {msg.content}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        <form onSubmit={sendChatMessage} className="flex gap-2">
                            <input type="text" className="flex-1 border border-slate-200 p-4 rounded-xl text-sm outline-none focus:border-indigo-500" placeholder="Type message..." value={newMessage} onChange={e => setNewMessage(e.target.value)} required />
                            <button type="submit" className="bg-indigo-600 text-white px-6 font-black uppercase tracking-widest text-xs rounded-xl shadow-lg hover:bg-indigo-700 transition">Send</button>
                        </form>
                    </div>
                </div>
            )}

            {/* DEEP DETAILS BOOKING MODAL */}
            {activeGig && (
                <div className="fixed inset-0 bg-slate-900/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-5xl shadow-2xl flex flex-col md:flex-row overflow-hidden max-h-[95vh]">
                        {/* LEFT SIDE: Deep Information & REVIEWS */}
                        <div className="md:w-2/3 bg-slate-50 p-8 md:p-10 overflow-y-auto border-r border-slate-200">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="bg-indigo-100 text-indigo-700 text-[10px] font-black uppercase px-3 py-1 rounded-full">{activeGig.service_type}</span>
                                <span className="bg-amber-100 text-amber-700 text-[10px] font-black uppercase px-3 py-1 rounded-full">★ {activeGig.average_rating} Rating</span>
                            </div>
                            
                            <div className="flex items-center gap-4 mb-8 mt-4">
                                {activeGig.provider_avatar ? (
                                    <img 
                                        src={activeGig.provider_avatar} 
                                        alt="Provider" 
                                        className="w-16 h-16 rounded-full object-cover cursor-pointer border-2 border-indigo-200 hover:border-indigo-500 transition shadow-sm" 
                                        onClick={() => setViewingImage(activeGig.provider_avatar)} 
                                    />
                                ) : (
                                    <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-500 font-black text-2xl border-2 border-indigo-200">
                                        {activeGig.provider_name.charAt(0)}
                                    </div>
                                )}
                                <div>
                                    <h2 className="text-4xl font-black text-slate-900 leading-tight">{activeGig.provider_name}</h2>
                                    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">📍 {activeGig.provider_location} • {activeGig.provider_experience > 0 ? `${activeGig.provider_experience} Yrs Exp.` : 'New Provider'}</p>
                                </div>
                            </div>
                            
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-8">
                                <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-3">Service Pitch</h3>
                                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{activeGig.description}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                    <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-4">Pet Allowances</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center"><span className="text-xs font-bold text-slate-500">Max Capacity</span><span className="text-sm font-black text-slate-800">{activeGig.max_pets} Pets</span></div>
                                        <div className="flex justify-between items-center"><span className="text-xs font-bold text-slate-500">Accepted Sizes</span><span className="text-sm font-black text-slate-800">{activeGig.accepted_sizes}</span></div>
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                    <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-4">Environment Setup</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center"><span className="text-xs font-bold text-slate-500">Home Setup</span><span className="text-sm font-black text-slate-800">{activeGig.home_type}</span></div>
                                        <div className="flex justify-between items-center"><span className="text-xs font-bold text-slate-500">Yard Setup</span><span className="text-sm font-black text-slate-800">{activeGig.yard_type}</span></div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-8">
                                <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-4">Provider Capabilities & Home Rules</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-1">
                                    <BooleanDetail label="CPR/First Aid Trained" value={activeGig.cpr_trained} />
                                    <BooleanDetail label="Administers Oral Meds" value={activeGig.oral_medication} />
                                    <BooleanDetail label="Administers Injections" value={activeGig.injected_medication} />
                                    <BooleanDetail label="Special Needs Experience" value={activeGig.special_needs} />
                                    <BooleanDetail label="Has Resident Pets" value={activeGig.has_resident_pets} />
                                    <BooleanDetail label="Children in Home" value={activeGig.has_children} />
                                    <BooleanDetail label="Smoker in Home" value={activeGig.smoker_in_home} />
                                    <BooleanDetail label="Provides Transportation" value={activeGig.transportation} />
                                    <BooleanDetail label="Daily Photo Updates" value={activeGig.photo_updates} />
                                </div>
                            </div>

                            {/* REVIEWS SECTION */}
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-8">
                                <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-4">Community Feedback</h3>
                                {reviews.filter(r => r.reviewee === activeGig.provider).length === 0 ? (
                                    <p className="text-sm text-slate-400 italic">No reviews yet.</p>
                                ) : (
                                    <div className="space-y-4">
                                        {reviews.filter(r => r.reviewee === activeGig.provider).map(r => (
                                            <div key={r.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                                <div className="flex items-center gap-3 mb-2">
                                                    {r.reviewer_avatar ? (
                                                        <img src={r.reviewer_avatar} alt="User" className="w-8 h-8 rounded-full object-cover" />
                                                    ) : (
                                                        <div className="w-8 h-8 bg-indigo-200 rounded-full flex items-center justify-center font-black text-indigo-500">
                                                            {r.reviewer_name.charAt(0)}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="text-xs font-bold text-slate-900">{r.reviewer_name}</p>
                                                        <p className="text-[10px] text-amber-500">{'⭐'.repeat(r.rating)}</p>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-slate-600">"{r.comment}"</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-lg">
                                <h3 className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-4">Logistics & Policies</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div><p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Supervision Level</p><p className="text-sm font-medium">{activeGig.supervision_level}</p></div>
                                    <div><p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Cancellation Policy</p><p className="text-sm font-medium">{activeGig.cancellation_policy}</p></div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT SIDE: Booking Form */}
                        <div className="md:w-1/3 bg-white p-8 flex flex-col justify-center shadow-[-10px_0_20px_rgba(0,0,0,0.05)] z-10 relative">
                            <button onClick={() => setActiveGig(null)} className="absolute top-6 right-6 text-slate-400 hover:text-red-500 font-black text-lg transition">✕</button>
                            
                            <div className="mb-8">
                                <h3 className="text-2xl font-black text-slate-900 mb-1">Request Service</h3>
                                <p className="text-3xl font-black text-emerald-600">£{activeGig.price}<span className="text-sm text-slate-400 font-medium"> / service</span></p>
                            </div>

                            <form onSubmit={submitBookingRequest} className="space-y-5">
                                <div>
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Select your Pet Asset</label>
                                    <select className="w-full border-2 border-slate-200 p-4 rounded-xl text-sm font-bold text-slate-700 outline-none bg-slate-50 focus:border-indigo-500 transition" onChange={e => setBookingForm({ pet: e.target.value })} required>
                                        <option value="">Choose a registered pet...</option>
                                        {pets.map(p => <option key={p.id} value={p.id}>{p.name} ({p.breed})</option>)}
                                    </select>
                                    {pets.length === 0 && <p className="text-[10px] text-red-500 mt-2 font-bold uppercase">Please register a pet profile first.</p>}
                                </div>
                                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mt-4">
                                    <p className="text-xs text-amber-800 font-medium text-center">No need to pick a date yet. Once the provider accepts the request, you can propose a time in your Bookings tab.</p>
                                </div>
                                <div className="pt-6 border-t border-slate-100">
                                    <button type="submit" disabled={pets.length === 0} className="w-full bg-slate-900 disabled:bg-slate-300 text-white font-black uppercase tracking-widest py-5 rounded-xl text-xs shadow-xl hover:bg-slate-800 transition transform hover:-translate-y-0.5">Send Request</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;