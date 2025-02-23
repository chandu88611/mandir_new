import React from 'react';
import CampaignDetails from './DonationDetails';
import DonationItems from './DoationItems';
import StorySection from './StorySection';
import Updates from './Updates';
import Donors from './Donaors';
import FAQs from './faq';

const CampaignPage = () => {
  return (
    <div className="bg-gray-100">
      <CampaignDetails />
      <DonationItems />
      <StorySection />
      <Updates />
      <Donors />
      <FAQs />
    </div>
  );
};

export default CampaignPage;
