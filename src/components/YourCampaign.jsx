import React, { useState } from 'react';
import FormModal from './AddCampaignForm';

const FundraisingBanner = () => {

  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <div className="bg-[#faf8f0] w-full md:w-[80%] mx-auto rounded-lg my-4  flex flex-col md:flex-row items-center justify-between p-6 md:p-12">
      <div className="md:w-1/2">
        <h1 className="text-2xl md:text-4xl font-bold mb-4">Raise funds for your cause!</h1>
        <p className="text-md md:text-lg mb-6 mr-2">
        Be part of the wonderchant crowdfunding platform and raise funds to fuel your initiatives
        </p>
        <div className="flex flex-col md:flex-row">
          {/* <button className="bg-[#f7d046] text-black px-6 py-2 rounded-full mb-2 md:mb-0 md:mr-4"    */}
          {/*   onClick={handleOpen} */}
           {/* > */}
            {/* <a href="https://tally.so/r/w4Lgjb" target='_blank'>
            
           Start a Campaign
            </a> */}
          {/* </button> */}
          {/* <button className="bg-white border border-gray-300 text-gray-800 px-6 py-2 rounded-full"    onClick={handleOpen}>
            Raise funds 
          </button> */}
        </div>
      </div>
      <div className="md:w-1/2 mt-6 md:mt-0 flex justify-center">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <img
            src="https://img.freepik.com/free-photo/architecture-color-holy-beautiful-detail_1203-6106.jpg?t=st=1721559002~exp=1721562602~hmac=c15c1abe965bac7f1f80e49ba24b6d7d270acf44a70d0150d0ceb23008d3f25d&w=996"
            alt="Children playing"
            className="rounded-lg shadow-md"
          />
          <img
            src="https://img.freepik.com/free-photo/view-world-monument-celebrate-world-heritage-day_23-2151297199.jpg?t=st=1721559027~exp=1721562627~hmac=2d1515f7f9ac0a5626d3141e6c632496aa1636aed55b33b86964a6d986951e2a&w=996"
            alt="Children using a laptop"
            className="rounded-lg shadow-md"
          />
        </div>
      </div>
      <FormModal open={open} onClose={handleClose} />
    </div>
  );
};

export default FundraisingBanner;
