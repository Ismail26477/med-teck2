import { useSyncExternalStore } from "react";
import { authAPI, medicationAPI, allergyAPI, conditionAPI, fileAPI, reportAPI } from "./api";
import { sessionManager } from "./session";

// ============ Types ============
export type Severity = "mild" | "moderate" | "severe";
export type FileCategory = "scan" | "report" | "prescription" | "other";

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
}

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  dob?: string;
  gender?: string;
  bloodType?: string;
  heightCm?: number;
  weightKg?: number;
  emergencyContacts: EmergencyContact[];
  createdAt: string;
}

export interface Allergy {
  _id: string;
  userId: string;
  name: string;
  severity: Severity;
  notes?: string;
  createdAt: string;
}

export interface Medication {
  _id: string;
  userId: string;
  name: string;
  dose: string;
  frequency: string;
  prescriber?: string;
  notes?: string;
  createdAt: string;
}

export interface Condition {
  _id: string;
  userId: string;
  name: string;
  notes?: string;
  createdAt: string;
}

export interface FileRecord {
  _id?: string;
  id?: string;
  userId: string;
  category: FileCategory;
  title: string;
  date: string;
  notes?: string;
  mimeType: string;
  dataUrl?: string;
  createdAt?: string;
}

export interface Report {
  _id: string;
  userId: string;
  title: string;
  type: string;
  date: string;
  doctor?: string;
  clinic?: string;
  description?: string;
  findings?: string;
  recommendations?: string;
  fileUrl?: string;
  createdAt: string;
}

export interface ShareState {
  enabled: boolean;
  token: string;
  expiresAt: number | null;
}

export interface AppData {
  user: UserProfile | null;
  allergies: Allergy[];
  medications: Medication[];
  conditions: Condition[];
  files: FileRecord[];
  reports: Report[];
  share: ShareState;
  isLoading: boolean;
}

// ============ Storage ============
const emptyData = (): AppData => ({
  user: null,
  allergies: [],
  medications: [],
  conditions: [],
  files: [],
  reports: [],
  share: { enabled: false, token: randomToken(), expiresAt: null },
  isLoading: false,
});

function randomToken() {
  const arr = new Uint8Array(16);
  if (typeof crypto !== "undefined") crypto.getRandomValues(arr);
  return Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
}

let state: AppData = emptyData();
const listeners = new Set<() => void>();

// Initialize store from session on app load
function initializeStore() {
  const session = sessionManager.getSession();
  if (session) {
    // Create a minimal user object from session
    setState((s) => ({
      ...s,
      user: {
        _id: session.userId,
        email: session.email,
        name: session.name,
        emergencyContacts: [],
        createdAt: new Date().toISOString(),
      },
    }));
  }
}

// Call on app startup
initializeStore();

function setState(updater: (s: AppData) => AppData) {
  state = updater(state);
  listeners.forEach((l) => l());
}

function notifyListeners() {
  listeners.forEach((l) => l());
}

// ============ Hook ============
export function useStore<T>(selector: (s: AppData) => T): T {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => selector(state),
    () => selector(state)
  );
}

export const getState = () => state;

// ============ Auth - Now using API ============
export async function signup(name: string, email: string, password: string, dob: string) {
  setState((s) => ({ ...s, isLoading: true }));
  try {
    const response = await authAPI.signup(name, email, password, dob);
    if (response.success && response.data) {
      const user: UserProfile = {
        _id: response.data._id,
        name: response.data.name,
        email: response.data.email,
        dob: response.data.dob,
        emergencyContacts: response.data.emergencyContacts || [],
        createdAt: response.data.createdAt,
      };
      setState((s) => ({ ...s, user, isLoading: false }));
      return user;
    } else {
      setState((s) => ({ ...s, isLoading: false }));
      throw new Error(response.error || "Signup failed");
    }
  } catch (error) {
    setState((s) => ({ ...s, isLoading: false }));
    throw error;
  }
}

export async function login(email: string, password: string) {
  setState((s) => ({ ...s, isLoading: true }));
  try {
    const response = await authAPI.login(email, password);
    if (response.success && response.data) {
      const user: UserProfile = {
        _id: response.data._id,
        name: response.data.name,
        email: response.data.email,
        dob: response.data.dob,
        emergencyContacts: response.data.emergencyContacts || [],
        createdAt: response.data.createdAt,
      };
      setState((s) => ({ ...s, user, isLoading: false }));
      return user;
    } else {
      setState((s) => ({ ...s, isLoading: false }));
      throw new Error(response.error || "Login failed");
    }
  } catch (error) {
    setState((s) => ({ ...s, isLoading: false }));
    throw error;
  }
}

export function logout() {
  sessionManager.clearSession();
  setState(() => emptyData());
}

