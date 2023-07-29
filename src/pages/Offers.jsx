import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import ListingItem from "../components/ListingItem";

const Offers = () => {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastFetchedListing, setLastFetchListing] = useState(null);
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const listingRef = collection(db, "listing");
        const q = query(
          listingRef,
          where("offer", "==", true),
          orderBy("timeStamp", "desc"),
          limit(8)
        );
        const querySnap = await getDocs(q);
        const lastVisited = querySnap.docs[querySnap.docs.length - 1];
        setLastFetchListing(lastVisited);
        let listings = [];
        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setListings(listings);
        setLoading(false);
      } catch (error) {
        toast.error("Could not fetch data.");
      }
    };
    fetchListings();
  }, []);

  const onFetchMoreListing = async () => {
    try {
      const listingRef = collection(db, "listing");
      const q = query(
        listingRef,
        where("offer", "==", true),
        orderBy("timeStamp", "desc"),
        startAfter(lastFetchedListing),
        limit(4)
      );
      const querySnap = await getDocs(q);
      const lastVisited = querySnap.docs[querySnap.docs.length - 1];
      setLastFetchListing(lastVisited);
      let listings = [];
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings((prevListing) => [...prevListing, ...listings]);
      setLoading(false);
    } catch (error) {
      toast.error("Could not fetch data.");
    }
  };
  return (
    <div className="max-w-6xl mx-auto px-3">
      <h1 className="text-3xl font-bold text-center mt-6 mb-6">Offers</h1>
      {loading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <>
          <main>
            <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {listings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  id={listing.id}
                  listing={listing.data}
                />
              ))}
            </ul>
          </main>
          {lastFetchedListing && (
            <div className="flex items-center justify-center">
              <button
                onClick={onFetchMoreListing}
                className="px-3 py-1.5 mt-6 mb-6 bg-white text-gray-700 border border-gray-300 hover:border-slate-400 transition duration-150 ease-in-out rounded"
              >
                Load more
              </button>
            </div>
          )}
        </>
      ) : (
        <p>There are no current offer.</p>
      )}
    </div>
  );
};

export default Offers;
