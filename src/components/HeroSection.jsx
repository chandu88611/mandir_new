import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import {
  useGetBannerImagesQuery,
  useGetSettingsQuery,
} from "../redux/services/campaignApi";

const HeroSection = () => {
  const { data: images } = useGetBannerImagesQuery();
  const { data: settings } = useGetSettingsQuery();

  return (
    <section className="relative bg-white mt-[60px] lg:w-[1200px] w-full mx-auto">
      <div className=" mx-auto">
        {/* Swiper Slider */}
        <Swiper
          spaceBetween={30}
          centeredSlides={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          navigation={true}
          modules={[Navigation, Pagination, Autoplay]}
          className="mySwiper "
        >
          <SwiperSlide>
            <div className="relative w-full h-auto lg:h-[400px] flex flex-col lg:flex-row items-center justify-center bg-white">
              <div className="lg:w-1/2 flex flex-col justify-center px-6 lg:px-12 py-4 text-left">
                <h3 className="text-2xl md:text-2xl lg:text-3xl font-bold text-gray-800">
                  {settings?.data?.banner_title}
                </h3>
                <p className="mt-4 text-sm md:text-md lg:text-md text-gray-600">
                  {settings?.data?.banner_description}{" "}
                </p>
                <a href={settings?.data?.banner_link}>
                  <button className="mt-6 py-3 w-[200px] px-6 bg-[#545454] text-white font-semibold rounded-full hover:bg-[#7b7a7a]">
                    Join Us Now!
                  </button>
                </a>
              </div>
              <div className="lg:w-1/2">
                <img
                  className="w-full h-[330px] object-cover"
                  src={images?.banners[0]}
                  alt=""
                />
              </div>
            </div>
          </SwiperSlide>

          {/* <SwiperSlide>
            <div className="relative w-full h-auto lg:h-[400px] flex flex-col lg:flex-row items-center justify-center bg-white">
              <div className="lg:w-1/2 flex flex-col justify-center px-6 lg:px-12 py-4 text-left">
                <h3 className="text-2xl md:text-2xl lg:text-3xl font-bold text-gray-800">
                  Empower the Future
                </h3>
                <p className="mt-4 text-sm md:text-md lg:text-md text-gray-600">
                  Your donations ensure education for children in need.
                </p>
                <button className="mt-6 py-3 px-6 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700">
                  Donate Now!
                </button>
              </div>
              <div className="lg:w-1/2">
                <img
                  className="w-full h-[300px] object-cover"
                  src={images?.banners[1]}
                  alt="Banner 2"
                />
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="relative w-full h-auto lg:h-[400px] flex flex-col lg:flex-row items-center justify-center bg-white">
              <div className="lg:w-1/2 flex flex-col justify-center px-6 lg:px-12 py-4 text-left">
                <h3 className="text-2xl md:text-2xl lg:text-3xl font-bold text-gray-800">
                  Help Us Save Lives
                </h3>
                <p className="mt-4 text-sm md:text-md lg:text-md text-gray-600">
                  Support medical supplies and save countless lives in rural areas.
                </p>
                <button className="mt-6 py-3 px-6 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700">
                  Get Involved!
                </button>
              </div>
              <div className="lg:w-1/2">
                <img
                  className="w-full h-[300px] object-cover"
                  src={images?.banners[2]}
                  alt="Banner 3"
                />
              </div>
            </div>
          </SwiperSlide> */}
        </Swiper>
      </div>
    </section>
  );
};

export default HeroSection;
