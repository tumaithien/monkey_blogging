import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyB0Hfwf6bj9yskK_Mj5uz0t2lnoiX-7W7I",
  authDomain: "monkey-blogging-8b032.firebaseapp.com",
  projectId: "monkey-blogging-8b032",
  storageBucket: "monkey-blogging-8b032.appspot.com",
  messagingSenderId: "250224285058",
  appId: "1:250224285058:web:e434712cc8b135beafeb9b",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
