import React from 'react';

const StorySection = () => {
  return (
    <section className="container mx-auto p-4 bg-white shadow-md rounded-md my-6">
      <h3 className="text-xl font-bold mb-4">Story</h3>
      <p className="text-gray-700 mb-4">
        Imagine tiny newborns, abandoned in the most desperate conditions: left in gutters, discarded in dustbins...
      </p>
      <img src="story-image.jpg" alt="Story" className="w-full rounded-md mb-4" />
      <p className="text-gray-700">Till now KKSS has rescued and helped hundreds of abandoned newborn babies...</p>
      <button className="bg-blue-500 text-white py-2 px-4 rounded-md mt-4">Read More</button>
    </section>
  );
};

export default StorySection;
