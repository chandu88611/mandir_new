import React from 'react';

const DonationCard = ({ title, description, image, progress, supported, left, donations }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img src={image} alt={title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <span className="text-sm text-orange-600 font-semibold">Tax Benefits Available</span>
        <h3 className="mt-2 text-xl font-bold">{title}</h3>
        <p className="text-gray-600 mt-2">{description}</p>
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{progress}%</span>
            <span>{supported} supported, {left} left</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">{donations} Donations</p>
        </div>
      </div>
    </div>
  );
};

const Donations = ({campaigns}) => {
  const donations = [
    {
      title: "Renovate Ancient Temples",
      description: "Help us preserve and restore ancient temples that hold immense historical and cultural significance.",
      image: "https://static.toiimg.com/photo/msid-87016468,width-96,height-65.cms",
      progress: 60,
      supported: 1200,
      left: 800,
      donations: 450
    },
    {
      title: "Construct New Temples",
      description: "Support the construction of new temples to provide a place of worship for communities.",
      image: "https://static.toiimg.com/thumb/resizemode-4,width-1280,height-720,msid-105883457/105883457.jpg",
      progress: 30,
      supported: 500,
      left: 1500,
      donations: 200
    },
    {
      title: "Support Goseva",
      description: "Donate to support Goseva initiatives that take care of cows, a sacred symbol in our culture.",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZtveIATKO8JJnD2elYYIylHiFF7e-F-WFrA&s",
      progress: 75,
      supported: 300,
      left: 100,
      donations: 80
    }
  ];

  return (
    <div className="lg:w-[1200px] mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-8">Support Sacred Spaces</h1>
      <p className="text-center text-lg text-gray-600 mb-12">Your donations help in preserving our rich cultural heritage and supporting spiritual growth. Contribute now to make a difference.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {donations.map((donation, index) => (
          <DonationCard key={index} {...donation} />
        ))}
      </div>
    </div>
  );
};

export default Donations;
