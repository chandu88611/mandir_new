import React from 'react';

const items = [
  { id: 1, name: 'Baby Food Kit', quantity: '150/300', price: '₹750', image: 'food-kit.jpg' },
  { id: 2, name: 'Baby Hygiene Kit', quantity: '27/300', price: '₹650', image: 'hygiene-kit.jpg' },
  { id: 3, name: 'Diaper Kit', quantity: '18/300', price: '₹1200', image: 'diaper-kit.jpg' },
  { id: 4, name: 'New Born Baby Diaper', quantity: '15/300', price: '₹1500', image: 'diaper.jpg' },
];

const DonationItems = ({subdonations}) => {
  return (
    <section className="  p-4  rounded-md my-6">
      <div className="grid grid-cols-2 gap-4">
        {subdonations?.map((item) => (
          <div key={item._id} className="border p-4 rounded-md">
            <img src={item.featured_image} alt={item.name} className="w-full h-32 object-cover rounded-md mb-4" />
            <h4 className="text-lg font-semibold ">{item.name}</h4>
            {/* <p className="text-sm text-gray-600">{item.quantity} claimed</p> */}
            <p className="text-lg font-bold mt-2 border-b pb-2">{Math.floor(item.amount) +' Rs'}</p>
            <button className="bg-green-500 text-white py-2 px-4 rounded-md mt-4">Add +</button>
          </div>
        ))}
      </div>
    
      
    </section>
  );
};

export default DonationItems;
