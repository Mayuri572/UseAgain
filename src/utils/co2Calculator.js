/**
 * CO2 savings calculator for circular economy impact
 * Based on estimated lifecycle emissions saved by reuse vs. new production
 */

// CO2 savings in kg per item category (conservative estimates)
const CO2_FACTORS = {
  electronics: 15,
  clothing: 4,
  furniture: 12,
  books: 1,
  appliances: 20,
  toys: 2,
  sports: 5,
  tools: 8,
  kitchen: 3,
  garden: 6,
  vehicles: 50,
  other: 3,
};

// Weight estimates per category (kg) for waste diversion
const WEIGHT_FACTORS = {
  electronics: 0.8,
  clothing: 0.5,
  furniture: 15,
  books: 0.3,
  appliances: 8,
  toys: 0.4,
  sports: 2,
  tools: 2,
  kitchen: 1,
  garden: 3,
  vehicles: 100,
  other: 1,
};

/**
 * Calculate CO2 savings for a completed transaction
 * @param {string} category - Item category
 * @param {number} count - Number of items
 * @returns {{ co2Saved: number, kgDiverted: number }}
 */
export function calculateCO2Savings(category = "other", count = 1) {
  const key = category.toLowerCase();
  const co2Saved = (CO2_FACTORS[key] || CO2_FACTORS.other) * count;
  const kgDiverted = (WEIGHT_FACTORS[key] || WEIGHT_FACTORS.other) * count;
  return { co2Saved, kgDiverted };
}

/**
 * Format CO2 value for display
 * @param {number} kg
 * @returns {string}
 */
export function formatCO2(kg) {
  if (kg >= 1000) return `${(kg / 1000).toFixed(1)} tonnes`;
  return `${kg.toFixed(1)} kg`;
}

/**
 * Equivalent metaphors for CO2 savings
 * @param {number} kgCO2
 * @returns {string}
 */
export function getCO2Equivalent(kgCO2) {
  const carKm = kgCO2 / 0.21; // avg car emits ~210g/km
  if (carKm > 100) return `${Math.round(carKm)} km not driven`;
  const trees = kgCO2 / 21; // tree absorbs ~21kg/year
  return `${trees.toFixed(1)} trees planted (1yr)`;
}

export function calculateCO2Saved(category = "other", countOrCondition = 1) {
  const count = typeof countOrCondition === "number" ? countOrCondition : 1;
  return calculateCO2Savings(category, count).co2Saved;
}

export function co2Equivalent(kgCO2 = 0) {
  const kmsNotDriven = Math.round(kgCO2 / 0.21);
  const treeMonths = Math.round((kgCO2 / 21) * 12);
  return { kmsNotDriven, treeMonths };
}

export function formatImpact(kgCO2 = 0) {
  return formatCO2(kgCO2);
}

// Simple tests (run via node)
if (typeof process !== "undefined" && process.argv[2] === "--test") {
  const result = calculateCO2Savings("electronics", 2);
  console.assert(result.co2Saved === 30, "CO2 test failed");
  console.assert(result.kgDiverted === 1.6, "Weight test failed");
  console.log("✅ co2Calculator tests passed:", result);
}
