import React from "react";
import { useState } from "react";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [formData, setFormData] = useState({
    name: "mahdie",
    email: "honarzadeh.mahdie@gmail.com",
  });
  const { name, email } = formData;
  const auth = getAuth();
  const navigate = useNavigate();
  const onLogout = () => {
    auth.signOut();
    navigate("/");
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
              disabled
              className="w-full  mb-6 bg-white px-4 py-2 text-xl text-gray-700 border border-gray-300 rounded transition ease-in-out "
            ></input>
            {/* input Name */}
            <input
              type="email"
              id="email"
              value={email}
              disabled
              className="w-full mb-6 bg-white px-4 py-2 text-xl text-gray-700 border border-gray-300 rounded transition ease-in-out "
            ></input>
            <div className="flex justify-between items-center whitespace-nowrap text-sm md:text-lg ">
              <p className="flex items-center">
                Do you want to change your name?{" "}
                <span className="text-red-600  hover:text-red-700 transition ease-in-out duration-200 cursor-pointer ml-1">
                  Edit
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
        </div>
      </section>
    </>
  );
};

export default Profile;
