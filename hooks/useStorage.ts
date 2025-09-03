import { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';
import { useAuth } from './useAuth';

export const useStorage = () => {
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const uploadFile = (file: File, path: string) => {
    setIsLoading(true);
    setError(null);
    setProgress(0);

    // Adiciona o UID do usuário e um timestamp para garantir nomes de arquivo únicos
    const filePath = `${path}/${user?.uid || 'public'}/${new Date().getTime()}_${file.name}`;
    const storageRef = ref(storage, filePath);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise<string>((resolve, reject) => {
        uploadTask.on(
            'state_changed',
            (snapshot) => {
            const prog = Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setProgress(prog);
            },
            (err) => {
            console.error(err);
            setError(err);
            setIsLoading(false);
            reject(err);
            },
            () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                setIsLoading(false);
                resolve(downloadURL);
            }).catch(err => {
                setError(err);
                setIsLoading(false);
                reject(err);
            });
            }
        );
    });
  };

  return { progress, error, isLoading, uploadFile };
};