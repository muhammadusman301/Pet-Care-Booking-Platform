import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App bg-gray-100 min-h-screen">
      <header className="bg-blue-600 p-4 text-white shadow-lg">
        <h1 className="text-2xl font-bold text-center">Pet Care Booking Platform</h1>
      </header>
      <main className="container mx-auto p-10 text-center">
        <h2 className="text-4xl font-extrabold text-gray-800">Quality Care for your Pets</h2>
        <p className="mt-4 text-lg text-gray-600">Connecting UK pet owners with trusted professionals.</p>
        <div className="mt-10">
          <button className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition">
            Explore Services
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;
