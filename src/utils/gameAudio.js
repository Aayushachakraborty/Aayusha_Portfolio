import { Howl, Howler } from 'howler';

let audioContext;
let engineNodes;
let frontAmbient;
let hoverChime;
let enterSting;
let activeSceneAmbience;

Howler.volume(0.8);

function makeWavDataUri({ duration = 0.2, sampleRate = 22050, voices = [] }) {
  const length = Math.floor(duration * sampleRate);
  const bytesPerSample = 2;
  const dataSize = length * bytesPerSample;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  function writeString(offset, value) {
    for (let i = 0; i < value.length; i += 1) view.setUint8(offset + i, value.charCodeAt(i));
  }

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * bytesPerSample, true);
  view.setUint16(32, bytesPerSample, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, dataSize, true);

  for (let i = 0; i < length; i += 1) {
    const t = i / sampleRate;
    const progress = t / duration;
    let sample = 0;
    voices.forEach((voice) => {
      const freq = typeof voice.frequency === 'function' ? voice.frequency(progress) : voice.frequency;
      const wave = voice.type === 'triangle'
        ? (2 / Math.PI) * Math.asin(Math.sin(2 * Math.PI * freq * t))
        : Math.sin(2 * Math.PI * freq * t);
      const attack = Math.min(1, progress / (voice.attack || 0.08));
      const release = Math.min(1, (1 - progress) / (voice.release || 0.12));
      sample += wave * (voice.gain || 0.1) * Math.min(attack, release);
    });
    const clipped = Math.max(-1, Math.min(1, sample));
    view.setInt16(44 + i * bytesPerSample, clipped * 0x7fff, true);
  }

  let binary = '';
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return `data:audio/wav;base64,${btoa(binary)}`;
}

function ensureFrontAudio() {
  if (frontAmbient && hoverChime && enterSting) return;

  frontAmbient = new Howl({
    src: [makeWavDataUri({
      duration: 8,
      voices: [
        { frequency: 110, gain: 0.09, attack: 0.7, release: 0.9 },
        { frequency: 164.81, gain: 0.05, attack: 1, release: 1 },
        { frequency: 220, gain: 0.035, attack: 1.2, release: 1.2 },
      ],
    })],
    loop: true,
    volume: 0,
  });

  hoverChime = new Howl({
    src: [makeWavDataUri({
      duration: 0.22,
      voices: [
        { frequency: (p) => (p < 0.5 ? 660 : 990), type: 'triangle', gain: 0.15, attack: 0.01, release: 0.08 },
        { frequency: (p) => (p < 0.5 ? 990 : 1320), type: 'triangle', gain: 0.07, attack: 0.02, release: 0.1 },
      ],
    })],
    volume: 0.6,
  });

  enterSting = new Howl({
    src: [makeWavDataUri({
      duration: 1.35,
      voices: [
        { frequency: (p) => 96 + p * 520, gain: 0.18, attack: 0.04, release: 0.38 },
        { frequency: (p) => (p < 0.33 ? 220 : p < 0.66 ? 330 : 660), type: 'triangle', gain: 0.12, attack: 0.05, release: 0.28 },
        { frequency: (p) => 880 + p * 440, type: 'triangle', gain: 0.05, attack: 0.18, release: 0.5 },
      ],
    })],
    volume: 0.8,
  });
}

export function startFrontAmbient() {
  ensureFrontAudio();
  if (!frontAmbient.playing()) frontAmbient.play();
  frontAmbient.fade(frontAmbient.volume(), 0.3, 200);
}

export function stopFrontAmbient() {
  if (!frontAmbient) return;
  frontAmbient.fade(frontAmbient.volume(), 0, 400);
  window.setTimeout(() => {
    if (frontAmbient && frontAmbient.volume() === 0) frontAmbient.stop();
  }, 420);
}

export function playFrontHover(isMuted) {
  if (isMuted) return;
  ensureFrontAudio();
  hoverChime.play();
}

export function playFrontEnter(isMuted) {
  if (isMuted) return;
  ensureFrontAudio();
  enterSting.play();
}

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

export function unlockAudio() {
  getAudioContext();
  Howler.ctx?.resume?.();
}

