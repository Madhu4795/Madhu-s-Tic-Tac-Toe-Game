
let audioContext: AudioContext | null = null;
let isMasterSoundEnabled = true;
let isThinkingSoundEnabled = true;

export const setSoundConfig = (config: { master: boolean, thinking: boolean }) => {
    isMasterSoundEnabled = config.master;
    isThinkingSoundEnabled = config.thinking;
};

const getAudioContext = () => {
  if (!audioContext) {
    // Browsers require user interaction to resume/create AudioContext
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
};

export const playMoveSound = (player: 'X' | 'O') => {
  if (!isMasterSoundEnabled) return;
  try {
    const ctx = getAudioContext();
    // Resume context if suspended (common in browsers until user interaction)
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    // X: Higher, sharper (Sine)
    // O: Lower, softer (Sine)
    osc.type = 'sine';
    
    if (player === 'X') {
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.1);
    } else {
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.15);
    }

  } catch (error) {
    console.warn("Sound playback failed:", error);
  }
};

export const playWinSound = () => {
  if (!isMasterSoundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') ctx.resume();

    const now = ctx.currentTime;
    // Simple victory arpeggio (C Major: C E G C E)
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; 
    
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.1);
      
      gain.gain.setValueAtTime(0, now + i * 0.1);
      gain.gain.linearRampToValueAtTime(0.1, now + i * 0.1 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.4);
      
      osc.start(now + i * 0.1);
      osc.stop(now + i * 0.1 + 0.4);
    });

  } catch (error) {
     console.warn("Win sound failed:", error);
  }
};

export const playDrawSound = () => {
    if (!isMasterSoundEnabled) return;
    try {
        const ctx = getAudioContext();
        if (ctx.state === 'suspended') ctx.resume();
        
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.3);
        
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);
        
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.3);
    } catch(e) {}
}

let thinkingInterval: number | null = null;

export const startThinkingSound = () => {
  if (thinkingInterval) return;

  const playBlip = () => {
     if (!isMasterSoundEnabled || !isThinkingSoundEnabled) return;

     try {
        const ctx = getAudioContext();
        // Don't force resume on loop if not active to avoid annoyance if user hasn't interacted
        if (ctx.state === 'suspended') return; 

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        
        // Very quiet blip
        gain.gain.setValueAtTime(0.015, ctx.currentTime); 
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.05);
     } catch (e) {
         // ignore
     }
  };

  // Initial blip
  playBlip();
  // Loop
  thinkingInterval = window.setInterval(playBlip, 1200); 
};

export const stopThinkingSound = () => {
  if (thinkingInterval) {
    clearInterval(thinkingInterval);
    thinkingInterval = null;
  }
};
