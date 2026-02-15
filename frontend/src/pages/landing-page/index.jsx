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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
    <div className="min-h-screen bg-background">
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
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl shadow-2xl border border-border max-w-md w-full p-8 text-center">
            <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🎯</span>
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">
              Wait! Don't Miss Out
            </h3>
            <p className="text-muted-foreground mb-6">
              Join 1,200+ B.Tech students who transformed their careers with AI-powered guidance. Get early access with exclusive benefits!
            </p>
            <div className="space-y-3">
              <Link to="/auth/register" className="block">
                <button className="w-full px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors">
                  Get Started
                </button>
              </Link>
              <button
                onClick={handleCloseExitIntent}
                className="w-full px-6 py-3 text-muted-foreground hover:text-foreground transition-colors"
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