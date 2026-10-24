import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
import { n as aisleByCode, r as aisleSearch, t as AISLE } from "./catalog-BB2Are5k.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api-CaRfOekY.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var OFF = "https://world.openfoodfacts.org";
var FIELDS = [
	"code",
	"product_name",
	"product_name_en",
	"generic_name",
	"brands",
	"image_front_small_url",
	"image_front_url",
	"nutriscore_grade",
	"nova_group",
	"serving_size",
	"serving_quantity",
	"categories",
	"categories_tags",
	"labels_tags",
	"additives_tags",
	"ingredients_text",
	"ingredients_text_en",
	"ingredients_analysis_tags",
	"nutriments"
].join(",");
var fetchProduct_createServerFn_handler = createServerRpc({
	id: "086b76a3f86f1dd7257b0b65f86f71d1c76d22b6529b5460a48513d921f0d554",
	name: "fetchProduct",
	filename: "src/lib/nara/api.ts"
}, (opts) => fetchProduct.__executeServer(opts));
var fetchProduct = createServerFn({ method: "POST" }).validator((input) => {
	const code = String(input?.code ?? "").replace(/[^\d]/g, "");
	if (code.length < 6 || code.length > 16) throw new Error("Enter a full barcode.");
	return { code };
}).handler(fetchProduct_createServerFn_handler, async ({ data }) => {
	try {
		const res = await fetch(`${OFF}/api/v2/product/${data.code}.json?fields=${FIELDS}`, {
			headers: offHeaders(),
			signal: AbortSignal.timeout(8e3)
		});
		if (res.ok) {
			const body = await res.json();
			if (body.status === 1 && body.product) {
				const product = normalizeOff(body.product, data.code);
				if (product) return {
					ok: true,
					product
				};
			}
		}
	} catch {
		const local = aisleByCode(data.code);
		if (local) return {
			ok: true,
			product: local
		};
		return {
			ok: false,
			kind: "offline",
			error: "The food database didn't respond."
		};
	}
	const local = aisleByCode(data.code);
	if (local) return {
		ok: true,
		product: local
	};
	return {
		ok: false,
		kind: "not_found",
		error: "No product for that barcode."
	};
});
var searchFoods_createServerFn_handler = createServerRpc({
	id: "93f06d2c72a969fb27a5b9ff774a2616e038965a5d3c6bc93bc06c7ee22f44a7",
	name: "searchFoods",
	filename: "src/lib/nara/api.ts"
}, (opts) => searchFoods.__executeServer(opts));
var searchFoods = createServerFn({ method: "POST" }).validator((input) => {
	const query = String(input?.query ?? "").trim().slice(0, 60);
	if (query.length < 2) return { query: "" };
	return { query };
}).handler(searchFoods_createServerFn_handler, async ({ data }) => {
	if (!data.query) return {
		ok: true,
		products: [],
		kind: "ok"
	};
	const local = aisleSearch(data.query);
	try {
		const url = `${OFF}/api/v2/search?q=${encodeURIComponent(data.query)}&page_size=12&fields=${FIELDS}`;
		const res = await fetch(url, {
			headers: offHeaders(),
			signal: AbortSignal.timeout(8e3)
		});
		if (!res.ok) return {
			ok: true,
			products: local,
			kind: local.length ? "ok" : "offline"
		};
		return {
			ok: true,
			products: mergeProducts(local, ((await res.json()).products ?? []).map((item) => normalizeOff(item, item.code ?? "")).filter((item) => Boolean(item))).slice(0, 12),
			kind: "ok"
		};
	} catch {
		return {
			ok: local.length > 0,
			products: local,
			kind: "offline"
		};
	}
});
var findAlternatives_createServerFn_handler = createServerRpc({
	id: "9a8387471eec76c8726deddc0352f22e7390f1ceda4853702e3e8591db763252",
	name: "findAlternatives",
	filename: "src/lib/nara/api.ts"
}, (opts) => findAlternatives.__executeServer(opts));
var findAlternatives = createServerFn({ method: "POST" }).validator((input) => ({
	tags: Array.isArray(input?.tags) ? input.tags.map(String).slice(0, 6) : [],
	exclude: String(input?.exclude ?? "")
})).handler(findAlternatives_createServerFn_handler, async ({ data }) => {
	const local = AISLE.filter((item) => item.code !== data.exclude && data.tags.some((tag) => item.categoryTags.includes(tag)));
	const tags = [...data.tags].reverse();
	for (const tag of tags) try {
		const url = `${OFF}/api/v2/search?categories_tags=${encodeURIComponent(tag)}&page_size=20&sort_by=nutriscore_score&fields=${FIELDS}`;
		const res = await fetch(url, {
			headers: offHeaders(),
			signal: AbortSignal.timeout(8e3)
		});
		if (!res.ok) continue;
		const remote = ((await res.json()).products ?? []).map((item) => normalizeOff(item, item.code ?? "")).filter((item) => Boolean(item && item.code !== data.exclude));
		if (remote.length) return {
			ok: true,
			products: mergeProducts(local, remote).slice(0, 16),
			kind: "ok"
		};
	} catch {
		break;
	}
	return {
		ok: true,
		products: local,
		kind: local.length ? "ok" : "offline"
	};
});
var mealAiStatus_createServerFn_handler = createServerRpc({
	id: "1749ef4364ff2cdcb34f31f0cadf85e25ce60a4c68df9268ad5d465844e58636",
	name: "mealAiStatus",
	filename: "src/lib/nara/api.ts"
}, (opts) => mealAiStatus.__executeServer(opts));
var mealAiStatus = createServerFn({ method: "GET" }).handler(mealAiStatus_createServerFn_handler, async () => {
	return { available: Boolean(process.env.GEMINI_API_KEY || process.env.XAI_API_KEY) };
});
var analyzeMeal_createServerFn_handler = createServerRpc({
	id: "181b9e59f296a867a5e5319d20c1fbe91a502cb125597bf42a84eb4d41534525",
	name: "analyzeMeal",
	filename: "src/lib/nara/api.ts"
}, (opts) => analyzeMeal.__executeServer(opts));
var analyzeMeal = createServerFn({ method: "POST" }).validator((input) => {
	const imageDataUrl = String(input?.imageDataUrl ?? "");
	if (!imageDataUrl.startsWith("data:image/")) throw new Error("That photo couldn't be read.");
	if (imageDataUrl.length > 25e5) throw new Error("Photo is too large. Move a little closer and try again.");
	return { imageDataUrl };
}).handler(analyzeMeal_createServerFn_handler, async ({ data }) => {
	const geminiKey = process.env.GEMINI_API_KEY;
	const fallbackKey = process.env.XAI_API_KEY;
	if (!geminiKey && !fallbackKey) return {
		ok: false,
		kind: "unavailable",
		error: "Meal photos need a Gemini key, and it isn't set. Add the foods by hand instead."
	};
	const prompt = "You estimate meals from a photo for a calorie diary. Reply with JSON only, no markdown. Schema: {\"error\":null|\"blurry\"|\"not_food\",\"note\":\"short\",\"items\":[{\"name\":\"string\",\"portion\":\"string\",\"grams\":number,\"calories\":number,\"protein\":number,\"carbs\":number,\"fat\":number}]}. Use realistic home portions. If the photo is not food or too unclear to name foods, set items to [] and error accordingly. Max 8 items. Numbers are for the portion shown, not per 100g.";
	const parsed = geminiKey ? await askGemini(geminiKey, data.imageDataUrl, prompt) : await askVision(fallbackKey, data.imageDataUrl, prompt);
	if (!parsed.ok) return parsed;
	if (parsed.value.error === "blurry" || parsed.value.error === "not_food") return {
		ok: false,
		kind: parsed.value.error,
		error: parsed.value.error === "blurry" ? "That photo is too blurry to read. Retake it in better light, filling the frame with the plate." : "That doesn't look like a meal. Point the camera at the food."
	};
	const items = (parsed.value.items ?? []).map(cleanItem).filter((item) => Boolean(item)).slice(0, 8);
	if (!items.length) return {
		ok: false,
		kind: "blurry",
		error: "Nothing edible stood out in that photo. Try again, or add the meal by hand."
	};
	return {
		ok: true,
		items,
		note: parsed.value.note || "Estimates from the photo. Correct anything that looks off."
	};
});
async function askGemini(apiKey, imageDataUrl, prompt) {
	const match = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/.exec(imageDataUrl);
	if (!match) return {
		ok: false,
		kind: "failed",
		error: "That photo couldn't be read."
	};
	const models = ["gemini-2.5-flash", "gemini-2.0-flash"];
	let lastError = "The meal reader failed.";
	for (const model of models) try {
		const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			signal: AbortSignal.timeout(25e3),
			body: JSON.stringify({
				contents: [{ parts: [{ text: `${prompt} Estimate this meal.` }, { inlineData: {
					mimeType: match[1],
					data: match[2]
				} }] }],
				generationConfig: {
					temperature: .2,
					responseMimeType: "application/json"
				}
			})
		});
		if (!res.ok) {
			lastError = res.status === 401 || res.status === 403 ? "Meal photos are unavailable." : `The meal reader returned ${res.status}.`;
			if (res.status === 400 || res.status === 404) continue;
			return {
				ok: false,
				kind: "failed",
				error: lastError
			};
		}
		const value = parseMealJson((await res.json()).candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("") ?? "");
		if (!value) return {
			ok: false,
			kind: "failed",
			error: "The meal reader replied in a shape Bitewise couldn't use."
		};
		return {
			ok: true,
			value
		};
	} catch {
		lastError = "The meal reader didn't respond. Check your connection and try once more.";
	}
	return {
		ok: false,
		kind: "failed",
		error: lastError
	};
}
async function askVision(apiKey, imageDataUrl, prompt) {
	const models = ["grok-4.5", "grok-4"];
	let lastError = "The meal reader failed.";
	for (const model of models) try {
		const res = await fetch("https://api.x.ai/v1/chat/completions", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${apiKey}`,
				"Content-Type": "application/json"
			},
			signal: AbortSignal.timeout(25e3),
			body: JSON.stringify({
				model,
				temperature: .2,
				max_tokens: 800,
				messages: [{
					role: "system",
					content: prompt
				}, {
					role: "user",
					content: [{
						type: "text",
						text: "Estimate this meal."
					}, {
						type: "image_url",
						image_url: { url: imageDataUrl }
					}]
				}]
			})
		});
		if (!res.ok) {
			lastError = res.status === 401 ? "Meal photos are unavailable." : `The meal reader returned ${res.status}.`;
			if (res.status === 400 || res.status === 404) continue;
			return {
				ok: false,
				kind: "failed",
				error: lastError
			};
		}
		const value = parseMealJson((await res.json()).choices?.[0]?.message?.content ?? "");
		if (!value) return {
			ok: false,
			kind: "failed",
			error: "The meal reader replied in a shape Bitewise couldn't use."
		};
		return {
			ok: true,
			value
		};
	} catch {
		lastError = "The meal reader didn't respond. Check your connection and try once more.";
	}
	return {
		ok: false,
		kind: "failed",
		error: lastError
	};
}
function parseMealJson(text) {
	const trimmed = text.trim().replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/, "");
	try {
		return JSON.parse(trimmed);
	} catch {
		const start = trimmed.indexOf("{");
		const end = trimmed.lastIndexOf("}");
		if (start === -1 || end <= start) return null;
		try {
			return JSON.parse(trimmed.slice(start, end + 1));
		} catch {
			return null;
		}
	}
}
function cleanItem(item) {
	const name = String(item.name ?? "").trim().slice(0, 80);
	if (!name) return null;
	const calories = finite(item.calories, 0, 2500);
	const protein = finite(item.protein, 0, 250);
	const carbs = finite(item.carbs, 0, 400);
	const fat = finite(item.fat, 0, 250);
	return {
		name,
		portion: String(item.portion ?? "1 serving").trim().slice(0, 60) || "1 serving",
		grams: finite(item.grams, 1, 1500),
		calories,
		protein,
		carbs,
		fat
	};
}
function finite(value, min, max) {
	const n = typeof value === "number" ? value : Number(value);
	if (!Number.isFinite(n)) return min;
	return Math.min(max, Math.max(min, Math.round(n * 10) / 10));
}
function offHeaders() {
	return {
		Accept: "application/json",
		"User-Agent": "Bitewise/1.0 (food scanner; educational)"
	};
}
function normalizeOff(raw, fallbackCode) {
	const name = (raw.product_name_en || raw.product_name || raw.generic_name || "").trim();
	const code = String(raw.code || fallbackCode || "").replace(/\s/g, "");
	if (!name || !code) return null;
	const n = raw.nutriments ?? {};
	const per100 = {
		kcal: num(n["energy-kcal_100g"]) ?? (num(n["energy_100g"]) != null ? num(n["energy_100g"]) / 4.184 : 0),
		protein: num(n.proteins_100g) ?? 0,
		carbs: num(n.carbohydrates_100g) ?? 0,
		fat: num(n.fat_100g) ?? 0,
		sugar: num(n.sugars_100g) ?? 0,
		fiber: num(n.fiber_100g) ?? 0,
		salt: num(n.salt_100g) ?? (num(n.sodium_100g) != null ? num(n.sodium_100g) * 2.5 : 0),
		satFat: num(n["saturated-fat_100g"]) ?? 0
	};
	const servingGrams = parseServingGrams(raw);
	const kcalServing = num(n["energy-kcal_serving"]);
	const perServing = servingGrams != null && servingGrams > 0 ? {
		kcal: round(per100.kcal * servingGrams / 100),
		protein: round(per100.protein * servingGrams / 100),
		carbs: round(per100.carbs * servingGrams / 100),
		fat: round(per100.fat * servingGrams / 100),
		sugar: round(per100.sugar * servingGrams / 100),
		salt: round(per100.salt * servingGrams / 100)
	} : kcalServing != null ? {
		kcal: round(kcalServing),
		protein: round(num(n.proteins_serving) ?? 0),
		carbs: round(num(n.carbohydrates_serving) ?? 0),
		fat: round(num(n.fat_serving) ?? 0),
		sugar: round(num(n.sugars_serving) ?? 0),
		salt: round(num(n.salt_serving) ?? 0)
	} : null;
	const grade = (raw.nutriscore_grade ?? "").toLowerCase();
	const nutriscore = [
		"a",
		"b",
		"c",
		"d",
		"e"
	].includes(grade) ? grade : null;
	const nova = raw.nova_group === 1 || raw.nova_group === 2 || raw.nova_group === 3 || raw.nova_group === 4 ? raw.nova_group : null;
	const tags = raw.categories_tags ?? [];
	const category = humanTag(tags[tags.length - 1]) || (raw.categories ? raw.categories.split(",")[0]?.trim() : "") || "Packaged food";
	const flags = (raw.ingredients_analysis_tags ?? []).map((tag) => tag.replace(/^en:/, "")).filter((tag) => tag === "palm-oil" || tag.includes("hydrogenated"));
	const ingredients = raw.ingredients_text_en || raw.ingredients_text || "";
	if (/hydrogenat/i.test(ingredients) && !flags.includes("hydrogenated")) flags.push("hydrogenated");
	return {
		code,
		name,
		brand: (raw.brands ?? "").split(",")[0]?.trim() || "Unknown brand",
		imageUrl: raw.image_front_small_url || raw.image_front_url || null,
		category,
		categoryTag: tags[tags.length - 1] ?? null,
		categoryTags: tags.slice(-4),
		servingSize: raw.serving_size?.trim() || (servingGrams ? `${servingGrams} g` : "100 g"),
		servingGrams,
		per100: {
			kcal: round(per100.kcal),
			protein: round(per100.protein),
			carbs: round(per100.carbs),
			fat: round(per100.fat),
			sugar: round(per100.sugar),
			fiber: round(per100.fiber),
			salt: round(per100.salt),
			satFat: round(per100.satFat)
		},
		perServing: perServing ? {
			kcal: round(perServing.kcal),
			protein: round(perServing.protein),
			carbs: round(perServing.carbs),
			fat: round(perServing.fat),
			sugar: round(perServing.sugar),
			salt: round(perServing.salt)
		} : null,
		nutriscore,
		nova,
		additiveTags: raw.additives_tags ?? [],
		ingredientFlags: flags,
		ingredientsText: ingredients ? ingredients.slice(0, 700) : null,
		organic: (raw.labels_tags ?? []).some((tag) => tag.includes("organic")),
		source: "open-food-facts"
	};
}
function mergeProducts(first, second) {
	const seen = /* @__PURE__ */ new Set();
	const out = [];
	for (const item of [...first, ...second]) {
		if (seen.has(item.code)) continue;
		seen.add(item.code);
		out.push(item);
	}
	return out;
}
function humanTag(tag) {
	if (!tag) return "";
	return tag.replace(/^[a-z]{2}:/, "").replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}
function parseServingGrams(raw) {
	const quantity = num(raw.serving_quantity);
	if (quantity != null && quantity > 0 && quantity <= 1500) return quantity;
	const match = (raw.serving_size ?? "").match(/(\d+(?:[.,]\d+)?)\s*(g|ml)\b/i);
	if (!match) return null;
	const parsed = Number(match[1].replace(",", "."));
	return Number.isFinite(parsed) && parsed > 0 && parsed <= 1500 ? parsed : null;
}
function num(value) {
	if (typeof value === "number" && Number.isFinite(value)) return value;
	if (typeof value === "string" && value.trim() && Number.isFinite(Number(value))) return Number(value);
	return null;
}
function round(n) {
	return Math.round(n * 10) / 10;
}
//#endregion
export { analyzeMeal_createServerFn_handler, fetchProduct_createServerFn_handler, findAlternatives_createServerFn_handler, mealAiStatus_createServerFn_handler, searchFoods_createServerFn_handler };
