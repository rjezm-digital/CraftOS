import { materials, fmt } from "./state.js";

window.addMaterial = () => {
  const name = material-name.value.trim();
  const cost = +material-cost.value;
  const qty = +material-qty.value;
  if (!name || cost <= 0 || qty <= 0) return;

  materials.push({ name, totalCost: cost, quantity: qty });
  renderMaterials();
};

window.deleteMaterial = i => {
  materials.splice(i, 1);
  renderMaterials();
};

function renderMaterials() {
  material-list.innerHTML = materials.length
    ? materials.map((m, i) => `
      <div class="row">
        <b>${m.name}</b>
        ₱${fmt(m.totalCost / m.quantity)}
        <button onclick="deleteMaterial(${i})">✕</button>
      </div>`).join("")
    : `<p>No materials</p>`;
}