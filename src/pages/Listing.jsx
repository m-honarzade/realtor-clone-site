import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { db } from "../firebase";

import Spinner from "../components/Spinner";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  FaShare,
  FaMapMarkerAlt,
  FaBed,
  FaBath,
  FaParking,
  FaChair,
} from "react-icons/fa";

import SwiperCore, {
  EffectFade,
  Autoplay,
  Navigation,
  Pagination,
} from "swiper";
import "swiper/css/bundle";

const Listing = () => {
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);
  SwiperCore.use([Autoplay, Navigation, Pagination]);
  useEffect(() => {
    const fetchListing = async () => {
      const docRef = doc(db, "listing", params.listingId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setListing(docSnap.data());
        setLoading(false);
      }
    };
    fetchListing();
    console.log(listing);
  }, [params.listingId, listing]);
  if (loading) {
    return <Spinner />;
  }
  return (
    <main>
      <Swiper
        slidesPerView={1}
        navigation
        pagination={{ type: "progressbar" }}
        effect="fade"
        modules={[EffectFade]}
        autoplay={{ delay: 3000 }}
      >
        {listing.imgUrls.map((url, index) => (
          <SwiperSlide key={index}>
            <div
              className=" relative w-full overflow-hidden h-[300px]"
              style={{
                background: `url(${listing.imgUrls[index]}) center no-repeat`,
                backgroundSize: "cover",
              }}
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="flex justify-center items-center bg-white fixed top-[13%]  right-[3%] z-10 border-2 border-gray-400 cursor-pointer rounded-full w-12 h-12">
        <FaShare
          className="text-lg text-slate-500"
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            setShareLinkCopied(true);
            setTimeout(() => {
              setShareLinkCopied(false);
            }, 2000);
          }}
        />
      </div>
      {shareLinkCopied && (
        <p className="fixed top-[23%] right-[5%] rounded-md border-2 border-gray-400 bg-white font-semibold p-2 z-10 ">
          Link Copied.
        </p>
      )}
      <div className=" flex flex-col md:flex-row m-4 max-w-6xl lg:mx-auto rounded-lg bg-white p-4 lg:space-x-5 shadow-lg">
        <div className=" w-full h-[200px] lg:h-[400px]">
          <p className="text-2xl font-bold mb-3 text-blue-900">
            {listing.name} - ${" "}
            {listing.offer
              ? listing.discountedPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : listing.regularPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            {listing.type === "rent" ? "/ month" : ""}
          </p>
          <p className="flex items-center mt-6 mb-3 font-semibold ">
            <FaMapMarkerAlt className="text-green-700 mr-1" />
            {listing.address}
          </p>
          <div className="flex  w-[%75] justify-start items-center space-x-4">
            <p className="bg-red-800 text-white w-full max-w-[200px] rounded shadow-md font-semibold p-1 text-center">
              {listing.type === "rent" ? "for Rent" : "for Sale"}
            </p>
            <p className="bg-green-800 text-white w-full max-w-[200px] rounded shadow-md font-semibold p-1 text-center">
              {listing.offer && (
                <p>
                  {(listing.regularPrice - listing.discountedPrice)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                  discount
                </p>
              )}
            </p>
          </div>
          <p className="mt-3 mb-3">
            <span className="font-semibold ">Description - </span>
            {listing.description}
          </p>
          <ul className="flex flex-row space-x-2 items-center lg:space-x-10 text-sm font-semibold">
            <li className="flex items-center whitespace-nowrap">
              <FaBed className="text-lg mr-1" />
              {+listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : "1 Bed"}
            </li>
            <li className="flex items-center whitespace-nowrap">
              <FaBath className="text-lg mr-1" />
              {+listing.bathrooms > 1 ? `${listing.bathrooms} Baths` : "1 Bath"}
            </li>
            <li className="flex items-center whitespace-nowrap">
              <FaParking className="text-lg mr-1" />
              {listing.parking ? `Parking spot` : "No parking"}
            </li>
            <li className="flex items-center whitespace-nowrap">
              <FaChair className="text-lg mr-1" />
              {listing.furnished ? `Furnished` : "Not furnished"}
            </li>
          </ul>
        </div>
        <div className=" w-full h-[200px] lg:h-[400px] z-10 overflow-x-hidden "></div>
      </div>
    </main>
  );
};

export default Listing;
