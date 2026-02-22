export let currentUser = null;

export let materials = [];
export let inkMaterials = [];
export let costingItems = [];
export let products = [];

export let lastCalc = null;
export let lastInkCost = 0;
export let lastElecCost = 0;

export let inkCosts = { c: 0, m: 0, y: 0, k: 0 };
export let maxStockLevels = { c: 0, m: 0, y: 0, k: 0 };

export const fmt = n => (parseFloat(n || 0)).toFixed(2);