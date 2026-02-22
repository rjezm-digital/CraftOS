window.switchTab = function(tab) {
  ["inventory","costing","cmyk","calculator","products","receipt"].forEach(t=>{
    document.getElementById(`content-${t}`)?.classList.toggle("hidden", t!==tab);
  });
};

window.fmt = n => parseFloat(n||0).toFixed(2);