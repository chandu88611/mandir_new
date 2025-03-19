import React, { useState, useEffect,useRef  } from "react";
import { Modal, Button } from "@mui/material";
import { message } from "antd";
import {
  useLoginUserMutation,
  useVerifyOtpMutation,
} from "../../redux/services/campaignApi";
import { useDispatch, useSelector } from "react-redux";
import { IoClose } from "react-icons/io5";
import { setUserData } from "../../redux/slices/userSlice";
import {
  useCreateOrderMutation,
  useVerifyPaymentMutation,
} from "../../redux/services/transactionApi";
console.log(setUserData);
const DonationForm = ({
  open,
  handleClose,
  setIsDonationModalVisible,
  donation_campaign_id,
}) => {
  const [loginUser] = useLoginUserMutation(); // Login mutation
  const [verifyOtp] = useVerifyOtpMutation(); // OTP verification mutation
  const [verifyPayment] = useVerifyPaymentMutation(); // OTP verification mutation
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [donationAmount, setDonationAmount] = useState(1000);
  const [supportPercent, setSupportPercent] = useState(5);
  const [otpModalVisible, setOtpModalVisible] = useState(false); // OTP modal visibility
  const [otp, setOtp] = useState(""); // OTP input
  const [total, setTotal] = useState();
  const [createOrder] = useCreateOrderMutation();
  const [userData, setUserData1] = useState({
    full_name: "",
    email: "",
    mobile_number: "",
  });
  const [timer, setTimer] = useState(0);
  const [citizenStatus, setCitizenStatus] = useState("yes");
  const [showError, setShowError] = useState(false);
  const [receiveUpdates, setReceiveUpdates] = useState(false);
  const target = 250000;
  const minAmount = 200;
  const trackRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [percent, setPercent] = useState(0);
  
  const updatePosition = (e) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    let clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
    const newPercent = (x / rect.width) * 100;
    setPercent(newPercent);
  
    // Sync with donation amount
    const value = Math.round((newPercent / 100) * (target - minAmount) + minAmount);
    setDonationAmount(value);
  };
  
  const startDrag = (e) => {
    e.preventDefault();
    updatePosition(e);
    setIsDragging(true);
  };
  
  useEffect(() => {
    const handleMove = (e) => {
      if (isDragging) {
        updatePosition(e);
      }
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
  
  // Optional: Sync when user types in donation input
  useEffect(() => {
    if (donationAmount < minAmount) {
      setDonationAmount(minAmount);
    }
    const calcPercent = ((donationAmount - minAmount) / (target - minAmount)) * 100;
    setPercent(calcPercent);
  }, [donationAmount]);

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

  const handleDonateNow = async () => {
    if (!isLoggedIn) {
      if (!userData.full_name || !userData.email || !userData.mobile_number) {
        message.error("Please fill in all required fields.");
        return;
      }
      if (!citizenStatus) {
        setShowError(true);
        return;
      }
  
      try {
        const response = await loginUser({
          name: userData.full_name,
          email: userData.email,
          mobile_number: userData.mobile_number,
        }).unwrap();
  
        message.success(response.message);
  
        // Hide donation modal & open OTP modal with timer
        setOtpModalVisible(true);
        setTimer(30);
      } catch (error) {
        message.error(error.data?.error || "Error sending OTP.");
      }
    } else {
      const res = await initiatePayment();
      message.success("Donation successful.");
      handleClose();
    }
  };
    console.log(userData);
  // Function to handle OTP form submission
  const handleOtpSubmit = async () => {
    if (otp.length === 6) {
      // Call the verify OTP API
      try {
        const response = await verifyOtp({
          mobile_number: userData.mobile_number,
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
        user_id: user?.userData?._id,
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

  const handleInputChange = (e) => {
    let value = parseInt(e.target.value);
    if (isNaN(value)) value = 200;
    if (value < 200) value = 200;
    if (value > target) value = target;
    setDonationAmount(value);
  };
  
  const handleSliderChange = (e) => {
    let value = parseInt(e.target.value);
    if (value < 200) value = 200;
    setDonationAmount(value);
  };

  const handleMouseMove = (e) => {
    if (isDragging && trackRef) {
      const rect = trackRef.getBoundingClientRect();
      const x = Math.min(Math.max(e.clientX - rect.left, 0), rect.width);
      const percent = x / rect.width;
      const value = Math.round(percent * (target - minAmount) + minAmount);
      setDonationAmount(value);
    }
  };
  

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
            user_id: user?.userData?._id,
            amount: calculateTotal(),
          }).unwrap();

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
        name: userData.full_name,
        email: userData.email,
        contact: userData.mobile_number,
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
        className="flex justify-center items-end md:items-center"
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
          <h2 className="text-xl font-semibold md:mb-6 mb-3">Your Information</h2>

            {!isLoggedIn ? (
              <>
                {/* Full Name */}
                <input
  type="text"
  className="w-full md:p-2 p-1 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8d7f24] hover:border-[#8d7f24] transition placeholder:text-xs md:mb-4 mb-3"
  placeholder="Full Name"
  value={userData.full_name}
  onChange={(e) =>
    setUserData1({ ...userData, full_name: e.target.value })
  }
  required
/>


                {/* Email Address */}
                <input
                  type="email"
                  className="w-full md:p-2 p-1 md:mb-4 mb-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8d7f24] hover:border-[#8d7f24] transition placeholder:text-xs"
                  placeholder="Email Address"
                  value={userData.email}
                  onChange={(e) =>
                    setUserData1({ ...userData, email: e.target.value })
                  }
                  required
                />

                {/* Phone Number */}
                <div className="flex gap-4 md:mb-4 mb-1">
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
                </div>
                
        {/* Citizenship Question */}
        <div className="md:mt-6 md:mt-4 mt-3">
          <p className="md:mb-3 mb-1 mt-2 md:mt-1 md:text-sm text-xs">Are you an Indian Citizen? <sup>*</sup></p>
          <div className="flex space-x-6">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="is_indian_national"
                value="yes"
                checked={citizenStatus === "yes"}
                onChange={() => setCitizenStatus("yes")}
              />
              <span className="md:text-sm text-xs">Yes</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="is_indian_national"
                value="no"
                checked={citizenStatus === "no"}
                onChange={() => setCitizenStatus("no")}
              />
              <span className="md:text-sm text-xs">No</span>
            </label>
          </div>
          {showError && (
            <small className="text-red-500">Please select your citizenship</small>
          )}
        </div>
      {/* Receive Transaction Updates */}
<div className="md:mt-3 mt-2 flex items-start space-x-2">
  <input
    type="checkbox"
    id="receive_updates"
    className="mt-0.5"
    checked={receiveUpdates}
    onChange={(e) => setReceiveUpdates(e.target.checked)}
  />
  <label htmlFor="receive_updates" className="text-xs text-gray-400 leading-snug opacity-70">
  I want to receive transaction updates / alerts from Impact Giveaze Foundation
</label>

</div>

{/* Disclaimer for Privacy Policy & Terms */}
<p className="text-[10px] text-gray-500 md:mt-6 mt-4">
  By proceeding, you are agreeing to Impact Giveaze Foundation's{" "}
  <a href="/privacy-policy" className="text-[#8d7f24] underline" target="_blank" rel="noopener noreferrer">
    Privacy Policy
  </a>{" "}
  and{" "}
  <a href="/terms-and-conditions" className="text-[#8d7f24] underline" target="_blank" rel="noopener noreferrer">
    Terms & Conditions
  </a>.
</p>

              </>
            ) : (
              <>
                {/* Show User's Information When Logged In */}

                <p className="mb-4 text-lg font-medium">
                  👤 {userData.full_name}
                </p>
                <p className="mb-4 text-lg font-medium">📧 {userData.email}</p>
                <p className="mb-4 text-lg font-medium">
                  📞 {userData.mobile_number}
                </p>
              </>
            )}
            
          </div>

          {/* Right Column - Donation Details */}
          <div className="md:w-1/2 md:p-3 p-2 flex flex-col justify-between">
            <h3 className="text-lg font-semibold md:mb-3 mb-1">Donation Amount</h3>

            {/* Select Amount Header */}
            <h4 className="text-base font-semibold md:mb-1 mb-2 text-left">Select Amount</h4>

                      <div className="grid grid-cols-3 gap-2 mb-4">
              {[500, 1500, 3000].map((amount) => (
                <button
                  key={amount}
                  className={`p-1 rounded-lg text-xs ${
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

            <input
  type="number"
  className="w-full p-2 md:mb-4 mb-3 text-xs border rounded-lg focus:outline-none focus:border-[#8d7f24] hover:border-[#8d7f24] transition"
  placeholder="Other amount - Rs 300 & more"
  value={donationAmount}
  onChange={handleInputChange}
/>
{/* Progress Track */}
<div
      ref={trackRef}
      className="relative w-[95%] ml-3 h-1 mt-1 bg-gray-200 rounded-full select-none"
      onMouseDown={startDrag}
      onTouchStart={startDrag}
    >
      {/* Progress Fill */}
      <div
        className={`absolute top-0 left-0 h-1 bg-[#ff4757] rounded-full ${
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
        <div className="w-6 h-6 bg-white border-2 border-[#ff4757] rounded-full flex items-center justify-center shadow">
          <img
            src="/images/heart-icon.svg"
            alt="Heart"
            className="w-3 h-3"
            draggable={false}
          />
        </div>
      </div>
    </div>

           {/* Support Us Section */}
            <div className="md:mb-4 mb-2 mt-4">
              <h3 className="text-base font-semibold md:mb-2 mb-1">Support Us</h3>
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
                className="px-16 py-3 text-sm mt-3 font-semibold text-white bg-[#d8573e] rounded-full
               shadow-md transition-all duration-300 hover:bg-[#a84430] hover:shadow-lg"
                onClick={handleDonateNow}
              >
                Proceed to Pay
                <span className="ml-2">₹ {calculateTotal()}</span>
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
        <div className="p-6 bg-white rounded-lg shadow-lg max-w-sm w-full ">
          <h2 className="text-xl font-semibold mb-6">Verify OTP</h2>
          <p className="text-sm mb-4 text-gray-600">Sent to +91{userData.phone}</p>

          <input
            type="text"
            className="w-full p-3 mb-6 border rounded-lg focus:outline-none focus:border-[#8d7f24] hover:border-[#8d7f24] transition"
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
     {/* Resend OTP with countdown */}
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
  {/* Terms & Privacy */}
  <p className="text-[10px] text-gray-400 mt-3">
      *By continuing, I agree to the{" "}
      <a href="#" className="underline">
        Terms Of Use
      </a>{" "}
      and{" "}
      <a href="#" className="underline">
        Privacy Policy
      </a>
    </p>

        </div>
      </Modal>
    </div>
  );
};

export default DonationForm;