export function setSession(userId: string) {
  sessionManager.setSession({ userId, email: state.user?.email || "", name: state.user?.name || "" });
}

export function isAuthenticated(): boolean {
  return sessionManager.isLoggedIn() && !!state.user;
}

// ============ Load Data from MongoDB ============
export async function loadUserData(userId: string) {
  setState((s) => ({ ...s, isLoading: true }));
  try {
    // Load medications
    const medsRes = await medicationAPI.getAll(userId);
    const medications = Array.isArray(medsRes) ? medsRes : medsRes.data || [];

    // Load allergies
    const allergiesRes = await allergyAPI.getAll(userId);
    const allergies = Array.isArray(allergiesRes) ? allergiesRes : allergiesRes.data || [];

    // Load conditions
    const conditionsRes = await conditionAPI.getAll(userId);
    const conditions = Array.isArray(conditionsRes) ? conditionsRes : conditionsRes.data || [];

    // Load files (includes reports with category="report")
    const filesRes = await fileAPI.getAll(userId);
    const files = Array.isArray(filesRes) ? filesRes : filesRes.data || [];
    
    // Separate files and reports
    const reports = files.filter(f => f.category === 'report');

    setState((s) => ({
      ...s,
      medications,
      allergies,
      conditions,
      files,
      reports,
      isLoading: false,
    }));
  } catch (error) {
    console.error("[v0] Error loading user data:", error);
    setState((s) => ({ ...s, isLoading: false }));
  }
}

export function updateProfile(patch: Partial<UserProfile>) {
  setState((s) => (s.user ? { ...s, user: { ...s.user, ...patch } } : s));
}

export function deleteAllData() {
  sessionManager.clearSession();
  setState(() => emptyData());
}

export function exportData(): string {
  return JSON.stringify(state, null, 2);
}

// ============ CRUD: Allergies ============
export async function addAllergy(a: Omit<Allergy, "_id" | "userId" | "createdAt">) {
  setState((s) => ({ ...s, isLoading: true }));
  try {
    const response = await allergyAPI.createAllergy(a.name, a.severity, a.notes);
    const data = response.success ? response.data : response;
    if (data && data._id) {
      setState((s) => ({
        ...s,
        allergies: [...s.allergies, data],
        isLoading: false,
      }));
      return data;
    }
    setState((s) => ({ ...s, isLoading: false }));
  } catch (error) {
    setState((s) => ({ ...s, isLoading: false }));
    throw error;
  }
}

export async function updateAllergy(id: string, patch: Partial<Allergy>) {
  setState((s) => ({ ...s, isLoading: true }));
  try {
    const response = await allergyAPI.updateAllergy(id, patch.name || "", patch.severity || "mild", patch.notes);
    const data = response.success ? response.data : response;
    if (data && data._id) {
      setState((s) => ({
        ...s,
        allergies: s.allergies.map((x) => (x._id === id ? data : x)),
        isLoading: false,
      }));
      return data;
    }
    setState((s) => ({ ...s, isLoading: false }));
  } catch (error) {
    setState((s) => ({ ...s, isLoading: false }));
    throw error;
  }
}

export async function deleteAllergy(id: string) {
  setState((s) => ({ ...s, isLoading: true }));
  try {
    await allergyAPI.deleteAllergy(id);
    setState((s) => ({
      ...s,
      allergies: s.allergies.filter((x) => x._id !== id),
      isLoading: false,
    }));
    return true;
  } catch (error) {
    setState((s) => ({ ...s, isLoading: false }));
    throw error;
  }
}

// ============ CRUD: Medications ============
export async function addMedication(m: Omit<Medication, "_id" | "userId" | "createdAt">) {
  setState((s) => ({ ...s, isLoading: true }));
  try {
    const response = await medicationAPI.createMedication(m.name, m.dose, m.frequency, m.prescriber, m.notes);
    const data = response.success ? response.data : response;
    if (data && data._id) {
      setState((s) => ({
        ...s,
        medications: [...s.medications, data],
        isLoading: false,
      }));
      return data;
    }
    setState((s) => ({ ...s, isLoading: false }));
  } catch (error) {
    setState((s) => ({ ...s, isLoading: false }));
    throw error;
  }
}

export async function updateMedication(id: string, patch: Partial<Medication>) {
  setState((s) => ({ ...s, isLoading: true }));
  try {
    const response = await medicationAPI.updateMedication(id, patch.name || "", patch.dose || "", patch.frequency || "", patch.prescriber, patch.notes);
    const data = response.success ? response.data : response;
    if (data && data._id) {
      setState((s) => ({
        ...s,
        medications: s.medications.map((x) => (x._id === id ? data : x)),
        isLoading: false,
      }));
      return data;
    }
    setState((s) => ({ ...s, isLoading: false }));
  } catch (error) {
    setState((s) => ({ ...s, isLoading: false }));
    throw error;
  }
}

