const AudioEngine = {
    ctx: null,
    osc: null,
    gainNode: null,
    initialized: false,
    morseFreq: 600, // Hz
    
    playQueue: [],
    isPlayingQueue: false,

    init() {
        if (this.initialized) return;
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();
        
        // Setup Morse continuous oscillator
        this.osc = this.ctx.createOscillator();
        this.osc.type = 'sine';
        this.osc.frequency.value = this.morseFreq;
        
        this.gainNode = this.ctx.createGain();
        this.gainNode.gain.value = 0; 
        
        this.osc.connect(this.gainNode);
        this.gainNode.connect(this.ctx.destination);
        this.osc.start();
        
        this.initialized = true;
    },

    resume() {
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    },

    startTone() {
        if (!this.initialized) this.init();
        this.resume();
        this.gainNode.gain.cancelScheduledValues(this.ctx.currentTime);
        this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, this.ctx.currentTime);
        this.gainNode.gain.linearRampToValueAtTime(1, this.ctx.currentTime + 0.015);
    },

    stopTone() {
        if (!this.initialized) return;
        this.gainNode.gain.cancelScheduledValues(this.ctx.currentTime);
        this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, this.ctx.currentTime);
        this.gainNode.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.015);
    },

    get T_ms() {
        // AppState.wpm determines speed. Make sure AppState.wpm defaults to 20 if undefined.
        return 1200 / (window.AppState ? window.AppState.wpm : 20);
    },

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    async enqueue(sequence) {
        this.playQueue.push(sequence);
        if (!this.isPlayingQueue) {
            this.isPlayingQueue = true;
            this.processQueue();
        }
    },

    async processQueue() {
        while (this.playQueue.length > 0) {
            let seq = this.playQueue.shift();
            await this.playSequence(seq);
            await this.sleep(this.T_ms * 3);
        }
        this.isPlayingQueue = false;
    },

    async playSequence(sequence) {
        if (!this.initialized) this.init();
        this.resume();
        const T = this.T_ms;
        
        for (let i = 0; i < sequence.length; i++) {
            const char = sequence[i];
            if (char === '.') {
                this.startTone();
                await this.sleep(T);
                this.stopTone();
                await this.sleep(T); 
            } else if (char === '-') {
                this.startTone();
                await this.sleep(T * 3);
                this.stopTone();
                await this.sleep(T);
            } else if (char === ' ') {
                await this.sleep(T * 2); 
            } else if (char === '/') {
                await this.sleep(T * 6);
            }
        }
    },

    // --- Sound Effects ---
    playClick() {
        if (!this.initialized) this.init();
        this.resume();
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, t);
        osc.frequency.exponentialRampToValueAtTime(300, t + 0.05);
        gain.gain.setValueAtTime(0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.05);
    },

    playTing() {
        if (!this.initialized) this.init();
        this.resume();
        const t = this.ctx.currentTime;
        // A nice "Ting" bell sound
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc1.type = 'sine';
        osc2.type = 'triangle';
        
        osc1.frequency.value = 1200;
        osc2.frequency.value = 2400; // octave harmonic
        
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.8, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 1.5);
        
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc1.start(t);
        osc2.start(t);
        osc1.stop(t + 1.5);
        osc2.stop(t + 1.5);
    }
};
