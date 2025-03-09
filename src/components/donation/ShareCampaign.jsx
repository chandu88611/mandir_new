import React, { useState } from "react";
import { Modal, Button, message, Input } from "antd";
import { AiOutlineCopy } from "react-icons/ai";
import { FaFacebook, FaTwitter, FaWhatsapp, FaLinkedin } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const ShareCampaignModal = ({ isVisible, handleClose, campaignUrl }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard
      .writeText(campaignUrl)
      .then(() => {
        setCopied(true);
        message.success("Link copied to clipboard!");
      })
      .catch(() => {
        message.error("Failed to copy the link");
      });
  };

  const openShareWindow = (url) => {
    window.open(url, "_blank", "width=600,height=400");
  };

  return (
    <Modal
      title={null}
      visible={isVisible}
      onCancel={handleClose}
      footer={null}
      centered
      className="backdrop-blur-lg"
    >
      <div className="bg-white bg-opacity-20 backdrop-blur-lg p-6 rounded-xl shadow-2xl text-center">
        <h2 className="text-xl font-semibold text-gray-900">
          🚀 Spread the Word!
        </h2>
        <p className="text-gray-600 mt-1">Help us reach more people ❤️</p>

        {/* Copy Link Section */}
        <div className="flex items-center bg-white bg-opacity-50 p-3 rounded-lg shadow-md mt-4">
          <Input
            value={campaignUrl}
            readOnly
            className="flex-grow bg-transparent border-none text-gray-800 font-medium focus:outline-none"
          />
          <Button
            icon={<AiOutlineCopy />}
            onClick={handleCopy}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-all"
          >
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>

        {/* Social Media Buttons */}
        <div className="flex justify-center gap-4 mt-5">
          <button
            className="p-4 bg-[#1DA1F2] text-white rounded-full shadow-md hover:scale-110 transition"
            onClick={() =>
              openShareWindow(
                `https://twitter.com/intent/tweet?url=${encodeURIComponent(
                  campaignUrl
                )}&text=Check out this campaign`
              )
            }
          >
            <FaTwitter size={20} />
          </button>
          <button
            className="p-4 bg-[#1877F2] text-white rounded-full shadow-md hover:scale-110 transition"
            onClick={() =>
              openShareWindow(
                `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  campaignUrl
                )}`
              )
            }
          >
            <FaFacebook size={20} />
          </button>
          <button
            className="p-4 bg-[#0077B5] text-white rounded-full shadow-md hover:scale-110 transition"
            onClick={() =>
              openShareWindow(
                `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                  campaignUrl
                )}`
              )
            }
          >
            <FaLinkedin size={20} />
          </button>
          <button
            className="p-4 bg-[#25D366] text-white rounded-full shadow-md hover:scale-110 transition"
            onClick={() =>
              openShareWindow(
                `https://wa.me/?text=Check out this campaign ${encodeURIComponent(
                  campaignUrl
                )}`
              )
            }
          >
            <FaWhatsapp size={20} />
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ShareCampaignModal;
