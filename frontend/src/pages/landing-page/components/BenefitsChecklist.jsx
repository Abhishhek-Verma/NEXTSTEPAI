import React from 'react';
import Icon from '../../../components/AppIcon';

const BenefitsChecklist = ({ onGenerateRoadmap }) => {
  const benefits = [
    {
      title: 'Structured Learning Paths',
      description: 'Clear, step-by-step guidance eliminating confusion about what to learn next',
      icon: 'Route',
      metric: '100% clarity',
      iconBg: 'bg-[#EFE9E3] dark:bg-[#262422]',
      iconColor: 'text-[#000000] dark:text-white'
    },
    {
      title: 'Industry-Relevant Projects',
      description: 'Build portfolio projects that directly align with job requirements at target companies',
      icon: 'Briefcase',
      metric: '3x interview calls',
      iconBg: 'bg-[#EFE9E3] dark:bg-[#262422]',
      iconColor: 'text-[#000000] dark:text-white'
    },
    {
      title: 'Targeted Skill Development',
      description: 'Focus on high-impact skills that matter most for your desired career path',
      icon: 'Target',
      metric: '60% faster learning',
      iconBg: 'bg-[#EFE9E3] dark:bg-[#262422]',
      iconColor: 'text-[#000000] dark:text-white'
    },
    {
      title: 'Placement Preparation',
      description: 'Comprehensive interview prep, resume optimization, and application strategies',
      icon: 'Award',
      metric: '94% success rate',
      iconBg: 'bg-[#EFE9E3] dark:bg-[#262422]',
      iconColor: 'text-[#000000] dark:text-white'
    },
    {
      title: 'Time-Saving Automation',
      description: 'AI handles research and planning so you can focus on actual skill building',
      icon: 'Clock',
      metric: '20+ hours saved',
      iconBg: 'bg-[#EFE9E3] dark:bg-[#262422]',
      iconColor: 'text-[#000000] dark:text-white'
    },
    {
      title: 'Confidence Building',
      description: 'Data-driven insights replace uncertainty with actionable confidence',
      icon: 'TrendingUp',
      metric: '85% confidence boost',
      iconBg: 'bg-[#EFE9E3] dark:bg-[#262422]',
      iconColor: 'text-[#000000] dark:text-white'
    },
    {
      title: 'Competitive Advantage',
      description: 'Stand out from peers with personalized strategies and proven methodologies',
      icon: 'Zap',
      metric: '2x placement offers',
      iconBg: 'bg-[#EFE9E3] dark:bg-[#262422]',
      iconColor: 'text-[#000000] dark:text-white'
    },
    {
      title: 'Continuous Adaptation',
      description: 'Roadmap evolves with your progress and changing market demands',
      icon: 'RefreshCw',
      metric: 'Always current',
      iconBg: 'bg-[#EFE9E3] dark:bg-[#262422]',
      iconColor: 'text-[#000000] dark:text-white'
    }
  ];

  return (
    <section className="py-20 px-4 bg-[#F9F8F6] dark:bg-[#1C1B1A]">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl sm:text-5xl font-bold text-[#000000] dark:text-white">
            Transform Your <span className="text-[#C9B59C]">Career Journey</span>
          </h2>
          <p className="text-lg text-[#555555] dark:text-[#A1A1A1] max-w-3xl mx-auto">
            Experience measurable improvements in every aspect of your career preparation with our AI-driven, personalized roadmap.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="group bg-[#EFE9E3] dark:bg-[#262422] rounded-2xl p-6 border border-[#D9CFC7] dark:border-[rgba(217,207,199,0.15)] hover:border-[#C9B59C] hover:shadow-card transition-all duration-300"
            >
              {/* Icon and Check */}
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 ${benefit.iconBg} rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 border border-[#D9CFC7]/50`}>
                  <Icon name={benefit.icon} size={24} className={benefit.iconColor} />
                </div>
                <div className="w-6 h-6 rounded-full bg-[#C9B59C] flex items-center justify-center text-[#000000]">
                  <Icon name="Check" size={14} className="text-[#000000]" />
                </div>
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-[#000000] dark:text-white mb-2 group-hover:text-[#C9B59C] transition-colors">
                {benefit.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-[#555555] dark:text-[#A1A1A1] leading-relaxed mb-4">
                {benefit.description}
              </p>

              {/* Metric */}
              <div className="flex items-center gap-2 text-[#000000] dark:text-white">
                <Icon name="TrendingUp" size={14} className="text-[#C9B59C]" />
                <span className="text-sm font-semibold">{benefit.metric}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Badge */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-[#EFE9E3] dark:bg-[#262422] rounded-full border border-[#D9CFC7] dark:border-[rgba(217,207,199,0.15)]">
            <Icon name="CheckCircle2" size={20} className="text-[#C9B59C]" />
            <span className="text-sm font-medium text-[#000000] dark:text-white">
              All benefits included in every personalized roadmap
            </span>
          </div>
        </div>

        {/* CTA Button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={onGenerateRoadmap}
            className="group px-8 py-4 bg-[#C9B59C] hover:bg-[#B8A388] text-[#000000] rounded-full font-semibold text-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2"
          >
            Generate Your Roadmap
            <Icon name="ArrowRight" size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default BenefitsChecklist;