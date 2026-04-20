'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { questions, dimensions } from '@/data/questions';

const QUESTIONS_PER_DIMENSION = 6;
const TOTAL_QUESTIONS = 30;

function generateId(): string {
  return Math.random().toString(36).slice(2, 11) + Date.now().toString(36);
}

export default function QuizPage() {
  const router = useRouter();

  const [currentDimensionIndex, setCurrentDimensionIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showDimensionIntro, setShowDimensionIntro] = useState(true);
  const [showTransition, setShowTransition] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  const currentDimension = dimensions[currentDimensionIndex];
  const dimensionQuestions = questions.filter(q => q.dimension === currentDimension.id);
  const currentQuestion = dimensionQuestions[currentQuestionIndex];

  const answeredCount = Object.keys(answers).length;
  const progressPercent = (answeredCount / TOTAL_QUESTIONS) * 100;

  const hasCurrentAnswer = currentQuestion && answers[currentQuestion.id] !== undefined;
  const isLastQuestion =
    currentDimensionIndex === dimensions.length - 1 &&
    currentQuestionIndex === QUESTIONS_PER_DIMENSION - 1;

  const canGoBack =
    !showDimensionIntro &&
    !showTransition &&
    (currentQuestionIndex > 0 || currentDimensionIndex > 0);

  function bumpAnim() {
    setAnimKey(k => k + 1);
  }

  function handleOptionSelect(questionId: string, value: number) {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  }

  function advanceQuiz(currentAnswers: Record<string, number>) {
    const lastQ = currentQuestionIndex >= QUESTIONS_PER_DIMENSION - 1;
    const lastD = currentDimensionIndex >= dimensions.length - 1;

    if (lastQ && lastD) {
      const id = generateId();
      localStorage.setItem('axon-quiz-result', JSON.stringify({ id, answers: currentAnswers }));
      router.push('/results?id=' + id);
      return;
    }

    if (lastQ) {
      setShowTransition(true);
      setTimeout(() => {
        setShowTransition(false);
        setCurrentDimensionIndex(prev => prev + 1);
        setCurrentQuestionIndex(0);
        setShowDimensionIntro(true);
      }, 700);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      bumpAnim();
    }
  }

  function handleNext() {
    if (!hasCurrentAnswer) return;
    advanceQuiz(answers);
  }

  const handleBack = useCallback(() => {
    if (!canGoBack) return;
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      bumpAnim();
    } else {
      const prevDimIndex = currentDimensionIndex - 1;
      setCurrentDimensionIndex(prevDimIndex);
      setCurrentQuestionIndex(QUESTIONS_PER_DIMENSION - 1);
      setShowDimensionIntro(false);
      bumpAnim();
    }
  }, [canGoBack, currentQuestionIndex, currentDimensionIndex]);

  // Transition screen
  if (showTransition) {
    const nextDimension = dimensions[currentDimensionIndex + 1];
    return (
      <div className="flex-1 flex items-center justify-center transition-screen anim-fade">
        <div className="text-center">
          <p className="text-sm mb-3 anim-fade-up" style={{ color: '#a900f1', fontWeight: 500 }}>
            Up next
          </p>
          <div className="relative inline-flex items-center justify-center mb-4 anim-scale delay-100">
            <div className="glow-ring" />
            <span style={{ fontSize: 64, display: 'block' }}>{nextDimension.icon}</span>
          </div>
          <p className="text-3xl font-semibold anim-fade-up delay-200" style={{ color: '#ffffff' }}>
            {nextDimension.label}
          </p>
        </div>
      </div>
    );
  }

  // Dimension intro card
  if (showDimensionIntro) {
    return (
      <div
        className="flex-1 flex items-center justify-center px-4"
        style={{ backgroundColor: '#230533' }}
      >
        <div className="w-full max-w-lg text-center anim-fade">
          <div className="relative inline-flex items-center justify-center mb-6 anim-scale">
            <div className="glow-ring" />
            <span className="anim-float" style={{ fontSize: 72, display: 'block' }}>
              {currentDimension.icon}
            </span>
          </div>

          <div className="gradient-bar mx-auto mb-6 anim-fade-up delay-100" style={{ width: 64 }} />

          <h2
            className="mb-4 anim-fade-up delay-200"
            style={{ fontSize: 36, fontWeight: 600, color: '#ffffff', lineHeight: 1.2 }}
          >
            {currentDimension.label}
          </h2>

          <p
            className="mb-3 anim-fade-up delay-300"
            style={{ fontSize: 16, fontWeight: 300, color: '#b0b8c8', lineHeight: 1.65 }}
          >
            {currentDimension.description}
          </p>

          <p
            className="mb-10 anim-fade-up delay-400"
            style={{ fontSize: 13, color: '#a900f1', fontWeight: 400 }}
          >
            {QUESTIONS_PER_DIMENSION} questions
          </p>

          <div className="anim-fade-up delay-500">
            <button
              onClick={() => setShowDimensionIntro(false)}
              className="gradient-bg inline-flex items-center justify-center text-white"
              style={{
                height: 50,
                minWidth: 180,
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 500,
                border: 'none',
                cursor: 'pointer',
                letterSpacing: '0.01em',
              }}
            >
              {"Let's go \u2192"}
            </button>
          </div>

          {currentDimensionIndex > 0 && (
            <div className="mt-6 anim-fade delay-500">
              <button
                className="back-btn"
                onClick={() => {
                  const prevDimIndex = currentDimensionIndex - 1;
                  setCurrentDimensionIndex(prevDimIndex);
                  setCurrentQuestionIndex(QUESTIONS_PER_DIMENSION - 1);
                  setShowDimensionIntro(false);
                  bumpAnim();
                }}
              >
                <span style={{ fontSize: 16 }}>&#8592;</span> Previous section
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Question card
  return (
    <div className="flex-1 flex flex-col dot-grid-bg" style={{ backgroundColor: '#fdf5ff' }}>
      {/* Progress bar */}
      <div style={{ height: 4, backgroundColor: '#ede0ff' }}>
        <div
          className="gradient-bar"
          style={{
            width: `${progressPercent}%`,
            transition: 'width 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
            height: '100%',
            borderRadius: 0,
          }}
        />
      </div>

      {/* Header bar */}
      <div
        className="px-6 py-3 flex items-center justify-between"
        style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #ede0ff' }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/axon-logo-colour.svg" alt="Axon IT" style={{ height: 28, width: 'auto' }} />
        <span className="text-xs" style={{ color: '#a900f1', fontWeight: 400 }}>
          {currentDimension.icon} {currentDimension.label} &middot; {currentQuestionIndex + 1} of {QUESTIONS_PER_DIMENSION}
        </span>
      </div>

      {/* Question area */}
      <div className="flex-1 flex items-start justify-center px-4 py-10">
        <div className="w-full max-w-xl" key={animKey} style={{ willChange: 'transform, opacity' }}>
          <p
            className="text-xs uppercase tracking-widest mb-4 anim-fade-right"
            style={{ color: '#a900f1', fontWeight: 500 }}
          >
            {currentDimension.icon} {currentDimension.label}
          </p>

          <h2
            className="mb-8 anim-fade-up"
            style={{ fontSize: 22, fontWeight: 600, color: '#230533', lineHeight: 1.4 }}
          >
            {currentQuestion.text}
          </h2>

          <OptionList
            key={currentQuestion.id}
            options={currentQuestion.options}
            onSelect={(value) => handleOptionSelect(currentQuestion.id, value)}
            currentAnswer={answers[currentQuestion.id]}
          />
        </div>
      </div>

      {/* Bottom navigation */}
      <div
        className="px-6 py-4 flex items-center justify-between"
        style={{ borderTop: '1px solid #ede0ff', backgroundColor: '#fdf5ff' }}
      >
        {canGoBack ? (
          <button className="back-btn" onClick={handleBack}>
            <span style={{ fontSize: 16 }}>&#8592;</span> Back
          </button>
        ) : (
          <span />
        )}

        <button
          onClick={handleNext}
          disabled={!hasCurrentAnswer}
          className="gradient-bg text-white"
          style={{
            height: 44,
            minWidth: 130,
            borderRadius: 10,
            fontSize: 14,
            fontWeight: 500,
            border: 'none',
            cursor: hasCurrentAnswer ? 'pointer' : 'not-allowed',
            opacity: hasCurrentAnswer ? 1 : 0.35,
            transition: 'opacity 0.2s ease, transform 0.15s ease',
            letterSpacing: '0.01em',
          }}
        >
          {isLastQuestion ? 'See Results \u2192' : 'Next \u2192'}
        </button>
      </div>
    </div>
  );
}

function OptionList({
  options,
  onSelect,
  currentAnswer,
}: {
  options: { label: string; value: number }[];
  onSelect: (value: number) => void;
  currentAnswer?: number;
}) {
  return (
    <div className="flex flex-col gap-3">
      {options.map((option, idx) => {
        const isSelected = currentAnswer === option.value;
        return (
          <button
            key={idx}
            onClick={() => onSelect(option.value)}
            className={`option-btn anim-fade-up${isSelected ? ' selected' : ''}`}
            style={{
              animationDelay: `${0.04 + idx * 0.06}s`,
              padding: '15px 20px',
              borderRadius: 10,
              border: isSelected ? '2px solid #a900f1' : '1.5px solid #ede0ff',
              backgroundColor: isSelected ? '#f5eaff' : '#ffffff',
              cursor: 'pointer',
              textAlign: 'left',
              fontSize: 14,
              fontWeight: isSelected ? 500 : 300,
              color: '#230533',
              lineHeight: 1.45,
            }}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
