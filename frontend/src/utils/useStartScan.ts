import {  useState } from "react";

export default function useStartScan() {
  const [data, setData] = useState('');
  const [isDone, setIsDone] = useState(false);
  const [err, setError] = useState(null as any);

  const start = async () => {
    setIsDone(false);
    setData('');

    try {
      const response = await fetch('/api/start');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!response.body) {
        throw new Error('Response body is not available');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        setData(chunk); // Append chunks progressively
      }

    } catch (err) {
      setError(err);
    } finally {
      setIsDone(true);
    }
  };

  return {
    data,
    isDone,
    start,
    err,
  };
}