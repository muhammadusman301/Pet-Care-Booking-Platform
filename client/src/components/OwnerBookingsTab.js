import React from 'react';

const OwnerBookingsTab = ({ bookings, invoices, messages, reviews, proposeTime, processPayment, openChat, setReviewingBooking, handleDeleteBooking, setViewingPublicProfile }) => {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50">
                <h2 className="text-sm font-black uppercase tracking-widest text-slate-500">Order History & Active Requests</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {bookings.map(b => {
                    const invoice = invoices.find(inv => inv.booking === b.id);
                    const hasUnread = messages.some(m => m.booking_context === b.id && m.sender === b.provider && !m.is_read);
                    const hasReviewed = reviews.some(r => r.booking === b.id && r.reviewee === b.provider);

                    return (
                        <div key={b.id} className="p-5 border border-slate-200 rounded-xl flex flex-col gap-3 hover:border-indigo-300 transition">
                            <div className="flex justify-between items-start mb-2">
                                {/* CLICKABLE PROVIDER PROFILE */}
                                <div 
                                    className="flex items-center gap-3 cursor-pointer hover:opacity-75 transition"
                                    onClick={() => setViewingPublicProfile({ name: b.provider_name, avatar: b.provider_avatar, location: b.provider_location, bio: b.provider_bio, role: 'Provider' })}
                                >
                                    {b.provider_avatar ? (
                                        <img src={b.provider_avatar} alt="Provider" className="w-10 h-10 rounded-full object-cover shadow-sm border border-slate-200" />
                                    ) : (
                                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center font-black text-indigo-500 border border-indigo-200">
                                            {b.provider_name.charAt(0)}
                                        </div>
                                    )}
                                    <div>
                                        <p className="font-bold text-slate-900 leading-tight">{b.provider_name}</p>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Pet: {b.pet_name}</p>
                                    </div>
                                </div>
                                <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${
                                    b.status === 'Completed' ? 'bg-emerald-600 text-white shadow-md' :
                                    b.status === 'Scheduled' ? 'bg-emerald-100 text-emerald-700' :
                                    b.status === 'Accepted' ? 'bg-blue-100 text-blue-700' :
                                    b.status === 'Time Proposed' ? 'bg-amber-100 text-amber-700' :
                                    b.status === 'Time Rejected' ? 'bg-red-100 text-red-700 border border-red-200' : 
                                    'bg-slate-100 text-slate-700'
                                }`}>
                                    {b.status}
                                </span>
                            </div>
                            
                            <div className="bg-slate-50 p-3 rounded-lg text-xs text-slate-600 font-mono border border-slate-100">
                                {b.service_date ? `📅 ${b.service_date} ⏰ ${b.time_slot}` : '📅 Pending Scheduling'}
                            </div>
                            
                            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                                <button 
                                    onClick={() => openChat(b)} 
                                    className="relative w-full bg-slate-100 text-slate-700 text-xs font-bold py-2 rounded-lg hover:bg-slate-200 transition border border-slate-200"
                                >
                                    Inbox 
                                    {hasUnread && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>}
                                </button>
                                
                                {(b.status === 'Accepted' || b.status === 'Time Rejected') && (
                                    <form 
                                        onSubmit={(e) => { 
                                            e.preventDefault(); 
                                            proposeTime(b.id, e.target.date.value, e.target.time.value); 
                                        }} 
                                        className="flex flex-col gap-2 mt-2 bg-indigo-50/50 p-3 rounded-xl border border-indigo-100"
                                    >
                                        {b.status === 'Time Rejected' && (
                                            <p className="text-[10px] font-bold text-red-500 uppercase text-center">
                                                Provider declined that time. Pick another.
                                            </p>
                                        )}
                                        <input type="date" name="date" required className="w-full border border-slate-200 p-2 rounded-lg text-xs outline-none bg-white focus:border-indigo-500" />
                                        <select name="time" required className="w-full border border-slate-200 p-2 rounded-lg text-xs outline-none bg-white focus:border-indigo-500">
                                            <option value="">Select Time</option>
                                            <option>09:00 - 10:00</option>
                                            <option>12:00 - 13:00</option>
                                            <option>15:00 - 16:00</option>
                                            <option>18:00 - 19:00</option>
                                        </select>
                                        <button type="submit" className="w-full bg-indigo-600 text-white text-xs font-bold py-2 rounded-lg shadow-md hover:bg-indigo-700 transition">
                                            Propose Time
                                        </button>
                                    </form>
                                )}

                                {b.status === 'Scheduled' && invoice && !invoice.is_paid && (
                                    <button onClick={() => processPayment(invoice.id)} className="w-full bg-emerald-600 text-white text-xs font-bold py-2 rounded-lg shadow-md mt-2 hover:bg-emerald-700 transition">
                                        Pay £{invoice.amount}
                                    </button>
                                )}

                                {b.status === 'Completed' && !hasReviewed && (
                                    <button onClick={() => setReviewingBooking({ id: b.id, revieweeId: b.provider, revieweeName: b.provider_name })} className="w-full bg-amber-500 text-white text-xs font-bold py-2 rounded-lg hover:bg-amber-600 transition shadow-md mt-1">
                                        ⭐ Leave Review
                                    </button>
                                )}
                                
                                <button onClick={() => handleDeleteBooking(b.id)} className="w-full text-red-500 hover:text-red-700 text-xs font-bold py-2 transition mt-1 border border-red-100 rounded-lg bg-red-50">
                                    Delete Booking
                                </button>
                            </div>
                        </div>
                    );
                })}
                {bookings.length === 0 && (
                    <p className="col-span-full text-sm text-slate-500 italic p-4 text-center border-2 border-dashed border-slate-200 rounded-xl py-10">
                        You haven't booked any services yet.
                    </p>
                )}
            </div>
        </div>
    );
};

export default OwnerBookingsTab;
