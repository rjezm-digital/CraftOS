/*********************************************************
 * CMYK.JS
 * - Printer Yield
 * - CMYK Ink Cost Calculation
 * - Stock Usage & Deduction
 *********************************************************/

/* ================= PRINTER YIELDS ================= */
const printers = {
  epsonL120:  { c:6500, m:6500, y:6500, k:4000 },
  epsonL3210: { c:7500, m:7500, y:7500, k:4500 },
  epsonL3250: { c:7500, m:7500, y:7500, k:4500 },
  epsonL5290: { c:7500, m:7500, y:7500, k:4500 },
  epsonL805:  { c:5400, m:5400, y:5400, k:1800 },

  brotherT420: { c:5000, m:5000, y:5000, k:7500 },
  brotherT520: { c:5000, m:5000, y:5000, k:7500 },
  brotherT720: { c:5000, m:5000, y:5000, k:7500 },
  brotherT820: { c:5000, m:5000, y:5000, k:7500 },
  brotherT920: { c:5000, m:5000, y:5000, k:7500 }
};

let currentYield = {};

/* ================= LOAD PRINTER ================= */
window.loadPrinterYield = function () {
  const printerId = document.getElementById("printerSelect").value;
  currentYield = printers[printerId] || {};
};

/* ================= QUALITY LABEL ================= */
window.updateQualityLabel = function () {
  const mult = parseFloat(document.getElementById("ink-quality-mult").value);
  document.getElementById("quality-display").textContent = mult.toFixed(1);

  let label = "Standard";
  if (mult >= 4.5) label = "Maximum";
  else if (mult >= 3.5) label = "Premium";
  else if (mult >= 2.5) label = "High";
  else if (mult >= 1.5) label = "Good";

  document.getElementById("quality-label").textContent = label;
};

/* ================= CMYK CALCULATION ================= */
window.calculateCMYK = function () {

  if (!currentYield.c) {
    alert("Please select a printer model first.");
    return;
  }

  /* ---------- INPUTS ---------- */
  const pages = parseFloat(document.getElementById("pages").value) || 0;
  const coverage = (parseFloat(document.getElementById("coverage").value) || 5) / 100;
  const waste = (parseFloat(document.getElementById("waste").value) || 3) / 100;
  const qualityMult = parseFloat(document.getElementById("ink-quality-mult").value) || 1;

  if (pages <= 0) {
    alert("Enter a valid number of pages.");
    return;
  }

  /* ---------- COST PER ML ---------- */
  const cCost = inkCosts.c;
  const mCost = inkCosts.m;
  const yCost = inkCosts.y;
  const kCost = inkCosts.k;

  if (!cCost || !mCost || !yCost || !kCost) {
    alert("Please add all CMYK inks to inventory.");
    return;
  }

  /* ---------- CURRENT STOCK ---------- */
  const cStock = parseFloat(document.getElementById("cStock-display").textContent) || 0;
  const mStock = parseFloat(document.getElementById("mStock-display").textContent) || 0;
  const yStock = parseFloat(document.getElementById("yStock-display").textContent) || 0;
  const kStock = parseFloat(document.getElementById("kStock-display").textContent) || 0;

  /* ---------- YIELD FORMULA ---------- */
  const bottleMl = 70; // standard bottle reference
  const factor = coverage * qualityMult * (1 + waste);

  const cUsed = (pages / currentYield.c) * bottleMl * factor;
  const mUsed = (pages / currentYield.m) * bottleMl * factor;
  const yUsed = (pages / currentYield.y) * bottleMl * factor;
  const kUsed = (pages / currentYield.k) * bottleMl * factor;

  /* ---------- STOCK CHECK ---------- */
  if (
    cUsed > cStock ||
    mUsed > mStock ||
    yUsed > yStock ||
    kUsed > kStock
  ) {
    alert("Not enough ink stock for this job.");
    return;
  }

  /* ---------- COST CALC ---------- */
  const cTotal = cUsed * cCost;
  const mTotal = mUsed * mCost;
  const yTotal = yUsed * yCost;
  const kTotal = kUsed * kCost;

  const totalCost = cTotal + mTotal + yTotal + kTotal;

  /* ---------- SAVE FOR CALCULATOR ---------- */
  lastInkCost = totalCost;
  lastInkUsage = { c: cUsed, m: mUsed, y: yUsed, k: kUsed };

  /* ---------- DISPLAY ---------- */
  document.getElementById("cmyk-c-cost").textContent = "₱" + fmt(cTotal);
  document.getElementById("cmyk-m-cost").textContent = "₱" + fmt(mTotal);
  document.getElementById("cmyk-y-cost").textContent = "₱" + fmt(yTotal);
  document.getElementById("cmyk-k-cost").textContent = "₱" + fmt(kTotal);
  document.getElementById("cmyk-total-cost").textContent = "₱" + fmt(totalCost);

  document.getElementById("stock-c").textContent = fmt(cStock - cUsed);
  document.getElementById("stock-m").textContent = fmt(mStock - mUsed);
  document.getElementById("stock-y").textContent = fmt(yStock - yUsed);
  document.getElementById("stock-k").textContent = fmt(kStock - kUsed);

  document.getElementById("calc-total-ink").textContent = "₱" + fmt(totalCost);

  document.getElementById("cmyk-result").classList.remove("hidden");
};

/* ================= APPLY AUTO STOCK UPDATE ================= */
window.applyAutomaticStockUpdate = function () {
  const c = parseFloat(document.getElementById("stock-c").textContent) || 0;
  const m = parseFloat(document.getElementById("stock-m").textContent) || 0;
  const y = parseFloat(document.getElementById("stock-y").textContent) || 0;
  const k = parseFloat(document.getElementById("stock-k").textContent) || 0;

  document.getElementById("cStock-display").textContent = c.toFixed(1);
  document.getElementById("mStock-display").textContent = m.toFixed(1);
  document.getElementById("yStock-display").textContent = y.toFixed(1);
  document.getElementById("kStock-display").textContent = k.toFixed(1);

  updateInkLevels();
};

/* ================= MANUAL STOCK UPDATE ================= */
window.openStockUpdateModal = function () {
  document.getElementById("stockUpdateModal").classList.remove("hidden");

  document.getElementById("update-c-stock").value =
    parseFloat(document.getElementById("cStock-display").textContent) || 0;
  document.getElementById("update-m-stock").value =
    parseFloat(document.getElementById("mStock-display").textContent) || 0;
  document.getElementById("update-y-stock").value =
    parseFloat(document.getElementById("yStock-display").textContent) || 0;
  document.getElementById("update-k-stock").value =
    parseFloat(document.getElementById("kStock-display").textContent) || 0;
};

window.closeStockUpdateModal = function () {
  document.getElementById("stockUpdateModal").classList.add("hidden");
};

window.applyManualStockUpdate = function () {
  document.getElementById("cStock-display").textContent =
    parseFloat(document.getElementById("update-c-stock").value || 0).toFixed(1);
  document.getElementById("mStock-display").textContent =
    parseFloat(document.getElementById("update-m-stock").value || 0).toFixed(1);
  document.getElementById("yStock-display").textContent =
    parseFloat(document.getElementById("update-y-stock").value || 0).toFixed(1);
  document.getElementById("kStock-display").textContent =
    parseFloat(document.getElementById("update-k-stock").value || 0).toFixed(1);

  updateInkLevels();
  closeStockUpdateModal();
};