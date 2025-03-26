import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import AnimatedImage from './AnimatedImage';

const Hero = () => {
  return (
    <section className="relative pt-24 pb-20 md:pt-36 md:pb-32 overflow-hidden">
      {/* Background elements */}
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary/10 rounded-full filter blur-3xl opacity-70 animate-blob"></div>
      <div className="absolute top-60 -right-40 w-80 h-80 bg-blue-300/20 dark:bg-blue-500/10 rounded-full filter blur-3xl opacity-70 animate-blob" style={{ animationDelay: '4s' }}></div>
      
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 md:gap-8 items-center">
          <div className="flex flex-col gap-6 max-w-xl">
            <div className="inline-flex items-center rounded-full border border-border bg-background/50 backdrop-blur-sm px-3 py-1 text-sm text-muted-foreground animate-fade-in">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
              Community Intelligence Platform
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight animate-slide-in">
              Intelligent <span className="text-gradient">Community</span> Management
            </h1>
            
            <p className="text-lg text-muted-foreground animate-slide-in" style={{ animationDelay: '100ms' }}>
              An all-in-one platform that leverages advanced analytics and AI to empower community engagement, streamline operations, and provide actionable insights.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-2 animate-slide-in" style={{ animationDelay: '200ms' }}>
              <Link to="/login">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started
                </Button>
              </Link>
              <a href="#features">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  See Features
                </Button>
              </a>
            </div>
            
            <div className="mt-4 text-sm text-muted-foreground animate-slide-in" style={{ animationDelay: '300ms' }}>
              Transforming community management with intelligent solutions
            </div>
          </div>
          
          <div className="relative md:h-[540px] flex items-center">
            <AnimatedImage 
              src="/lovable-uploads/4210bfbe-69f1-4ffc-8a52-4bff55f3dd71.png" 
              alt="Community Intelligence Dashboard" 
              className="rounded-xl border shadow-2xl w-full"
              animation="scale-in"
              delay={300}
            />
            
            <div className="absolute -bottom-6 -right-6 md:-bottom-10 md:-right-10 glass-panel p-4 md:p-6 animate-fade-in animate-delay-500 hidden md:block">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-green-500 h-10 w-10 flex items-center justify-center text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">Insights Generated</p>
                  <p className="text-sm text-muted-foreground">AI-powered analytics activated</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
