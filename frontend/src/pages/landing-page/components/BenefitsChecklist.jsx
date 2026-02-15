import React from 'react';
import Icon from '../../../components/AppIcon';

const BenefitsChecklist = ({ onGenerateRoadmap }) => {
  const benefits = [
    {
      title: 'Structured Learning Paths',
      description: 'Clear, step-by-step guidance eliminating confusion about what to learn next',
      icon: 'Route',
      metric: '100% clarity',
      iconBg: 'bg-blue-50 dark:bg-blue-900/20',
      iconColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      title: 'Industry-Relevant Projects',
      description: 'Build portfolio projects that directly align with job requirements at target companies',
      icon: 'Briefcase',
      metric: '3x interview calls',
      iconBg: 'bg-purple-50 dark:bg-purple-900/20',
      iconColor: 'text-purple-600 dark:text-purple-400'
    },
    {
      title: 'Targeted Skill Development',
      description: 'Focus on high-impact skills that matter most for your desired career path',
      icon: 'Target',
      metric: '60% faster learning',
      iconBg: 'bg-emerald-50 dark:bg-emerald-900/20',
      iconColor: 'text-emerald-600 dark:text-emerald-400'
    },
    {
      title: 'Placement Preparation',
      description: 'Comprehensive interview prep, resume optimization, and application strategies',
      icon: 'Award',
      metric: '94% success rate',
      iconBg: 'bg-orange-50 dark:bg-orange-900/20',
      iconColor: 'text-orange-600 dark:text-orange-400'
    },
    {
      title: 'Time-Saving Automation',
      description: 'AI handles research and planning so you can focus on actual skill building',
      icon: 'Clock',
      metric: '20+ hours saved',
      iconBg: 'bg-cyan-50 dark:bg-cyan-900/20',
      iconColor: 'text-cyan-600 dark:text-cyan-400'
    },
    {
      title: 'Confidence Building',
      description: 'Data-driven insights replace uncertainty with actionable confidence',
      icon: 'TrendingUp',
      metric: '85% confidence boost',
      iconBg: 'bg-pink-50 dark:bg-pink-900/20',
      iconColor: 'text-pink-600 dark:text-pink-400'
    },
    {
      title: 'Competitive Advantage',
      description: 'Stand out from peers with personalized strategies and proven methodologies',
      icon: 'Zap',
      metric: '2x placement offers',
      iconBg: 'bg-yellow-50 dark:bg-yellow-900/20',
      iconColor: 'text-yellow-600 dark:text-yellow-400'
    },
    {
      title: 'Continuous Adaptation',
      description: 'Roadmap evolves with your progress and changing market demands',
      icon: 'RefreshCw',
      metric: 'Always current',
      iconBg: 'bg-indigo-50 dark:bg-indigo-900/20',
      iconColor: 'text-indigo-600 dark:text-indigo-400'
    }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground">
            Transform Your <span className="text-emerald-600 dark:text-emerald-400">Career Journey</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Experience measurable improvements in every aspect of your career preparation with our AI-driven, personalized roadmap.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="group bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-xl transition-all duration-300"
            >
              {/* Icon and Check */}
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 ${benefit.iconBg} rounded-xl flex items-center justify-center transition-transform group-hover:scale-110`}>
                  <Icon name={benefit.icon} size={24} className={benefit.iconColor} />
                </div>
                <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <Icon name="Check" size={14} className="text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {benefit.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {benefit.description}
              </p>

              {/* Metric */}
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <Icon name="TrendingUp" size={14} />
                <span className="text-sm font-semibold">{benefit.metric}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Badge */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-full border border-emerald-200 dark:border-emerald-800">
            <Icon name="CheckCircle2" size={20} className="text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
              All benefits included in every personalized roadmap
            </span>
          </div>
        </div>

        {/* CTA Button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={onGenerateRoadmap}
            className="group px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
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