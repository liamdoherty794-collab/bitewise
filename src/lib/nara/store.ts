import { create } from "zustand";
import { persist } from "zustand/middleware";
import { dateKey, emptyProfile } from "@/lib/nara/goals";
import type { LogBase, LogItem, Profile, RecentScan } from "@/lib/nara/types";

type NaraState = {
  profile: Profile;
  logs: LogItem[];
  recents: RecentScan[];
  setProfile: (profile: Profile) => void;
  addLog: (input: {
    name: string;
    detail: string;
    source: LogItem["source"];
    barcode: string | null;
    score: number | null;
    servings: number;
    base: LogBase;
    date?: string;
  }) => void;
  setServings: (id: string, servings: number) => void;
  removeLog: (id: string) => void;
  rememberScan: (scan: Omit<RecentScan, "at">) => void;
  resetAll: () => void;
};

export const useNara = create<NaraState>()(
  persist(
    (set) => ({
      profile: emptyProfile(),
      logs: [],
      recents: [],
      setProfile: (profile) => set({ profile }),
      addLog: (input) =>
        set((state) => ({
          logs: [
            {
              id: uid(),
              date: input.date ?? dateKey(),
              createdAt: Date.now(),
              name: input.name,
              detail: input.detail,
              source: input.source,
              barcode: input.barcode,
              score: input.score,
              servings: input.servings,
              base: input.base,
            },
            ...state.logs,
          ].slice(0, 400),
        })),
      setServings: (id, servings) =>
        set((state) => ({
          logs: state.logs.map((item) =>
            item.id === id ? { ...item, servings: Math.max(0.25, Math.min(8, servings)) } : item,
          ),
        })),
      removeLog: (id) => set((state) => ({ logs: state.logs.filter((item) => item.id !== id) })),
      rememberScan: (scan) =>
        set((state) => ({
          recents: [
            { ...scan, at: Date.now() },
            ...state.recents.filter((item) => item.code !== scan.code),
          ].slice(0, 12),
        })),
      resetAll: () => set({ profile: emptyProfile(), logs: [], recents: [] }),
    }),
    {
      name: "nara-v1",
      skipHydration: true,
      partialize: (state) => ({
        profile: state.profile,
        logs: state.logs,
        recents: state.recents,
      }),
    },
  ),
);

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}
