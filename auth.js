import { auth } from "./firebase.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const authScreen = document.getElementById("auth-screen");
const appScreen = document.getElementById("app-screen");
const adminScreen = document.getElementById("admin-screen");
const statusMsg = document.getElementById("status-msg");

window.login = async () => {
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    statusMsg.innerText = "Logged in successfully.";
  } catch (err) {
    statusMsg.innerText = err.message;
  }
};

window.signup = async () => {
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    statusMsg.innerText = "Account created.";
  } catch (err) {
    statusMsg.innerText = err.message;
  }
};

window.logout = async () => {
  await signOut(auth);
};

onAuthStateChanged(auth, (user) => {
  if (user) {
    authScreen.classList.add("hidden");

    if (user.email === "admin@rjezmdigital.com") {
      adminScreen.classList.remove("hidden");
      appScreen.classList.add("hidden");
    } else {
      appScreen.classList.remove("hidden");
      adminScreen.classList.add("hidden");
    }
  } else {
    authScreen.classList.remove("hidden");
    appScreen.classList.add("hidden");
    adminScreen.classList.add("hidden");
  }
});