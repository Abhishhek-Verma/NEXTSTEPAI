import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg dark:bg-[#111111] p-6">
      <div className="text-center max-w-md bg-white dark:bg-[#1F2023] rounded-3xl border border-[#E8E5DF] dark:border-[rgba(255,255,255,0.08)] shadow-card p-8 lg:p-12">
        <div className="flex justify-center mb-4">
          <h1 className="heading-serif text-8xl font-normal text-[#111111] dark:text-white opacity-90">
            404
          </h1>
        </div>

        <h2 className="heading-serif text-2xl font-normal text-[#111111] dark:text-white mb-2">Page Not Found</h2>
        <p className="text-[#6B6B6B] dark:text-[#A1A1A1] text-sm mb-8">
          The page you're looking for doesn't exist or has moved. Let's get you back on track!
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="outline"
            onClick={() => window.history?.back()}
          >
            ← Go Back
          </Button>

          <Button
            onClick={() => navigate('/')}
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
