
import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
}

const TextReveal = ({ text, className, delay = 0 }: TextRevealProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
          if (textRef.current) observer.unobserve(textRef.current);
        }
      },
      {
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1,
      }
    );

    if (textRef.current) {
      observer.observe(textRef.current);
    }

    return () => {
      if (textRef.current) observer.unobserve(textRef.current);
    };
  }, [delay]);

  return (
    <div ref={textRef} className={cn('overflow-hidden', className)}>
      <div
        className={cn(
          'transform transition-transform duration-1000 ease-in-out',
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
        )}
      >
        {text}
      </div>
    </div>
  );
};

export default TextReveal;
