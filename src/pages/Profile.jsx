import React from "react";
import { useState, useEffect } from "react";
import { getAuth, updateProfile } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { FcHome } from "react-icons/fc";
import { collection, query, where, getDoc, orderBy } from "firebase/firestore";
import ListingItem from "../components/ListingItem";

const Profile = () => {
  const auth = getAuth();
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [changeDetail, setChangeDetail] = useState(false);
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });
  const { name, email } = formData;
  const navigate = useNavigate();
  const onLogout = () => {
    auth.signOut();
    navigate("/");
  };
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };
  const onSubmit = async () => {
    try {
      if (auth.currentUser.displayName !== name) {
        // update displayName in firebase auth
        await updateProfile(auth.currentUser, {
          displayName: name,
        });
        // update name in the firestore
        const docRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(docRef, {
          name,
        });
      }
      toast.success("Profile detail updated.");
    } catch (error) {
      toast.error("Could not update the profile detail.");
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchUserListing = async () => {
      const listingsRef = collection(db, "listing");
      console.log(auth.currentUser.uid);
      const q = query(
        listingsRef,
        where("useRef", "==", auth.currentUser.uid),
        orderBy("timeStamp", "desc")
      );
      console.log(q);
      const querySnap = await getDocs(q);
      let listings = [];
      querySnap.forEach((doc) => {
        console.log(doc);
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      console.log(listings);
      setListings(listings);
      setLoading(false);
    };
    fetchUserListing();
  }, [auth.currentUser.uid]);

  const onDelete = async (listingID) => {
    if (window.confirm("Are you sure you want to delete?")) {
      await deleteDoc(doc(db, "listing", listingID));
      const updatedListing = listings.filter(
        (listing) => listing.id !== listingID
      );
      setListings(updatedListing);
      toast.success("listing successfully deleted.");
    }
  };

  const onEdit = (listingID) => {
    navigate(`/edit-listing/${listingID}`);
  };
  return (
    <>
      <section className="flex max-w-6xl mx-auto flex-col justify-center items-center ">
        <h1 className="text-3xl font-bold text-center mt-6">My Profile</h1>
        <div className="w-full md:w-[50%] mt-6 px-3 ">
          <form>
            {/* input Name */}
            <input
              type="text"
              id="name"
              value={name}
              disabled={!changeDetail}
              onChange={onChange}
              className={`w-full  mb-6 bg-white px-4 py-2 text-xl text-gray-700 border border-gray-300 rounded transition ease-in-out ${
                changeDetail && "bg-red-200 focus:bg-red-200"
              }`}
            ></input>
            {/* input Name */}
            <input
              type="email"
              id="email"
              value={email}
              disabled
              className="w-full mb-6 bg-white px-4 py-2 text-xl text-gray-700 border border-gray-300 rounded transition ease-in-out "
            ></input>
            <div className="flex justify-between items-center whitespace-nowrap text-sm md:text-lg mb-6 ">
              <p className="flex items-center">
                Do you want to change your name?{" "}
                <span
                  onClick={() => {
                    changeDetail && onSubmit(),
                      setChangeDetail((prevState) => !prevState);
                  }}
                  className="text-red-600  hover:text-red-700 transition ease-in-out duration-200 cursor-pointer ml-1"
                >
                  {changeDetail ? "Apply Change" : "Edit"}
                </span>
              </p>
              <p
                onClick={onLogout}
                className="text-blue-600  hover:text-blue-700 transition ease-in-out duration-200 cursor-pointer"
              >
                Sign out
              </p>
            </div>
          </form>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 w-full rounded text-white text-sm font-medium uppercase px-7 py-3 shadow-md hover:shadow-lg transition ease-in-out duration-150"
          >
            <Link
              to="/create-listing"
              className="flex justify-center items-center"
            >
              <FcHome className="mr-3 p-1 bg-red-200 rounded-full border-2 text-3xl " />
              Sell or rent your home
            </Link>
          </button>
        </div>
      </section>
      <div className="max-w-6xl mt-6 px-3 mx-auto ">
        {!loading && listings.length > 0 && (
          <>
            <h2 className="text-2xl font-semibold text-center mt-6 mb-6 ">
              My Listings
            </h2>
            <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 mt-6 mb-6">
              {listings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  id={listing.id}
                  listing={listing.data}
                  OnDelete={() => onDelete(listing.id)}
                  onEdit={() => onEdit(listing.id)}
                />
              ))}
            </ul>
          </>
        )}
      </div>
    </>
  );
};

export default Profile;
