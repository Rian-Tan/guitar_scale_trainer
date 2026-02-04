'use client';

import React, { useState, useRef } from 'react';
import styles from './Learning.module.css';
import * as Tone from 'tone';
import { SCALES, getNotesInScale, getNoteName } from '@/lib/music-theory';
import { generatePattern, getAbsoluteScaleSequence, findNextPosition } from '@/lib/learning-logic';
import { useStore } from '@/store/useStore';
import { playNote, indexToFreq, startDrone, stopDrone } from '@/lib/audio-engine';
import { getFretboardNotes, STANDARD_TUNING, FretboardNote } from '@/lib/fretboard-logic';

export const PatternPlayer = () => {
    const { rootNote, scaleType, learningMode, setLearningMode, setPlayingNote, startNotePos } = useStore();
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(500);
    const [direction, setDirection] = useState<'asc' | 'desc'>('asc');
    const [isDroneOn, setIsDroneOn] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const fretboardNotes = getFretboardNotes(STANDARD_TUNING, 15);

    const startPattern = (pitches: number[]) => {
        if (isPlaying) {
            if (timerRef.current) clearInterval(timerRef.current);
            setIsPlaying(false);
            setPlayingNote(null);
            return;
        }

        let index = 0;
        let currentPos: { string: number, fret: number, absolutePitch: number } | null = null;

        // If we have a startNotePos, find its absolute pitch
        if (startNotePos) {
            currentPos = fretboardNotes.find(n => n.string === startNotePos.string && n.fret === startNotePos.fret) || null;
        }

        setIsPlaying(true);

        timerRef.current = setInterval(() => {
            if (index >= pitches.length) {
                clearInterval(timerRef.current!);
                setIsPlaying(false);
                setPlayingNote(null);
                return;
            }

            const targetPitch = pitches[index];
            playNote(Tone.Frequency(targetPitch, "midi").toFrequency());

            const nextPos = findNextPosition(targetPitch, currentPos, fretboardNotes, direction);
            if (nextPos) {
                setPlayingNote({ string: nextPos.string, fret: nextPos.fret });
                currentPos = nextPos;
                setTimeout(() => setPlayingNote(null), speed * 0.8);
            }

            index++;
        }, speed);
    };

    const play3rds = () => {
        let startPitch = 40 + rootNote;
        if (startNotePos) {
            const found = fretboardNotes.find(n => n.string === startNotePos.string && n.fret === startNotePos.fret);
            if (found) startPitch = found.absolutePitch;
        }

        const sequence = getAbsoluteScaleSequence(
            rootNote,
            SCALES[scaleType].formula,
            startPitch,
            direction,
            1 // 1 octave for 3rds pattern
        );

        // Map sequence to 3rds: 1-3, 2-4, 3-5...
        const thirdsPattern: number[] = [];
        for (let i = 0; i < sequence.length - 2; i++) {
            thirdsPattern.push(sequence[i]);
            thirdsPattern.push(sequence[i + 2]);
        }

        startPattern(thirdsPattern);
    };

    const playLinear = () => {
        // 1. Get starting pitch
        let startPitch = 40 + rootNote; // Default to low E root
        if (startNotePos) {
            const found = fretboardNotes.find(n => n.string === startNotePos.string && n.fret === startNotePos.fret);
            if (found) startPitch = found.absolutePitch;
        }

        const sequence = getAbsoluteScaleSequence(
            rootNote,
            SCALES[scaleType].formula,
            startPitch,
            direction,
            2 // 2 octaves
        );

        startPattern(sequence);
    };

    const toggleDrone = () => {
        if (isDroneOn) {
            stopDrone();
        } else {
            startDrone(indexToFreq(rootNote, 2));
        }
        setIsDroneOn(!isDroneOn);
    };

    return (
        <div className={styles.learningControls}>
            <div className={styles.header}>
                <h3>Learning Mode: Improvisation & Patterns</h3>
                <button
                    className={styles.closeBtn}
                    onClick={() => setLearningMode(false)}
                >
                    Exit
                </button>
            </div>

            <div className={styles.controlGrid}>
                <div className={styles.card}>
                    <h4>Pattern Practice</h4>
                    <p>Internalize melodic sequences like 3rds.</p>
                    <div className={styles.row}>
                        <button onClick={play3rds} className={styles.actionBtn}>
                            {isPlaying ? 'Stop' : 'Play 3rds'}
                        </button>
                        <input
                            type="range"
                            min="200" max="1000"
                            value={speed}
                            onChange={(e) => setSpeed(parseInt(e.target.value))}
                        />
                    </div>
                </div>

                <div className={styles.card}>
                    <h4>Linear Playthrough</h4>
                    <p>2 Octaves. {startNotePos ? `Starting from ${getNoteName(fretboardNotes.find(n => n.string === startNotePos.string && n.fret === startNotePos.fret)?.noteIndex || 0)}` : 'Click board to set start note'}.</p>
                    <div className={styles.row}>
                        <button onClick={playLinear} className={styles.actionBtn}>
                            {isPlaying ? 'Stop' : `Play ${direction === 'asc' ? 'Up' : 'Down'}`}
                        </button>
                        <select
                            className={styles.select}
                            value={direction}
                            onChange={(e) => setDirection(e.target.value as any)}
                        >
                            <option value="asc">Ascending</option>
                            <option value="desc">Descending</option>
                        </select>
                    </div>
                </div>

                <div className={styles.card}>
                    <h4>Modal Context</h4>
                    <p>Play over a drone to hear the "flavor" of the mode.</p>
                    <button
                        onClick={toggleDrone}
                        className={`${styles.actionBtn} ${isDroneOn ? styles.active : ''}`}
                    >
                        {isDroneOn ? 'Stop Drone' : 'Start Root Drone'}
                    </button>
                </div>
            </div>
        </div>
    );
};
