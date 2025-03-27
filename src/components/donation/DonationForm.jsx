import React, { useState, useEffect, useRef } from "react";
import { Modal, Button } from "@mui/material";
import { message } from "antd";
import {
  useLoginUserMutation,
  useVerifyOtpMutation,
  useUpdateUserMutation,
} from "../../redux/services/campaignApi";
import { useDispatch, useSelector } from "react-redux";
import { IoClose } from "react-icons/io5";
import { setUserData } from "../../redux/slices/userSlice";
import {
  useCreateOrderMutation,
  useVerifyPaymentMutation,
} from "../../redux/services/transactionApi";

const DonationForm = ({
  open,
  handleClose,
  setIsDonationModalVisible,
  donation_campaign_id,
  donationuser,
}) => {
  console.log(donationuser);
  const [loginUser] = useLoginUserMutation(); // Login mutation
  const [verifyOtp] = useVerifyOtpMutation(); // OTP verification mutation
  const [updateUser] = useUpdateUserMutation(); // Redux API to update user

  const [verifyPayment] = useVerifyPaymentMutation(); // OTP verification mutation
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userData);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const [donationAmount, setDonationAmount] = useState('');
  const [supportPercent, setSupportPercent] = useState(5);
  const [otpModalVisible, setOtpModalVisible] = useState(false); // OTP modal visibility
  const [otp, setOtp] = useState(""); // OTP input
  const [total, setTotal] = useState();
  const [createOrder] = useCreateOrderMutation();
  const [userData, setUserData1] = useState({
    full_name: donationuser?.full_name || "",
    email: donationuser?.email || "",
  });

  const [timer, setTimer] = useState(0);
  const [citizenStatus, setCitizenStatus] = useState("yes");
  const [showError, setShowError] = useState(false);
  const [receiveUpdates, setReceiveUpdates] = useState(false);
  const target = 250000;
  const minAmount = 5;
  const trackRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [percent, setPercent] = useState((minAmount / target) * 100);
  const [donationAmount, setDonationAmount] = useState(minAmount);
  const [error, setError] = useState("");
  // const [infoErrors, setInfoErrors] = useState({
  //   full_name: "",
  //   email: "",
  // });
  const [infoErrors, setInfoErrors] = useState({});

  const [foreignError, setForeignError] = useState(false);

  const updatePosition = (e) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    let clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);

    let newPercent = (x / rect.width) * 100;
    const value = Math.round((newPercent / 100) * target);

    if (value < minAmount) {
      setPercent((minAmount / target) * 100);
      setDonationAmount(minAmount);
    } else {
      setPercent(newPercent);
      setDonationAmount(value);
    }
  };

  useEffect(() => {
    const handleMove = (e) => {
      if (isDragging) updatePosition(e);
    };
    const stopDrag = () => setIsDragging(false);

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", stopDrag);
    window.addEventListener("touchmove", handleMove, { passive: false });
    window.addEventListener("touchend", stopDrag);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", stopDrag);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", stopDrag);
    };
  }, [isDragging]);

  // useEffect(() => {
  //   if (percent === 0) {
  //     setError('Please enter donation amount');
  //   } else if (percent < 5) {
  //     setError('Minimum donation amount is INR 5');
  //   } else {
  //     setError('');
  //   }
  // }, [percent]);

  // Validate donation amount
  useEffect(() => {
    if (!donationAmount || donationAmount === 0) {
      setError("Please enter donation amount");
    } else if (donationAmount < minAmount) {
      setError(`Minimum donation amount is INR ${minAmount}`);
    } else {
      setError("");
    }
  }, [donationAmount]);

  const startDrag = (e) => {
    e.preventDefault();
    updatePosition(e);
    setIsDragging(true);
  };

  // // Optional: Sync when user types in donation input
  // useEffect(() => {
  //   if (donationAmount < minAmount) {
  //     setDonationAmount(minAmount);
  //   }
  //   const calcPercent = ((donationAmount - minAmount) / (target - minAmount)) * 100;
  //   setPercent(calcPercent);
  // }, [donationAmount]);

  useEffect(() => {
    let interval;
    if (otpModalVisible && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpModalVisible, timer]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []); // This only runs once, after the component mounts

  const calculateTotal = () => {
    return donationAmount + (donationAmount * supportPercent) / 100;
  };

  const validateForm = () => {
    if (!citizenStatus) {
      setShowError(true);
      return false;
    }
    setShowError(false);
    return true;
  };

  useEffect(() => {
    if (donationuser) {
      setUserData1({
        full_name: donationuser.full_name || "",
        email: donationuser.email || "",
      });
    }
  }, [donationuser]);

  const handleDonateNow = async () => {
    const errors = {};

    // Validate input fields
    if (!userData.full_name) errors.full_name = "Full Name is required";
    if (!userData.email) errors.email = "Email is required";

    if (Object.keys(errors).length > 0) {
      setInfoErrors(errors);
      return;
    }

    try {
      // ✅ If user is NEW (i.e., no name or email), update their details
      if (!donationuser.full_name || !donationuser.email) {
        await updateUser({
          mobile: donationuser.mobile, // Keep existing mobile number
          full_name: userData.full_name,
          email: userData.email,
        });

        message.success("User details updated successfully");
      }

      // ✅ Proceed with payment (For both new & existing users)
      await initiatePayment();
    } catch (error) {
      message.error(error.data?.error || "Something went wrong.");
    }
  };

  const handleOtpSubmit = async () => {
    if (otp.length === 6) {
      // Call the verify OTP API
      try {
        const response = await verifyOtp({
          mobile_number: donationuser.mobile_number,
          otp: otp,
        });

        // OTP verified successfully, log in the user
        message.success(response.data.message);
        console.log(response);
        localStorage.setItem("authToken", response.data.token);
        setUserData1(response.data.user);
        dispatch(setUserData(response.data.user));
        // Store token in local storage
        setIsLoggedIn(true); // Set user as logged in
        setOtpModalVisible(false); // Close OTP modal
        handleClose();
        setIsDonationModalVisible(true);

        // Close the donation modal when donation is successful
      } catch (error) {
        console.log(error);
        message.error(error.data?.error || "Invalid OTP.");
      }
    } else {
      message.error("Please enter a valid 6-digit OTP.");
    }
  };

  const initiatePayment = async () => {
    try {
      const orderResponse = await createOrder({
        user_id: donationuser?._id,
        donation_campaign_id: donation_campaign_id, // Replace this dynamically
        amount: calculateTotal(),
        // payment_method: "upi",
      }).unwrap();

      await triggerRazorpay(orderResponse.data, orderResponse.donation_id);

      // Redirect to Razorpay payment or show payment UI here
    } catch (error) {
      message.error(error.data?.error || "Error creating order.");
    }
  };

  const handlePresetClick = (value) => {
    setDonationAmount(value);
  };

  // const handleInputChange = (e) => {
  //   let value = e.target.value;

  //   if (value === '') {
  //     setDonationAmount(0); // If input is empty, set to 0
  //     return;
  //   }

  //   value = parseInt(value);

  //   if (isNaN(value)) value = 0;
  //   if (value < 200) value = 0;
  //   if (value > target) value = target;

  //   setDonationAmount(value);
  // };
  const handleInputChange = (e) => {
    let value = e.target.value;

    // Allow empty input
    if (value === "") {
      setDonationAmount("");
      setPercent(0);
      setError("Please enter donation amount");
      return;
    }

    // Remove non-numeric characters
    const numericValue = parseInt(value.replace(/\D/g, ""));

    if (isNaN(numericValue)) {
      setDonationAmount("");
      setPercent(0);
      setError("Please enter donation amount");
      return;
    }

    if (numericValue < minAmount) {
      setDonationAmount(numericValue);
      setPercent((numericValue / target) * 100);
      setError(`Minimum donation amount is INR ${minAmount}`);
    } else {
      const clampedValue = numericValue > target ? target : numericValue;
      setDonationAmount(clampedValue);
      setPercent((clampedValue / target) * 100);
      setError("");
    }
  };

  // const handleSliderChange = (e) => {
  //   let value = parseInt(e.target.value);
  //   if (value < 200) value = 200;
  //   setDonationAmount(value);
  // };

  // const handleMouseMove = (e) => {
  //   if (isDragging && trackRef) {
  //     const rect = trackRef.getBoundingClientRect();
  //     const x = Math.min(Math.max(e.clientX - rect.left, 0), rect.width);
  //     const percent = x / rect.width;
  //     const value = Math.round(percent * (target - minAmount) + minAmount);
  //     setDonationAmount(value);
  //   }
  // };

  const triggerRazorpay = (orderData, donationId) => {
    const options = {
      key: "rzp_live_qMGIKf7WORiiuM", // Add your Razorpay Key ID
      amount: calculateTotal(),
      currency: "INR",
      name: "Giveaze",
      description: "Donation Payment",
      order_id: orderData.id, // Razorpay Order ID
      handler: async function (response) {
        console.log(response);
        try {
          // 3️⃣ Verify payment with backend
          const verifyResponse = await verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            donation_campaign_id: donation_campaign_id,
            user_id: donationuser._id,
            amount: calculateTotal(),
            donorName: donationuser.full_name,
            email: donationuser.email,
          }).unwrap();
          console.log(verifyResponse);
          if (verifyResponse.success) {
            message.success("Payment successful! Thank you for your donation.");
            setIsDonationModalVisible(false);
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          } else {
            message.error("Payment verification failed.");
          }
        } catch (error) {
          message.error(error.data?.error || "Payment verification failed.");
        }
      },
      prefill: {
        name: donationuser.full_name,
        email: donationuser.email,
        contact: donationuser.mobile_number,
      },
      theme: {
        color: "#3399cc",
      },
    };
    const razorpayInstance = new window.Razorpay(options);

    razorpayInstance.open();
  };
  const handleResendOtp = async () => {
    try {
      const response = await loginUser({
        name: userData.full_name,
        email: userData.email,
        mobile_number: userData.mobile_number,
      }).unwrap();

      message.success("OTP resent successfully.");
      setTimer(30); // Restart the timer after resend
    } catch (error) {
      message.error(error.data?.error || "Error resending OTP.");
    }
  };
  const handleOtpModalClose = () => {
    setOtpModalVisible(false);
    setTimer(0); // Reset timer to avoid blocking logic
  };

  return (
    <div>
      {/* Donation Modal */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="donation-modal"
        className="flex justify-center items-center"
      >
        <div className="relative bg-white md:px-6 px-3 md:pt-5 pt-2 md:pb-6 pb-2 rounded-lg shadow-lg max-w-3xl w-full md:flex">
          {/* Close Button (Top Right) */}
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 text-gray-600 hover:text-red-500 transition duration-200"
          >
            <IoClose className="text-2xl md:text-3xl" />
          </button>

          {/* Left Column - Your Information */}
          <div className="md:w-1/2 md:p-4 p-2 border-b border-gray-300 md:border-b-0 md:border-r md:border-gray-200">
            <h2 className="text-xl font-semibold md:mb-6 mb-3">
              Your Information
            </h2>

            {!donationuser?.full_name ? (
              <>
                {/* Full Name */}
                <input
                  type="text"
                  className={`w-full md:p-2 p-1 border ${
                    infoErrors.full_name ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:outline-none`}
                  placeholder="Full Name"
                  value={userData.full_name}
                  onChange={(e) =>
                    setUserData1((prev) => ({
                      ...prev,
                      full_name: e.target.value,
                    }))
                  }
                />
                {infoErrors.full_name && (
                  <p className="text-red-500 text-xs">{infoErrors.full_name}</p>
                )}
                {/* Email */}
                <input
                  type="email"
                  className={`w-full md:p-2 p-1 border ${
                    infoErrors.email ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:outline-none`}
                  placeholder="Email Address"
                  value={userData.email}
                  onChange={(e) =>
                    setUserData1((prev) => ({ ...prev, email: e.target.value }))
                  }
                />
                {infoErrors.email && (
                  <p className="text-red-500 text-xs">{infoErrors.email}</p>
                )}
                {/* Phone Number */}
                {/* <div className="flex gap-4 md:mb-4 mb-1">
                  <select className="md:w-1/3 w-1/2 md:p-2 p-1 text-xs border rounded-lg focus:outline-none focus:border-[#8d7f24] hover:border-[#8d7f24] transition">
                    <option value="+91">+91</option>
                    <option value="+1">+1</option>
                  </select>

                  <input
                    type="tel"
                    className="w-full md:p-2 p-1 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8d7f24] hover:border-[#8d7f24] transition placeholder:text-xs"
                    placeholder="Phone Number"
                    value={userData.mobile_number}
                    onChange={(e) =>
                      setUserData1({
                        ...userData,
                        mobile_number: e.target.value,
                      })
                    }
                    required
                  />
                </div> */}
                {/* Citizenship Question */}
                <div className="md:mt-4 mt-3">
                  <p className="md:mb-3 mb-1 mt-2 md:mt-1 md:text-sm text-xs">
                    Are you an Indian Citizen? <sup>*</sup>
                  </p>
                  <div className="flex space-x-6">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="is_indian_national"
                        value="yes"
                        checked={citizenStatus === "yes"}
                        onChange={() => {
                          setCitizenStatus("yes");
                          setShowError(false);
                          setForeignError(false);
                        }}
                      />
                      <span className="md:text-sm text-xs">Yes</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="is_indian_national"
                        value="no"
                        checked={citizenStatus === "no"}
                        onChange={() => {
                          setCitizenStatus("no");
                          setShowError(false);
                          setForeignError(true);
                        }}
                      />
                      <span className="md:text-sm text-xs">No</span>
                    </label>
                  </div>

                  {/* Reserve space for errors */}
                  <div className="h-4 mt-1">
                    {showError && (
                      <small className="text-red-500 text-xs">
                        Please select your citizenship
                      </small>
                    )}
                    {foreignError && citizenStatus === "no" && (
                      <small className="text-red-500 text-xs">
                        Foreign donations are not allowed for this campaign.
                      </small>
                    )}
                  </div>
                </div>
                <p className="text-[10px] text-gray-500 md:mt-4 mt-4">
                  By proceeding, you are agreeing to Impact Giveaze Foundation's{" "}
                  <a
                    href="/privacy-policy"
                    className="text-[#8d7f24] underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Privacy Policy
                  </a>{" "}
                  and{" "}
                  <a
                    href="/terms-and-conditions"
                    className="text-[#8d7f24] underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Terms & Conditions
                  </a>
                  . and receiving SMS/Whatsapp updates and notifications.
                </p>
              </>
            ) : (
              <>
                {/* Show User's Information When Logged In */}

                <p className="mb-4 text-lg font-medium">
                  👤 {donationuser?.full_name}
                </p>
                <p className="mb-4 text-lg font-medium">
                  📧 {donationuser?.email}
                </p>
                <p className="mb-4 text-lg font-medium">
                  📞 {donationuser?.mobile_number}
                </p>
              </>
            )}
          </div>

          {/* Right Column - Donation Details */}
          <div className="md:w-1/2 md:p-4 p-2 flex flex-col justify-between">
            <h3 className="text-lg font-semibold md:mb-3 mb-1">
              Donation Amount
            </h3>

            {/* Select Amount Header */}
            <h4 className="text-base font-semibold md:mb-3 mb-2 text-left">
              Select Amount
            </h4>

            <div className="grid grid-cols-3 gap-2 mb-4">
              {[500, 1500, 3000].map((amount) => (
                <button
                  key={amount}
                  className={`md:p-2 p-1 rounded-lg text-xs ${
                    donationAmount === amount
                      ? "bg-[#ffdd04] text-black"
                      : "border border-[#8d7f24] text-[#8d7f24]"
                  }`}
                  onClick={() => handlePresetClick(amount)}
                >
                  ₹ {amount}
                </button>
              ))}
            </div>
            <div>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                className={`w-full p-2 mb-0.5 text-xs border rounded-lg transition focus:outline-none ${
                  error
                    ? "border-red-500 focus:border-red-500 hover:border-red-500"
                    : "border-gray-300 focus:border-[#8d7f24] hover:border-[#8d7f24]"
                }`}
                placeholder="Other amount - Rs 5 & more"
                value={donationAmount}
                onChange={handleInputChange}
              />

              {/* Reserve space with fixed height */}
              <div className="h-4 mb-2 md:mb-4">
                {error && <p className="text-red-500 text-[10px]">{error}</p>}
              </div>
            </div>

            {/* Progress Track */}
            <div
              ref={trackRef}
              className="relative w-[95%] ml-3 h-1 md:h-2 mt-1 bg-gray-200 rounded-full select-none"
              onMouseDown={startDrag}
              onTouchStart={startDrag}
            >
              {/* Progress Fill */}
              <div
                className={`absolute top-0 left-0 md:h-2 h-1 bg-[#ff4757] rounded-full ${
                  isDragging ? "" : "transition-all duration-200"
                }`}
                style={{ width: `${percent}%` }}
              ></div>

              {/* Heart Button */}
              <div
                className={`absolute top-1/2 -translate-y-1/2 cursor-pointer z-20 ${
                  isDragging ? "" : "transition-all duration-200"
                }`}
                style={{
                  left: `${percent}%`,
                  transform: "translate(-50%, -50%)",
                }}
                onMouseDown={startDrag}
                onTouchStart={startDrag}
              >
                <div className="md:w-7 md:h-7 w-6 h-6 bg-white border-2 border-[#ff4757] rounded-full flex items-center justify-center shadow">
                  <img
                    src="/images/heart-icon.svg"
                    alt="Heart"
                    className="md:w-4 md:h-4 w-3 h-3"
                    draggable={false}
                  />
                </div>
              </div>
            </div>

            {/* Support Us Section */}
            <div className="md:mb-6 mb-2 md:mt-6 mt-4">
              <h3 className="text-base font-semibold md:mb-2 mb-1">
                Support Us
              </h3>
              <select
                className="w-full p-2 border rounded-lg text-xs focus:outline-none focus:border-[#8d7f24] hover:border-[#8d7f24] transition"
                value={supportPercent}
                onChange={(e) => setSupportPercent(e.target.value)}
              >
                <option value={0}>0%</option>
                <option value={5}>5%</option>
                <option value={10}>10%</option>
                <option value={20}>20%</option>
              </select>
            </div>

            <h3 className="text-base font-semibold md:mb-4 mb-1 text-left">
              Total Donation: ₹ {calculateTotal()}
            </h3>
            <div className="flex justify-center">
              <button
                className="w-auto max-w-full px-20 py-3 gap-2 text-xl text-center mt-3 font-semibold text-white bg-[#d8573e] rounded-full
              shadow-md transition-all duration-300 hover:bg-[#a84430] hover:shadow-lg flex items-center justify-center whitespace-nowrap"
                onClick={handleDonateNow}
              >
                <span className="flex-1 text-left">Proceed to Pay</span>
                <span className="flex-1 text-right">₹ {calculateTotal()}</span>
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* OTP Modal */}
      <Modal
        open={otpModalVisible}
        onClose={handleOtpModalClose}
        aria-labelledby="otp-modal"
        className="flex justify-center items-center"
      >
        <div className="p-6 bg-white rounded-lg shadow-lg w-[90%] sm:max-w-sm md:max-w-xs lg:max-w-[320px] flex flex-col items-center text-center">
          <h2 className="text-xl font-semibold mb-4">Verify OTP</h2>
          <p className="text-sm mb-4 text-gray-600">
            Sent to +91{userData.mobile_number}
          </p>

          <input
            type="text"
            className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:border-[#8d7f24] hover:border-[#8d7f24] transition"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <button
            className="bg-[#ffdd04] text-black font-bold py-2 w-full rounded-lg mb-2"
            onClick={handleOtpSubmit}
          >
            VERIFY
          </button>

          {timer > 0 ? (
            <p className="text-xs text-gray-500">RESEND OTP ({timer}s)</p>
          ) : (
            <button
              onClick={handleResendOtp}
              className="text-xs text-[#8d7f24] font-medium"
            >
              RESEND OTP
            </button>
          )}

          <p className="text-[10px] text-gray-400 mt-3">
            *By continuing, I agree to the{" "}
            <a href="/terms" className="underline">
              Terms Of Use
            </a>{" "}
            and{" "}
            <a href="/privacy-policy" className="underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default DonationForm;
