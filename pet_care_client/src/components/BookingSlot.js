import React from 'react';

const BookingSlot = ({ time, isAvailable }) => {
    return (
        <div className={`p-4 border rounded-md flex justify-between ${isAvailable ? 'bg-white' : 'bg-gray-200'}`}>
            <span>{time}</span>
            {isAvailable ? (
                <button className="bg-blue-600 text-white px-3 py-1 rounded">Book Now</button>
            ) : (
                <span className="text-red-500 font-bold">Already Booked</span>
            )}
        </div>
    );
};

export default BookingSlot;