export type ScaleInterval = '1' | 'b2' | '2' | 'b3' | '3' | '4' | 'b5' | '5' | 'b6' | '6' | 'b7' | '7';

const INTERVAL_MAP: Record<number, ScaleInterval> = {
    0: '1', 1: 'b2', 2: '2', 3: 'b3', 4: '3', 5: '4', 6: 'b5', 7: '5', 8: 'b6', 9: '6', 10: 'b7', 11: '7',
};

export const getIntervalName = (noteIndex: number, rootIndex: number): ScaleInterval => {
    const diff = (noteIndex - rootIndex + 12) % 12;
    return INTERVAL_MAP[diff];
};

/**
 * Returns absolute pitch (semitones) for a note in a scale.
 * Assuming rootPitch is something like 40 (E2).
 */
export const getAbsoluteScaleSequence = (
    rootNoteIdx: number,
    formula: number[],
    startPitch: number,
    direction: 'asc' | 'desc',
    octaves: number = 2
): number[] => {
    // Standard chromatic indices for the scale in one octave
    const chromaticScale = formula.map(inter => (rootNoteIdx + inter) % 12);

    // Total notes to generate: octaves * scale.length + 1 (to complete the last octave)
    const count = formula.length * octaves + 1;
    const sequence: number[] = [];

    // Find the starting note's position within the scale infinite sequence
    // First, find which scale degree the startPitch is
    const pitchChrom = startPitch % 12;
    const degreeIdx = chromaticScale.indexOf(pitchChrom);

    if (degreeIdx === -1) {
        // Fallback if startPitch is somehow not in scale
        return [startPitch];
    }

    if (direction === 'asc') {
        let currentPitch = startPitch;
        let currentDegree = degreeIdx;

        for (let i = 0; i < count; i++) {
            sequence.push(currentPitch);
            const nextDegree = (currentDegree + 1) % formula.length;

            // Calculate interval to next note
            let interval = formula[nextDegree] - formula[currentDegree];
            if (interval <= 0) interval += 12; // Wrap around octave

            currentPitch += interval;
            currentDegree = nextDegree;
        }
    } else {
        let currentPitch = startPitch;
        let currentDegree = degreeIdx;

        for (let i = 0; i < count; i++) {
            sequence.push(currentPitch);
            const nextDegree = (currentDegree - 1 + formula.length) % formula.length;

            // Calculate interval to previous note
            let interval = formula[currentDegree] - formula[nextDegree];
            if (interval <= 0) interval += 12;

            currentPitch -= interval;
            currentDegree = nextDegree;
        }
    }

    return sequence;
};

export const generatePattern = (scaleNotes: number[], type: 'thirds' | 'fourths' | 'groups-of-4'): number[] => {
    const pattern: number[] = [];
    if (type === 'thirds') {
        for (let i = 0; i < scaleNotes.length; i++) {
            pattern.push(scaleNotes[i]);
            pattern.push(scaleNotes[(i + 2) % scaleNotes.length]);
        }
    } else if (type === 'fourths') {
        for (let i = 0; i < scaleNotes.length; i++) {
            pattern.push(scaleNotes[i]);
            pattern.push(scaleNotes[(i + 3) % scaleNotes.length]);
        }
    } else if (type === 'groups-of-4') {
        for (let i = 0; i < scaleNotes.length; i++) {
            for (let j = 0; j < 4; j++) {
                pattern.push(scaleNotes[(i + j) % scaleNotes.length]);
            }
        }
    }
    return pattern;
};

export interface Position {
    string: number;
    fret: number;
    absolutePitch: number;
}

export const findNextPosition = (
    targetPitch: number,
    currentPos: Position | null,
    fretboardNotes: { string: number, fret: number, absolutePitch: number }[],
    direction: 'asc' | 'desc'
): Position | null => {
    const occurrences = fretboardNotes.filter(n => n.absolutePitch === targetPitch);
    if (occurrences.length === 0) return null;
    if (!currentPos) return occurrences[0];

    const MAX_FRET_STRETCH = 5;

    return occurrences.sort((a, b) => {
        // Preference 1: Proximity to current fret (staying in position)
        const distA = Math.abs(a.fret - currentPos.fret);
        const distB = Math.abs(b.fret - currentPos.fret);

        // Preference 2: Directional movement
        if (direction === 'asc') {
            const shiftA = a.fret - currentPos.fret;
            const shiftB = b.fret - currentPos.fret;

            // Avoid large backwards jumps if possible
            if (shiftA >= 0 && shiftB < 0) return -1;
            if (shiftB >= 0 && shiftA < 0) return 1;
        } else {
            const shiftA = currentPos.fret - a.fret;
            const shiftB = currentPos.fret - b.fret;

            if (shiftA >= 0 && shiftB < 0) return -1;
            if (shiftB >= 0 && shiftA < 0) return 1;
        }

        return distA - distB;
    })[0];
};
