import React from "react";
import { FcGoogle } from "react-icons/fc";

const OAuth = () => {
  return (
    <button className="flex items-center justify-center px-7 py-3  uppercase bg-red-700 hover:bg-red-800 active:bg-red-900 text-sm  font-medium text-white rounded w-full shadow-md hover:shadow-lg transition duration-200 ease-in-out">
      <FcGoogle className="rounded-full bg-white text-2xl  mr-2" />
      Continue with Google
    </button>
  );
};

export default OAuth;
