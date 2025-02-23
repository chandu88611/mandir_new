import React from 'react';
import { useGetSettingsQuery } from '../../redux/services/campaignApi';

const TermsOfUsePage = () => {
  const {data:settings}=useGetSettingsQuery()
  return (
    <div className="md:container mx-auto p-6 md:p-12 mt-8">
      <div className="bg-white p-6 md:p-12 shadow-lg rounded-lg">
        <section className="mb-8">
          <h1 className="text-4xl font-bold text-center mb-4">Terms of Use</h1>

          <div dangerouslySetInnerHTML={{__html:settings?.data?.terms}} />

          {/* <p className="text-gray-700 leading-7">
            This document is an electronic record under the Information Technology Act, 2000. It does not require physical or digital signatures.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-orange-500 mb-3">Welcome to MandirProject</h2>
          <p className="text-gray-700 leading-7">
            MandirProject is operated by Meraklz Ventures LLP, incorporated under Indian law. MandirProject enables:
          </p>
          <ul className="list-disc list-inside text-gray-700 leading-7 ml-4">
            <li>Starting Campaigns with individual or temples or trusts/societies/companies (campaigners)</li>
            <li>Donating to campaigners for annadanam, goseva, temple construction, dharamshala.</li>
            <li>Marketing and facilitating bookings or donations for campaigners.</li>
            <li>Initiating campaigns in partnership with renowned temples or individuals.</li>
          </ul>
          <p className="text-gray-700 leading-7 mt-2">
            By accessing MandirProject, you agree to the Terms of Use and Privacy Policy. If you disagree, do not use MandirProject. These terms may be updated at MandirProjects discretion and are enforceable as any written agreement.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-orange-500 mb-3">Scope of Services</h2>
          <p className="text-gray-700 leading-7">
            Users can donate online through our platform and updates will be provided of the campaigns. Donations for annadanam, goseva, and temple construction are also facilitated.
          </p>
          <p className="text-gray-700 leading-7">
            MandirProject conducts basic verification of campaigners but does not guarantee their genuineness. MandirProject is not liable for transactions between Users and campaigners.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-orange-500 mb-3">Warranties</h2>
          <p className="text-gray-700 leading-7">
            MandirProject is for Indian passport holders only. Non-Indian passport holders cannot donate.
          </p>
          <p className="text-gray-700 leading-7">
            Campaigners must comply with the FCRA and PMLA. Certain persons, including political candidates and government employees, cannot receive foreign contributions as per FCRA guidelines.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-orange-500 mb-3">Liability</h2>
          <p className="text-gray-700 leading-7">
            MandirProject is not liable for any damages or losses arising from the use of the platform. Donors are responsible for their own actions and agree to hold harmless the MandirProject platform and its officers, directors, employees, and agents.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-orange-500 mb-3">General Terms</h2>
          <p className="text-gray-700 leading-7">
            These Terms of Use are the complete agreement between you and MandirProject, superseding all prior communications. They do not create any partnership, agency, or joint venture. MandirProject can assign rights and obligations to third parties without prior notice.
          </p>
          <p className="text-gray-700 leading-7">
            Notices will be sent via email to the addresses provided in your profile.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-orange-500 mb-3">Cancellation and Refund Policy</h2>
          <p className="text-gray-700 leading-7">
            Cancellations are not entertained unless due to technical issues within 3 days of donation. Contact <a href="mailto:support@MandirProject.com" className="text-orange-500">support@MandirProject.com</a> for cancellations.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-orange-500 mb-3">Contact</h2>
          <p className="text-gray-700 leading-7">
            For questions about the Cancellation and Refund Policy, contact <a href="mailto:support@MandirProject.com" className="text-orange-500">support@MandirProject.com</a> or call.
          </p> */}
        </section>
      </div>
    </div>
  );
};

export default TermsOfUsePage;
