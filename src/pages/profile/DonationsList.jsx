import React, { useState } from "react";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { ClipboardEdit, Download, Edit3 } from "lucide-react";
// import html2pdf from "html2pdf.js";
import PanAddressModal from ".//PanAddressModal";
import { message } from "antd";

import { useUpdateDonationDetailsMutation } from "../../redux/services/campaignApi";
import { useLazyGetDonationReceiptQuery } from "../../redux/services/campaignApi";

const DonationsList = ({ userDonations }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDonationId, setSelectedDonationId] = useState(null);

  const [updateDonationDetails] = useUpdateDonationDetailsMutation();
  const [getDonationReceipt, { isLoading }] = useLazyGetDonationReceiptQuery();

  const handleDownload = async (transactionId) => {
    try {
      const blob = await getDonationReceipt(transactionId).unwrap(); // ✅ use unwrap to get actual Blob
      console.log(blob);
      if (!(blob instanceof Blob)) {
        throw new Error("Invalid blob received");
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `receipt_${transactionId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download receipt:", error);
      message.error("Could not download receipt.");
    }
  };

  const handleUpdateDonation = async (formData) => {
    try {
      const response = await updateDonationDetails(formData);

      if (response?.data?.issued_80g) {
        message.success(
          response.data.message || "Donation updated successfully with 80G."
        );
      } else {
        message.success(
          response.data.message || "Donation updated successfully without 80G."
        );
      }
    } catch (error) {
      message.error("Failed to update donation details. Please try again.");
      console.error("Failed to update donation details:", error);
    }
  };

  return (
    <div className="w-full max-w-full sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg px-8 sm:px-4 lg:px-2 mx-auto py-2">
      <h2 className="text-2xl font-semibold mb-4 text-center">My Donations</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {userDonations?.donations?.length > 0 ? (
          userDonations.donations.map((donation) => {
            const isSuccessful = donation.payment_status === "successful";
            const amount =
              donation.total_amount?.$numberDecimal || donation.total_amount;

            return (
              <div
                key={donation?._id}
                className="bg-white shadow-md rounded-lg p-2 border border-gray-200 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-md font-semibold mb-2">
                    <span className="text-gray-500 font-medium">
                      {donation?.donation_campaign_id?.campaign_title}
                    </span>
                  </h3>

                  {/* <p className="text-gray-700">
                    Transaction ID: {donation.transaction_id}
                  </p> */}
                  <p className="text-gray-700">Amount: ₹{amount}</p>
                  <p className="text-gray-500 text-sm">
                    Date:{" "}
                    {new Date(donation.donated_date).toLocaleDateString(
                      "en-GB"
                    )}
                  </p>
                  <span
                    className={`inline-block mt-2 px-3 py-1 text-sm font-medium rounded-full text-white ${
                      isSuccessful ? "bg-green-500" : "bg-yellow-500"
                    }`}
                  >
                    {donation.payment_status.toUpperCase()}
                  </span>
                </div>

                {isSuccessful && (
                  // <div
                  //   className="flex justify-between items-center mt-4 w-full"
                  //   style={{ display: "flex", justifyContent: "space-between" }}
                  // >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mt-4 w-full">
                    <button
                      data-tooltip-id={`download-tip-${donation._id}`}
                      data-tooltip-content={
                        donation?.issued_80g
                          ? "Download your receipt with 80G tax benefit"
                          : "Download your donation receipt"
                      }
                      onClick={() => handleDownload(donation.transaction_id)}
                      className="flex items-center gap-2 text-blue-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isLoading} // or use isFetching if that reflects your loading state
                    >
                      <Download size={16} />
                      {donation?.issued_80g
                        ? "Receipt (80G)"
                        : "Download Receipt"}
                    </button>

                    <Tooltip
                      id={`download-tip-${donation._id}`}
                      place="top"
                      event={window.innerWidth < 640 ? "click" : undefined}
                      className="text-xs px-2 py-1 rounded shadow-md max-w-[180px]"
                    />

                    <button
                      data-tooltip-id={`apply-tip-${donation._id}`}
                      data-tooltip-content="Submit your PAN and address to get 80G certificate"
                      onClick={() => {
                        setSelectedDonationId(donation._id);
                        setIsModalOpen(true);
                      }}
                      className="flex items-center gap-2 text-blue-600 hover:underline"
                    >
                      <ClipboardEdit size={16} />
                      Apply 80G
                    </button>
                    <Tooltip
                      id={`apply-tip-${donation._id}`}
                      place="top"
                      event={window.innerWidth < 640 ? "click" : undefined}
                      className="text-xs px-2 py-1 rounded shadow-md max-w-[180px]"
                    />
                    {/* </div> */}

                    <PanAddressModal
                      open={isModalOpen}
                      onClose={() => {
                        setSelectedDonationId(null); // 👈 Clear the selected ID when modal closes
                        setIsModalOpen(false);
                      }}
                      onSubmit={handleUpdateDonation} // Pass the function for submission
                      donationId={selectedDonationId} // 👈 pass the correct donationId here
                    />
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <p className="text-gray-500">No donations found.</p>
        )}
      </div>
    </div>
  );
};

export default DonationsList;

// function convertNumberToWords(amount) {
//   const num = parseInt(amount, 10);
//   if (isNaN(num)) return "";

//   const a = [
//     "",
//     "One",
//     "Two",
//     "Three",
//     "Four",
//     "Five",
//     "Six",
//     "Seven",
//     "Eight",
//     "Nine",
//     "Ten",
//     "Eleven",
//     "Twelve",
//     "Thirteen",
//     "Fourteen",
//     "Fifteen",
//     "Sixteen",
//     "Seventeen",
//     "Eighteen",
//     "Nineteen",
//   ];
//   const b = [
//     "",
//     "",
//     "Twenty",
//     "Thirty",
//     "Forty",
//     "Fifty",
//     "Sixty",
//     "Seventy",
//     "Eighty",
//     "Ninety",
//   ];

//   const numberToWords = (n) => {
//     if (n < 20) return a[n];
//     if (n < 100) return b[Math.floor(n / 10)] + (n % 10 ? " " + a[n % 10] : "");
//     if (n < 1000)
//       return a[Math.floor(n / 100)] + " Hundred " + numberToWords(n % 100);
//     if (n < 100000)
//       return (
//         numberToWords(Math.floor(n / 1000)) +
//         " Thousand " +
//         numberToWords(n % 1000)
//       );
//     if (n < 10000000)
//       return (
//         numberToWords(Math.floor(n / 100000)) +
//         " Lakh " +
//         numberToWords(n % 100000)
//       );
//     return (
//       numberToWords(Math.floor(n / 10000000)) +
//       " Crore " +
//       numberToWords(n % 10000000)
//     );
//   };

//   return numberToWords(num).trim() + " Rupees Only";
// }
//   const generateDonationReceipt = (donation, userDonations) => {
//     const amount =
//       donation.total_amount?.$numberDecimal || donation.total_amount;

//     const receiptHTML = `
//       <div id="receipt" style="font-family: Arial, sans-serif; padding: 30px; max-width: 800px; margin: auto; border: 1px solid #ccc; background-color: #fff; border-radius: 8px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);">
//       <!-- Logo & Title -->
// <div style="display: flex; flex-direction: column; align-items: center; text-align: center;">
//   <img src="/giveaze2.png" alt="Giveaze Logo" width="120" style="margin-bottom: 10px; display: block;" />
//   <h2 style="font-size: 26px; color: #333; margin-bottom: 5px;">Donation Receipt</h2>
// </div>
//         <!-- Acknowledgment Message -->
//         <div style="margin-top: 30px; text-align: center;">
//           <p style="font-size: 16px; font-style: italic; color: #444;">
//             We acknowledge with gratitude the generous donation
//             received from <strong>${userDonations?.full_name}</strong>
//             (
//             This contribution was made through made through
//             <a href="https://giveaze.com" style="color: #007BFF;" target="_blank">www.giveaze.com</a>,
//             in support of the campaign titled "
//             <a href="https://giveaze.com/campaign/${
//               donation?.donation_campaign_id?._id
//             }"
//             target="_blank" style="color: #007BFF; font-weight: bold;" target="_blank">
//             ${donation?.donation_campaign_id?.campaign_title}
//             </a>
//           </p>
//         </div>
//         <!-- Two Column Section -->
// <div style="display: flex; gap: 40px; margin-top: 20px;">

//   <!-- Left Column - Donation Details -->
//   <div style="flex: 1;">
//     <h3 style="font-size: 18px; color: #222; margin-bottom: 12px;">Donation Details</h3>

//     <p style="margin: 6px 0;"><span style="color: #555;">Transaction ID:</span> <span style="color: grey;">${
//       donation.transaction_id
//     }</span></p>
//     <p style="margin: 6px 0;"><span style="color: #555;">Campaign ID:</span> <span style="color: grey;">${
//       donation?.donation_campaign_id?._id
//     }</span></p>
//     <p style="margin: 6px 0;"><span style="color: #555;">Amount Donated:</span> <span style="color: grey;">₹${amount}</span></p>
//     <p style="margin: 6px 0;"><span style="color: #555;">Status:</span> <span style="color: grey;">${
//       donation.payment_status
//     }</span></p>
//     <p style="margin: 6px 0;"><span style="color: #555;">Date:</span> <span style="color: grey;">${new Date(
//       donation.donated_date
//     ).toLocaleDateString("en-GB")}</span></p>
//   </div>

//   <!-- Right Column - Donor Info -->
//   <div style="flex: 1;">
//     <h3 style="font-size: 18px; color: #222; margin-bottom: 12px;">Donor Information</h3>

//     <p style="margin: 6px 0;"><span style="color: #555;">Name:</span> <span style="color: grey;">${
//       userDonations?.full_name
//     }</span></p>
//     <p style="margin: 6px 0;"><span style="color: #555;">Email:</span> <span style="color: grey;">${
//       userDonations?.email
//     }</span></p>
//     <p style="margin: 6px 0;"><span style="color: #555;">Phone:</span> <span style="color: grey;">${
//       userDonations?.mobile_number
//     }</span></p>
//    ${
//      donation?.issued_80g
//        ? `
//     <p style="margin: 6px 0;"><span style="color: #555;">PAN:</span> <span style="color: grey;">${
//       donation?.pan_number || "N/A"
//     }</span></p>
//     <p style="margin: 6px 0;"><span style="color: #555;">Address:</span> <span style="color: grey;">${
//       donation?.full_address || "N/A"
//     }</span></p>
//   `
//        : ""
//    }
//   </div>

// </div>

//         <!-- Footer -->
//         <div style="margin-top: 40px; border-top: 1px solid #ddd; padding-top: 20px;">
//           <h4 style="font-size: 16px; color: #333;">Giveaze Foundation</h4>
//           <p style="font-size: 14px; color: #555; margin: 5px 0;">MPC1705, Parkwest, Hosakere Road, Binnypet, Bangalore - 560023</p>
//           <p style="font-size: 14px; color: #555; margin: 5px 0;"><strong>Email:</strong> info@giveaze.com</p>
//           <p style="font-size: 14px; color: #555;"><strong>Website:</strong> <a href="https://giveaze.com" target="_blank" style="color: #007BFF;">www.giveaze.com</a></p>

//           <p style="margin-top: 20px; font-size: 12px; text-align: center; color: #999;">
//             <em>This receipt is for acknowledgment purposes only. For official tax exemption documents, please contact us at <a href="mailto:info@giveaze.com">info@giveaze.com</a>.</em>
//           </p>
//         </div>
//       </div>
//     `;

//     const receiptContainer = document.createElement("div");
//     receiptContainer.innerHTML = receiptHTML;
//     document.body.appendChild(receiptContainer);

//     const element = receiptContainer.querySelector("#receipt");

//     const options = {
//       margin: 0.5,
//       filename: `Receipt_${donation.transaction_id}.pdf`,
//       image: { type: "jpeg", quality: 0.98 },
//       html2canvas: { scale: 2 },
//       jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
//     };

//     html2pdf()
//       .set(options)
//       .from(element)
//       .save()
//       .then(() => {
//         document.body.removeChild(receiptContainer);
//       });
//   };
