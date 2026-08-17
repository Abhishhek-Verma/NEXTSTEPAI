import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const DashboardMockup = () => {
  const [skillProgress, setSkillProgress] = useState({
    dataStructures: 0,
    webDevelopment: 0,
    machineLearning: 0,
    systemDesign: 0
  });

  const [hoveredSkill, setHoveredSkill] = useState(null);

  useEffect(() => {
    // Animate skills on mount
    const timer = setTimeout(() => {
      setSkillProgress({
        dataStructures: 85,
        webDevelopment: 72,
        machineLearning: 45,
        systemDesign: 60
      });
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const skills = [
    { key: 'dataStructures', label: 'Data Structures', fullLabel: 'Data Structures & Algo', progress: 85, color: 'text-[#C9B59C]', barColor: 'bg-[#C9B59C]', angle: -90 },
    { key: 'webDevelopment', label: 'Web Dev', fullLabel: 'Web Development', progress: 72, color: 'text-[#000000]', barColor: 'bg-[#000000]', angle: 0 },
    { key: 'machineLearning', label: 'ML', fullLabel: 'Machine Learning', progress: 45, color: 'text-[#C9B59C]', barColor: 'bg-[#C9B59C]', angle: 90 },
    { key: 'systemDesign', label: 'System Design', fullLabel: 'System Design', progress: 60, color: 'text-[#555555]', barColor: 'bg-[#555555]', angle: 180 }
  ];

  // Radar Chart Calculations
  const centerX = 120;
  const centerY = 120;
  const radius = 80;

  const getCoordinates = (angle, value) => {
    const radian = (angle * Math.PI) / 180;
    const normalizedValue = value / 100;
    return {
      x: centerX + radius * normalizedValue * Math.cos(radian),
      y: centerY + radius * normalizedValue * Math.sin(radian)
    };
  };

  const projects = [
    {
      title: 'E-commerce Platform',
      difficulty: 'Intermediate',
      match: 92,
      hours: '40 Hours',
      tags: ['Full Stack'],
      image: '🛒'
    },
    {
      title: 'ML Price Predictor',
      difficulty: 'Advanced',
      match: 73,
      hours: '50 Hours',
      tags: ['Python ML'],
      image: '📊'
    },
    {
      title: 'Real-time Chat App',
      difficulty: 'Intermediate',
      match: 88,
      hours: '30 Hours',
      tags: ['Team Collab'],
      image: '💬'
    }
  ];

  const internships = [
    { company: 'TCS', role: 'Software Developer', match: 94, level: 'High Reach' },
    { company: 'Infosys', role: 'Data Analyst', match: 87, level: 'Good Fit' },
    { company: 'Wipro', role: 'Full Stack Developer', match: 91, level: 'High Reach' }
  ];

  return (
    <section className="relative py-20 px-4 bg-[#F9F8F6] dark:bg-[#1C1B1A]">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-[#000000] dark:text-white">
            Your <span className="text-[#C9B59C]">AI-Powered</span> Dashboard
          </h2>
          <p className="text-lg text-[#555555] dark:text-[#A1A1A1] max-w-2xl mx-auto">
            Real-time skills analysis, personalized project paths, and matched internship opportunities
          </p>
        </div>

        {/* Main Dashboard Card */}
        <div className="bg-[#EFE9E3] dark:bg-[#262422] rounded-3xl shadow-card border border-[#D9CFC7] dark:border-[rgba(217,207,199,0.15)] p-6 sm:p-8 animate-slide-up">

          {/* Top Stats */}
          <div className="flex justify-end gap-4 mb-8">
            <div className="text-center px-6 py-3 bg-[#F9F8F6] dark:bg-[#1C1B1A] rounded-xl border border-[#D9CFC7] transform hover:scale-105 transition-transform duration-300">
              <div className="text-sm text-[#555555] dark:text-[#A1A1A1] font-medium mb-1">SKILL SCORE</div>
              <div className="text-3xl font-bold text-[#000000] dark:text-white">760</div>
            </div>
            <div className="text-center px-6 py-3 bg-[#F9F8F6] dark:bg-[#1C1B1A] rounded-xl border border-[#D9CFC7] transform hover:scale-105 transition-transform duration-300">
              <div className="text-sm text-[#555555] dark:text-[#A1A1A1] font-medium mb-1">PROJECTS</div>
              <div className="text-3xl font-bold text-[#C9B59C]">5/8</div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-8">
              {/* Skill Radar */}
              <div className="bg-[#F9F8F6] dark:bg-[#1C1B1A] rounded-2xl p-6 border border-[#D9CFC7] dark:border-[rgba(217,207,199,0.15)] hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#C9B59C]/20 rounded-lg flex items-center justify-center">
                      <Icon name="Activity" size={18} className="text-[#C9B59C]" />
                    </div>
                    <h3 className="text-lg font-bold text-[#000000] dark:text-white">Skill Radar</h3>
                  </div>
                  <span className="text-xs px-3 py-1 bg-[#C9B59C]/20 text-[#000000] dark:text-white rounded-full font-medium animate-pulse">
                    Live Analysis
                  </span>
                </div>

                {/* Animated SVG Radar Chart */}
                <div className="relative h-72 flex items-center justify-center mb-6">
                  <svg width="100%" height="100%" viewBox="0 0 300 300" className="transform transition-all duration-500">
                    {[20, 40, 60, 80, 100].map((level) => (
                      <polygon
                        key={level}
                        points={skills.map(s => {
                          const radian = (s.angle * Math.PI) / 180;
                          const x = 150 + 80 * (level / 100) * Math.cos(radian);
                          const y = 150 + 80 * (level / 100) * Math.sin(radian);
                          return `${x},${y}`;
                        }).join(' ')}
                        fill="none"
                        stroke="currentColor"
                        className="text-[#D9CFC7] dark:text-[#333]"
                        strokeWidth="1"
                      />
                    ))}

                    {skills.map(skill => {
                      const radian = (skill.angle * Math.PI) / 180;
                      const x = 150 + 80 * Math.cos(radian);
                      const y = 150 + 80 * Math.sin(radian);
                      return (
                        <line
                          key={skill.key}
                          x1={150}
                          y1={150}
                          x2={x}
                          y2={y}
                          stroke="currentColor"
                          className="text-[#D9CFC7] dark:text-[#333]"
                          strokeWidth="1"
                        />
                      );
                    })}

                    <polygon
                      points={skills.map(skill => {
                        const radian = (skill.angle * Math.PI) / 180;
                        const val = skillProgress[skill.key] / 100;
                        const x = 150 + 80 * val * Math.cos(radian);
                        const y = 150 + 80 * val * Math.sin(radian);
                        return `${x},${y}`;
                      }).join(' ')}
                      fill="rgba(201, 181, 156, 0.25)"
                      stroke="#C9B59C"
                      strokeWidth="2"
                      className="transition-all duration-1000 ease-out"
                    />

                    {skills.map(skill => {
                      const radian = (skill.angle * Math.PI) / 180;
                      const val = skillProgress[skill.key] / 100;
                      const x = 150 + 80 * val * Math.cos(radian);
                      const y = 150 + 80 * val * Math.sin(radian);

                      const lx = 150 + 110 * Math.cos(radian);
                      const ly = 150 + 110 * Math.sin(radian);

                      return (
                        <g key={skill.key}
                          onMouseEnter={() => setHoveredSkill(skill.key)}
                          onMouseLeave={() => setHoveredSkill(null)}
                          className="cursor-pointer group"
                        >
                          <circle
                            cx={x}
                            cy={y}
                            r={hoveredSkill === skill.key ? 6 : 4}
                            className="fill-white stroke-[#C9B59C] stroke-2 transition-all duration-300"
                          />

                          <text
                            x={lx}
                            y={ly}
                            dy="0.35em"
                            textAnchor="middle"
                            className={`text-[10px] uppercase font-bold tracking-wider transition-colors duration-300 ${hoveredSkill === skill.key ? 'fill-[#C9B59C]' : 'fill-[#555555]'}`}
                            style={{ fontSize: '10px' }}
                          >
                            {skill.label}
                          </text>

                          {hoveredSkill === skill.key && (
                            <g transform={`translate(${x}, ${y - 20})`}>
                              <rect x="-25" y="-18" width="50" height="18" rx="4" fill="#000000" />
                              <text x="0" y="-6" textAnchor="middle" fill="#FFFFFF" className="text-[9px] font-bold">
                                {skillProgress[skill.key]}%
                              </text>
                            </g>
                          )}
                        </g>
                      );
                    })}
                  </svg>
                </div>

                {/* Detailed Breakdown */}
                <div className="space-y-3">
                  <div className="text-xs font-semibold text-[#555555] dark:text-[#A1A1A1] mb-2">DETAILED BREAKDOWN</div>
                  {skills.map((skill) => (
                    <div
                      key={skill.key}
                      className={`p-2 rounded-lg transition-colors duration-200 ${hoveredSkill === skill.key ? 'bg-[#EFE9E3]/60' : ''}`}
                      onMouseEnter={() => setHoveredSkill(skill.key)}
                      onMouseLeave={() => setHoveredSkill(null)}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`text-sm font-medium transition-colors ${hoveredSkill === skill.key ? 'text-[#C9B59C]' : 'text-[#000000] dark:text-white'}`}>
                          {skill.fullLabel}
                        </span>
                        <span className="text-sm font-bold text-[#000000] dark:text-white">{skill.progress}%</span>
                      </div>
                      <div className="h-2 bg-[#D9CFC7]/50 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#C9B59C] transition-all duration-1000 ease-out"
                          style={{ width: `${skillProgress[skill.key]}%` }}
                        />
                      </div>
                      {skill.key === 'machineLearning' && (
                        <div className="mt-1 text-xs text-[#000000] dark:text-[#C9B59C] font-medium animate-pulse">
                          → Recommended Focus
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Matched Internships */}
              <div className="bg-[#F9F8F6] dark:bg-[#1C1B1A] rounded-2xl p-6 border border-[#D9CFC7] dark:border-[rgba(217,207,199,0.15)] hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#C9B59C]/20 rounded-lg flex items-center justify-center">
                      <Icon name="Target" size={18} className="text-[#C9B59C]" />
                    </div>
                    <h3 className="text-lg font-bold text-[#000000] dark:text-white">Matched Internships</h3>
                  </div>
                </div>

                <div className="space-y-3">
                  {internships.map((internship, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-[#EFE9E3] dark:bg-[#262422] rounded-xl border border-[#D9CFC7] hover:border-[#C9B59C] hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#C9B59C] rounded-lg flex items-center justify-center text-[#000000] font-bold transform group-hover:rotate-12 transition-transform duration-300">
                          {internship.company.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-[#000000] dark:text-white group-hover:text-[#C9B59C] transition-colors">
                            {internship.company}
                          </div>
                          <div className="text-xs text-[#555555] dark:text-[#A1A1A1]">{internship.role}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-[#C9B59C]">{internship.match}%</div>
                        <div className="text-xs text-[#555555] dark:text-[#A1A1A1]">{internship.level}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="w-full mt-4 py-2 text-sm font-medium text-[#000000] hover:text-[#C9B59C] hover:bg-[#EFE9E3] rounded-lg transition-colors group">
                  View All Opportunities <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                </button>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Recommended Projects */}
              <div className="bg-[#F9F8F6] dark:bg-[#1C1B1A] rounded-2xl p-6 border border-[#D9CFC7] dark:border-[rgba(217,207,199,0.15)] hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#C9B59C]/20 rounded-lg flex items-center justify-center">
                      <Icon name="Briefcase" size={18} className="text-[#C9B59C]" />
                    </div>
                    <h3 className="text-lg font-bold text-[#000000] dark:text-white">Recommended Projects</h3>
                  </div>
                  <button className="text-sm text-[#000000] hover:text-[#C9B59C] font-semibold">View All →</button>
                </div>

                <div className="space-y-4">
                  {projects.map((project, index) => (
                    <div
                      key={index}
                      className="group bg-[#EFE9E3] dark:bg-[#262422] rounded-xl border border-[#D9CFC7] hover:border-[#C9B59C] transition-all overflow-hidden cursor-pointer hover:shadow-md hover:-translate-y-1"
                    >
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-2xl transform group-hover:scale-125 transition-transform duration-300">{project.image}</span>
                              <div>
                                <div className="font-bold text-[#000000] dark:text-white group-hover:text-[#C9B59C] transition-colors">
                                  {project.title}
                                </div>
                                <div className="text-xs text-[#555555] dark:text-[#A1A1A1]">{project.difficulty} • {project.hours}</div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              {project.tags.map(tag => (
                                <span key={tag} className="text-xs px-2 py-1 bg-[#F9F8F6] dark:bg-[#1C1B1A] text-[#000000] rounded-md transition-colors">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="text-right ml-3">
                            <div className="text-xs font-bold px-3 py-1 bg-[#C9B59C] text-[#000000] rounded-full transition-all">
                              {project.match}% Match
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-[#555555] dark:text-[#A1A1A1]">
                          <Icon name="Clock" size={12} />
                          <span>Est. {project.hours}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Projected Growth */}
              <div className="bg-[#262422] rounded-2xl p-6 border border-[#D9CFC7]/20 text-white hover:shadow-xl transition-all duration-500 group">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 bg-[#C9B59C]/20 rounded-lg flex items-center justify-center">
                    <Icon name="TrendingUp" size={18} className="text-[#C9B59C]" />
                  </div>
                  <h3 className="text-lg font-bold">Projected Growth</h3>
                </div>

                <div className="text-sm text-[#A1A1A1] mb-4">Based on current learning velocity</div>

                {/* Growth Chart */}
                <div className="relative h-48 mb-6">
                  <svg className="w-full h-full" viewBox="0 0 300 150">
                    <defs>
                      <linearGradient id="growthGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#C9B59C" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#C9B59C" stopOpacity="0" />
                      </linearGradient>
                    </defs>

                    <line x1="0" y1="120" x2="300" y2="120" stroke="#555" strokeDasharray="4 4" />
                    <line x1="0" y1="60" x2="300" y2="60" stroke="#555" strokeDasharray="4 4" />

                    <path
                      d="M 0 120 Q 75 100, 150 60 T 300 20"
                      fill="none"
                      stroke="#C9B59C"
                      strokeWidth="3"
                    />

                    <path
                      d="M 0 120 Q 75 100, 150 60 T 300 20 L 300 150 L 0 150 Z"
                      fill="url(#growthGradient)"
                    />

                    {[
                      { x: 0, y: 120, val: 'Start' },
                      { x: 75, y: 90, val: 'Month 1' },
                      { x: 150, y: 60, val: 'Month 3' },
                      { x: 225, y: 40, val: 'Month 6' },
                      { x: 300, y: 20, val: 'Year 1' }
                    ].map((pt, i) => (
                      <g key={i} className="group/point">
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r="4"
                          fill="#C9B59C"
                          className="transition-all duration-300 group-hover/point:r-6 cursor-pointer"
                        />
                      </g>
                    ))}
                  </svg>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-[#A1A1A1] mb-1">Next Milestone:</div>
                    <div className="text-sm font-semibold text-white">Full Stack Ready</div>
                  </div>
                  <div>
                    <div className="text-xs text-[#A1A1A1] mb-1">Timeline:</div>
                    <div className="text-sm font-semibold text-[#C9B59C]">Senior Dev (6 mos)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardMockup;