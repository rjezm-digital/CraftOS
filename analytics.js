import { db } from "../firebase.js";
import { collection, getDocs } from
  "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

window.loadAnalytics = async () => {
  const snap = await getDocs(collection(db, "products"));
  let revenue = 0;

  snap.forEach(d => revenue += d.data().selling);

  analytics-total.textContent = "₱" + revenue.toFixed(2);
};