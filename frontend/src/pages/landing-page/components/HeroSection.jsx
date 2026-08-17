import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../../components/ui/Button';

const HeroSection = () => {
  const vantaRef = useRef(null);
  const vantaEffectRef = useRef(null);

  // Initialize Vanta CLOUDS strictly scoped ONLY to the Hero section container
  useEffect(() => {
    let timer = null;

    const initVantaEffect = () => {
      if (window.VANTA && window.VANTA.CLOUDS && vantaRef.current && !vantaEffectRef.current) {
        try {
          vantaEffectRef.current = window.VANTA.CLOUDS({
            el: vantaRef.current,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00
          });
        } catch (err) {
          console.error('Vanta CLOUDS initialization error:', err);
        }
      }
    };

    if (window.VANTA && window.VANTA.CLOUDS) {
      initVantaEffect();
    } else {
      timer = setInterval(() => {
        if (window.VANTA && window.VANTA.CLOUDS) {
          initVantaEffect();
          if (timer) clearInterval(timer);
        }
      }, 50);
    }

    return () => {
      if (timer) clearInterval(timer);
      if (vantaEffectRef.current) {
        vantaEffectRef.current.destroy();
        vantaEffectRef.current = null;
      }
    };
  }, []);

  return (
    <section className="relative overflow-hidden min-h-[85vh] flex items-center bg-bg dark:bg-bg-dark pt-36 pb-20 sm:pt-44 sm:pb-28">
      {/* Vanta CLOUDS Animation Canvas - Strictly Scoped ONLY to the Hero section */}
      <div
        ref={vantaRef}
        className="absolute inset-0 z-0 pointer-events-none w-full h-full"
      />

      {/* Subtle background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
        {/* Dotted pattern */}
        <div className="absolute inset-0 bg-dots opacity-30" />
        
        {/* Soft gradient blobs */}
        <div className="absolute top-0 right-[10%] w-[500px] h-[500px] bg-pastel-blue/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-[5%] w-[400px] h-[400px] bg-pastel-purple/20 rounded-full blur-[100px]" />
        <div className="absolute top-[30%] left-[30%] w-[300px] h-[300px] bg-pastel-mint/15 rounded-full blur-[80px]" />
        
        {/* Large decorative curve */}
        <svg className="absolute top-0 right-0 w-[60%] h-full opacity-[0.06]" viewBox="0 0 600 800" fill="none">
          <path d="M200 0 Q600 200 400 400 Q200 600 600 800" stroke="#111" strokeWidth="1.5" fill="none"/>
        </svg>
      </div>

      <div className="page-container relative z-10 w-full">
        <div className="text-center max-w-4xl mx-auto">
          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <span className="pill-badge border-[#FF5722]/30">
              <span className="text-xs text-[#FF5722]">✦</span> AI Powered
            </span>
            <span className="pill-badge border-[#FF5722]/30">
              <span className="text-xs text-[#FF5722]">✓</span> Personalized
            </span>
            <span className="pill-badge border-[#FF5722]/30">
              <span className="text-xs text-[#FF5722]">✓</span> Data Driven
            </span>
          </div>

          {/* Main Heading - Editorial Serif */}
          <h1 className="heading-serif text-hero text-[#141414] dark:text-white mb-2 text-balance">
            Your Personalized B.Tech
          </h1>
          <h1 className="heading-serif-italic text-hero text-[#FF5722] mb-8 text-balance">
            Career Roadmap.
          </h1>

          {/* Supporting Description */}
          <p className="text-body-lg text-[#6B6B6B] dark:text-[#A1A1A1] mb-10 max-w-2xl mx-auto leading-relaxed">
            AI-powered career guidance that analyzes your academics, coding skills, and personality to create your perfect tech career path.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth/register">
              <Button size="lg" className="w-full sm:w-auto px-8">
                Get Started Free
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button size="lg" variant="outline" className="w-full sm:w-auto px-8">
                See How It Works
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;