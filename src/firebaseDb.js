import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyCehvHt9Q1vxI7ysjG-5bvucmHQVFPN6gE",
  authDomain: "subscriptions-c663e.firebaseapp.com",
  projectId: "subscriptions-c663e",
  storageBucket: "subscriptions-c663e.firebasestorage.app",
  messagingSenderId: "911322580472",
  appId: "1:911322580472:web:86c5448827f54f523dc20d"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export const auth = getAuth(app);
export default db;
