import React, { useState } from 'react';

const PetForm = () => {
    const [petData, setPetData] = useState({ name: '', breed: '', age: '', is_vaccinated: false });

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Register Your Pet</h2>
            <input type="text" placeholder="Pet Name" className="w-full p-2 border mb-3" 
                   onChange={(e) => setPetData({...petData, name: e.target.value})} />
            <input type="text" placeholder="Breed" className="w-full p-2 border mb-3" 
                   onChange={(e) => setPetData({...petData, breed: e.target.value})} />
            <div className="flex items-center mb-3">
                <input type="checkbox" className="mr-2" 
                       onChange={(e) => setPetData({...petData, is_vaccinated: e.target.checked})} />
                <label>Fully Vaccinated?</label>
            </div>
            <button className="w-full bg-green-600 text-white py-2 rounded font-bold">Save Pet</button>
        </div>
    );
};

export default PetForm;
