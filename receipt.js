/*********************************************************
 * RECEIPT.JS
 * - Receipt Preview
 * - Receipt Item Management
 * - Print Receipt
 *********************************************************/

/* ========= OPEN RECEIPT TAB ========= */
window.openReceiptModal = function () {
  if (!lastCalc) {
    alert("Please calculate a job first.");
    return;
  }

  applyReceiptData();
  document.getElementById("receipt-modal").classList.remove("hidden");
};

/* ========= CLOSE RECEIPT ========= */
window.closeReceiptModal = function () {
  document.getElementById("receipt-modal").classList.add("hidden");
};

/* ========= APPLY DATA TO RECEIPT ========= */
window.applyReceiptData = function () {
  if (!lastCalc) return;

  const now = new Date();

  document.getElementById("receipt-date").textContent =
    now.toLocaleDateString() + " " + now.toLocaleTimeString();

  document.getElementById("receipt-qty").textContent =
    lastCalc.qty;

  document.getElementById("receipt-cost").textContent =
    "₱" + fmt(lastCalc.totalCost);

  document.getElementById("receipt-selling").textContent =
    "₱" + fmt(lastCalc.totalSelling);

  document.getElementById("receipt-profit").textContent =
    "₱" + fmt(lastCalc.totalSelling - lastCalc.totalCost);

  /* ---- BREAKDOWN ---- */
  document.getElementById("receipt-material").textContent =
    "₱" + fmt(lastCalc.materialCost);

  document.getElementById("receipt-ink").textContent =
    "₱" + fmt(lastCalc.inkCost);

  document.getElementById("receipt-elec").textContent =
    "₱" + fmt(lastCalc.elecCost);

  document.getElementById("receipt-misc").textContent =
    "₱" + fmt(lastCalc.miscCost);
};

/* ========= ADD EXTRA RECEIPT ITEM ========= */
window.addReceiptItem = function () {
  const name = document.getElementById("receipt-item-name").value.trim();
  const price = parseFloat(document.getElementById("receipt-item-price").value) || 0;

  if (!name || price <= 0) return;

  const list = document.getElementById("receipt-items");

  const row = document.createElement("div");
  row.className =
    "flex justify-between text-sm border-b border-slate-700 py-1";

  row.innerHTML = `
    <span>${name}</span>
    <span>₱${fmt(price)}</span>
  `;

  list.appendChild(row);

  document.getElementById("receipt-item-name").value = "";
  document.getElementById("receipt-item-price").value = "";

  // update total
  lastCalc.totalSelling += price;
  document.getElementById("receipt-selling").textContent =
    "₱" + fmt(lastCalc.totalSelling);
};

/* ========= PRINT RECEIPT ========= */
window.printReceipt = function () {
  const content = document.getElementById("receipt-print").innerHTML;

  const win = window.open("", "", "width=400,height=600");
  win.document.write(`
    <html>
      <head>
        <title>Receipt</title>
        <style>
          body {
            font-family: system-ui, sans-serif;
            padding: 16px;
          }
          h2 {
            text-align: center;
          }
          .row {
            display: flex;
            justify-content: space-between;
            margin: 4px 0;
          }
          hr {
            margin: 8px 0;
          }
        </style>
      </head>
      <body>
        ${content}
        <script>
          window.print();
          window.close();
        </script>
      </body>
    </html>
  `);
  win.document.close();
};