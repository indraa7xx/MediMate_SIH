import React, { useState, useCallback, useEffect } from 'react';
import type { Chat } from '@google/genai';
import { startChat, PRELIMINARY_QUESTIONS, generateSummaryReport } from './services/geminiService';
import type { ChatMessage as ChatMessageType, ChatMode } from './types';
import ChatHistory from './components/ChatHistory';
import MessageInput from './components/MessageInput';
import Header from './components/Header';
import SummaryReport from './components/SummaryReport';

const LOCAL_STORAGE_KEY = 'mediMateChatState';
const WELCOME_MESSAGE = { role: 'model' as const, text: "Welcome! I am your AI Health Assistant. Please remember, I am not a doctor. If this is an emergency, please contact emergency services immediately.\n\nHow can I help you today?" };

const getSystemInstructionForMode = (mode: 'preventive' | 'preliminary'): string => {
    if (mode === 'preventive') {
      return 'You are a friendly and encouraging health and wellness assistant. Provide safe, general, and non-prescriptive advice. Do not give medical diagnoses. Always encourage users to consult a healthcare professional for personal medical advice.';
    }
    // preliminary
    return "You are a compassionate and professional medical assistant AI. Your goal is to understand the user's symptoms and engage in a helpful, clarifying conversation. Never provide a diagnosis. After the initial questions, converse naturally, ask clarifying questions, and be empathetic. Conclude by suggesting they see a doctor and offer to summarize the conversation.";
};

