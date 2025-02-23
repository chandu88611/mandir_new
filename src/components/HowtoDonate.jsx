import React from 'react';
import { FaShoppingCart, FaDonate, FaTruck, FaBell } from 'react-icons/fa';

const HowToDonate = () => {
  return (
    <div className="cont contsec p-0 htdCont">
      <div className="howtodnt">
        <h4 className='my-2 font-bold'>How to Donate</h4>
        <div className="dnt-icon">
          <div className="grid grid-cols-4 ">
            <div className="step col-span-1">
              <FaShoppingCart size="2rem" className="text-green-500 mb-2" />
              <p className="text-[9px] font-semibold">
                Select Product <br />
                to Donate
              </p>
            </div>
            <div className="step col-span-1">
              <FaDonate size="2rem" className="text-green-500 mb-2" />
              <p className="text-[9px] font-semibold">Complete Your Donation</p>
            </div>
            <div className="step col-span-1">
              <FaTruck size="2rem" className="text-green-500 mb-2" />
              <p className="text-[9px] font-semibold">Product Delivered to the NGO</p>
            </div>
            <div className="step col-span-1">
              <FaBell size="2rem" className="text-green-500 mb-2" />
              <p className="text-[9px] font-semibold">Receive Timely Updates</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowToDonate;
