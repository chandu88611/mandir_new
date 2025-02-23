import React from 'react';
import DonationForm from './DonationForm';

function App() {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center mt-20">
   
      <main className="w-full max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-7">
            <div className="col-span-7 lg:col-span-5">

          <DonationForm  />
            </div>
          <div className="bg-white p-8 rounded-md shadow-md col-span-7  lg:col-span-2 h-fit sticky-donation-card">
            <img src="https://img.youtube.com/vi/sTKFOgZyZpY/maxresdefault.jpg" alt=""  className='rounded'/>
            <h2 className="text-xl font-bold mb-4">Join ex-police officer's mission to rescue abandoned elderly from living...</h2>
            <p className="text-gray-600 mb-4">Donation Amount: ₹10,000</p>
            <p className="text-gray-600 mb-4">Give Tip: 8% ₹800</p>
            <p className="text-gray-600 mb-4">Total Donation: ₹10,800</p>
            <button className="bg-red-500 text-white py-2 px-4 rounded w-full">Proceed to pay ₹10,800</button>
          </div>
        </div>
      </main>
    
    </div>
  );
}

export default App;
