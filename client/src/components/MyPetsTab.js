import React from 'react';
import PetForm from '../PetForm'; // Notice the path changed slightly since it's in a subfolder

const MyPetsTab = ({ pets, showCreatePet, setShowCreatePet, editingPet, setEditingPet, handleCreatePet, handleUpdatePet, handleDeletePet }) => {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div>
                    <h2 className="text-lg font-black text-slate-900">My Pet Assets</h2>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Manage detailed pet profiles for secure bookings</p>
                </div>
                {!showCreatePet && !editingPet && (
                    <button 
                        onClick={() => setShowCreatePet(true)} 
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-black px-6 py-3 rounded-xl uppercase text-xs tracking-widest transition shadow-lg shadow-indigo-900/20"
                    >
                        + Add New Pet
                    </button>
                )}
            </div>

            {showCreatePet ? (
                <PetForm onSubmit={handleCreatePet} onCancel={() => setShowCreatePet(false)} />
            ) : editingPet ? (
                <PetForm initialData={editingPet} onSubmit={handleUpdatePet} onCancel={() => setEditingPet(null)} />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pets.map(p => (
                        <div key={p.id} className="p-6 bg-white rounded-3xl border border-slate-200 flex flex-col gap-4 shadow-sm hover:shadow-xl transition">
                            <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                                {p.pet_photo_url ? (
                                    <img src={p.pet_photo_url} alt={p.name} className="w-16 h-16 rounded-full object-cover border-2 border-indigo-100" />
                                ) : (
                                    <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-400 font-black text-2xl border-2 border-indigo-100">
                                        {p.name.charAt(0)}
                                    </div>
                                )}
                                <div>
                                    <h3 className="font-black text-xl text-slate-900">{p.name}</h3>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{p.breed} • {p.age} Yrs</p>
                                </div>
                            </div>
                            
                            <div className="flex-1 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Type</span>
                                    <span className="font-bold text-slate-800">{p.pet_type}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Weight</span>
                                    <span className="font-bold text-slate-800">{p.weight} kg</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Temperament</span>
                                    <span className="font-bold text-slate-800">{p.temperament}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Vaccination</span>
                                    <span className={`font-bold ${p.vaccination_status === 'Up to date' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                        {p.vaccination_status}
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-1 mt-2">
                                {p.medical_conditions && <span className="bg-red-50 text-red-600 text-[9px] font-bold uppercase px-2 py-1 rounded border border-red-100">Medical Needs</span>}
                                {p.dangerous_dog_breed && <span className="bg-orange-50 text-orange-600 text-[9px] font-bold uppercase px-2 py-1 rounded border border-orange-100">Restricted Breed</span>}
                                {p.separation_anxiety && <span className="bg-blue-50 text-blue-600 text-[9px] font-bold uppercase px-2 py-1 rounded border border-blue-100">Anxious</span>}
                            </div>

                            <div className="flex gap-2 pt-4 border-t border-slate-100 mt-2">
                                <button onClick={() => setEditingPet(p)} className="flex-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 py-2.5 bg-indigo-50 border border-indigo-100 rounded-xl transition uppercase tracking-widest">
                                    Edit Details
                                </button>
                                <button onClick={() => handleDeletePet(p.id)} className="flex-1 text-xs font-bold text-red-500 hover:text-red-700 py-2.5 bg-red-50 border border-red-100 rounded-xl transition uppercase tracking-widest">
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                    {pets.length === 0 && (
                        <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-300 rounded-3xl bg-slate-50">
                            <p className="text-slate-600 font-bold text-lg">No pets registered yet.</p>
                            <p className="text-sm text-slate-500 mt-1">Add your pet's full profile to start booking services securely.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MyPetsTab;
