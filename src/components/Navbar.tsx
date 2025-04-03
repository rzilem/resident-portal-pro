
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import { useCompanySettings } from '@/hooks/use-company-settings';
import { infoLog, errorLog } from '@/utils/debug';

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: 'Features', href: '/#features' },
  { label: 'Pricing', href: '/#pricing' },
  { label: 'About', href: '/#about' },
  { label: 'Contact', href: '/#contact' },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme } = useTheme();
  const { settings, isLoading } = useCompanySettings();
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  // Reset image error state if logo URL changes
  useEffect(() => {
    setImgError(false);
  }, [settings.logoUrl]);

  infoLog('Navbar rendering with logo URL:', settings.logoUrl);

  return (
    <nav
      className={cn(
        'fixed top-0 w-full z-50 transition-all duration-300',
        scrolled
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm py-4'
          : 'bg-transparent py-6'
      )}
    >
      <div className="container mx-auto flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center"
        >
          {settings.logoUrl && !imgError ? (
            <img 
              src={settings.logoUrl + `?t=${Date.now()}`} // Add cache busting
              alt={settings.companyName || "Company Logo"} 
              className="h-10 max-w-[180px] object-contain" 
              onError={(e) => {
                errorLog('Logo failed to load in Navbar:', settings.logoUrl);
                setImgError(true);
                e.currentTarget.src = ""; // Clear the src to prevent fallback loop
                e.currentTarget.style.display = "none"; // Hide the image
              }}
            />
          ) : (
            <span className="text-2xl font-bold text-gradient">
              {settings.companyName || "Community Intelligence"}
            </span>
          )}
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex gap-6">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-foreground/80 hover:text-foreground transition-colors duration-200 link-underline"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/login">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          'fixed inset-x-0 top-[72px] bg-white/95 dark:bg-gray-900/95 backdrop-blur-md md:hidden shadow-lg transition-all duration-300 ease-in-out overflow-hidden',
          mobileMenuOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="container mx-auto pt-4 pb-8 flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-foreground/80 hover:text-foreground transition-colors duration-200 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full">Sign In</Button>
            </Link>
            <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full">Get Started</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
