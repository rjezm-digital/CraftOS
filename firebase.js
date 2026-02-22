import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDSA9E4nDca50a1WcmNLFLXudI-PCOfFbg",
  authDomain: "rjezm-print-os.firebaseapp.com",
  projectId: "rjezm-print-os",
  storageBucket: "rjezm-print-os.firebasestorage.app",
  messagingSenderId: "871926743321",
  appId: "1:871926743321:web:1d46bf4351b497fd738588"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };