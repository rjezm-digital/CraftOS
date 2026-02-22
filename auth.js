// js/auth.js

import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import { auth } from "./firebase.js";

/* =========================
   AUTH STATE HANDLER
========================= */
onAuthStateChanged(auth, (user) => {
  const loginScreen = document.getElementById("login-screen");
  const appScreen = document.getElementById("app-screen");

  if (!loginScreen || !appScreen) return;

  if (user) {
    loginScreen.classList.add("hidden");
    appScreen.classList.remove("hidden");
  } else {
    loginScreen.classList.remove("hidden");
    appScreen.classList.add("hidden");
  }
});

/* =========================
   LOGIN
========================= */
window.login = async function () {
  const email = document.getElementById("login-email")?.value.trim();
  const password = document.getElementById("login-password")?.value.trim();

  if (!email || !password) {
    alert("Please enter email and password");
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    alert(err.message);
  }
};

/* =========================
   REGISTER
========================= */
window.register = async function () {
  const email = document.getElementById("reg-email")?.value.trim();
  const password = document.getElementById("reg-password")?.value.trim();
  const code = document.getElementById("reg-code")?.value.trim();

  if (!email || !password || !code) {
    alert("Please fill all fields");
    return;
  }

  // 🔐 SIMPLE REGISTRATION CODE CHECK
  if (code !== "RJEZM2026") {
    alert("Invalid registration code");
    return;
  }

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    alert("Account created successfully");
  } catch (err) {
    alert(err.message);
  }
};

/* =========================
   LOGOUT
========================= */
window.logout = async function () {
  await signOut(auth);
};

/* =========================
   UI TOGGLES
========================= */
window.showRegister = function () {
  document.getElementById("login-form")?.classList.add("hidden");
  document.getElementById("register-form")?.classList.remove("hidden");
};

window.showLogin = function () {
  document.getElementById("register-form")?.classList.add("hidden");
  document.getElementById("login-form")?.classList.remove("hidden");
};

/* =========================
   ADMIN ACCESS (OPTIONAL)
========================= */
window.adminAccess = function () {
  alert("Admin access enabled");
};