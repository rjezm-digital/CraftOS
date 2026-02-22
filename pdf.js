import { lastCalc, fmt } from "./state.js";

window.exportPDF = () => {
  if (!lastCalc) return;

  const w = window.open("", "", "width=600,height=800");
  w.document.write(`
    <h1>RJEZM DIGITAL</h1>
    <p>Total Cost: ₱${fmt(lastCalc.total)}</p>
    <p>Selling Price: ₱${fmt(lastCalc.selling)}</p>
  `);
  w.print();
};