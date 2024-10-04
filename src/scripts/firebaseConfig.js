// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCrXq6UAWiCg2EXhv_SCdpLMX_YXzqrxyA",
  authDomain: "mylenasexam.firebaseapp.com",
  projectId: "mylenasexam",
  storageBucket: "mylenasexam.appspot.com",
  messagingSenderId: "882565781759",
  appId: "1:882565781759:web:c208eb5b0c66d02e1f54ca"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);