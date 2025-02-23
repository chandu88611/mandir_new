import React from 'react';
import { FaHandHoldingHeart, FaShoppingCart, FaCheckSquare, FaGift } from 'react-icons/fa';

const HowItWorks = () => {
  const steps = [
    {
      icon: <FaHandHoldingHeart className="text-[#f7d046]" size={50} />,
      heading: 'Choose a Cause',
      subHeading: 'Explore the campaigns and choose a cause to support.',
    },
    {
      icon: <FaShoppingCart className="text-[#f7d046]" size={50} />,
      heading: 'Enter Donation Amount',
      subHeading: 'Choose the donation amount you wish to contribute.',
    },
    {
      icon: <FaCheckSquare className="text-[#f7d046]" size={50} />,
      heading: 'Finalize Your Donation',
      subHeading: 'Proceed to checkout and pay for your contribution.',
    },
    {
      icon: <FaGift className="text-[#f7d046]" size={50} />,
      heading: 'Donations Delivered',
      subHeading: 'Get Updates as your Donations Reach Those in Need.',
    },
  ];

  return (
    <div className=' w-full md:w-[82%] my-4 mx-auto px-4' >
    
      <h1 className='text-xl font-bold text-black'>How you can support ?</h1>
    <div className="grid gid-cols-1 md:grid-cols-4  gap-6 pt-2">
      {steps.map((step, index) => (
        <div
          key={index}
          className="flex flex-col items-center p-4 bg-[#faf8f0] rounded-lg  border-2"
        >
          <div className="mb-4 w-fit mr-auto">
            {step.icon}
          </div>
          <div className="font-semibold text-lg text-left w-full">{step.heading}</div>
          <div className="text-gray-600 text-left mt-2">{step.subHeading}</div>
        </div>
      ))}
    </div>
    </div>
  );
};

export default HowItWorks;
