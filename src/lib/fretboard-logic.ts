export interface FretboardNote {
    string: number;
    fret: number;
    noteIndex: number;
    absolutePitch: number;
}

export const TUNINGS = {
    standard: [4, 11, 7, 2, 9, 4], // E2, A2, D3, G3, B3, E4 (mapped to chromatic indices)
};

// NOTES: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
// Indices: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11
// E = 4, A = 9, D = 2, G = 7, B = 11, e = 4

export const STANDARD_TUNING = [4, 11, 7, 2, 9, 4]; // Top to bottom (E, B, G, D, A, E)
const STANDARD_TUNING_ABSOLUTE = [64, 59, 55, 50, 45, 40];

export const getFretboardNotes = (tuning: number[], fretCount: number): FretboardNote[] => {
    const notes: FretboardNote[] = [];
    tuning.forEach((rootNoteIndex, stringIndex) => {
        const basePitch = STANDARD_TUNING_ABSOLUTE[stringIndex];
        for (let fret = 0; fret <= fretCount; fret++) {
            notes.push({
                string: stringIndex,
                fret: fret,
                noteIndex: (rootNoteIndex + fret) % 12,
                absolutePitch: basePitch + fret
            });
        }
    });
    return notes;
};

export const CAGED_POSITIONS = {
    major: [
        { start: 0, end: 4 }, // C shape
        { start: 2, end: 6 }, // A shape
        { start: 5, end: 9 }, // G shape
        { start: 7, end: 11 }, // E shape
        { start: 10, end: 14 }, // D shape
    ],
};
