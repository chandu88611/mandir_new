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
import { useDispatch, useSelector } from "react-redux";

// import 'swiper/css/navigation';
import "swiper/css/pagination";
import FAQ from "../FAQAccordian";
import ShareCampaignModal from "./ShareCampaign";
import LoginModel from "../LoginModel";

const CampaignPage = () => {
  // const [currentSlide, setCurrentSlide] = useState(1);
  const [donationuser, setDonationuser] = useState();
  const { id } = useParams();
  const [get, { data, error, isLoading }] = useLazyGetCampaignQuery();
  const [images, setImages] = useState([]);
  const [campaign, setCampaign] = useState();
  const [isShareModalVisible, setIsShareModalVisible] = useState(false);
  const target = parseFloat(campaign?.target_amount?.$numberDecimal) || 10000;
  const initial = parseFloat(campaign?.raised_amount?.$numberDecimal) || 0;
  const [amount, setAmount] = useState(initial);
  const storyRef = useRef(null);
  const updatesRef = useRef(null);
  const [showNav, setShowNav] = useState(false);
  const [isDonationModalVisible, setIsDonationModalVisible] = useState(false);
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const [shouldTriggerDonation, setShouldTriggerDonation] = useState(false);
  const [isDonation, setIsDonation] = useState(true);

  const user = useSelector((state) => state.user.userData);
  const dispatch = useDispatch();

  const handleSliderChange = (e) => {
    setAmount(parseInt(e.target.value, 10));
  };
  const openShareModal = () => setIsShareModalVisible(true);
  const closeShareModal = () => setIsShareModalVisible(false);

  const closeDonationModal = () => {
    setIsDonationModalVisible(false);
    setIsDonation(false);
    // window.location.reload();
  };

  // Handle scroll to show nav after user scrolls down
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 300) {
        setShowNav(true);
      } else {
        setShowNav(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (ref) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

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
  // const [isDonationModalVisible, setIsDonationModalVisible] = useState(false);
  const openDonationModal = () => {
    if (user?.full_name) {
      setIsDonationModalVisible(true);
    } else {
      setIsLoginModalVisible(true);
    }
  };

  // const closeDonationModal = () => {
  //   setIsDonationModalVisible(false);
  // };
  const paginationRef = useRef(null);
  const [showFullStory, setShowFullStory] = useState(false);
  useEffect(() => {
    if (paginationRef.current) {
      paginationRef.current.classList.add("custom-swiper-pagination");
    }
  }, [paginationRef]);

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Support this campaign!",
          url: window.location.href,
        })
        .then(() => console.log("Shared successfully"))
        .catch((err) => console.log("Sharing failed", err));
    } else {
      alert(
        "Sharing is only available on mobile devices with supported browsers."
      );
    }
  };
  useEffect(() => {
    console.log(user);
    if (user?.full_name) {
      setDonationuser(user);
    }
  }, [user]);
  console.log(data);
  return (
    <div className="w-full lg:w-[1300px] mx-auto p-4 mt-16 ">
      {/* Top Title Section */}
      {/* <div className="text-center my-4">
        <h1 className="text-[20px] capitalize md:text-2xl font-bold">
          {campaign?.campaign_title || "Campaign Title"}
        </h1> */}
      {/* <p className="text-blue-600 mt-2">
          Campaign by
          <span className="font-bold ml-1">
            {campaign?.ngo_name || "Organizer"}
          </span>
        </p> */}
      {/* <span className="inline-block bg-blue-100 text-blue-500 px-3 py-1 rounded-full text-sm mt-4">
          {campaign?.beneficiary || "Category"}
        </span> */}
      {/* </div> */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 min-h-screen md:px-4 bg-white">
        {/* Left Column - Images & Content */}
        <div className="md:col-span-3">
          {/* Image Carousel */}
          <div className="relative w-full rounded-lg overflow-hidden">
            {campaign?.other_pictures?.length > 0 ? (
              <Swiper
                slidesPerView={1}
                navigation={true}
                pagination={{ clickable: true, el: ".swiper-pagination" }}
                autoplay={{ delay: 2500, disableOnInteraction: false }}
                loop
                speed={1000}
                modules={[Autoplay, Pagination, Navigation]}
                className="w-full"
              >
                {campaign?.other_pictures?.map((image, i) => (
                  <SwiperSlide key={i} className="relative group">
                    <img
                      src={image}
                      alt={`Slide ${i + 1}`}
                      className="w-full h-[200px] md:h-[380px] object-cover rounded transition-transform duration-3000"
                    />
                    {/* Overlay Gradient */}
                    {/* <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-40"></div> */}
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <p className="text-center text-gray-500">No images available</p>
            )}
          </div>

          <div className="w-full  bg-white backdrop-blur-md px-4 p-4 rounded-lg text-center md:hidden">
            <div className="text-center my-2">
              <h1 className="text-[20px] capitalize md:text-2xl font-bold mb-4">
                {campaign?.campaign_title || "Campaign Title"}
              </h1>
            </div>
            <div className="border p-6 border-gray-300 rounded-xl">
              <div className="w-full">
                <div className="flex justify-center items-center mb-4">
                  <div className="flex items-center gap-1">
                    <h2 className="text-3xl font-extrabold text-[#d8573e] animate-pulse">
                      ₹ {campaign?.raised_amount?.$numberDecimal || "0"}{" "}
                    </h2>
                    <h4 className="text-gray-600 ml-2">Raised</h4>
                    {/* ₹ symbol */}
                    {/* <span className="text-4xl font-extrabold animate-pulse text-[#d8573e]">
      ₹
    </span> */}

                    {/* Editable input */}
                    {/* <input
      type="number"
      placeholder="0"
      value={amount === "" ? "" : amount}
      min="0"
      max="250000"
      onChange={(e) => {
        const value = e.target.value;
        if (value === "") {
          setAmount("");
        } else if (parseInt(value) <= 250000) {
          setAmount(parseInt(value));
        } else {
          setAmount(250000);
        }
      }}
      inputMode="numeric"
      className="py-2 text-4xl font-extrabold text-[#d8573e] text-left bg-transparent focus:outline-none animate-pulse appearance-none 
      [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none 
      [-moz-appearance:textfield]"
      style={{
        width: `${(amount.toString().length || 1) * 1.2}ch`, // grows with length
        transition: 'width 0.2s ease'
      }}
    /> */}
                  </div>
                </div>
              </div>
              <div className="items-center mt-2">
                {/* <p className="text-gray-700 font-semibold text-lg">
                Raised of ₹{target}
              </p>
              <p className="text-gray-700 font-semibold text-lg">
                {campaign?.donors_count || 0} donors
              </p> */}
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Goal ₹{target}</span>
                  <span>
                    {Math.round(
                      (Math.round(data?.raised_amount?.$numberDecimal) /
                        Math.round(data?.target?.$numberDecimal)) *
                        100
                    ) || 0}
                    %
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div
                    className="bg-orange-500 h-2.5 rounded-full"
                    style={{
                      width: `${Math.round(
                        (Math.round(data?.raised_amount?.$numberDecimal) /
                          Math.round(data?.target_amount?.$numberDecimal)) *
                          100 || 0
                      )}%`,
                    }}
                  ></div>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-600 my-1">
                  {/* <span>200 Donations</span> */}
                  <span>0 Donors</span>
                </div>
              </div>
            </div>
            {/* Donate Button */}
            {/* <div className="mt-6">
              <button
                onClick={openDonationModal}
                className="bg-[#b3e5fc] text-blue-500 font-bold text-sm px-3 py-2 rounded-full shadow-md transition duration-300 transform hover:scale-110 hover:bg-blue-500 group animate-bounce"
              >
                <span className="group-hover:text-white transition duration-300">
                  💙 DONATE NOW
                </span>
              </button>
            </div> */}

            {/* Share Section */}
            <div className="mt-4 flex flex-col items-center">
              <p className="text-gray-500 text-sm">Want to spread the word?</p>
              <button
                onClick={handleNativeShare}
                className="mt-2 text-blue-700 px-2 bg-blue-50 rounded-full font-semibold hover:underline hover:text-blue-900 transition duration-200"
              >
                Share this Campaign
              </button>
            </div>
          </div>
          <div className="w-full bg-white backdrop-blur-md p-4 md:p-6 mt-4  block md:hidden rounded-lg border border-gray-200">
            <div className="max-w-md md:max-w-none mx-auto">
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 flex items-center gap-2">
                Campaign Details
              </h3>
              <hr className="my-3" />

              <ul className="space-y-4">
                <li className="flex items-center space-x-3">
                  <div className="bg-yellow-500 text-white uppercase w-10 h-10 md:w-12 md:h-12 flex justify-center items-center rounded-full font-bold shadow-md">
                    {campaign?.ngo_name?.charAt(0)}
                  </div>
                  <div>
                    <p className="text-gray-900 font-semibold capitalize md:text-lg">
                      {campaign?.ngo_name || "NGO Name"}
                    </p>
                    <p className="text-gray-500 text-sm">Beneficiary</p>
                  </div>
                </li>

                <li className="flex items-center space-x-3">
                  <div className="bg-green-500 text-white uppercase w-10 h-10 md:w-12 md:h-12 flex justify-center items-center rounded-full font-bold shadow-md">
                    {campaign?.state?.charAt(0)}
                  </div>
                  <div>
                    <p className="text-gray-900 font-semibold capitalize md:text-lg">
                      {campaign?.state}
                    </p>
                    <p className="text-gray-500 text-sm">Location</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          {/* Description Section */}
          {/* Story & Updates Section */}
          <div ref={storyRef} className="bg-white rounded-xl shadow-md mt-6">
            <h3 className="text-lg font-semibold text-center bg-[#d8573e] text-white py-3 rounded-t-xl">
              Story
            </h3>
            <div className="text-gray-700 p-2 leading-snug">
              {campaign?.campaign_description &&
                (() => {
                  const html = campaign?.campaign_description;
                  const imageMatch = html.match(/<img[^>]+>/);
                  const imageTag = imageMatch ? imageMatch[0] : "";
                  const [beforeImage, afterImage] = imageMatch
                    ? html.split(imageMatch[0])
                    : [html, ""];

                  if (imageTag) {
                    return (
                      <>
                        {/* Text before image */}
                        <div
                          dangerouslySetInnerHTML={{ __html: beforeImage }}
                        />

                        {/* First image */}
                        <div
                          dangerouslySetInnerHTML={{ __html: imageTag }}
                          className="my-4"
                        />

                        {/* Read More toggle */}
                        {!showFullStory ? (
                          <button
                            onClick={() => setShowFullStory(true)}
                            className="text-blue-500 mt-3 underline block text-center"
                          >
                            Read More
                          </button>
                        ) : (
                          <div
                            dangerouslySetInnerHTML={{ __html: afterImage }}
                            className="mt-4"
                          />
                        )}
                      </>
                    );
                  } else {
                    // No image case
                    return (
                      <>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: !showFullStory
                              ? html.slice(0, 300) + "..."
                              : html,
                          }}
                        />
                        {!showFullStory && (
                          <button
                            onClick={() => setShowFullStory(true)}
                            className="text-blue-500 mt-3 underline block text-center"
                          >
                            Read More
                          </button>
                        )}
                      </>
                    );
                  }
                })()}
            </div>
          </div>

          {/* Mobile Nav Tabs shown only after scrolling */}
          {showNav && (
            <div className="md:hidden fixed top-16 left-4 right-4 mx-auto bg-white rounded-md	 shadow-md flex justify-around py-2 z-50 border border-gray-200 transition duration-300">
              <button
                onClick={() => scrollToSection(storyRef)}
                className="text-sm font-semibold text-[#d8573e] px-4 py-1 hover:bg-[#d8573e]/10 rounded-full transition"
              >
                Story
              </button>
              <button
                onClick={() => scrollToSection(updatesRef)}
                className="text-sm font-semibold text-[#d8573e] px-4 py-1 hover:bg-[#d8573e]/10 rounded-full transition"
              >
                Updates
              </button>
            </div>
          )}

          {/* Updates Section */}
          <div ref={updatesRef} className="bg-white rounded-xl shadow-md mt-6">
            <h3 className="text-lg font-semibold text-center bg-[#d8573e] text-white py-3 rounded-t-xl">
              Updates
            </h3>
            <div className="text-gray-700 p-2 leading-snug">
              {campaign?.updates || "No updates available."}
            </div>
          </div>

          {/* Video Section */}
          {campaign?.video_link && (
            <div
              dangerouslySetInnerHTML={{ __html: campaign?.video_link }}
              className="w-full h-[200px] md:h-[380px] mt-6 rounded-lg overflow-hidden shadow-lg transition-all"
            />
          )}

          {/* FAQ Section */}

          <div className="bg-white md:p-2 rounded-xl shadow-md mt-10">
            <h3 className="text-2xl text-center  font-semibold">FAQs</h3>
            <FAQ />
          </div>
        </div>
        {/* Right Column*/}
        <div
          className="md:col-span-2 md:h-[85vh] flex flex-col items-center justify-center"
          style={{
            position: "sticky",
            top: "70px",
          }}
        >
          {/* Donation Card */}
          <div className="w-full bg-white backdrop-blur-md p-6 rounded-lg text-center hidden md:block border border-gray-200">
            <div className="text-start border-b border-gray-200">
              <h1 className="text-[10px] capitalize md:text-xl font-bold mb-4">
                {campaign?.campaign_title || "Campaign Title"}
              </h1>
            </div>
            <div className="border p-6 border-gray-300 rounded-xl">
              <div className="w-full">
                <div className="flex justify-center items-center mb-2 mt-2">
                  <h2 className="text-4xl font-extrabold text-[#d8573e] animate-pulse">
                    ₹ {campaign?.raised_amount?.$numberDecimal || "0"}
                  </h2>
                  <h4 className="text-gray-600 ml-2">Raised</h4>
                  {/* <h4 className="ml-2">Raised</h4> */}
                  {/* Editable input */}
                  {/* <input
      type="number"
      placeholder="0"
      value={amount === "" ? "" : amount}
      min="0"
      max="250000"
      onChange={(e) => {
        const value = e.target.value;
        if (value === "") {
          setAmount("");
        } else if (parseInt(value) <= 250000) {
          setAmount(parseInt(value));
        } else {
          setAmount(250000);
        }
      }}
      inputMode="numeric"
      className="py-2 text-4xl font-extrabold text-[#d8573e] text-left bg-transparent focus:outline-none animate-pulse appearance-none 
      [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none 
      [-moz-appearance:textfield]"
      style={{
        width: `${(amount.toString().length || 1) * 1.2}ch`, // grows with length
        transition: 'width 0.2s ease'
      }}
    />*
  </div> */}
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Goal ₹{target}</span>
                    <span>
                      {Math.round(
                        (Math.round(data?.raised_amount?.$numberDecimal) /
                          Math.round(data?.target?.$numberDecimal)) *
                          100
                      ) || 0}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div
                      className="bg-orange-500 h-2.5 rounded-full"
                      style={{
                        width: `${Math.round(
                          (Math.round(data?.raised_amount?.$numberDecimal) /
                            Math.round(data?.target_amount?.$numberDecimal)) *
                            100 || 0
                        )}%`,
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-600 my-1">
                    {/* <span>200 Donations</span> */}
                    <span>0 Donors</span>
                  </div>
                </div>
              </div>
              {/* Raised of Target */}
              {/* <div className="items-center mt-2">
                <p className="text-gray-700 font-semibold text-lg">
                  Raised of ₹{target}
                </p>
                <p className="text-gray-700 font-semibold 700 text-lg">
                  {campaign?.donors_count || 0} donors
                </p>
              </div> */}

              {/* Custom Slider */}
              {/* <div className="relative w-full">
        <input
          type="range"
          min="0"
          max={target}
          value={amount}
          onChange={handleSliderChange}
          className="w-full h-2 appearance-none bg-gray-200 rounded-full"
          style={{ WebkitAppearance: "none" }}
        /> */}
              {/* Custom Heart Icon as handle */}
              {/* <div
          className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2"
          style={{
            left: `${(amount / target) * 100}%`,
          }}
        >
          <div className="w-8 h-8 bg-[#001f3f] rounded-full flex items-center justify-center shadow-lg">
            <img
              src="https://d2aq6dqxahe4ka.cloudfront.net/themes/neumorphism/images/igf/commonDonate/heart-icon.svg"
              alt="Heart Icon"
              className="w-4 h-4"
            />
          </div> */}
              {/* </div> */}
              {/* </div> */}
            </div>

            {/* Donate Button */}
            <div className="mt-8 flex justify-center">
              <button
                onClick={openDonationModal}
                className="bg-[#d8573e] text-white font-bold text-sm px-20 py-3 rounded-full transition duration-300 transform hover:scale-110 hover:bg-[#c85139] focus:outline-none focus:ring-2 focus:ring-[#d8573e] group animate-bounce"
              >
                <span className="group-hover:text-white transition duration-300">
                  DONATE NOW
                </span>
              </button>
            </div>

            {/* Share Section */}
            <div className="mt-6 flex flex-col items-center">
              <p className="text-gray-500 text-sm">Want to spread the word?</p>
              <button
                onClick={handleNativeShare}
                className="mt-2 text-blue-700 px-2 bg-blue-50 rounded-full font-semibold hover:underline hover:text-blue-900 transition duration-200"
              >
                Share this Campaign
              </button>
            </div>
          </div>

          {/* Campaign Details */}
          <div className="w-full bg-white backdrop-blur-md p-4 hidden md:block mt-10 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              Campaign Details
            </h3>
            <hr className="my-3" />

            <ul className="space-y-4">
              <li className="flex items-center space-x-3">
                <div className="bg-yellow-500 text-white uppercase w-10 h-10 flex justify-center items-center rounded-full font-bold shadow-md">
                  {campaign?.ngo_name?.charAt(0)}
                </div>
                <div>
                  <p className="text-gray-900 font-semibold capitalize">
                    {campaign?.ngo_name || "NGO Name"}
                  </p>
                  <p className="text-gray-500 text-sm">Beneficiary</p>
                </div>
              </li>

              <li className="flex items-center space-x-3">
                <div className="bg-green-500 text-white uppercase w-10 h-10 flex justify-center items-center rounded-full font-bold shadow-md">
                  {campaign?.state?.charAt(0)}
                </div>
                <div>
                  <p className="text-gray-900 font-semibold capitalize">
                    {campaign?.state}
                  </p>
                  <p className="text-gray-500 text-sm">Location</p>
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
      {/* Login Modal */}
      <LoginModel
        open={isLoginModalVisible}
        onClose={() => setIsLoginModalVisible(false)}
        // must pass this correctly!
        isDonation={isDonation}
        setIsDonationModalVisible={setIsDonationModalVisible}
        setDonationuser={setDonationuser}
      />

      {/* Donation Modal */}
      {isDonationModalVisible && (
        <DonationForm
          donationuser={donationuser}
          open={isDonationModalVisible}
          handleClose={closeDonationModal}
          setIsDonationModalVisible={setIsDonationModalVisible}
          donation_campaign_id={id}
        />
      )}

      <div className="visible md:hidden fixed bottom-0 left-1/2 -translate-x-1/2 w-full border-2 flex justify-center py-2 bg-white">
        <button
          onClick={openDonationModal}
          className="bg-[#d8573e] w-[90vw]  text-white font-bold text-lg px-1 py-2 rounded-full shadow-md transition duration-300 transform hover:scale-110 hover:bg-[#d8573e] focus:outline-none focus:ring-2 focus:ring-[#d8573e] group "
        >
          <span className="group-hover:text-white transition duration-300">
            DONATE NOW
          </span>
        </button>
      </div>
    </div>
  );
};
export default CampaignPage;
