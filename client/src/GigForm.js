import React, { useState, useEffect } from 'react';

const GigForm = ({ initialData, onSubmit, onCancel }) => {
    const [data, setData] = useState(initialData || {
        legal_name: '', business_name: '', cover_image_url: '', gender: '', dob: '', nationality: '', mobile: '', gig_email: '', address: '', city: '', postcode: '', service_radius: '',
        provider_type: 'Pet Groomer', service_type: '', tagline: '', description: '', qualifications: '', rcvs_number: '', company_number: '', dbs_check: 'No', insurance_type: '',
        years_experience: 0, pets_served: 0, breeds_experienced: '', special_needs_experienced: '', specific_services: '', price: '', basic_package: '', standard_package: '', premium_package: '', addons: '',
        working_days: '', time_slots: '', emergency_available: false, same_day_booking: false, delivery_mode: 'At Owner Home', country: 'England', accepted_pet_types: '', breed_restrictions: '', emergency_handling_plan: '', safety_hygiene_standards: '', media_gallery_urls: '', faqs: '', cancellation_policy: 'Flexible', languages_spoken: 'English', consent_verified: false
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setData({ ...data, [name]: type === 'checkbox' ? checked : value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!data.consent_verified) return alert("You must verify consent in Section 23.");
        onSubmit(data);
    };

    const SectionHeader = ({ title }) => <h3 className="text-emerald-500 font-black uppercase text-xs tracking-widest mt-8 mb-4 border-b border-slate-700 pb-2">{title}</h3>;

    const Input = ({ label, name, type = "text", placeholder = "" }) => (
        <div className="flex flex-col mb-3">
            <label className="text-[10px] font-bold text-slate-400 uppercase mb-1">{label}</label>
            <input type={type} name={name} value={data[name]} onChange={handleChange} placeholder={placeholder} className="bg-slate-900 border border-slate-700 p-3 rounded-lg text-sm text-white outline-none focus:border-emerald-500 transition" />
        </div>
    );

    const Textarea = ({ label, name, placeholder = "" }) => (
        <div className="flex flex-col mb-3 col-span-full">
            <label className="text-[10px] font-bold text-slate-400 uppercase mb-1">{label}</label>
            <textarea name={name} value={data[name]} onChange={handleChange} placeholder={placeholder} rows="3" className="bg-slate-900 border border-slate-700 p-3 rounded-lg text-sm text-white outline-none focus:border-emerald-500 transition" />
        </div>
    );

    return (
        <form onSubmit={handleSubmit} className="bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-2xl h-[85vh] overflow-y-auto relative">
            <div className="sticky top-0 bg-slate-800/90 backdrop-blur pb-4 border-b border-slate-700 flex justify-between items-center z-10">
                <div>
                    <h2 className="text-2xl font-black text-white">Full Service Provider Form</h2>
                    <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Marketplace Listing Configuration</p>
                </div>
                <div className="flex gap-2">
                    <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-700 text-white text-xs font-bold uppercase rounded-lg hover:bg-slate-600">Cancel</button>
                    <button type="submit" className="px-6 py-2 bg-emerald-600 text-white text-xs font-black uppercase tracking-widest rounded-lg shadow-lg hover:bg-emerald-500">Save & Publish</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                <div className="col-span-full"><SectionHeader title="Section 1: Provider Basic Information" /></div>
                <Input label="Full Legal Name" name="legal_name" />
                <Input label="Display Business Name" name="business_name" />
                {/* <Input label="Cover Banner Image URL" name="cover_image_url" placeholder="https://..." /> */}

                <div className="flex flex-col mb-3">
                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-1">Upload Cover/Banner Image (From PC)</label>
                    <input
                        type="file" accept="image/*"
                        onChange={e => {
                            const file = e.target.files[0];
                            const reader = new FileReader();
                            reader.onloadend = () => setData({ ...data, cover_image_url: reader.result });
                            if (file) reader.readAsDataURL(file);
                        }}
                        className="bg-slate-900 border border-slate-700 p-2 rounded-lg text-sm text-slate-300 outline-none cursor-pointer"
                    />
                    {data.cover_image_url && <img src={data.cover_image_url} alt="Preview" className="h-16 w-16 object-cover mt-2 rounded-xl shadow-sm border border-slate-600" />}
                </div>

                <Input label="Gender" name="gender" />
                <Input label="Date of Birth" name="dob" type="date" />
                <Input label="Nationality" name="nationality" />
                <Input label="Mobile Number" name="mobile" />
                <Input label="Gig Email Address" name="gig_email" type="email" />
                <Textarea label="Current Address" name="address" />
                <Input label="City" name="city" />
                <Input label="Postcode (UK)" name="postcode" />
                <Input label="Service Radius" name="service_radius" placeholder="e.g. 5 miles / 10 miles" />

                <div className="col-span-full"><SectionHeader title="Section 2-4: Professional Identity & Title" /></div>
                <div className="flex flex-col mb-3">
                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-1">Provider Type</label>
                    <select name="provider_type" value={data.provider_type} onChange={handleChange} className="bg-slate-900 border border-slate-700 p-3 rounded-lg text-sm text-white outline-none">
                        <option>Pet Groomer</option><option>Veterinarian</option><option>Dog Walker</option><option>Pet Sitter</option>
                        <option>Trainer</option><option>Pet Nutritionist</option><option>Animal Behaviourist</option><option>Emergency Pet Transport</option>
                        <option>Exotic Pet Specialist</option><option>Pet Photographer</option><option>Other</option>
                    </select>
                </div>
                <Input label="Gig Title" name="service_type" placeholder="e.g. Professional Dog Grooming at Your Home" />
                <Textarea label="Short Tagline" name="tagline" placeholder="Trusted and experienced dog groomer with 8+ years experience." />

                <div className="col-span-full"><SectionHeader title="Section 5: Detailed Description" /></div>
                <Textarea label="Gig Description" name="description" placeholder="Include: Experience, How service works, Safety standards, Equipment used..." />

                <div className="col-span-full"><SectionHeader title="Section 6-7: Qualifications & UK Registrations" /></div>
                <Textarea label="Relevant Qualifications & Certifications" name="qualifications" placeholder="e.g. Level 3 Dog Grooming Diploma, Pet CPR" />
                <Input label="RCVS Registration Number (If Vet)" name="rcvs_number" />
                <Input label="Company Number (Optional)" name="company_number" />
                <div className="flex flex-col mb-3">
                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-1">DBS Check Status</label>
                    <select name="dbs_check" value={data.dbs_check} onChange={handleChange} className="bg-slate-900 border border-slate-700 p-3 rounded-lg text-sm text-white">
                        <option>Yes</option><option>No</option><option>In Progress</option>
                    </select>
                </div>
                <Input label="Insurance Coverage" name="insurance_type" placeholder="e.g. Public Liability, Pet Care Insurance" />

                <div className="col-span-full"><SectionHeader title="Section 8-9: Experience & Services Offered" /></div>
                <Input label="Years of Experience" name="years_experience" type="number" />
                <Input label="Number of Pets Served" name="pets_served" type="number" />
                <Textarea label="Breeds Experienced With" name="breeds_experienced" placeholder="Labrador, Bulldog, Persian Cat..." />
                <Textarea label="Special Needs Experience" name="special_needs_experienced" placeholder="Senior pets, Blind pets, Anxious pets..." />
                <Textarea label="Specific Services Offered" name="specific_services" placeholder="Bathing, Nail clipping, 1 hour walk, Online consultation..." />

                <div className="col-span-full"><SectionHeader title="Section 10-11: Pricing Packages & Add-ons" /></div>
                <Input label="Basic Gig Base Price (£)" name="price" type="number" />
                <Textarea label="Basic Package Details" name="basic_package" placeholder="Includes: Duration, Pets included..." />
                <Textarea label="Standard Package Details" name="standard_package" />
                <Textarea label="Premium Package Details" name="premium_package" />
                <Textarea label="Add-ons / Extras" name="addons" placeholder="Extra pet + £10, Emergency + £20, Pick-up + £15..." />

                <div className="col-span-full"><SectionHeader title="Section 12-14: Availability & Location" /></div>
                <Input label="Working Days" name="working_days" placeholder="Mon to Sun" />
                <Input label="Time Slots" name="time_slots" placeholder="Morning / Afternoon / Evening" />
                <div className="flex flex-col mb-3 col-span-full gap-2">
                    <label className="flex items-center gap-2 text-sm text-slate-300"><input type="checkbox" name="emergency_available" checked={data.emergency_available} onChange={handleChange} className="accent-emerald-500 w-4 h-4" /> Emergency Available?</label>
                    <label className="flex items-center gap-2 text-sm text-slate-300"><input type="checkbox" name="same_day_booking" checked={data.same_day_booking} onChange={handleChange} className="accent-emerald-500 w-4 h-4" /> Same Day Booking?</label>
                </div>
                <div className="flex flex-col mb-3">
                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-1">Service Delivery Mode</label>
                    <select name="delivery_mode" value={data.delivery_mode} onChange={handleChange} className="bg-slate-900 border border-slate-700 p-3 rounded-lg text-sm text-white">
                        <option>At Owner Home</option><option>At Provider Location</option><option>Online Video Call</option><option>Pick & Drop Included</option>
                    </select>
                </div>
                <div className="flex flex-col mb-3">
                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-1">Country</label>
                    <select name="country" value={data.country} onChange={handleChange} className="bg-slate-900 border border-slate-700 p-3 rounded-lg text-sm text-white">
                        <option>England</option><option>Scotland</option><option>Wales</option><option>Northern Ireland</option>
                    </select>
                </div>

                <div className="col-span-full"><SectionHeader title="Section 15-18: Restrictions & Safety" /></div>
                <Textarea label="Pet Categories Accepted" name="accepted_pet_types" placeholder="Dogs, Cats, Birds, Exotic Pets..." />
                <Textarea label="Breed Restrictions" name="breed_restrictions" placeholder="e.g. No unvaccinated pets, No XL Bullies..." />
                <Textarea label="Emergency Handling Plan" name="emergency_handling_plan" placeholder="If pet gets sick: Immediate owner contact + nearest vet transfer." />
                <Textarea label="Safety & Hygiene Standards" name="safety_hygiene_standards" placeholder="Sanitised tools, First aid trained, No sedation..." />

                <div className="col-span-full"><SectionHeader title="Section 19-22: Media, Rules & Languages" /></div>
                <Textarea label="Media Gallery URLs (Comma separated)" name="media_gallery_urls" placeholder="https://img1.jpg, https://img2.jpg" />
                <Textarea label="FAQs" name="faqs" placeholder="Q: Do you work weekends? A: Yes..." />
                <div className="flex flex-col mb-3">
                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-1">Cancellation Policy</label>
                    <select name="cancellation_policy" value={data.cancellation_policy} onChange={handleChange} className="bg-slate-900 border border-slate-700 p-3 rounded-lg text-sm text-white">
                        <option>24 hours free cancellation</option><option>50% late cancellation</option><option>No refund after service starts</option>
                    </select>
                </div>
                <Input label="Languages Spoken" name="languages_spoken" placeholder="English, Urdu, Punjabi..." />

                <div className="col-span-full"><SectionHeader title="Section 23-24: Verification" /></div>
                <div className="col-span-full bg-slate-900 p-4 rounded-xl border border-emerald-900/50 mb-8">
                    <label className="flex items-center gap-3 text-sm text-white font-bold cursor-pointer">
                        <input type="checkbox" name="consent_verified" checked={data.consent_verified} onChange={handleChange} className="accent-emerald-500 w-6 h-6" />
                        I confirm all details are accurate, professional, and comply with UK standards.
                    </label>
                    <p className="text-[10px] text-slate-500 mt-2 ml-9">By checking this box, the system will auto-generate your Trust Badges (Verified Identity, Insured, DBS Checked) based on the data provided above.</p>
                </div>
            </div>

            <div className="pb-10">
                <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-5 rounded-xl uppercase text-sm tracking-widest transition shadow-[0_10px_30px_rgba(5,150,105,0.3)]">Publish Full Gig to Marketplace</button>
            </div>
        </form>
    );
};

export default GigForm;
