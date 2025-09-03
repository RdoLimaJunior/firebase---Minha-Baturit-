import { useState, useEffect } from 'react';
import { db } from '../firebase';
import {
  collection,
  onSnapshot,
  doc,
  addDoc,
  updateDoc,
  serverTimestamp,
  Query,
  query,
  DocumentData,
  Timestamp,
} from 'firebase/firestore';

// Função auxiliar para converter Timestamps do Firestore em strings ISO
const convertTimestamps = (data: DocumentData): DocumentData => {
  const newData: { [key: string]: any } = {};
  for (const key in data) {
    if (data[key] instanceof Timestamp) {
      newData[key] = data[key].toDate().toISOString();
    } else if (data[key] && typeof data[key] === 'object' && !Array.isArray(data[key])) {
      newData[key] = convertTimestamps(data[key]);
    } else if (Array.isArray(data[key])) {
      newData[key] = data[key].map(item =>
        item && typeof item === 'object' ? convertTimestamps(item) : item
      );
    } else {
      newData[key] = data[key];
    }
  }
  return newData;
};


// Hook para buscar uma coleção
// Nota: Para performance otimizada, o objeto 'q' (Query) passado para este hook
// deve ser memoizado com `useMemo` no componente que o chama, para evitar
// re-chamadas desnecessárias ao banco de dados em cada renderização.
export const useCollection = <T extends { id: string }>(collectionPath: string, q?: Query | null) => {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (q === null) {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const ref = q || collection(db, collectionPath);
    
    const unsubscribe = onSnapshot(ref, (snapshot) => {
      const results: T[] = [];
      snapshot.forEach((doc) => {
        const docData = convertTimestamps(doc.data());
        results.push({ id: doc.id, ...docData } as T);
      });
      setData(results);
      setLoading(false);
      setError(null);
    }, (err) => {
      console.error(`Error fetching collection ${collectionPath}:`, err);
      setError(err);
      setLoading(false);
    });

    return () => unsubscribe();
  // A dependência de 'q' é complexa; confiar na igualdade de referência e memoização do chamador é a abordagem padrão.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionPath, q]);

  return { data, loading, error };
};

// Hook para buscar um único documento
export const useDocument = <T extends { id: string }>(docPath: string | null) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!docPath) {
        setData(null);
        setLoading(false);
        return;
    }
    setLoading(true);
    const ref = doc(db, docPath);

    const unsubscribe = onSnapshot(ref, (doc) => {
      if (doc.exists()) {
        const docData = convertTimestamps(doc.data());
        setData({ id: doc.id, ...docData } as T);
      } else {
        setData(null);
        // Considerar isso um erro ou um estado "não encontrado" pode ser uma melhoria futura.
      }
      setLoading(false);
      setError(null);
    }, (err) => {
      console.error(`Error fetching document ${docPath}:`, err);
      setError(err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [docPath]);

  return { data, loading, error };
};

// Função para adicionar um documento
export const addDocument = async (collectionPath: string, data: DocumentData) => {
  try {
    const ref = collection(db, collectionPath);
    const docRef = await addDoc(ref, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef;
  } catch (error) {
    console.error("Erro ao adicionar documento: ", error);
    throw error;
  }
};

// Função para atualizar um documento
export const updateDocument = async (docPath: string, data: DocumentData) => {
  try {
    const ref = doc(db, docPath);
    await updateDoc(ref, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Erro ao atualizar documento: ", error);
    throw error;
  }
};