import { useEffect, useState } from "react";
import { analyzeMeal, fetchProduct } from "@/lib/nara/api";
import { aisleByCode } from "@/lib/nara/catalog";
import { dateKey, servingOf, sumLogs } from "@/lib/nara/goals";
import { canScanPhoto, photoScanStatus, recordPhotoScan } from "@/lib/nara/photo-scans";
import { scoreProduct } from "@/lib/nara/scoring";
import { useNara } from "@/lib/nara/store";
import type { MealItem, Product } from "@/lib/nara/types";
import { Logo } from "@/components/nara/logo";
import { MealSheet, blankMeal } from "@/components/nara/meal-sheet";
import { Onboarding } from "@/components/nara/onboarding";
import { ProductSheet } from "@/components/nara/product-sheet";
import { Scanner } from "@/components/nara/scanner";
import { DiaryScreen, HistoryScreen, ProfileScreen, ScanScreen, TabBar, type TabId } from "@/components/nara/screens";

export function BitewiseApp() {
  const [ready, setReady] = useState(false);
  const profile = useNara((state) => state.profile);
  const logs = useNara((state) => state.logs);
  const addLog = useNara((state) => state.addLog);
  const rememberScan = useNara((state) => state.rememberScan);

  const [tab, setTab] = useState<TabId>("scan");
  const [diaryDate, setDiaryDate] = useState(dateKey);
  const [scanner, setScanner] = useState<null | "choose" | "barcode" | "meal">(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [looking, setLooking] = useState(false);
  const [meal, setMeal] = useState<MealItem[] | null>(null);
  const [mealNote, setMealNote] = useState("Correct the portions, then save.");
  const [mealError, setMealError] = useState<string | null>(null);
  const [mealBusy, setMealBusy] = useState(false);
  const [scanTick, setScanTick] = useState(0);
  const photosLeft = scanTick >= 0 ? photoScanStatus().remaining : null;

  useEffect(() => {
    let live = true;
    void (async () => {
      await useNara.persist.rehydrate();
      if (live) setReady(true);
    })();
    return () => {
      live = false;
    };
  }, []);

  const eaten = sumLogs(logs.filter((item) => item.date === dateKey())).kcal;

  async function openCode(raw: string) {
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
          kcal: portion.kcal,
        });
      } else if (!local) {
        setProduct(null);
        setLookupError(
          result.kind === "offline"
            ? "Can't reach the food database right now. Sample products on the scan tab still work."
            : `Nothing found for ${code}. Check the digits under the stripes.`,
        );
      } else {
        const scored = scoreProduct(local);
        const portion = servingOf(local, 1);
        rememberScan({
          code: local.code,
          name: local.name,
          brand: local.brand,
          score: scored.score,
          kcal: portion.kcal,
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

  async function onPhoto(dataUrl: string) {
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
      setMeal(
        result.items.map((item, index) => ({
          ...item,
          id: `${index}-${item.name.slice(0, 12)}`,
          factor: 1,
        })),
      );
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
          sugar: 0,
        },
      });
    }
    setMeal(null);
    setTab("diary");
  }

  if (!ready) {
    return (
      <main className="grid min-h-dvh place-items-center">
        <div className="text-center">
          <Logo className="mx-auto h-20 w-20" />
          <h1 className="mt-4 font-display text-4xl font-extrabold">Bitewise</h1>
        </div>
      </main>
    );
  }

  if (!profile.onboarded) return <Onboarding />;

  return (
    <div className="min-h-dvh bg-paper text-ink">
      <main className="content-pad mx-auto min-h-dvh w-full max-w-md overflow-x-hidden">
        {lookupError && tab === "scan" ? (
          <p className="mx-5 mt-4 rounded-2xl bg-clay-soft px-4 py-3 text-sm text-clay">{lookupError}</p>
        ) : null}
        {looking && tab === "scan" ? <p className="px-5 pt-4 text-sm text-muted">Checking the label…</p> : null}
        {tab === "scan" ? (
          <ScanScreen
            photosLeft={photosLeft}
            onOpen={(code) => void openCode(code)}
            onBarcode={() => setScanner("barcode")}
            onMeal={() => setScanner("meal")}
          />
        ) : null}
        {tab === "diary" ? (
          <DiaryScreen date={diaryDate} onDate={setDiaryDate} onCamera={() => setScanner("choose")} />
        ) : null}
        {tab === "history" ? (
          <HistoryScreen
            onOpenDay={(date) => {
              setDiaryDate(date);
              setTab("diary");
            }}
          />
        ) : null}
        {tab === "profile" ? <ProfileScreen /> : null}
      </main>
      <TabBar tab={tab} onTab={setTab} onCamera={() => setScanner("choose")} />
      {scanner ? (
        <Scanner
          mode={scanner}
          onMode={setScanner}
          onClose={() => setScanner(null)}
          onBarcode={(code) => void openCode(code)}
          onPhoto={(dataUrl) => void onPhoto(dataUrl)}
          onManual={() => {
            setMeal(blankMeal());
            setMealNote("No photo — type what you ate, then save.");
            setScanner(null);
          }}
          mealError={mealError}
          mealBusy={mealBusy}
          photosLeft={photosLeft}
        />
      ) : null}
      {product ? (
        <ProductSheet
          product={product}
          profile={profile}
          eatenKcal={eaten}
          onClose={() => setProduct(null)}
          onOpen={(code) => void openCode(code)}
          onLog={(servings) => {
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
                sugar: portion.sugar,
              },
            });
          }}
        />
      ) : null}
      {meal ? (
        <MealSheet items={meal} note={mealNote} onChange={setMeal} onClose={() => setMeal(null)} onSave={saveMeal} />
      ) : null}
    </div>
  );
}

function fillGaps(local: Product, remote: Product): Product {
  const servingGrams = remote.servingGrams ?? local.servingGrams;
  const per100 = remote.per100.kcal > 0 ? remote.per100 : local.per100;
  const perServing = remote.perServing ?? (servingGrams ? scaleServing(per100, servingGrams) : local.perServing);
  return {
    ...remote,
    per100,
    imageUrl: remote.imageUrl ?? local.imageUrl,
    category: local.category || remote.category,
    categoryTag: local.categoryTag ?? remote.categoryTag,
    categoryTags: [...new Set([...local.categoryTags, ...remote.categoryTags])],
    servingGrams,
    servingSize: remote.perServing ? remote.servingSize : local.servingSize,
    perServing,
    nutriscore: remote.nutriscore ?? local.nutriscore,
    nova: remote.nova ?? local.nova,
    additiveTags: remote.additiveTags.length ? remote.additiveTags : local.additiveTags,
    ingredientFlags: [...new Set([...remote.ingredientFlags, ...local.ingredientFlags])],
    ingredientsText: remote.ingredientsText ?? local.ingredientsText,
  };
}

function scaleServing(per100: Product["per100"], grams: number) {
  const ratio = grams / 100;
  return {
    kcal: Math.round(per100.kcal * ratio * 10) / 10,
    protein: Math.round(per100.protein * ratio * 10) / 10,
    carbs: Math.round(per100.carbs * ratio * 10) / 10,
    fat: Math.round(per100.fat * ratio * 10) / 10,
    sugar: Math.round(per100.sugar * ratio * 10) / 10,
    salt: Math.round(per100.salt * ratio * 10) / 10,
  };
}
