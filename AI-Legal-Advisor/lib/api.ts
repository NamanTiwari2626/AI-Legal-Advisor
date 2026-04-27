/**
 * API Client for LAwBOTie
 * Handles all communication with the Spring Boot backend
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// ─── Token Management ────────────────────────────────────────────────

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('lawbotie_token');
}

function setToken(token: string): void {
  localStorage.setItem('lawbotie_token', token);
}

function removeToken(): void {
  localStorage.removeItem('lawbotie_token');
  localStorage.removeItem('lawbotie_user');
}

function getUser(): UserData | null {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem('lawbotie_user');
  return data ? JSON.parse(data) : null;
}

function setUser(user: UserData): void {
  localStorage.setItem('lawbotie_user', JSON.stringify(user));
}

// ─── Types ───────────────────────────────────────────────────────────

export interface UserData {
  userId: number;
  name: string;
  email: string;
  referralCode: string;
  referralCount: number;
}

export interface AuthResponse {
  token: string;
  name: string;
  email: string;
  userId: number;
  referralCode: string;
  referralCount: number;
}

export interface VisemeData {
  time: number;
  visemeId: number;
  visemeName: string;
  duration: number;
}

export interface MorphTargets {
  jawOpen: number;
  mouthFunnel: number;
  mouthPucker: number;
  mouthSmile: number;
  mouthStretch: number;
}

export interface EntityData {
  text: string;
  label: string;
  start: number;
  end: number;
}

export interface ChatApiResponse {
  response: string;
  category: string;
  categoryName: string;
  confidence: number;
  intent: string;
  entities: EntityData[];
  keyActs: string[];
  tips: string[];
  visemes: VisemeData[];
  morphTargets: MorphTargets[];
  sessionId: string;
  timestamp: string;
}

export interface ChatSession {
  sessionId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessageData {
  id: number;
  content: string;
  isAi: boolean;
  category: string;
  createdAt: string;
}

// ─── API Helpers ─────────────────────────────────────────────────────

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.status === 401) {
      removeToken();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API error: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    }
    throw error;
  }
}

// ─── Auth API ────────────────────────────────────────────────────────

export async function signup(name: string, email: string, password: string): Promise<AuthResponse> {
  const data = await apiRequest<AuthResponse>('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });

  setToken(data.token);
  setUser({
    userId: data.userId,
    name: data.name,
    email: data.email,
    referralCode: data.referralCode,
    referralCount: data.referralCount,
  });

  return data;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const data = await apiRequest<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  setToken(data.token);
  setUser({
    userId: data.userId,
    name: data.name,
    email: data.email,
    referralCode: data.referralCode,
    referralCount: data.referralCount,
  });

  return data;
}

export function logout(): void {
  removeToken();
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

export function getCurrentUser(): UserData | null {
  return getUser();
}

// ─── Chat API ────────────────────────────────────────────────────────

export async function sendChatMessage(
  message: string,
  sessionId?: string
): Promise<ChatApiResponse> {
  return apiRequest<ChatApiResponse>('/api/chat', {
    method: 'POST',
    body: JSON.stringify({ message, sessionId }),
  });
}

export async function getChatSessions(): Promise<ChatSession[]> {
  return apiRequest<ChatSession[]>('/api/chat/sessions');
}

export async function getSessionMessages(sessionId: string): Promise<ChatMessageData[]> {
  return apiRequest<ChatMessageData[]>(`/api/chat/sessions/${sessionId}`);
}

// ─── TTS + Lip Sync (Throttled — no rapid React state updates) ──────

let activeSpeechTimer: ReturnType<typeof setInterval> | null = null;
let voicesLoaded = false;

// Pre-load voices on module init
if (typeof window !== 'undefined' && window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => { voicesLoaded = true; };
  // Trigger voice loading
  window.speechSynthesis.getVoices();
}

const NEUTRAL_MORPH: MorphTargets = {
  jawOpen: 0,
  mouthFunnel: 0,
  mouthPucker: 0,
  mouthSmile: 0,
  mouthStretch: 0,
};

export function speakWithVisemes(
  text: string,
  visemes: VisemeData[],
  morphTargets: MorphTargets[],
  onVisemeChange?: (morph: MorphTargets) => void,
  onEnd?: () => void
): SpeechSynthesisUtterance | null {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null;

  // Clean up any previous speech
  stopSpeech();

  // Clean text for speech (remove markdown/emojis)
  const cleanText = text
    .replace(/\*\*/g, '')
    .replace(/[•📜⚖️🏛️📋💡🔑]/g, '')
    .replace(/\n+/g, '. ')
    .trim();

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.rate = 0.95;
  utterance.pitch = 1.0;
  utterance.volume = 1.0;

  // Select best English voice
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(v =>
    v.lang === 'en-IN' || v.lang === 'en-US' || v.lang.startsWith('en')
  );
  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }

  // Throttled viseme playback — update morph targets at ~15fps instead of per-viseme
  // This prevents hundreds of rapid React state updates
  utterance.onstart = () => {
    const startTime = performance.now();

    // Build a timeline: cumulative time → morph target
    const timeline: { time: number; morph: MorphTargets }[] = [];
    let cumTime = 0;
    for (let i = 0; i < visemes.length && i < morphTargets.length; i++) {
      timeline.push({ time: cumTime, morph: morphTargets[i] });
      cumTime += visemes[i]?.duration || 70;
    }
    const totalDuration = cumTime;

    // Update at ~15fps (every 66ms) — smooth enough for lip sync, light on React
    activeSpeechTimer = setInterval(() => {
      const elapsed = performance.now() - startTime;

      if (elapsed >= totalDuration) {
        onVisemeChange?.(NEUTRAL_MORPH);
        if (activeSpeechTimer) {
          clearInterval(activeSpeechTimer);
          activeSpeechTimer = null;
        }
        return;
      }

      // Find the current morph target based on elapsed time
      let currentMorph = NEUTRAL_MORPH;
      for (let i = timeline.length - 1; i >= 0; i--) {
        if (elapsed >= timeline[i].time) {
          currentMorph = timeline[i].morph;
          break;
        }
      }

      onVisemeChange?.(currentMorph);
    }, 66);
  };

  utterance.onend = () => {
    if (activeSpeechTimer) {
      clearInterval(activeSpeechTimer);
      activeSpeechTimer = null;
    }
    onVisemeChange?.(NEUTRAL_MORPH);
    onEnd?.();
  };

  utterance.onerror = () => {
    if (activeSpeechTimer) {
      clearInterval(activeSpeechTimer);
      activeSpeechTimer = null;
    }
    onVisemeChange?.(NEUTRAL_MORPH);
    onEnd?.();
  };

  window.speechSynthesis.speak(utterance);
  return utterance;
}

export function stopSpeech(): void {
  if (activeSpeechTimer) {
    clearInterval(activeSpeechTimer);
    activeSpeechTimer = null;
  }
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}
