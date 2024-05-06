import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"


const firebaseConfig = {
  apiKey: "AIzaSyBhj1vapxytLtelXcg3Mu0772-KYbJes-w",
  authDomain: "splitway-d35f6.firebaseapp.com",
  databaseURL: "https://splitway-d35f6-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "splitway-d35f6",
  storageBucket: "splitway-d35f6.appspot.com",
  messagingSenderId: "1044137023255",
  appId: "1:1044137023255:web:60b9cce1a6828f58b54952",
  measurementId: "G-2SZQK0KFTE"
};

export const Firebase_app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const Firebase_auth = getAuth(Firebase_app);
export const Firebase_db = getFirestore(Firebase_app);