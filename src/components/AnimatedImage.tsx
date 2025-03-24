
import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedImageProps {
  src: string;
  alt: string;
  className?: string;
  delay?: number;
  animation?: 'fade-up' | 'fade-in' | 'scale-in';
}

const AnimatedImage = ({
  src,
  alt,
  className,
  delay = 0,
  animation = 'fade-up',
}: AnimatedImageProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
          if (imgRef.current) observer.unobserve(imgRef.current);
        }
      },
      {
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) observer.unobserve(imgRef.current);
    };
  }, [delay]);

  const getAnimationClass = () => {
    if (!isVisible) {
      switch (animation) {
        case 'fade-up':
          return 'opacity-0 translate-y-8';
        case 'fade-in':
          return 'opacity-0';
        case 'scale-in':
          return 'opacity-0 scale-95';
        default:
          return 'opacity-0';
      }
    }
    return 'opacity-100 translate-y-0 scale-100';
  };

  return (
    <div ref={imgRef} className={cn('overflow-hidden', className)}>
      <div
        className={cn(
          'relative transition-all duration-1000 ease-out',
          getAnimationClass(),
        )}
      >
        {!isLoaded && (
          <div className="absolute inset-0 bg-slate-200 animate-pulse rounded-lg" />
        )}
        <img
          src={src}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          className={cn('w-full h-auto rounded-lg', !isLoaded && 'invisible')}
        />
      </div>
    </div>
  );
};

export default AnimatedImage;
