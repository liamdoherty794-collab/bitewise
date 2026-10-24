import { useMemo, useState, type ReactNode } from "react";
import { Camera, ScanLine, Target } from "lucide-react";
import { Logo } from "@/components/nara/logo";
import { HEALTH_DISCLAIMER } from "@/lib/nara/copy";
import { recommendedTargets } from "@/lib/nara/goals";
import { useNara } from "@/lib/nara/store";
import { GOAL_LABEL, type GoalId, type Sex } from "@/lib/nara/types";

const GOALS: { id: GoalId; title: string; copy: string }[] = [
  { id: "lose", title: "Lose weight", copy: "A smaller day, with protein kept high." },
  { id: "maintain", title: "Stay steady", copy: "Hold your weight without drifting." },
  { id: "gain", title: "Build muscle", copy: "More food, aimed at protein." },
  { id: "cleaner", title: "Eat cleaner", copy: "Fewer ultra-processed foods, less sugar." },
];

export function Onboarding() {
  const setProfile = useNara((state) => state.setProfile);
  const [step, setStep] = useState(0);
  const [age, setAge] = useState(32);
  const [sex, setSex] = useState<Sex>("female");
  const [heightCm, setHeightCm] = useState(168);
  const [weightKg, setWeightKg] = useState(68);
  const [goal, setGoal] = useState<GoalId>("lose");
  const [metric, setMetric] = useState(true);

  const targets = useMemo(
    () => recommendedTargets({ age, sex, heightCm, weightKg, goal }),
    [age, sex, heightCm, weightKg, goal],
  );

  if (step === 0) {
    return (
      <Frame>
        <Logo className="h-16 w-16" />
        <h1 className="mt-4 font-display text-4xl font-extrabold text-ink">See the food, not the marketing.</h1>
        <p className="mt-4 text-lg text-muted">
          Scan a package or a plate. Bitewise shows the calories, whether it is extremely unhealthy, and if it fits the goal you set.
        </p>
        <ul className="mt-8 space-y-4">
          <Point icon={<ScanLine className="h-5 w-5" />} title="A plain score">
            0–100 from Nutri-Score, how processed it is, and the additives.
          </Point>
          <Point icon={<Camera className="h-5 w-5" />} title="The plate, too">
            Photograph a meal when it doesn't have a barcode. Three photo reads a day, free.
          </Point>
          <Point icon={<Target className="h-5 w-5" />} title="Your day">
            Log it against the calories and macros you actually want.
          </Point>
        </ul>
        <p className="mt-6 text-sm text-muted">{HEALTH_DISCLAIMER}</p>
        <div className="mt-auto pt-8">
          <Primary onClick={() => setStep(1)}>Set my goals</Primary>
        </div>
      </Frame>
    );
  }

  if (step === 1) {
    const feet = Math.floor(heightCm / 2.54 / 12);
    const inches = Math.round(heightCm / 2.54 - feet * 12);
    const pounds = Math.round(weightKg * 2.20462);
    return (
      <Frame>
        <StepLabel n={1} />
        <h1 className="mt-2 font-display text-4xl">About you</h1>
        <p className="mt-2 text-muted">Used once, to estimate a daily calorie target. Saved on this phone only.</p>
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            className="press text-sm font-medium text-forest"
            onClick={() => setMetric((value) => !value)}
          >
            {metric ? "Use feet and pounds" : "Use cm and kg"}
          </button>
        </div>
        <label className="mt-2 block text-sm font-medium">
          Age
          <input
            className="mt-1 w-full rounded-2xl border border-line bg-surface px-4 py-3 text-lg tabular-nums"
            inputMode="numeric"
            value={age}
            onChange={(event) => setAge(Number(event.target.value) || 0)}
          />
        </label>
        <p className="mt-4 text-sm font-medium">Sex</p>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {(["female", "male", "other"] as Sex[]).map((option) => (
            <button
              key={option}
              type="button"
              className={`press rounded-2xl border px-2 py-3 text-sm font-medium capitalize ${
                sex === option ? "border-forest bg-moss text-ink" : "border-line bg-surface text-muted"
              }`}
              onClick={() => setSex(option)}
            >
              {option}
            </button>
          ))}
        </div>
        {metric ? (
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Field label="Height (cm)" value={heightCm} onChange={setHeightCm} />
            <Field label="Weight (kg)" value={weightKg} onChange={setWeightKg} />
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-3 gap-3">
            <Field
              label="Feet"
              value={feet}
              onChange={(next) => setHeightCm(Math.round((next * 12 + inches) * 2.54))}
            />
            <Field
              label="Inches"
              value={inches}
              onChange={(next) => setHeightCm(Math.round((feet * 12 + next) * 2.54))}
            />
            <Field label="Pounds" value={pounds} onChange={(next) => setWeightKg(Math.round((next / 2.20462) * 10) / 10)} />
          </div>
        )}
        <div className="mt-auto flex gap-2 pt-8">
          <Secondary onClick={() => setStep(0)}>Back</Secondary>
          <Primary onClick={() => setStep(2)}>Continue</Primary>
        </div>
      </Frame>
    );
  }

  if (step === 2) {
    return (
      <Frame>
        <StepLabel n={2} />
        <h1 className="mt-2 font-display text-4xl">What are you aiming for?</h1>
        <div className="mt-6 grid gap-3">
          {GOALS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`press rounded-3xl border px-4 py-4 text-left ${
                goal === item.id ? "border-forest bg-moss" : "border-line bg-surface"
              }`}
              onClick={() => setGoal(item.id)}
            >
              <span className="block font-semibold">{item.title}</span>
              <span className="mt-1 block text-sm text-muted">{item.copy}</span>
            </button>
          ))}
        </div>
        <div className="mt-auto flex gap-2 pt-8">
          <Secondary onClick={() => setStep(1)}>Back</Secondary>
          <Primary onClick={() => setStep(3)}>See my day</Primary>
        </div>
      </Frame>
    );
  }

  return (
    <Frame>
      <StepLabel n={3} />
      <h1 className="mt-2 font-display text-4xl">Your day</h1>
      <p className="mt-2 text-muted">
        {GOAL_LABEL[goal]}. Estimated for a lightly active day — not medical advice. Change it any time in Profile.
      </p>
      <div className="card mt-6 rounded-3xl px-5 py-6">
        <p className="text-sm font-medium text-muted">Calories</p>
        <p className="font-display text-6xl tabular-nums text-forest">{targets.calorieTarget.toLocaleString()}</p>
        <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
          <Stat label="Protein" value={`${targets.proteinTarget}g`} />
          <Stat label="Carbs" value={`${targets.carbsTarget}g`} />
          <Stat label="Fat" value={`${targets.fatTarget}g`} />
        </div>
        <p className="mt-4 text-sm text-muted">
          Sugar budget {targets.sugarTarget}g · sodium {targets.sodiumTarget.toLocaleString()}mg
          {targets.avoidUltra ? " · ultra-processed foods get flagged." : "."}
        </p>
      </div>
      <div className="mt-auto flex gap-2 pt-8">
        <Secondary onClick={() => setStep(2)}>Back</Secondary>
        <Primary
          onClick={() =>
            setProfile({
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
              onboarded: true,
            })
          }
        >
          Start scanning
        </Primary>
      </div>
    </Frame>
  );
}

function Frame({ children }: { children: ReactNode }) {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 py-8">{children}</main>
  );
}

function Point({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-moss text-forest">{icon}</span>
      <span>
        <span className="block font-semibold">{title}</span>
        <span className="block text-sm text-muted">{children}</span>
      </span>
    </li>
  );
}

function Field({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  return (
    <label className="block text-sm font-medium">
      {label}
      <input
        className="mt-1 w-full rounded-2xl border border-line bg-surface px-3 py-3 text-lg tabular-nums"
        inputMode="decimal"
        value={Number.isFinite(value) ? value : ""}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-muted">{label}</p>
      <p className="text-lg font-semibold tabular-nums">{value}</p>
    </div>
  );
}

function StepLabel({ n }: { n: number }) {
  return <p className="text-sm font-semibold tracking-widest text-forest">STEP {n} OF 3</p>;
}

function Primary({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      className="press flex-1 rounded-full bg-fresh px-5 py-4 text-base font-semibold text-[#222]"
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function Secondary({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <button type="button" className="press rounded-full bg-moss px-5 py-4 font-semibold text-ink" onClick={onClick}>
      {children}
    </button>
  );
}
