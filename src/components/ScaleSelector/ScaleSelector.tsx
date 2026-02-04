'use client';

import React from 'react';
import styles from './ScaleSelector.module.css';
import { useStore } from '@/store/useStore';
import { NOTES, SCALES } from '@/lib/music-theory';

export const ScaleSelector = () => {
    const {
        rootNote, scaleType, setRootNote, setScaleType,
        trainerMode, setTrainerMode,
        learningMode, setLearningMode,
        showIntervals, setShowIntervals
    } = useStore();

    return (
        <div className={styles.selectorContainer}>
            <div className={styles.group}>
                <label>Root Note</label>
                <select value={rootNote} onChange={(e) => setRootNote(parseInt(e.target.value))}>
                    {NOTES.map((note, i) => (
                        <option key={note} value={i}>{note}</option>
                    ))}
                </select>
            </div>

            <div className={styles.group}>
                <label>Scale / Mode</label>
                <select value={scaleType} onChange={(e) => setScaleType(e.target.value)}>
                    {Object.entries(SCALES).map(([key, value]) => (
                        <option key={key} value={key}>{value.name}</option>
                    ))}
                </select>
            </div>

            <div className={styles.group}>
                <label className={styles.checkboxLabel}>
                    <input
                        type="checkbox"
                        checked={showIntervals}
                        onChange={(e) => setShowIntervals(e.target.checked)}
                    />
                    Interval View
                </label>
            </div>

            <div className={styles.group}>
                <div className={styles.buttonRow}>
                    <button
                        className={`${styles.trainerButton} ${trainerMode ? styles.active : ''}`}
                        onClick={() => setTrainerMode(!trainerMode)}
                    >
                        {trainerMode ? 'Exit Trainer' : 'Start Trainer'}
                    </button>

                    <button
                        className={`${styles.learningButton} ${learningMode ? styles.active : ''}`}
                        onClick={() => setLearningMode(!learningMode)}
                    >
                        {learningMode ? 'Exit Learning' : 'Learning Mode'}
                    </button>
                </div>
            </div>
        </div>
    );
};
