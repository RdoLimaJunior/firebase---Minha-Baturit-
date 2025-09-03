import React, { useState, useEffect, useRef } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  isLoading: boolean;
  onLoad: () => void;
}

const LazyImage: React.FC<LazyImageProps> = ({ src, alt, className, isLoading, onLoad }) => {
  const [isInView, setIsInView] = useState(false);
  const placeholderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        // Carrega a imagem um pouco antes de entrar na tela
        rootMargin: '100px 0px',
      }
    );

    const currentRef = placeholderRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const handleLoad = () => {
    onLoad();
  };

  return (
    <div ref={placeholderRef} className={`relative overflow-hidden ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-200 dark:bg-slate-700">
          <div className="w-8 h-8 border-2 border-slate-400 dark:border-slate-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      {isInView && (
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={handleLoad}
          // Fallback nativo para navegadores com suporte
          loading="lazy"
        />
      )}
    </div>
  );
};

export default LazyImage;