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
    const { rootNote, scaleType, learningMode, setLearningMode, setPlayingNote, selectedPosition, setSelectedPosition } = useStore();
    const [isDroneOn, setIsDroneOn] = useState(false);

    const toggleDrone = () => {
        if (isDroneOn) {
            stopDrone();
        } else {
            startDrone(indexToFreq(rootNote, 2));
        }
        setIsDroneOn(!isDroneOn);
    };

    const positions = [
        { id: 0, name: 'Pos 1', shape: 'CAGED Shape 4' },
        { id: 1, name: 'Pos 2', shape: 'CAGED Shape 3' },
        { id: 2, name: 'Pos 3', shape: 'CAGED Shape 2' },
        { id: 3, name: 'Pos 4', shape: 'CAGED Shape 1' },
        { id: 4, name: 'Pos 5', shape: 'CAGED Shape 5' },
    ];

    return (
        <div className={styles.learningControls}>
            <div className={styles.header}>
                <div className={styles.titleGroup}>
                    <h3>Learning Mode: Scale Visualization</h3>
                    <p className={styles.subtitle}>Explore the 5 standard positions of the {getNoteName(rootNote)} {SCALES[scaleType].name} scale.</p>
                </div>
                <button
                    className={styles.closeBtn}
                    onClick={() => {
                        setLearningMode(false);
                        setSelectedPosition(null);
                    }}
                >
                    Exit
                </button>
            </div>

            <div className={styles.controlGrid}>
                <div className={`${styles.card} ${styles.positionsCard}`}>
                    <h4>Scale Shapes (CAGED Positions)</h4>
                    <p>Select a position to isolate it on the fretboard. Hover notes to see matching pitches.</p>
                    <div className={styles.positionGrid}>
                        <button
                            className={`${styles.posBtn} ${selectedPosition === null ? styles.active : ''}`}
                            onClick={() => setSelectedPosition(null)}
                        >
                            All
                        </button>
                        {positions.map((pos) => (
                            <button
                                key={pos.id}
                                className={`${styles.posBtn} ${selectedPosition === pos.id ? styles.active : ''}`}
                                onClick={() => setSelectedPosition(pos.id)}
                            >
                                {pos.name}
                                <span className={styles.posDesc}>{pos.shape}</span>
                            </button>
                        ))}
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
