import React from 'react';
import { MdOutlineLocationOn } from "react-icons/md";
import { LiaStarSolid } from "react-icons/lia";

const MarketplaceTab = ({ gigs, searchLocation, setSearchLocation, setActiveGig, setViewingPublicProfile }) => {
    return (
        <div className="space-y-6">
            <div className="bg-indigo-600 rounded-2xl p-8 text-white shadow-lg shadow-indigo-200 flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                    <h2 className="text-2xl font-black mb-2">Find a Professional Near You</h2>
                    <p className="text-indigo-200 text-sm">Browse vetted sitters, walkers, and groomers in the UK.</p>
                </div>
                <input
                    type="text"
                    placeholder="Filter by City or Postcode..."
                    className="w-full md:w-96 p-4 rounded-xl text-slate-900 outline-none shadow-inner focus:ring-4 focus:ring-indigo-300"
                    value={searchLocation}
                    onChange={e => setSearchLocation(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
                {gigs.map(gig => (
                    <div key={gig.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-2xl transition flex flex-col justify-between overflow-hidden ">

                        {/* NEW: FIVERR STYLE COVER IMAGE */}
                        {gig.cover_image_url ? (
                            <img
                                src={gig.cover_image_url}
                                alt={gig.service_type}
                                className="w-full h-48 object-cover border-b border-slate-100"
                            />
                        ) : (
                            <div className="w-full h-48 bg-slate-100 flex items-center justify-center border-b border-slate-200">
                                <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">No Cover Image</span>
                            </div>
                        )}

                        <div className="p-6 flex flex-col flex-1">
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <span className="bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase px-3 py-1 rounded-full border border-indigo-100">
                                        {gig.service_type}
                                    </span>
                                    <span className="flex text-amber-500 font-bold text-sm bg-amber-50 px-2 py-1 rounded-lg">
                                        <LiaStarSolid className="inline mr-1 text-lg" />
                                        {gig.average_rating}
                                    </span>
                                </div>

                                <div
                                    className="flex items-center gap-3 mb-3 cursor-pointer hover:opacity-75 transition"
                                    onClick={() => setViewingPublicProfile({ name: gig.provider_name, avatar: gig.provider_avatar, location: gig.provider_location, bio: gig.provider_bio, role: 'Provider', experience: gig.provider_experience })}
                                >
                                    {gig.provider_avatar ? (
                                        <img src={gig.provider_avatar} alt="Provider" className="w-10 h-10 rounded-full object-cover shadow-sm border border-slate-200" />
                                    ) : (
                                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center font-black text-indigo-500 border border-indigo-200">
                                            {gig.provider_name.charAt(0)}
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="font-bold text-lg leading-tight text-slate-900">{gig.provider_name}</h3>
                                        <div flex className="flex items-center gap-1">
                                        <MdOutlineLocationOn className='text-red-800'/>
                                        <p className="text-[10px] text-slate-500 mt-1 font-bold uppercase tracking-widest">
                                            {gig.provider_location}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-3 flex flex-wrap gap-1">
                                    {gig.cpr_trained && (
                                        <span className="bg-red-50 text-red-600 text-[9px] font-bold uppercase px-2 py-1 rounded border border-red-100">
                                            CPR Certified
                                        </span>
                                    )}
                                    {gig.oral_medication && (
                                        <span className="bg-blue-50 text-blue-600 text-[9px] font-bold uppercase px-2 py-1 rounded border border-blue-100">
                                            Med Admin
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="mt-6 flex justify-between items-center border-t border-slate-100 pt-4">
                                <div>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Base Rate</p>
                                    <p className="text-xl font-black text-slate-900">£{gig.price}</p>
                                </div>
                                <button
                                    onClick={() => setActiveGig(gig)}
                                    className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md hover:bg-slate-800 transition"
                                >
                                    View Deep Info
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                {gigs.length === 0 && (
                    <p className="col-span-full text-center text-slate-500 py-10">No providers found matching your search.</p>
                )}
            </div>
        </div>
    );
};

export default MarketplaceTab;
