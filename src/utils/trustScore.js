/**
 * Trust Score calculator for UseAgain sellers/buyers
 * Score range: 0–100
 * 
 * Formula:
 *   (completedDeals * 2) + (avgRating * 10) + verificationBonus + activityBonus
 *   capped at 100
 */

export const TRUST_LEVELS = [
  { label: "New Member",   min: 0,  max: 19,  color: "gray",   icon: "🌱" },
  { label: "Trusted",      min: 20, max: 39,  color: "blue",   icon: "⭐" },
  { label: "Reliable",     min: 40, max: 59,  color: "teal",   icon: "✅" },
  { label: "Verified Pro", min: 60, max: 79,  color: "green",  icon: "🏅" },
  { label: "Champion",     min: 80, max: 100, color: "gold",   icon: "🏆" },
];

/**
 * Calculate trust score for a user
 * @param {object} params
 * @param {number} params.completedDeals
 * @param {number} params.avgRating - 0 to 5
 * @param {boolean} params.emailVerified
 * @param {boolean} params.phoneVerified
 * @param {boolean} params.idVerified
 * @param {number} params.responseRate - 0 to 1
 * @returns {{ score: number, level: object, breakdown: object }}
 */
export function calculateTrustScore({
  completedDeals = 0,
  avgRating = 0,
  emailVerified = false,
  phoneVerified = false,
  idVerified = false,
  responseRate = 0,
} = {}) {
  const dealsScore = Math.min(completedDeals * 2, 40);
  const ratingScore = avgRating * 10;
  const verificationBonus =
    (emailVerified ? 5 : 0) + (phoneVerified ? 5 : 0) + (idVerified ? 10 : 0);
  const activityBonus = Math.round(responseRate * 10);

  const raw = dealsScore + ratingScore + verificationBonus + activityBonus;
  const score = Math.min(Math.round(raw), 100);

  const level = TRUST_LEVELS.find((l) => score >= l.min && score <= l.max) || TRUST_LEVELS[0];

  return {
    score,
    level,
    breakdown: { dealsScore, ratingScore, verificationBonus, activityBonus },
  };
}

/**
 * Get color classes for trust score badge
 */
export function getTrustBadgeClasses(score) {
  if (score >= 80) return "bg-yellow-100 text-yellow-800 border-yellow-300";
  if (score >= 60) return "bg-green-100 text-green-800 border-green-300";
  if (score >= 40) return "bg-teal-100 text-teal-800 border-teal-300";
  if (score >= 20) return "bg-blue-100 text-blue-800 border-blue-300";
  return "bg-gray-100 text-gray-600 border-gray-300";
}

export function computeTrustScore({
  completedDeals = 0,
  avgRating = 0,
  emailVerified = false,
  isEmailVerified = false,
  phoneVerified = false,
  idVerified = false,
  responseRate = 0,
} = {}) {
  const result = calculateTrustScore({
    completedDeals,
    avgRating,
    emailVerified: emailVerified || isEmailVerified,
    phoneVerified,
    idVerified,
    responseRate,
  });
  return result.score;
}

export function getTrustBadge(score = 0) {
  const level = TRUST_LEVELS.find((l) => score >= l.min && score <= l.max) || TRUST_LEVELS[0];
  const classes = getTrustBadgeClasses(score);
  const [bg, color] = classes.split(" ");
  return { label: level.label, emoji: level.icon, bg, color };
}
