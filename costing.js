/*********************************************************
 * COSTING.JS
 * - Material Costing
 * - Electricity Cost Calculation
 *********************************************************/

/* ========= ADD COSTING ITEM ========= */
window.addCosting = async function () {
  const select = document.getElementById("costing-material");
  const qtyInput = document.getElementById("costing-qty");

  const value = select.value;
  const qty = parseFloat(qtyInput.value) || 0;

  if (!value || qty <= 0) return;

  const [type, index] = value.split("-");

  await addDoc(collection(db, "costing"), {
    user: currentUser,
    type,                // "general" | "ink"
    index: parseInt(index),
    qty,
    createdAt: new Date()
  });

  select.value = "";
  qtyInput.value = "";
};

/* ========= DELETE COSTING ITEM ========= */
window.deleteCosting = async function (id) {
  if (!confirm("Remove this costing item?")) return;
  await deleteDoc(doc(db, "costing", id));
};

/* ========= RENDER COSTING LIST ========= */
window.renderCosting = function () {
  const list = document.getElementById("costing-list");
  const totalBox = document.getElementById("costing-total");

  if (!costingItems.length) {
    list.innerHTML = `<p class="text-slate-500 text-center py-6">
      No materials added to costing yet.
    </p>`;
    totalBox.classList.add("hidden");
    return;
  }

  let total = 0;

  list.innerHTML = costingItems.map(item => {
    let name = "Unknown";
    let unitCost = 0;

    if (item.type === "general") {
      const mat = materials[item.index];
      if (mat) {
        name = mat.name;
        unitCost = mat.cost / mat.qty;
      }
    }

    if (item.type === "ink") {
      const ink = inkMaterials[item.index];
      if (ink) {
        name = ink.color + " Ink";
        unitCost = ink.totalCost / ink.totalMl;
      }
    }

    const cost = unitCost * item.qty;
    total += cost;

    return `
      <div class="bg-slate-700/40 rounded-lg p-3 border border-slate-600/50 flex justify-between items-center">
        <div>
          <p class="text-white font-bold">${name}</p>
          <p class="text-xs text-slate-400">
            Qty: ${item.qty} • ₱${fmt(cost)}
          </p>
        </div>
        <button onclick="deleteCosting('${item.id}')" class="text-red-400 font-bold">
          ✕
        </button>
      </div>
    `;
  }).join("");

  document.getElementById("costing-total-value").textContent = "₱" + fmt(total);
  totalBox.classList.remove("hidden");
};

/* ========= UPDATE MATERIAL SELECT DROPDOWN ========= */
window.updateMaterialSelect = function () {
  const select = document.getElementById("costing-material");
  if (!select) return;

  let options = `<option value="">-- Select a material --</option>`;

  materials.forEach((m, i) => {
    const unit = m.cost / m.qty;
    options += `
      <option value="general-${i}">
        ${m.name} (₱${fmt(unit)}/pc)
      </option>
    `;
  });

  inkMaterials.forEach((i, idx) => {
    const unit = i.totalCost / i.totalMl;
    options += `
      <option value="ink-${idx}">
        ${i.color} Ink (₱${fmt(unit)}/ml)
      </option>
    `;
  });

  select.innerHTML = options;
};

/* ===================================================== */
/* ============ ELECTRICITY COST SYSTEM ================= */
/* ===================================================== */

window.calculateElectricity = function () {
  const power = parseFloat(document.getElementById("elec-power").value) || 0;
  const rate = parseFloat(document.getElementById("elec-rate").value) || 0;
  const runtime = parseFloat(document.getElementById("elec-runtime").value) || 0;
  const jobs = parseFloat(document.getElementById("elec-num-jobs").value) || 1;

  if (power <= 0 || rate <= 0 || runtime <= 0 || jobs <= 0) return;

  // kWh per job
  const kwhPerJob = (power / 1000) * (runtime / 60);

  const costPerJob = kwhPerJob * rate;
  const totalCost = costPerJob * jobs;

  lastElecCost = totalCost;

  document.getElementById("elec-cost-per-job").textContent =
    "₱" + fmt(costPerJob);

  document.getElementById("elec-total-cost").textContent =
    "₱" + fmt(totalCost);

  document.getElementById("elec-breakdown").classList.remove("hidden");
};