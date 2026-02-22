import { auth, db } from "./firebase.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const ADMIN_EMAIL = "admin@rjezmdigital.com";

window.handleLogin = async function () {
  const email = login-email.value;
  const password = login-password.value;

  const userCred = await signInWithEmailAndPassword(auth, email, password);
  currentUser = userCred.user.email;
};

window.handleLogout = async function () {
  await signOut(auth);
};

onAuthStateChanged(auth, user => {
  if (user) {
    currentUser = user.email;
  } else {
    currentUser = null;
  }
});