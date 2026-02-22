/*********************************************************
 * CALCULATOR.JS
 * - Job Cost Calculation
 * - Profit & Selling Price
 * - Uses Costing + CMYK + Electricity
 *********************************************************/

/* ========= ROUND UP TO NEAREST 5 ========= */
function roundUpToFive(value) {
  return Math.ceil(value / 5) * 5;
}

/* ========= MAIN CALCULATION ========= */
window.performCalculation = function () {

  /* ---------- INPUTS ---------- */
  const qty = parseFloat(document.getElementById("calc-qty").value) || 1;
  const profitPct = parseFloat(document.getElementById("profit-margin").value) || 0;
  const miscCost = parseFloat(document.getElementById("misc-cost").value) || 0;

  if (qty <= 0) {
    alert("Enter a valid quantity.");
    return;
  }

  /* ---------- BASE COSTS ---------- */
  let materialCost = 0;

  // from costing.js
  costingItems.forEach(item => {
    let unitCost = 0;

    if (item.type === "general") {
      const mat = materials[item.index];
      if (mat) unitCost = mat.cost / mat.qty;
    }

    if (item.type === "ink") {
      const ink = inkMaterials[item.index];
      if (ink) unitCost = ink.totalCost / ink.totalMl;
    }

    materialCost += unitCost * item.qty;
  });

  /* ---------- ADDITIONAL COSTS ---------- */
  const inkCost = lastInkCost || 0;
  const elecCost = lastElecCost || 0;

  let totalCost = materialCost + inkCost + elecCost + miscCost;

  /* ---------- COST PER UNIT ---------- */
  const costPerUnit = totalCost / qty;

  /* ---------- PROFIT ---------- */
  const profitValue = costPerUnit * (profitPct / 100);
  let sellingPrice = costPerUnit + profitValue;

  /* ---------- ROUNDING ---------- */
  sellingPrice = roundUpToFive(sellingPrice);

  /* ---------- TOTAL SELLING ---------- */
  const totalSelling = sellingPrice * qty;

  /* ---------- SAVE FOR RECEIPT ---------- */
  lastCalc = {
    qty,
    materialCost,
    inkCost,
    elecCost,
    miscCost,
    totalCost,
    costPerUnit,
    profitPct,
    sellingPrice,
    totalSelling
  };

  /* ---------- DISPLAY ---------- */
  document.getElementById("calc-material-cost").textContent =
    "₱" + fmt(materialCost);

  document.getElementById("calc-total-ink").textContent =
    "₱" + fmt(inkCost);

  document.getElementById("calc-elec-cost").textContent =
    "₱" + fmt(elecCost);

  document.getElementById("calc-misc-cost").textContent =
    "₱" + fmt(miscCost);

  document.getElementById("calc-total-cost").textContent =
    "₱" + fmt(totalCost);

  document.getElementById("calc-cost-unit").textContent =
    "₱" + fmt(costPerUnit);

  document.getElementById("calc-selling-price").textContent =
    "₱" + fmt(sellingPrice);

  document.getElementById("calc-total-selling").textContent =
    "₱" + fmt(totalSelling);

  document.getElementById("calc-result").classList.remove("hidden");
};

/* ========= SAVE PRODUCT ========= */
window.saveProduct = async function () {

  if (!lastCalc) {
    alert("Please calculate first.");
    return;
  }

  const name = document.getElementById("product-name").value.trim();
  if (!name) {
    alert("Enter product name.");
    return;
  }

  await addDoc(collection(db, "products"), {
    user: currentUser,
    name,
    qty: lastCalc.qty,
    cost: lastCalc.totalCost,
    selling: lastCalc.totalSelling,
    createdAt: new Date()
  });

await addDoc(collection(db, "sales"), {
  user: currentUser,
  product: name,
  qty: lastCalc.qty,
  totalCost: lastCalc.totalCost,
  totalSelling: lastCalc.totalSelling,
  profit: lastCalc.totalSelling - lastCalc.totalCost,
  createdAt: new Date()
});

  document.getElementById("product-name").value = "";
  alert("Product saved successfully.");
};