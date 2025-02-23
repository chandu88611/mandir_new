import React, { useState, useEffect, useCallback } from "react";
import { Pagination } from "antd";
import { useGetCampaignsByCategoryQuery } from "../../redux/services/campaignApi";
import axios from "axios";
import debounce from "lodash.debounce";
import { Link } from "react-router-dom";
import { CiHeart } from "react-icons/ci";

const DonationCard = ({ campaign }) => {
  return (
    <div className="max-w-sm rounded-lg shadow-lg mx-auto border border-gray-200">
      <Link to={`/campaign/${campaign?._id}`}>
        <div className="bg-white rounded-lg cursor-pointer shadow-md overflow-hidden border-2 p-2">
          <img
            src={campaign?.main_picture}
            alt={campaign?.campaign_title}
            className="w-full h-48 object-cover rounded"
          />
          <div className="p-4">
            <div className="flex gap-3">
              <img src="/images/VALIDATED.png" alt="" className="w-16" />
              {campaign?.is_tax && (
                <img src="/images/tax.png" alt="" className="w-16" />
              )}
            </div>
            <h3 className="mt-1 text-[17px] font-bold">
              {campaign?.campaign_title?.length > 58
                ? campaign?.campaign_title?.slice(0, 58) + ". . ."
                : campaign?.campaign_title}
            </h3>
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>
                  {Math.round(
                    (Math.round(campaign?.minimum_amount?.$numberDecimal) /
                      Math.round(campaign?.target_amount?.$numberDecimal)) *
                      100
                  )}
                  % raised of {campaign?.target_amount?.$numberDecimal || 0}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div
                  className="bg-orange-500 h-2.5 rounded-full"
                  style={{
                    width: `${Math.round(
                      (Math.round(campaign?.minimum_amount?.$numberDecimal) /
                        Math.round(campaign?.target_amount?.$numberDecimal)) *
                        100
                    )}%`,
                  }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 my-1">200 Donations</p>
              <hr className="h-2 my-2" />
              <Link to={`/campaign/${campaign?._id}`}>
                <button className="w-full flex gap-2 items-center justify-center bg-[#d6573d] text-white font-bold py-2 px-4 rounded-full">
                  <div className="relative">
                    Donate Now{" "}
                    <span>
                      <CiHeart className="animate-ping absolute -right-8 top-[5px]" />
                    </span>
                  </div>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

const CampaignSkeleton = () => (
  <div className="max-w-sm rounded-lg shadow-lg   border border-gray-200 animate-pulse">
    <div className="w-full h-48 bg-gray-300"></div>
    <div className="px-6 py-4">
      <div className="bg-gray-300 h-6 w-1/2 mb-2"></div>
      <div className="bg-gray-300 h-4 w-1/4 mb-2"></div>
      <div className="bg-gray-300 h-4 w-1/3 mb-2"></div>
      <div className="bg-gray-300 h-4 w-full mb-2"></div>
      <div className="bg-gray-300 h-10 w-full mt-4"></div>
    </div>
  </div>
);

const CampaignList = () => {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All"); // Default is "All"
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);

  // Fetch categories from the server
  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "https://devaseva.onrender.com/api/category/list"
      );
      setCategories([{ _id: "All", name: "All" }, ...response.data.categories]); // Include 'All' as default
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Handle the category parameter properly
  const getCategoryForApi = (category) => {
    return category === "All" ? "All" : category; // Return "All" for "All", else return category id
  };

  // Fetch campaigns based on selected category, search term, and pagination
  const {
    data: campaignData,
    isLoading,
    isError,
    refetch,
  } = useGetCampaignsByCategoryQuery({
    category:
      activeCategory === "All"
        ? "All"
        : categories.find((cat) => cat.name === activeCategory)?._id, // Pass id for other categories, "All" for All
    search: searchTerm,
    page,
    perPage,
  });

  useEffect(() => {
    // Fetch categories on page load
    fetchCategories();
  }, []);

  useEffect(() => {
    // Refetch campaigns when category, search term, or page changes
    refetch();
  }, [activeCategory, searchTerm, page]);

  // Handle category filter click
  const handleFilter = (category) => {
    setActiveCategory(category);
    setPage(1); // Reset to the first page when changing categories
  };

  // Handle search input with debounce
  const handleSearch = (event) => {
    const { value } = event.target;
    debouncedSearch(value);
  };

  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchTerm(value);
      setPage(1); // Reset to the first page when searching
    }, 500),
    [] // Only create the debounce function once
  );

  useEffect(() => {
    // Cleanup debounce on component unmount
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const filteredCampaigns = campaignData?.data?.campaigns || [];

  return (
    <div className="w-full  lg:w-[1200px] mx-auto px-4 py-8 mt-[68px]">
      <h2 className="text-4xl font-bold text-center mb-8 text-gray-700">
        Create Your Impact!
      </h2>

      {/* Category Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 mx-auto space-y-3  ">
        {/* <div className="flex flex-wrap space-x-2 space-y-2 md:space-y-0">
          {categories.map((category) => (
            <button
              key={category._id}
              onClick={() => handleFilter(category.name)}
              className={`font-medium text-gray-700 pb-2 px-4 py-1 rounded-lg hover:bg-green-100 transition ${
                activeCategory === category.name
                  ? "border-b-4 border-green-500 bg-green-50"
                  : ""
              }`}
            >
              {category.name}
            </button>
          ))}
        </div> */}

        {/* Search & Sorting */}
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 ">
          <input
            type="text"
            onChange={handleSearch}
            placeholder="Search campaign"
            className="border p-2 rounded-lg !w-[100%] md:w-64 focus:outline-none focus:border-green-500"
          />
        </div>
      </div>
      <hr className="mb-3" />
      {/* Campaign Cards or Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => <CampaignSkeleton key={i} />)
        ) : filteredCampaigns.length > 0 ? (
          filteredCampaigns.map((campaign, index) => (
            <DonationCard key={index} campaign={campaign} />
          ))
        ) : (
          <div className="col-span-3 text-center">
            <p className="text-gray-500 text-xl mt-10">
              No campaigns found for this category.
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-8">
        <Pagination
          current={page}
          pageSize={perPage}
          total={campaignData?.data?.totalCampaigns || 0}
          onChange={(page) => setPage(page)}
          className="text-center"
        />
      </div>
    </div>
  );
};

export default CampaignList;
