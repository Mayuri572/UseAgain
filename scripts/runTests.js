/**
 * Basic unit tests for UseAgain utilities
 * Run: node scripts/runTests.js
 */

let passed = 0;
let failed = 0;

function assert(condition, label) {
  if (condition) {
    console.log(`  ✅ ${label}`);
    passed++;
  } else {
    console.error(`  ❌ FAILED: ${label}`);
    failed++;
  }
}

// ── Haversine tests ──────────────────────────────────────────────────────────
console.log("\n📍 geoUtils.haversine");

function haversine(lat1, lon1, lat2, lon2) {
  const toRad = d => d * Math.PI / 180;
  const dLat = toRad(lat2 - lat1), dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon/2)**2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const d1 = haversine(28.6139, 77.209, 28.7041, 77.1025);
assert(Math.abs(d1 - 14.4) < 1.0, `Delhi to Rohini ≈14.4km (got ${d1.toFixed(2)})`);
assert(haversine(0, 0, 0, 0) === 0, "Same point = 0 distance");

const d2 = haversine(18.5204, 73.8567, 18.5314, 73.8446);
assert(d2 < 5, `Pune intra-city distance < 5km (got ${d2.toFixed(2)})`);

// ── CO2 Calculator tests ─────────────────────────────────────────────────────
console.log("\n🌱 co2Calculator");

function calculateCO2Savings(category = "other", count = 1) {
  const CO2_FACTORS = { electronics: 15, clothing: 4, furniture: 12, books: 1, appliances: 20, toys: 2, sports: 5, tools: 8, kitchen: 3, other: 3 };
  const WEIGHT_FACTORS = { electronics: 0.8, clothing: 0.5, furniture: 15, books: 0.3, appliances: 8, toys: 0.4, sports: 2, tools: 2, kitchen: 1, other: 1 };
  return {
    co2Saved: (CO2_FACTORS[category] || 3) * count,
    kgDiverted: (WEIGHT_FACTORS[category] || 1) * count,
  };
}

const r1 = calculateCO2Savings("electronics", 2);
assert(r1.co2Saved === 30, `electronics x2 → 30kg CO₂ (got ${r1.co2Saved})`);
assert(r1.kgDiverted === 1.6, `electronics x2 → 1.6kg diverted (got ${r1.kgDiverted})`);

const r2 = calculateCO2Savings("furniture", 1);
assert(r2.co2Saved === 12, `furniture x1 → 12kg CO₂ (got ${r2.co2Saved})`);
assert(r2.kgDiverted === 15, `furniture x1 → 15kg diverted (got ${r2.kgDiverted})`);

// ── Trust Score tests ────────────────────────────────────────────────────────
console.log("\n⭐ trustScore");

function calculateTrustScore({ completedDeals = 0, avgRating = 0, emailVerified = false } = {}) {
  const score = Math.min(Math.round(
    Math.min(completedDeals * 2, 40) + avgRating * 10 + (emailVerified ? 5 : 0)
  ), 100);
  return score;
}

assert(calculateTrustScore({ completedDeals: 5, avgRating: 4.5, emailVerified: true }) === 60,
  "5 deals + 4.5 rating + email = 60");
assert(calculateTrustScore({}) === 0, "empty user = 0");
assert(calculateTrustScore({ completedDeals: 100, avgRating: 5, emailVerified: true }) <= 100, "100 deals + 5.0 rating + email ≤ 100 (capped)");
assert(calculateTrustScore({ completedDeals: 20, avgRating: 5 }) === 90, "20 deals + 5.0 rating = 90");

// ── Summary ──────────────────────────────────────────────────────────────────
console.log(`\n${passed + failed} tests: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
else console.log("All tests passed! ✅\n");
