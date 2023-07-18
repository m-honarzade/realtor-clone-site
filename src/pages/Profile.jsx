import React from "react";
import { useState } from "react";
import { getAuth, updateProfile } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { FcHome } from "react-icons/fc";

const Profile = () => {
  const auth = getAuth();
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
    </>
  );
};

export default Profile;
