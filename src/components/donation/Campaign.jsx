import React, { useState, useEffect } from "react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { motion, AnimatePresence } from "framer-motion";

import {
  useLazyGetCampaignQuery,
  useLoginUserMutation,
  useGetCampaignDonationsQuery,
} from "../../redux/services/campaignApi";
import { useGetDonationsByCampaignQuery } from "../../redux/services/transactionApi";
import { useParams } from "react-router-dom";
import "swiper/css";
import DonationForm from "./DonationForm";
import DonorModal from "./DonorModal"; // Import the modal
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
// import c from "dayjs";
// import 'swiper/css/navigation';
import "swiper/css/pagination";
import FAQ from "../FAQAccordian";
import ShareCampaignModal from "./ShareCampaign";
import LoginModel from "../LoginModel";
import { FaUser, FaUserCircle } from "react-icons/fa";
import dayjs from "dayjs";
import { CiUser } from "react-icons/ci";

// Label Colors
const labelStyles = {
  "Recent Donation": "bg-[#ffdd04] text-grey-100",
  "First Donation": "bg-[#d6573d] text-white",
  "Top Donation": "bg-[#545454] text-white",
};
const CampaignPage = () => {
  // const [currentSlide, setCurrentSlide] = useState(1);
  const [donationuser, setDonationuser] = useState();
  const { id } = useParams();
  const [get, { data, error, isLoading }] = useLazyGetCampaignQuery();

  // const [donationCampaign, setDonationCampaign] =
  //   useGetCampaignDonationsQuery();
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("top");

  const [visibleDonations, setVisibleDonations] = useState(10);

  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const {
    data: donationData,
    error: donationError,
    isLoading: donationLoading,
  } = useGetDonationsByCampaignQuery(campaign?._id);

  useEffect(() => {
    // Listen for profile dropdown changes
    const handleProfileDropdownChange = (event) => {
      setIsProfileDropdownOpen(event.detail);
    };

    window.addEventListener(
      "profileDropdownChange",
      handleProfileDropdownChange
    );

    return () => {
      window.removeEventListener(
        "profileDropdownChange",
        handleProfileDropdownChange
      );
    };
  }, []);
  // useEffect(() => {
  //   if (isProfileDropdownOpen) {
  //     setShowNav(false); // Hide nav menu when profile is open
  //   } else {
  //     setShowNav(true); // Show nav menu when profile is closed
  //   }
  // }, [isProfileDropdownOpen]);

  const handleViewMore = () => {
    setVisibleDonations((prev) => prev + 10); // Load 10 more each time
  };
  //  / console.log(donationCampaign);
  const user = useSelector((state) => state.user.userData);
  const dispatch = useDispatch();

  const handleSliderChange = (e) => {
    setAmount(parseInt(e.target.value, 10));
  };
  const openShareModal = () => setIsShareModalVisible(true);
  const closeShareModal = () => setIsShareModalVisible(false);
  const [filter, setFilter] = useState("all");
  // Sorting logic
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    if (!donationData || !Array.isArray(donationData)) return;

    const successfulDonors = donationData.filter(
      (donation) => donation.payment_status === "successful"
    );

    const transformed = successfulDonors.map((d) => {
      const isAnonymous = d.is_anonymous;
      const name = isAnonymous
        ? "Anonymous"
        : d.user_id?.full_name || "Anonymous";
      const avatar = isAnonymous
        ? `https://ui-avatars.com/api/?name=A&color=ffffff&background=888`
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(
            name
          )}&color=ffffff&background=0D8ABC&bold=true`;

      return {
        id: d._id,
        name,
        avatar,
        date: d.donated_date,
        amount: parseFloat(d.total_amount?.$numberDecimal || "0"),
      };
    });

    setDonations(transformed);
  }, [donationData]);

  const sortedByDate = [...donations].sort((a, b) =>
    dayjs(b.date).diff(dayjs(a.date))
  );
  const sortedByAmount = [...donations].sort((a, b) => b.amount - a.amount);

  const recentDonation = sortedByDate[0];
  const firstDonation = sortedByDate[sortedByDate.length - 1];
  const topDonation = sortedByAmount[0];

  const uniqueDonations = [
    { donor: recentDonation, label: "Recent Donation" },
    { donor: firstDonation, label: "First Donation" },
    { donor: topDonation, label: "Top Donation" },
  ].filter(
    (item, index, self) =>
      self.findIndex(
        (i) => i.donor?.id === item.donor?.id && i.label !== item.label
      ) === index
  );

  console.log(uniqueDonations);

  // const sortedDonations = [...mockDonations].sort((a, b) =>
  //   dayjs(b.date).diff(dayjs(a.date))
  // );

  // const sortedByAmount = [...mockDonations].sort((a, b) => b.amount - a.amount);
  // const sortedByDate = [...mockDonations].sort((a, b) =>
  //   dayjs(b.date).diff(dayjs(a.date))
  // );

  // const recentDonation = sortedDonations[0]; // Most recent donation
  // const firstDonation = sortedDonations[sortedDonations.length - 1]; // First donor
  // const topDonation = [...mockDonations].sort((a, b) => b.amount - a.amount)[0]; // Highest donation
  // const { data: donations, error, isLoading } = useGetCampaignDonationsQuery({ campaignId: campaign?._id, filter: "top" });

  // Function to toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const closeDonationModal = () => {
    setIsDonationModalVisible(false);
    setIsDonation(false);
    // window.location.reload();
  };

  // Handle scroll to show nav after user scrolls down
  // useEffect(() => {
  //   const handleScroll = () => {
  //     const scrollPosition = window.scrollY;
  //     if (scrollPosition > 300) {
  //       setShowNav(true);
  //     } else {
  //       setShowNav(false);
  //     }
  //   };

  //   window.addEventListener("scroll", handleScroll);
  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;

      // Only show nav if user scrolled past 300px and profile dropdown is closed
      if (scrollPosition > 300 && !isProfileDropdownOpen) {
        setShowNav(true);
      } else {
        setShowNav(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isProfileDropdownOpen]);
  const scrollToSection = (ref) => {
    if (ref.current) {
      setShowNav(true); // Ensure nav is visible
      const yOffset = -120; // Increased offset to fully show heading
      const y =
        ref.current.getBoundingClientRect().top + window.scrollY + yOffset;

      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (id) {
      get(id); // fetch when ID is available
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
    if (user?.mobile_number) {
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
  const [showFullUpdates, setShowFullUpdates] = useState(false);

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
    if (user?.mobile_number) {
      setDonationuser(user);
    }
  }, [user]);
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isModalOpen]);
  // Utility: Extract image URLs from HTML
  const extractImagesFromHTML = (html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    return Array.from(doc.querySelectorAll("img")).map((img) => img.src);
  };

  // Utility: Remove images from HTML
  const removeImagesFromHTML = (html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    doc.querySelectorAll("img").forEach((img) => img.remove());
    return doc.body.innerHTML;
  };

  return (
    <div className="w-full lg:w-[1300px] mx-auto p-4 mt-14 ">
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
              <>
                <Swiper
                  slidesPerView={1}
                  navigation={true}
                  pagination={{
                    clickable: true,
                    el: ".custom-swiper-pagination", // Custom pagination outside Swiper
                    bulletClass: "swiper-pagination-bullet custom-bullet", // Custom class for bullets
                    bulletActiveClass:
                      "swiper-pagination-bullet-active custom-bullet-active", // Custom class for active bullets
                  }}
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
                    </SwiperSlide>
                  ))}
                </Swiper>

                {/* Bullet Pagination Outside Swiper */}
                <div className="custom-swiper-pagination flex justify-center gap-1 mt-1"></div>
              </>
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
            <div className="border p-6 border-gray-500 rounded-xl">
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
                      (Math.round(campaign?.raised_amount?.$numberDecimal) /
                        Math.round(campaign?.target_amount?.$numberDecimal)) *
                        100
                    ) || 0}
                    %
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2 overflow-hidden">
                  <div
                    className="bg-orange-500 h-2.5 rounded-full transition-all duration-300 ease-in-out"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.round(
                          (Math.round(
                            campaign?.raised_amount?.$numberDecimal || 0
                          ) /
                            Math.round(
                              campaign?.target_amount?.$numberDecimal || 1
                            )) *
                            100
                        )
                      )}%`,
                    }}
                  ></div>
                </div>

                <div className="flex justify-between items-center text-sm text-gray-600 my-1">
                  {/* <span>200 Donations</span> */}
                  <span>{donations.length} Donors</span>
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
                      {campaign?.beneficiary || "NGO Name"}
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
          {/* Story Section */}
          <div ref={storyRef} className="bg-white rounded-xl shadow-md mt-4">
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
                        <div
                          dangerouslySetInnerHTML={{ __html: beforeImage }}
                        />
                        <div
                          dangerouslySetInnerHTML={{ __html: imageTag }}
                          className="my-4"
                        />
                        <AnimatePresence>
                          {showFullStory && (
                            <motion.div
                              key="storyContent"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="mt-4 overflow-hidden"
                            >
                              <div
                                dangerouslySetInnerHTML={{ __html: afterImage }}
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>
                        <button
                          onClick={() => setShowFullStory(!showFullStory)}
                          className="text-blue-500 mt-3 underline block text-center"
                        >
                          {showFullStory ? "Show Less" : "Read More"}
                        </button>
                      </>
                    );
                  } else {
                    return (
                      <>
                        <AnimatePresence initial={false}>
                          <motion.div
                            key={showFullStory ? "full" : "short"}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div
                              dangerouslySetInnerHTML={{
                                __html: showFullStory
                                  ? html
                                  : html.slice(0, 300) + "...",
                              }}
                            />
                          </motion.div>
                        </AnimatePresence>
                        <button
                          onClick={() => setShowFullStory(!showFullStory)}
                          className="text-blue-500 mt-3 underline block text-center"
                        >
                          {showFullStory ? "Show Less" : "Read More"}
                        </button>
                      </>
                    );
                  }
                })()}
            </div>
            {/* Updates Section */}
            {/* <div
              ref={updatesRef}
              className="bg-white rounded-xl shadow-md mt-6"
            >
              <h3 className="text-lg font-semibold text-center bg-[#d8573e] text-white py-3 rounded-t-xl">
                Updates
              </h3>
              <div className="text-gray-700 p-2 leading-snug">
                {campaign?.story ? (
                  <>
                    <AnimatePresence initial={false}>
                      <motion.div
                        key={showFullUpdates ? "full" : "short"}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div
                          dangerouslySetInnerHTML={{
                            __html: showFullUpdates
                              ? campaign.story
                              : campaign.story.slice(0, 300) + "...",
                          }}
                        />
                      </motion.div>
                    </AnimatePresence>
                    <button
                      onClick={() => setShowFullUpdates(!showFullUpdates)}
                      className="text-blue-500 mt-3 underline block text-center"
                    >
                      {showFullUpdates ? "Show Less" : "Read More"}
                    </button>
                  </>
                ) : (
                  "No updates available."
                )}
              </div>
            </div> */}
            <div
              ref={updatesRef}
              className="bg-white rounded-xl shadow-md mt-6"
            >
              <h3 className="text-lg font-semibold text-center bg-[#d8573e] text-white py-3 rounded-t-xl">
                Updates
              </h3>

              <div className="text-gray-700 p-2 leading-snug">
                {campaign?.story ? (
                  <>
                    {/* Swiper Slider for Images */}
                    {extractImagesFromHTML(campaign.story).length > 0 && (
                      <Swiper
                        modules={[Pagination, Autoplay]}
                        slidesPerView={1}
                        spaceBetween={10}
                        pagination={{ clickable: true }}
                        autoplay={{ delay: 3000, disableOnInteraction: false }} // ✅ autoplay config
                        loop={true} // Optional: enables infinite loop
                        className=" rounded-xl mb-4"
                      >
                        {extractImagesFromHTML(campaign.story).map(
                          (src, index) => (
                            <SwiperSlide key={index}>
                              <img
                                src={src}
                                alt={`Slide ${index + 1}`}
                                className="w-full h-auto object-contain rounded-md"
                              />
                            </SwiperSlide>
                          )
                        )}
                      </Swiper>
                    )}

                    {/* Story Text Content (without images) */}
                    <AnimatePresence initial={false}>
                      <motion.div
                        key={showFullUpdates ? "full" : "short"}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div
                          dangerouslySetInnerHTML={{
                            __html: showFullUpdates
                              ? removeImagesFromHTML(campaign.story)
                              : removeImagesFromHTML(campaign.story).slice(
                                  0,
                                  300
                                ) + "...",
                          }}
                        />
                      </motion.div>
                    </AnimatePresence>

                    <button
                      onClick={() => setShowFullUpdates(!showFullUpdates)}
                      className="text-blue-500 mt-3 underline block text-center"
                    >
                      {showFullUpdates ? "Show Less" : "Read More"}
                    </button>
                  </>
                ) : (
                  "No updates available."
                )}
              </div>
            </div>
          </div>

          {/* Mobile Nav Tabs shown only after scrolling */}
          {showNav && !isProfileDropdownOpen && (
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

          {/* Video Section */}
          {campaign?.video_link && (
            <div
              dangerouslySetInnerHTML={{ __html: campaign?.video_link }}
              className="w-full h-[200px] md:h-[380px] mt-6 rounded-lg overflow-hidden shadow-lg transition-all"
            />
          )}
          {/* Mobile: Show Donor List First | Desktop: Right Column */}
          <div className="w-full bg-white backdrop-blur-md p-4 mt-10 rounded-lg border border-gray-200 md:hidden">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              {donations.length} Donations
            </h3>
            <hr className="my-3" />
            <ul className="space-y-6">
              {[
                { donor: recentDonation, label: "Recent Donation" },
                { donor: firstDonation, label: "First Donation" },
                { donor: topDonation, label: "Top Donation" },
              ].map(({ donor, label }) => (
                <li
                  key={donor?.id || label}
                  className="flex items-center space-x-3"
                >
                  {/* Avatar & Name */}
                  <div className="flex items-center space-x-3">
                    <div className="bg-gray-300 text-white w-12 h-12 flex justify-center items-center rounded-full shadow-md overflow-hidden">
                      {donor?.avatar ? (
                        <img
                          src={donor.avatar}
                          alt={donor.name}
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <CiUser className="text-gray-600 w-8 h-8" />
                      )}
                    </div>
                    <div>
                      <p className="text-gray-900 font-semibold capitalize">
                        {donor?.name || "Anonymous"}
                      </p>
                      <div className="flex items-center gap-4">
                        <p className="text-sm font-semibold text-[#d8573e] w-[100px] text-left">
                          ₹{donor?.amount || 0}
                        </p>
                        <span
                          className={`text-xs px-1 rounded ${labelStyles[label]}`}
                        >
                          {label}
                        </span>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* Buttons */}
            <div className="flex mt-8 w-full text-sm">
              <button
                onClick={() => {
                  setIsModalOpen(true);
                  setActiveTab("top");
                }}
                className={`w-1/2 px-4 py-2 rounded-md transition ${
                  activeTab === "top" ? "bg-gray-200" : "bg-white"
                }`}
              >
                View Top Donations
              </button>
              <button
                onClick={() => {
                  setIsModalOpen(true);
                  setActiveTab("all");
                }}
                className={`w-1/2 px-4 py-2 rounded-md transition ${
                  activeTab === "all" ? "bg-gray-200" : "bg-white"
                }`}
              >
                View All Donations
              </button>
            </div>
          </div>

          <div className="lg:w-2/3 order-2 lg:order-1"></div>

          {/* FAQ Section */}

          <div className="bg-white md:p-2 rounded-xl shadow-md mt-10">
            <h3 className="text-2xl text-center  font-semibold">FAQs</h3>
            <FAQ />
          </div>
        </div>
        {/* Right Column*/}
        <div
          className="md:col-span-2 flex flex-col items-center justify-start"
          style={{
            position: "sticky",
            top: "10px", // Reduced from 70px
            alignSelf: "start", // Ensures it doesn't stretch
          }}
        >
          {/* Donation Card */}
          <div className="w-full bg-white backdrop-blur-md p-2 rounded-lg text-center hidden md:block border border-gray-200">
            <div className="text-start">
              <h1 className="text-[10px] capitalize md:text-xl font-bold mb-4 break-words text-center max-w-full">
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
                        (Math.round(campaign?.raised_amount?.$numberDecimal) /
                          Math.round(campaign?.target_amount?.$numberDecimal)) *
                          100
                      ) || 0}
                      %
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2 overflow-hidden">
                    <div
                      className="bg-orange-500 h-2.5 rounded-full transition-all duration-300 ease-in-out"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.round(
                            (Math.round(
                              campaign?.raised_amount?.$numberDecimal || 0
                            ) /
                              Math.round(
                                campaign?.target_amount?.$numberDecimal || 1
                              )) *
                              100
                          )
                        )}%`,
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-600 my-1">
                    {/* <span>200 Donations</span> */}
                    <span>{donations.length} Donors</span>
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
            </div>

            {/* Donate Button */}
            {campaign?.is_approved === true && (
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
            )}

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
                    {campaign?.beneficiary || "Beneficiary"}
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
          <div className="w-full bg-white backdrop-blur-md p-4 mt-10 rounded-lg border border-gray-200 hidden sm:block">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              {donations.length} Donations
            </h3>
            <hr className="my-3" />
            <ul className="space-y-6">
              {[
                { donor: recentDonation, label: "Recent Donation" },
                { donor: firstDonation, label: "First Donation" },
                { donor: topDonation, label: "Top Donation" },
              ].map(({ donor, label }) => (
                <li
                  key={donor?.id || label}
                  className="flex items-center space-x-3"
                >
                  {/* Avatar & Name */}
                  <div className="flex items-center space-x-3">
                    <div className="bg-gray-300 text-white w-12 h-12 flex justify-center items-center rounded-full shadow-md overflow-hidden">
                      {donor?.avatar ? (
                        <img
                          src={donor.avatar}
                          alt={donor.name}
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <CiUser className="text-gray-600 w-8 h-8" />
                      )}
                    </div>
                    <div>
                      <p className="text-gray-900 font-semibold capitalize">
                        {donor?.name || "Anonymous"}
                      </p>
                      <div className="flex items-center gap-4">
                        <p className="text-sm font-semibold text-[#d8573e] w-[100px] text-left">
                          ₹{donor?.amount || 0}
                        </p>
                        <span
                          className={`text-xs px-1 rounded ${labelStyles[label]}`}
                        >
                          {label}
                        </span>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* Buttons */}
            <div className="flex mt-8 w-full text-sm">
              <button
                onClick={() => {
                  setIsModalOpen(true);
                  setActiveTab("top");
                }}
                className={`w-1/2 px-4 py-2 rounded-md transition ${
                  activeTab === "top" ? "bg-gray-200" : "bg-white"
                }`}
              >
                View Top Donations
              </button>
              <button
                onClick={() => {
                  setIsModalOpen(true);
                  setActiveTab("all");
                }}
                className={`w-1/2 px-4 py-2 rounded-md transition ${
                  activeTab === "all" ? "bg-gray-200" : "bg-white"
                }`}
              >
                View All Donations
              </button>
            </div>
            {/* Modal */}
            <DonorModal
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              topDonations={sortedByAmount.slice(0, visibleDonations)}
              allDonations={sortedByDate.slice(0, visibleDonations)}
              handleViewMore={handleViewMore}
              visibleDonations={visibleDonations}
              totalDonations={donations.length}
            />
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
          donation_amounts={campaign?.donation_amounts}
          campaign_title={campaign?.campaign_title}
          minimum_amount={campaign?.minimum_amount}
          target_amount={campaign?.target_amount}
        />
      )}

      {campaign?.is_approved === true && (
        <div className="visible md:hidden fixed bottom-0 left-1/2 -translate-x-1/2 w-full border-t flex justify-center py-2 bg-white z-50">
          <button
            onClick={openDonationModal}
            className="bg-[#d8573e] w-[90vw] text-white font-bold text-lg px-1 py-2 rounded-full shadow-md transition duration-300 transform hover:scale-110 hover:bg-[#d8573e] focus:outline-none focus:ring-2 focus:ring-[#d8573e]"
          >
            DONATE NOW
          </button>
        </div>
      )}
    </div>
  );
};
export default CampaignPage;
