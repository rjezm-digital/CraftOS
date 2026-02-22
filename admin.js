/*********************************************************
 * ADMIN.JS
 * - Admin Dashboard
 * - User Management
 * - Registration Codes
 * - Audit Log
 *********************************************************/

import { auth, db } from "./firebase.js";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* ================= ADMIN CONSTANT ================= */
const ADMIN_EMAIL = "admin@rjezmdigital.com";

/* ================= OPEN ADMIN ================= */
window.openAdminPanel = function () {
  document.getElementById("auth-screen").classList.add("hidden");
  document.getElementById("app-screen").classList.add("hidden");
  document.getElementById("admin-screen").classList.remove("hidden");

  switchAdminTab("overview");
};

/* ================= ADMIN LOGOUT ================= */
window.handleAdminLogout = async function () {
  await auth.signOut();
  document.getElementById("admin-screen").classList.add("hidden");
  document.getElementById("auth-screen").classList.remove("hidden");
};

/* ================= TAB SWITCH ================= */
window.switchAdminTab = function (tab) {
  const tabs = ["overview", "users", "codes", "settings"];

  tabs.forEach(t => {
    document.getElementById(`admin-tab-${t}`)?.classList.toggle("tab-active", t === tab);
    document.getElementById(`admin-tab-${t}`)?.classList.toggle("tab-inactive", t !== tab);
    document.getElementById(`admin-content-${t}`)?.classList.toggle("hidden", t !== tab);
  });

  if (tab === "overview") loadOverviewTab();
  if (tab === "users") loadUsersTab();
  if (tab === "codes") loadCodesTab();
};

/* ================= OVERVIEW ================= */
async function loadOverviewTab() {
  const box = document.getElementById("admin-content-overview");
  box.innerHTML = `<p class="text-slate-400">Loading overview…</p>`;

  const usersSnap = await getDocs(collection(db, "users"));
  const materialsSnap = await getDocs(collection(db, "materials"));
  const productsSnap = await getDocs(collection(db, "products"));

  box.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-slate-800/50 p-4 rounded-xl">
        <p class="text-slate-400 text-sm">Users</p>
        <p class="text-3xl font-bold">${usersSnap.size}</p>
      </div>
      <div class="bg-slate-800/50 p-4 rounded-xl">
        <p class="text-slate-400 text-sm">Materials</p>
        <p class="text-3xl font-bold">${materialsSnap.size}</p>
      </div>
      <div class="bg-slate-800/50 p-4 rounded-xl">
        <p class="text-slate-400 text-sm">Products</p>
        <p class="text-3xl font-bold">${productsSnap.size}</p>
      </div>
    </div>
  `;
}

/* ================= USERS ================= */
async function loadUsersTab() {
  const box = document.getElementById("admin-content-users");
  box.innerHTML = `<p class="text-slate-400">Loading users…</p>`;

  const snap = await getDocs(collection(db, "users"));

  if (snap.empty) {
    box.innerHTML = `<p class="text-slate-500">No users found.</p>`;
    return;
  }

  box.innerHTML = snap.docs.map(d => {
    const u = d.data();
    return `
      <div class="flex justify-between items-center bg-slate-800/50 p-3 rounded-lg mb-2">
        <div>
          <p class="font-bold">${u.email}</p>
          <p class="text-xs text-slate-400">${u.role || "user"}</p>
        </div>
        <button onclick="deleteUser('${d.id}')" class="text-red-400 font-bold">
          Delete
        </button>
      </div>
    `;
  }).join("");
}

window.deleteUser = async function (id) {
  if (!confirm("Delete this user?")) return;
  await deleteDoc(doc(db, "users", id));
  loadUsersTab();
};

/* ================= REGISTRATION CODES ================= */
async function loadCodesTab() {
  const box = document.getElementById("admin-content-codes");
  box.innerHTML = `<p class="text-slate-400">Loading codes…</p>`;

  const snap = await getDocs(collection(db, "codes"));

  box.innerHTML = `
    <div class="mb-4">
      <button onclick="generateCode()" class="bg-cyan-600 px-4 py-2 rounded-lg font-bold">
        Generate Code
      </button>
    </div>
    ${snap.docs.map(d => {
      const c = d.data();
      return `
        <div class="flex justify-between items-center bg-slate-800/50 p-3 rounded-lg mb-2">
          <div>
            <p class="font-mono font-bold">${c.code}</p>
            <p class="text-xs text-slate-400">
              ${c.used ? "USED" : "AVAILABLE"}
            </p>
          </div>
          <button onclick="deleteCode('${d.id}')" class="text-red-400 font-bold">
            ✕
          </button>
        </div>
      `;
    }).join("")}
  `;
}

window.generateCode = async function () {
  const code = Math.random().toString(36).substring(2, 8).toUpperCase();
  await addDoc(collection(db, "codes"), {
    code,
    used: false,
    createdAt: serverTimestamp()
  });
  loadCodesTab();
};

window.deleteCode = async function (id) {
  if (!confirm("Delete this code?")) return;
  await deleteDoc(doc(db, "codes", id));
  loadCodesTab();
};

if (tab === "analytics") loadAnalyticsTab();