import React from 'react';

const ImpactKartComponent = () => {
  return (
    <div className="px-8 py-2" style={{backgroundImage:"url(/images/back12.png)"}}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 text-center md:text-left mt-2">
          <h1 className="text-2xl md:text-3xl font-bold text-white">
          India's Trusted Non-Profit Initiative for Temple Renovation, Maintenance, and Restoration
          </h1>
          <p className="mt-4 text-[13px] text-white">
          Preserve India's Sacred Heritage
          Join our non-profit initiative to renovate, restore, and maintain India's temples. Your donations support verified projects with transparent processes, driving positive change for generations to come      </p>
          {/* <p className="mt-4 text-[13px] text-white">
            Our platform connects you with meaningful causes, providing a seamless donation experience with complete transparency and accountability. <em>Together, we can make basic needs accessible to every life in India.</em>
          </p> */}
        </div>
        <div className="md:w-1/2 -mt-4 md:mt-0 md:pl-8 flex justify-center md:justify-end -mb-2">
          <img
            src="/cow1.png"
            alt="Cow"
            className=" md:w-[400px] h-[300px] max-w-md"

          />
        </div>
      </div>
    </div>
  );
};

export default ImpactKartComponent;
