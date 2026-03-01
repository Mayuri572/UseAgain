/**
 * AI Service — image categorization and price suggestion
 * 
 * PRODUCTION INTEGRATION:
 * - categorizeImage: Replace with Google Vision API (Cloud Vision labels)
 * - suggestPrice: Replace with a trained regression model or price scraper
 * 
 * Google Vision setup:
 *   npm install @google-cloud/vision
 *   const client = new ImageAnnotatorClient({ keyFilename: 'service-account.json' });
 *   const [result] = await client.labelDetection(imagePath);
 */

const CATEGORY_KEYWORDS = {
  electronics: ["phone", "laptop", "computer", "camera", "headphone", "speaker", "tablet", "tv", "monitor"],
  furniture: ["chair", "table", "desk", "sofa", "bed", "shelf", "cabinet", "wardrobe"],
  clothing: ["shirt", "dress", "jeans", "jacket", "shoes", "clothes", "wear"],
  books: ["book", "novel", "textbook", "manga", "comic"],
  sports: ["bike", "bicycle", "yoga", "gym", "ball", "racket", "fitness"],
  kitchen: ["cooker", "blender", "mixer", "pot", "pan", "coffee"],
  toys: ["lego", "toy", "game", "puzzle", "doll"],
  tools: ["drill", "hammer", "wrench", "screwdriver", "saw"],
};

const PRICE_MULTIPLIERS = {
  "like-new": 0.7,
  good: 0.5,
  fair: 0.3,
  poor: 0.15,
};

const BASE_PRICES = {
  electronics: 5000,
  furniture: 3000,
  clothing: 500,
  books: 200,
  sports: 1500,
  kitchen: 1000,
  toys: 800,
  tools: 1200,
  garden: 600,
  appliances: 4000,
  other: 500,
};

/**
 * Mock image categorization
 * In production: send image to Google Vision API and map labels to categories
 * @param {File} file
 * @returns {Promise<{ category: string, confidence: number, tags: string[] }>}
 */
export async function categorizeImage(file) {
  await delay(800); // Simulate API call
  
  const fileName = file?.name?.toLowerCase() || "";
  let bestCategory = "other";
  let bestScore = 0;

  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    const score = keywords.filter(k => fileName.includes(k)).length;
    if (score > bestScore) {
      bestScore = score;
      bestCategory = cat;
    }
  }

  return {
    category: bestCategory,
    confidence: bestScore > 0 ? 0.85 : 0.4,
    tags: ["second-hand", "reusable", bestCategory],
  };
}

/**
 * Mock price suggestion
 * In production: Use ML model trained on marketplace data
 * @param {{ category: string, condition: string, title: string }} metadata
 * @returns {Promise<{ suggestedPrice: number, minPrice: number, maxPrice: number }>}
 */
export async function suggestPrice(metadata) {
  await delay(600); // Simulate API call
  
  const { category = "other", condition = "good" } = metadata;
  const base = BASE_PRICES[category] || BASE_PRICES.other;
  const multiplier = PRICE_MULTIPLIERS[condition] || 0.4;
  const suggested = Math.round(base * multiplier);
  
  return {
    suggestedPrice: suggested,
    minPrice: Math.round(suggested * 0.7),
    maxPrice: Math.round(suggested * 1.3),
    confidence: 0.7,
    note: "Mock estimate — based on category and condition averages",
  };
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }
