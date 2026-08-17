import React, { useState, useEffect, useRef } from 'react';
import Icon from '../../../components/AppIcon';

const HowItWorksSection = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef?.current) {
      observer?.observe(sectionRef?.current);
    }

    return () => observer?.disconnect();
  }, []);

  const steps = [
    {
      number: '01',
      icon: 'FileText',
      title: 'Input Your Data',
      description: 'Share your academic records, coding profiles, and career preferences through our smart form',
      details: [
        'Upload semester marksheets or enter CGPA',
        'Connect GitHub, LeetCode, HackerRank profiles',
        'Complete quick psychometric assessment',
        'Specify career interests and target companies'
      ],
      time: '5 minutes'
    },
    {
      number: '02',
      icon: 'Brain',
      title: 'AI Analysis',
      description: 'Our advanced AI engine processes your data to identify strengths, gaps, and opportunities',
      details: [
        'Academic performance pattern recognition',
        'Coding skill level assessment',
        'Personality-career fit analysis',
        'Market demand comparison'
      ],
      time: '30 seconds'
    },
    {
      number: '03',
      icon: 'Map',
      title: 'Roadmap Generation',
      description: 'Receive a personalized, step-by-step career roadmap tailored to your unique profile',
      details: [
        'Customized learning paths for skill development',
        'Project recommendations with difficulty levels',
        'Internship targets with application strategies',
        'Timeline with achievable milestones'
      ],
      time: '15 seconds'
    },
    {
      number: '04',
      icon: 'TrendingUp',
      title: 'Track Progress',
      description: 'Monitor your growth with real-time updates and adaptive recommendations as you advance',
      details: [
        'Skill progress visualization',
        'Completed vs pending tasks tracking',
        'Achievement badges and milestones',
        'Dynamic roadmap adjustments'
      ],
      time: 'Ongoing'
    }
  ];

  return (
    <section ref={sectionRef} id="how-it-works" className="py-20 px-4 bg-[#F9F8F6] dark:bg-[#1C1B1A]">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl sm:text-5xl font-bold text-[#141414] dark:text-white tracking-tight">
            How <span className="text-[#FF5722]">NextStepAI</span> Works
          </h2>
          <p className="text-lg text-[#555555] dark:text-[#A1A1A1] max-w-2xl mx-auto leading-relaxed">
            From data input to career success in four simple steps
          </p>
        </div>

        <div className="relative">
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-[#FF5722] via-[#FF5722]/60 to-[#FF5722]/20 -translate-x-1/2 rounded-full" />

          <div className="space-y-12">
            {steps?.map((step, index) => (
              <div 
                key={index}
                className={`relative ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}
                style={{ animationDelay: `${index * 200}ms` }}
                onMouseEnter={() => setActiveStep(index)}
              >
                <div className={`flex flex-col md:flex-row gap-6 items-center ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}>
                  <div className="flex-1 w-full">
                    <div className={`bg-[#EFE9E3] dark:bg-[#262422] rounded-3xl p-6 sm:p-8 border-2 transition-all duration-300 ${
                      activeStep === index 
                        ? 'border-[#FF5722] shadow-xl scale-[1.01]' 
                        : 'border-[#D9CFC7] dark:border-[rgba(217,207,199,0.15)] hover:border-[#FF5722]/50'
                    }`}>
                      <div className="flex items-start gap-4 mb-4">
                        <div className="p-3 rounded-2xl bg-[#FF5722]/15 text-[#FF5722] border border-[#FF5722]/20">
                          <Icon name={step?.icon} size={24} className="text-[#FF5722]" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-3xl font-extrabold text-[#FF5722]">
                              {step?.number}
                            </span>
                            <h3 className="text-xl font-bold text-[#141414] dark:text-white">
                              {step?.title}
                            </h3>
                          </div>
                          <p className="text-xs sm:text-sm text-[#555555] dark:text-[#A1A1A1] mb-4 leading-relaxed">
                            {step?.description}
                          </p>
                        </div>
                      </div>

                      {activeStep === index && (
                        <div className="mt-4 pt-4 border-t border-[#D9CFC7]/40 space-y-2 animate-fade-in">
                          {step?.details?.map((detail, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <Icon name="Check" size={16} className="text-[#FF5722] stroke-[3] mt-0.5 flex-shrink-0" />
                              <span className="text-xs sm:text-sm text-[#141414] dark:text-white font-medium">{detail}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="mt-4 flex items-center gap-2">
                        <Icon name="Clock" size={16} className="text-[#FF5722]" />
                        <span className="text-xs text-[#555555] dark:text-[#A1A1A1] font-bold">
                          {step?.time}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-[#EFE9E3] dark:bg-[#262422] border-2 border-[#FF5722] shadow-md z-10">
                    <div className="w-5 h-5 rounded-full bg-[#FF5722]" />
                  </div>

                  <div className="flex-1 w-full md:block hidden" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;