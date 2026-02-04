'use client';

import React, { useEffect, useState } from 'react';
import styles from './Trainer.module.css';
import { useStore } from '@/store/useStore';
import { getNotesInScale, SCALES, getNoteName } from '@/lib/music-theory';
import { STANDARD_TUNING, getFretboardNotes } from '@/lib/fretboard-logic';

export const Trainer = () => {
    const { trainerMode, userClicks, rootNote, scaleType, resetUserClicks } = useStore();
    const [feedback, setFeedback] = useState<string | null>(null);
    const [score, setScore] = useState(0);

    const scaleFormula = SCALES[scaleType].formula;
    const scaleNotes = getNotesInScale(rootNote, scaleFormula);

    useEffect(() => {
        if (userClicks.length === 0) return;

        const lastClick = userClicks[userClicks.length - 1];
        const noteIndex = (STANDARD_TUNING[lastClick.string] + lastClick.fret) % 12;

        if (scaleNotes.includes(noteIndex)) {
            setFeedback('Correct!');
            setScore(s => s + 1);
        } else {
            setFeedback('Wrong Note!');
            setScore(s => Math.max(0, s - 1));
        }

        const timer = setTimeout(() => setFeedback(null), 1000);
        return () => clearTimeout(timer);
    }, [userClicks]);

    if (!trainerMode) return null;

    return (
        <div className={styles.trainerOverlay}>
            <div className={styles.stats}>
                <div className={styles.statItem}>
                    <span>Mode:</span>
                    <strong>{getNoteName(rootNote)} {SCALES[scaleType].name}</strong>
                </div>
                <div className={styles.statItem}>
                    <span>Score:</span>
                    <strong>{score}</strong>
                </div>
            </div>

            {feedback && (
                <div className={`${styles.feedback} ${feedback === 'Correct!' ? styles.success : styles.error}`}>
                    {feedback}
                </div>
            )}

            <div className={styles.instructions}>
                Find and click all notes in the scale.
                <button onClick={resetUserClicks} className={styles.resetBtn}>Clear Fretboard</button>
            </div>
        </div>
    );
};
