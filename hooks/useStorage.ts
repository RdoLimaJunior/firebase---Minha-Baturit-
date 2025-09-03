import { useState } from 'react';

export const useStorage = () => {
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const uploadFile = (file: File, path: string): Promise<string> => {
    setIsLoading(true);
    setError(null);
    setProgress(0);

    // This is a simulation. It will not actually upload the file.
    // It returns a local object URL that can be used for previews.
    // This URL is temporary and will be invalid after the page is closed.
    console.log(`Simulating upload for file: ${file.name} to path: ${path}`);

    return new Promise((resolve) => {
      // Simulate a quick upload process
      setTimeout(() => setProgress(50), 200);
      setTimeout(() => {
        setProgress(100);
        setIsLoading(false);
        resolve(URL.createObjectURL(file));
      }, 500);
    });
  };

  return { progress, error, isLoading, uploadFile };
};