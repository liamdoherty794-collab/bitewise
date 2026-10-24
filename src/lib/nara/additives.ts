export type AdditiveLevel = "high" | "moderate" | "low";

export type AdditiveInfo = {
  code: string;
  name: string;
  level: AdditiveLevel;
  why: string;
};

const DB: Record<string, AdditiveInfo> = {
  e102: {
    code: "e102",
    name: "Tartrazine",
    level: "high",
    why: "A yellow dye linked to hyperactivity in some children. Banned or restricted in several countries.",
  },
  e104: {
    code: "e104",
    name: "Quinoline yellow",
    level: "high",
    why: "A synthetic dye associated with hyperactivity. Not allowed in food in the US.",
  },
  e110: {
    code: "e110",
    name: "Sunset yellow",
    level: "high",
    why: "An azo dye that can trigger hyperactivity and reactions in sensitive people.",
  },
  e122: {
    code: "e122",
    name: "Carmoisine",
    level: "high",
    why: "A red azo dye linked to hyperactivity. Restricted in several countries.",
  },
  e124: {
    code: "e124",
    name: "Ponceau 4R",
    level: "high",
    why: "A synthetic red dye associated with hyperactivity and allergic reactions.",
  },
  e129: {
    code: "e129",
    name: "Allura red",
    level: "high",
    why: "A common red dye. Some studies link it to hyperactivity in children.",
  },
  e133: {
    code: "e133",
    name: "Brilliant blue",
    level: "moderate",
    why: "A synthetic blue dye. Mostly a marker of heavy colouring, with mixed safety data.",
  },
  e150d: {
    code: "e150d",
    name: "Sulphite ammonia caramel",
    level: "moderate",
    why: "The dark colour in many colas. The harsh version of caramel colour, made with sulphites and ammonia.",
  },
  e171: {
    code: "e171",
    name: "Titanium dioxide",
    level: "high",
    why: "A white colour banned in the EU as a food additive over genotoxicity concerns.",
  },
  e211: {
    code: "e211",
    name: "Sodium benzoate",
    level: "moderate",
    why: "A preservative. With vitamin C it can form benzene, and it bothers some sensitive people.",
  },
  e220: {
    code: "e220",
    name: "Sulphur dioxide",
    level: "moderate",
    why: "A preservative that can trigger asthma symptoms in people who are sensitive to sulphites.",
  },
  e249: {
    code: "e249",
    name: "Potassium nitrite",
    level: "high",
    why: "A curing salt. Nitrites can form nitrosamines, compounds linked to colorectal cancer risk.",
  },
  e250: {
    code: "e250",
    name: "Sodium nitrite",
    level: "high",
    why: "Used to cure meat and keep it pink. Nitrites can form nitrosamines when cooked hot.",
  },
  e251: {
    code: "e251",
    name: "Sodium nitrate",
    level: "high",
    why: "A curing agent that converts to nitrite. Same nitrosamine concern as other cured-meat salts.",
  },
  e282: {
    code: "e282",
    name: "Calcium propionate",
    level: "moderate",
    why: "A bread preservative. Large amounts have been studied for irritability in some children.",
  },
  e320: {
    code: "e320",
    name: "BHA",
    level: "high",
    why: "An antioxidant preservative classed as a possible carcinogen. Used to stop fats going rancid.",
  },
  e321: {
    code: "e321",
    name: "BHT",
    level: "high",
    why: "A synthetic preservative with the same possible-carcinogen concern as BHA.",
  },
  e338: {
    code: "e338",
    name: "Phosphoric acid",
    level: "moderate",
    why: "Gives cola its bite. Regular high intake is linked with lower bone density and kidney strain.",
  },
  e407: {
    code: "e407",
    name: "Carrageenan",
    level: "moderate",
    why: "A seaweed thickener. Degraded forms inflame the gut in animal studies; food-grade evidence is mixed.",
  },
  e450: {
    code: "e450",
    name: "Diphosphates",
    level: "moderate",
    why: "Phosphate additives. A high phosphate load is hard on kidneys and is common in ultra-processed food.",
  },
  e451: {
    code: "e451",
    name: "Triphosphates",
    level: "moderate",
    why: "Another phosphate additive used to bind water in processed meats and snacks.",
  },
  e466: {
    code: "e466",
    name: "Carboxymethylcellulose",
    level: "moderate",
    why: "A thickener. Some research links it to disruption of the gut lining and microbiome.",
  },
  e476: {
    code: "e476",
    name: "PGPR",
    level: "moderate",
    why: "A cheap emulsifier that lets manufacturers use less cocoa butter in chocolate spreads.",
  },
  e621: {
    code: "e621",
    name: "Monosodium glutamate",
    level: "moderate",
    why: "A flavour enhancer. Safe for most people, but a known trigger for headaches in some.",
  },
  e950: {
    code: "e950",
    name: "Acesulfame K",
    level: "moderate",
    why: "An artificial sweetener. It keeps calories down but doesn't train a preference for less sweet food.",
  },
  e951: {
    code: "e951",
    name: "Aspartame",
    level: "moderate",
    why: "An artificial sweetener. Avoid it if you have PKU. Evidence of harm at normal doses is contested.",
  },
  e955: {
    code: "e955",
    name: "Sucralose",
    level: "moderate",
    why: "An artificial sweetener. It cuts sugar but may alter gut bacteria and keep a sweet tooth intact.",
  },
  e300: {
    code: "e300",
    name: "Vitamin C",
    level: "low",
    why: "Ascorbic acid. Used to keep colour and stop oxidation. Not a concern.",
  },
  e322: {
    code: "e322",
    name: "Lecithin",
    level: "low",
    why: "An emulsifier, usually from soy or sunflower. Generally unremarkable on its own.",
  },
  e330: {
    code: "e330",
    name: "Citric acid",
    level: "low",
    why: "An acid found in citrus, used for tang and freshness. Not a concern.",
  },
  e440: {
    code: "e440",
    name: "Pectin",
    level: "low",
    why: "A fruit fibre used to set jams. Not a concern.",
  },
  e160a: {
    code: "e160a",
    name: "Carotene",
    level: "low",
    why: "A colour from plants, related to vitamin A. Not a concern.",
  },
};