export async function deleteMedication(id: string) {
  setState((s) => ({ ...s, isLoading: true }));
  try {
    await medicationAPI.deleteMedication(id);
    setState((s) => ({
      ...s,
      medications: s.medications.filter((x) => x._id !== id),
      isLoading: false,
    }));
    return true;
  } catch (error) {
    setState((s) => ({ ...s, isLoading: false }));
    throw error;
  }
}

// ============ CRUD: Conditions ============
export async function addCondition(c: Omit<Condition, "_id" | "userId" | "createdAt">) {
  setState((s) => ({ ...s, isLoading: true }));
  try {
    const response = await conditionAPI.createCondition(c.name, c.notes);
    const data = response.success ? response.data : response;
    if (data && data._id) {
      setState((s) => ({
        ...s,
        conditions: [...s.conditions, data],
        isLoading: false,
      }));
      return data;
    }
    setState((s) => ({ ...s, isLoading: false }));
  } catch (error) {
    setState((s) => ({ ...s, isLoading: false }));
    throw error;
  }
}

export async function deleteCondition(id: string) {
  setState((s) => ({ ...s, isLoading: true }));
  try {
    await conditionAPI.deleteCondition(id);
    setState((s) => ({
      ...s,
      conditions: s.conditions.filter((x) => x._id !== id),
      isLoading: false,
    }));
    return true;
  } catch (error) {
    setState((s) => ({ ...s, isLoading: false }));
    throw error;
  }
}

// ============ CRUD: Files ============
export async function addFile(f: Omit<FileRecord, "_id" | "userId" | "createdAt">) {
  setState((s) => ({ ...s, isLoading: true }));
  try {
    const userId = state.user?._id;
    if (!userId) {
      throw new Error("User not authenticated");
    }

    // Save to database
    const response = await fileAPI.create({
      userId,
      category: f.category,
      title: f.title,
      date: f.date,
      notes: f.notes,
      mimeType: f.mimeType,
      dataUrl: f.dataUrl,
    });

    if (response && response._id) {
      setState((s) => ({
        ...s,
        files: [...s.files, response],
        isLoading: false,
      }));
      return response;
    } else {
      throw new Error("Failed to save file to database");
    }
  } catch (error) {
    setState((s) => ({ ...s, isLoading: false }));
    console.error("[v0] Error adding file:", error);
    throw error;
  }
}

export async function updateFile(id: string, patch: Partial<FileRecord>) {
  setState((s) => ({
    ...s,
    files: s.files.map((x) => (x._id === id ? { ...x, ...patch } : x)),
  }));
}

export async function deleteFile(id: string) {
  setState((s) => ({
    ...s,
    files: s.files.filter((x) => x._id !== id),
  }));
}

// ============ Sharing ============
export async function enableShare(durationMs: number | null) {
  const token = state.share.token || randomToken();
  const expiresAt = durationMs === null ? null : Date.now() + durationMs;
  
  try {
    // Sync with backend
    const response = await fetch('/api/share/enable', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: state.user?._id,
        token,
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to enable sharing on backend');
    }

    setState((s) => ({
      ...s,
      share: {
        enabled: true,
        token,
        expiresAt,
      },
    }));
  } catch (error) {
    console.error('[v0] Error enabling share:', error);
    // Still update local state
    setState((s) => ({
      ...s,
      share: {
        enabled: true,
        token,
        expiresAt,
      },
    }));
  }
}

export async function disableShare() {
  try {
    await fetch('/api/share/disable', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: state.user?._id }),
    });
  } catch (error) {
    console.error('[v0] Error disabling share:', error);
  }

  setState((s) => ({ ...s, share: { ...s.share, enabled: false, expiresAt: null } }));
}

export async function rotateShareToken() {
  const newToken = randomToken();
  
  try {
    await fetch('/api/share/enable', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: state.user?._id,
        token: newToken,
        expiresAt: state.share.expiresAt ? new Date(state.share.expiresAt).toISOString() : null,
      }),
    });
  } catch (error) {
    console.error('[v0] Error rotating token:', error);
  }

  setState((s) => ({ ...s, share: { ...s.share, token: newToken } }));
}

export function isShareValid(token: string): boolean {
  const sh = state.share;
  if (!sh.enabled || sh.token !== token) return false;
  if (sh.expiresAt !== null && Date.now() > sh.expiresAt) return false;
  return true;
}

// ============ Import/Export ============
export function importData(json: string) {
  const parsed = JSON.parse(json);
  state = { ...emptyData(), ...parsed };
}

