import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD8TykpSURcn-hb3qYr3gkwhdPFkYuzPGE",
  authDomain: "mujcarpool.firebaseapp.com",
  projectId: "mujcarpool",
  storageBucket: "mujcarpool.firebasestorage.app",
  messagingSenderId: "1017139356381",
  appId: "1:1017139356381:web:61e0afc35007e1e9437134",
  measurementId: "G-DYXSETLQD7"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
