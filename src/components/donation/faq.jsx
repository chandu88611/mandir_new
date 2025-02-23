import React, { useState } from 'react';

const faqs = [
  { question: 'How can I contribute to a cause?', answer: 'You can contribute by donating or sharing the campaign.' },
  { question: 'Are the NGOs verified?', answer: 'Yes, all NGOs are verified before being listed.' },
  { question: 'Why do I need to give a tip?', answer: 'Tips help us run the platform and provide better services.' },
  { question: 'How will I know that the products reached the beneficiary?', answer: 'You will receive updates from the campaign organizers.' },
];

const FAQs = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="container mx-auto p-4 bg-white shadow-md rounded-md my-6">
      <h3 className="text-xl font-bold mb-4">FAQ'S</h3>
      {faqs.map((faq, index) => (
        <div key={index} className="border-b py-2">
          <button
            onClick={() => toggleFAQ(index)}
            className="text-lg font-semibold w-full text-left focus:outline-none"
          >
            {faq.question}
          </button>
          {openIndex === index && <p className="text-gray-600 mt-2">{faq.answer}</p>}
        </div>
      ))}
    </section>
  );
};

export default FAQs;
