import type { Patient } from "../mock/archiveMockData";

const STORAGE_KEY = "weiai.crm.patients";

type StoredPatients = Patient[];

function safeParsePatients(raw: string | null): StoredPatients {
  try {
    const parsed = JSON.parse(raw ?? "[]") as unknown;
    return Array.isArray(parsed) ? (parsed as StoredPatients) : [];
  } catch {
    return [];
  }
}

export function getLocalPatients(): Patient[] {
  return safeParsePatients(window.localStorage.getItem(STORAGE_KEY));
}

export function setLocalPatients(next: Patient[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function isLocalPatientId(id: string) {
  return id.startsWith("lp-");
}

function createLocalPatientId() {
  return `lp-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function createLocalPatientNo() {
  const year = new Date().getFullYear();
  const suffix = String(Date.now()).slice(-5);
  return `P${year}${suffix}`;
}

export function addLocalPatient(input: Omit<Patient, "id" | "no">): Patient {
  const created: Patient = { ...input, id: createLocalPatientId(), no: createLocalPatientNo() };
  const existing = getLocalPatients();
  setLocalPatients([created, ...existing]);
  return created;
}

export function removeLocalPatient(id: string) {
  const existing = getLocalPatients();
  setLocalPatients(existing.filter((p) => p.id !== id));
}

export function getMergedPatients(mockPatients: Patient[]): Patient[] {
  const local = getLocalPatients();
  const map = new Map<string, Patient>();
  for (const p of local) map.set(p.id, p);
  for (const p of mockPatients) {
    if (!map.has(p.id)) map.set(p.id, p);
  }
  return Array.from(map.values());
}

export function findMergedPatientById(mockPatients: Patient[], id: string): Patient | null {
  const merged = getMergedPatients(mockPatients);
  return merged.find((p) => p.id === id) ?? null;
}
