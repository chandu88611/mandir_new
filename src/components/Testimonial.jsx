import React from 'react';

const testimonials = [
  {
    name: "Sri Venkateswara Temple",
    designation: "Tirupati Trust",
    feedback: "Mauris sodales tellus vel felis dapibus, sit amet porta nibh egestas. Sed dignissim tellus quis sapien sagittis cursus. Vivamus nec est accumsan et justo odio dignissim luctus eu blanditlis.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzZ0VfhWna37BTPzP32CAPNozaxlcZSaCNuXa4EbNQrkI-zEzKMpC5yjBtLyYW1ncSWtQ&usqp=CAU" // Replace with actual image path
  },
  {
    name: "Somnath Temple",
    designation: "Somnath Trust",
    feedback: "Mauris sodales tellus vel felis dapibus, sit amet porta nibh egestas. Sed dignissim tellus quis sapien sagittis cursus. Vivamus nec est accumsan et justo odio dignissim luctus eu blanditlis.",
    image: "https://lh3.googleusercontent.com/p/AF1QipMU3k2ONQeR072h1iK4-68-NHSLWqkQMVrzmibJ=s1360-w1360-h1020" // Replace with actual image path
  },
  {
    name: "Golden Temple",
    designation: "Amritsar Trust",
    feedback: "Mauris sodales tellus vel felis dapibus, sit amet porta nibh egestas. Sed dignissim tellus quis sapien sagittis cursus. Vivamus nec est accumsan et justo odio dignissim luctus eu blanditlis.",
    image: "https://whyweseek.com/wp-content/uploads/2018/03/Golden-Temple-at-Night-Amritsar.jpg" // Replace with actual image path
  }
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
