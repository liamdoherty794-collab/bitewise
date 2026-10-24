import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Camera, ChartColumn, NotebookPen, ScanLine, Search, UserRound } from "lucide-react";
import { searchFoods } from "@/lib/nara/api";
import { featuredProducts } from "@/lib/nara/catalog";
import { dateKey, logScaled, recommendedTargets, sumLogs, weekSeries } from "@/lib/nara/goals";
import { HEALTH_DISCLAIMER } from "@/lib/nara/copy";
import { bandClasses, scoreProduct } from "@/lib/nara/scoring";
import { useNara } from "@/lib/nara/store";
import { GOAL_LABEL, type GoalId, type Product, type Sex } from "@/lib/nara/types";
import { MacroBar, Ring } from "@/components/nara/bits";
import { Logo } from "@/components/nara/logo";
import { photoScanStatus } from "@/lib/nara/photo-scans";

export type TabId = "scan" | "diary" | "history" | "profile";

export function ScanScreen({
  onOpen,
  onBarcode,
  onMeal,
  photosLeft,
}: {
  onOpen: (code: string) => void;
  onBarcode: () => void;
  onMeal: () => void;
  photosLeft: number | null;
}) {
  const recents = useNara((state) => state.recents);
  const profile = useNara((state) => state.profile);
  const logs = useNara((state) => state.logs);
  const eaten = Math.round(sumLogs(logs.filter((item) => item.date === dateKey())).kcal);
  const left = profile.calorieTarget - eaten;
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [searchNote, setSearchNote] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);
  const samples = featuredProducts();
  const barcode = query.replace(/\D/g, "");
  const barcodeQuery = /^\d[\d\s]{7,}$/.test(query.trim());

  useEffect(() => {
    const q = query.trim();
    if (barcodeQuery || q.length < 2) {
      setResults([]);
      setSearchNote(null);
      setSearching(false);
      return;
    }
    setSearching(true);
    const handle = window.setTimeout(() => {
      void searchFoods({ data: { query: q } })
        .then((result) => {
          setResults(result.products);
          setSearchNote(
            result.products.length
              ? result.kind === "offline"
                ? "Showing saved aisle samples. Live search didn't respond."
                : null
              : result.kind === "offline"
                ? "Can't reach the food database, and nothing in the sample aisle matches."
                : "No match. Try the barcode under the stripes.",
          );
        })
        .catch(() => setSearchNote("Search failed. Try a sample below."))
        .finally(() => setSearching(false));
    }, 280);
    return () => window.clearTimeout(handle);
  }, [query, barcodeQuery]);

  const today = new Date().toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" });

  return (
    <div className="px-5 pt-6">
      <div className="flex items-center gap-2">
        <Logo className="h-9 w-9" />
        <p className="text-sm font-extrabold tracking-wide">Bitewise</p>
      </div>
      <p className="mt-4 text-sm font-medium text-muted">{today}</p>
      <h1 className="mt-1 font-display text-4xl">Scan the aisle</h1>
      <p className="mt-2 text-sm text-muted">
        {GOAL_LABEL[profile.goal]} · {left >= 0 ? `${left.toLocaleString()} kcal left` : `${Math.abs(left).toLocaleString()} kcal over`}
      </p>

      <form
        className="mt-5"
        onSubmit={(event) => {
          event.preventDefault();
          if (barcode.length >= 8) onOpen(barcode);
        }}
      >
        <label className="flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-3">
          <Search className="h-4 w-4 text-muted" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search a food or type a barcode"
            className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted"
            aria-label="Search foods"
          />
        </label>
        {barcodeQuery ? (
          <button type="submit" className="press mt-3 w-full rounded-full bg-moss py-3 text-sm font-semibold">
            Look up barcode {barcode}
          </button>
        ) : null}
      </form>

      {searching ? <p className="mt-3 text-sm text-muted">Looking it up…</p> : null}
      {searchNote ? <p className="mt-3 text-sm text-muted">{searchNote}</p> : null}
      {results.length > 0 ? (
        <ul className="mt-3 space-y-2">
          {results.map((item) => (
            <ResultRow key={item.code} product={item} onOpen={onOpen} />
          ))}
        </ul>
      ) : null}

      <div className="mt-5 grid grid-cols-2 gap-3">
        <button type="button" className="press rounded-3xl bg-fresh px-4 py-4 text-left text-[#222]" onClick={onBarcode}>
          <ScanLine className="h-6 w-6" />
          <span className="mt-3 block font-semibold">Scan a barcode</span>
          <span className="mt-1 block text-sm text-[#222]/75">Score the package in your hand.</span>
        </button>
        <button type="button" className="press rounded-3xl border border-line bg-surface px-4 py-4 text-left" onClick={onMeal}>
          <Camera className="h-6 w-6 text-forest" />
          <span className="mt-3 block font-semibold">Photograph a meal</span>
          <span className="mt-1 block text-sm text-muted">
            {photosLeft === 0 ? "Today's 3 photos are used. Type the meal instead." : photosLeft == null ? "Calories and macros from the plate." : `${photosLeft} photo ${photosLeft === 1 ? "estimate" : "estimates"} left today.`}
          </span>
        </button>
      </div>

      <h2 className="mt-8 font-sans text-sm font-semibold tracking-wide text-muted">TRY A SAMPLE</h2>
      <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
        {samples.map((item) => {
          const scored = scoreProduct(item);
          const tone = bandClasses(scored.band);
          return (
            <button
              key={item.code}
              type="button"
              className="press w-36 shrink-0 rounded-3xl border border-line bg-surface p-3 text-left"
              onClick={() => onOpen(item.code)}
            >
              <span className={`font-display text-3xl tabular-nums ${tone.text}`}>{scored.score}</span>
              <span className="mt-2 block text-sm font-semibold leading-tight">{item.name}</span>
              <span className="mt-1 block text-xs text-muted">{scored.label}</span>
            </button>
          );
        })}
      </div>

      {recents.length > 0 ? (
        <>
          <h2 className="mt-6 font-sans text-sm font-semibold tracking-wide text-muted">RECENT</h2>
          <ul className="mt-3 space-y-2">
            {recents.map((item) => (
              <li key={item.code}>
                <button
                  type="button"
                  className="press flex w-full items-center justify-between rounded-2xl border border-line bg-surface px-4 py-3 text-left"
                  onClick={() => onOpen(item.code)}
                >
                  <span>
                    <span className="block font-semibold">{item.name}</span>
                    <span className="block text-sm text-muted">
                      {item.brand}
                      {item.kcal != null ? ` · ${Math.round(item.kcal)} kcal` : ""}
                    </span>
                  </span>
                  <span
                    className={`font-display text-2xl tabular-nums ${bandClasses(item.score >= 67 ? "green" : item.score >= 34 ? "orange" : "red").text}`}
                  >
                    {item.score}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </div>
  );
}

function ResultRow({ product, onOpen }: { product: Product; onOpen: (code: string) => void }) {
  const scored = scoreProduct(product);
  const tone = bandClasses(scored.band);
  return (
    <li>
      <button
        type="button"
        className="press flex w-full items-center justify-between gap-3 rounded-2xl border border-line bg-surface px-4 py-3 text-left"
        onClick={() => onOpen(product.code)}
      >
        <span className="min-w-0">
          <span className="block truncate font-semibold">{product.name}</span>
          <span className="block truncate text-sm text-muted">{product.brand}</span>
        </span>
        <span className={`font-display text-2xl tabular-nums ${tone.text}`}>{scored.score}</span>
      </button>
    </li>
  );
}

export function DiaryScreen({
  date,
  onDate,
  onCamera,
}: {
  date: string;
  onDate: (date: string) => void;
  onCamera: () => void;
}) {
  const logs = useNara((state) => state.logs);
  const profile = useNara((state) => state.profile);
  const setServings = useNara((state) => state.setServings);
  const removeLog = useNara((state) => state.removeLog);
  const today = dateKey();
  const items = logs.filter((item) => item.date === date);
  const totals = sumLogs(items);
  const over = totals.kcal > profile.calorieTarget;
  const band = over ? "red" : totals.kcal > profile.calorieTarget * 0.9 ? "orange" : "green";

  return (
    <div className="px-5 pt-6">
      <p className="text-sm font-medium text-muted">Diary</p>
      <div className="mt-1 flex items-end justify-between gap-3">
        <h1 className="font-display text-4xl">{date === today ? "Today" : weekdayLabel(date)}</h1>
        <div className="flex gap-2 pb-1">
          <button
            type="button"
            className="press h-11 w-11 rounded-full bg-moss text-lg font-semibold"
            aria-label="Previous day"
            onClick={() => onDate(shiftDate(date, -1))}
          >
            ‹
          </button>
          <button
            type="button"
            className="press h-11 w-11 rounded-full bg-moss text-lg font-semibold disabled:opacity-40"
            aria-label="Next day"
            disabled={date >= today}
            onClick={() => onDate(shiftDate(date, 1))}
          >
            ›
          </button>
        </div>
      </div>
      <div className="mt-6 flex items-center gap-4">
        <Ring value={totals.kcal} max={profile.calorieTarget} band={band}>
          <p className="font-display text-3xl tabular-nums">{Math.round(totals.kcal)}</p>
          <p className="text-xs text-muted">of {profile.calorieTarget}</p>
        </Ring>
        <div>
          <p className="font-display text-3xl">{over ? "Over" : "Left"}</p>
          <p className="text-lg tabular-nums text-muted">
            {Math.abs(Math.round(profile.calorieTarget - totals.kcal)).toLocaleString()} kcal
          </p>
          <p className="text-sm text-muted">{GOAL_LABEL[profile.goal]}</p>
        </div>
      </div>
      <div className="mt-6 space-y-3">
        <MacroBar label="Protein" value={totals.protein} max={profile.proteinTarget} unit="g" />
        <MacroBar label="Carbs" value={totals.carbs} max={profile.carbsTarget} unit="g" />
        <MacroBar label="Fat" value={totals.fat} max={profile.fatTarget} unit="g" />
        <MacroBar label="Sugar" value={totals.sugar} max={profile.sugarTarget} unit="g" />
      </div>
      <h2 className="mt-8 font-sans text-sm font-semibold tracking-wide text-muted">LOGGED</h2>
      {items.length === 0 ? (
        <div className="mt-3 rounded-3xl border border-dashed border-line px-4 py-8 text-center">
          <p className="font-medium">{date === today ? "Nothing logged today." : "Nothing logged this day."}</p>
          <p className="mt-1 text-sm text-muted">Scan a barcode or photograph a meal.</p>
          <button type="button" className="press mt-4 rounded-full bg-fresh px-5 py-3 text-sm font-semibold text-[#222]" onClick={onCamera}>
            Scan something
          </button>
        </div>
      ) : (
        <ul className="mt-3 space-y-2">
          {items.map((item) => {
            const scaled = logScaled(item);
            return (
              <li key={item.id} className="rounded-2xl border border-line bg-surface px-4 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{item.name}</p>
                    <p className="truncate text-sm text-muted">
                      {item.detail || (item.source === "meal" ? "From a photo" : "Logged")}
                      {item.score != null ? ` · score ${item.score}` : ""}
                    </p>
                  </div>
                  <p className="font-semibold tabular-nums">{Math.round(scaled.kcal)}</p>
                </div>
                <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-sm text-muted">
                  <span className="tabular-nums">
                    {Math.round(scaled.protein)}p · {Math.round(scaled.carbs)}c · {Math.round(scaled.fat)}f
                  </span>
                  <span className="flex items-center gap-2">
                    <button type="button" className="press h-9 w-9 rounded-full bg-moss font-semibold text-ink" onClick={() => setServings(item.id, item.servings - 0.5)} aria-label="Decrease">
                      −
                    </button>
                    <span className="tabular-nums text-ink">{item.servings}×</span>
                    <button type="button" className="press h-9 w-9 rounded-full bg-moss font-semibold text-ink" onClick={() => setServings(item.id, item.servings + 0.5)} aria-label="Increase">
                      +
                    </button>
                    <button type="button" className="press text-clay" onClick={() => removeLog(item.id)}>
                      Remove
                    </button>
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export function HistoryScreen({ onOpenDay }: { onOpenDay: (date: string) => void }) {
  const logs = useNara((state) => state.logs);
  const goal = useNara((state) => state.profile.calorieTarget);
  const days = useMemo(() => weekSeries(logs), [logs]);
  const weekKcal = days.reduce((sum, day) => sum + day.calories, 0);
  const [Chart, setChart] = useState<typeof import("recharts") | null>(null);

  useEffect(() => {
    void import("recharts").then(setChart);
  }, []);

  return (
    <div className="px-5 pt-6">
      <p className="text-sm font-medium text-muted">History</p>
      <h1 className="mt-1 font-display text-4xl">This week</h1>
      <p className="mt-2 text-sm text-muted">
        {weekKcal.toLocaleString()} kcal logged · target {goal.toLocaleString()} a day. Tap a day to open it.
      </p>
      <div className="card mt-5 h-56 rounded-3xl px-2 py-4">
        {weekKcal === 0 ? (
          <div className="grid h-full place-items-center px-6 text-center text-sm text-muted">
            Log a few foods and the week will draw itself here.
          </div>
        ) : Chart ? (
          <Chart.ResponsiveContainer width="100%" height="100%">
            <Chart.BarChart data={days} barSize={16}>
              <Chart.XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "var(--color-muted)", fontSize: 12 }} />
              <Chart.YAxis hide domain={[0, Math.max(goal, ...days.map((day) => day.calories), 1)]} />
              <Chart.Tooltip
                cursor={{ fill: "var(--color-moss)" }}
                contentStyle={{
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-line)",
                  borderRadius: 12,
                  color: "var(--color-ink)",
                }}
                formatter={(value) => [`${value} kcal`, "Eaten"]}
                labelFormatter={(_label, payload) => {
                  const row = payload?.[0]?.payload as { name?: string } | undefined;
                  return row?.name ?? "";
                }}
              />
              <Chart.ReferenceLine y={goal} stroke="var(--color-muted)" strokeDasharray="3 4" />
              <Chart.Bar dataKey="calories" fill="var(--color-forest)" radius={[6, 6, 0, 0]} />
            </Chart.BarChart>
          </Chart.ResponsiveContainer>
        ) : (
          <div className="h-full rounded-2xl bg-moss" />
        )}
      </div>
      <ul className="mt-5 space-y-2">
        {[...days].reverse().map((day) => (
          <li key={day.key}>
            <button
              type="button"
              className="press flex w-full items-center justify-between rounded-2xl border border-line bg-surface px-4 py-3 text-left"
              onClick={() => onOpenDay(day.key)}
            >
              <span className="font-medium">{day.name}</span>
              <span className="tabular-nums text-muted">{day.calories.toLocaleString()} kcal</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ProfileScreen() {
  const profile = useNara((state) => state.profile);
  const setProfile = useNara((state) => state.setProfile);
  const resetAll = useNara((state) => state.resetAll);
  const [theme, setThemeState] = useState<"light" | "dark">("light");
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    setThemeState(document.documentElement.classList.contains("dark") ? "dark" : "light");
  }, []);

  function setTheme(next: "light" | "dark") {
    document.documentElement.classList.toggle("dark", next === "dark");
    localStorage.setItem("bitewise-theme", next);
    setThemeState(next);
  }

  function apply(partial: Partial<typeof profile>, recalc = false) {
    const next = { ...profile, ...partial };
    if (recalc) {
      const targets = recommendedTargets(next);
      setProfile({ ...next, ...targets, onboarded: true });
      return;
    }
    setProfile(next);
  }

  return (
    <div className="px-5 pt-6">
      <p className="text-sm font-medium text-muted">Profile</p>
      <h1 className="mt-1 font-display text-4xl">Your targets</h1>
      <p className="mt-4 rounded-3xl border border-line bg-surface px-4 py-3 text-sm">
        Free plan. {photoScanStatus().remaining === 0 ? "No meal photos left today — they reset tomorrow." : `${photoScanStatus().remaining ?? "Unlimited"} meal photos left today.`} Barcodes stay unlimited.
      </p>
      <div className="mt-3 flex items-center justify-between rounded-3xl border border-line bg-surface px-4 py-3">
        <span className="font-medium">Appearance</span>
        <button type="button" className="press rounded-full bg-moss px-4 py-2 text-sm font-semibold" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          {theme === "dark" ? "Dark" : "Light"}
        </button>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <Num label="Age" value={profile.age} onChange={(age) => apply({ age })} />
        <Num label="Weight kg" value={profile.weightKg} onChange={(weightKg) => apply({ weightKg })} />
        <Num label="Height cm" value={profile.heightCm} onChange={(heightCm) => apply({ heightCm })} />
        <Num label="Calories" value={profile.calorieTarget} onChange={(calorieTarget) => apply({ calorieTarget })} />
        <Num label="Protein g" value={profile.proteinTarget} onChange={(proteinTarget) => apply({ proteinTarget })} />
        <Num label="Carbs g" value={profile.carbsTarget} onChange={(carbsTarget) => apply({ carbsTarget })} />
        <Num label="Fat g" value={profile.fatTarget} onChange={(fatTarget) => apply({ fatTarget })} />
        <Num label="Sugar g" value={profile.sugarTarget} onChange={(sugarTarget) => apply({ sugarTarget })} />
      </div>
      <p className="mt-4 text-sm font-medium">Sex</p>
      <div className="mt-2 grid grid-cols-3 gap-2">
        {(["female", "male", "other"] as Sex[]).map((sex) => (
          <button
            key={sex}
            type="button"
            className={`press rounded-2xl border py-3 text-sm font-medium capitalize ${
              profile.sex === sex ? "border-forest bg-moss" : "border-line bg-surface text-muted"
            }`}
            onClick={() => apply({ sex })}
          >
            {sex}
          </button>
        ))}
      </div>
      <p className="mt-4 text-sm font-medium">Goal</p>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {(Object.keys(GOAL_LABEL) as GoalId[]).map((goal) => (
          <button
            key={goal}
            type="button"
            className={`press rounded-2xl border px-3 py-3 text-sm font-medium ${
              profile.goal === goal ? "border-forest bg-moss" : "border-line bg-surface text-muted"
            }`}
            onClick={() => apply({ goal }, true)}
          >
            {GOAL_LABEL[goal]}
          </button>
        ))}
      </div>
      <button type="button" className="press mt-4 w-full rounded-full bg-moss py-3 font-semibold" onClick={() => apply({}, true)}>
        Recalculate from my stats
      </button>
      <button
        type="button"
        className="press mt-3 w-full rounded-full border border-line py-3 text-sm font-medium"
        onClick={() => apply({ avoidUltra: !profile.avoidUltra })}
      >
        {profile.avoidUltra ? "Flagging ultra-processed foods" : "Not flagging ultra-processed foods"}
      </button>

      <section className="mt-8 text-sm text-muted">
        <h2 className="font-sans text-sm font-semibold tracking-wide text-ink">HOW THE SCORE WORKS</h2>
        <p className="mt-2">
          65% nutrition (Nutri-Score when the label has one), 20% NOVA processing, 15% additives. Under 34 is red. Extremely unhealthy means a bad score plus an ultra-processed, high-sugar or high-saturated-fat recipe.
        </p>
        <p className="mt-2">{HEALTH_DISCLAIMER}</p>
        <p className="mt-2">
          The diary stays in this phone's browser storage. A meal photo is sent to the server, then to Google, to make an estimate. The host keeps its own request logs, described in the privacy policy.
        </p>
      </section>

      <button type="button" className="press mt-6 w-full rounded-full bg-moss py-3 font-semibold" onClick={() => void exportDiary()}>
        Export diary
      </button>

      <button
        type="button"
        className="press mt-8 text-sm font-medium text-clay"
        onClick={() => {
          if (!armed) {
            setArmed(true);
            return;
          }
          resetAll();
          setArmed(false);
        }}
      >
        {armed ? "Tap again to erase this phone's diary" : "Erase diary and goals"}
      </button>
    </div>
  );
}

function exportDiary() {
  const { profile, logs, recents } = useNara.getState();
  const file = new File(
    [
      JSON.stringify(
        { exportedAt: new Date().toISOString(), profile, logs, recents },
        null,
        2,
      ),
    ],
    `bitewise-diary-${dateKey()}.json`,
    { type: "application/json" },
  );
  const share = navigator.share?.bind(navigator);
  if (share && navigator.canShare?.({ files: [file] })) {
    void share({ files: [file], title: "Bitewise diary" }).catch(() => downloadFile(file));
    return;
  }
  downloadFile(file);
}

function downloadFile(file: File) {
  const url = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = url;
  link.download = file.name;
  link.click();
  URL.revokeObjectURL(url);
}

function weekdayLabel(key: string) {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, (month ?? 1) - 1, day ?? 1).toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

function shiftDate(key: string, by: number) {
  const [year, month, day] = key.split("-").map(Number);
  const date = new Date(year, (month ?? 1) - 1, day ?? 1);
  date.setDate(date.getDate() + by);
  return dateKey(date);
}

function Num({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  return (
    <label className="block text-sm font-medium">
      {label}
      <input
        inputMode="decimal"
        value={Number.isFinite(value) ? value : ""}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-1 w-full rounded-2xl border border-line bg-surface px-3 py-3 text-lg tabular-nums"
      />
    </label>
  );
}

export function TabBar({ tab, onTab, onCamera }: { tab: TabId; onTab: (tab: TabId) => void; onCamera: () => void }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 flex justify-center">
      <nav className="tabbar-pad grid w-full max-w-md grid-cols-5 items-end border-t border-line bg-paper px-1 pt-1">
        <TabButton id="scan" label="Scan" active={tab === "scan"} onClick={() => onTab("scan")} icon={<ScanLine className="h-5 w-5" />} />
        <TabButton id="diary" label="Diary" active={tab === "diary"} onClick={() => onTab("diary")} icon={<NotebookPen className="h-5 w-5" />} />
        <div className="flex justify-center">
          <button
            type="button"
            className="press -mt-6 grid h-16 w-16 place-items-center rounded-full bg-fresh text-[#222] shadow-lg"
            onClick={onCamera}
            aria-label="Open camera"
          >
            <Camera className="h-7 w-7" />
          </button>
        </div>
        <TabButton id="history" label="History" active={tab === "history"} onClick={() => onTab("history")} icon={<ChartColumn className="h-5 w-5" />} />
        <TabButton id="profile" label="Profile" active={tab === "profile"} onClick={() => onTab("profile")} icon={<UserRound className="h-5 w-5" />} />
      </nav>
    </div>
  );
}

function TabButton({
  label,
  active,
  onClick,
  icon,
}: {
  id: TabId;
  label: string;
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
}) {
  return (
    <button type="button" className={`press flex flex-col items-center gap-1 py-2 text-xs font-medium ${active ? "text-forest" : "text-muted"}`} onClick={onClick}>
      {icon}
      {label}
    </button>
  );
}
