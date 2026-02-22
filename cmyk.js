import { inkMaterials, inkCosts, maxStockLevels, fmt } from "./state.js";

window.addInkMaterial = () => {
  const color = ink-color.value;
  const cost = +ink-total-cost.value;
  const ml = +ink-ml-bottle.value;
  const bottles = +ink-qty-bottles.value || 1;
  if (!color || cost <= 0 || ml <= 0) return;

  inkMaterials.push({
    color,
    totalCost: cost,
    totalMl: ml * bottles
  });

  updateInkCosts();
  renderInk();
};

window.deleteInkMaterial = i => {
  inkMaterials.splice(i, 1);
  updateInkCosts();
  renderInk();
};

function updateInkCosts() {
  const map = { Cyan:"c", Magenta:"m", Yellow:"y", Black:"k" };
  inkMaterials.forEach(i => {
    inkCosts[map[i.color]] = i.totalCost / i.totalMl;
    maxStockLevels[map[i.color]] = i.totalMl;
  });
}

function renderInk() {
  ink-list.innerHTML = inkMaterials.map((i, idx) =>
    `<div>${i.color} ₱${fmt(i.totalCost / i.totalMl)}/ml
     <button onclick="deleteInkMaterial(${idx})">✕</button></div>`
  ).join("");
}