import type { NutriGrade, NovaGroup, Product } from "@/lib/nara/types";

type Seed = {
  code: string;
  name: string;
  brand: string;
  category: string;
  categoryTag: string;
  servingSize: string;
  servingGrams: number;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  sugar: number;
  fiber: number;
  salt: number;
  satFat: number;
  nutriscore: NutriGrade;
  nova: NovaGroup;
  additiveTags?: string[];
  ingredientFlags?: string[];
  ingredientsText?: string;
  organic?: boolean;
  featured?: boolean;
};

function product(seed: Seed): Product {
  const per100 = {
    kcal: seed.kcal,
    protein: seed.protein,
    carbs: seed.carbs,
    fat: seed.fat,
    sugar: seed.sugar,
    fiber: seed.fiber,
    salt: seed.salt,
    satFat: seed.satFat,
  };
  const ratio = seed.servingGrams / 100;
  return {
    code: seed.code,
    name: seed.name,
    brand: seed.brand,
    imageUrl: null,
    category: seed.category,
    categoryTag: seed.categoryTag,
    categoryTags: [seed.categoryTag],
    servingSize: seed.servingSize,
    servingGrams: seed.servingGrams,
    per100,
    perServing: {
      kcal: round(per100.kcal * ratio),
      protein: round(per100.protein * ratio),
      carbs: round(per100.carbs * ratio),
      fat: round(per100.fat * ratio),
      sugar: round(per100.sugar * ratio),
      salt: round(per100.salt * ratio),
    },
    nutriscore: seed.nutriscore,
    nova: seed.nova,
    additiveTags: seed.additiveTags ?? [],
    ingredientFlags: seed.ingredientFlags ?? [],
    ingredientsText: seed.ingredientsText ?? null,
    organic: seed.organic ?? false,
    source: "aisle",
  };
}

