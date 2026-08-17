import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import Button from './Button';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  const navigationItems = [
    { label: 'How It Works', anchor: '#how-it-works', offset: 80 },
    { label: 'Features', anchor: '#features', offset: 80 },
    { label: 'Success Stories', anchor: '#success-stories', offset: 80 },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 20);

      const sections = navigationItems?.filter(item => !item?.isPrimary)?.map(item => ({
        id: item?.anchor?.substring(1),
        offset: item?.offset
      }));

      let currentSection = '';
      sections?.forEach(section => {
        const element = document.getElementById(section?.id);
        if (element) {
          const rect = element?.getBoundingClientRect();
          if (rect?.top <= 150 && rect?.bottom >= 150) {
            currentSection = section?.id;
          }
        }
      });

      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, anchor, offset) => {
    e?.preventDefault();
    const targetId = anchor?.substring(1);
    const element = document.getElementById(targetId);

    if (element) {
      const elementPosition = element?.getBoundingClientRect()?.top + window.pageYOffset;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      setIsMobileMenuOpen(false);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (!isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  };

  useEffect(() => {
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <>
      <header
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-32px)] max-w-5xl transition-all duration-500 ${
          isScrolled
            ? 'nav-floating'
            : 'bg-[#EFE9E3]/90 backdrop-blur-md border border-[#D9CFC7] rounded-full shadow-soft'
        }`}
      >
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <a
                href="/"
                className="flex items-center gap-2.5 group"
                aria-label="NextStepAI Home"
              >
                <img
                  src="/logo.jpeg"
                  alt="NextStepAI Logo"
                  className="w-9 h-9 rounded-xl object-cover transition-transform duration-200 group-hover:scale-105"
                />
                <span className="text-lg font-bold text-[#000000] dark:text-white tracking-tight">
                  NextStep<span className="text-[#C9B59C]">AI</span>
                </span>
              </a>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navigationItems?.map((item) => {
                const isActive = activeSection === item?.anchor?.substring(1);

                return (
                  <a
                    key={item?.label}
                    href={item?.anchor}
                    onClick={(e) => handleNavClick(e, item?.anchor, item?.offset)}
                    className={`px-4 py-2 text-sm font-medium transition-all duration-200 rounded-full ${isActive
                      ? 'text-[#000000] bg-[#C9B59C] dark:text-white dark:bg-[#33302D]'
                      : 'text-[#000000]/70 hover:text-[#000000] hover:bg-[#D9CFC7]/50 dark:text-[#A1A1A1] dark:hover:text-white'
                      }`}
                  >
                    {item?.label}
                  </a>
                );
              })}
            </nav>

            {/* Right Actions */}
            <div className="hidden lg:flex items-center gap-3">
              <SignedOut>
                <Link
                  to="/auth/login"
                  className="px-4 py-2 text-sm font-medium text-[#000000] hover:text-[#333333] transition-colors rounded-full"
                >
                  Log in
                </Link>
                <Link to="/auth/register">
                  <Button size="sm">
                    Get Started
                  </Button>
                </Link>
              </SignedOut>
              <SignedIn>
                <Link to="/profile">
                  <Button size="sm">
                    Dashboard
                  </Button>
                </Link>
              </SignedIn>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 rounded-xl text-[#000000] hover:bg-[#D9CFC7] transition-colors duration-200"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
            >
              <Icon
                name={isMobileMenuOpen ? 'X' : 'Menu'}
                size={22}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-[#000000]/30 backdrop-blur-sm z-[150] lg:hidden"
            onClick={toggleMobileMenu}
            aria-hidden="true"
          />

          <nav
            className="fixed top-24 left-4 right-4 bg-[#EFE9E3] dark:bg-[#262422] z-[200] lg:hidden rounded-2xl border border-[#D9CFC7] dark:border-[rgba(217,207,199,0.15)] shadow-lift overflow-hidden"
            role="navigation"
            aria-label="Mobile navigation"
          >
            <div className="p-4">
              <div className="flex flex-col space-y-1">
                {navigationItems?.map((item) => {
                  const isActive = activeSection === item?.anchor?.substring(1);

                  return (
                    <a
                      key={item?.label}
                      href={item?.anchor}
                      onClick={(e) => handleNavClick(e, item?.anchor, item?.offset)}
                      className={`px-4 py-3 text-base font-medium rounded-xl transition-colors duration-200 ${isActive
                        ? 'text-[#000000] bg-[#C9B59C] dark:text-white dark:bg-[#33302D]'
                        : 'text-[#000000]/70 hover:bg-[#D9CFC7] dark:text-[#A1A1A1] dark:hover:bg-[#33302D]'
                        }`}
                    >
                      {item?.label}
                    </a>
                  );
                })}
              </div>

              <div className="mt-4 pt-4 border-t border-[#D9CFC7] dark:border-[rgba(217,207,199,0.15)] space-y-2">
                <SignedOut>
                  <Link
                    to="/auth/login"
                    onClick={toggleMobileMenu}
                    className="block px-4 py-3 text-base font-medium text-[#000000] hover:text-[#333333] rounded-xl transition-colors"
                  >
                    Log in
                  </Link>
                  <Link to="/auth/register" onClick={toggleMobileMenu}>
                    <Button fullWidth size="lg">
                      Get Started
                    </Button>
                  </Link>
                </SignedOut>
                <SignedIn>
                  <Link to="/profile" onClick={toggleMobileMenu}>
                    <Button fullWidth size="lg">
                      Dashboard
                    </Button>
                  </Link>
                </SignedIn>
              </div>
            </div>
          </nav>
        </>
      )}
    </>
  );
};

export default Header;