import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { db } from "../firebase";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

const OAuth = () => {
  const navigate = useNavigate();
  const onGoogleClick = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      // check for user
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        await setDoc(docRef, {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        });
      }
      navigate("/");
    } catch (error) {
      toast.error("Could not authorize with google.");
    }
  };
  return (
    <button
      type="button"
      onClick={onGoogleClick}
      className="flex items-center justify-center px-7 py-3  uppercase bg-red-700 hover:bg-red-800 active:bg-red-900 text-sm  font-medium text-white rounded w-full shadow-md hover:shadow-lg transition duration-200 ease-in-out"
    >
      <FcGoogle className="rounded-full bg-white text-2xl  mr-2" />
      Continue with Google
    </button>
  );
};

export default OAuth;
