import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';

import Header from '../../components/ui/Header';
import HeroSection from './components/HeroSection';
import DashboardMockup from './components/DashboardMockup';
import ProblemSection from './components/ProblemSection';
import SolutionSection from './components/SolutionSection';
import HowItWorksSection from './components/HowItWorksSection';
import TestimonialsSection from './components/TestimonialsSection';
import FeaturesGrid from './components/FeaturesGrid';
import BenefitsChecklist from './components/BenefitsChecklist';
import Footer from './components/Footer';
import RoadmapForm from './components/RoadmapForm';
import SampleRoadmapModal from './components/SampleRoadmapModal';
import Button from '../../components/ui/Button';

const LandingPage = () => {
  const navigate = useNavigate();
  const { isSignedIn, isLoaded } = useAuth();
  const [showRoadmapForm, setShowRoadmapForm] = useState(false);
  const [showSampleModal, setShowSampleModal] = useState(false);
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [hasSeenExitIntent, setHasSeenExitIntent] = useState(false);

  // Redirect to onboarding if user is already signed in
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      navigate('/onboarding', { replace: true });
    }
  }, [isLoaded, isSignedIn, navigate]);

  useEffect(() => {
    // Check if user has already seen exit intent in this session
    const seenExitIntent = sessionStorage.getItem('seenExitIntent');
    if (seenExitIntent) {
      setHasSeenExitIntent(true);
    }

    const handleMouseLeave = (e) => {
      if (e?.clientY <= 0 && !showRoadmapForm && !showSampleModal && !hasSeenExitIntent) {
        setShowExitIntent(true);
        setHasSeenExitIntent(true);
        sessionStorage.setItem('seenExitIntent', 'true');
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [showRoadmapForm, showSampleModal, hasSeenExitIntent]);

  // Show loading spinner while checking auth
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg dark:bg-bg-dark">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#E8E5DF] border-t-[#111111]"></div>
      </div>
    );
  }

  // Don't render landing page if user is signed in (will redirect)
  if (isSignedIn) {
    return null;
  }

  const handleGenerateRoadmap = () => {
    setShowRoadmapForm(true);
    setShowSampleModal(false);
    setShowExitIntent(false);
  };

  const handleViewSample = () => {
    setShowSampleModal(true);
  };

  const handleFormSubmit = (formData) => {
    setShowRoadmapForm(false);
    alert('Roadmap generation started! Check your email for the complete analysis.');
  };

  const handleCloseExitIntent = () => {
    setShowExitIntent(false);
  };

  return (
    <div className="min-h-screen bg-bg dark:bg-bg-dark">
      <Header />

      <main>
        <HeroSection
          onGenerateRoadmap={handleGenerateRoadmap}
          onViewSample={handleViewSample}
        />

        <DashboardMockup />

        <ProblemSection />

        <SolutionSection />

        <HowItWorksSection />

        <TestimonialsSection />

        <FeaturesGrid />

        <BenefitsChecklist onGenerateRoadmap={handleGenerateRoadmap} />
      </main>

      <Footer />

      {showRoadmapForm && (
        <RoadmapForm
          onSubmit={handleFormSubmit}
          onClose={() => setShowRoadmapForm(false)}
        />
      )}

      {showSampleModal && (
        <SampleRoadmapModal
          onClose={() => setShowSampleModal(false)}
          onGenerateOwn={handleGenerateRoadmap}
        />
      )}

      {showExitIntent && !showRoadmapForm && !showSampleModal && (
        <div className="fixed inset-0 bg-[#111111]/40 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1F2023] rounded-3xl shadow-lift border border-[#E8E5DF] dark:border-[rgba(255,255,255,0.08)] max-w-md w-full p-8 text-center">
            <div className="w-14 h-14 bg-pastel-yellow rounded-2xl flex items-center justify-center mx-auto mb-5">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="heading-serif text-display text-[#111111] dark:text-white mb-3">
              Wait! Don't Miss Out
            </h3>
            <p className="text-[#6B6B6B] dark:text-[#A1A1A1] mb-8 text-body leading-relaxed">
              Join 1,200+ B.Tech students who transformed their careers with AI-powered guidance. Get early access with exclusive benefits!
            </p>
            <div className="space-y-3">
              <Link to="/auth/register" className="block">
                <Button fullWidth size="lg">
                  Get Started
                </Button>
              </Link>
              <button
                onClick={handleCloseExitIntent}
                className="w-full px-6 py-3 text-[#909090] hover:text-[#111111] dark:hover:text-white transition-colors text-sm font-medium"
              >
                Maybe later
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;