const SEEDS: Seed[] = [
  {
    code: "3017620422003",
    name: "Nutella",
    brand: "Ferrero",
    category: "Hazelnut spread",
    categoryTag: "en:hazelnut-spreads",
    servingSize: "15 g",
    servingGrams: 15,
    kcal: 539,
    protein: 6.3,
    carbs: 57.5,
    fat: 30.9,
    sugar: 56.3,
    fiber: 0,
    salt: 0.107,
    satFat: 10.6,
    nutriscore: "e",
    nova: 4,
    additiveTags: ["en:e322"],
    ingredientFlags: ["palm-oil"],
    ingredientsText:
      "Sugar, palm oil, hazelnuts 13%, skimmed milk powder, fat-reduced cocoa, emulsifier lecithins, vanillin.",
    featured: true,
  },
  {
    code: "5449000000996",
    name: "Coca-Cola",
    brand: "Coca-Cola",
    category: "Cola",
    categoryTag: "en:sodas",
    servingSize: "330 ml",
    servingGrams: 330,
    kcal: 42,
    protein: 0,
    carbs: 10.6,
    fat: 0,
    sugar: 10.6,
    fiber: 0,
    salt: 0.01,
    satFat: 0,
    nutriscore: "e",
    nova: 4,
    additiveTags: ["en:e150d", "en:e338"],
    ingredientsText:
      "Carbonated water, sugar, colour (caramel E150d), acid (phosphoric acid), natural flavourings, caffeine.",
    featured: true,
  },
  {
    code: "2000000001016",
    name: "Plain skyr",
    brand: "Aisle sample",
    category: "Yogurt",
    categoryTag: "en:yogurts",
    servingSize: "150 g",
    servingGrams: 150,
    kcal: 63,
    protein: 11,
    carbs: 4,
    fat: 0.2,
    sugar: 4,
    fiber: 0,
    salt: 0.1,
    satFat: 0.1,
    nutriscore: "a",
    nova: 1,
    ingredientsText: "Skimmed milk, live cultures.",
    featured: true,
  },
  {
    code: "2000000001023",
    name: "Rolled oats",
    brand: "Aisle sample",
    category: "Breakfast cereal",
    categoryTag: "en:breakfast-cereals",
    servingSize: "40 g",
    servingGrams: 40,
    kcal: 379,
    protein: 13.2,
    carbs: 67.7,
    fat: 6.5,
    sugar: 1,
    fiber: 10.1,
    salt: 0.01,
    satFat: 1.1,
    nutriscore: "a",
    nova: 1,
    ingredientsText: "Wholegrain rolled oats.",
    featured: true,
  },
  {
    code: "2000000001030",
    name: "Chocolate granola",
    brand: "Aisle sample",
    category: "Breakfast cereal",
    categoryTag: "en:breakfast-cereals",
    servingSize: "45 g",
    servingGrams: 45,
    kcal: 460,
    protein: 8,
    carbs: 62,
    fat: 18,
    sugar: 24,
    fiber: 6,
    salt: 0.4,
    satFat: 6.5,
    nutriscore: "d",
    nova: 4,
    additiveTags: ["en:e322"],
    ingredientFlags: ["palm-oil"],
    ingredientsText: "Oats, sugar, palm oil, chocolate pieces, skimmed milk powder, emulsifier lecithin.",
    featured: true,
  },
  {
    code: "2000000001115",
    name: "White sandwich bread",
    brand: "Aisle sample",
    category: "Bread",
    categoryTag: "en:breads",
    servingSize: "40 g",
    servingGrams: 40,
    kcal: 265,
    protein: 8,
    carbs: 49,
    fat: 3.2,
    sugar: 5,
    fiber: 2.5,
    salt: 1.1,
    satFat: 0.6,
    nutriscore: "c",
    nova: 4,
    additiveTags: ["en:e282", "en:e471"],
    ingredientsText: "Wheat flour, water, sugar, yeast, salt, rapeseed oil, calcium propionate, emulsifier.",
    featured: true,
  },
  {
    code: "2000000001047",
    name: "Hazelnut butter",
    brand: "Aisle sample",
    category: "Hazelnut spread",
    categoryTag: "en:hazelnut-spreads",
    servingSize: "15 g",
    servingGrams: 15,
    kcal: 650,
    protein: 15,
    carbs: 17,
    fat: 62,
    sugar: 4,
    fiber: 9,
    salt: 0.02,
    satFat: 4.5,
    nutriscore: "b",
    nova: 1,
    ingredientsText: "Roasted hazelnuts.",
  },
  {
    code: "2000000001122",
    name: "Almond butter",
    brand: "Aisle sample",
    category: "Hazelnut spread",
    categoryTag: "en:hazelnut-spreads",
    servingSize: "15 g",
    servingGrams: 15,
    kcal: 614,
    protein: 21,
    carbs: 19,
    fat: 56,
    sugar: 4.5,
    fiber: 10,
    salt: 0.02,
    satFat: 4.2,
    nutriscore: "b",
    nova: 1,
    ingredientsText: "Roasted almonds.",
  },
  {
    code: "2000000001054",
    name: "Sparkling water",
    brand: "Aisle sample",
    category: "Cola",
    categoryTag: "en:sodas",
    servingSize: "330 ml",
    servingGrams: 330,
    kcal: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    sugar: 0,
    fiber: 0,
    salt: 0.02,
    satFat: 0,
    nutriscore: "a",
    nova: 1,
    ingredientsText: "Carbonated water.",
  },
  {
    code: "2000000001108",
    name: "Diet cola",
    brand: "Aisle sample",
    category: "Cola",
    categoryTag: "en:sodas",
    servingSize: "330 ml",
    servingGrams: 330,
    kcal: 0.4,
    protein: 0,
    carbs: 0,
    fat: 0,
    sugar: 0,
    fiber: 0,
    salt: 0.02,
    satFat: 0,
    nutriscore: "b",
    nova: 4,
    additiveTags: ["en:e150d", "en:e338", "en:e950", "en:e951"],
    ingredientsText: "Carbonated water, colour (caramel E150d), sweeteners (aspartame, acesulfame K), phosphoric acid.",
  },
  {
    code: "2000000001078",
    name: "Strawberry yogurt",
    brand: "Aisle sample",
    category: "Yogurt",
    categoryTag: "en:yogurts",
    servingSize: "150 g",
    servingGrams: 150,
    kcal: 95,
    protein: 4,
    carbs: 14,
    fat: 2.5,
    sugar: 12,
    fiber: 0.2,
    salt: 0.15,
    satFat: 1.6,
    nutriscore: "c",
    nova: 4,
    additiveTags: ["en:e440", "en:e160a"],
    ingredientsText: "Milk, sugar, strawberry, modified starch, pectin, carotene.",
  },
  {
    code: "2000000001092",
    name: "Greek yogurt 0%",
    brand: "Aisle sample",
    category: "Yogurt",
    categoryTag: "en:yogurts",
    servingSize: "170 g",
    servingGrams: 170,
    kcal: 57,
    protein: 10.3,
    carbs: 4,
    fat: 0.2,
    sugar: 4,
    fiber: 0,
    salt: 0.1,
    satFat: 0.1,
    nutriscore: "a",
    nova: 1,
    ingredientsText: "Skimmed milk, live cultures.",
  },
  {
    code: "2000000001139",
    name: "No-sugar muesli",
    brand: "Aisle sample",
    category: "Breakfast cereal",
    categoryTag: "en:breakfast-cereals",
    servingSize: "45 g",
    servingGrams: 45,
    kcal: 360,
    protein: 10,
    carbs: 60,
    fat: 7,
    sugar: 8,
    fiber: 9,
    salt: 0.05,
    satFat: 1,
    nutriscore: "a",
    nova: 1,
    ingredientsText: "Oats, rye flakes, raisins, sunflower seeds, almonds.",
  },
  {
    code: "2000000001085",
    name: "Wholemeal bread",
    brand: "Aisle sample",
    category: "Bread",
    categoryTag: "en:breads",
    servingSize: "40 g",
    servingGrams: 40,
    kcal: 247,
    protein: 13,
    carbs: 41,
    fat: 3.5,
    sugar: 3.5,
    fiber: 7,
    salt: 0.9,
    satFat: 0.6,
    nutriscore: "a",
    nova: 3,
    ingredientsText: "Wholemeal wheat flour, water, yeast, salt.",
  },
];

export const AISLE: Product[] = SEEDS.map(product);

const featuredCodes = new Set(SEEDS.filter((seed) => seed.featured).map((seed) => seed.code));

export function featuredProducts() {
  return AISLE.filter((item) => featuredCodes.has(item.code));
}

export function aisleByCode(code: string) {
  const normalized = code.replace(/\D/g, "");
  return AISLE.find((item) => item.code === normalized || item.code === code) ?? null;
}

export function aisleSearch(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return AISLE.filter((item) =>
    `${item.name} ${item.brand} ${item.category} ${item.code}`.toLowerCase().includes(q),
  );
}

function round(n: number) {
  return Math.round(n * 10) / 10;
}
