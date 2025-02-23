import React from 'react';
import { FaFacebookF, FaWhatsapp, FaTwitter } from 'react-icons/fa';

const CampaignDetails = () => {
  return (
    <section className="container mx-auto p-4 bg-white shadow-md rounded-md my-6">
      <h2 className="text-2xl font-bold mb-2">Join Rajini in Giving Abandoned Newborns a Fighting Chance</h2>
      <p className="text-gray-600">By Kalaiselvi Kannaniaya Social Welfare Society (KKSS) <span className="ml-2 px-2 py-1 bg-yellow-400 text-sm rounded-full">Verified</span></p>
      <div className="flex mt-4">
        <div className="w-1/2">
          <img src="campaign-image-url.jpg" alt="Campaign" className="w-full rounded-md" />
        </div>
        <div className="w-1/2 ml-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-green-600 font-semibold">17% Raised</span>
            <span className="text-gray-600">269 Donors</span>
          </div>
          <h3 className="text-xl font-bold">₹2,96,400 raised of ₹17,00,000</h3>
          <div className="flex mt-4 space-x-4">
            <button className="bg-green-500 text-white py-2 px-4 rounded-md">Share</button>
            <button className="bg-blue-500 text-white py-2 px-4 rounded-md">Donate</button>
          </div>
          <div className="flex mt-4 space-x-4 text-gray-500">
            <FaFacebookF />
            <FaTwitter />
            <FaWhatsapp />
          </div>
        </div>
      </div>
      <div className="mt-4 bg-gray-100 p-4 rounded-md">
        <h4 className="font-semibold">How to Donate</h4>
        <p className="text-sm text-gray-600">Here are some simple steps on how to donate...</p>
      </div>
    </section>
  );
};

export default CampaignDetails;
