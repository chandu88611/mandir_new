import React, { useState } from 'react';
import { Modal, Button, message, Input } from 'antd';
import { AiOutlineCopy } from 'react-icons/ai';
import { FaFacebook, FaTwitter, FaWhatsapp, FaLinkedin } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';

const ShareCampaignModal = ({ isVisible, handleClose, campaignUrl }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(campaignUrl)
      .then(() => {
        setCopied(true);
        message.success('Link copied to clipboard!');
      })
      .catch(() => {
        message.error('Failed to copy the link');
      });
  };

  const openShareWindow = (url) => {
    window.open(url, "_blank", "width=600,height=400");
  };

  return (
    <Modal
      title={
        <div className="text-center">
          <h2 className="text-xl font-semibold">Support by sharing with your network</h2>
        </div>
      }
      visible={isVisible}
      onCancel={handleClose}
      footer={null}
      centered
    >
      {/* Link Copy Section */}
      <div className="flex items-center mb-4">
        <Input value={campaignUrl} readOnly className="flex-grow mr-2" />
        <Button
          icon={<AiOutlineCopy />}
          onClick={handleCopy}
          className="bg-gray-200 hover:bg-gray-300 text-black border-none"
        >
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>

      {/* Social Media Buttons */}
      <div className="grid grid-cols-2 gap-2 mt-4 w-full">
        <Button
          icon={<FaTwitter className="text-white" />}
          onClick={() => openShareWindow(`https://twitter.com/intent/tweet?url=${encodeURIComponent(campaignUrl)}&text=Check out this campaign`)}
          className="bg-[#1DA1F2] h-12 rounded-md flex items-center justify-center w-full border-none"
        >
          Twitter
        </Button>
        <Button
          icon={<FaFacebook className="text-white" />}
          onClick={() => openShareWindow(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(campaignUrl)}`)}
          className="bg-[#1877F2] h-12 rounded-md flex items-center justify-center w-full border-none"
        >
          Facebook
        </Button>
        <Button
          icon={<FaLinkedin className="text-white" />}
          onClick={() => openShareWindow(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(campaignUrl)}`)}
          className="bg-[#0077B5] h-12 rounded-md flex items-center justify-center w-full border-none"
        >
          LinkedIn
        </Button>
        <Button
          icon={<FaWhatsapp className="text-white" />}
          onClick={() => openShareWindow(`https://wa.me/?text=Check out this campaign ${encodeURIComponent(campaignUrl)}`)}
          className="bg-[#25D366] h-12 rounded-md flex items-center justify-center w-full border-none"
        >
          WhatsApp
        </Button>
        <Button
          icon={<MdEmail className="text-white" />}
          onClick={() => openShareWindow(`mailto:?subject=Support this campaign&body=Check out this campaign: ${campaignUrl}`)}
          className="bg-[#EA4335] h-12 rounded-md flex items-center justify-center w-full border-none"
        >
          Email
        </Button>
      </div>
    </Modal>
  );
};

export default ShareCampaignModal;
