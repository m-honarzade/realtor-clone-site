import { useState } from "react";

import { Link } from "react-router-dom";
import OAuth from "../components/OAuth";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const onChange = (e) => {
    setEmail(e.target.value);
  };
  return (
    <section>
      <h1 className="text-3xl font-bold text-center mt-6">Forgot Password</h1>
      <div className="flex flex-wrap justify-center items-center max-w-6xl mx-auto px-6 py-12">
        <div className="md:w-[67%] lg:w-[50%] mb-12 md:mb-6">
          <img
            className="w-full rounded-2xl"
            alt="photo of a key"
            src="https://images.unsplash.com/flagged/photo-1564767609342-620cb19b2357?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8a2V5fGVufDB8fDB8fHww&auto=format&fit=crop&w=400&q=60"
          />
        </div>
        <div className="w-full md:w-[67%] lg:w-[40%] lg:ml-20">
          <form>
            <input
              type="email"
              id="email"
              value={email}
              onChange={onChange}
              placeholder="Email Address"
              className="mb-6 w-full rounded text-xl px-4 py-2 bg-white text-gray-700 border-gray-300 transition ease-in-out"
            />

            <div
              className="flex justify-between items-center whitespace-nowrap text-sm sm:text-lg
             "
            >
              <p className="mb-6">
                Dont have an account?{" "}
                <Link
                  to="/sign-up"
                  className="text-red-600 hover:text-red-700 transition duration-200 ease-in-out ml-1
                  "
                >
                  Register
                </Link>
              </p>
              <p className="mb-6">
                <Link
                  to="/sign-in"
                  className="text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out"
                >
                  sign in instead.
                </Link>
              </p>
            </div>
            <button
              type="submit"
              className=" px-7 py-3  uppercase bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-sm text-white rounded w-full shadow-md hover:shadow-lg transition duration-200 ease-in-out "
            >
              Send Reset Password
            </button>
            <div className="my-4 flex items-center before:border-t before:flex-1 before:border-gray-300 after:border-t after:flex-1 after:border-gray-300">
              <p className="text-center mx-4 font-semibold">OR</p>
            </div>
            <OAuth />
          </form>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
