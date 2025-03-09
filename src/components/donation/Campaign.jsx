import React, { useState, useEffect } from "react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import { Swiper, SwiperSlide } from "swiper/react";
import {
  useLazyGetCampaignQuery,
  useLoginUserMutation,
} from "../../redux/services/campaignApi";
import { useParams } from "react-router-dom";
import "swiper/css";
import DonationForm from "./DonationForm";
import { useRef } from "react";

// import 'swiper/css/navigation';
import "swiper/css/pagination";
import FAQ from "../FAQAccordian";
import ShareCampaignModal from "./ShareCampaign";

const CampaignPage = () => {
  const [currentSlide, setCurrentSlide] = useState(1);
  const { id } = useParams();
  const [get, { data, error, isLoading }] = useLazyGetCampaignQuery();
  const [images, setImages] = useState([]);
  const [campaign, setCampaign] = useState();
  const [isShareModalVisible, setIsShareModalVisible] = useState(false);
  const openShareModal = () => setIsShareModalVisible(true);
  const closeShareModal = () => setIsShareModalVisible(false);

  useEffect(() => {
    if (id) {
      get(id);
    }
  }, [id]);

  useEffect(() => {
    if (data) {
      setCampaign(data?.data?.campaign);
    }
  }, [data]);

  useEffect(() => {
    if (campaign) {
      setImages(campaign.other_pictures);
      console.log(
        campaign.other_pictures?.map((data) => {
          console.log(data);
        })
      );
    }
  }, [campaign]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const shareCampaign = () => {
    const campaignUrl = window.location.href; // Current page URL
    const campaignTitle = campaign?.campaign_title || "Campaign Title";
    const shareText = `Check out this campaign: ${campaignTitle}`;

    const socialMediaUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        campaignUrl
      )}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        campaignUrl
      )}&text=${encodeURIComponent(shareText)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        campaignUrl
      )}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(
        shareText + " " + campaignUrl
      )}`,
    };

    // Open a prompt for the user to select the platform to share
    const sharePlatform = prompt(
      "Share on: Facebook, Twitter, LinkedIn, WhatsApp"
    ).toLowerCase();
    if (socialMediaUrls[sharePlatform]) {
      window.open(
        socialMediaUrls[sharePlatform],
        "_blank",
        "width=600,height=400"
      );
    } else {
      alert(
        "Platform not supported or incorrect input. Please try: Facebook, Twitter, LinkedIn, WhatsApp."
      );
    }
  };

  // const campaign =  || {};

  // const images =   [campaign?.main_picture , ...campaign?.other_pictures]
  const [isDonationModalVisible, setIsDonationModalVisible] = useState(false);
  const openDonationModal = () => {
    setIsDonationModalVisible(true);
  };

  const closeDonationModal = () => {
    setIsDonationModalVisible(false);
  };

  const paginationRef = useRef(null);
  useEffect(() => {
    if (paginationRef.current) {
      paginationRef.current.classList.add("custom-swiper-pagination");
    }
  }, [paginationRef]);
  return (
    <div className="w-full lg:w-[1300px] mx-auto p-4 mt-12 ">
      {/* Top Title Section */}
      <div className="text-center my-4">
        <h1 className="text-[20px] capitalize md:text-2xl font-bold">
          {campaign?.campaign_title || "Campaign Title"}
        </h1>
        {/* <p className="text-blue-600 mt-2">
          Campaign by
          <span className="font-bold ml-1">
            {campaign?.ngo_name || "Organizer"}
          </span>
        </p> */}
        {/* <span className="inline-block bg-blue-100 text-blue-500 px-3 py-1 rounded-full text-sm mt-4">
          {campaign?.beneficiary || "Category"}
        </span> */}
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-2 min-h-[100vh]" >
        <div className="md:col-span-3 h-full">
          {/* Image Carousel */}
          <div className=" h-fit rounded-md">
            {campaign?.other_pictures?.length > 0 ? (
              <Swiper
                slidesPerView={1}
                // spaceBetween={10}
                navigation={true}
                pagination={{
                  clickable: true,
                  el: ".swiper-pagination",
                }}
                autoplay={{
                  delay: 2500,
                  disableOnInteraction: false,
                }}
                loop
                speed={1000}
                modules={[Autoplay, Pagination, Navigation]}
                className="w-full  "
              >
                {campaign?.other_pictures?.map((image, i) => (
                  <SwiperSlide
                    className="flex items-center w-full justify-center h-96 mb-[30px] !rounded-[15px]  "
                    key={i + "1"}
                  >
                    <img
                      src={image}
                      alt={`Slide ${i + 1}`}
                      className="w-full h-[250px] md:h-[360px]  shadow-md "
                    />
                  </SwiperSlide>
                ))}
                <div
                  ref={paginationRef}
                  className="swiper-pagination rounded-[15px]"
                ></div>
              </Swiper>
            ) : (
              <p>No images available</p>
            )}

            {/* Slide Number Display */}
            <div className="bg-white p-2 visible md:hidden rounded-md shadow-md text-center">
              <h2 className="text-3xl font-bold text-green-600">
                ₹{campaign?.minimum_amount?.$numberDecimal || "0"}
              </h2>
              <p className="text-gray-600">
                Raised of ₹{campaign?.target_amount?.$numberDecimal || "0"}
              </p>
              <div className="visibleButton">
                <button
                  onClick={openDonationModal}
                  className="bg-[#d8573e] text-white px-6 py-2 rounded-full font-bold shadow-md w-[85%]"
                >
                  DONATE NOW
                </button>
              </div>

              <div className="mt-4 flex justify-center">
                <button
                  onClick={openShareModal}
                  className="text-blue-500 underline"
                >
                  Share this Campaign
                </button>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white p-2 rounded-md shadow-md mt-2">
            <h3 className="text-xl  mb-4 text-center bg-[#52cbff] text-black rounded-t-md py-2">
              Story & Updates
            </h3>
            <div className="text-gray-700 mb-4   custom-scrollbar">
              {/* {campaign?.campaign_description || "No description available"} */}
              <div
                dangerouslySetInnerHTML={{
                  __html: campaign?.campaign_description,
                }}
              />
            </div>
          </div>
          {campaign?.video_link && (
            <div
              dangerouslySetInnerHTML={{ __html: campaign?.video_link }}
              className="w-full h-[220px] md:h-[350px] mt-4 rounded-md overflow-hidden"
            />
          )}
              <div className="bg-white p-2 rounded-md shadow-md !mt-10">
            <h3 className="text-xl font-bold mb-4">FAQs</h3>
            <FAQ />
          </div>
        </div>
        
        <div
          className=" md:col-span-2 md:h-[100vh]"
          style={{ position: "sticky", top: "100px" }}
        >
          <div className="bg-white p-2  rounded-md shadow-md text-center visibleButton">
            <h2 className="text-3xl font-bold text-green-600">
              ₹{campaign?.minimum_amount?.$numberDecimal || "0"}
            </h2>
            <p className="text-gray-600">
              Raised of ₹{campaign?.target_amount?.$numberDecimal || "0"}
            </p>
            <div className="">
              <button
                onClick={openDonationModal}
                className="bg-[#d8573e] text-white px-6 py-2 rounded-full font-bold shadow-md w-[85%]"
              >
                DONATE NOW
              </button>
            </div>

            <div className="mt-4 flex justify-center">
              <button
                onClick={openShareModal}
                className="text-blue-500 underline"
              >
                Share this Campaign
              </button>
            </div>
          </div>
          <div className="bg-white p-2 border-t rounded-md shadow-md ">
            <h3 className="text-lg font-semibold ml-3   text-black rounded-t-md ">
              Campaign Details
            </h3>
            <hr className="my-2" />
            <ul className="space-y-4">
              <li className="flex items-center space-x-3">
                <div className="bg-yellow-500 uppercase text-white w-8 h-8 flex justify-center items-center rounded-full font-bold">
                  {campaign?.ngo_name?.charAt(0)}
                </div>
                <div>
                  <p className="text-gray-900 font-semibold capitalize ">
                    {campaign?.ngo_name || "NGO Name"}
                  </p>
                  <p className="text-gray-600">Beneficiary</p>
                </div>
              </li>
              <li className="flex items-center space-x-3">
                <div className="bg-green-500 text-white uppercase w-8 h-8 flex justify-center items-center rounded-full font-bold">
                  {campaign?.state?.charAt(0)}
                </div>
                <div>
                  <p className="text-gray-900 font-semibold capitalize">
                    {campaign?.state}
                  </p>
                  <p className="text-gray-600">Location</p>
                </div>
              </li>
            </ul>
          </div>

      
        </div>
      </div>
      <ShareCampaignModal
        isVisible={isShareModalVisible}
        handleClose={closeShareModal}
        campaignUrl={window.location.href}
      />
      {isDonationModalVisible && (
        <DonationForm
          open={isDonationModalVisible}
          handleClose={closeDonationModal}
          setIsDonationModalVisible={setIsDonationModalVisible}
          donation_campaign_id={id}
        />
      )}
      <div className="visible md:hidden fixed bottom-0 left-1/2 -translate-x-1/2 w-full border-2 flex justify-center py-2 bg-white">
        <button
          onClick={openDonationModal}
          className="bg-[#d8573e] text-white font-bold text-lg  px-6 py-2 rounded-full shadow-md w-[90%]  "
        >
          DONATE NOW
        </button>
      </div>
    </div>
  );
};

export default CampaignPage;
