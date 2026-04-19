import React from 'react';
// import { MdOutlineStarPurple500 } from "react-icons/md";
import { MdOutlineManageSearch } from "react-icons/md";
import { LiaStarSolid } from "react-icons/lia";

const OrderDeskTab = ({ tasks, messages, reviews, setViewingPet, updateTaskStatus, setReviewingTask, openChat, setViewingPublicProfile }) => {
    return (
        <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-800 bg-slate-800/30 flex justify-between items-center">
                <h2 className="text-sm font-black uppercase tracking-widest text-emerald-500">
                    Incoming Requests & Active Queue
                </h2>
            </div>
            <table className="w-full text-left">
                <thead className="bg-slate-900">
                    <tr className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800">
                        <th className="px-6 py-5">Client Profile</th>
                        <th className="px-6 py-5">Time Window</th>
                        <th className="px-6 py-5">Job Status</th>
                        <th className="px-6 py-5 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50 text-sm">
                    {tasks.map(task => {
                        const hasUnread = messages.some(m => m.booking_context === task.id && m.sender === task.owner_id && !m.is_read);
                        const hasReviewed = reviews.some(r => r.booking === task.id && r.reviewee === task.owner_id);

                        return (
                            <tr key={task.id} className="hover:bg-slate-800/40 transition">
                                <td className="px-6 py-5">
                                    {/* CLICKABLE OWNER PROFILE */}
                                    <div 
                                        className="flex items-center gap-3 mb-3 cursor-pointer hover:opacity-75 transition"
                                        onClick={() => setViewingPublicProfile({ name: task.owner_name, avatar: task.owner_avatar, location: task.owner_location, bio: task.owner_bio, role: 'Owner' })}
                                    >
                                        {task.owner_avatar ? (
                                            <img src={task.owner_avatar} alt="Owner" className="w-10 h-10 rounded-full object-cover shadow-sm border border-slate-700" />
                                        ) : (
                                            <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center font-black text-emerald-500 border border-slate-700">
                                                {task.owner_name.charAt(0)}
                                            </div>
                                        )}
                                        <div>
                                            <p className="font-bold text-white text-base leading-tight">{task.owner_name}</p>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Pet Owner</p>
                                        </div>
                                    </div>

                                    <button 
                                        onClick={() => setViewingPet(task.pet_details)} 
                                        className="text-xs font-bold text-emerald-400 uppercase flex items-center gap-1 bg-emerald-900/20 px-2 py-1 rounded border border-emerald-900/50 hover:bg-emerald-900/40 transition"
                                    >
                                        <MdOutlineManageSearch className='text-xl text-white'/> Inspect Pet: {task.pet_name}
                                    </button>
                                </td>
                                <td className="px-6 py-5">
                                    <p className="text-emerald-400 font-mono font-bold">
                                        {task.time_slot}
                                    </p>
                                    <p className="text-xs text-slate-500 mt-1">
                                        {task.service_date || 'TBD'}
                                    </p>
                                </td>
                                <td className="px-6 py-5">
                                    <span className={`px-3 py-1.5 rounded-md text-[10px] font-black uppercase border ${
                                        task.status === 'Completed' ? 'bg-emerald-600 text-white' : 
                                        task.status === 'Time Proposed' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                        task.status === 'Pending' ? 'bg-slate-800 text-slate-400' :
                                        'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                    }`}>
                                        {task.status}
                                    </span>
                                </td>
                                <td className="px-6 py-5 text-right space-x-2 flex justify-end items-center">
                                    {task.status === 'Pending' && (
                                        <>
                                            <button 
                                                onClick={() => updateTaskStatus(task.id, 'Accepted')} 
                                                className="bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition border border-emerald-500/20"
                                            >
                                                Accept Request
                                            </button>
                                            <button 
                                                onClick={() => updateTaskStatus(task.id, 'Declined')} 
                                                className="bg-slate-800 text-slate-400 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-700 transition border border-slate-700"
                                            >
                                                Decline
                                            </button>
                                        </>
                                    )}
                                    
                                    {task.status === 'Time Proposed' && (
                                        <>
                                            <button 
                                                onClick={() => updateTaskStatus(task.id, 'Scheduled')} 
                                                className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-emerald-500 transition"
                                            >
                                                Approve Time
                                            </button>
                                            <button 
                                                onClick={() => updateTaskStatus(task.id, 'Time Rejected')} 
                                                className="bg-amber-600/20 text-amber-400 hover:bg-amber-600 hover:text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest border border-amber-500/20 transition"
                                            >
                                                Reject Time
                                            </button>
                                        </>
                                    )}
                                    
                                    {task.status === 'Scheduled' && (
                                        <button 
                                            onClick={() => updateTaskStatus(task.id, 'Completed')} 
                                            className="bg-slate-700 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition shadow-lg"
                                        >
                                            Mark Done
                                        </button>
                                    )}
                                    
                                    {task.status === 'Completed' && !hasReviewed && (
                                        <button 
                                            onClick={() => setReviewingTask({ 
                                                id: task.id, 
                                                revieweeId: task.owner_id, 
                                                revieweeName: task.owner_name 
                                            })} 
                                            className="bg-slate-800 text-yellow-500 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-slate-700 transition border border-slate-700"
                                        >
                                            <div className="flex items-center gap-1">
                                            <LiaStarSolid className="inline mr-1 text-lg text-yellow-500" /> Review Client
                                        </div>
                                        </button>
                                    )}
                                    
                                    {task.status !== 'Declined' && (
                                        <button 
                                            onClick={() => openChat(task)} 
                                            className="relative bg-slate-800 text-slate-300 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-700 transition border border-slate-700"
                                        >
                                            Inbox 
                                            {hasUnread && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>}
                                        </button>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                    {tasks.length === 0 && (
                        <tr>
                            <td colSpan="4" className="px-6 py-12 text-center text-slate-500 italic text-sm">
                                Your order queue is currently empty.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default OrderDeskTab;
