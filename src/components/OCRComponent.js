import React, { useState } from 'react';
import Tesseract from 'tesseract.js';

const OCRComponent = () => {
  const [ocrResult, setOcrResult] = useState('');

  const handleOCR = async (event) => {
    try {
      const { data: { text } } = await Tesseract.recognize(
        event.target.files[0],
        'eng',
        { 
          logger: m => console.log(m), // Optional logger
          // Additional options for improving OCR accuracy
          tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-!?' // Whitelist characters
        }
      );
      setOcrResult(text);
    } catch (error) {
      console.error('Error during OCR:', error);
    }
  };

  return (
    <div className="ocr-container">
      <h1>Please choose Image File Only</h1>
      <input type="file" accept="image/*" onChange={handleOCR} className="ocr-input" />
      {ocrResult && <div className="ocr-result">OCR Result: {ocrResult}</div>}
    </div>
  );
};

export default OCRComponent;
