import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyCdPPnuc9-OxjvSYzPCNiCS415Tu5xhO2g",
    authDomain: "justthree-f97af.firebaseapp.com",
    projectId: "justthree-f97af",
    storageBucket: "justthree-f97af.appspot.com",
    messagingSenderId: "1082592622643",
    appId: "1:1082592622643:web:02e13026fd3d4c95b14b46",
    measurementId: "G-ED59SRDBRY"
  };

  const firebaseApp = initializeApp(firebaseConfig);

  const auth = getAuth(firebaseApp);
  const db = getFirestore(firebaseApp);
  const storage = getStorage(firebaseApp);

  export { auth, db, storage };