const App: React.FC = () => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [mode, setMode] = useState<ChatMode>('triage');
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [preliminaryAnswers, setPreliminaryAnswers] = useState<string[]>([]);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);

  // Load state from localStorage on initial render
  useEffect(() => {
    try {
      const savedStateJSON = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedStateJSON) {
        const savedState = JSON.parse(savedStateJSON);
        setMessages(savedState.messages || [WELCOME_MESSAGE]);
        const savedMode = savedState.mode || 'triage';
        setMode(savedMode);
        setQuestionNumber(savedState.questionNumber || 0);
        setPreliminaryAnswers(savedState.preliminaryAnswers || []);

        if (savedMode !== 'triage') {
          const instruction = getSystemInstructionForMode(savedMode);
          const newChat = startChat(instruction);
          setChat(newChat);
        }
      } else {
        setMessages([WELCOME_MESSAGE]);
      }
    } catch (e) {
      console.error("Failed to load state from localStorage", e);
      setMessages([WELCOME_MESSAGE]);
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (mode === 'triage' && messages.length <= 1) return;
    try {
      const stateToSave = { messages, mode, questionNumber, preliminaryAnswers };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
    } catch(e) {
      console.error("Failed to save state to localStorage", e);
    }
  }, [messages, mode, questionNumber, preliminaryAnswers]);

  const handleModeSelect = (selectedMode: 'preventive' | 'preliminary') => {
    setMode(selectedMode);
    const systemInstruction = getSystemInstructionForMode(selectedMode);
    let initialMessage = '';

    if (selectedMode === 'preventive') {
      initialMessage = "Great! I can provide tips on staying healthy. What's on your mind? For example, you could ask about healthy eating, exercise, or stress management.";
    } else { // preliminary
      initialMessage = PRELIMINARY_QUESTIONS[0];
    }
    try {
        const newChat = startChat(systemInstruction);
        setChat(newChat);
        setMessages([{ role: 'model', text: initialMessage }]);
    } catch(e) {
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred';
        console.error("Failed to initialize chat:", errorMessage);
        setError(`Failed to initialize. Please check your API key and refresh. Error: ${errorMessage}`);
    }
  };

  const streamResponse = async (prompt: string) => {
    if (!chat) return;
    setIsLoading(true);
    setError(null);
    
    let currentBotMessage = '';
    const botMessageIndex = messages.length + 1;

    setMessages(prev => [...prev, { role: 'model', text: '' }]);

    try {
      const stream = await chat.sendMessageStream({ message: prompt });
      for await (const chunk of stream) {
        currentBotMessage += chunk.text;
        setMessages(prev => {
            const newMessages = [...prev];
            newMessages[botMessageIndex] = { role: 'model', text: currentBotMessage };
            return newMessages;
        });
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred';
      console.error("Error sending message:", errorMessage);
      const errorText = `Sorry, I encountered an error. Please try again. (${errorMessage})`;
      setMessages(prev => {
        const newMessages = [...prev];
        if (newMessages[botMessageIndex]) {
            newMessages[botMessageIndex].text = errorText;
        }
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim() || isLoading || isGeneratingSummary) return;

    const userMessage: ChatMessageType = { role: 'user', text: inputValue };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    const currentInput = inputValue;
    setInputValue('');

    if (mode === 'preliminary' && questionNumber < PRELIMINARY_QUESTIONS.length) {
      const newAnswers = [...preliminaryAnswers, currentInput];
      setPreliminaryAnswers(newAnswers);
      const nextQuestionIndex = questionNumber + 1;
      setQuestionNumber(nextQuestionIndex);

      if (nextQuestionIndex < PRELIMINARY_QUESTIONS.length) {
        setMessages(prev => [...prev, { role: 'model', text: PRELIMINARY_QUESTIONS[nextQuestionIndex] }]);
      } else {
        const contextSummary = newAnswers.map((ans, i) => `Q: ${PRELIMINARY_QUESTIONS[i]}\nA: ${ans}`).join('\n\n');
        const firstPrompt = `The user has answered the initial questions. Now, begin a natural, empathetic conversation based on their answers, which are provided below for your context. Ask clarifying questions if needed. Do not list the questions back to the user; just start the conversation. \n\nCONTEXT:\n${contextSummary}`;
        await streamResponse(firstPrompt);
      }
    } else {
      await streamResponse(currentInput);
    }
  }, [inputValue, isLoading, chat, messages, mode, questionNumber, preliminaryAnswers, isGeneratingSummary]);

  const handleGenerateSummary = useCallback(async () => {
    setIsGeneratingSummary(true);
    setError(null);
    const thinkingMessage: ChatMessageType = { role: 'model', text: "Generating your summary report. This may take a moment..." };
    setMessages(prev => [...prev, thinkingMessage]);

    try {
        const report = await generateSummaryReport(messages);
        setSummary(report);
    } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred';
        console.error("Error generating summary:", errorMessage);
        setError(`Failed to generate summary report. ${errorMessage}`);
    } finally {
        setMessages(prev => prev.filter(m => m !== thinkingMessage));
        setIsGeneratingSummary(false);
    }
  }, [messages]);
  
  const handleNewChat = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setChat(null);
    setMode('triage');
    setMessages([WELCOME_MESSAGE]);
    setInputValue('');
    setIsLoading(false);
    setError(null);
    setQuestionNumber(0);
    setPreliminaryAnswers([]);
    setSummary(null);
  };

  const showSummaryButton = mode === 'preliminary' && questionNumber >= PRELIMINARY_QUESTIONS.length;

  return (
    <div className="flex flex-col h-screen bg-gray-100 text-gray-800 font-sans">
      <Header onNewChat={handleNewChat} />
      {error && (
        <div className="bg-red-500 text-white p-4 text-center">
          {error}
        </div>
      )}

      {summary && <SummaryReport content={summary} onClose={() => setSummary(null)} />}
      
      <div className={`flex-1 flex flex-col transition-opacity duration-500 ${summary ? 'opacity-0' : 'opacity-100'}`}>
        <ChatHistory messages={messages} isLoading={isLoading} mode={mode} onSelectMode={handleModeSelect} />
        {mode !== 'triage' && (
             <MessageInput
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onSend={handleSendMessage}
                isLoading={isLoading || isGeneratingSummary}
                onGenerateSummary={showSummaryButton ? handleGenerateSummary : undefined}
                isGeneratingSummary={isGeneratingSummary}
             />
        )}
      </div>
    </div>
  );
};

export default App;