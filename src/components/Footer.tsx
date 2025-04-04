
import React from 'react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

const FooterLink = ({ href, children, className }: FooterLinkProps) => (
  <Link
    to={href}
    className={cn(
      "text-muted-foreground hover:text-foreground transition-colors duration-200",
      className
    )}
  >
    {children}
  </Link>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-background border-t border-border py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1 lg:col-span-2">
            <Link to="/" className="text-2xl font-bold text-gradient mb-4 inline-block">
              ResidentPro
            </Link>
            <p className="text-muted-foreground max-w-xs mt-3">
              The next-generation HOA and Condo management platform that simplifies community living.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3">Product</h3>
            <ul className="space-y-2">
              <li><FooterLink href="/features">Features</FooterLink></li>
              <li><FooterLink href="/pricing">Pricing</FooterLink></li>
              <li><FooterLink href="/dashboard">Dashboard</FooterLink></li>
              <li><FooterLink href="/testimonials">Testimonials</FooterLink></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3">Company</h3>
            <ul className="space-y-2">
              <li><FooterLink href="/about">About Us</FooterLink></li>
              <li><FooterLink href="/contact">Contact</FooterLink></li>
              <li><FooterLink href="/careers">Careers</FooterLink></li>
              <li><FooterLink href="/blog">Blog</FooterLink></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3">Legal</h3>
            <ul className="space-y-2">
              <li><FooterLink href="/privacy">Privacy Policy</FooterLink></li>
              <li><FooterLink href="/terms">Terms of Service</FooterLink></li>
              <li><FooterLink href="/cookies">Cookie Policy</FooterLink></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            &copy; {currentYear} ResidentPro. All rights reserved.
          </p>
          
          <div className="flex items-center gap-6">
            <FooterLink href="https://twitter.com" className="hover:text-blue-500">
              Twitter
            </FooterLink>
            <FooterLink href="https://linkedin.com" className="hover:text-blue-700">
              LinkedIn
            </FooterLink>
            <FooterLink href="https://facebook.com" className="hover:text-blue-600">
              Facebook
            </FooterLink>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
