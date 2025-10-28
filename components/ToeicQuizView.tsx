import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
import type { ToeicQuestion } from '../types';
import { CheckCircleIcon, XCircleIcon, EyeIcon, ForwardIcon, SparklesIcon } from './icons/Icons';

interface ToeicQuizViewProps {
  partNumber: number;
  testNumber: number;
  apiKey: string;
  onFinish: () => void;
}

type DictationStatus = 'unanswered' | 'correct' | 'incorrect';

const DictationInput: React.FC<{
    label: string;
    value: string;
    correctAnswer: string;
    status: DictationStatus;
    onChange: (value: string) => void;
    onEnter: () => void;
    onShowAnswer: () => void;
    userAttempt: string | null;
}> = ({ label, value, correctAnswer, status, onChange, onEnter, onShowAnswer, userAttempt }) => {
    const statusClasses = {
        unanswered: 'border-stroke focus:border-primary',
        correct: 'border-green-500 bg-green-50',
        incorrect: 'border-red-500 bg-red-50',
    };
    return (
        <div>
            <label className="block text-sm font-medium text-onSurfaceSecondary mb-1">{label}</label>
            <div className="relative">
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && onEnter()}
                    className={`w-full p-2 pr-10 border rounded-md transition-colors bg-background ${statusClasses[status]}`}
                    disabled={status === 'correct'}
                />
                <button
                    onClick={onShowAnswer}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-onSurfaceSecondary hover:text-primary"
                    title="Show answer"
                >
                    <EyeIcon className="w-5 h-5" />
                </button>
            </div>
            {userAttempt && status === 'correct' && (
                 <div className="text-xs text-onSurfaceSecondary mt-1">
                    Your answer: <span className="line-through text-red-600">{userAttempt}</span>
                 </div>
            )}
        </div>
    );
};

