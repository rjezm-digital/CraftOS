/*********************************************************
 * INVENTORY.JS
 * - General Materials
 * - Ink Materials
 * - Ink Cost + Stock Levels
 *********************************************************/

/* ========= ADD GENERAL MATERIAL ========= */
window.addMaterial = async function () {
  const name = document.getElementById("material-name").value.trim();
  const cost = parseFloat(document.getElementById("material-cost").value) || 0;
  const qty = parseFloat(document.getElementById("material-qty").value) || 0;

  if (!name || cost <= 0 || qty <= 0) return;

  await addDoc(collection(db, "materials"), {
    user: currentUser,
    name,
    cost,
    qty,
    createdAt: new Date()
  });

  document.getElementById("material-form").reset();
};

/* ========= DELETE GENERAL MATERIAL ========= */
window.deleteMaterial = async function (id) {
  if (!confirm("Delete this material?")) return;
  await deleteDoc(doc(db, "materials", id));
};

/* ========= RENDER GENERAL MATERIALS ========= */
window.renderMaterials = function () {
  const list = document.getElementById("material-list");

  if (!materials.length) {
    list.innerHTML = `<p class="text-slate-500 text-center py-6">No materials added yet.</p>`;
    return;
  }

  list.innerHTML = materials.map(m => `
    <div class="bg-slate-700/40 rounded-lg p-3 border border-slate-600/50 flex justify-between items-start">
      <div>
        <p class="font-bold text-white">${m.name}</p>
        <p class="text-xs text-slate-400">
          ₱${fmt(m.cost)} / ${m.qty} pcs
        </p>
      </div>
      <button onclick="deleteMaterial('${m.id}')" class="text-red-400 font-bold">✕</button>
    </div>
  `).join("");
};

/* ===================================================== */
/* ================= INK MATERIALS ===================== */
/* ===================================================== */

window.inkCosts = { c:null, m:null, y:null, k:null };
window.maxStockLevels = { c:0, m:0, y:0, k:0 };

/* ========= ADD INK MATERIAL ========= */
window.addInkMaterial = async function () {
  const color = document.getElementById("ink-color").value;
  const totalCost = parseFloat(document.getElementById("ink-total-cost").value) || 0;
  const mlPerBottle = parseFloat(document.getElementById("ink-ml-bottle").value) || 0;
  const bottles = parseFloat(document.getElementById("ink-qty-bottles").value) || 1;

  if (!color || totalCost <= 0 || mlPerBottle <= 0 || bottles <= 0) return;

  const totalMl = mlPerBottle * bottles;

  await addDoc(collection(db, "inks"), {
    user: currentUser,
    color,
    totalCost,
    mlPerBottle,
    bottles,
    totalMl,
    createdAt: new Date()
  });

  document.getElementById("ink-form").reset();
  document.getElementById("ink-qty-bottles").value = 1;
};

/* ========= DELETE INK MATERIAL ========= */
window.deleteInkMaterial = async function (id) {
  if (!confirm("Delete this ink?")) return;
  await deleteDoc(doc(db, "inks", id));
};

/* ========= RENDER INK MATERIALS ========= */
window.renderInkMaterials = function () {
  const list = document.getElementById("ink-list");

  if (!inkMaterials.length) {
    list.innerHTML = `<p class="text-slate-500 text-center py-6">No ink materials added yet.</p>`;
    return;
  }

  list.innerHTML = inkMaterials.map(i => {
    const costPerMl = i.totalCost / i.totalMl;

    return `
      <div class="bg-slate-700/40 rounded-lg p-3 border border-slate-600/50 flex justify-between items-start">
        <div>
          <p class="font-bold text-white">🎨 ${i.color}</p>
          <p class="text-xs text-slate-400">
            ₱${fmt(i.totalCost)} • ${i.totalMl}ml • ₱${fmt(costPerMl)}/ml
          </p>
        </div>
        <button onclick="deleteInkMaterial('${i.id}')" class="text-red-400 font-bold">✕</button>
      </div>
    `;
  }).join("");
};

/* ========= UPDATE INK COSTS + STOCK ========= */
window.updateInkCosts = function () {
  const map = {
    Cyan: "c",
    Magenta: "m",
    Yellow: "y",
    Black: "k"
  };

  let ready = true;

  Object.values(map).forEach(k => {
    inkCosts[k] = null;
    maxStockLevels[k] = 0;
  });

  inkMaterials.forEach(i => {
    const key = map[i.color];
    if (!key) return;

    inkCosts[key] = i.totalCost / i.totalMl;
    maxStockLevels[key] = i.totalMl;

    document.getElementById(`${key}Cost-display`).textContent = "₱" + fmt(inkCosts[key]);
    document.getElementById(`${key}Cost-label`).textContent = `₱${fmt(inkCosts[key])}/ml`;
    document.getElementById(`${key}Stock-display`).textContent = i.totalMl.toFixed(1);
  });

  ["c","m","y","k"].forEach(k => {
    if (inkCosts[k] === null) ready = false;
  });

  const status = document.getElementById("ink-inventory-status");
  if (status) {
    status.textContent = ready ? "✅ All Inks Ready" : "⚠️ Add Missing Inks";
    status.className = ready
      ? "text-xs font-bold px-2 py-1 rounded-full bg-green-500/30 text-green-300"
      : "text-xs font-bold px-2 py-1 rounded-full bg-red-500/30 text-red-300";
  }

  updateInkLevels();
};

/* ========= UPDATE VISUAL STOCK LEVELS ========= */
window.updateInkLevels = function () {
  const getPct = (v, max) => max > 0 ? (v / max) * 100 : 0;

  const c = parseFloat(document.getElementById("cStock-display")?.textContent) || 0;
  const m = parseFloat(document.getElementById("mStock-display")?.textContent) || 0;
  const y = parseFloat(document.getElementById("yStock-display")?.textContent) || 0;
  const k = parseFloat(document.getElementById("kStock-display")?.textContent) || 0;

  document.getElementById("cyan-level").style.height = getPct(c, maxStockLevels.c) + "%";
  document.getElementById("magenta-level").style.height = getPct(m, maxStockLevels.m) + "%";
  document.getElementById("yellow-level").style.height = getPct(y, maxStockLevels.y) + "%";
  document.getElementById("black-level").style.height = getPct(k, maxStockLevels.k) + "%";
};