import React, { useState, useEffect, useRef } from 'react';
import Icon from '../../../components/AppIcon';

const FeaturesGrid = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
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

  const features = [
    {
      id: 'psychometric',
      icon: 'Brain',
      iconColor: 'text-primary',
      iconBg: 'bg-primary/10',
      title: 'Psychometric Insights',
      description: 'Advanced personality assessment to match your traits with ideal career paths and work environments',
      preview: ['Personality type analysis', 'Career fit scoring', 'Work style preferences', 'Team role identification'],
      badge: 'AI-Powered'
    },
    {
      id: 'coding',
      icon: 'Code2',
      iconColor: 'text-accent',
      iconBg: 'bg-accent/10',
      title: 'Coding Profile Analysis',
      description: 'Comprehensive evaluation of your programming skills across multiple platforms and languages',
      preview: ['GitHub contribution analysis', 'LeetCode problem-solving patterns', 'HackerRank skill assessment', 'Language proficiency mapping'],
      badge: 'Multi-Platform'
    },
    {
      id: 'internship',
      icon: 'Briefcase',
      iconColor: 'text-success',
      iconBg: 'bg-success/10',
      title: 'Internship Matching',
      description: 'Smart algorithm connects your profile with relevant internship opportunities at top companies',
      preview: ['Company-skill alignment', 'Application timeline planning', 'Resume optimization tips', 'Interview preparation guides'],
      badge: 'Smart Match'
    },
    {
      id: 'projects',
      icon: 'FolderGit2',
      iconColor: 'text-warning',
      iconBg: 'bg-warning/10',
      title: 'Project Recommendations',
      description: 'Curated project ideas tailored to your skill level and career goals with implementation guides',
      preview: ['Difficulty-based suggestions', 'Technology stack guidance', 'Portfolio building tips', 'Industry relevance scoring'],
      badge: 'Personalized'
    },
    {
      id: 'skillgap',
      icon: 'Target',
      iconColor: 'text-destructive',
      iconBg: 'bg-destructive/10',
      title: 'Skill Gap Identification',
      description: 'Precise analysis of missing skills required for your target roles with learning resources',
      preview: ['Current vs required skills', 'Priority-based learning paths', 'Resource recommendations', 'Timeline estimation'],
      badge: 'Data-Driven'
    },
    {
      id: 'visualization',
      icon: 'LineChart',
      iconColor: 'text-secondary',
      iconBg: 'bg-secondary/10',
      title: 'Career Path Visualization',
      description: 'Interactive roadmap showing your journey from current state to dream job with milestones',
      preview: ['Visual progress tracking', 'Milestone celebrations', 'Alternative path exploration', 'Success probability metrics'],
      badge: 'Interactive'
    }
  ];

  return (
    <section ref={sectionRef} className="py-16 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Powerful Features for Career Success
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to transform your B.Tech journey into a successful career path
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features?.map((feature, index) => (
            <div
              key={feature?.id}
              className={`bg-[#EFE9E3] dark:bg-[#262422] rounded-3xl border border-[#D9CFC7] dark:border-[rgba(217,207,199,0.15)] hover:border-[#FF5722] transition-all duration-300 hover:shadow-xl cursor-pointer ${
                isVisible ? 'animate-slide-up' : 'opacity-0'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
              onMouseEnter={() => setHoveredCard(feature?.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-2xl bg-[#FF5722]/10 border border-[#FF5722]/20">
                    <Icon name={feature?.icon} size={24} className="text-[#FF5722]" />
                  </div>
                  <span className="px-3 py-1 bg-[#FF5722]/10 text-[#FF5722] text-xs font-bold rounded-full border border-[#FF5722]/20">
                    {feature?.badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-[#141414] dark:text-white mb-2 group-hover:text-[#FF5722] transition-colors">
                  {feature?.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#555555] dark:text-[#A1A1A1] leading-relaxed mb-4">
                  {feature?.description}
                </p>

                {hoveredCard === feature?.id && (
                  <div className="mt-4 pt-4 border-t border-[#D9CFC7]/40 space-y-2 animate-fade-in">
                    {feature?.preview?.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <Icon name="Check" size={16} className="text-[#FF5722] mt-0.5 flex-shrink-0" />
                        <span className="text-xs text-[#141414] dark:text-white font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-4 flex items-center gap-2 text-[#FF5722] font-bold text-xs hover:gap-3 transition-all duration-300">
                  <span>Learn more</span>
                  <Icon name="ArrowRight" size={14} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;