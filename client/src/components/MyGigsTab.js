import React from 'react';
import GigForm from '../GigForm';

const MyGigsTab = ({ services, showCreateGig, setShowCreateGig, editingGig, setEditingGig, maxGigsReached, handleCreateGig, handleUpdateGig, handleDeleteGig }) => {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg">
                <h2 className="text-lg font-black text-white">Marketplace Inventory</h2>
                {!showCreateGig && !editingGig && (
                    <button 
                        onClick={() => setShowCreateGig(true)} 
                        disabled={maxGigsReached} 
                        className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-black px-6 py-3 rounded-xl uppercase text-xs tracking-widest transition shadow-lg shadow-emerald-900/20"
                    >
                        + Create New Gig
                    </button>
                )}
            </div>
            
            {showCreateGig ? (
                <GigForm 
                    onSubmit={handleCreateGig} 
                    onCancel={() => setShowCreateGig(false)} 
                />
            ) : editingGig ? (
                <GigForm 
                    initialData={editingGig} 
                    onSubmit={handleUpdateGig} 
                    onCancel={() => setEditingGig(null)} 
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map(srv => (
                        <div key={srv.id} className="bg-slate-900 rounded-3xl border border-slate-800 flex flex-col shadow-xl hover:border-slate-600 transition overflow-hidden">
                            
                            {/* NEW: FIVERR STYLE COVER IMAGE (DARK MODE) */}
                            {srv.cover_image_url ? (
                                <img 
                                    src={srv.cover_image_url} 
                                    alt={srv.service_type} 
                                    className="w-full h-48 object-cover border-b border-slate-800" 
                                />
                            ) : (
                                <div className="w-full h-48 bg-slate-800/50 flex items-center justify-center border-b border-slate-800">
                                    <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">No Cover Image</span>
                                </div>
                            )}

                            <div className="p-6 flex flex-col flex-1 gap-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded text-[10px] font-black uppercase inline-block mb-2">
                                            Live on Market
                                        </span>
                                        <p className="font-bold text-white text-lg leading-tight">
                                            {srv.service_type}
                                        </p>
                                    </div>
                                </div>
                                <p className="font-black text-3xl text-emerald-400">£{srv.price}</p>
                                <p className="text-sm text-slate-400 line-clamp-3 flex-1">{srv.description}</p>
                                
                                <div className="flex gap-2 pt-4 mt-2 border-t border-slate-800">
                                    <button 
                                        onClick={() => setEditingGig(srv)} 
                                        className="flex-1 text-xs font-bold text-slate-300 bg-slate-800 py-2 rounded-lg uppercase tracking-widest hover:text-white transition border border-slate-700"
                                    >
                                        Edit Deep Info
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteGig(srv.id)} 
                                        className="flex-1 text-xs font-bold text-red-400 bg-red-900/20 py-2 rounded-lg uppercase tracking-widest hover:text-white transition border border-red-900/30"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {services.length === 0 && (
                        <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-800 rounded-3xl">
                            <p className="text-slate-500 font-medium">Your inventory is currently empty.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MyGigsTab;
