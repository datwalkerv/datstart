"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { createId } from "./id";
import { STATE_VERSION, STORAGE_KEY, createDefaultState } from "./defaults";
import type {
  AppState,
  BackgroundSettings,
  ClockSettings,
  Coords,
  Pin,
  SearchSettings,
  WeatherSettings,
} from "./types";

type Actions = {
  // search
  setSearch: (patch: Partial<SearchSettings>) => void;
  // background
  setBackground: (patch: Partial<BackgroundSettings>) => void;
  // cards
  addCard: (title: string) => void;
  renameCard: (cardId: string, title: string) => void;
  removeCard: (cardId: string) => void;
  reorderCards: (from: number, to: number) => void;
  // pins
  addPin: (cardId: string, pin: Omit<Pin, "id">) => void;
  updatePin: (cardId: string, pinId: string, patch: Partial<Pin>) => void;
  removePin: (cardId: string, pinId: string) => void;
  reorderPins: (cardId: string, from: number, to: number) => void;
  movePin: (
    fromCardId: string,
    toCardId: string,
    pinId: string,
    toIndex: number,
  ) => void;
  // misc
  setWeather: (patch: Partial<WeatherSettings>) => void;
  setCoords: (coords: Coords) => void;
  setClock: (patch: Partial<ClockSettings>) => void;
  importState: (state: AppState) => void;
  resetState: () => void;
};

export type Store = AppState & Actions;

/** localStorage is unavailable during SSR; persist falls back to this. */
const noopStorage: Storage = {
  length: 0,
  clear: () => {},
  getItem: () => null,
  key: () => null,
  removeItem: () => {},
  setItem: () => {},
};

function move<T>(list: T[], from: number, to: number): T[] {
  if (from === to || from < 0 || to < 0 || from >= list.length) return list;
  const next = list.slice();
  const [item] = next.splice(from, 1);
  next.splice(Math.min(to, next.length), 0, item);
  return next;
}

export const useStore = create<Store>()(
  persist(
    (set) => ({
      ...createDefaultState(),

      setSearch: (patch) =>
        set((s) => ({ search: { ...s.search, ...patch } })),

      setBackground: (patch) =>
        set((s) => ({ background: { ...s.background, ...patch } })),

      addCard: (title) =>
        set((s) => ({
          cards: [
            ...s.cards,
            { id: createId("card"), title: title.trim() || "Untitled", pins: [] },
          ],
        })),

      renameCard: (cardId, title) =>
        set((s) => ({
          cards: s.cards.map((c) => (c.id === cardId ? { ...c, title } : c)),
        })),

      removeCard: (cardId) =>
        set((s) => ({ cards: s.cards.filter((c) => c.id !== cardId) })),

      reorderCards: (from, to) => set((s) => ({ cards: move(s.cards, from, to) })),

      addPin: (cardId, pin) =>
        set((s) => ({
          cards: s.cards.map((c) =>
            c.id === cardId
              ? { ...c, pins: [...c.pins, { ...pin, id: createId("pin") }] }
              : c,
          ),
        })),

      updatePin: (cardId, pinId, patch) =>
        set((s) => ({
          cards: s.cards.map((c) =>
            c.id === cardId
              ? {
                  ...c,
                  pins: c.pins.map((p) =>
                    p.id === pinId ? { ...p, ...patch } : p,
                  ),
                }
              : c,
          ),
        })),

      removePin: (cardId, pinId) =>
        set((s) => ({
          cards: s.cards.map((c) =>
            c.id === cardId
              ? { ...c, pins: c.pins.filter((p) => p.id !== pinId) }
              : c,
          ),
        })),

      reorderPins: (cardId, from, to) =>
        set((s) => ({
          cards: s.cards.map((c) =>
            c.id === cardId ? { ...c, pins: move(c.pins, from, to) } : c,
          ),
        })),

      movePin: (fromCardId, toCardId, pinId, toIndex) =>
        set((s) => {
          const source = s.cards.find((c) => c.id === fromCardId);
          const pin = source?.pins.find((p) => p.id === pinId);
          if (!pin) return s;
          return {
            cards: s.cards.map((c) => {
              if (c.id === fromCardId) {
                return { ...c, pins: c.pins.filter((p) => p.id !== pinId) };
              }
              if (c.id === toCardId) {
                const pins = c.pins.slice();
                pins.splice(Math.max(0, Math.min(toIndex, pins.length)), 0, pin);
                return { ...c, pins };
              }
              return c;
            }),
          };
        }),

      setWeather: (patch) =>
        set((s) => ({ weather: { ...s.weather, ...patch } })),

      setCoords: (coords) =>
        set((s) => ({ weather: { ...s.weather, coords } })),

      setClock: (patch) => set((s) => ({ clock: { ...s.clock, ...patch } })),

      importState: (state) =>
        set(() => ({ ...createDefaultState(), ...state, version: STATE_VERSION })),

      resetState: () => set(() => createDefaultState()),
    }),
    {
      name: STORAGE_KEY,
      version: STATE_VERSION,
      storage: createJSONStorage(() =>
        typeof window === "undefined" ? noopStorage : window.localStorage,
      ),
      partialize: (s): AppState => ({
        version: s.version,
        search: s.search,
        background: s.background,
        cards: s.cards,
        weather: s.weather,
        clock: s.clock,
      }),
    },
  ),
);

export function exportState(state: AppState): string {
  return JSON.stringify(
    {
      version: state.version,
      search: state.search,
      background: state.background,
      cards: state.cards,
      weather: state.weather,
      clock: state.clock,
    },
    null,
    2,
  );
}