const scenePresets = {
  world: {
    base: 72,
    wave: 'triangle',
    volume: 0.035,
    lfo: 0.18,
    spread: [1, 1.5, 2],
    melody: [360, 480, 720],
    tempo: 520,
  },
  about: {
    base: 86,
    wave: 'sawtooth',
    volume: 0.026,
    lfo: 4.8,
    spread: [1, 1.25, 1.5],
    melody: [220, 277, 330, 440],
    tempo: 760,
  },
  skills: {
    base: 132,
    wave: 'square',
    volume: 0.018,
    lfo: 7.5,
    spread: [1, 2, 3],
    melody: [660, 880, 990, 1320],
    tempo: 390,
  },
  experience: {
    base: 58,
    wave: 'sawtooth',
    volume: 0.03,
    lfo: 2.4,
    spread: [1, 1.33, 2],
    melody: [196, 247, 294, 392],
    tempo: 680,
  },
  airport: {
    base: 104,
    wave: 'triangle',
    volume: 0.024,
    lfo: 0.7,
    spread: [1, 1.2, 1.8],
    melody: [523, 659, 784],
    tempo: 920,
  },
  project: {
    base: 96,
    wave: 'sawtooth',
    volume: 0.028,
    lfo: 5.6,
    spread: [1, 1.5, 2.25],
    melody: [330, 440, 660, 880],
    tempo: 460,
  },
  demo: {
    base: 118,
    wave: 'square',
    volume: 0.014,
    lfo: 9,
    spread: [1, 1.5, 2],
    melody: [440, 554, 659, 880],
    tempo: 340,
  },
  contact: {
    base: 65,
    wave: 'triangle',
    volume: 0.032,
    lfo: 0.3,
    spread: [1, 1.5, 2.5],
    melody: [262, 330, 392, 523],
    tempo: 1100,
  },
  resume: {
    base: 82,
    wave: 'sine',
    volume: 0.018,
    lfo: 0.22,
    spread: [1, 1.5, 2],
    melody: [247, 330, 494],
    tempo: 1400,
  },
};

function scenePreset(sceneKey) {
  return scenePresets[sceneKey] || scenePresets.world;
}

export function stopSceneAmbient() {
  if (!activeSceneAmbience || !audioContext) return;
  const { gain, oscillators, lfos, timer } = activeSceneAmbience;
  const now = audioContext.currentTime;
  window.clearInterval(timer);
  gain.gain.cancelScheduledValues(now);
  gain.gain.setValueAtTime(Math.max(0.0001, gain.gain.value), now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
  [...oscillators, ...lfos].forEach((node) => node.stop(now + 0.26));
  activeSceneAmbience = undefined;
}

export function startSceneAmbient(sceneKey, isMuted) {
  if (isMuted) {
    stopSceneAmbient();
    return;
  }

  const ctx = getAudioContext();
  if (!ctx) return;
  if (activeSceneAmbience?.sceneKey === sceneKey) return;

  stopSceneAmbient();
  stopFrontAmbient();

  const preset = scenePreset(sceneKey);
  const now = ctx.currentTime;
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  const oscillators = [];

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(preset.volume, now + 0.5);
  filter.type = 'lowpass';
  filter.frequency.value = 760;
  filter.Q.value = 0.8;

  lfo.type = 'sine';
  lfo.frequency.value = preset.lfo;
  lfoGain.gain.value = preset.base * 0.05;
  lfo.connect(lfoGain);

  preset.spread.forEach((ratio, index) => {
    const osc = ctx.createOscillator();
    const voiceGain = ctx.createGain();
    osc.type = preset.wave;
    osc.frequency.value = preset.base * ratio;
    voiceGain.gain.value = 1 / (index + 1.35);
    lfoGain.connect(osc.frequency);
    osc.connect(voiceGain);
    voiceGain.connect(filter);
    osc.start(now);
    oscillators.push(osc);
  });

  filter.connect(gain);
  gain.connect(ctx.destination);
  lfo.start(now);

  let step = 0;
  const timer = window.setInterval(() => {
    const note = preset.melody[step % preset.melody.length];
    const octave = step % 5 === 4 ? 0.5 : 1;
    tone({
      frequency: note * octave,
      duration: Math.min(0.2, preset.tempo / 3200),
      type: preset.wave === 'square' ? 'triangle' : preset.wave,
      gain: preset.volume * 1.8,
    });
    step += 1;
  }, preset.tempo);

  activeSceneAmbience = {
    sceneKey,
    gain,
    oscillators,
    lfos: [lfo],
    timer,
  };
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
  if (isMuted || engineNodes || activeSceneAmbience) return;
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