const FLAG_INFO: Record<string, { name: string; level: "high" | "moderate"; why: string }> = {
  "palm-oil": {
    name: "Palm oil",
    level: "moderate",
    why: "A cheap saturated fat. The nutrition score already counts the saturated fat; this flags how processed the recipe is.",
  },
  hydrogenated: {
    name: "Hydrogenated oil",
    level: "high",
    why: "Industrial hardening of oil. Fully or partially hydrogenated fats are a stand-in for ultra-processing and, historically, trans fat.",
  },
};

export function normalizeAdditiveCode(tag: string): string {
  const raw = tag.toLowerCase().replace(/^en:/, "").replace(/[^a-z0-9]/g, "");
  const match = raw.match(/e?\d{3,4}/);
  if (!match) return raw;
  return match[0].startsWith("e") ? match[0] : `e${match[0]}`;
}

export function lookupAdditive(tag: string): AdditiveInfo | null {
  const code = normalizeAdditiveCode(tag);
  return DB[code] ?? null;
}

export function flagInfo(flag: string) {
  return FLAG_INFO[flag] ?? null;
}

export function scoreAdditives(tags: string[], flags: string[]) {
  let penalty = 0;
  const problems: { name: string; level: "high" | "moderate"; why: string }[] = [];
  const seen = new Set<string>();

  for (const tag of tags) {
    const info = lookupAdditive(tag);
    if (!info || info.level === "low" || seen.has(info.code)) continue;
    seen.add(info.code);
    penalty += info.level === "high" ? 18 : 9;
    problems.push({ name: info.name, level: info.level, why: info.why });
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

  problems.sort((a, b) => (a.level === b.level ? 0 : a.level === "high" ? -1 : 1));

  return {
    score: clamp(100 - penalty),
    problems,
    unknown,
  };
}

function clamp(n: number) {
  return Math.max(0, Math.min(100, Math.round(n)));
}
