import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []); // This only runs once, after the component mounts

  const calculateTotal = () => {
    return donationAmount + (donationAmount * supportPercent) / 100;
  };

  const handleDonateNow = async () => {
    if (!isLoggedIn) {
      if (!userData.full_name || !userData.email || !userData.mobile_number) {
        message.error("Please fill in all required fields.");
        return;
      }

      // Call the login API to send OTP
      try {
        const response = await loginUser({
          name: userData.full_name,
          email: userData.email,
          mobile_number: userData.mobile_number,
        }).unwrap();

        // OTP sent successfully, open OTP modal
        message.success(response.message);

        setOtpModalVisible(true);
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

  return (
    <div>
      {/* Donation Modal */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="donation-modal"
        className="flex justify-center items-end md:items-center"
      >
        <div className="relative bg-white px-6 pt-5 pb-6 rounded-lg shadow-lg max-w-3xl w-full md:flex">
          {/* Close Button (Top Right) */}
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 text-gray-600 hover:text-red-500 transition duration-200"
          >
            <IoClose size={"30px"} />
          </button>

          {/* Left Column - Your Information */}
          <div className="md:w-1/2 p-4 border-r border-gray-200">
            <h2 className="text-xl font-semibold mb-6">Your Information</h2>

            {!isLoggedIn ? (
              <>
                {/* Full Name */}
                <input
                  type="text"
                  className="w-full p-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8d7f24] hover:border-[#8d7f24] transition"
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
                  className="w-full p-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8d7f24] hover:border-[#8d7f24] transition"
                  placeholder="Email Address"
                  value={userData.email}
                  onChange={(e) =>
                    setUserData1({ ...userData, email: e.target.value })
                  }
                  required
                />

                {/* Phone Number */}
                <div className="flex gap-4 mb-6">
                  <select className="w-1/3 p-3 border rounded-lg focus:outline-none focus:border-[#8d7f24] hover:border-[#8d7f24] transition">
                    <option value="+91">+91</option>
                    <option value="+1">+1</option>
                  </select>

                  <input
                    type="tel"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8d7f24] hover:border-[#8d7f24] transition"
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
          <div className="md:w-1/2 p-4 flex flex-col justify-between">
            <h3 className="text-lg font-semibold mb-6">Donation Amount</h3>

            {/* Select Amount Header */}
            <h4 className="font-semibold mb-2 text-left">Select Amount</h4>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {[500, 1500, 3000].map((amount) => (
                <button
                  key={amount}
                  className={`py-2 px-4 rounded-lg ${
                    donationAmount === amount
                      ? "bg-[#ffdd04] text-black"
                      : "border border-[#8d7f24] text-[#8d7f24]"
                  }`}
                  onClick={() => setDonationAmount(amount)}
                >
                  ₹ {amount}
                </button>
              ))}
            </div>

            <input
              type="number"
              className="w-full p-3 mb-6 border rounded-lg focus:outline-none focus:border-[#8d7f24] hover:border-[#8d7f24] transition"
              placeholder="Other amount - Rs 300 & more"
              value={donationAmount}
              onChange={(e) => setDonationAmount(parseInt(e.target.value))}
            />

            {/* Support Us Section */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Support Us</h3>
              <select
                className="w-full p-3 border rounded-lg focus:outline-none focus:border-[#8d7f24] hover:border-[#8d7f24] transition"
                value={supportPercent}
                onChange={(e) => setSupportPercent(e.target.value)}
              >
                <option value={0}>0%</option>
                <option value={5}>5%</option>
                <option value={10}>10%</option>
                <option value={20}>20%</option>
              </select>
            </div>

            <h3 className="font-semibold mb-6 text-left">
              Total Donation: ₹ {calculateTotal()}
            </h3>
            <div className="flex justify-right">
              <button
                className="px-2 py-2 text-sm font-semibold text-white bg-sky-500 rounded-md 
               shadow-md transition-all duration-300 hover:bg-sky-600 hover:shadow-lg"
                onClick={handleDonateNow}
              >
                Proceed to Pay{" "}
                <span className="ml-2">₹ {calculateTotal()}</span>
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* OTP Modal */}
      <Modal
        open={otpModalVisible}
        onClose={() => setOtpModalVisible(false)}
        aria-labelledby="otp-modal"
        className="flex justify-center items-center"
      >
        <div className="p-6 bg-white rounded-lg shadow-lg max-w-sm w-full ">
          <h2 className="text-xl font-semibold mb-6">Enter OTP</h2>
          <input
            type="text"
            className="w-full p-3 mb-6 border rounded-lg focus:outline-none focus:border-[#8d7f24] hover:border-[#8d7f24] transition"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <button
            className="bg-[#ffdd04] text-black font-bold py-3 px-6 rounded-lg w-full"
            onClick={handleOtpSubmit}
          >
            Submit OTP
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default DonationForm;
