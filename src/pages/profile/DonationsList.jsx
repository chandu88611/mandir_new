import React from "react";

const DonationsList = ({ donations }) => {
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">My Donations</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {donations.length > 0 ? (
          donations.map((donation) => (
            <div
              key={donation._id}
              className="bg-white shadow-lg rounded-lg p-4 border border-gray-200"
            >
              <h3 className="text-lg font-semibold">Campaign ID: {donation.donation_campaign_id}</h3>
              <p className="text-gray-700">Transaction ID: {donation.transaction_id}</p>
              <p className="text-gray-700">Amount: ₹{donation.total_amount.$numberDecimal}</p>
              <p className="text-gray-500 text-sm">Date: {new Date(donation.donated_date).toLocaleDateString()}</p>
              <span
                className={`inline-block mt-2 px-3 py-1 text-sm font-medium rounded-lg text-white 
                ${donation.payment_status === "successful" ? "bg-green-500" : "bg-yellow-500"}`}
              >
                {donation.payment_status.toUpperCase()}
              </span>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No donations found.</p>
        )}
      </div>
    </div>
  );
};

export default DonationsList;
