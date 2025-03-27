import React from 'react';
import { useGetSettingsQuery } from '../../redux/services/campaignApi';

const AboutUsPage = () => {
  const {data:settings}=useGetSettingsQuery()
  return (
    <div className="md:container mx-auto p-6 md:p-12 mt-8">
      <div className="bg-white p-6 md:p-12 shadow-lg rounded-lg">
        <section className="mb-8">
          <h1 className="text-4xl font-bold text-center mb-4">About Us</h1>


          <div dangerouslySetInnerHTML={{__html:settings?.data?.about_us}} />
          {/* <p className="text-gray-700 leading-7">
            Welcome to MandirProject, a crowdfunding platform dedicated to supporting the renovation and construction of temples, dharamshalas, and gosevas. Our mission is to preserve Indias rich cultural heritage and spiritual legacy by providing a platform for individuals to contribute towards the restoration and development of these sacred spaces.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-orange-500 mb-3">Our Story</h2>
          <p className="text-gray-700 leading-7">
            We were founded by a group of passionate individuals who recognized the importance of preserving Indias cultural heritage and spiritual legacy. We saw the need for a platform that would enable individuals to contribute towards the renovation and construction of temples, dharamshalas, and gosevas, and thus, MandirProject was born.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-orange-500 mb-3">Our Mission</h2>
          <p className="text-gray-700 leading-7">
            Our mission is to provide a platform for individuals to contribute towards the renovation and construction of temples, dharamshalas, and gosevas, and to support the preservation of Indias cultural heritage and spiritual legacy. We aim to make a positive impact on society.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-orange-500 mb-3">How We Work</h2>
          <p className="text-gray-700 leading-7">
            We work with temple trusts, dharamshala committees, and goseva organizations to identify projects that require funding. Campaigners then create a campaign for each project, highlighting the need for renovation, construction, or goseva, and the impact that the project will have on the community. Individuals can then contribute towards the project through our platform, and track the progress of the project through regular updates.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-orange-500 mb-3">Our Values</h2>
          <p className="text-gray-700 leading-7">
            We are committed to transparency, and excellence in all that we do. We believe in the power of community and the importance of preserving Indias cultural heritage and spiritual legacy.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-orange-500 mb-3">Join Us</h2>
          <p className="text-gray-700 leading-7">
            Join us in our mission to preserve Indias cultural heritage and spiritual legacy. Contribute towards the renovation and construction of temples, dharamshalas, and gosevas, and be a part of a movement that is making a positive impact on society.
          </p> */}
        </section>
      </div>
    </div>
  );
};

export default AboutUsPage;
