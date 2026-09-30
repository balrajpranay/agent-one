/**
 * Agent One Voice Service
 * Comprehensive Speech-to-Text (STT) and Text-to-Speech (TTS) integration.
 * - STT: Preferred Vosk Browser (WebAssembly) with graceful native Web Speech API fallback.
 * - TTS: Native Speech Synthesis with markdown-stripping for natural, formatted voice output.
 */

import type { Model, KaldiRecognizer } from 'vosk-browser';

type VoskRecognizerMessage = Parameters<Parameters<KaldiRecognizer['on']>[1]>[0];

export interface SpeechRecognitionCallbacks {
  onStart?: () => void;
  onPartialResult?: (partialText: string) => void;
  onFinalResult?: (finalText: string) => void;
  onError?: (errorMessage: string) => void;
  onEnd?: () => void;
}

export interface VoiceRecognizerSession {
  stop: () => void;
  abort: () => void;
}

/**
 * Strips raw HTML, markdown syntax, tables, code blocks, and metadata
 * from Agent One responses so that the text-to-speech output reads naturally.
 */
export function prepareTextForSpeech(text: string): string {
  if (!text) return '';

  let cleaned = text;

  // 1. Remove code blocks (```...```) and replace with natural placeholder
  cleaned = cleaned.replace(/```[\s\S]*?```/g, ' Code snippet omitted. ');

  // 2. Remove inline code (`...`)
  cleaned = cleaned.replace(/`([^`]+)`/g, '$1');

  // 3. Remove markdown tables (| col | col | ... |) and separator rows
  cleaned = cleaned.replace(/\|[^\n]+\|\n?/g, ' ');
  cleaned = cleaned.replace(/^[ \t]*\|?[-: ]+\|?[-: |]*$/gm, ' ');

  // 4. Remove HTML tags
  cleaned = cleaned.replace(/<[^>]*>/g, ' ');

  // 5. Convert markdown links [text](url) -> text
  cleaned = cleaned.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  // 6. Remove image links ![alt](url)
  cleaned = cleaned.replace(/!\[[^\]]*\]\([^)]+\)/g, ' ');

  // 7. Remove headers (#, ##, ###, etc.)
  cleaned = cleaned.replace(/^#{1,6}\s+/gm, '');

  // 8. Remove blockquotes (> ...)
  cleaned = cleaned.replace(/^>\s+/gm, '');

  // 9. Remove bold, italic, strikethrough (**, *, __, _, ~~)
  cleaned = cleaned.replace(/(\*\*|__)(.*?)\1/g, '$2');
  cleaned = cleaned.replace(/(\*|_)(.*?)\1/g, '$2');
  cleaned = cleaned.replace(/~~(.*?)~~/g, '$1');

  // 10. Clean citation markers (e.g. [Page 1], [Citation 2])
  cleaned = cleaned.replace(/\[(?:Page|Citation|Ref)\s*\d+\]/gi, '');

  // 11. Clean bullet points and list numbers at start of lines into clean sentences
  cleaned = cleaned.replace(/^[\s*•\-+]+\s+/gm, '');
  cleaned = cleaned.replace(/^\d+\.\s+/gm, '');

  // 12. Remove horizontal rules and decorative lines
  cleaned = cleaned.replace(/[-=_]{3,}/g, ' ');

  // 13. Normalize whitespace and trim
  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  return cleaned;
}

/**
 * Maps any browser microphone exception to the required user-facing message.
 */
export function getMicrophoneErrorMessage(err: unknown): string {
  if (typeof window === 'undefined' || !navigator?.mediaDevices?.getUserMedia) {
    return 'Voice input is not supported in this browser.';
  }

  if (!err) {
    return 'Voice input could not be started.';
  }

  const errObj = err as { name?: string; message?: string };
  const name = errObj.name || '';
  const message = (errObj.message || '').toLowerCase();

  // 1. Permission Denied
  if (
    name === 'NotAllowedError' ||
    name === 'PermissionDeniedError' ||
    name === 'SecurityError' ||
    message.includes('permission denied') ||
    message.includes('not allowed') ||
    message.includes('permission')
  ) {
    return 'Microphone access was denied.';
  }

  // 2. No Microphone Detected
  if (
    name === 'NotFoundError' ||
    name === 'DevicesNotFoundError' ||
    message.includes('not found') ||
    message.includes('no device') ||
    message.includes('requested device not found')
  ) {
    return 'No microphone was detected.';
  }

  // 3. Microphone Unavailable / Device in Use / Hardware Conflict
  if (
    name === 'NotReadableError' ||
    name === 'TrackStartError' ||
    name === 'OverconstrainedError' ||
    name === 'AbortError' ||
    message.includes('could not start audio source') ||
    message.includes('device in use') ||
    message.includes('busy') ||
    message.includes('unavailable')
  ) {
    return 'The microphone is currently unavailable.';
  }

  // 4. Model / WebAssembly initialization errors
  if (message.includes('model') || message.includes('wasm') || message.includes('recognizer')) {
    return 'Voice recognition could not be initialized.';
  }

  return 'Voice input could not be started.';
}

let cachedVoskModel: Model | null = null;
let modelLoadingPromise: Promise<Model> | null = null;

/**
 * Loads and caches the Vosk WebAssembly speech model.
 */
export async function getOrLoadVoskModel(
  modelUrl = '/models/vosk-model-small-en-us-0.15.tar.gz'
): Promise<Model> {
  if (cachedVoskModel && cachedVoskModel.ready) {
    return cachedVoskModel;
  }
  if (modelLoadingPromise) {
    return modelLoadingPromise;
  }

  modelLoadingPromise = (async () => {
    try {
      const Vosk = await import('vosk-browser');
      const model = await Vosk.createModel(modelUrl);
      cachedVoskModel = model;
      return model;
    } catch (err) {
      console.error('[Agent One Voice] Vosk model loading error:', err);
      modelLoadingPromise = null;
      throw err;
    }
  })();

  return modelLoadingPromise;
}

/**
 * Downsamples float audio buffer from inputSampleRate to outputSampleRate (16000 Hz)
 * using window averaging to filter out high-frequency noise and prevent aliasing.
 */
export function downsampleTo16k(
  inputBuffer: Float32Array,
  inputSampleRate: number,
  outputSampleRate = 16000
): Float32Array {
  if (inputSampleRate === outputSampleRate) {
    return inputBuffer;
  }
  if (inputSampleRate < outputSampleRate) {
    return inputBuffer;
  }

  const sampleRatio = inputSampleRate / outputSampleRate;
  const newLength = Math.round(inputBuffer.length / sampleRatio);
  const result = new Float32Array(newLength);

  let offsetResult = 0;
  let offsetInput = 0;

  while (offsetResult < result.length) {
    const nextOffsetInput = Math.round((offsetResult + 1) * sampleRatio);
    let accum = 0;
    let count = 0;
    for (let i = offsetInput; i < nextOffsetInput && i < inputBuffer.length; i++) {
      accum += inputBuffer[i];
      count++;
    }
    result[offsetResult] = count > 0 ? accum / count : inputBuffer[offsetInput];
    offsetResult++;
    offsetInput = nextOffsetInput;
  }

  return result;
}

/**
 * Formats committed final text and current interim partial text into a single
 * clean string without duplicate spaces.
 */
export function formatSpeechTranscription(committed: string, interim: string): string {
  const cleanCommitted = (committed || '').replace(/\s+/g, ' ').trim();
  const cleanInterim = (interim || '').replace(/\s+/g, ' ').trim();

  if (!cleanCommitted) return cleanInterim;
  if (!cleanInterim) return cleanCommitted;

  return `${cleanCommitted} ${cleanInterim}`;
}

/**
 * Appends newly finalized speech segment to existing committed text.
 * Detects and prevents word duplication at utterance boundaries.
 */
export function appendCommittedSpeech(existing: string, newText: string): string {
  const cleanExisting = (existing || '').replace(/\s+/g, ' ').trim();
  const cleanNew = (newText || '').replace(/\s+/g, ' ').trim();

  if (!cleanExisting) return cleanNew;
  if (!cleanNew) return cleanExisting;

  const existingWords = cleanExisting.split(' ');
  const newWords = cleanNew.split(' ');

  // Check for 1 to 5 overlapping words between tail of existing and head of new
  const maxOverlap = Math.min(existingWords.length, newWords.length, 5);
  let overlapCount = 0;
  for (let len = maxOverlap; len >= 1; len--) {
    const existingTail = existingWords.slice(-len).join(' ').toLowerCase();
    const newHead = newWords.slice(0, len).join(' ').toLowerCase();
    if (existingTail === newHead) {
      overlapCount = len;
      break;
    }
  }

  if (overlapCount > 0) {
    const remainingNewWords = newWords.slice(overlapCount);
    if (remainingNewWords.length === 0) {
      return cleanExisting;
    }
    return `${cleanExisting} ${remainingNewWords.join(' ')}`;
  }

  return `${cleanExisting} ${cleanNew}`;
}

/**
 * Normalizes punctuation, word spacing, and capitalization for conversational speech.
 * Does not rewrite or alter the user's spoken words.
 */
export function cleanTranscriptionText(text: string): string {
  if (!text) return '';
  let cleaned = text.replace(/\s+/g, ' ').trim();
  if (!cleaned) return '';

  // Capitalize first character
  cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);

  // Capitalize after sentence-ending punctuation (. ? !)
  cleaned = cleaned.replace(/([.?!]\s+)([a-z])/g, (_, p1, p2) => p1 + p2.toUpperCase());

  // Capitalize standalone "I" and contractions ("I'm", "I've", "I'll", "I'd")
  cleaned = cleaned.replace(/\b(i)('m|'ve|'ll|'d)?\b/gi, (match) => {
    return match.charAt(0).toUpperCase() + match.slice(1);
  });

  return cleaned;
}

/**
 * Speech Recognition using browser's high-accuracy native SpeechRecognition engine
 * (Google Cloud Speech in Chromium / Apple Siri Engine in Safari).
 */
export function startNativeSpeechRecognition(
  callbacks: SpeechRecognitionCallbacks,
  options?: { lang?: string }
): VoiceRecognizerSession {
  const SpeechRecognitionClass =
    (typeof window !== 'undefined' &&
      ((window as unknown as { SpeechRecognition?: any }).SpeechRecognition ||
        (window as unknown as { webkitSpeechRecognition?: any }).webkitSpeechRecognition)) ||
    null;

  if (!SpeechRecognitionClass) {
    throw new Error('Web Speech API is not supported in this browser.');
  }

  const recognition = new SpeechRecognitionClass();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = options?.lang || 'en-US';
  recognition.maxAlternatives = 1;

  let committedText = '';
  let currentInterim = '';
  let isStoppedManually = false;

  recognition.onstart = () => {
    callbacks.onStart?.();
  };

  recognition.onresult = (event: any) => {
    let interimChunk = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const res = event.results[i];
      const transcript = res[0]?.transcript || '';
      if (res.isFinal) {
        committedText = appendCommittedSpeech(committedText, transcript);
      } else {
        interimChunk += transcript;
      }
    }

    currentInterim = interimChunk;
    const combined = formatSpeechTranscription(committedText, currentInterim);
    const cleaned = cleanTranscriptionText(combined);

    if (currentInterim) {
      callbacks.onPartialResult?.(cleaned);
    } else {
      callbacks.onFinalResult?.(cleaned);
    }
  };

  recognition.onerror = (event: any) => {
    console.warn('[Agent One Voice] Native speech recognition event error:', event?.error);
    if (isStoppedManually) return;

    if (event?.error === 'not-allowed') {
      callbacks.onError?.('Microphone access was denied.');
      callbacks.onEnd?.();
    } else if (event?.error === 'no-speech') {
      // Just ambient silence: do not abort session
      return;
    } else {
      callbacks.onError?.(getMicrophoneErrorMessage(event));
      callbacks.onEnd?.();
    }
  };

  recognition.onend = () => {
    if (!isStoppedManually && (committedText || currentInterim)) {
      const finalMerged = formatSpeechTranscription(committedText, currentInterim);
      callbacks.onFinalResult?.(cleanTranscriptionText(finalMerged));
    }
    callbacks.onEnd?.();
  };

  recognition.start();

  return {
    stop: () => {
      isStoppedManually = true;
      try {
        recognition.stop();
      } catch {}
      if (committedText || currentInterim) {
        const finalMerged = formatSpeechTranscription(committedText, currentInterim);
        callbacks.onFinalResult?.(cleanTranscriptionText(finalMerged));
      }
      callbacks.onEnd?.();
    },
    abort: () => {
      isStoppedManually = true;
      try {
        recognition.abort();
      } catch {}
      callbacks.onEnd?.();
    },
  };
}

/**
 * Starts speech recognition using Vosk Browser WebAssembly with energy-based
 * Voice Activity Detection (VAD) to prevent background noise from being interpreted as words.
 */
export async function startVoskSpeechRecognition(
  callbacks: SpeechRecognitionCallbacks,
  options?: {
    modelUrl?: string;
    lang?: string;
  }
): Promise<VoiceRecognizerSession> {
  if (typeof window === 'undefined' || !window.isSecureContext || !navigator?.mediaDevices?.getUserMedia) {
    callbacks.onError?.('Voice input is not supported in this browser.');
    callbacks.onEnd?.();
    return { stop: () => {}, abort: () => {} };
  }

  // 1. Request microphone access directly with preferred speech constraints
  let mediaStream: MediaStream;
  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        channelCount: 1,
        sampleRate: { ideal: 16000 },
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
      video: false,
    });
  } catch (initialErr: unknown) {
    console.warn('[Agent One Voice] Advanced audio constraints failed, trying basic { audio: true }:', initialErr);
    try {
      mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
    } catch (fallbackErr: unknown) {
      console.error('[Agent One Voice] getUserMedia failed with both advanced and basic constraints:', fallbackErr);
      callbacks.onError?.(getMicrophoneErrorMessage(fallbackErr));
      callbacks.onEnd?.();
      return { stop: () => {}, abort: () => {} };
    }
  }

  // 2. Validate that active, live audio tracks exist
  const audioTracks = mediaStream.getAudioTracks();
  if (
    !audioTracks ||
    audioTracks.length === 0 ||
    !audioTracks[0].enabled ||
    audioTracks[0].readyState === 'ended'
  ) {
    console.warn('[Agent One Voice] MediaStream returned without active live audio track');
    mediaStream.getTracks().forEach((track) => track.stop());
    callbacks.onError?.('No microphone was detected.');
    callbacks.onEnd?.();
    return { stop: () => {}, abort: () => {} };
  }

  // 3. Initialize AudioContext (requesting 16000 Hz if supported by browser)
  const AudioContextClass =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

  if (!AudioContextClass) {
    mediaStream.getTracks().forEach((track) => track.stop());
    callbacks.onError?.('Voice input is not supported in this browser.');
    callbacks.onEnd?.();
    return { stop: () => {}, abort: () => {} };
  }

  let audioContext: AudioContext;
  try {
    audioContext = new AudioContextClass({ sampleRate: 16000 });
    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }
  } catch {
    try {
      audioContext = new AudioContextClass();
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }
    } catch (acErr) {
      console.error('[Agent One Voice] AudioContext resume failed:', acErr);
      mediaStream.getTracks().forEach((track) => track.stop());
      callbacks.onError?.('The microphone is currently unavailable.');
      callbacks.onEnd?.();
      return { stop: () => {}, abort: () => {} };
    }
  }

  const VOSK_TARGET_SAMPLE_RATE = 16000;
  const contextSampleRate = audioContext.sampleRate || VOSK_TARGET_SAMPLE_RATE;

  // 4. Load or retrieve the Vosk Model
  const targetModelUrl = options?.modelUrl || '/models/vosk-model-small-en-us-0.15.tar.gz';
  let model: Model;
  try {
    model = await getOrLoadVoskModel(targetModelUrl);
  } catch (modelErr) {
    console.error('[Agent One Voice] Vosk model initialization failed:', modelErr);
    mediaStream.getTracks().forEach((track) => track.stop());
    try {
      await audioContext.close();
    } catch {}
    callbacks.onError?.('Voice recognition could not be initialized.');
    callbacks.onEnd?.();
    return { stop: () => {}, abort: () => {} };
  }

  // 5. Create KaldiRecognizer for this session at strictly 16000 Hz matching the acoustic model
  let recognizer: KaldiRecognizer;
  try {
    recognizer = new model.KaldiRecognizer(VOSK_TARGET_SAMPLE_RATE);
    recognizer.setWords(true);
  } catch (recErr) {
    console.error('[Agent One Voice] KaldiRecognizer creation failed:', recErr);
    mediaStream.getTracks().forEach((track) => track.stop());
    try {
      await audioContext.close();
    } catch {}
    callbacks.onError?.('Voice recognition could not be initialized.');
    callbacks.onEnd?.();
    return { stop: () => {}, abort: () => {} };
  }

  // 6. Connect Audio Processing Pipeline to Vosk with Voice Activity Detection (VAD)
  let isCleanedUp = false;
  const source = audioContext.createMediaStreamSource(mediaStream);
  const recognizerNode = audioContext.createScriptProcessor(4096, 1, 1);
  const silenceGain = audioContext.createGain();
  silenceGain.gain.value = 0;

  // Speech energy cutoff threshold (RMS)
  const SPEECH_RMS_THRESHOLD = 0.008;
  let consecutiveSilenceFrames = 0;
  const MAX_PAUSE_SILENCE_FRAMES = 8; // ~680ms of silence allowed before muting noise
  let hasDetectedSpeech = false;

  recognizerNode.onaudioprocess = (event) => {
    if (isCleanedUp) return;
    try {
      const channelData = event.inputBuffer.getChannelData(0);
      const audio16k =
        contextSampleRate === VOSK_TARGET_SAMPLE_RATE
          ? channelData
          : downsampleTo16k(channelData, contextSampleRate, VOSK_TARGET_SAMPLE_RATE);

      // Compute frame RMS energy
      let sum = 0;
      for (let i = 0; i < audio16k.length; i++) {
        sum += audio16k[i] * audio16k[i];
      }
      const rms = Math.sqrt(sum / audio16k.length);

      if (rms >= SPEECH_RMS_THRESHOLD) {
        consecutiveSilenceFrames = 0;
        hasDetectedSpeech = true;
        recognizer.acceptWaveformFloat(audio16k, VOSK_TARGET_SAMPLE_RATE);
      } else {
        consecutiveSilenceFrames++;
        if (hasDetectedSpeech && consecutiveSilenceFrames <= MAX_PAUSE_SILENCE_FRAMES) {
          // Send zeroed silence buffer to trigger clean phrase boundary without ambient room noise
          const zeroBuf = new Float32Array(audio16k.length);
          recognizer.acceptWaveformFloat(zeroBuf, VOSK_TARGET_SAMPLE_RATE);
        }
        // When user is not speaking, background noise is not fed to Kaldi, preventing hallucinated words
      }
    } catch (wfErr) {
      console.debug('[Agent One Voice] acceptWaveform notice:', wfErr);
    }
  };

  source.connect(recognizerNode);
  recognizerNode.connect(silenceGain);
  silenceGain.connect(audioContext.destination);

  // 7. Wire Vosk Transcription Events with strict Partial vs Final separation
  let committedText = '';
  let currentInterim = '';

  recognizer.on('result', (message: VoskRecognizerMessage) => {
    if (
      'result' in message &&
      message.result &&
      'text' in message.result &&
      typeof message.result.text === 'string'
    ) {
      const rawText = message.result.text.trim();
      if (rawText) {
        committedText = appendCommittedSpeech(committedText, rawText);
        currentInterim = '';
        const cleaned = cleanTranscriptionText(committedText);
        callbacks.onFinalResult?.(cleaned);
      }
    }
  });

  recognizer.on('partialresult', (message: VoskRecognizerMessage) => {
    if (
      'result' in message &&
      message.result &&
      'partial' in message.result &&
      typeof message.result.partial === 'string'
    ) {
      const partial = message.result.partial.trim();
      currentInterim = partial;
      const combined = formatSpeechTranscription(committedText, currentInterim);
      if (combined) {
        const cleaned = cleanTranscriptionText(combined);
        callbacks.onPartialResult?.(cleaned);
      }
    }
  });

  // Signal recording has started
  callbacks.onStart?.();

  // 8. Orderly session teardown: flush final decoder state before releasing
  const cleanupResources = () => {
    if (isCleanedUp) return;
    isCleanedUp = true;
    try {
      source.disconnect();
      recognizerNode.disconnect();
      silenceGain.disconnect();
    } catch {}
    try {
      mediaStream.getTracks().forEach((track) => track.stop());
    } catch {}
    try {
      audioContext.close();
    } catch {}
    try {
      recognizer.remove();
    } catch {}
    callbacks.onEnd?.();
  };

  const stopSession = () => {
    if (isCleanedUp) return;
    try {
      source.disconnect();
      recognizerNode.disconnect();
    } catch {}
    try {
      recognizer.retrieveFinalResult();
    } catch {}
    setTimeout(() => {
      cleanupResources();
    }, 120);
  };

  const abortSession = () => {
    cleanupResources();
  };

  return {
    stop: stopSession,
    abort: abortSession,
  };
}

/**
 * Starts speech recognition using the best available engine:
 * 1. High-accuracy native browser speech recognition (Google Cloud Speech in Chromium).
 * 2. In-browser Vosk WebAssembly with energy VAD for offline/unsupported environments.
 */
export async function startSpeechRecognition(
  callbacks: SpeechRecognitionCallbacks,
  options?: {
    modelUrl?: string;
    lang?: string;
  }
): Promise<VoiceRecognizerSession> {
  if (typeof window === 'undefined' || !window.isSecureContext) {
    callbacks.onError?.('Voice input is not supported in this browser.');
    callbacks.onEnd?.();
    return { stop: () => {}, abort: () => {} };
  }

  const hasNativeSpeech =
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  if (hasNativeSpeech) {
    try {
      console.log('[Agent One Voice] Launching high-accuracy native speech engine...');
      return startNativeSpeechRecognition(
        {
          onStart: callbacks.onStart,
          onPartialResult: callbacks.onPartialResult,
          onFinalResult: callbacks.onFinalResult,
          onError: (errMsg) => {
            if (errMsg.includes('denied') || errMsg.includes('not supported')) {
              callbacks.onError?.(errMsg);
            } else {
              console.warn('[Agent One Voice] Native speech error, falling back to Vosk WebAssembly:', errMsg);
              startVoskSpeechRecognition(callbacks, options).catch((voskErr) => {
                callbacks.onError?.(getMicrophoneErrorMessage(voskErr));
              });
            }
          },
          onEnd: callbacks.onEnd,
        },
        { lang: options?.lang || 'en-US' }
      );
    } catch (err) {
      console.warn('[Agent One Voice] Native speech failed to start, falling back to Vosk:', err);
    }
  }

  console.log('[Agent One Voice] Launching local Vosk WebAssembly engine with energy VAD...');
  return startVoskSpeechRecognition(callbacks, options);
}

/**
 * Text-to-Speech Controller for reading Agent One responses aloud
 * using the browser's native SpeechSynthesis API.
 */
class TextToSpeechManager {
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private activeMessageId: string | null = null;
  private onStateChangeCallback: ((messageId: string | null, state: 'idle' | 'playing' | 'paused') => void) | null = null;

  public setListener(callback: (messageId: string | null, state: 'idle' | 'playing' | 'paused') => void) {
    this.onStateChangeCallback = callback;
  }

  public getActiveMessageId(): string | null {
    return this.activeMessageId;
  }

  public speak(
    messageId: string,
    rawText: string,
    onFinish?: () => void,
    onError?: (err: unknown) => void
  ) {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      onError?.(new Error('Text-to-speech is not supported in this browser.'));
      return;
    }

    // Stop any ongoing speech before starting a new one
    this.stop();

    const cleanText = prepareTextForSpeech(rawText);
    if (!cleanText) {
      onFinish?.();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'en-US';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Pick a high-quality natural voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) =>
        v.lang.startsWith('en') &&
        (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Premium'))
    ) || voices.find((v) => v.lang.startsWith('en'));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    this.currentUtterance = utterance;
    this.activeMessageId = messageId;
    this.notify('playing');

    utterance.onstart = () => {
      this.notify('playing');
    };

    utterance.onpause = () => {
      this.notify('paused');
    };

    utterance.onresume = () => {
      this.notify('playing');
    };

    utterance.onend = () => {
      this.currentUtterance = null;
      this.activeMessageId = null;
      this.notify('idle');
      onFinish?.();
    };

    utterance.onerror = (event) => {
      if (event.error !== 'canceled' && event.error !== 'interrupted') {
        onError?.(event);
      }
      this.currentUtterance = null;
      this.activeMessageId = null;
      this.notify('idle');
    };

    // Edge/Chrome bugfix: cancel before speak prevents speech synthesis hanging
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  public pause() {
    if (typeof window !== 'undefined' && window.speechSynthesis && window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      this.notify('paused');
    }
  }

  public resume() {
    if (typeof window !== 'undefined' && window.speechSynthesis && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      this.notify('playing');
    }
  }

  public stop() {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    this.currentUtterance = null;
    this.activeMessageId = null;
    this.notify('idle');
  }

  private notify(state: 'idle' | 'playing' | 'paused') {
    if (this.onStateChangeCallback) {
      this.onStateChangeCallback(this.activeMessageId, state);
    }
  }
}

export const ttsManager = new TextToSpeechManager();
