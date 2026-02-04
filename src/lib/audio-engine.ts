import * as Tone from 'tone';

let synth: Tone.PolySynth | null = null;
let drone: Tone.Oscillator | null = null;
let droneLfo: Tone.LFO | null = null;

const getSynth = () => {
    if (!synth) {
        synth = new Tone.PolySynth(Tone.Synth, {
            oscillator: { type: 'triangle' },
            envelope: {
                attack: 0.02,
                decay: 0.1,
                sustain: 0.3,
                release: 1,
            },
        }).toDestination();
    }
    return synth;
};

export const playNote = async (freq: number | string) => {
    await Tone.start();
    const s = getSynth();
    s.triggerAttackRelease(freq, '8n');
};

export const startDrone = async (freq: number | string) => {
    await Tone.start();
    if (drone) drone.stop();

    drone = new Tone.Oscillator(freq, 'sawtooth12').toDestination();
    drone.volume.value = -25;

    // Modulate slightly for a "pad" feel
    droneLfo = new Tone.LFO('0.5hz', Tone.Frequency(freq).toFrequency() * 0.99, Tone.Frequency(freq).toFrequency() * 1.01).connect(drone.frequency);

    drone.start();
};

export const stopDrone = () => {
    if (drone) {
        drone.stop();
        drone.dispose();
        drone = null;
    }
    if (droneLfo) {
        droneLfo.stop();
        droneLfo.dispose();
        droneLfo = null;
    }
};

// Help convert note index (0-11) to frequency for Tone.js
// Octave 2 for Low E, Octave 4 for High E?
export const indexToFreq = (index: number, octave: number = 3) => {
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    return `${noteNames[index]}${octave}`;
};
