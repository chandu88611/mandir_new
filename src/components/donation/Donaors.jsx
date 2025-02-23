import React from 'react';

const donors = [
  { name: 'Ryam P', amount: '₹4,500', time: '3 days ago' },
  { name: 'Saranya', amount: '₹1,000', time: '5 days ago' },
  { name: 'Shiva', amount: '₹3,400', time: '6 days ago' },
  { name: 'Nataran W', amount: '₹2,230', time: '13 hours ago' },
];

const Donors = () => {
  return (
    <section className="container mx-auto p-4 bg-white shadow-md rounded-md my-6">
      <h3 className="text-xl font-bold mb-4">Donors</h3>
      <div className="grid grid-cols-2 gap-4">
        {donors.map((donor, index) => (
          <div key={index} className="border p-4 rounded-md">
            <h4 className="text-lg font-semibold">{donor.name}</h4>
            <p className="text-gray-600">{donor.amount} donated</p>
            <p className="text-sm text-gray-500">{donor.time}</p>
          </div>
        ))}
      </div>
      <button className="bg-blue-500 text-white py-2 px-4 rounded-md mt-4">View More</button>
    </section>
  );
};

export default Donors;
