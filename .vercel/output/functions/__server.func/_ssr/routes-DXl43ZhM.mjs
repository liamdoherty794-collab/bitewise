import { i as __toESM } from "../_runtime.mjs";
import { b as require_jsx_runtime, q as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { i as featuredProducts, n as aisleByCode, t as AISLE } from "./catalog-BB2Are5k.mjs";
import { a as Target, c as Plus, d as ImagePlus, f as ChartColumn, i as Trash2, l as NotebookPen, n as UserRound, o as Search, p as Camera, s as ScanLine, t as X, u as Minus } from "../_libs/lucide-react.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DXl43ZhM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var fetchProduct = createServerFn({ method: "POST" }).validator((input) => {
	const code = String(input?.code ?? "").replace(/[^\d]/g, "");
	if (code.length < 6 || code.length > 16) throw new Error("Enter a full barcode.");
	return { code };
}).handler(createSsrRpc("086b76a3f86f1dd7257b0b65f86f71d1c76d22b6529b5460a48513d921f0d554"));
var searchFoods = createServerFn({ method: "POST" }).validator((input) => {
	const query = String(input?.query ?? "").trim().slice(0, 60);
	if (query.length < 2) return { query: "" };
	return { query };
}).handler(createSsrRpc("93f06d2c72a969fb27a5b9ff774a2616e038965a5d3c6bc93bc06c7ee22f44a7"));
var findAlternatives = createServerFn({ method: "POST" }).validator((input) => ({
	tags: Array.isArray(input?.tags) ? input.tags.map(String).slice(0, 6) : [],
	exclude: String(input?.exclude ?? "")
})).handler(createSsrRpc("9a8387471eec76c8726deddc0352f22e7390f1ceda4853702e3e8591db763252"));
createServerFn({ method: "GET" }).handler(createSsrRpc("1749ef4364ff2cdcb34f31f0cadf85e25ce60a4c68df9268ad5d465844e58636"));
var analyzeMeal = createServerFn({ method: "POST" }).validator((input) => {
	const imageDataUrl = String(input?.imageDataUrl ?? "");
	if (!imageDataUrl.startsWith("data:image/")) throw new Error("That photo couldn't be read.");
	if (imageDataUrl.length > 25e5) throw new Error("Photo is too large. Move a little closer and try again.");
	return { imageDataUrl };
}).handler(createSsrRpc("181b9e59f296a867a5e5319d20c1fbe91a502cb125597bf42a84eb4d41534525"));
var GOAL_LABEL = {
	lose: "Lose weight",
	maintain: "Stay steady",
	gain: "Build muscle",
	cleaner: "Eat cleaner"
};
function dateKey(d = /* @__PURE__ */ new Date()) {
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function recommendedTargets(input) {
	const age = clamp$2(input.age, 16, 90);
	const heightCm = clamp$2(input.heightCm, 120, 230);
	const base = 10 * clamp$2(input.weightKg, 35, 250) + 6.25 * heightCm - 5 * age;
	const bmr = input.sex === "female" ? base - 161 : input.sex === "male" ? base + 5 : base - 78;
	const tdee = bmr * 1.45;
	const delta = input.goal === "lose" ? -450 : input.goal === "gain" ? 300 : input.goal === "cleaner" ? -200 : 0;
	const calories = Math.round(clamp$2(tdee + delta, 1400, 4200) / 10) * 10;
	const split = {
		lose: {
			p: .32,
			c: .38,
			f: .3
		},
		maintain: {
			p: .25,
			c: .45,
			f: .3
		},
		gain: {
			p: .28,
			c: .47,
			f: .25
		},
		cleaner: {
			p: .28,
			c: .42,
			f: .3
		}
	}[input.goal];
	return {
		calorieTarget: calories,
		proteinTarget: Math.round(calories * split.p / 4),
		carbsTarget: Math.round(calories * split.c / 4),
		fatTarget: Math.round(calories * split.f / 9),
		sugarTarget: input.goal === "cleaner" ? 25 : input.goal === "lose" ? 35 : input.goal === "gain" ? 55 : 45,
		sodiumTarget: input.goal === "cleaner" ? 1800 : 2300,
		avoidUltra: input.goal !== "gain",
		bmr: Math.round(bmr),
		tdee: Math.round(tdee)
	};
}
function emptyProfile() {
	return {
		age: 32,
		sex: "female",
		heightCm: 168,
		weightKg: 68,
		goal: "lose",
		calorieTarget: 1800,
		proteinTarget: 140,
		carbsTarget: 170,
		fatTarget: 60,
		sugarTarget: 35,
		sodiumTarget: 2300,
		avoidUltra: true,
		onboarded: false
	};
}
function servingOf(product, servings) {
	const base = product.perServing ?? {
		kcal: product.per100.kcal,
		protein: product.per100.protein,
		carbs: product.per100.carbs,
		fat: product.per100.fat,
		sugar: product.per100.sugar,
		salt: product.per100.salt
	};
	const m = servings;
	return {
		kcal: round1$1(base.kcal * m),
		protein: round1$1(base.protein * m),
		carbs: round1$1(base.carbs * m),
		fat: round1$1(base.fat * m),
		sugar: round1$1(base.sugar * m),
		salt: round1$1(base.salt * m)
	};
}
function logScaled(item) {
	const m = item.servings;
	return {
		kcal: round1$1(item.base.calories * m),
		protein: round1$1(item.base.protein * m),
		carbs: round1$1(item.base.carbs * m),
		fat: round1$1(item.base.fat * m),
		sugar: round1$1(item.base.sugar * m),
		salt: 0
	};
}
function sumLogs(items) {
	return items.reduce((acc, item) => {
		const s = logScaled(item);
		acc.kcal += s.kcal;
		acc.protein += s.protein;
		acc.carbs += s.carbs;
		acc.fat += s.fat;
		acc.sugar += s.sugar;
		return acc;
	}, {
		kcal: 0,
		protein: 0,
		carbs: 0,
		fat: 0,
		sugar: 0
	});
}
function assessFit(args) {
	const { product, score, profile, eatenKcal, servings } = args;
	const portion = servingOf(product, servings);
	const remaining = Math.max(0, profile.calorieTarget - eatenKcal);
	const budget = remaining > 0 ? remaining : profile.calorieTarget;
	const budgetLabel = remaining > 0 ? "left today" : "daily target";
	const kcalPct = budget > 0 ? Math.round(portion.kcal / budget * 100) : 0;
	const sugarPct = profile.sugarTarget > 0 ? Math.round(portion.sugar / profile.sugarTarget * 100) : 0;
	const reasons = [`${Math.round(portion.kcal)} kcal — ${kcalPct}% of what you have ${budgetLabel} (${Math.round(budget)} kcal).`];
	if (portion.sugar >= 1) reasons.push(`${trim$1(portion.sugar)}g sugar — ${sugarPct}% of your ${profile.sugarTarget}g sugar budget.`);
	if (product.nova === 4 && profile.avoidUltra) reasons.push("Ultra-processed. You asked Bitewise to flag these.");
	if ((profile.goal === "lose" || profile.goal === "gain") && portion.protein < 8 && portion.kcal > 90) reasons.push("Light on protein for this goal.");
	else if (portion.protein >= 12 && score.score >= 67) reasons.push(`${trim$1(portion.protein)}g protein. That earns its place.`);
	let verdict = "fits";
	if (score.extreme || score.score < 34) verdict = "against";
	else if (sugarPct >= 50 || kcalPct >= 55) verdict = "against";
	else if (score.score < 67 || sugarPct >= 30 || kcalPct >= 35 || product.nova === 4 && profile.avoidUltra) verdict = "tight";
	if (verdict === "fits" && profile.goal === "cleaner" && product.nova === 4) verdict = "tight";
	const title = verdict === "fits" ? `Fits “${GOAL_LABEL[profile.goal].toLowerCase()}”` : verdict === "tight" ? "A tight fit today" : "Works against your goals";
	return {
		verdict,
		title,
		reasons: reasons.slice(0, 4)
	};
}
function weekSeries(logs, today = /* @__PURE__ */ new Date()) {
	const days = [];
	for (let i = 6; i >= 0; i--) {
		const d = new Date(today);
		d.setHours(12, 0, 0, 0);
		d.setDate(d.getDate() - i);
		const key = dateKey(d);
		const kcal = Math.round(sumLogs(logs.filter((item) => item.date === key)).kcal);
		days.push({
			key,
			label: d.toLocaleDateString(void 0, { weekday: "narrow" }),
			name: d.toLocaleDateString(void 0, {
				weekday: "short",
				day: "numeric"
			}),
			calories: kcal
		});
	}
	return days;
}
function round1$1(n) {
	return Math.round(n * 10) / 10;
}
function trim$1(n) {
	return Number.isInteger(n) ? String(n) : n.toFixed(1);
}
function clamp$2(n, min, max) {
	return Math.max(min, Math.min(max, n));
}
/** Free is the whole app. Pro, later, only raises the meal-photo cap. */
var PHOTO_LIMIT = {
	free: 3,
	pro: Number.POSITIVE_INFINITY
};
function currentPlan() {
	try {
		return localStorage.getItem("bitewise-plan") === "pro" ? "pro" : "free";
	} catch {
		return "free";
	}
}
function photoLimit(plan = currentPlan()) {
	return PHOTO_LIMIT[plan];
}
var KEY = "bitewise-photo-scans";
function photoScanStatus() {
	const plan = currentPlan();
	const limit = photoLimit(plan);
	const used = scansToday();
	return {
		plan,
		limit,
		used,
		remaining: Number.isFinite(limit) ? Math.max(0, limit - used) : null
	};
}
function canScanPhoto() {
	if (photoScanStatus().remaining === 0) return {
		ok: false,
		message: "You've used today's 3 meal photos. Barcodes, search, and typing a meal still work. Photos reset tomorrow."
	};
	return { ok: true };
}
function recordPhotoScan() {
	const next = {
		date: dateKey(),
		count: scansToday() + 1
	};
	try {
		localStorage.setItem(KEY, JSON.stringify(next));
	} catch {}
	return next.count;
}
function scansToday() {
	try {
		const raw = localStorage.getItem(KEY);
		if (!raw) return 0;
		const parsed = JSON.parse(raw);
		if (parsed.date !== dateKey()) return 0;
		const count = Number(parsed.count);
		return Number.isFinite(count) && count > 0 ? count : 0;
	} catch {
		return 0;
	}
}
var DB = {
	e102: {
		code: "e102",
		name: "Tartrazine",
		level: "high",
		why: "A yellow dye linked to hyperactivity in some children. Banned or restricted in several countries."
	},
	e104: {
		code: "e104",
		name: "Quinoline yellow",
		level: "high",
		why: "A synthetic dye associated with hyperactivity. Not allowed in food in the US."
	},
	e110: {
		code: "e110",
		name: "Sunset yellow",
		level: "high",
		why: "An azo dye that can trigger hyperactivity and reactions in sensitive people."
	},
	e122: {
		code: "e122",
		name: "Carmoisine",
		level: "high",
		why: "A red azo dye linked to hyperactivity. Restricted in several countries."
	},
	e124: {
		code: "e124",
		name: "Ponceau 4R",
		level: "high",
		why: "A synthetic red dye associated with hyperactivity and allergic reactions."
	},
	e129: {
		code: "e129",
		name: "Allura red",
		level: "high",
		why: "A common red dye. Some studies link it to hyperactivity in children."
	},
	e133: {
		code: "e133",
		name: "Brilliant blue",
		level: "moderate",
		why: "A synthetic blue dye. Mostly a marker of heavy colouring, with mixed safety data."
	},
	e150d: {
		code: "e150d",
		name: "Sulphite ammonia caramel",
		level: "moderate",
		why: "The dark colour in many colas. The harsh version of caramel colour, made with sulphites and ammonia."
	},
	e171: {
		code: "e171",
		name: "Titanium dioxide",
		level: "high",
		why: "A white colour banned in the EU as a food additive over genotoxicity concerns."
	},
	e211: {
		code: "e211",
		name: "Sodium benzoate",
		level: "moderate",
		why: "A preservative. With vitamin C it can form benzene, and it bothers some sensitive people."
	},
	e220: {
		code: "e220",
		name: "Sulphur dioxide",
		level: "moderate",
		why: "A preservative that can trigger asthma symptoms in people who are sensitive to sulphites."
	},
	e249: {
		code: "e249",
		name: "Potassium nitrite",
		level: "high",
		why: "A curing salt. Nitrites can form nitrosamines, compounds linked to colorectal cancer risk."
	},
	e250: {
		code: "e250",
		name: "Sodium nitrite",
		level: "high",
		why: "Used to cure meat and keep it pink. Nitrites can form nitrosamines when cooked hot."
	},
	e251: {
		code: "e251",
		name: "Sodium nitrate",
		level: "high",
		why: "A curing agent that converts to nitrite. Same nitrosamine concern as other cured-meat salts."
	},
	e282: {
		code: "e282",
		name: "Calcium propionate",
		level: "moderate",
		why: "A bread preservative. Large amounts have been studied for irritability in some children."
	},
	e320: {
		code: "e320",
		name: "BHA",
		level: "high",
		why: "An antioxidant preservative classed as a possible carcinogen. Used to stop fats going rancid."
	},
	e321: {
		code: "e321",
		name: "BHT",
		level: "high",
		why: "A synthetic preservative with the same possible-carcinogen concern as BHA."
	},
	e338: {
		code: "e338",
		name: "Phosphoric acid",
		level: "moderate",
		why: "Gives cola its bite. Regular high intake is linked with lower bone density and kidney strain."
	},
	e407: {
		code: "e407",
		name: "Carrageenan",
		level: "moderate",
		why: "A seaweed thickener. Degraded forms inflame the gut in animal studies; food-grade evidence is mixed."
	},
	e450: {
		code: "e450",
		name: "Diphosphates",
		level: "moderate",
		why: "Phosphate additives. A high phosphate load is hard on kidneys and is common in ultra-processed food."
	},
	e451: {
		code: "e451",
		name: "Triphosphates",
		level: "moderate",
		why: "Another phosphate additive used to bind water in processed meats and snacks."
	},
	e466: {
		code: "e466",
		name: "Carboxymethylcellulose",
		level: "moderate",
		why: "A thickener. Some research links it to disruption of the gut lining and microbiome."
	},
	e476: {
		code: "e476",
		name: "PGPR",
		level: "moderate",
		why: "A cheap emulsifier that lets manufacturers use less cocoa butter in chocolate spreads."
	},
	e621: {
		code: "e621",
		name: "Monosodium glutamate",
		level: "moderate",
		why: "A flavour enhancer. Safe for most people, but a known trigger for headaches in some."
	},
	e950: {
		code: "e950",
		name: "Acesulfame K",
		level: "moderate",
		why: "An artificial sweetener. It keeps calories down but doesn't train a preference for less sweet food."
	},
	e951: {
		code: "e951",
		name: "Aspartame",
		level: "moderate",
		why: "An artificial sweetener. Avoid it if you have PKU. Evidence of harm at normal doses is contested."
	},
	e955: {
		code: "e955",
		name: "Sucralose",
		level: "moderate",
		why: "An artificial sweetener. It cuts sugar but may alter gut bacteria and keep a sweet tooth intact."
	},
	e300: {
		code: "e300",
		name: "Vitamin C",
		level: "low",
		why: "Ascorbic acid. Used to keep colour and stop oxidation. Not a concern."
	},
	e322: {
		code: "e322",
		name: "Lecithin",
		level: "low",
		why: "An emulsifier, usually from soy or sunflower. Generally unremarkable on its own."
	},
	e330: {
		code: "e330",
		name: "Citric acid",
		level: "low",
		why: "An acid found in citrus, used for tang and freshness. Not a concern."
	},
	e440: {
		code: "e440",
		name: "Pectin",
		level: "low",
		why: "A fruit fibre used to set jams. Not a concern."
	},
	e160a: {
		code: "e160a",
		name: "Carotene",
		level: "low",
		why: "A colour from plants, related to vitamin A. Not a concern."
	}
};
var FLAG_INFO = {
	"palm-oil": {
		name: "Palm oil",
		level: "moderate",
		why: "A cheap saturated fat. The nutrition score already counts the saturated fat; this flags how processed the recipe is."
	},
	hydrogenated: {
		name: "Hydrogenated oil",
		level: "high",
		why: "Industrial hardening of oil. Fully or partially hydrogenated fats are a stand-in for ultra-processing and, historically, trans fat."
	}
};
function normalizeAdditiveCode(tag) {
	const raw = tag.toLowerCase().replace(/^en:/, "").replace(/[^a-z0-9]/g, "");
	const match = raw.match(/e?\d{3,4}/);
	if (!match) return raw;
	return match[0].startsWith("e") ? match[0] : `e${match[0]}`;
}
function lookupAdditive(tag) {
	return DB[normalizeAdditiveCode(tag)] ?? null;
}
function scoreAdditives(tags, flags) {
	let penalty = 0;
	const problems = [];
	const seen = /* @__PURE__ */ new Set();
	for (const tag of tags) {
		const info = lookupAdditive(tag);
		if (!info || info.level === "low" || seen.has(info.code)) continue;
		seen.add(info.code);
		penalty += info.level === "high" ? 18 : 9;
		problems.push({
			name: info.name,
			level: info.level,
			why: info.why
		});
	}
	if (flags.includes("hydrogenated") && !seen.has("hydrogenated")) {
		penalty += 12;
		const info = FLAG_INFO.hydrogenated;
		if (info) problems.push(info);
	}
	if (flags.includes("palm-oil")) {
		const info = FLAG_INFO["palm-oil"];
		if (info) problems.push(info);
	}
	const unknown = tags.filter((tag) => !lookupAdditive(tag)).length;
	penalty += Math.min(6, unknown);
	problems.sort((a, b) => a.level === b.level ? 0 : a.level === "high" ? -1 : 1);
	return {
		score: clamp$1(100 - penalty),
		problems,
		unknown
	};
}
function clamp$1(n) {
	return Math.max(0, Math.min(100, Math.round(n)));
}
var GRADE_SCORE = {
	a: 92,
	b: 75,
	c: 50,
	d: 28,
	e: 8
};
var NOVA_SCORE = {
	1: 100,
	2: 78,
	3: 48,
	4: 18
};
var NOVA_COPY = {
	1: "NOVA 1 — unprocessed or minimally processed.",
	2: "NOVA 2 — a culinary ingredient like oil, sugar or salt.",
	3: "NOVA 3 — processed. Real food, plus salt, oil or sugar.",
	4: "NOVA 4 — ultra-processed. An industrial recipe, not a kitchen one."
};
function scoreProduct(product) {
	const nutrition = nutritionScore(product);
	const processing = product.nova ? NOVA_SCORE[product.nova] : 55;
	const additive = scoreAdditives(product.additiveTags, product.ingredientFlags);
	const score = clamp(.65 * nutrition.value + .2 * processing + .15 * additive.score);
	const sugarBomb = product.per100.sugar >= 15 || product.per100.satFat >= 8;
	const processed = product.nova === 3 || product.nova === 4;
	const extreme = score < 28 || score < 40 && processed && sugarBomb;
	const band = scoreBand(score, extreme);
	const label = extreme ? "Extremely unhealthy" : score >= 80 ? "Excellent" : score >= 67 ? "Good" : score >= 50 ? "Mediocre" : score >= 34 ? "Poor" : "Bad";
	const flagged = additive.problems.filter((item) => item.level === "high" || item.level === "moderate");
	return {
		score,
		band,
		label,
		extreme,
		parts: {
			nutrition: nutrition.value,
			processing,
			additives: additive.score,
			nutritionDetail: nutrition.detail,
			processingDetail: product.nova ? NOVA_COPY[product.nova] : "Processing level isn't listed, so it isn't rewarded or punished.",
			additivesDetail: flagged.length === 0 ? additive.unknown ? "Additives are listed, but none Bitewise treats as a red flag." : "No concerning additives listed." : `${flagged.length} ingredient${flagged.length === 1 ? "" : "s"} worth a second look.`
		},
		problems: flagged.slice(0, 8)
	};
}
function scoreBand(score, extreme = false) {
	if (extreme || score < 34) return "red";
	if (score < 67) return "orange";
	return "green";
}
function nutritionScore(product) {
	if (product.nutriscore) {
		const grade = product.nutriscore.toUpperCase();
		return {
			value: GRADE_SCORE[product.nutriscore],
			detail: `Nutri-Score ${grade} — the label's own grade for nutrition per 100g.`
		};
	}
	return {
		value: estimateNutrition(product),
		detail: "No Nutri-Score on file. Estimated from sugar, saturated fat, salt, fibre and protein per 100g."
	};
}
function estimateNutrition(product) {
	const n = product.per100;
	let score = 48;
	if (n.sugar <= 5) score += 18;
	else if (n.sugar <= 10) score += 8;
	else if (n.sugar <= 15) score += 0;
	else if (n.sugar <= 22.5) score -= 16;
	else score -= 30;
	if (n.satFat <= 1.5) score += 12;
	else if (n.satFat <= 5) score -= 4;
	else score -= 18;
	if (n.salt <= .3) score += 10;
	else if (n.salt > 1.5) score -= 16;
	if (n.fiber >= 6) score += 12;
	else if (n.fiber >= 3) score += 6;
	if (n.protein >= 12) score += 10;
	else if (n.protein >= 6) score += 5;
	if (n.kcal >= 500) score -= 10;
	else if (n.kcal >= 400) score -= 4;
	return clamp(score);
}
function clamp(n) {
	return Math.max(0, Math.min(100, Math.round(n)));
}
function bandClasses(band) {
	if (band === "green") return {
		text: "text-forest",
		bg: "bg-fresh",
		soft: "bg-moss",
		stroke: "stroke-fresh"
	};
	if (band === "orange") return {
		text: "text-amber",
		bg: "bg-amber",
		soft: "bg-amber-soft",
		stroke: "stroke-amber"
	};
	return {
		text: "text-clay",
		bg: "bg-clay",
		soft: "bg-clay-soft",
		stroke: "stroke-clay"
	};
}
var useNara = create()(persist((set) => ({
	profile: emptyProfile(),
	logs: [],
	recents: [],
	setProfile: (profile) => set({ profile }),
	addLog: (input) => set((state) => ({ logs: [{
		id: uid(),
		date: input.date ?? dateKey(),
		createdAt: Date.now(),
		name: input.name,
		detail: input.detail,
		source: input.source,
		barcode: input.barcode,
		score: input.score,
		servings: input.servings,
		base: input.base
	}, ...state.logs].slice(0, 400) })),
	setServings: (id, servings) => set((state) => ({ logs: state.logs.map((item) => item.id === id ? {
		...item,
		servings: Math.max(.25, Math.min(8, servings))
	} : item) })),
	removeLog: (id) => set((state) => ({ logs: state.logs.filter((item) => item.id !== id) })),
	rememberScan: (scan) => set((state) => ({ recents: [{
		...scan,
		at: Date.now()
	}, ...state.recents.filter((item) => item.code !== scan.code)].slice(0, 12) })),
	resetAll: () => set({
		profile: emptyProfile(),
		logs: [],
		recents: []
	})
}), {
	name: "nara-v1",
	skipHydration: true,
	partialize: (state) => ({
		profile: state.profile,
		logs: state.logs,
		recents: state.recents
	})
}));
function uid() {
	return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}
function Logo({ className = "h-16 w-16" }) {
	const id = (0, import_react.useId)().replace(/:/g, "");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 80 80",
		className,
		role: "img",
		"aria-label": "Bitewise",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
				id,
				x1: "8",
				y1: "6",
				x2: "72",
				y2: "76",
				gradientUnits: "userSpaceOnUse",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", { stopColor: "#2ECC71" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
					offset: "1",
					stopColor: "#1B5E20"
				})]
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				width: "80",
				height: "80",
				rx: "22",
				fill: `url(#${id})`
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
				fill: "#F7FAF5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: "40",
						cy: "19.5",
						r: "6.4"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M31.5 28.5h17c2.2 0 3.5 1.6 3.5 4.2v9.2c0 2.2-1.2 3.8-3.2 3.8h-17.6c-2 0-3.2-1.6-3.2-3.8v-9.2c0-2.6 1.3-4.2 3.5-4.2z" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M32 32.5C25.2 34 19.2 39.2 17.2 45.2c-.5 1.4.7 2.6 2 2.1 4.2-1.6 7.6-5.2 11.2-8.2 1-.8 1.4-2.4.2-3.2-.2-.1-.4-.2-.6-.4z" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M48 32.5c6.8 1.5 12.8 6.7 14.8 12.7.5 1.4-.7 2.6-2 2.1-4.2-1.6-7.6-5.2-11.2-8.2-1-.8-1.4-2.4-.2-3.2.2-.1.4-.2.6-.4z" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M33.2 45.2c-.8 5.4-2 10.2-3.2 14.2-.4 1.3.6 2.5 1.9 2.5h3.2c1.1 0 1.8-.8 2-1.8.7-4.2 1.2-9.2 1.4-14.9z" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M46.8 45.2c.8 5.4 2 10.2 3.2 14.2.4 1.3-.6 2.5-1.9 2.5h-3.2c-1.1 0-1.8-.8-2-1.8-.7-4.2-1.2-9.2-1.4-14.9z" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M61.5 36.2c4.2-6.2 9.4-6 11.2-1.4-4.4.8-7.6 3.8-11 7.6.2-2.2.2-4.2-.2-6.2z" })
				]
			})
		]
	});
}
function MealSheet({ items, note, onChange, onClose, onSave }) {
	const totals = items.reduce((acc, item) => {
		acc.calories += item.calories * item.factor;
		acc.protein += item.protein * item.factor;
		acc.carbs += item.carbs * item.factor;
		acc.fat += item.fat * item.factor;
		return acc;
	}, {
		calories: 0,
		protein: 0,
		carbs: 0,
		fat: 0
	});
	function update(id, patch) {
		onChange(items.map((item) => item.id === id ? {
			...item,
			...patch
		} : item));
	}
	function setMacro(item, key, next) {
		const value = Number.isFinite(next) ? Math.max(0, next) : 0;
		update(item.id, {
			grams: item.grams * item.factor,
			calories: key === "calories" ? value : item.calories * item.factor,
			protein: key === "protein" ? value : item.protein * item.factor,
			carbs: key === "carbs" ? value : item.carbs * item.factor,
			fat: key === "fat" ? value : item.fat * item.factor,
			factor: 1
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "scrim fixed inset-0 z-40 flex justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "sheet-in flex h-full w-full max-w-md flex-col bg-paper",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-3xl",
						children: "This meal"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "press rounded-full px-3 py-2 text-sm font-medium text-muted",
						onClick: onClose,
						children: "Close"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-h-0 flex-1 overflow-y-auto px-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: note
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 grid grid-cols-4 gap-2 text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini$1, {
									label: "Kcal",
									value: String(Math.round(totals.calories))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini$1, {
									label: "Protein",
									value: `${Math.round(totals.protein)}g`
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini$1, {
									label: "Carbs",
									value: `${Math.round(totals.carbs)}g`
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini$1, {
									label: "Fat",
									value: `${Math.round(totals.fat)}g`
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-4 space-y-3",
							children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "rounded-3xl border border-line bg-surface p-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											value: item.name,
											onChange: (event) => update(item.id, { name: event.target.value }),
											className: "min-w-0 flex-1 bg-transparent font-semibold outline-none",
											"aria-label": "Food name"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											className: "press text-muted",
											"aria-label": `Remove ${item.name}`,
											onClick: () => onChange(items.filter((row) => row.id !== item.id)),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-sm text-muted",
										children: [item.portion, item.grams ? ` · ${Math.round(item.grams * item.factor)}g` : ""]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-3 flex items-center gap-1 rounded-full bg-moss p-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												className: "press grid h-10 w-10 place-items-center",
												"aria-label": "Smaller portion",
												onClick: () => update(item.id, { factor: Math.max(.25, round$1(item.factor - .25)) }),
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "h-4 w-4" })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "w-12 text-center text-sm font-semibold tabular-nums",
												children: [item.factor, "×"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												className: "press grid h-10 w-10 place-items-center",
												"aria-label": "Larger portion",
												onClick: () => update(item.id, { factor: Math.min(4, round$1(item.factor + .25)) }),
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" })
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-3 grid grid-cols-4 gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MacroField, {
												label: "kcal",
												value: Math.round(item.calories * item.factor),
												onChange: (next) => setMacro(item, "calories", next)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MacroField, {
												label: "protein",
												value: round1(item.protein * item.factor),
												onChange: (next) => setMacro(item, "protein", next)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MacroField, {
												label: "carbs",
												value: round1(item.carbs * item.factor),
												onChange: (next) => setMacro(item, "carbs", next)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MacroField, {
												label: "fat",
												value: round1(item.fat * item.factor),
												onChange: (next) => setMacro(item, "fat", next)
											})
										]
									})
								]
							}, item.id))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "press mt-3 w-full rounded-2xl border border-dashed border-line py-3 text-sm font-medium text-muted",
							onClick: () => onChange([...items, {
								id: Math.random().toString(36).slice(2, 8),
								name: "Something else",
								portion: "1 serving",
								grams: 0,
								calories: 100,
								protein: 0,
								carbs: 0,
								fat: 0,
								factor: 1
							}]),
							children: "Add a food"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "tabbar-pad border-t border-line px-4 pt-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "press w-full rounded-full bg-fresh py-4 font-semibold text-[#222] disabled:opacity-40",
						disabled: !items.some((item) => item.name.trim()),
						onClick: onSave,
						children: "Save to today"
					})
				})
			]
		})
	});
}
function blankMeal() {
	return [{
		id: "manual",
		name: "",
		portion: "your estimate",
		grams: 0,
		calories: 0,
		protein: 0,
		carbs: 0,
		fat: 0,
		factor: 1
	}];
}
function Mini$1({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl bg-moss px-1 py-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-semibold tabular-nums",
			children: value
		})]
	});
}
function MacroField({ label, value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "text-xs text-muted",
		children: [label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			inputMode: "decimal",
			value: Number.isFinite(value) ? value : "",
			onChange: (event) => onChange(Number(event.target.value)),
			className: "mt-1 w-full rounded-xl bg-moss px-2 py-2 text-base font-semibold tabular-nums text-ink outline-none",
			"aria-label": label
		})]
	});
}
function round1(n) {
	return Math.round(n * 10) / 10;
}
function round$1(n) {
	return Math.round(n * 4) / 4;
}
var GOALS = [
	{
		id: "lose",
		title: "Lose weight",
		copy: "A smaller day, with protein kept high."
	},
	{
		id: "maintain",
		title: "Stay steady",
		copy: "Hold your weight without drifting."
	},
	{
		id: "gain",
		title: "Build muscle",
		copy: "More food, aimed at protein."
	},
	{
		id: "cleaner",
		title: "Eat cleaner",
		copy: "Fewer ultra-processed foods, less sugar."
	}
];
function Onboarding() {
	const setProfile = useNara((state) => state.setProfile);
	const [step, setStep] = (0, import_react.useState)(0);
	const [age, setAge] = (0, import_react.useState)(32);
	const [sex, setSex] = (0, import_react.useState)("female");
	const [heightCm, setHeightCm] = (0, import_react.useState)(168);
	const [weightKg, setWeightKg] = (0, import_react.useState)(68);
	const [goal, setGoal] = (0, import_react.useState)("lose");
	const [metric, setMetric] = (0, import_react.useState)(true);
	const targets = (0, import_react.useMemo)(() => recommendedTargets({
		age,
		sex,
		heightCm,
		weightKg,
		goal
	}), [
		age,
		sex,
		heightCm,
		weightKg,
		goal
	]);
	if (step === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Frame, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, { className: "h-16 w-16" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mt-4 font-display text-4xl font-extrabold text-ink",
			children: "See the food, not the marketing."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-4 text-lg text-muted",
			children: "Scan a package or a plate. Bitewise shows the calories, whether it is extremely unhealthy, and if it fits the goal you set."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
			className: "mt-8 space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Point, {
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanLine, { className: "h-5 w-5" }),
					title: "A plain score",
					children: "0–100 from Nutri-Score, how processed it is, and the additives."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Point, {
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "h-5 w-5" }),
					title: "The plate, too",
					children: "Photograph a meal when it doesn't have a barcode. Three photo reads a day, free."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Point, {
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, { className: "h-5 w-5" }),
					title: "Your day",
					children: "Log it against the calories and macros you actually want."
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-auto pt-8",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primary, {
				onClick: () => setStep(1),
				children: "Set my goals"
			})
		})
	] });
	if (step === 1) {
		const feet = Math.floor(heightCm / 2.54 / 12);
		const inches = Math.round(heightCm / 2.54 - feet * 12);
		const pounds = Math.round(weightKg * 2.20462);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Frame, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepLabel, { n: 1 }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-4xl",
				children: "About you"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-muted",
				children: "Used once, to estimate a daily calorie target. Saved on this phone only."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 flex justify-end",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "press text-sm font-medium text-forest",
					onClick: () => setMetric((value) => !value),
					children: metric ? "Use feet and pounds" : "Use cm and kg"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "mt-2 block text-sm font-medium",
				children: ["Age", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: "mt-1 w-full rounded-2xl border border-line bg-surface px-4 py-3 text-lg tabular-nums",
					inputMode: "numeric",
					value: age,
					onChange: (event) => setAge(Number(event.target.value) || 0)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm font-medium",
				children: "Sex"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 grid grid-cols-3 gap-2",
				children: [
					"female",
					"male",
					"other"
				].map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: `press rounded-2xl border px-2 py-3 text-sm font-medium capitalize ${sex === option ? "border-forest bg-moss text-ink" : "border-line bg-surface text-muted"}`,
					onClick: () => setSex(option),
					children: option
				}, option))
			}),
			metric ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid grid-cols-2 gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Height (cm)",
					value: heightCm,
					onChange: setHeightCm
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Weight (kg)",
					value: weightKg,
					onChange: setWeightKg
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid grid-cols-3 gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Feet",
						value: feet,
						onChange: (next) => setHeightCm(Math.round((next * 12 + inches) * 2.54))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Inches",
						value: inches,
						onChange: (next) => setHeightCm(Math.round((feet * 12 + next) * 2.54))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Pounds",
						value: pounds,
						onChange: (next) => setWeightKg(Math.round(next / 2.20462 * 10) / 10)
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-auto flex gap-2 pt-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Secondary, {
					onClick: () => setStep(0),
					children: "Back"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primary, {
					onClick: () => setStep(2),
					children: "Continue"
				})]
			})
		] });
	}
	if (step === 2) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Frame, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepLabel, { n: 2 }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mt-2 font-display text-4xl",
			children: "What are you aiming for?"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6 grid gap-3",
			children: GOALS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: `press rounded-3xl border px-4 py-4 text-left ${goal === item.id ? "border-forest bg-moss" : "border-line bg-surface"}`,
				onClick: () => setGoal(item.id),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block font-semibold",
					children: item.title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mt-1 block text-sm text-muted",
					children: item.copy
				})]
			}, item.id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-auto flex gap-2 pt-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Secondary, {
				onClick: () => setStep(1),
				children: "Back"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primary, {
				onClick: () => setStep(3),
				children: "See my day"
			})]
		})
	] });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Frame, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepLabel, { n: 3 }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mt-2 font-display text-4xl",
			children: "Your day"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-2 text-muted",
			children: [GOAL_LABEL[goal], ". Estimated for a lightly active day — not medical advice. Change it any time in Profile."]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "card mt-6 rounded-3xl px-5 py-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium text-muted",
					children: "Calories"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-6xl tabular-nums text-forest",
					children: targets.calorieTarget.toLocaleString()
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 grid grid-cols-3 gap-3 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Protein",
							value: `${targets.proteinTarget}g`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Carbs",
							value: `${targets.carbsTarget}g`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Fat",
							value: `${targets.fatTarget}g`
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-4 text-sm text-muted",
					children: [
						"Sugar budget ",
						targets.sugarTarget,
						"g · sodium ",
						targets.sodiumTarget.toLocaleString(),
						"mg",
						targets.avoidUltra ? " · ultra-processed foods get flagged." : "."
					]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-auto flex gap-2 pt-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Secondary, {
				onClick: () => setStep(2),
				children: "Back"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primary, {
				onClick: () => setProfile({
					age,
					sex,
					heightCm,
					weightKg,
					goal,
					calorieTarget: targets.calorieTarget,
					proteinTarget: targets.proteinTarget,
					carbsTarget: targets.carbsTarget,
					fatTarget: targets.fatTarget,
					sugarTarget: targets.sugarTarget,
					sodiumTarget: targets.sodiumTarget,
					avoidUltra: targets.avoidUltra,
					onboarded: true
				}),
				children: "Start scanning"
			})]
		})
	] });
}
function Frame({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 py-8",
		children
	});
}
function Point({ icon, title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "flex gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-moss text-forest",
			children: icon
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "block font-semibold",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "block text-sm text-muted",
			children
		})] })]
	});
}
function Field({ label, value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block text-sm font-medium",
		children: [label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			className: "mt-1 w-full rounded-2xl border border-line bg-surface px-3 py-3 text-lg tabular-nums",
			inputMode: "decimal",
			value: Number.isFinite(value) ? value : "",
			onChange: (event) => onChange(Number(event.target.value))
		})]
	});
}
function Stat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-muted",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-lg font-semibold tabular-nums",
		children: value
	})] });
}
function StepLabel({ n }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: "text-sm font-semibold tracking-widest text-forest",
		children: [
			"STEP ",
			n,
			" OF 3"
		]
	});
}
function Primary({ children, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		className: "press flex-1 rounded-full bg-fresh px-5 py-4 text-base font-semibold text-[#222]",
		onClick,
		children
	});
}
function Secondary({ children, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		className: "press rounded-full bg-moss px-5 py-4 font-semibold text-ink",
		onClick,
		children
	});
}
function Ring({ value, max, band, children }) {
	const r = 52;
	const c = 2 * Math.PI * r;
	const [drawn, setDrawn] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setDrawn(false);
		const id = requestAnimationFrame(() => setDrawn(true));
		return () => cancelAnimationFrame(id);
	}, [
		value,
		max,
		band
	]);
	const ratio = drawn && max > 0 ? Math.max(0, Math.min(1, value / max)) : 0;
	const tone = bandClasses(band);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative grid h-36 w-36 place-items-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 140 140",
			className: "absolute h-36 w-36",
			"aria-hidden": "true",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "70",
				cy: "70",
				r,
				fill: "none",
				className: "stroke-line",
				strokeWidth: "10"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "70",
				cy: "70",
				r,
				fill: "none",
				className: `score-arc ${tone.stroke}`,
				strokeWidth: "10",
				strokeLinecap: "round",
				strokeDasharray: c,
				strokeDashoffset: c * (1 - ratio),
				transform: "rotate(-90 70 70)"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "relative text-center",
			children
		})]
	});
}
function MacroBar({ label, value, max, unit }) {
	const over = value > max && max > 0;
	const width = max > 0 ? Math.min(100, value / max * 100) : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-1 flex items-baseline justify-between text-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-medium",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "tabular-nums text-muted",
			children: [Math.round(value), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-muted",
				children: [
					"/",
					Math.round(max),
					unit
				]
			})]
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "h-2 overflow-hidden rounded-full bg-line",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `h-full rounded-full ${over ? "bg-clay" : "bg-fresh"}`,
			style: { width: `${width}%` }
		})
	})] });
}
function toneForVerdict(verdict) {
	if (verdict === "fits") return "green";
	if (verdict === "tight") return "orange";
	return "red";
}
function ProductSheet({ product, profile, eatenKcal, onClose, onOpen, onLog }) {
	const [servings, setServings] = (0, import_react.useState)(1);
	const [added, setAdded] = (0, import_react.useState)(false);
	const [alts, setAlts] = (0, import_react.useState)([]);
	const score = scoreProduct(product);
	const tone = bandClasses(score.band);
	const portion = servingOf(product, servings);
	const fit = assessFit({
		product,
		score,
		profile,
		eatenKcal,
		servings
	});
	const fitTone = bandClasses(toneForVerdict(fit.verdict));
	const unit = product.perServing ? product.servingSize : "100 g";
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		setAlts([]);
		findAlternatives({ data: {
			tags: product.categoryTags,
			exclude: product.code
		} }).then((result) => {
			if (cancelled) return;
			const ranked = pickAlternatives(product, score.score, result.products);
			setAlts(ranked);
		});
		return () => {
			cancelled = true;
		};
	}, [product, score.score]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "scrim fixed inset-0 z-40 flex justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "sheet-in flex h-full w-full max-w-md flex-col bg-paper",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm font-medium text-muted",
						children: [product.source === "open-food-facts" ? "Open Food Facts" : "Sample aisle", product.organic ? " · Organic" : ""]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "press rounded-full px-3 py-2 text-sm font-medium text-muted",
						onClick: onClose,
						children: "Close"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "min-h-0 flex-1 overflow-y-auto px-4 pb-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rise",
						children: [
							product.imageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: product.imageUrl,
								alt: "",
								className: "mb-4 h-40 w-full rounded-3xl bg-moss object-contain"
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium text-muted",
								children: product.brand
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-4xl",
								children: product.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted",
								children: product.category
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: `mt-5 flex items-center gap-4 rounded-3xl px-3 py-4 ${tone.soft}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Ring, {
									value: score.score,
									max: 100,
									band: score.band,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: `font-display text-4xl tabular-nums ${tone.text}`,
										children: score.score
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-medium text-muted",
										children: "/100"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: `font-display text-3xl ${tone.text}`,
										children: score.label
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 font-display text-4xl tabular-nums",
										children: Math.round(portion.kcal)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-sm text-muted",
										children: ["kcal per ", servings === 1 ? unit : `${servings} × ${unit}`]
									})
								] })]
							}),
							score.extreme ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 rounded-2xl bg-clay-soft px-4 py-3 text-sm font-medium text-clay",
								children: "Extremely unhealthy. The serving may not look huge, but the recipe is."
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
								className: `mt-3 rounded-3xl px-4 py-4 ${fitTone.soft}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: `font-sans text-lg font-semibold ${fitTone.text}`,
									children: fit.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "mt-2 space-y-1 text-sm",
									children: fit.reasons.map((reason) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: reason }, reason))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 grid grid-cols-4 gap-2 text-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini, {
										label: "Protein",
										value: `${trim(portion.protein)}g`
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini, {
										label: "Carbs",
										value: `${trim(portion.carbs)}g`
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini, {
										label: "Fat",
										value: `${trim(portion.fat)}g`
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini, {
										label: "Sugar",
										value: `${trim(portion.sugar)}g`
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-center text-xs text-muted",
								children: [
									"Per 100g: ",
									Math.round(product.per100.kcal),
									" kcal · ",
									trim(product.per100.sugar),
									"g sugar ·",
									" ",
									trim(product.per100.satFat),
									"g sat fat · ",
									trim(product.per100.salt),
									"g salt"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
								className: "mt-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-sans text-sm font-semibold tracking-wide text-muted",
									children: "WHY THIS SCORE"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 space-y-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Part, {
											label: "Nutrition",
											value: score.parts.nutrition,
											detail: score.parts.nutritionDetail
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Part, {
											label: "Processing",
											value: score.parts.processing,
											detail: score.parts.processingDetail
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Part, {
											label: "Additives",
											value: score.parts.additives,
											detail: score.parts.additivesDetail
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
								className: "mt-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-sans text-sm font-semibold tracking-wide text-muted",
									children: "PROBLEM INGREDIENTS"
								}), score.problems.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm text-muted",
									children: "Nothing on this label that Bitewise treats as a problem."
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "mt-3 space-y-3",
									children: score.problems.map((problem) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "rounded-2xl border border-line bg-surface px-4 py-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "font-semibold",
											children: [problem.name, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: `ml-2 text-xs font-medium uppercase ${problem.level === "high" ? "text-clay" : "text-amber"}`,
												children: problem.level
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-sm text-muted",
											children: problem.why
										})]
									}, problem.name))
								})]
							}),
							product.ingredientsText ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
								className: "mt-4 rounded-2xl border border-line bg-surface px-4 py-3 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
									className: "cursor-pointer font-medium",
									children: "Full ingredient list"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-muted",
									children: product.ingredientsText
								})]
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
								className: "mt-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-sans text-sm font-semibold tracking-wide text-muted",
									children: "BETTER IN THIS AISLE"
								}), alts.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm text-muted",
									children: score.score >= 80 ? "This is already one of the better choices here." : "No clearly better alternative turned up in this category."
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "mt-3 space-y-2",
									children: alts.map((item) => {
										const altScore = scoreProduct(item);
										const altTone = bandClasses(altScore.band);
										return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											className: "press flex w-full items-center justify-between gap-3 rounded-2xl border border-line bg-surface px-4 py-3 text-left",
											onClick: () => onOpen(item.code),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "block font-semibold",
												children: item.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "block text-sm text-muted",
												children: item.brand
											})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: `font-display text-2xl tabular-nums ${altTone.text}`,
												children: altScore.score
											})]
										}) }, item.code);
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-6 text-xs text-muted",
								children: "A guide from the label, not a diagnosis. Data from Open Food Facts when the barcode is in their database."
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "tabbar-pad border-t border-line bg-paper px-4 pt-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1 rounded-full bg-moss p-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "press grid h-11 w-11 place-items-center",
									"aria-label": "Fewer servings",
									onClick: () => setServings((n) => Math.max(.5, round(n - .5))),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "h-4 w-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "w-12 text-center font-semibold tabular-nums",
									children: servings
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "press grid h-11 w-11 place-items-center",
									"aria-label": "More servings",
									onClick: () => setServings((n) => Math.min(6, round(n + .5))),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" })
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "press flex-1 rounded-full bg-fresh py-3.5 font-semibold text-[#222]",
							onClick: () => {
								onLog(servings);
								setAdded(true);
							},
							children: added ? "Added to today" : "Add to today"
						})]
					})
				})
			]
		})
	});
}
function pickAlternatives(product, current, remote) {
	const seen = /* @__PURE__ */ new Set();
	return [...remote, ...AISLE].filter((item) => {
		if (item.code === product.code || seen.has(item.code)) return false;
		seen.add(item.code);
		return related(item, product) && !sameFamily(item, product);
	}).map((item) => ({
		item,
		score: scoreProduct(item).score
	})).filter((entry) => entry.score >= current + 8).filter((entry) => product.per100.sugar < 8 || entry.item.per100.sugar <= product.per100.sugar * .7).sort((a, b) => b.score - a.score).slice(0, 3).map((entry) => entry.item);
}
function related(item, product) {
	if (item.categoryTags.some((tag) => product.categoryTags.includes(tag))) return true;
	const words = `${product.category} ${product.name}`.toLowerCase().split(/[^a-z]+/).filter((word) => word.length > 4 && !STOP.has(word));
	const blob = `${item.category} ${item.name} ${item.categoryTags.join(" ")}`.toLowerCase();
	return words.some((word) => blob.includes(word));
}
var STOP = /* @__PURE__ */ new Set([
	"sample",
	"aisle",
	"plain",
	"chocolate",
	"sandwich",
	"white",
	"green",
	"black"
]);
function sameFamily(item, product) {
	const a = item.name.toLowerCase();
	const b = product.name.toLowerCase();
	if (a.includes(b) || b.includes(a)) return true;
	const brandA = item.brand.toLowerCase();
	const brandB = product.brand.toLowerCase();
	if (brandA && brandB && brandA !== "aisle sample" && brandA === brandB) return true;
	return false;
}
function Part({ label, value, detail }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-baseline justify-between text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-medium",
				children: label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "tabular-nums text-muted",
				children: value
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-1 h-1.5 overflow-hidden rounded-full bg-line",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-full rounded-full bg-fresh",
				style: { width: `${value}%` }
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm text-muted",
			children: detail
		})
	] });
}
function Mini({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl bg-surface px-1 py-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-semibold tabular-nums",
			children: value
		})]
	});
}
function trim(n) {
	return Number.isInteger(n) ? String(n) : n.toFixed(1);
}
function round(n) {
	return Math.round(n * 10) / 10;
}
function compressImage(source, max = 960, quality = .68) {
	return new Promise((resolve, reject) => {
		if (source instanceof HTMLVideoElement) {
			try {
				resolve(draw(source.videoWidth, source.videoHeight, (ctx, w, h) => ctx.drawImage(source, 0, 0, w, h), max, quality));
			} catch {
				reject(/* @__PURE__ */ new Error("Couldn't capture that frame."));
			}
			return;
		}
		const url = URL.createObjectURL(source);
		const img = new Image();
		img.onload = () => {
			URL.revokeObjectURL(url);
			try {
				resolve(draw(img.naturalWidth, img.naturalHeight, (ctx, w, h) => ctx.drawImage(img, 0, 0, w, h), max, quality));
			} catch {
				reject(/* @__PURE__ */ new Error("Couldn't read that photo."));
			}
		};
		img.onerror = () => {
			URL.revokeObjectURL(url);
			reject(/* @__PURE__ */ new Error("Couldn't read that photo."));
		};
		img.src = url;
	});
}
function draw(width, height, paint, max, quality) {
	const scale = Math.min(1, max / Math.max(width || 1, height || 1));
	const w = Math.max(1, Math.round((width || max) * scale));
	const h = Math.max(1, Math.round((height || max) * scale));
	const canvas = document.createElement("canvas");
	canvas.width = w;
	canvas.height = h;
	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("Couldn't read that photo.");
	paint(ctx, w, h);
	return canvas.toDataURL("image/jpeg", quality);
}
function Scanner({ mode, onMode, onClose, onBarcode, onPhoto, onManual, mealError, mealBusy, photosLeft }) {
	const videoRef = (0, import_react.useRef)(null);
	const fileRef = (0, import_react.useRef)(null);
	const onBarcodeRef = (0, import_react.useRef)(onBarcode);
	onBarcodeRef.current = onBarcode;
	const [camError, setCamError] = (0, import_react.useState)(null);
	const [manual, setManual] = (0, import_react.useState)("");
	const [photoError, setPhotoError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (mode !== "barcode" && mode !== "meal") return;
		const video = videoRef.current;
		if (!video) return;
		let stopped = false;
		let controls = null;
		const halt = () => {
			stopped = true;
			controls?.stop();
			video.srcObject?.getTracks().forEach((track) => track.stop());
			video.srcObject = null;
		};
		(async () => {
			try {
				const stream = await navigator.mediaDevices.getUserMedia({
					audio: false,
					video: { facingMode: { ideal: "environment" } }
				});
				if (stopped) {
					stream.getTracks().forEach((track) => track.stop());
					return;
				}
				video.srcObject = stream;
				video.muted = true;
				video.playsInline = true;
				await video.play();
				if (mode !== "barcode") {
					controls = { stop: () => stream.getTracks().forEach((track) => track.stop()) };
					return;
				}
				const Detector = window.BarcodeDetector;
				if (Detector) {
					const detector = new Detector({ formats: [
						"ean_13",
						"ean_8",
						"upc_a",
						"upc_e",
						"code_128",
						"code_39"
					] });
					const loop = async () => {
						if (stopped) return;
						try {
							const value = (await detector.detect(video))?.find((code) => code.rawValue)?.rawValue;
							if (value) {
								stopped = true;
								onBarcodeRef.current(value);
								return;
							}
						} catch {}
						if (!stopped) requestAnimationFrame(() => void loop());
					};
					loop();
					controls = { stop: () => stream.getTracks().forEach((track) => track.stop()) };
					return;
				}
				const { BrowserMultiFormatReader } = await import("../_libs/@zxing/browser+[...].mjs").then((n) => n.t);
				if (stopped) return;
				const zx = await new BrowserMultiFormatReader().decodeFromVideoDevice(void 0, video, (result) => {
					const text = result?.getText();
					if (stopped || !text) return;
					stopped = true;
					zx.stop();
					onBarcodeRef.current(text);
				});
				controls = zx;
			} catch (error) {
				if (!stopped) setCamError(cameraMessage(error));
			}
		})();
		return halt;
	}, [mode]);
	async function takePhoto() {
		const video = videoRef.current;
		if (!video || !video.videoWidth) {
			setPhotoError("Camera isn't ready. Upload a photo instead.");
			return;
		}
		try {
			onPhoto(await compressImage(video));
		} catch (error) {
			setPhotoError(error instanceof Error ? error.message : "Couldn't capture that frame.");
		}
	}
	async function onFile(file) {
		if (!file) return;
		try {
			onPhoto(await compressImage(file));
		} catch (error) {
			setPhotoError(error instanceof Error ? error.message : "Couldn't read that photo.");
		}
	}
	if (mode === "choose") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "scrim fixed inset-0 z-50 flex items-end justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "sheet-in w-full max-w-md rounded-t-3xl bg-paper px-5 pb-8 pt-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-auto mb-4 h-1.5 w-10 rounded-full bg-line" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-3xl",
						children: "What are you scanning?"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "press grid h-11 w-11 place-items-center rounded-full bg-moss",
						onClick: onClose,
						"aria-label": "Close",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 grid gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Choice, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanLine, { className: "h-6 w-6" }),
						title: "Packaged food",
						copy: "Read the barcode and score the label.",
						onClick: () => onMode("barcode")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Choice, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "h-6 w-6" }),
						title: "A meal",
						copy: photosLeft === 0 ? "Today's 3 photos are used. You can still type the meal." : photosLeft == null ? "Photograph the plate and estimate the macros." : `${photosLeft} photo ${photosLeft === 1 ? "estimate" : "estimates"} left today.`,
						onClick: () => onMode("meal")
					})]
				})
			]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex justify-center bg-camera text-camera-fg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex h-full w-full max-w-md flex-col",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between px-4 py-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "press grid h-11 w-11 place-items-center rounded-full bg-camera-fg/10",
							onClick: onClose,
							"aria-label": "Close scanner",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: mode === "barcode" ? "Barcode" : "Meal"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "press text-sm font-medium text-camera-fg/80",
							onClick: () => onMode("choose"),
							children: "Switch"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative mx-4 flex-1 overflow-hidden rounded-3xl bg-camera",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
							ref: videoRef,
							className: "h-full w-full object-cover",
							muted: true,
							playsInline: true,
							autoPlay: true
						}),
						mode === "barcode" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-8 rounded-2xl border-2 border-camera-fg/80" }) : null,
						mealBusy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute inset-0 grid place-items-center bg-camera/70 px-6 text-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-3xl",
								children: "Reading the plate…"
							})
						}) : null
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "tabbar-pad space-y-3 px-4 py-4",
					children: [
						camError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-amber",
							children: camError
						}) : null,
						photoError || mealError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-amber",
							children: photoError || mealError
						}) : null,
						mode === "barcode" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							className: "flex gap-2",
							onSubmit: (event) => {
								event.preventDefault();
								const code = manual.replace(/[^\d]/g, "");
								if (code.length >= 6) onBarcode(code);
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: manual,
								onChange: (event) => setManual(event.target.value),
								inputMode: "numeric",
								placeholder: "Or type the barcode",
								className: "min-w-0 flex-1 rounded-full bg-camera-fg/10 px-4 py-3 text-camera-fg placeholder:text-camera-fg/50",
								"aria-label": "Barcode number"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								className: "press rounded-full bg-fresh px-4 py-3 font-semibold text-[#222]",
								children: "Look up"
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-center gap-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "press grid h-12 w-12 place-items-center rounded-full bg-camera-fg/10",
									onClick: () => fileRef.current?.click(),
									"aria-label": "Upload a photo",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, { className: "h-5 w-5" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "press grid h-16 w-16 place-items-center rounded-full bg-fresh text-[#222] disabled:opacity-50",
									onClick: () => void takePhoto(),
									disabled: mealBusy,
									"aria-label": "Take photo",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "h-7 w-7" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-12" })
							]
						}),
						mode === "meal" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "press w-full text-center text-sm font-medium text-camera-fg/80",
							onClick: onManual,
							children: "Add foods by hand"
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							ref: fileRef,
							type: "file",
							accept: "image/*",
							capture: "environment",
							className: "hidden",
							onChange: (event) => void onFile(event.target.files?.[0])
						})
					]
				})
			]
		})
	});
}
function Choice({ icon, title, copy, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		className: "press flex items-center gap-4 rounded-3xl border border-line bg-surface px-4 py-4 text-left",
		onClick,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "grid h-12 w-12 place-items-center rounded-2xl bg-moss text-forest",
			children: icon
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "block font-semibold",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "block text-sm text-muted",
			children: copy
		})] })]
	});
}
function cameraMessage(error) {
	const name = error instanceof DOMException ? error.name : "";
	if (name === "NotAllowedError") return "Camera is blocked. Type the barcode, or upload a meal photo.";
	if (name === "NotFoundError") return "No camera found on this device. Type the barcode instead.";
	return "Camera didn't start. Type the barcode, or upload a photo.";
}
function ScanScreen({ onOpen, onBarcode, onMeal, photosLeft }) {
	const recents = useNara((state) => state.recents);
	const profile = useNara((state) => state.profile);
	const logs = useNara((state) => state.logs);
	const eaten = Math.round(sumLogs(logs.filter((item) => item.date === dateKey())).kcal);
	const left = profile.calorieTarget - eaten;
	const [query, setQuery] = (0, import_react.useState)("");
	const [results, setResults] = (0, import_react.useState)([]);
	const [searchNote, setSearchNote] = (0, import_react.useState)(null);
	const [searching, setSearching] = (0, import_react.useState)(false);
	const samples = featuredProducts();
	const barcode = query.replace(/\D/g, "");
	const barcodeQuery = /^\d[\d\s]{7,}$/.test(query.trim());
	(0, import_react.useEffect)(() => {
		const q = query.trim();
		if (barcodeQuery || q.length < 2) {
			setResults([]);
			setSearchNote(null);
			setSearching(false);
			return;
		}
		setSearching(true);
		const handle = window.setTimeout(() => {
			searchFoods({ data: { query: q } }).then((result) => {
				setResults(result.products);
				setSearchNote(result.products.length ? result.kind === "offline" ? "Showing saved aisle samples. Live search didn't respond." : null : result.kind === "offline" ? "Can't reach the food database, and nothing in the sample aisle matches." : "No match. Try the barcode under the stripes.");
			}).catch(() => setSearchNote("Search failed. Try a sample below.")).finally(() => setSearching(false));
		}, 280);
		return () => window.clearTimeout(handle);
	}, [query, barcodeQuery]);
	const today = (/* @__PURE__ */ new Date()).toLocaleDateString(void 0, {
		weekday: "long",
		month: "short",
		day: "numeric"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-5 pt-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, { className: "h-9 w-9" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-extrabold tracking-wide",
					children: "Bitewise"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm font-medium text-muted",
				children: today
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-1 font-display text-4xl",
				children: "Scan the aisle"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-sm text-muted",
				children: [
					GOAL_LABEL[profile.goal],
					" · ",
					left >= 0 ? `${left.toLocaleString()} kcal left` : `${Math.abs(left).toLocaleString()} kcal over`
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-5",
				onSubmit: (event) => {
					event.preventDefault();
					if (barcode.length >= 8) onOpen(barcode);
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-4 w-4 text-muted" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: query,
						onChange: (event) => setQuery(event.target.value),
						placeholder: "Search a food or type a barcode",
						className: "min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted",
						"aria-label": "Search foods"
					})]
				}), barcodeQuery ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "submit",
					className: "press mt-3 w-full rounded-full bg-moss py-3 text-sm font-semibold",
					children: ["Look up barcode ", barcode]
				}) : null]
			}),
			searching ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted",
				children: "Looking it up…"
			}) : null,
			searchNote ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted",
				children: searchNote
			}) : null,
			results.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 space-y-2",
				children: results.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResultRow, {
					product: item,
					onOpen
				}, item.code))
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 grid grid-cols-2 gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "press rounded-3xl bg-fresh px-4 py-4 text-left text-[#222]",
					onClick: onBarcode,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanLine, { className: "h-6 w-6" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-3 block font-semibold",
							children: "Scan a barcode"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-1 block text-sm text-[#222]/75",
							children: "Score the package in your hand."
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "press rounded-3xl border border-line bg-surface px-4 py-4 text-left",
					onClick: onMeal,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "h-6 w-6 text-forest" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-3 block font-semibold",
							children: "Photograph a meal"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-1 block text-sm text-muted",
							children: photosLeft === 0 ? "Today's 3 photos are used. Type the meal instead." : photosLeft == null ? "Calories and macros from the plate." : `${photosLeft} photo ${photosLeft === 1 ? "estimate" : "estimates"} left today.`
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-8 font-sans text-sm font-semibold tracking-wide text-muted",
				children: "TRY A SAMPLE"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 flex gap-3 overflow-x-auto pb-2",
				children: samples.map((item) => {
					const scored = scoreProduct(item);
					const tone = bandClasses(scored.band);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "press w-36 shrink-0 rounded-3xl border border-line bg-surface p-3 text-left",
						onClick: () => onOpen(item.code),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `font-display text-3xl tabular-nums ${tone.text}`,
								children: scored.score
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-2 block text-sm font-semibold leading-tight",
								children: item.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-1 block text-xs text-muted",
								children: scored.label
							})
						]
					}, item.code);
				})
			}),
			recents.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-6 font-sans text-sm font-semibold tracking-wide text-muted",
				children: "RECENT"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 space-y-2",
				children: recents.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "press flex w-full items-center justify-between rounded-2xl border border-line bg-surface px-4 py-3 text-left",
					onClick: () => onOpen(item.code),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block font-semibold",
						children: item.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "block text-sm text-muted",
						children: [item.brand, item.kcal != null ? ` · ${Math.round(item.kcal)} kcal` : ""]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `font-display text-2xl tabular-nums ${bandClasses(item.score >= 67 ? "green" : item.score >= 34 ? "orange" : "red").text}`,
						children: item.score
					})]
				}) }, item.code))
			})] }) : null
		]
	});
}
function ResultRow({ product, onOpen }) {
	const scored = scoreProduct(product);
	const tone = bandClasses(scored.band);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		className: "press flex w-full items-center justify-between gap-3 rounded-2xl border border-line bg-surface px-4 py-3 text-left",
		onClick: () => onOpen(product.code),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "block truncate font-semibold",
				children: product.name
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "block truncate text-sm text-muted",
				children: product.brand
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: `font-display text-2xl tabular-nums ${tone.text}`,
			children: scored.score
		})]
	}) });
}
function DiaryScreen({ date, onDate, onCamera }) {
	const logs = useNara((state) => state.logs);
	const profile = useNara((state) => state.profile);
	const setServings = useNara((state) => state.setServings);
	const removeLog = useNara((state) => state.removeLog);
	const today = dateKey();
	const items = logs.filter((item) => item.date === date);
	const totals = sumLogs(items);
	const over = totals.kcal > profile.calorieTarget;
	const band = over ? "red" : totals.kcal > profile.calorieTarget * .9 ? "orange" : "green";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-5 pt-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-medium text-muted",
				children: "Diary"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-1 flex items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-4xl",
					children: date === today ? "Today" : weekdayLabel(date)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2 pb-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "press h-11 w-11 rounded-full bg-moss text-lg font-semibold",
						"aria-label": "Previous day",
						onClick: () => onDate(shiftDate(date, -1)),
						children: "‹"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "press h-11 w-11 rounded-full bg-moss text-lg font-semibold disabled:opacity-40",
						"aria-label": "Next day",
						disabled: date >= today,
						onClick: () => onDate(shiftDate(date, 1)),
						children: "›"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex items-center gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Ring, {
					value: totals.kcal,
					max: profile.calorieTarget,
					band,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-3xl tabular-nums",
						children: Math.round(totals.kcal)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted",
						children: ["of ", profile.calorieTarget]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-3xl",
						children: over ? "Over" : "Left"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-lg tabular-nums text-muted",
						children: [Math.abs(Math.round(profile.calorieTarget - totals.kcal)).toLocaleString(), " kcal"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: GOAL_LABEL[profile.goal]
					})
				] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MacroBar, {
						label: "Protein",
						value: totals.protein,
						max: profile.proteinTarget,
						unit: "g"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MacroBar, {
						label: "Carbs",
						value: totals.carbs,
						max: profile.carbsTarget,
						unit: "g"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MacroBar, {
						label: "Fat",
						value: totals.fat,
						max: profile.fatTarget,
						unit: "g"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MacroBar, {
						label: "Sugar",
						value: totals.sugar,
						max: profile.sugarTarget,
						unit: "g"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-8 font-sans text-sm font-semibold tracking-wide text-muted",
				children: "LOGGED"
			}),
			items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 rounded-3xl border border-dashed border-line px-4 py-8 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium",
						children: date === today ? "Nothing logged today." : "Nothing logged this day."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: "Scan a barcode or photograph a meal."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "press mt-4 rounded-full bg-fresh px-5 py-3 text-sm font-semibold text-[#222]",
						onClick: onCamera,
						children: "Scan something"
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 space-y-2",
				children: items.map((item) => {
					const scaled = logScaled(item);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-2xl border border-line bg-surface px-4 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate font-semibold",
									children: item.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "truncate text-sm text-muted",
									children: [item.detail || (item.source === "meal" ? "From a photo" : "Logged"), item.score != null ? ` · score ${item.score}` : ""]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-semibold tabular-nums",
								children: Math.round(scaled.kcal)
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 flex flex-wrap items-center justify-between gap-2 text-sm text-muted",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "tabular-nums",
								children: [
									Math.round(scaled.protein),
									"p · ",
									Math.round(scaled.carbs),
									"c · ",
									Math.round(scaled.fat),
									"f"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "press h-9 w-9 rounded-full bg-moss font-semibold text-ink",
										onClick: () => setServings(item.id, item.servings - .5),
										"aria-label": "Decrease",
										children: "−"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "tabular-nums text-ink",
										children: [item.servings, "×"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "press h-9 w-9 rounded-full bg-moss font-semibold text-ink",
										onClick: () => setServings(item.id, item.servings + .5),
										"aria-label": "Increase",
										children: "+"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "press text-clay",
										onClick: () => removeLog(item.id),
										children: "Remove"
									})
								]
							})]
						})]
					}, item.id);
				})
			})
		]
	});
}
function HistoryScreen({ onOpenDay }) {
	const logs = useNara((state) => state.logs);
	const goal = useNara((state) => state.profile.calorieTarget);
	const days = (0, import_react.useMemo)(() => weekSeries(logs), [logs]);
	const weekKcal = days.reduce((sum, day) => sum + day.calories, 0);
	const [Chart, setChart] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		import("../_libs/recharts+[...].mjs").then((n) => n.t).then(setChart);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-5 pt-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-medium text-muted",
				children: "History"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-1 font-display text-4xl",
				children: "This week"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-sm text-muted",
				children: [
					weekKcal.toLocaleString(),
					" kcal logged · target ",
					goal.toLocaleString(),
					" a day. Tap a day to open it."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "card mt-5 h-56 rounded-3xl px-2 py-4",
				children: weekKcal === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid h-full place-items-center px-6 text-center text-sm text-muted",
					children: "Log a few foods and the week will draw itself here."
				}) : Chart ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chart.ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Chart.BarChart, {
						data: days,
						barSize: 16,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chart.XAxis, {
								dataKey: "label",
								tickLine: false,
								axisLine: false,
								tick: {
									fill: "var(--color-muted)",
									fontSize: 12
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chart.YAxis, {
								hide: true,
								domain: [0, Math.max(goal, ...days.map((day) => day.calories), 1)]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chart.Tooltip, {
								cursor: { fill: "var(--color-moss)" },
								contentStyle: {
									background: "var(--color-surface)",
									border: "1px solid var(--color-line)",
									borderRadius: 12,
									color: "var(--color-ink)"
								},
								formatter: (value) => [`${value} kcal`, "Eaten"],
								labelFormatter: (_label, payload) => {
									return (payload?.[0]?.payload)?.name ?? "";
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chart.ReferenceLine, {
								y: goal,
								stroke: "var(--color-muted)",
								strokeDasharray: "3 4"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chart.Bar, {
								dataKey: "calories",
								fill: "var(--color-forest)",
								radius: [
									6,
									6,
									0,
									0
								]
							})
						]
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-full rounded-2xl bg-moss" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-5 space-y-2",
				children: [...days].reverse().map((day) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "press flex w-full items-center justify-between rounded-2xl border border-line bg-surface px-4 py-3 text-left",
					onClick: () => onOpenDay(day.key),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium",
						children: day.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "tabular-nums text-muted",
						children: [day.calories.toLocaleString(), " kcal"]
					})]
				}) }, day.key))
			})
		]
	});
}
function ProfileScreen() {
	const profile = useNara((state) => state.profile);
	const setProfile = useNara((state) => state.setProfile);
	const resetAll = useNara((state) => state.resetAll);
	const [theme, setThemeState] = (0, import_react.useState)("light");
	const [armed, setArmed] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setThemeState(document.documentElement.classList.contains("dark") ? "dark" : "light");
	}, []);
	function setTheme(next) {
		document.documentElement.classList.toggle("dark", next === "dark");
		localStorage.setItem("bitewise-theme", next);
		setThemeState(next);
	}
	function apply(partial, recalc = false) {
		const next = {
			...profile,
			...partial
		};
		if (recalc) {
			const targets = recommendedTargets(next);
			setProfile({
				...next,
				...targets,
				onboarded: true
			});
			return;
		}
		setProfile(next);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-5 pt-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-medium text-muted",
				children: "Profile"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-1 font-display text-4xl",
				children: "Your targets"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 rounded-3xl border border-line bg-surface px-4 py-3 text-sm",
				children: [
					"Free plan. ",
					photoScanStatus().remaining === 0 ? "No meal photos left today — they reset tomorrow." : `${photoScanStatus().remaining ?? "Unlimited"} meal photos left today.`,
					" Barcodes stay unlimited."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex items-center justify-between rounded-3xl border border-line bg-surface px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-medium",
					children: "Appearance"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "press rounded-full bg-moss px-4 py-2 text-sm font-semibold",
					onClick: () => setTheme(theme === "dark" ? "light" : "dark"),
					children: theme === "dark" ? "Dark" : "Light"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid grid-cols-2 gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
						label: "Age",
						value: profile.age,
						onChange: (age) => apply({ age })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
						label: "Weight kg",
						value: profile.weightKg,
						onChange: (weightKg) => apply({ weightKg })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
						label: "Height cm",
						value: profile.heightCm,
						onChange: (heightCm) => apply({ heightCm })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
						label: "Calories",
						value: profile.calorieTarget,
						onChange: (calorieTarget) => apply({ calorieTarget })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
						label: "Protein g",
						value: profile.proteinTarget,
						onChange: (proteinTarget) => apply({ proteinTarget })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
						label: "Carbs g",
						value: profile.carbsTarget,
						onChange: (carbsTarget) => apply({ carbsTarget })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
						label: "Fat g",
						value: profile.fatTarget,
						onChange: (fatTarget) => apply({ fatTarget })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
						label: "Sugar g",
						value: profile.sugarTarget,
						onChange: (sugarTarget) => apply({ sugarTarget })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm font-medium",
				children: "Sex"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 grid grid-cols-3 gap-2",
				children: [
					"female",
					"male",
					"other"
				].map((sex) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: `press rounded-2xl border py-3 text-sm font-medium capitalize ${profile.sex === sex ? "border-forest bg-moss" : "border-line bg-surface text-muted"}`,
					onClick: () => apply({ sex }),
					children: sex
				}, sex))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm font-medium",
				children: "Goal"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 grid grid-cols-2 gap-2",
				children: Object.keys(GOAL_LABEL).map((goal) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: `press rounded-2xl border px-3 py-3 text-sm font-medium ${profile.goal === goal ? "border-forest bg-moss" : "border-line bg-surface text-muted"}`,
					onClick: () => apply({ goal }, true),
					children: GOAL_LABEL[goal]
				}, goal))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "press mt-4 w-full rounded-full bg-moss py-3 font-semibold",
				onClick: () => apply({}, true),
				children: "Recalculate from my stats"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "press mt-3 w-full rounded-full border border-line py-3 text-sm font-medium",
				onClick: () => apply({ avoidUltra: !profile.avoidUltra }),
				children: profile.avoidUltra ? "Flagging ultra-processed foods" : "Not flagging ultra-processed foods"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8 text-sm text-muted",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-sans text-sm font-semibold tracking-wide text-ink",
						children: "HOW THE SCORE WORKS"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2",
						children: "65% nutrition (Nutri-Score when the label has one), 20% NOVA processing, 15% additives. Under 34 is red. Extremely unhealthy means a bad score plus an ultra-processed, high-sugar or high-saturated-fat recipe."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2",
						children: "Calories use the serving on the pack. Goals use Mifflin–St Jeor with a lightly active day. An estimate, not medical advice."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "press mt-8 text-sm font-medium text-clay",
				onClick: () => {
					if (!armed) {
						setArmed(true);
						return;
					}
					resetAll();
					setArmed(false);
				},
				children: armed ? "Tap again to erase this phone's diary" : "Erase diary and goals"
			})
		]
	});
}
function weekdayLabel(key) {
	const [year, month, day] = key.split("-").map(Number);
	return new Date(year, (month ?? 1) - 1, day ?? 1).toLocaleDateString(void 0, {
		weekday: "long",
		month: "short",
		day: "numeric"
	});
}
function shiftDate(key, by) {
	const [year, month, day] = key.split("-").map(Number);
	const date = new Date(year, (month ?? 1) - 1, day ?? 1);
	date.setDate(date.getDate() + by);
	return dateKey(date);
}
function Num({ label, value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block text-sm font-medium",
		children: [label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			inputMode: "decimal",
			value: Number.isFinite(value) ? value : "",
			onChange: (event) => onChange(Number(event.target.value)),
			className: "mt-1 w-full rounded-2xl border border-line bg-surface px-3 py-3 text-lg tabular-nums"
		})]
	});
}
function TabBar({ tab, onTab, onCamera }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-x-0 bottom-0 z-30 flex justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
			className: "tabbar-pad grid w-full max-w-md grid-cols-5 items-end border-t border-line bg-paper px-1 pt-1",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabButton, {
					id: "scan",
					label: "Scan",
					active: tab === "scan",
					onClick: () => onTab("scan"),
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanLine, { className: "h-5 w-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabButton, {
					id: "diary",
					label: "Diary",
					active: tab === "diary",
					onClick: () => onTab("diary"),
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotebookPen, { className: "h-5 w-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "press -mt-6 grid h-16 w-16 place-items-center rounded-full bg-fresh text-[#222] shadow-lg",
						onClick: onCamera,
						"aria-label": "Open camera",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "h-7 w-7" })
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabButton, {
					id: "history",
					label: "History",
					active: tab === "history",
					onClick: () => onTab("history"),
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "h-5 w-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabButton, {
					id: "profile",
					label: "Profile",
					active: tab === "profile",
					onClick: () => onTab("profile"),
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserRound, { className: "h-5 w-5" })
				})
			]
		})
	});
}
function TabButton({ label, active, onClick, icon }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		className: `press flex flex-col items-center gap-1 py-2 text-xs font-medium ${active ? "text-forest" : "text-muted"}`,
		onClick,
		children: [icon, label]
	});
}
function BitewiseApp() {
	const [ready, setReady] = (0, import_react.useState)(false);
	const profile = useNara((state) => state.profile);
	const logs = useNara((state) => state.logs);
	const addLog = useNara((state) => state.addLog);
	const rememberScan = useNara((state) => state.rememberScan);
	const [tab, setTab] = (0, import_react.useState)("scan");
	const [diaryDate, setDiaryDate] = (0, import_react.useState)(dateKey);
	const [scanner, setScanner] = (0, import_react.useState)(null);
	const [product, setProduct] = (0, import_react.useState)(null);
	const [lookupError, setLookupError] = (0, import_react.useState)(null);
	const [looking, setLooking] = (0, import_react.useState)(false);
	const [meal, setMeal] = (0, import_react.useState)(null);
	const [mealNote, setMealNote] = (0, import_react.useState)("Correct the portions, then save.");
	const [mealError, setMealError] = (0, import_react.useState)(null);
	const [mealBusy, setMealBusy] = (0, import_react.useState)(false);
	const [scanTick, setScanTick] = (0, import_react.useState)(0);
	const photosLeft = scanTick >= 0 ? photoScanStatus().remaining : null;
	(0, import_react.useEffect)(() => {
		let live = true;
		(async () => {
			await useNara.persist.rehydrate();
			if (live) setReady(true);
		})();
		return () => {
			live = false;
		};
	}, []);
	const eaten = sumLogs(logs.filter((item) => item.date === dateKey())).kcal;
	async function openCode(raw) {
		const code = raw.replace(/[^\d]/g, "");
		setScanner(null);
		setLookupError(null);
		setLooking(true);
		setTab("scan");
		const local = aisleByCode(code);
		if (local) setProduct(local);
		else setProduct(null);
		try {
			const result = await fetchProduct({ data: { code } });
			if (result.ok) {
				const next = local ? fillGaps(local, result.product) : result.product;
				setProduct(next);
				const scored = scoreProduct(next);
				const portion = servingOf(next, 1);
				rememberScan({
					code: next.code,
					name: next.name,
					brand: next.brand,
					score: scored.score,
					kcal: portion.kcal
				});
			} else if (!local) {
				setProduct(null);
				setLookupError(result.kind === "offline" ? "Can't reach the food database right now. Sample products on the scan tab still work." : `Nothing found for ${code}. Check the digits under the stripes.`);
			} else {
				const scored = scoreProduct(local);
				const portion = servingOf(local, 1);
				rememberScan({
					code: local.code,
					name: local.name,
					brand: local.brand,
					score: scored.score,
					kcal: portion.kcal
				});
			}
		} catch {
			if (!local) {
				setProduct(null);
				setLookupError("Couldn't look that up. Try a sample, or check the number.");
			}
		} finally {
			setLooking(false);
		}
	}
	async function onPhoto(dataUrl) {
		const gate = canScanPhoto();
		if (!gate.ok) {
			setMealError(gate.message);
			return;
		}
		setMealError(null);
		setMealBusy(true);
		try {
			const result = await analyzeMeal({ data: { imageDataUrl: dataUrl } });
			if (!result.ok) {
				setMealError(result.error);
				if (result.kind === "unavailable") {
					setMeal(blankMeal());
					setMealNote(result.error);
					setScanner(null);
				}
				return;
			}
			recordPhotoScan();
			setScanTick((tick) => tick + 1);
			setMeal(result.items.map((item, index) => ({
				...item,
				id: `${index}-${item.name.slice(0, 12)}`,
				factor: 1
			})));
			setMealNote(result.note || "Estimates from the photo. Correct anything that looks off.");
			setScanner(null);
		} catch (error) {
			setMealError(error instanceof Error ? error.message : "The meal reader failed.");
		} finally {
			setMealBusy(false);
		}
	}
	function saveMeal() {
		if (!meal) return;
		for (const item of meal) {
			if (!item.name.trim()) continue;
			addLog({
				name: item.name.trim(),
				detail: item.portion,
				source: "meal",
				barcode: null,
				score: null,
				servings: 1,
				base: {
					calories: Math.round(item.calories * item.factor),
					protein: Math.round(item.protein * item.factor),
					carbs: Math.round(item.carbs * item.factor),
					fat: Math.round(item.fat * item.factor),
					sugar: 0
				}
			});
		}
		setMeal(null);
		setTab("diary");
	}
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid min-h-dvh place-items-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, { className: "mx-auto h-20 w-20" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-4 font-display text-4xl font-extrabold",
				children: "Bitewise"
			})]
		})
	});
	if (!profile.onboarded) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Onboarding, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-paper text-ink",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "content-pad mx-auto min-h-dvh w-full max-w-md overflow-x-hidden",
				children: [
					lookupError && tab === "scan" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mx-5 mt-4 rounded-2xl bg-clay-soft px-4 py-3 text-sm text-clay",
						children: lookupError
					}) : null,
					looking && tab === "scan" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "px-5 pt-4 text-sm text-muted",
						children: "Checking the label…"
					}) : null,
					tab === "scan" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanScreen, {
						photosLeft,
						onOpen: (code) => void openCode(code),
						onBarcode: () => setScanner("barcode"),
						onMeal: () => setScanner("meal")
					}) : null,
					tab === "diary" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DiaryScreen, {
						date: diaryDate,
						onDate: setDiaryDate,
						onCamera: () => setScanner("choose")
					}) : null,
					tab === "history" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HistoryScreen, { onOpenDay: (date) => {
						setDiaryDate(date);
						setTab("diary");
					} }) : null,
					tab === "profile" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileScreen, {}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabBar, {
				tab,
				onTab: setTab,
				onCamera: () => setScanner("choose")
			}),
			scanner ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scanner, {
				mode: scanner,
				onMode: setScanner,
				onClose: () => setScanner(null),
				onBarcode: (code) => void openCode(code),
				onPhoto: (dataUrl) => void onPhoto(dataUrl),
				onManual: () => {
					setMeal(blankMeal());
					setMealNote("No photo — type what you ate, then save.");
					setScanner(null);
				},
				mealError,
				mealBusy,
				photosLeft
			}) : null,
			product ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductSheet, {
				product,
				profile,
				eatenKcal: eaten,
				onClose: () => setProduct(null),
				onOpen: (code) => void openCode(code),
				onLog: (servings) => {
					const portion = servingOf(product, 1);
					const scored = scoreProduct(product);
					addLog({
						name: product.name,
						detail: product.brand,
						source: "barcode",
						barcode: product.code,
						score: scored.score,
						servings,
						base: {
							calories: portion.kcal,
							protein: portion.protein,
							carbs: portion.carbs,
							fat: portion.fat,
							sugar: portion.sugar
						}
					});
				}
			}) : null,
			meal ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MealSheet, {
				items: meal,
				note: mealNote,
				onChange: setMeal,
				onClose: () => setMeal(null),
				onSave: saveMeal
			}) : null
		]
	});
}
function fillGaps(local, remote) {
	const servingGrams = remote.servingGrams ?? local.servingGrams;
	const per100 = remote.per100.kcal > 0 ? remote.per100 : local.per100;
	const perServing = remote.perServing ?? (servingGrams ? scaleServing(per100, servingGrams) : local.perServing);
	return {
		...remote,
		per100,
		imageUrl: remote.imageUrl ?? local.imageUrl,
		category: local.category || remote.category,
		categoryTag: local.categoryTag ?? remote.categoryTag,
		categoryTags: [.../* @__PURE__ */ new Set([...local.categoryTags, ...remote.categoryTags])],
		servingGrams,
		servingSize: remote.perServing ? remote.servingSize : local.servingSize,
		perServing,
		nutriscore: remote.nutriscore ?? local.nutriscore,
		nova: remote.nova ?? local.nova,
		additiveTags: remote.additiveTags.length ? remote.additiveTags : local.additiveTags,
		ingredientFlags: [.../* @__PURE__ */ new Set([...remote.ingredientFlags, ...local.ingredientFlags])],
		ingredientsText: remote.ingredientsText ?? local.ingredientsText
	};
}
function scaleServing(per100, grams) {
	const ratio = grams / 100;
	return {
		kcal: Math.round(per100.kcal * ratio * 10) / 10,
		protein: Math.round(per100.protein * ratio * 10) / 10,
		carbs: Math.round(per100.carbs * ratio * 10) / 10,
		fat: Math.round(per100.fat * ratio * 10) / 10,
		sugar: Math.round(per100.sugar * ratio * 10) / 10,
		salt: Math.round(per100.salt * ratio * 10) / 10
	};
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BitewiseApp, {});
}
//#endregion
export { Home as component };
