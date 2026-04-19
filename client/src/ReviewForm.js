import React, { useState } from 'react';
import axios from 'axios';
import { LiaStarSolid } from "react-icons/lia";

const ReviewForm = ({ bookingId, revieweeId, revieweeName, token, onCancel, onSuccess, isDark = false }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    const submitReview = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://127.0.0.1:8000/api/reviews/', {
                booking: bookingId,
                reviewee: revieweeId,
                rating: rating,
                comment: comment
            }, { headers: { Authorization: `Bearer ${token}` } });
            alert("Feedback published to the community securely!");
            onSuccess();
        } catch (err) {
            alert(err.response?.data?.non_field_errors || "Failed to submit feedback.");
        }
    };

    const bgClass = isDark ? "bg-slate-900 border border-slate-700" : "bg-white border border-slate-200";
    const textClass = isDark ? "text-white" : "text-slate-900";
    const inputClass = isDark ? "bg-slate-800 border-slate-700 text-white focus:border-emerald-500" : "bg-slate-50 border-slate-200 text-slate-700 focus:border-indigo-500";
    const btnClass = isDark ? "bg-emerald-600 hover:bg-emerald-500" : "bg-indigo-600 hover:bg-indigo-700";

    return (
        <div className="fixed inset-0 bg-slate-900/80 flex items-center justify-center p-4 z-[60] backdrop-blur-sm">
            <div className={`${bgClass} p-8 rounded-3xl w-full max-w-md shadow-2xl`}>
                <h2 className={`text-2xl font-black ${textClass} mb-1`}>Community Feedback</h2>
                <p className={`text-xs font-bold ${isDark ? 'text-emerald-500' : 'text-indigo-600'} uppercase tracking-widest mb-6`}>Evaluating {revieweeName}</p>
                
                <form onSubmit={submitReview} className="space-y-4">
                    <div>
                        <label className="flex text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Overall Rating</label>
                        <select className={`w-full border-2 p-4 rounded-xl text-sm font-bold outline-none transition ${inputClass}`} value={rating} onChange={e => setRating(e.target.value)}>
                            <option value="5">⭐⭐⭐⭐⭐ (5/5) - Outstanding</option>
                            <option value="4">⭐⭐⭐⭐ (4/5) - Very Good</option>
                            <option value="3">⭐⭐⭐ (3/5) - Average</option>
                            <option value="2">⭐⭐ (2/5) - Below Expectations</option>
                            <option value="1">⭐ (1/5) - Unacceptable</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Written Review</label>
                        <textarea rows="4" required className={`w-full border-2 p-4 rounded-xl text-sm font-bold outline-none transition ${inputClass}`} placeholder="Share your honest experience..." value={comment} onChange={e => setComment(e.target.value)}></textarea>
                    </div>
                    <div className="flex gap-2 pt-4 border-t border-slate-700/30">
                        <button type="button" onClick={onCancel} className={`flex-1 text-xs font-black uppercase tracking-widest py-4 rounded-xl transition ${isDark ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Cancel</button>
                        <button type="submit" className={`flex-1 text-white text-xs font-black uppercase tracking-widest py-4 rounded-xl shadow-lg transition ${btnClass}`}>Publish Review</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReviewForm;
