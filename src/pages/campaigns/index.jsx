import React, { useEffect, useState, useRef } from "react";
import { useLazyGetCampaignQuery } from "../../redux/services/campaignApi";
import { useNavigate, useParams } from "react-router-dom";
import DonationModal from "../../components/DonationModal";
import SocialButtons from "../../components/socialIcons";
import HowToDonate from "../../components/HowtoDonate";
import DonationItems from "../../components/donation/DoationItems";

const DonationPage = () => {
  const { id } = useParams();
  const [get, { data: campaign, error, isLoading }] = useLazyGetCampaignQuery();
  const [activeSection, setActiveSection] = useState("story");
  const navigate = useNavigate();
  const sectionRefs = {
    seva: useRef(null),
    story: useRef(null),
    videos: useRef(null),
    updates: useRef(null),
  };

  useEffect(() => {
    if (id) {
      get(id);
    }
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = Object.keys(sectionRefs);
      sections.forEach((section) => {
        const ref = sectionRefs[section];
        if (ref.current) {
          const rect = ref.current.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(section);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sectionRefs]);

  const scrollToSection = (section) => {
    sectionRefs[section].current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching campaign data.</div>;
  }
  return (
    <div className="bg-gray-100 py-10">
      <div className="lg:w-[1100px] mx-auto py-10 px-4">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-2/3  ">
            <h2 className="text-2xl font-bold mb-2">
              {campaign?.data?.campaign?.campaign_name || "Campaign Title"}
            </h2>
            <p className="text-red-600 flex gap-2 items-center mb-3">
              By {campaign?.data?.campaign?.trust || "Trust Name"}
              <img src="/images/Verified-Tag.png" alt="" className="h-6" />
              <img src="/images/Donor-Safety-Tag.png" alt="" className="h-6" />
            </p>

            <img
              src={campaign?.data?.campaign?.featured_image_base_url}
              alt={campaign?.data?.campaign?.temple_name}
              className="w-full h-60 object-cover rounded-lg block lg:hidden"
            />
            <img
              src={campaign?.data?.campaign?.featured_image_base_url}
              alt={campaign?.data?.campaign?.temple_name}
              className="w-full h-96 object-cover rounded-lg hidden lg:block"
            />

            {/* Sticky Section */}
            <div className="  bg-white z-10 my-6 w-full grid grid-cols-3 sticky-donation-card ">
              <button
                className={`py-2 px-4 rounded ${
                  activeSection === "seva"
                    ? "border-b-4 border-green-500 font-bold"
                    : ""
                }`}
                onClick={() => scrollToSection("seva")}
              >
                Products
              </button>
              <button
                className={`mx-2 py-2 px-4 rounded ${
                  activeSection === "story"
                    ? "border-b-4 border-green-500 font-bold"
                    : ""
                }`}
                onClick={() => scrollToSection("story")}
              >
                Story
              </button>
              <button
                className={`mx-2 py-2 px-4 rounded ${
                  activeSection === "videos"
                    ? "border-b-4 border-green-500 font-bold"
                    : ""
                }`}
                onClick={() => scrollToSection("videos")}
              >
                Updates
              </button>
            </div>

            {/* Sections */}
            <div ref={sectionRefs.seva} className="mt-14 ">
              <DonationItems subdonations={campaign?.data?.subdonations} />
              {/* Seva content */}
            </div>
            <div ref={sectionRefs.story} className="mt-10">
              <h3 className="text-xl font-bold mb-4">Seva</h3>
              <p className="text-gray-700 leading-relaxed">
                {campaign?.data?.campaign?.about}
              </p>
            </div>
            <div ref={sectionRefs.videos} className="mt-10">
              <h3 className="text-xl font-bold mb-4">Updates</h3>
              {/* Videos content */}
            </div>
          </div>

          <div className="lg:w-1/3  md:mt-[75px]">
            <div className="bg-white rounded-lg shadow-lg p-4 h-fit">
              <div className="mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-orange-500 font-bold">
                    {Math.round(
                      (Math.round(campaign?.data?.campaign?.donated_amount) /
                        Math.round(campaign?.data?.campaign?.target_amount)) *
                        100
                    )}
                    % raised
                  </span>
                  <span className="text-gray-700">22 Donors</span>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full my-2">
                  <div
                    className={`h-full bg-green-500 rounded-full`}
                    style={{
                      width:
                        Math.round(
                          (Math.round(
                            campaign?.data?.campaign?.donated_amount
                          ) /
                            Math.round(
                              campaign?.data?.campaign?.target_amount
                            )) *
                            100
                        ) + "%",
                    }}
                  ></div>
                </div>
                <span className="text-gray-700">
                  ₹{Math.round(campaign?.data?.campaign?.donated_amount)} raised
                  out of ₹{Math.round(campaign?.data?.campaign?.target_amount)}
                </span>
              </div>
              <hr className="my-3" />
              <SocialButtons />
            </div>
            <div className="rounded-lg shadow-lg h-fit mt-2">
              <HowToDonate />
            </div>
          </div>
        </div>
      </div>
      <DonationModal data={campaign} />

      <div className="fixed bottom-0 z-[22] w-full md:hidden block shadow bg-white p-3">
        <button className="bg-green-500 text-white font-bold rounded  w-[95%] p-2 mx-auto">
          Donate Now
        </button>
      </div>
    </div>
  );
};

export default DonationPage;
