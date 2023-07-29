import { useEffect, useState } from "react";
import Slider from "../components/Slider";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import ListingItem from "../components/ListingItem";

const Home = () => {
  // Offers
  const [offerLinstings, setOfferListings] = useState(null);
  useEffect(() => {
    const fetchListing = async () => {
      try {
        //get reference
        const listingsRef = collection(db, "listing");
        // create the query
        const q = query(
          listingsRef,
          where("offer", "==", true),
          orderBy("timeStamp", "desc"),
          limit(4)
        );
        // query execute
        const querySnap = await getDocs(q);
        const listings = [];
        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setOfferListings(listings);
        console.log(listings);
      } catch (error) {
        console.log(error);
      }
    };
    fetchListing();
  }, []);
  // places for rent
  const [rentLinstings, setRentListings] = useState(null);
  useEffect(() => {
    const fetchListing = async () => {
      try {
        //get reference
        const listingsRef = collection(db, "listing");
        // create the query
        const q = query(
          listingsRef,
          where("type", "==", "rent"),
          orderBy("timeStamp", "desc"),
          limit(4)
        );
        // query execute
        const querySnap = await getDocs(q);
        const listings = [];
        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setRentListings(listings);
        console.log(listings);
      } catch (error) {
        console.log(error);
      }
    };
    fetchListing();
  }, []);
  // places for sell
  const [saleLinstings, setSaleListings] = useState(null);
  useEffect(() => {
    const fetchListing = async () => {
      try {
        //get reference
        const listingsRef = collection(db, "listing");
        // create the query
        const q = query(
          listingsRef,
          where("type", "==", "sale"),
          orderBy("timeStamp", "desc"),
          limit(4)
        );
        // query execute
        const querySnap = await getDocs(q);
        const listings = [];
        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setSaleListings(listings);
        console.log(listings);
      } catch (error) {
        console.log(error);
      }
    };
    fetchListing();
  }, []);
  return (
    <>
      <Slider />
      <div className="max-w-6xl pt-4 mx-auto space-y-6">
        {offerLinstings && offerLinstings.length > 0 && (
          <div className="m-2 mb-6">
            <h2 className="font-semibold px-3 mt-6 text-2xl">Recent Offers</h2>
            <Link to="/offers">
              <p className="px-3 text-blue-600 text-sm hover:text-blue-800 transition duration-150 ease-in-out">
                Show more offers
              </p>
            </Link>
            <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {offerLinstings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                />
              ))}
            </ul>
          </div>
        )}
        {rentLinstings && rentLinstings.length > 0 && (
          <div className="m-2 mb-6">
            <h2 className="font-semibold px-3 mt-6 text-2xl">
              Places for rent
            </h2>
            <Link to="/category/rent">
              <p className="px-3 text-blue-600 text-sm hover:text-blue-800 transition duration-150 ease-in-out">
                Show more places for rent
              </p>
            </Link>
            <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {rentLinstings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                />
              ))}
            </ul>
          </div>
        )}
        {saleLinstings && saleLinstings.length > 0 && (
          <div className="m-2 mb-6">
            <h2 className="font-semibold px-3 mt-6 text-2xl">
              Places for sale
            </h2>
            <Link to="/category/sale">
              <p className="px-3 text-blue-600 text-sm hover:text-blue-800 transition duration-150 ease-in-out">
                Show more places for sale
              </p>
            </Link>
            <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {saleLinstings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                />
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
