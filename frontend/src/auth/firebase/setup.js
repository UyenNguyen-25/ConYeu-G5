import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDFXk-ROsUhsPQ1FVdps22qhFCt8iACGOY",
  authDomain: "conyeu-2aa7f.firebaseapp.com",
  projectId: "conyeu-2aa7f",
  storageBucket: "conyeu-2aa7f.appspot.com",
  messagingSenderId: "851630249630",
  appId: "1:851630249630:web:2b208595285509b91f8d8f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export default auth;
