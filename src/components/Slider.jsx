import React, { useEffect, useState } from "react";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";
import Spinner from "../components/Spinner";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, {
  Navigation,
  Pagination,
  Autoplay,
  EffectFade,
} from "swiper";
import "swiper/css/bundle";
import { useNavigate } from "react-router-dom";

const Slider = () => {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  SwiperCore.use([Autoplay, Navigation, Pagination]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchListings = async () => {
      const listingRef = collection(db, "listing");
      const q = query(listingRef, orderBy("timeStamp", "desc"), limit(5));
      const querySnap = await getDocs(q);
      console.log(querySnap);

      let listings = [];
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      console.log(listings);

      setListings(listings);
      setLoading(false);
    };
    fetchListings();
  }, []);
  if (loading) {
    return <Spinner />;
  }
  if (listings.length === 0) {
    return <></>;
  }

  return (
    listings && (
      <>
        <Swiper
          slidesPerView={1}
          navigation
          pagination={{ type: "progressbar" }}
          effect="fade"
          modules={[EffectFade]}
          autoplay={{ delay: 3000 }}
        >
          {listings.map(({ data, id }) => (
            <SwiperSlide
              key={id}
              onClick={() => navigate(`/category/${data.type}/${id}`)}
            >
              <div
                style={{
                  background: `url(${data.imgUrls[0]}) center no-repeat`,
                  backgroundSize: "cover",
                }}
                className="w-full overflow-hidden h-[300px] relative "
              ></div>
              <p className="text-[#f1faee] absolute left-1 top-3 bg-[#457b9d] font-medium p-2 rounded-br-3xl shadow-lg max-w-[90%] opacity-90">
                {data.name}
              </p>
              <p className="text-[#f1faee] absolute left-1 bottom-1 bg-[#e63946] font-semibold p-2 rounded-tr-3xl shadow-lg max-w-[90%] opacity-90">
                ${" "}
                {(data.discountedPrice ?? data.regularPrice)
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                {data.type === "rent" && " / month"}
              </p>
            </SwiperSlide>
          ))}
        </Swiper>
      </>
    )
  );
};

export default Slider;
