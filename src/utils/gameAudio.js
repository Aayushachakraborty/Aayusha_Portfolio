let audioContext;
let engineNodes;

function getAudioContext() {
  if (typeof window === 'undefined') return undefined;
  const AudioCtor = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtor) return undefined;
  if (!audioContext) {
    audioContext = new AudioCtor();
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  return audioContext;
}

function tone({ frequency = 440, duration = 0.18, type = 'sine', gain = 0.08, slideTo }) {
  const ctx = getAudioContext();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const amp = ctx.createGain();
  const now = ctx.currentTime;

  osc.type = type;
  osc.frequency.setValueAtTime(frequency, now);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, now + duration);
  amp.gain.setValueAtTime(0.0001, now);
  amp.gain.exponentialRampToValueAtTime(gain, now + 0.02);
  amp.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  osc.connect(amp);
  amp.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + duration + 0.03);
}

export function playStartSound(isMuted) {
  if (isMuted) return;
  tone({ frequency: 180, slideTo: 720, duration: 0.28, type: 'sawtooth', gain: 0.06 });
  window.setTimeout(() => tone({ frequency: 920, duration: 0.1, type: 'triangle', gain: 0.045 }), 120);
}

export function playUiChime(isMuted) {
  if (isMuted) return;
  tone({ frequency: 660, duration: 0.09, type: 'triangle', gain: 0.045 });
  window.setTimeout(() => tone({ frequency: 990, duration: 0.12, type: 'triangle', gain: 0.035 }), 70);
}

export function startEngineLoop(isMuted) {
  if (isMuted || engineNodes) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  const amp = ctx.createGain();

  osc.type = 'sawtooth';
  osc.frequency.value = 72;
  lfo.type = 'sine';
  lfo.frequency.value = 6;
  lfoGain.gain.value = 12;
  amp.gain.value = 0.018;

  lfo.connect(lfoGain);
  lfoGain.connect(osc.frequency);
  osc.connect(amp);
  amp.connect(ctx.destination);
  osc.start();
  lfo.start();
  engineNodes = { osc, lfo, amp };
}

export function stopEngineLoop() {
  if (!engineNodes || !audioContext) return;
  const now = audioContext.currentTime;
  engineNodes.amp.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
  engineNodes.osc.stop(now + 0.22);
  engineNodes.lfo.stop(now + 0.22);
  engineNodes = undefined;
}
