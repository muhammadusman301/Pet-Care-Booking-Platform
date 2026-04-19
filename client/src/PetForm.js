import React, { useState } from 'react';

const PetForm = ({ initialData, onSubmit, onCancel }) => {
    const [data, setData] = useState(initialData || {
        name: '', pet_photo_url: '', pet_type: 'Dog', breed: '', gender: 'Male', neutered: false, age: 1, weight: '', microchipped: false, microchip_number: '', colour: '',
        vet_clinic_name: '', vet_contact_number: '', vaccination_status: 'Up to date', flea_treatment: true, worm_treatment: true, medical_conditions: '', current_medications: '', allergies: '', special_care_notes: '',
        temperament: 'Friendly', good_with_children: 'Yes', good_with_dogs: 'Yes', good_with_cats: 'Unknown', separation_anxiety: false, barking_level: 'Medium', bite_history: false, escape_risk: false, triggers: '',
        feeding_schedule: '', food_brand: '', allowed_treats: '', walk_frequency: '', walk_duration: '', toilet_routine: '', sleep_routine: '', favourite_activities: '',
        coat_type: '', grooming_frequency: '', sensitive_areas: '', nail_trim_friendly: true, bath_friendly: true, dryer_friendly: true,
        house_trained: true, leash_trained: true, basic_commands: '', recall_reliable: true,
        required_service_type: '', frequency_needed: '', budget_range: '', provider_can_enter_home: false, house_access_method: '', cctv_present: false, other_pets_in_home: false, other_pets_details: '',
        emergency_vet_auth: false, spending_limit: 0, backup_emergency_contact: '', vaccination_card_url: '', insurance_provider: '', owner_instructions: '', dangerous_dog_breed: false, consent_verified: false
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setData({ ...data, [name]: type === 'checkbox' ? checked : value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!data.consent_verified) return alert("You must verify consent in the final section.");
        onSubmit(data);
    };

    const SectionHeader = ({ title }) => <h3 className="text-indigo-600 font-black uppercase text-xs tracking-widest mt-8 mb-4 border-b border-slate-200 pb-2">{title}</h3>;

    const Input = ({ label, name, type = "text", placeholder = "" }) => (
        <div className="flex flex-col mb-3">
            <label className="text-[10px] font-bold text-slate-500 uppercase mb-1">{label}</label>
            <input type={type} name={name} value={data[name]} onChange={handleChange} placeholder={placeholder} className="bg-slate-50 border border-slate-200 p-3 rounded-lg text-sm text-slate-900 outline-none focus:border-indigo-500 transition" />
        </div>
    );

    const Textarea = ({ label, name, placeholder = "" }) => (
        <div className="flex flex-col mb-3 col-span-full">
            <label className="text-[10px] font-bold text-slate-500 uppercase mb-1">{label}</label>
            <textarea name={name} value={data[name]} onChange={handleChange} placeholder={placeholder} rows="2" className="bg-slate-50 border border-slate-200 p-3 rounded-lg text-sm text-slate-900 outline-none focus:border-indigo-500 transition" />
        </div>
    );

    const Select = ({ label, name, options }) => (
        <div className="flex flex-col mb-3">
            <label className="text-[10px] font-bold text-slate-500 uppercase mb-1">{label}</label>
            <select name={name} value={data[name]} onChange={handleChange} className="bg-slate-50 border border-slate-200 p-3 rounded-lg text-sm text-slate-900 outline-none focus:border-indigo-500 transition">
                {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
        </div>
    );

    const Checkbox = ({ label, name }) => (
        <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
            <input type="checkbox" name={name} checked={data[name]} onChange={handleChange} className="accent-indigo-600 w-4 h-4" /> {label}
        </label>
    );

    return (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-2xl h-[85vh] overflow-y-auto relative">
            <div className="sticky top-0 bg-white/95 backdrop-blur pb-4 border-b border-slate-200 flex justify-between items-center z-10">
                <div>
                    <h2 className="text-2xl font-black text-slate-900">Deep Pet Asset Profile</h2>
                    <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Trust & Safety Configuration</p>
                </div>
                <div className="flex gap-2">
                    <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-100 text-slate-600 text-xs font-bold uppercase rounded-lg hover:bg-slate-200">Cancel</button>
                    <button type="submit" className="px-6 py-2 bg-indigo-600 text-white text-xs font-black uppercase tracking-widest rounded-lg shadow-lg hover:bg-indigo-700">Save Asset</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                <div className="col-span-full"><SectionHeader title="Section 1-2: Basic Pet Identity" /></div>
                <Input label="Pet Name" name="name" />
                <Select label="Pet Type" name="pet_type" options={['Dog', 'Cat', 'Rabbit', 'Bird', 'Hamster', 'Reptile', 'Fish', 'Exotic Pet']} />
                <Input label="Breed" name="breed" placeholder="e.g. Labrador Retriever" />
                <Input label="Date of Birth / Approx Age" name="age" type="number" />
                <Select label="Gender" name="gender" options={['Male', 'Female']} />
                <Input label="Weight (kg)" name="weight" type="number" />
                <Input label="Colour / Markings" name="colour" />
                {/* <Input label="Pet Photo URL" name="pet_photo_url" placeholder="https://..." /> */}
                <div className="flex flex-col mb-3">
                    <label className="text-[10px] font-bold text-slate-500 uppercase mb-1">Upload Pet Photo (From PC)</label>
                    <input
                        type="file" accept="image/*"
                        onChange={e => {
                            const file = e.target.files[0];
                            const reader = new FileReader();
                            reader.onloadend = () => setData({ ...data, pet_photo_url: reader.result });
                            if (file) reader.readAsDataURL(file);
                        }}
                        className="bg-slate-50 border border-slate-200 p-2 rounded-lg text-sm text-slate-900 outline-none cursor-pointer"
                    />
                    {data.pet_photo_url && <img src={data.pet_photo_url} alt="Preview" className="h-16 w-16 object-cover mt-2 rounded-xl shadow-sm border border-slate-200" />}
                </div>

                <div className="flex flex-col gap-3 mt-4">
                    <Checkbox label="Neutered / Spayed?" name="neutered" />
                    <Checkbox label="Microchipped?" name="microchipped" />
                </div>
                <Input label="Microchip Number (UK)" name="microchip_number" />

                <div className="col-span-full"><SectionHeader title="Section 3: Health Information" /></div>
                <Input label="Registered Vet Clinic Name" name="vet_clinic_name" />
                <Input label="Vet Contact Number" name="vet_contact_number" />
                <Select label="Vaccination Status" name="vaccination_status" options={['Up to date', 'Partial', 'Not vaccinated']} />
                <div className="flex flex-col gap-3 mt-4 mb-3">
                    <Checkbox label="Flea Treatment Up to Date?" name="flea_treatment" />
                    <Checkbox label="Worm Treatment Up to Date?" name="worm_treatment" />
                </div>
                <Textarea label="Existing Medical Conditions" name="medical_conditions" placeholder="Arthritis, Diabetes, Heart issue..." />
                <Textarea label="Current Medications" name="current_medications" />
                <Textarea label="Allergies" name="allergies" placeholder="Food, Medication, Environmental..." />
                <Textarea label="Special Care Notes" name="special_care_notes" />

                <div className="col-span-full"><SectionHeader title="Section 4: Behaviour Profile" /></div>
                <Select label="Temperament" name="temperament" options={['Friendly', 'Shy', 'Nervous', 'Aggressive', 'Playful', 'Calm']} />
                <Select label="Good with Children?" name="good_with_children" options={['Yes', 'No', 'Sometimes']} />
                <Select label="Good with Other Dogs?" name="good_with_dogs" options={['Yes', 'No', 'Sometimes']} />
                <Select label="Good with Cats?" name="good_with_cats" options={['Unknown', 'Yes', 'No']} />
                <Select label="Barking Level" name="barking_level" options={['Low', 'Medium', 'High']} />
                <div className="flex flex-col gap-3 mt-4 mb-3">
                    <Checkbox label="Separation Anxiety?" name="separation_anxiety" />
                    <Checkbox label="Bite History?" name="bite_history" />
                    <Checkbox label="Escape Risk?" name="escape_risk" />
                    <Checkbox label="Dangerous Dog Breed (UK Law)?" name="dangerous_dog_breed" />
                </div>
                <Textarea label="Triggers" name="triggers" placeholder="Loud noises, Men with hats, Vacuum cleaner..." />

                <div className="col-span-full"><SectionHeader title="Section 5-7: Routine, Grooming & Training" /></div>
                <Input label="Feeding Schedule" name="feeding_schedule" placeholder="Morning / Afternoon / Evening" />
                <Input label="Food Brand & Allowed Treats" name="food_brand" />
                <Select label="Walk Frequency" name="walk_frequency" options={['N/A', '1 per day', '2 per day', '3+ per day']} />
                <Input label="Walk Duration" name="walk_duration" placeholder="e.g. 30 mins" />
                <Input label="Toilet Routine" name="toilet_routine" />
                <Input label="Sleep Routine" name="sleep_routine" />
                <Textarea label="Favourite Toys / Activities" name="favourite_activities" />
                <Select label="Coat Type" name="coat_type" options={['Short', 'Medium', 'Long', 'Curly', 'Double Coat', 'N/A']} />
                <Input label="Grooming Frequency" name="grooming_frequency" />
                <Textarea label="Basic Commands Known" name="basic_commands" placeholder="Sit, Stay, Come, Heel..." />
                <div className="col-span-full grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 mb-3">
                    <Checkbox label="Nail Trim Friendly" name="nail_trim_friendly" />
                    <Checkbox label="Bath Friendly" name="bath_friendly" />
                    <Checkbox label="Dryer Friendly" name="dryer_friendly" />
                    <Checkbox label="House Trained" name="house_trained" />
                    <Checkbox label="Leash Trained" name="leash_trained" />
                    <Checkbox label="Reliable Recall" name="recall_reliable" />
                </div>

                <div className="col-span-full"><SectionHeader title="Section 8-10: Booking Safety & Emergencies" /></div>
                <Select label="Required Service Type" name="required_service_type" options={['', 'Grooming', 'Dog Walking', 'Vet Consultation', 'Pet Sitting', 'Training', 'Day Care']} />
                <Select label="Frequency Needed" name="frequency_needed" options={['One time', 'Weekly', 'Monthly', 'Emergency only']} />
                <Input label="Budget Range (£)" name="budget_range" />
                <Input label="Backup Emergency Contact" name="backup_emergency_contact" placeholder="Name & Number" />
                <Input label="House Access Method" name="house_access_method" placeholder="Key handover, Smart lock, Owner present only..." />
                <Input label="Spending Limit w/o Approval (£)" name="spending_limit" type="number" />
                <div className="col-span-full grid grid-cols-2 md:grid-cols-3 gap-3 mt-4 mb-3">
                    <Checkbox label="Provider Can Enter Home" name="provider_can_enter_home" />
                    <Checkbox label="CCTV Present in Home" name="cctv_present" />
                    <Checkbox label="Other Pets in Home" name="other_pets_in_home" />
                    <Checkbox label="Auth to Contact Vet in Emergency" name="emergency_vet_auth" />
                </div>

                <div className="col-span-full"><SectionHeader title="Section 11-13: Documents & Instructions" /></div>
                <Input label="Vaccination Card URL" name="vaccination_card_url" placeholder="https://..." />
                <Input label="Insurance Provider" name="insurance_provider" />
                <Textarea label="Specific Instructions to Provider" name="owner_instructions" placeholder="Use front harness only, Avoid crowded parks, Give meds after dinner..." />

                <div className="col-span-full bg-slate-50 p-4 rounded-xl border border-indigo-100 mb-8 mt-4">
                    <label className="flex items-center gap-3 text-sm text-slate-900 font-bold cursor-pointer">
                        <input type="checkbox" name="consent_verified" checked={data.consent_verified} onChange={handleChange} className="accent-indigo-600 w-6 h-6" />
                        I confirm all medical and behavioural information is accurate. I understand false info risks booking cancellation.
                    </label>
                </div>
            </div>

            <div className="pb-10">
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-5 rounded-xl uppercase text-sm tracking-widest transition shadow-[0_10px_30px_rgba(79,70,229,0.3)]">Save Deep Pet Profile</button>
            </div>
        </form>
    );
};

export default PetForm;