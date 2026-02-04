import { create } from 'zustand';
import { NOTES } from '../lib/music-theory';

interface AppState {
    rootNote: number;
    scaleType: string;
    position: number | null; // null means full fretboard
    trainerMode: boolean;
    learningMode: boolean;
    showIntervals: boolean;
    playingNote: { string: number; fret: number } | null;
    startNotePos: { string: number; fret: number } | null;
    userClicks: { string: number; fret: number }[];

    setRootNote: (index: number) => void;
    setScaleType: (type: string) => void;
    setPosition: (pos: number | null) => void;
    setTrainerMode: (enabled: boolean) => void;
    setLearningMode: (enabled: boolean) => void;
    setShowIntervals: (enabled: boolean) => void;
    setPlayingNote: (note: { string: number; fret: number } | null) => void;
    setStartNotePos: (pos: { string: number; fret: number } | null) => void;
    addUserClick: (click: { string: number; fret: number }) => void;
    resetUserClicks: () => void;
}

export const useStore = create<AppState>((set) => ({
    rootNote: 0, // C
    scaleType: 'ionian',
    position: null,
    trainerMode: false,
    learningMode: false,
    showIntervals: false,
    playingNote: null,
    startNotePos: null,
    userClicks: [],

    setRootNote: (index) => set({ rootNote: index }),
    setScaleType: (type) => set({ scaleType: type }),
    setPosition: (pos) => set({ position: pos }),
    setTrainerMode: (enabled) => set({ trainerMode: enabled, learningMode: false, userClicks: [] }),
    setLearningMode: (enabled) => set({ learningMode: enabled, trainerMode: false, startNotePos: null }),
    setShowIntervals: (enabled) => set({ showIntervals: enabled }),
    setPlayingNote: (note) => set({ playingNote: note }),
    setStartNotePos: (pos) => set({ startNotePos: pos }),
    addUserClick: (click) => set((state) => ({ userClicks: [...state.userClicks, click] })),
    resetUserClicks: () => set({ userClicks: [] }),
}));
