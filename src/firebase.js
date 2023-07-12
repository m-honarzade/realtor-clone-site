// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCckiYuJrJDAxaZvNhvzVyJeF5KwwreVoo",
  authDomain: "raeltor-clone-website.firebaseapp.com",
  projectId: "raeltor-clone-website",
  storageBucket: "raeltor-clone-website.appspot.com",
  messagingSenderId: "563530810214",
  appId: "1:563530810214:web:292e44344a599332367ea7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
