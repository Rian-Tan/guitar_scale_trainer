'use client';

import React from 'react';
import styles from './Fretboard.module.css';
import { useStore } from '@/store/useStore';
import { SCALES, getNotesInScale, getNoteName } from '@/lib/music-theory';
import { STANDARD_TUNING, getFretboardNotes, getPositionBounds } from '@/lib/fretboard-logic';
import { playNote, indexToFreq } from '@/lib/audio-engine';
import { getIntervalName } from '@/lib/learning-logic';

const FRET_COUNT = 15;
const STRING_COUNT = 6;
const NUT_OFFSET = 5; // Percentage for the "headstock" area

export const Fretboard = () => {
    const { rootNote, scaleType, position, trainerMode, learningMode, addUserClick, userClicks, showIntervals, playingNote, setStartNotePos, startNotePos, selectedPosition, hoveredNote, setHoveredNote } = useStore();
    const [activeNote, setActiveNote] = React.useState<{ string: number, fret: number } | null>(null);

    const scaleFormula = SCALES[scaleType].formula;
    const scaleNotes = getNotesInScale(rootNote, scaleFormula);
    const fretboardNotes = getFretboardNotes(STANDARD_TUNING, FRET_COUNT);

    const getNoteColor = (noteIndex: number, isRoot: boolean, isHoveredPitch: boolean) => {
        if (isRoot) return 'var(--accent-color)';
        if (isHoveredPitch) return '#4d7c0f'; // Highlight for same pitch class
        return 'var(--primary-color)';
    };

    const isNoteInScale = (noteIndex: number) => scaleNotes.includes(noteIndex);

    const handleFretClick = async (string: number, fret: number, noteIndex: number) => {
        // Play sound
        const octave = 2 + Math.floor((5 - string) * 0.7) + Math.floor(fret / 12);
        playNote(indexToFreq(noteIndex, octave));

        // Visual feedback
        setActiveNote({ string, fret });
        setTimeout(() => setActiveNote(null), 200);

        if (trainerMode) {
            addUserClick({ string, fret });
        }

        if (learningMode) {
            setStartNotePos({ string, fret });
        }
    };

    // Calculate bounds if a position is selected
    const currentBounds = selectedPosition !== null ? getPositionBounds(rootNote, selectedPosition) : null;

    const renderMarkers = () => {
        const markers = [3, 5, 7, 9, 12, 15];
        return markers.map((fret) => (
            <div key={`marker-${fret}`} className={styles.marker} style={{ left: `${NUT_OFFSET + (fret - 0.5) * ((100 - NUT_OFFSET) / FRET_COUNT)}%` }}>
                {fret === 12 ? <><div className={styles.dot} /><div className={styles.dot} /></> : <div className={styles.dot} />}
            </div>
        ));
    };

    const renderSideMarkers = () => {
        const markers = [3, 5, 7, 9, 12, 15];
        return (
            <div className={styles.sideInlays}>
                {markers.map((fret) => (
                    <div
                        key={`side-marker-${fret}`}
                        className={styles.sideMarkerGroup}
                        style={{ left: `${NUT_OFFSET + (fret - 0.5) * ((100 - NUT_OFFSET) / FRET_COUNT)}%` }}
                    >
                        {fret === 12 ? (
                            <>
                                <div className={styles.sideDot} />
                                <div className={styles.sideDot} />
                            </>
                        ) : (
                            <div className={styles.sideDot} />
                        )}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className={styles.fretboardContainer}>
            <div className={styles.fretboard}>
                {renderMarkers()}

                {/* Bounds highlight for selected position */}
                {currentBounds && (
                    <div
                        className={styles.positionBg}
                        style={{
                            left: `${NUT_OFFSET + (currentBounds.start - 0.5) * ((100 - NUT_OFFSET) / FRET_COUNT)}%`,
                            width: `${(currentBounds.end - currentBounds.start + 1) * ((100 - NUT_OFFSET) / FRET_COUNT)}%`
                        }}
                    />
                )}

                {/* Strings */}
                {Array.from({ length: STRING_COUNT }).map((_, i) => (
                    <div key={`string-${i}`} className={styles.string} style={{ top: `${(i + 0.5) * (100 / STRING_COUNT)}%` }} />
                ))}

                {/* Frets */}
                {Array.from({ length: FRET_COUNT + 1 }).map((_, i) => (
                    <div
                        key={`fret-${i}`}
                        className={i === 0 ? styles.nut : styles.fret}
                        style={{ left: `${NUT_OFFSET + i * ((100 - NUT_OFFSET) / FRET_COUNT)}%` }}
                    />
                ))}

                {/* Notes */}
                {fretboardNotes.map((note, i) => {
                    const inScale = isNoteInScale(note.noteIndex);
                    const isRoot = note.noteIndex === rootNote;

                    // Apply position filtering in Learning Mode
                    if (learningMode && currentBounds) {
                        if (note.fret < currentBounds.start || note.fret > currentBounds.end) return null;
                    }

                    if (!inScale && !trainerMode) return null;

                    const isClicked = userClicks.some(c => c.string === note.string && c.fret === note.fret);
                    const isPlaying = playingNote?.string === note.string && playingNote?.fret === note.fret;
                    const isStartNote = startNotePos?.string === note.string && startNotePos?.fret === note.fret;
                    const isActive = isPlaying || (activeNote?.string === note.string && activeNote?.fret === note.fret);
                    const isHoveredPitch = hoveredNote === note.noteIndex;

                    // Position calculation
                    const fretWidth = (100 - NUT_OFFSET) / FRET_COUNT;
                    const leftPos = note.fret === 0
                        ? (NUT_OFFSET / 2) // Center of the headstock area
                        : NUT_OFFSET + (note.fret - 0.5) * fretWidth;

                    if (trainerMode && !isClicked) {
                        return (
                            <div
                                key={`note-${i}`}
                                className={styles.clickableArea}
                                style={{
                                    left: `${leftPos}%`,
                                    top: `${(note.string + 0.5) * (100 / STRING_COUNT)}%`
                                }}
                                onClick={() => handleFretClick(note.string, note.fret, note.noteIndex)}
                            />
                        );
                    }

                    if (!inScale) return null;

                    return (
                        <div
                            key={`note-${i}`}
                            className={`${styles.note} ${isRoot ? styles.root : ''} ${isActive ? styles.active : ''} ${isStartNote ? styles.startNote : ''} ${note.fret === 0 ? styles.openNote : ''} ${isHoveredPitch ? styles.pitchHover : ''}`}
                            style={{
                                left: `${leftPos}%`,
                                top: `${(note.string + 0.5) * (100 / STRING_COUNT)}%`,
                                backgroundColor: getNoteColor(note.noteIndex, isRoot, isHoveredPitch)
                            }}
                            onClick={() => handleFretClick(note.string, note.fret, note.noteIndex)}
                            onMouseEnter={() => setHoveredNote(note.noteIndex)}
                            onMouseLeave={() => setHoveredNote(null)}
                        >
                            <span className={styles.noteLabel}>
                                {showIntervals ? getIntervalName(note.noteIndex, rootNote) : getNoteName(note.noteIndex)}
                            </span>
                        </div>
                    );
                })}
            </div>
            {renderSideMarkers()}
        </div>
    );
};
