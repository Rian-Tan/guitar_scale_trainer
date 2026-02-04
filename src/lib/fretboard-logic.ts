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

// CAGED-style positions calculated relative to the root note on the 6th string
// Each position typically covers a 4-5 fret span.
export const getPositionBounds = (rootNoteIndex: number, positionIndex: number): { start: number, end: number } => {
    // 1. Find the first occurrence of rootNoteIndex on the 6th string
    // Tuning[5] is Low E (index 4)
    let rootFret = (rootNoteIndex - 4 + 12) % 12;

    // The 5 positions are roughly:
    // Pos 1: Root on 6th string (Pointer/Middle finger)
    // Pos 2: Root on 6th string (Pinky finger) - starts higher
    // Actually let's use a simpler mapping for now that matches the common "5 shapes"

    const offsets = [
        { start: -1, end: 3 },  // Pos 1 (Shape 4 in some systems) - Root is near the start
        { start: 2, end: 6 },   // Pos 2
        { start: 4, end: 8 },   // Pos 3
        { start: 7, end: 11 },  // Pos 4
        { start: 9, end: 13 },  // Pos 5
    ];

    const offset = offsets[positionIndex % 5];

    return {
        start: Math.max(0, rootFret + offset.start),
        end: rootFret + offset.end
    };
};
