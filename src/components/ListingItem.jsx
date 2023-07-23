import React from "react";
// import Moment from "react-moment";
// import moment from "moment";
// import Moment from "react-moment";
import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";

const ListingItem = ({ listing, id }) => {
  const listingDate = listing.timeStamp?.toDate();
  console.log(listingDate);
  return (
    <li className="  m-[10px] relative bg-white flex flex-col shadow-md hover:shadow-xl rounded-md transition-shadow duration-150 overflow-hidden justify-between items-center ">
      <Link to={`/category/${listing.type}/${id}`} className="contents">
        <img
          src={listing.imgUrls[0]}
          className="h-[170px] w-full object-cover hover:scale-105 transition-scale duration-200 ease-in"
          loading="lazy"
        />
        <p className="absolute top-2 left-2 bg-[#3377cc] rounded-md px-2 py-1 shadow-lg text-white uppercase text-xs font-semibold">
          4 months ago
        </p>
        {/* <Moment>{listingDate}</Moment> */}
        <div className="w-full p-[10px]">
          <div className="flex space-x-1 items-center">
            <MdLocationOn className="h-4 w-4 text-green-600" />
            <p className="text-sm truncate mb-[2px] text-gray-600 font-semibold">
              {listing.address}
            </p>
          </div>
          <p className="truncate text-xl font-semibold m-0">{listing.name}</p>
          <p className="text-[#457b9d] font-semibold mt-2">
            $
            {listing.offer
              ? listing.discountedPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : listing.regularPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            {listing.type === "rent" && " / month"}
          </p>
          <div className="flex items-center space-x-3 mt-[10px]">
            <div className="flex items-center space-x-1">
              <p className="text-xs font-bold">
                {listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : "1 Bed"}
              </p>
            </div>
            <div className="flex items-center space-x-1">
              <p className="text-xs font-bold">
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} Baths`
                  : "1 Bath"}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </li>
  );
};

export default ListingItem;
