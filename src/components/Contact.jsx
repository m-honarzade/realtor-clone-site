import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { toast } from "react-toastify";

const Contact = ({ userRef, listing }) => {
  console.log({ listing, userRef });
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState("");
  useEffect(() => {
    const getLandlord = async () => {
      const docRef = doc(db, "users", userRef);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setLandlord(docSnap.data());
      } else {
        toast.error("Could not get landlord data.");
      }
    };
    getLandlord();
  }, [userRef]);
  const onChange = (e) => {
    setMessage(e.target.value);
  };
  return (
    <>
      {landlord !== null && (
        <div className="flex flex-col w-full">
          <p>
            Contact {landlord.name} for the {listing.name.toLowerCase()}
          </p>
          <div className="mb-3 mt-3">
            <textarea
              id="message"
              name="message"
              value={message}
              rows="2"
              onChange={onChange}
              className="w-full px-4 py-2 text-md  text-gray-700 bg-white border border-gray-300 rounded focus:text-gray-700 focus:bg-white  focus:border-slate-600"
            />
          </div>
          <a
            href={`mailto:${landlord.email}?Subject=${listing.name}&body=${message} `}
          >
            <button
              type="button"
              className=" mb-6 bg-blue-600 text-white font-medium text-sm uppercase w-full text-center rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg transition duration-150 ease-in-out px-7 py-3"
            >
              send message
            </button>
          </a>
        </div>
      )}
    </>
  );
};

export default Contact;
