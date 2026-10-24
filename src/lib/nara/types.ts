export type Sex = "female" | "male" | "other";
export type GoalId = "lose" | "maintain" | "gain" | "cleaner";
export type NutriGrade = "a" | "b" | "c" | "d" | "e";
export type NovaGroup = 1 | 2 | 3 | 4;
export type Band = "green" | "orange" | "red";
export type Verdict = "fits" | "tight" | "against";

export type Nutrients = {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  sugar: number;
  fiber: number;
  salt: number;
  satFat: number;
};

export type Product = {
  code: string;
  name: string;
  brand: string;
  imageUrl: string | null;
  category: string;
  categoryTag: string | null;
  categoryTags: string[];
  servingSize: string;
  servingGrams: number | null;
  per100: Nutrients;
  perServing: {
    kcal: number;
    protein: number;
    carbs: number;
    fat: number;
    sugar: number;
    salt: number;
  } | null;
  nutriscore: NutriGrade | null;
  nova: NovaGroup | null;
  additiveTags: string[];
  ingredientFlags: string[];
  ingredientsText: string | null;
  organic: boolean;
  source: "open-food-facts" | "aisle";
};

export type ScoreProblem = {
  name: string;
  level: "high" | "moderate";
  why: string;
};

export type ScoreResult = {
  score: number;
  band: Band;
  label: string;
  extreme: boolean;
  parts: {
    nutrition: number;
    processing: number;
    additives: number;
    nutritionDetail: string;
    processingDetail: string;
    additivesDetail: string;
  };
  problems: ScoreProblem[];
};

export type Profile = {
  age: number;
  sex: Sex;
  heightCm: number;
  weightKg: number;
  goal: GoalId;
  calorieTarget: number;
  proteinTarget: number;
  carbsTarget: number;
  fatTarget: number;
  sugarTarget: number;
  sodiumTarget: number;
  avoidUltra: boolean;
  onboarded: boolean;
};

export type LogBase = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  sugar: number;
};

export type LogItem = {
  id: string;
  date: string;
  createdAt: number;
  name: string;
  detail: string;
  source: "barcode" | "meal" | "manual";
  barcode: string | null;
  score: number | null;
  servings: number;
  base: LogBase;
};

export type RecentScan = {
  code: string;
  name: string;
  brand: string;
  score: number;
  kcal: number | null;
  at: number;
};

export type MealItem = {
  id: string;
  name: string;
  portion: string;
  grams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  factor: number;
};

export const GOAL_LABEL: Record<GoalId, string> = {
  lose: "Lose weight",
  maintain: "Stay steady",
  gain: "Build muscle",
  cleaner: "Eat cleaner",
};
