/**
 * Narration: speaks frame text with the browser's speech engine and picks the
 * most natural-sounding English voice available on the device.
 */

export interface SpeakHandle {
  done: Promise<void>;
  cancel: () => void;
}

const hasSpeech = () => typeof window !== 'undefined' && 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined';

export function speechSupported() {
  return hasSpeech();
}

function rankVoice(v: SpeechSynthesisVoice) {
  const n = v.name;
  let s = 0;
  if (/natural|neural|online|premium|enhanced|wavenet|studio/i.test(n)) s += 60;
  if (/google/i.test(n)) s += 30;
  if (/aria|jenny|guy|ava|andrew|emma|brian|samantha|daniel|karen|serena|allison|evan|zoe|libby|sonia|ryan|neerja|prabhat/i.test(n)) s += 20;
  if (/en[-_](US|GB|IN|AU)/i.test(v.lang)) s += 10;
  if (/compact|espeak|robot/i.test(n)) s -= 40;
  if (v.localService === false) s += 5;
  return s;
}

export function listVoices(): SpeechSynthesisVoice[] {
  if (!hasSpeech()) return [];
  return window.speechSynthesis
    .getVoices()
    .filter((v) => /^en/i.test(v.lang))
    .sort((a, b) => rankVoice(b) - rankVoice(a));
}

export function onVoicesChanged(cb: () => void) {
  if (!hasSpeech()) return () => {};
  const s = window.speechSynthesis;
  s.addEventListener?.('voiceschanged', cb);
  return () => s.removeEventListener?.('voiceschanged', cb);
}

/** Rough speaking time in ms, used for silent playback and as a safety timeout. */
export function estimateMs(text: string, rate: number) {
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  return (words / (2.55 * rate)) * 1000 + 350;
}

let current: SpeechSynthesisUtterance | null = null; // keep a reference so Chrome doesn't GC it mid-sentence

export function speak(text: string, opts: { rate: number; voiceName?: string | null; onWord?: (charIndex: number) => void }): SpeakHandle {
  let cancelled = false;
  let resolveFn: () => void = () => {};
  const done = new Promise<void>((res) => (resolveFn = res));
  if (!hasSpeech()) {
    const t = setTimeout(() => resolveFn(), estimateMs(text, opts.rate));
    return { done, cancel: () => { cancelled = true; clearTimeout(t); } };
  }
  const synth = window.speechSynthesis;
  const u = new SpeechSynthesisUtterance(text);
  const voice = listVoices().find((v) => v.name === opts.voiceName) ?? listVoices()[0];
  if (voice) u.voice = voice;
  u.lang = voice?.lang ?? 'en-US';
  u.rate = opts.rate;
  u.pitch = 1;
  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    clearTimeout(safety);
    resolveFn();
  };
  u.onend = finish;
  u.onerror = finish;
  u.onboundary = (e) => {
    if (!cancelled && e.name !== 'sentence') opts.onWord?.(e.charIndex);
  };
  const safety = setTimeout(finish, estimateMs(text, opts.rate) * 1.9 + 2500);
  current = u;
  // Chrome sometimes drops an utterance queued right after cancel(); a short delay avoids it.
  const start = setTimeout(() => {
    if (!cancelled) synth.speak(u);
  }, 40);
  return {
    done,
    cancel: () => {
      cancelled = true;
      clearTimeout(start);
      clearTimeout(safety);
      if (current === u) synth.cancel();
    },
  };
}

export function stopSpeech() {
  if (hasSpeech()) window.speechSynthesis.cancel();
}
