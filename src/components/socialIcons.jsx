import React from 'react';
import { FaFacebookF, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';

const SocialButtons = () => {
  return (
    <div className='flex gap-2 items-center'>
<div className='mt-4'>Share</div>
    <div className="flex justify-center gap-4 mt-4">
      <a
        href="#"
        className="flex items-center justify-center w-10 h-10 bg-white rounded-full text-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
        aria-label="Facebook"
      >
        <FaFacebookF size="1.5rem" />
      </a>
      <a
        href="#"
        className="flex items-center justify-center w-10 h-10 bg-white rounded-full text-green-500 hover:bg-green-500 hover:text-white transition-colors"
        aria-label="WhatsApp"
      >
        <FaWhatsapp size="1.5rem" />
      </a>
      <a
        href="#"
        className="flex items-center justify-center w-10 h-10 bg-white rounded-full text-blue-500 hover:bg-blue-500 hover:text-white transition-colors"
        aria-label="Email"
      >
        <MdEmail size="1.5rem" />
      </a>
      <a
        href="#"
        className="flex items-center justify-center w-10 h-10 bg-white rounded-full text-pink-600 hover:bg-pink-600 hover:text-white transition-colors"
        aria-label="Instagram"
      >
        <FaInstagram size="1.5rem" />
      </a>
    </div>
    </div>
  );
};

export default SocialButtons;
