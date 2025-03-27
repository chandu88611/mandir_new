import React from 'react';


const testimonials = [
  {
    name: "Shri Mehandipur Balaji Temple Trust",
    designation: "Bangalore",
    feedback:
      "Our temple’s restoration was not just a physical transformation but a spiritual revival. The temple had lost its vibrancy, but with Giveaze’s intervention, it has been given new life and ensured that both the spiritual and practical needs of the temple were met.",
    image: "/1.jpeg", // Replace with actual image path
  },
  {
    name: "Shri Shyam Baba Temple Trust",
    designation: "Pune",
    feedback:
      "The restoration of our temple was not just about repairing walls; it was about reviving a place of spiritual connection for thousands. Giveaze made this possible with their dedication and transparency.",
    image: "/2.jpeg", // Replace with actual image path
  },
  {
    name: "Shri Karni Mata Mandir Trust",
    designation: "Udaipur",
    feedback:
      "From improving infrastructure to ensuring regular maintenance, Giveaze has helped us sustain the temple for future generations. Their support has been invaluable in keeping our traditions alive.",
    image: "/3.jpeg", // Replace with actual image path
  },
];


const Testimonials = () => {
  return (
    <section className="bg-gray-100 py-5 px-3">
      <div className="xl:w-[1200px] mx-auto text-center">
        <h2 className="text-3xl font-bold mb-2">What Fundraisers Say</h2>
        {/* <p className="text-gray-600 mb-8">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</p> */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-lg col-span">
              <div className="mb-2">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-16 h-16 mx-auto rounded-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold">{testimonial.name}</h3>
              <p className="text-gray-500 mb-4">{testimonial.designation}</p>
              <p className="text-gray-700 text-sm">{testimonial.feedback}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
