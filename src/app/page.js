'use client';
import { useState } from 'react';
import styles from '../styles/Home.module.css';
import OCRComponent from '../components/OCRComponent';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

export default function Home() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');

  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const chatSession = model.startChat({ generationConfig, safetySettings, history: [] });
    const response = await chatSession.sendMessage(input);
    const formattedResult = response.response.text().replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
    setResult(formattedResult);
  };

  return (
    <main className={styles.container}>
      <h1 className={styles.heading}>MY AI OCR</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter your message"
          className={styles.input}
        />
        <button type="submit" className={styles.button}>Submit</button>
      </form>
      {result && (
    <div className={styles.resultBox}>
      <h2 className={styles.resultText}>Result:</h2>
      <div className={styles.resultText} dangerouslySetInnerHTML={{ __html: result }} />
    </div>
  )}
      <OCRComponent />
    </main>
  );
}
