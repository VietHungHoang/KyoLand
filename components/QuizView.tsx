import React, { useState } from 'react';
import type { QuizQuestion, VocabularyWord } from '../types';

interface QuizViewProps {
  quizData: {
    questions: QuizQuestion[];
    words: VocabularyWord[];
  };
  onFinishQuiz: (practicedWords: VocabularyWord[]) => void;
  onBack: () => void;
}

type AnswerStatus = 'unanswered' | 'correct' | 'incorrect';

const QuizView: React.FC<QuizViewProps> = ({ quizData, onFinishQuiz, onBack }) => {
  const { questions, words } = quizData;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(string | null)[]>(Array(questions.length).fill(null));
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const selectedAnswer = userAnswers[currentQuestionIndex];

  const handleSelectAnswer = (option: string) => {
    if (selectedAnswer) return; // Don't allow changing answers
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = option;
    setUserAnswers(newAnswers);
  };
  
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setIsFinished(true);
    }
  };
  
  const handleFinish = () => {
      onFinishQuiz(words);
  }

  const score = userAnswers.reduce((acc, answer, index) => {
    return answer === questions[index].answer ? acc + 1 : acc;
  }, 0);

  if (isFinished) {
    return (
        <div className="bg-surface rounded-xl shadow-sm border border-stroke p-8 text-center max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-onSurface mb-4">Quiz Complete!</h2>
            <p className="text-2xl text-onSurfaceSecondary mb-6">
                You scored
            </p>
            <p className="text-7xl font-bold text-primary mb-8">{score} / {questions.length}</p>
            
            <div className="text-left space-y-4 mb-8">
                <h3 className="text-xl font-semibold text-onSurface">Review your answers:</h3>
                {questions.map((q, index) => (
                    <div key={index} className={`p-4 rounded-lg border-l-4 ${userAnswers[index] === q.answer ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
                        <p className="text-onSurface mb-1">{index + 1}. {q.question.replace('______', `<strong>${q.answer}</strong>`)}</p>
                        <p className="text-sm">Your answer: <span className={userAnswers[index] === q.answer ? 'text-green-700' : 'text-red-700'}>{userAnswers[index]}</span></p>
                    </div>
                ))}
            </div>

            <button onClick={handleFinish} className="w-full bg-primary text-onPrimary px-6 py-3 rounded-lg text-lg font-semibold hover:bg-primary-dark transition-colors">
                Finish & Update Practice Count
            </button>
        </div>
    );
  }

  return (
    <div className="bg-surface rounded-xl shadow-sm border border-stroke p-8 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-onSurface">Question {currentQuestionIndex + 1} of {questions.length}</h2>
        <div className="text-lg font-bold text-primary">Score: {score}</div>
      </div>
      
      <p className="text-2xl text-onSurface mb-8 leading-relaxed">{currentQuestion.question}</p>

      <div className="space-y-4">
        {currentQuestion.options.map((option, index) => {
          let status: AnswerStatus = 'unanswered';
          if (selectedAnswer) {
              if (option === currentQuestion.answer) {
                  status = 'correct';
              } else if (option === selectedAnswer) {
                  status = 'incorrect';
              }
          }

          const baseClasses = "w-full text-left p-4 rounded-lg border text-lg transition-all duration-200";
          const statusClasses = {
              unanswered: "bg-background border-stroke hover:bg-primary/10 hover:border-primary/50",
              correct: "bg-green-100 border-green-500 text-green-800 font-semibold",
              incorrect: "bg-red-100 border-red-500 text-red-800 font-semibold"
          };

          return (
            <button
              key={index}
              onClick={() => handleSelectAnswer(option)}
              disabled={!!selectedAnswer}
              className={`${baseClasses} ${statusClasses[status]}`}
            >
              <span className="font-bold mr-3">{String.fromCharCode(65 + index)}.</span>
              {option}
            </button>
          );
        })}
      </div>

      {selectedAnswer && (
        <div className="mt-8 text-right">
            <button onClick={handleNext} className="bg-primary text-onPrimary px-8 py-2 rounded-lg text-lg font-semibold hover:bg-primary-dark transition-colors">
                {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
            </button>
        </div>
      )}
    </div>
  );
};

export default QuizView;
