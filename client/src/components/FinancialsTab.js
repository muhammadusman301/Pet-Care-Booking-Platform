import React from 'react';

const FinancialsTab = ({ totalEarnings }) => {
    return (
        <div className="bg-gradient-to-br from-emerald-900 to-slate-900 p-8 rounded-3xl border border-emerald-800 shadow-2xl">
            <h3 className="text-xs font-black text-emerald-400 mb-2 uppercase tracking-widest">
                Total Cleared Earnings
            </h3>
            <p className="text-5xl font-black text-white">
                £{totalEarnings.toFixed(2)}
            </p>
        </div>
    );
};

export default FinancialsTab;
