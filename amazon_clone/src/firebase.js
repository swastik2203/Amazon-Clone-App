
// import firebase from "firebase/app";
// import { initializeApp } from 'firebase/app';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore'


// const firebaseConfig = {
//   apiKey: "AIzaSyD3P-qr7Mrlg74BQymT7bykV2HYwbU8Gk8",
//   authDomain: "amz-clone-medium.firebaseapp.com",
//   databaseURL: "https://amz-clone-medium.firebaseio.com",
//   projectId: "amz-clone-medium",
//   storageBucket: "amz-clone-medium.appspot.com",
//   messagingSenderId: "769450879220",
//   appId: "1:769450879220:web:cbff61e0ee041531e456a1",
//   measurementId: "G-CZDBWXMWF7",
// };
const firebaseConfig = {
  apiKey: "AIzaSyDHBXZ9kRyoNBlO6eRLrf6BI_E6fAyVCsU",
  authDomain: "clone-f7b14.firebaseapp.com",
  projectId: "clone-f7b14",
  storageBucket: "clone-f7b14.appspot.com",
  messagingSenderId: "303649486768",
  appId: "1:303649486768:web:dd01b712f6c6bb0d4cc875",
  measurementId: "G-0ZSB0QCXL4"
};
// const firebaseApp = 
const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
// const db = firebase.firestore(firebaseApp)
const auth = firebase.auth();


export { db, auth };