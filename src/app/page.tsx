'use client';

import React from 'react';
import { Fretboard } from '@/components/Fretboard/Fretboard';
import { ScaleSelector } from '@/components/ScaleSelector/ScaleSelector';
import { Trainer } from '@/components/Trainer/Trainer';
import { PatternPlayer as LearningMode } from '@/components/Trainer/LearningMode';
import { useStore } from '@/store/useStore';

export default function Home() {
  const { learningMode } = useStore();

  return (
    <main className="container">
      <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '0.5rem', background: 'linear-gradient(to right, var(--primary-color), var(--accent-color))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Scale Mastery
        </h1>
        <p style={{ opacity: 0.6, fontSize: '1.2rem' }}>
          Master the guitar fretboard with interactive scale training.
        </p>
      </header>

      <section className="card glass">
        <ScaleSelector />
        <Fretboard />
        <Trainer />
        {learningMode && <LearningMode />}
      </section>

      <footer style={{ marginTop: '4rem', opacity: 0.4, textAlign: 'center', fontSize: '0.875rem' }}>
        <p>Built for guitarists. Master your modes.</p>
      </footer>
    </main>
  );
}