const ToeicQuizView: React.FC<ToeicQuizViewProps> = ({ partNumber, testNumber, apiKey, onFinish }) => {
    const [questions, setQuestions] = useState<ToeicQuestion[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showUrlInput, setShowUrlInput] = useState(false);
    const [customUrl, setCustomUrl] = useState('');

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<'A' | 'B' | 'C' | null>(null);
    const [isAnswerChecked, setIsAnswerChecked] = useState(false);

    const [dictationInputs, setDictationInputs] = useState({ q: '', a: '', b: '', c: '' });
    const [dictationStatuses, setDictationStatuses] = useState({
        q: 'unanswered' as DictationStatus,
        a: 'unanswered' as DictationStatus,
        b: 'unanswered' as DictationStatus,
        c: 'unanswered' as DictationStatus
    });
    const [userDictationAttempts, setUserDictationAttempts] = useState({
        q: null as string | null,
        a: null as string | null,
        b: null as string | null,
        c: null as string | null,
    });

    const [explanations, setExplanations] = useState<Record<number, string>>({});
    const [isFetchingExplanation, setIsFetchingExplanation] = useState(false);
    
    const audioRef = useRef<HTMLAudioElement>(null);
    const quizViewRef = useRef<HTMLDivElement>(null);

    const currentQuestion = questions[currentQuestionIndex];
    const audioBaseUrl = `https://data.toeicets.com/2024/test${testNumber}/audio/`;
    
    const resetCurrentQuestionState = () => {
        setSelectedAnswer(null);
        setIsAnswerChecked(false);
        setDictationInputs({ q: '', a: '', b: '', c: '' });
        setDictationStatuses({ q: 'unanswered', a: 'unanswered', b: 'unanswered', c: 'unanswered' });
        setUserDictationAttempts({ q: null, a: null, b: null, c: null });
    };

    const fetchData = useCallback(async (url: string) => {
        setIsLoading(true);
        setError(null);
        setShowUrlInput(false);

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to fetch data (HTTP ${response.status}). Please check the URL and your network connection.`);
            }
            const csvText = await response.text();
            const rows = csvText.trim().split('\n');
            rows.shift(); // Remove header

            const parsedQuestions: ToeicQuestion[] = rows.map(row => {
                const values = row.split(';');
                return {
                    questionNumber: parseInt(values[0], 10),
                    audio: values[1],
                    question: values[2],
                    options: { A: values[3], B: values[4], C: values[5] },
                    answer: values[6] as 'A' | 'B' | 'C',
                };
            }).filter(q => q.questionNumber && q.audio); // Filter out invalid rows
            
            if (parsedQuestions.length === 0) {
                 throw new Error(`The data file seems to be empty or in an incorrect format.`);
            }

            setQuestions(parsedQuestions);
        } catch (err: any) {
            setError(err.message);
            setCustomUrl(url);
            setShowUrlInput(true);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const defaultUrl = `https://data.toeicets.com/2024/test${testNumber}/test${testNumber}-part${partNumber}.csv`;
        fetchData(defaultUrl);
    }, [partNumber, testNumber, fetchData]);

    useEffect(() => {
        if (currentQuestion?.audio && audioRef.current) {
            audioRef.current.src = audioBaseUrl + currentQuestion.audio;
            audioRef.current.play().catch(e => console.error("Audio playback failed", e));
        }
    }, [currentQuestion, audioBaseUrl]);

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            resetCurrentQuestionState();
            quizViewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            onFinish();
        }
    };
    
    const handleCheckAnswer = () => {
        if (selectedAnswer) {
            setIsAnswerChecked(true);
        }
    };

    const handleDictationCheck = (part: 'q' | 'a' | 'b' | 'c') => {
        const correctAnswers = {
            q: currentQuestion.question,
            a: currentQuestion.options.A,
            b: currentQuestion.options.B,
            c: currentQuestion.options.C,
        };
        const isCorrect = dictationInputs[part].trim().toLowerCase() === correctAnswers[part].trim().toLowerCase();
        setDictationStatuses(prev => ({ ...prev, [part]: isCorrect ? 'correct' : 'incorrect' }));
    };

    const handleShowDictationAnswer = (part: 'q' | 'a' | 'b' | 'c') => {
        if (dictationStatuses[part] !== 'correct') {
            setUserDictationAttempts(prev => ({ ...prev, [part]: dictationInputs[part] }));
        }
        
        const correctAnswers = {
            q: currentQuestion.question,
            a: currentQuestion.options.A,
            b: currentQuestion.options.B,
            c: currentQuestion.options.C,
        };
        setDictationInputs(prev => ({ ...prev, [part]: correctAnswers[part] }));
        setDictationStatuses(prev => ({ ...prev, [part]: 'correct' }));
    };

    const handleFetchExplanation = async () => {
        if (!apiKey) {
            setExplanations(prev => ({ ...prev, [currentQuestionIndex]: "API Key not found. Please add your Gemini API key in the settings (bottom left corner)." }));
            return;
        }
        if (!currentQuestion) {
          return;
        }

        setIsFetchingExplanation(true);
        try {
          const ai = new GoogleGenAI({ apiKey });
          const prompt = `You are an expert English teacher specializing in TOEIC listening. Explain in VIETNAMESE why the answer is correct for the following question.
            Question transcript: "${currentQuestion.question}"
            Correct Answer (${currentQuestion.answer}): "${currentQuestion.options[currentQuestion.answer]}"
            Provide a clear translation, analysis of why the answer is the best response, and explain key vocabulary.`;

          const response = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: prompt });
          setExplanations(prev => ({ ...prev, [currentQuestionIndex]: response.text }));
        } catch (err) {
          console.error("Error fetching explanation:", err);
          setExplanations(prev => ({ ...prev, [currentQuestionIndex]: "Could not load explanation. Please check your API key and network connection." }));
        } finally {
          setIsFetchingExplanation(false);
        }
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-64"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
    }

    if (error) {
        return (
            <div className="max-w-3xl mx-auto">
                <div className="bg-red-50 border border-red-200 text-red-800 p-6 rounded-lg">
                    <h3 className="text-xl font-bold mb-2">Error Loading Test Data</h3>
                    <p className="mb-4">{error}</p>
                    {showUrlInput && (
                        <div className="space-y-4">
                            <label htmlFor="data-url" className="block font-semibold">Data File URL</label>
                            <input
                                id="data-url"
                                type="text"
                                value={customUrl}
                                onChange={(e) => setCustomUrl(e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-red-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                            />
                            <button
                                onClick={() => fetchData(customUrl)}
                                className="px-4 py-2 bg-primary text-onPrimary font-semibold rounded-lg hover:bg-primary-dark"
                            >
                                Retry
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }
    
    if (!currentQuestion) {
        return <div className="text-center p-8">No questions found for this test.</div>;
    }

    return (
        <div ref={quizViewRef} className="max-w-3xl mx-auto">
            <div className="bg-surface rounded-xl shadow-sm border border-stroke p-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-onSurface">Question {currentQuestion.questionNumber}</h2>
                </div>

                <div className="space-y-8">
                    {/* Top: Multiple Choice */}
                    <div>
                        <h3 className="text-lg font-semibold text-onSurface mb-4">1. Choose the best response.</h3>
                        <div className="space-y-3">
                            {(['A', 'B', 'C'] as const).map(option => {
                                let status: 'unanswered' | 'correct' | 'incorrect' = 'unanswered';
                                if (isAnswerChecked) {
                                    if (option === currentQuestion.answer) status = 'correct';
                                    else if (option === selectedAnswer) status = 'incorrect';
                                }
                                const baseClasses = "w-full text-left p-3 rounded-lg border text-base transition-all duration-200 flex items-center";
                                const statusClasses = {
                                    unanswered: "bg-background border-stroke hover:bg-primary/10 hover:border-primary",
                                    correct: "bg-green-100 border-green-500 text-green-800 font-semibold",
                                    incorrect: "bg-red-100 border-red-500 text-red-800 font-semibold"
                                };
                                return (
                                    <button key={option} onClick={() => setSelectedAnswer(option)} disabled={isAnswerChecked} className={`${baseClasses} ${status === 'unanswered' && selectedAnswer === option ? 'bg-primary/10 border-primary' : statusClasses[status]}`}>
                                        <span className="font-bold mr-3">{option}.</span>
                                        {isAnswerChecked && status === 'correct' && <CheckCircleIcon className="w-5 h-5 mr-2"/>}
                                        {isAnswerChecked && status === 'incorrect' && <XCircleIcon className="w-5 h-5 mr-2"/>}
                                        Listen to response
                                    </button>
                                );
                            })}
                        </div>
                        <button onClick={handleCheckAnswer} disabled={!selectedAnswer || isAnswerChecked} className="mt-4 w-full bg-primary text-onPrimary px-6 py-2 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            Check
                        </button>
                         <audio controls ref={audioRef} className="w-full mt-4" />
                    </div>
                    
                    {/* Bottom: Dictation */}
                    <div>
                         <h3 className="text-lg font-semibold text-onSurface mb-4">2. Listen and write.</h3>
                         <div className="space-y-3 bg-background p-4 rounded-lg border border-stroke">
                            <DictationInput label="Question" value={dictationInputs.q} correctAnswer={currentQuestion.question} status={dictationStatuses.q} onChange={v => setDictationInputs(p => ({...p, q:v}))} onEnter={() => handleDictationCheck('q')} onShowAnswer={() => handleShowDictationAnswer('q')} userAttempt={userDictationAttempts.q} />
                            <DictationInput label="Response A" value={dictationInputs.a} correctAnswer={currentQuestion.options.A} status={dictationStatuses.a} onChange={v => setDictationInputs(p => ({...p, a:v}))} onEnter={() => handleDictationCheck('a')} onShowAnswer={() => handleShowDictationAnswer('a')} userAttempt={userDictationAttempts.a} />
                            <DictationInput label="Response B" value={dictationInputs.b} correctAnswer={currentQuestion.options.B} status={dictationStatuses.b} onChange={v => setDictationInputs(p => ({...p, b:v}))} onEnter={() => handleDictationCheck('b')} onShowAnswer={() => handleShowDictationAnswer('b')} userAttempt={userDictationAttempts.b} />
                            <DictationInput label="Response C" value={dictationInputs.c} correctAnswer={currentQuestion.options.C} status={dictationStatuses.c} onChange={v => setDictationInputs(p => ({...p, c:v}))} onEnter={() => handleDictationCheck('c')} onShowAnswer={() => handleShowDictationAnswer('c')} userAttempt={userDictationAttempts.c} />
                         </div>
                    </div>
                </div>

                {/* Explanation Section */}
                {isAnswerChecked && (
                    <div className="mt-6 border-t border-stroke pt-6">
                        {explanations[currentQuestionIndex] ? (
                            <div className="bg-background p-4 rounded-lg border border-stroke">
                                <h4 className="text-lg font-semibold text-onSurface mb-2">Explanation</h4>
                                <pre className="text-onSurfaceSecondary whitespace-pre-wrap font-sans text-base">{explanations[currentQuestionIndex]}</pre>
                            </div>
                        ) : (
                            <button onClick={handleFetchExplanation} disabled={isFetchingExplanation} className="flex items-center bg-secondary text-onPrimary px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-50">
                                <SparklesIcon className="w-4 h-4 mr-2"/>
                                {isFetchingExplanation ? 'Loading...' : 'View Explanation with AI'}
                            </button>
                        )}
                    </div>
                )}

                {/* Bottom Controls */}
                <div className="mt-8 flex justify-end">
                    {isAnswerChecked && (
                        <button onClick={handleNextQuestion} className="flex items-center bg-primary text-onPrimary px-6 py-2 rounded-lg font-semibold hover:bg-primary-dark transition-colors">
                            Continue <ForwardIcon className="w-5 h-5 ml-2" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ToeicQuizView;