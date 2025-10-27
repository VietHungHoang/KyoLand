import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import type { QuizQuestion, VocabularyWord } from '../types';
import { SparklesIcon } from './icons/Icons';

interface QuizViewProps {
  quizData: {
    questions: QuizQuestion[];
    words: VocabularyWord[];
  };
  onFinishQuiz: (practicedWords: VocabularyWord[]) => void;
  onBack: () => void;
  apiKey: string;
}

type AnswerStatus = 'unanswered' | 'correct' | 'incorrect';

const QuizView: React.FC<QuizViewProps> = ({ quizData, onFinishQuiz, onBack, apiKey }) => {
  const { questions, words } = quizData;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(string | null)[]>(Array(questions.length).fill(null));
  const [isFinished, setIsFinished] = useState(false);
  
  const [explanations, setExplanations] = useState<Record<number, string>>({});
  const [isFetchingExplanation, setIsFetchingExplanation] = useState(false);
  const [explanationError, setExplanationError] = useState<string | null>(null);

  const currentQuestion = questions[currentQuestionIndex];
  const selectedAnswer = userAnswers[currentQuestionIndex];

  const handleSelectAnswer = (option: string) => {
    if (selectedAnswer) return; // Don't allow changing answers
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = option;
    setUserAnswers(newAnswers);
  };
  
  const handleNext = () => {
    setExplanationError(null);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setIsFinished(true);
    }
  };
  
  const handleFinish = () => {
      onFinishQuiz(words);
  }

  const handleFetchExplanation = async () => {
    if (!apiKey) {
      setExplanationError("API Key is not configured. Please add it in the settings.");
      return;
    }

    setIsFetchingExplanation(true);
    setExplanationError(null);

    try {
      const ai = new GoogleGenAI({ apiKey });
      
      const questionText = currentQuestion.question;
      const answerText = currentQuestion.answer;

      const prompt = `
        You are an expert English teacher who provides detailed explanations for TOEIC Part 5 style grammar questions. Your explanations must be in Vietnamese and follow a very specific format.

        Here is the question and the correct answer:
        Question: "${questionText}"
        Correct Answer: "${answerText}"

        Please generate a detailed explanation for why "${answerText}" is the correct choice for this question.

        The output MUST follow this exact structure, using the specified headers in Vietnamese. Do not add any extra text or introductions.

        ---
        Câu hỏi: ${questionText}
        Đáp án: ${answerText}

        **Lý do:**

        [Provide a clear, concise reason why the correct answer is grammatically correct for the sentence. Explain the key grammar rule involved.]

        **Phân tích câu**

        **Phân tích Từ vựng** (Bỏ qua các từ đơn giản như "a", "the", "is", "are", "to", "by", "for")

        [For each significant word or phrase in the sentence, provide the following:]
        - **Word /wɜːd/ (Part of Speech):** [Vietnamese meaning].
          - **Nghĩa trong ngữ cảnh:** [Explanation of how the word is used in this specific sentence.]

        **Ngữ pháp**

        [Analyze the key grammatical structures in the sentence. For example, identify and explain relative clauses, passive voice, verb tenses, subject-verb agreement, etc.]

        **Bản dịch**

        => **Bản dịch:** [Provide a full, natural-sounding Vietnamese translation of the complete sentence.]
        ---
      `;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const explanationText = response.text;
      setExplanations(prev => ({
        ...prev,
        [currentQuestionIndex]: explanationText,
      }));

    } catch (err) {
      console.error("Error fetching explanation:", err);
      setExplanationError("Sorry, we couldn't fetch an explanation. The AI may be busy. Please try again.");
    } finally {
      setIsFetchingExplanation(false);
    }
  };


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
                        <p className="text-onSurface mb-1" dangerouslySetInnerHTML={{ __html: `${index + 1}. ${q.question.replace('______', `<strong>${q.answer}</strong>`)}` }} />
                        <p className="text-sm">Your answer: <span className={userAnswers[index] === q.answer ? 'text-green-700 font-semibold' : 'text-red-700 font-semibold'}>{userAnswers[index]}</span></p>
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
        <div className="mt-6 border-t border-stroke pt-6">
          {explanations[currentQuestionIndex] ? (
              <div className="bg-background p-4 rounded-lg border border-stroke">
                  <h4 className="text-xl font-semibold text-onSurface mb-3">Giải thích chi tiết</h4>
                  <pre className="text-onSurfaceSecondary whitespace-pre-wrap font-sans text-base leading-relaxed">
                      {explanations[currentQuestionIndex]}
                  </pre>
              </div>
          ) : (
            <div className="text-center">
              <button
                onClick={handleFetchExplanation}
                disabled={isFetchingExplanation}
                className="flex items-center justify-center bg-secondary text-onPrimary px-5 py-2 rounded-lg text-base font-semibold hover:opacity-90 transition-opacity duration-200 disabled:opacity-50 disabled:cursor-wait"
              >
                {isFetchingExplanation ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang tải...
                  </>
                ) : (
                  <>
                    <SparklesIcon className="w-5 h-5 mr-2" />
                    Xem giải thích
                  </>
                )}
              </button>
              {explanationError && <p className="text-red-500 text-sm mt-2">{explanationError}</p>}
            </div>
          )}
        </div>
      )}


      {selectedAnswer && (
        <div className="mt-8 text-right">
            <button onClick={handleNext} className="bg-primary text-onPrimary px-8 py-2 rounded-lg text-lg font-semibold hover:bg-primary-dark transition-colors">
                {currentQuestionIndex < questions.length - 1 ? 'Câu tiếp theo' : 'Hoàn thành'}
            </button>
        </div>
      )}
    </div>
  );
};

export default QuizView;