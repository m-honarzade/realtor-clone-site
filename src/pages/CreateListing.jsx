import React, { useState } from "react";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { getAuth } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

const CreateListing = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [geoLocationEnabeld, setGeoLocationEnabeld] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: "rent",
    name: "",
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: "",
    description: "",
    offer: false,
    regularPrice: 0,
    discountedPrice: 0,
    latitude: 0,
    longitude: 0,
    images: {},
  });
  const {
    type,
    name,
    bedrooms,
    bathrooms,
    parking,
    furnished,
    address,
    description,
    offer,
    regularPrice,
    discountedPrice,
    latitude,
    longitude,
    images,
  } = formData;

  const onChange = (e) => {
    let boolean = null;
    if (e.target.value === "true") {
      boolean = true;
    }
    if (e.target.value === "false") {
      boolean = false;
    }
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }));
    }
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value,
      }));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (+discountedPrice >= +regularPrice) {
      setLoading(false);
      toast.error("discounted should be less than price.");
      return;
    }
    if (images.length > 6) {
      setLoading(false);
      toast.error("maximum number of files in 6.");
      return;
    }
    let geoLocation = {};
    let location;
    // if we have an account and can get APIKEY
    if (geoLocationEnabeld) {
      const response = await fetch(
        `https//maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GEOCODE_API_KEY}`
      );
      const data = await response.json();
      console.log(data);
      geoLocation.lat = data.result[0]?.geometry.location.lat ?? 0;
      geoLocation.lng = data.result[0]?.geometry.location.lng ?? 0;
      location = data.status === "ZERO_RESULTS" && undefined;
      if (location === undefined) {
        setLoading(false);
        toast.error("address is incorrect");
        return;
      }
    }
    // if we have not an account and can not get APIKEY ,we should set lat,lng manually;
    else {
      geoLocation.lat = latitude;
      geoLocation.lng = longitude;
      console.log(geoLocation);
    }
    const storeImage = async (image) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, image);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
          },
          (error) => {
            // Handle unsuccessful uploads
            reject(error);
          },
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    };

    const imgUrls = await Promise.all(
      [...images].map((image) => storeImage(image))
    ).catch((error) => {
      setLoading(false);
      toast.error("Images not uploaded.");
      return;
    });

    console.log(imgUrls);
    const formDataCopy = {
      ...formData,
      imgUrls,
      geoLocation,
      timeStamp: serverTimestamp(),
    };

    delete formDataCopy.images;
    delete formDataCopy.latitude;
    delete formDataCopy.longitude;
    !formDataCopy.offer && delete formDataCopy.discountedPrice;
    const docRef = await addDoc(collection(db, "listing"), formDataCopy);
    console.log(docRef);
    setLoading(false);
    toast.success("the listing added successfully.");
    navigate(`/category/${formDataCopy.type}/${docRef.id}`);
  };
  if (loading) {
    return <Spinner />;
  }

  return (
    <main className="px-2 max-w-md mx-auto">
      <h1 className="mt-6 text-3xl text-center font-bold ">Create a Listing</h1>
      <form onSubmit={onSubmit}>
        <p className="mt-6 text-lg font-semibold">Sell / Rent</p>
        <div className="flex">
          <button
            type="button"
            id="type"
            value="sale"
            onClick={onChange}
            className={` mr-3 text-sm font-medium px-7 py-3 rounded shadow-md hover:shadow-lg focus:shadow-lg active:shadow-lg uppercase transition ease-in-out duration-150 w-full ${
              type === "rent"
                ? "bg-white text-black"
                : "bg-slate-600 text-white"
            }`}
          >
            sell
          </button>
          <button
            type="button"
            id="type"
            value="rent"
            onClick={onChange}
            className={` ml-3 text-sm font-medium px-7 py-3 rounded shadow-md hover:shadow-lg focus:shadow-lg active:shadow-lg uppercase transition ease-in-out duration-150 w-full ${
              type === "sale"
                ? "bg-white text-black"
                : "bg-slate-600 text-white"
            }`}
          >
            rent
          </button>
        </div>
        <p className="mt-6 text-lg font-semibold">Name</p>
        <input
          type="text"
          id="name"
          value={name}
          onChange={onChange}
          placeholder="name"
          maxLength="32"
          minLength="10"
          required
          className=" w-full rounded px-4 py-2 bg-white text-xl text-gray-700 border border-gray-300 focus:border-slate-600 focus:text-gray-700 focus:bg-white transition duration-150 ease-in-out mb-6 "
        />
        <div className="flex mb-6 space-x-6">
          <div>
            <p className="text-lg font-semibold">Beds</p>
            <input
              type="number"
              value={bedrooms}
              id="bedrooms"
              onChange={onChange}
              min="1"
              max="50"
              required
              className="w-full rounded px-4 py-2 bg-white text-xl text-center text-gray-700 border border-gray-300 focus:border-slate-600 focus:text-gray-700 focus:bg-white transition duration-150 ease-in-out "
            />
          </div>
          <div>
            <p className="text-lg font-semibold">Baths</p>
            <input
              type="number"
              value={bathrooms}
              id="bathrooms"
              onChange={onChange}
              min="1"
              max="50"
              required
              className="w-full rounded px-4 py-2 bg-white text-xl text-center text-gray-700 border border-gray-300 focus:border-slate-600 focus:text-gray-700 focus:bg-white transition duration-150 ease-in-out "
            />
          </div>
        </div>
        <p className="mt-6 text-lg font-semibold">Parking spot</p>
        <div className="flex">
          <button
            type="button"
            id="parking"
            value={true}
            onClick={onChange}
            className={` mr-3 text-sm font-medium px-7 py-3 rounded shadow-md hover:shadow-lg focus:shadow-lg active:shadow-lg uppercase transition ease-in-out duration-150 w-full ${
              !parking ? "bg-white text-black" : "bg-slate-600 text-white"
            }`}
          >
            Yes
          </button>
          <button
            type="button"
            id="parking"
            value={false}
            onClick={onChange}
            className={` ml-3 text-sm font-medium px-7 py-3 rounded shadow-md hover:shadow-lg focus:shadow-lg active:shadow-lg uppercase transition ease-in-out duration-150 w-full ${
              parking ? "bg-white text-black" : "bg-slate-600 text-white"
            }`}
          >
            No
          </button>
        </div>
        <p className="mt-6 text-lg font-semibold">Furnished</p>
        <div className="flex">
          <button
            type="button"
            id="furnished"
            value={true}
            onClick={onChange}
            className={` mr-3 text-sm font-medium px-7 py-3 rounded shadow-md hover:shadow-lg focus:shadow-lg active:shadow-lg uppercase transition ease-in-out duration-150 w-full ${
              !furnished ? "bg-white text-black" : "bg-slate-600 text-white"
            }`}
          >
            yes
          </button>
          <button
            type="button"
            id="furnished"
            value={false}
            onClick={onChange}
            className={` ml-3 text-sm font-medium px-7 py-3 rounded shadow-md hover:shadow-lg focus:shadow-lg active:shadow-lg uppercase transition ease-in-out duration-150 w-full ${
              furnished ? "bg-white text-black" : "bg-slate-600 text-white"
            }`}
          >
            no
          </button>
        </div>
        <p className="mt-6 text-lg font-semibold">Address</p>
        <textarea
          type="text"
          id="address"
          value={address}
          onChange={onChange}
          placeholder="address"
          required
          className=" w-full rounded px-4 py-2 bg-white text-xl text-gray-700 border border-gray-300 focus:border-slate-600 focus:text-gray-700 focus:bg-white transition duration-150 ease-in-out mb-6 "
        />
        {!geoLocationEnabeld && (
          <div className="flex mb-6 space-x-6">
            <div>
              <p className="text-lg font-semibold">Latitude</p>
              <input
                type="number"
                value={latitude}
                id="latitude"
                onChange={onChange}
                required
                min="-90"
                max="90"
                className="w-full rounded px-4 py-2 bg-white text-xl text-center text-gray-700 border border-gray-300 focus:border-slate-600 focus:text-gray-700 focus:bg-white transition duration-150 ease-in-out "
              />
            </div>
            <div>
              <p className="text-lg font-semibold">Longitude</p>
              <input
                type="number"
                value={longitude}
                id="longitude"
                onChange={onChange}
                required
                min="-180"
                max="180"
                className="w-full rounded px-4 py-2 bg-white text-xl text-center text-gray-700 border border-gray-300 focus:border-slate-600 focus:text-gray-700 focus:bg-white transition duration-150 ease-in-out "
              />
            </div>
          </div>
        )}

        <p className="text-lg font-semibold">Description</p>
        <textarea
          type="text"
          id="description"
          value={description}
          onChange={onChange}
          placeholder="description"
          required
          className=" w-full rounded px-4 py-2 bg-white text-xl text-gray-700 border border-gray-300 focus:border-slate-600 focus:text-gray-700 focus:bg-white transition duration-150 ease-in-out mb-6 "
        />
        <p className="text-lg font-semibold">Offer</p>
        <div className="flex mb-6">
          <button
            type="button"
            id="offer"
            value={true}
            onClick={onChange}
            className={` mr-3 text-sm font-medium px-7 py-3 rounded shadow-md hover:shadow-lg focus:shadow-lg active:shadow-lg uppercase transition ease-in-out duration-150 w-full ${
              !offer ? "bg-white text-black" : "bg-slate-600 text-white"
            }`}
          >
            yes
          </button>
          <button
            type="button"
            id="offer"
            value={false}
            onClick={onChange}
            className={` ml-3 text-sm font-medium px-7 py-3 rounded shadow-md hover:shadow-lg focus:shadow-lg active:shadow-lg uppercase transition ease-in-out duration-150 w-full ${
              offer ? "bg-white text-black" : "bg-slate-600 text-white"
            }`}
          >
            no
          </button>
        </div>
        <div className=" mb-6">
          {/* <div className="bg-green-100"> */}
          <p className="font-semibold text-lg">Regular price</p>
          <div className="flex justify-start  items-center space-x-6 ">
            <input
              type="number"
              id="regularPrice"
              value={regularPrice}
              min="50"
              max="4000000"
              required
              onChange={onChange}
              className=" rounded px-4 py-2 bg-white text-xl text-center text-gray-700 border border-gray-300 focus:border-slate-600 focus:text-gray-700 focus:bg-white transition duration-150 ease-in-out "
            />
            {type === "rent" && (
              <div>
                <p className="w-full text-md whitespace-nowrap">$ / Month</p>
              </div>
            )}
          </div>
          {/* </div> */}
        </div>
        {offer && (
          <div className=" mb-6">
            {/* <div className="bg-green-100"> */}
            <p className="font-semibold text-lg">Discounted price</p>
            <div className="flex justify-start  items-center space-x-6 ">
              <input
                type="number"
                id="discountedPrice"
                value={discountedPrice}
                min="50"
                max="4000000"
                required={offer}
                onChange={onChange}
                className=" rounded px-4 py-2 bg-white text-xl text-center text-gray-700 border border-gray-300 focus:border-slate-600 focus:text-gray-700 focus:bg-white transition duration-150 ease-in-out "
              />
              {type === "rent" && (
                <div>
                  <p className="w-full text-md whitespace-nowrap">$ / Month</p>
                </div>
              )}
            </div>
            {/* </div> */}
          </div>
        )}
        <div className="mb-6">
          <p className="font-semibold text-lg">Images</p>
          <p className="text-gray-600">
            {" "}
            The first image will be the cover (max-6)
          </p>
          <input
            type="file"
            id="images"
            onChange={onChange}
            accept=".jpg, .png, .jpeg"
            multiple
            required
            className="w-full text-gray-700 rounded border border-gray-300 px-3 py-1.5 bg-white transition duration-200 ease-in-out focus:bg-white focus:border-slate-600"
          />
        </div>
        <button
          type="submit"
          className="mb-6 w-full text-sm font-medium uppercase rounded bg-blue-600 text-white shadow-md px-7 py-3 hover:bg-blue-700 hover:shadow-lg focus:shadow-lg focus:bg-blue-700 active:shadow-lg active:bg-blue-800 transition duration-150 ease-in-out "
        >
          Create listing
        </button>
      </form>
    </main>
  );
};

export default CreateListing;
