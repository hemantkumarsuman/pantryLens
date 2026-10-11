/**
 * Gemini API Service for PantryLens
 * Designed for Gemini 1.5 Flash / 2.0 Flash (Free Tier Friendly)
 */

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

/**
 * Extracts pure JSON from a Gemini response that might contain markdown backticks
 */
function cleanJsonText(rawText) {
  let cleaned = rawText.trim();
  // Strip ```json or ``` at beginning and end
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.substring(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.substring(3);
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.substring(0, cleaned.length - 3);
  }
  return cleaned.trim();
}

/**
 * Categorize ingredient icon
 */
export function getCategoryIcon(category = '', name = '') {
  const lower = (category + ' ' + name).toLowerCase();
  if (lower.includes('egg') || lower.includes('chicken') || lower.includes('beef') || lower.includes('meat') || lower.includes('fish') || lower.includes('protein') || lower.includes('tofu')) return '🥩';
  if (lower.includes('tomato') || lower.includes('spinach') || lower.includes('produce') || lower.includes('avocado') || lower.includes('onion') || lower.includes('garlic') || lower.includes('vegetable') || lower.includes('herb') || lower.includes('lemon')) return '🥦';
  if (lower.includes('cheese') || lower.includes('milk') || lower.includes('butter') || lower.includes('yogurt') || lower.includes('dairy')) return '🧀';
  if (lower.includes('bread') || lower.includes('flour') || lower.includes('grain') || lower.includes('pasta') || lower.includes('rice') || lower.includes('sourdough')) return '🍞';
  if (lower.includes('oil') || lower.includes('vinegar') || lower.includes('spice') || lower.includes('sauce') || lower.includes('salt')) return '🫒';
  return '✨';
}

/**
 * Vision Analysis: Analyzes an image of a fridge/pantry and creates recipes
 */
export async function analyzePantryImage(apiKey, base64Data, mimeType = 'image/jpeg', preferences = 'balanced') {
  if (!apiKey) {
    throw new Error('Please enter your free Gemini API Key in the top navigation or use Demo Mode.');
  }

  const prompt = `
You are an expert Michelin-trained executive chef and culinary food scientist.
Analyze this photo of ingredients / pantry / refrigerator.

TASK:
1. Identify all visible ingredients clearly.
2. Devise exactly 3 distinct, creative, mouthwatering chef-grade recipes that maximize the use of the detected ingredients.
3. For each recipe, provide precise instructions, estimated cook times, nutritional estimates, and flavor profiles.

DIETARY PREFERENCE FOCUS: ${preferences}

RETURN ONLY VALID RAW JSON adhering to this exact schema (no preamble, no conversational filler):
{
  "detectedIngredients": [
    {
      "name": "Ingredient Name",
      "category": "produce | protein | dairy | bakery | pantry",
      "freshness": "fresh | stable"
    }
  ],
  "recipes": [
    {
      "id": "recipe-unique-id",
      "title": "Creative Recipe Name",
      "tagline": "A single sentence describing the texture and culinary appeal",
      "cuisine": "Cuisine style (e.g. Modern Italian, French Bistro, Japanese)",
      "prepTime": 10,
      "cookTime": 15,
      "difficulty": "Easy | Intermediate | Advanced",
      "servings": 2,
      "matchPercentage": 95,
      "caloriesPerServing": 420,
      "macros": {
        "protein": 24,
        "carbs": 38,
        "fat": 18,
        "fiber": 6
      },
      "flavorProfile": {
        "savory": 85,
        "umami": 70,
        "fresh": 90,
        "spicy": 20,
        "sweet": 15
      },
      "chefSecret": "A single game-changing culinary technique tip",
      "usedIngredients": ["List of detected ingredients used"],
      "missingIngredients": ["1 or 2 common pantry staples that would elevate it, if any"],
      "instructions": [
        {
          "step": 1,
          "title": "Short Step Title",
          "text": "Detailed culinary action",
          "durationMinutes": 4,
          "tip": "Sensory cue (e.g. until golden and aromatic)"
        }
      ]
    }
  ]
}
`;

  const requestBody = {
    contents: [
      {
        parts: [
          { text: prompt },
          {
            inline_data: {
              mime_type: mimeType,
              data: base64Data
            }
          }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.4,
      maxOutputTokens: 3000,
    }
  };

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData?.error?.message || `HTTP ${response.status}: ${response.statusText}`;
    if (response.status === 429) {
      throw new Error('Gemini Free Tier rate limit reached (15 requests/min). Please wait 30 seconds before retrying.');
    }
    if (response.status === 400 || response.status === 403) {
      throw new Error(`API Key error: ${message}. Check your key at Google AI Studio.`);
    }
    throw new Error(`Gemini API Error: ${message}`);
  }

  const data = await response.json();
  const textOutput = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!textOutput) {
    throw new Error('No response text received from Gemini.');
  }

  const cleanJson = cleanJsonText(textOutput);
  try {
    const parsed = JSON.parse(cleanJson);
    return parsed;
  } catch (err) {
    console.error('Failed to parse Gemini JSON:', cleanJson);
    throw new Error('Failed to parse culinary response into structured data. Please try again.');
  }
}

/**
 * Text-only Generation: Generates recipes based on an updated list of ingredient tags
 */
export async function generateRecipesFromTags(apiKey, ingredientNames = [], preference = 'balanced') {
  if (!apiKey) {
    throw new Error('Please enter your free Gemini API Key in the top navigation or use Demo Mode.');
  }

  const prompt = `
You are an award-winning executive chef.
The user has the following ingredients available in their kitchen:
[${ingredientNames.join(', ')}]

PREFERENCE: ${preference}

TASK:
Craft exactly 3 distinct, creative, restaurant-quality recipes making the most of these available ingredients.

RETURN ONLY VALID RAW JSON adhering to this exact schema (no markdown formatting, no conversational text):
{
  "recipes": [
    {
      "id": "recipe-id",
      "title": "Creative Recipe Title",
      "tagline": "Appealing one-line description",
      "cuisine": "Cuisine style",
      "prepTime": 10,
      "cookTime": 15,
      "difficulty": "Easy | Intermediate | Advanced",
      "servings": 2,
      "matchPercentage": 95,
      "caloriesPerServing": 390,
      "macros": {
        "protein": 22,
        "carbs": 30,
        "fat": 16,
        "fiber": 5
      },
      "flavorProfile": {
        "savory": 80,
        "umami": 75,
        "fresh": 85,
        "spicy": 20,
        "sweet": 25
      },
      "chefSecret": "Key chef tip",
      "usedIngredients": ["List of ingredients from user list used"],
      "missingIngredients": ["Optional staple (salt/pepper/oil)"],
      "instructions": [
        {
          "step": 1,
          "title": "Short Step Title",
          "text": "Detailed culinary instructions",
          "durationMinutes": 4,
          "tip": "Sensory cue"
        }
      ]
    }
  ]
}
`;

  const requestBody = {
    contents: [
      {
        parts: [{ text: prompt }]
      }
    ],
    generationConfig: {
      temperature: 0.4,
      maxOutputTokens: 3000,
    }
  };

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData?.error?.message || `HTTP ${response.status}: ${response.statusText}`;
    if (response.status === 429) {
      throw new Error('Gemini Free Tier rate limit reached (15 requests/min). Please wait 30 seconds.');
    }
    throw new Error(`Gemini API Error: ${message}`);
  }

  const data = await response.json();
  const textOutput = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  const cleanJson = cleanJsonText(textOutput);
  return JSON.parse(cleanJson);
}
