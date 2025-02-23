import React from 'react';
import { useGetSettingsQuery } from '../../redux/services/campaignApi';

const PrivacyPolicyPage = () => {
  const {data:settings}=useGetSettingsQuery()
  return (
    <div className="md:container mx-auto p-6 md:p-12 mt-8">
      <div className="bg-white p-6 md:p-12 shadow-lg rounded-lg">
        <section className="mb-8">
          <h1 className="text-4xl font-bold text-center mb-4">Privacy Policy</h1>
          <div dangerouslySetInnerHTML={{__html:settings?.data?.privacypolicy}} />
         
        </section>

        {/* <section className="mb-8">
          <h2 className="text-2xl font-semibold text-orange-500 mb-3">Definitions</h2>
          <p className="text-gray-700 leading-7">
            - Site is www.MandirProject.com.<br />
            - Service refers to donation services via the Site.<br />
            - We, us, and our mean the Company.<br />
            - You means the user.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-orange-500 mb-3">Information We Collect</h2>
          <p className="text-gray-700 leading-7">
            1. Non-Personal Information: Includes anonymous data like usage stats, preferences, and device details.<br />
            2. Personal Information: Includes your phone number, email, name, and address.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-orange-500 mb-3">Collection Methods</h2>
          <p className="text-gray-700 leading-7">
            <strong>Technology:</strong> We use cookies to collect non-personal information.<br />
            <strong>Registration:</strong> You provide personal information when creating an account.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-orange-500 mb-3">Children’s Privacy</h2>
          <p className="text-gray-700 leading-7">
            We do not collect information from children under 13. Contact us if you believe we have done so.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-orange-500 mb-3">Use and Sharing of Information</h2>
          <p className="text-gray-700 leading-7">
            <strong>Personal Information:</strong> Used for communication and services, not shared for marketing without consent.<br />
            <strong>Non-Personal Information:</strong> Used to improve services and analyze trends.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-orange-500 mb-3">Protection of Information</h2>
          <p className="text-gray-700 leading-7">
            We use security measures to protect your data but cannot guarantee absolute security.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-orange-500 mb-3">Your Rights</h2>
          <p className="text-gray-700 leading-7">
            You can opt out of marketing communications. Contact us at <a href="mailto:support@MandirProject.com" className="text-orange-500">support@MandirProject.com</a>.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-orange-500 mb-3">Links to Other Websites</h2>
          <p className="text-gray-700 leading-7">
            We are not responsible for the privacy practices of other sites.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-orange-500 mb-3">Changes to Privacy Policy</h2>
          <p className="text-gray-700 leading-7">
            We may update this policy and will notify you of significant changes.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-orange-500 mb-3">Contact Us</h2>
          <p className="text-gray-700 leading-7">
            For questions, email <a href="mailto:support@MandirProject.com" className="text-orange-500">support@MandirProject.com</a>.
          </p>
        </section>

        <section className="mb-8">
          <p className="text-gray-700 leading-7">
            <strong>Last Updated:</strong> July 22, 2024
          </p>
        </section> */}
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
