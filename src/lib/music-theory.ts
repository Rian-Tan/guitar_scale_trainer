export const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export type ScaleFormula = number[];

export const SCALES: Record<string, { formula: ScaleFormula; name: string }> = {
    ionian: { formula: [0, 2, 4, 5, 7, 9, 11], name: 'Ionian (Major)' },
    dorian: { formula: [0, 2, 3, 5, 7, 9, 10], name: 'Dorian' },
    phrygian: { formula: [0, 1, 3, 5, 7, 8, 10], name: 'Phrygian' },
    lydian: { formula: [0, 2, 4, 6, 7, 9, 11], name: 'Lydian' },
    mixolydian: { formula: [0, 2, 4, 5, 7, 9, 10], name: 'Mixolydian' },
    aeolian: { formula: [0, 2, 3, 5, 7, 8, 10], name: 'Aeolian (Natural Minor)' },
    locrian: { formula: [0, 1, 3, 5, 6, 8, 10], name: 'Locrian' },
    majorPentatonic: { formula: [0, 2, 4, 7, 9], name: 'Major Pentatonic' },
    minorPentatonic: { formula: [0, 3, 5, 7, 10], name: 'Minor Pentatonic' },
    blues: { formula: [0, 3, 5, 6, 7, 10], name: 'Blues' },
};

export const getNotesInScale = (rootIndex: number, formula: ScaleFormula): number[] => {
    return formula.map((interval) => (rootIndex + interval) % 12);
};

export const getNoteName = (index: number): string => {
    return NOTES[index % 12];
};
