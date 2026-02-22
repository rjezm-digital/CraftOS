import { lastCalc, products, fmt } from "./state.js";
import { db } from "../firebase.js";
import { addDoc, collection, serverTimestamp } from
  "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

window.saveProduct = async () => {
  if (!lastCalc) return;

  await addDoc(collection(db, "products"), {
    ...lastCalc,
    createdAt: serverTimestamp()
  });

  products.push(lastCalc);
  renderProducts();
};

function renderProducts() {
  products-list.innerHTML = products.map(p =>
    `<div>₱${fmt(p.selling)}</div>`
  ).join("");
}