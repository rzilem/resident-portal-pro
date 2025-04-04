
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import AnimatedImage from '@/components/AnimatedImage';
import TextReveal from '@/components/TextReveal';
import { Link } from 'react-router-dom';

const Index = () => {
  // Smooth scroll functionality for anchor links
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      
      if (anchor && anchor.hash && anchor.hash.startsWith('#')) {
        e.preventDefault();
        const element = document.querySelector(anchor.hash);
        if (element) {
          window.scrollTo({
            top: element.getBoundingClientRect().top + window.scrollY - 100,
            behavior: 'smooth'
          });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  return (
    <>
      <Navbar />
      <main className="dark:bg-gray-900">
        <Hero />
        <Features />
        
        {/* AI Features Section */}
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <AnimatedImage 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                  alt="AI-Powered Analytics" 
                  className="rounded-xl shadow-lg"
                  animation="fade-up"
                />
              </div>
              
              <div className="order-1 md:order-2">
                <TextReveal
                  text="AI-Powered Management"
                  className="text-primary font-semibold mb-3"
                />
                <TextReveal
                  text="Transform your community with intelligent automation"
                  className="text-3xl md:text-4xl font-bold mb-6"
                  delay={100}
                />
                <TextReveal
                  text="Our platform leverages artificial intelligence to provide predictive analytics, optimize workflows, and deliver personalized experiences that evolve with your community's needs."
                  className="text-muted-foreground text-lg mb-8"
                  delay={200}
                />
                
                <div className="space-y-4 mb-8">
                  {[
                    "Financial forecasting and budget optimization",
                    "Predictive maintenance scheduling",
                    "Automated compliance monitoring",
                    "Resident sentiment analysis for better decision-making",
                    "Smart notification system based on user preferences"
                  ].map((item, index) => (
                    <div 
                      key={index} 
                      className="flex items-start gap-3 opacity-0 animate-fade-in"
                      style={{ animationDelay: `${300 + index * 100}ms`, animationFillMode: 'forwards' }}
                    >
                      <div className="rounded-full bg-primary/10 text-primary p-1 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      </div>
                      <p>{item}</p>
                    </div>
                  ))}
                </div>
                
                <div 
                  className="opacity-0 animate-fade-in"
                  style={{ animationDelay: '800ms', animationFillMode: 'forwards' }}
                >
                  <Button size="lg" asChild>
                    <Link to="/features">Learn More</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 md:py-32 bg-primary/5 dark:bg-primary/10">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <TextReveal
              text="Ready to transform your community management?"
              className="text-3xl md:text-4xl font-bold mb-6"
            />
            <TextReveal
              text="Join hundreds of HOAs and condominiums that are streamlining operations, improving resident satisfaction, and reducing costs with ResidentPro."
              className="text-muted-foreground text-lg mb-8"
              delay={100}
            />
            <div
              className="opacity-0 animate-fade-in"
              style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
            >
              <Button size="lg" className="mt-4" asChild>
                <Link to="/login">Get Started Today</Link>
              </Button>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
};

export default Index;
