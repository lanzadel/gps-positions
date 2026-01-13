import { loadPositions, savePositions } from "./storage";
import { CreatePositionInput, GpsPosition, UpdatePositionInput } from "./types";

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function nowIso() {
  return new Date().toISOString();
}

function uid() {
  return Math.random().toString(16).slice(2) + "_" + Date.now().toString(16);
}

export const api = {
  async list(): Promise<GpsPosition[]> {
    await sleep(450);
    const items = loadPositions();
    return items.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  },

  async create(input: CreatePositionInput): Promise<GpsPosition> {
    await sleep(600);
    const items = loadPositions();

    const exists = items.some(
      (p) => p.name.trim().toLowerCase() === input.name.trim().toLowerCase()
    );
    if (exists) {
      throw new Error("Une position avec ce nom existe déjà.");
    }

    const item: GpsPosition = {
      id: uid(),
      name: input.name.trim(),
      lat: input.lat,
      lng: input.lng,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };

    savePositions([item, ...items]);
    return item;
  },

  async update(input: UpdatePositionInput): Promise<GpsPosition> {
    await sleep(550);
    const items = loadPositions();

    const dup = items.some(
      (p) =>
        p.id !== input.id &&
        p.name.trim().toLowerCase() === input.name.trim().toLowerCase()
    );
    if (dup) throw new Error("Une autre position porte déjà ce nom.");

    const idx = items.findIndex((p) => p.id === input.id);
    if (idx === -1) throw new Error("Position introuvable.");

    const updated: GpsPosition = {
      ...items[idx],
      name: input.name.trim(),
      lat: input.lat,
      lng: input.lng,
      updatedAt: nowIso(),
    };

    const next = [...items];
    next[idx] = updated;
    savePositions(next);
    return updated;
  },

  async remove(id: string): Promise<void> {
    await sleep(450);
    const items = loadPositions();
    savePositions(items.filter((p) => p.id !== id));
  },
};