"use client";

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HiUserCircle, HiOutlineLogout, HiMenu, HiX } from "react-icons/hi";
import { IoIosArrowDown } from "react-icons/io";
import { FiUser } from "react-icons/fi";
import axios from "axios";
import LoginModel from "./LoginModel";
import FormModal from "./AddCampaignForm";
import { useLazyGetUserProfileQuery } from "../redux/services/campaignApi";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/slices/userSlice";
import Swal from "sweetalert2";
const PublicHeader = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [token, setToken] = useState(null);
  const [fetchData, { data }] = useLazyGetUserProfileQuery();
  const user = useSelector((state) => state.user.userData);
  console.log(user);
  const dispatch = useDispatch();
  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      const call = async () => {
        try {
          const res = await fetchData();
          if (res?.data?.status) {
            dispatch(
              setUserData({
                ...res?.data?.data,
                donations: res?.data?.donations,
              })
            );
          } else {
            localStorage.removeItem("authToken");
            window.location.reload();
          }
        } catch (error) {
          localStorage.removeItem("authToken");
          window.location.reload();
        }
      };
      call();
    }
    if (typeof window !== "undefined") {
      setToken(localStorage?.getItem("authToken"));
    }
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(
        "https://devaseva.onrender.com/api/users/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (typeof window !== "undefined") {
        localStorage?.removeItem("authToken");
        dispatch(setUserData());
      }
      setIsProfileDropdownOpen(false);
      setToken(null);
      window.location.href = "/";
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const navigationLinks = [
    // { name: "How it works?", path: "/" },
    { name: "Explore Campaign", path: "/explore-campaign" },
    // { name: "Featured Campaign", path: "/campaigns" },
    { name: "FAQ", path: "/faq" },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <div className="lg:w-[1190px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/">
                <img
                  src="/giveaze2.png"
                  alt="Logo"
                  className="w-32 md:w-36 h-auto"
                />
              </Link>
            </div>

            {/* Desktop Navigation */}

            {/* Action Buttons */}
            <div className="flex items-center space-x-4">
              {/* <button
                onClick={() => setIsCampaignModalOpen(true)}
                className="hidden sm:block bg-gradient-to-r from-red-500 via-pink-500 to-yellow-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:from-red-600 hover:to-yellow-600 transition duration-300"
              >
                Start Campaign
              </button> */}
              <div className="hidden md:flex md:items-center md:space-x-6 mr-3">
                {navigationLinks.map((link) => (
                  <a
                    // key={link.name}
                    href={link.path}
                    className="text-gray-700 hover:text-blue-600 font-medium"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
              {token ? (
                <div
                  className="relative  "
                  onMouseLeave={() => setIsProfileDropdownOpen(false)}
                >
                  <button
                    onClick={() =>
                      setIsProfileDropdownOpen(!isProfileDropdownOpen)
                    }
                    className="flex items-center space-x-1 focus:outline-none"
                  >
                    <HiUserCircle className="w-6 h-6 text-gray-700" />
                    <IoIosArrowDown className="w-4 h-4 text-gray-700" />
                  </button>
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0  w-40 bg-white border rounded-md shadow-lg py-2 ">
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition duration-150"
                      >
                        <FiUser className="w-4 h-4 mr-2" />
                        Profile
                      </Link>
                      <button
                        onClick={() => {
                          Swal.fire({
                            title: "Are you sure?",
                            text: "You will be logged out of your account.",
                            icon: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#3085d6",
                            cancelButtonColor: "#d33",
                            confirmButtonText: "Yes, log me out",
                          }).then((result) => {
                            if (result.isConfirmed) {
                              handleLogout();
                            }
                          });
                        }}
                        className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 transition duration-150"
                      >
                        <HiOutlineLogout className="w-4 h-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="bg-gradient-to-r  bg-[#ffdd04] text-black px-4 py-[5px] rounded-full text-sm font-semibold  transition duration-300"
                >
                  Login
                </button>
              )}

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="text-gray-700 focus:outline-none"
                >
                  <HiMenu className="w-6 h-6 mt-1" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40">
            <div
              className="fixed inset-0 bg-black opacity-50"
              onClick={() => setIsMobileMenuOpen(false)}
            ></div>
            <div className="fixed inset-y-0 right-0 w-64 bg-white shadow-md py-4 px-4 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <Link to="/">
                  <img src="/giveaze2.png" alt="Logo" className="w-32 h-auto" />
                </Link>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-700 focus:outline-none"
                >
                  <HiX className="w-6 h-6" />
                </button>
              </div>
              <nav className="flex flex-col space-y-4 ml-3">
                {navigationLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className="text-gray-700 hover:text-blue-600 font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
                {/* <button
                  onClick={() => {
                    setIsCampaignModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="bg-gradient-to-r bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold  transition duration-300"
                >
                   <a href="https://tally.so/r/w4Lgjb" target='_blank'>
                  Start a Campaign
                   </a>
                </button> */}
                {user?.mobile_number ? (
                  <>
                    <Link
                      to="/profile"
                      className="flex items-center text-gray-700 hover:text-blue-600 font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {/* <FiUser className="w-5 h-5 mr-2" /> */}
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center text-gray-700 hover:text-blue-600 font-medium"
                    >
                      {/* <HiOutlineLogout className="w-5 h-5 mr-2" /> */}
                      Logout
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setIsLoginModalOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="bg-gradient-to-r  to-yellow-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:from-blue-900 hover:to-yellow-600 transition duration-300"
                  >
                    Login
                  </button>
                )}
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* Modals */}
      <LoginModel
        open={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
      <FormModal
        open={isCampaignModalOpen}
        onClose={() => setIsCampaignModalOpen(false)}
      />
    </>
  );
};

export default PublicHeader;
