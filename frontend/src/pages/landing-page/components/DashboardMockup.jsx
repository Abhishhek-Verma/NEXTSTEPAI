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
    { key: 'dataStructures', label: 'Data Structures', fullLabel: 'Data Structures & Algo', progress: 85, color: 'text-blue-500', barColor: 'bg-blue-500', angle: -90 },
    { key: 'webDevelopment', label: 'Web Dev', fullLabel: 'Web Development', progress: 72, color: 'text-cyan-500', barColor: 'bg-cyan-500', angle: 0 },
    { key: 'machineLearning', label: 'ML', fullLabel: 'Machine Learning', progress: 45, color: 'text-emerald-500', barColor: 'bg-emerald-500', angle: 90 },
    { key: 'systemDesign', label: 'System Design', fullLabel: 'System Design', progress: 60, color: 'text-purple-500', barColor: 'bg-purple-500', angle: 180 }
  ];

  // Radar Chart Calculations
  const centerX = 120;
  const centerY = 120;
  const radius = 80;

  const getCoordinates = (angle, value) => {
    const radian = (angle * Math.PI) / 180;
    // value is 0-100, normalize to 0-1
    const normalizedValue = value / 100;
    return {
      x: centerX + radius * normalizedValue * Math.cos(radian),
      y: centerY + radius * normalizedValue * Math.sin(radian)
    };
  };

  const getPolygonPoints = () => {
    return skills.map(skill => {
      const coords = getCoordinates(skill.angle, skillProgress[skill.key]);
      return `${coords.x},${coords.y}`;
    }).join(' ');
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
    <section className="relative py-20 px-4 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Your <span className="text-primary">AI-Powered</span> Dashboard
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real-time skills analysis, personalized project paths, and matched internship opportunities
          </p>
        </div>

        {/* Main Dashboard Card */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 p-6 sm:p-8 animate-slide-up">

          {/* Top Stats */}
          <div className="flex justify-end gap-4 mb-8">
            <div className="text-center px-6 py-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 transform hover:scale-105 transition-transform duration-300">
              <div className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">SKILL SCORE</div>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">760</div>
            </div>
            <div className="text-center px-6 py-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800 transform hover:scale-105 transition-transform duration-300">
              <div className="text-sm text-emerald-600 dark:text-emerald-400 font-medium mb-1">PROJECTS</div>
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">5/8</div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-8">
              {/* Skill Radar */}
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                      <Icon name="Activity" size={18} className="text-blue-500" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">Skill Radar</h3>
                  </div>
                  <span className="text-xs px-3 py-1 bg-green-500/10 text-green-600 dark:text-green-400 rounded-full font-medium animate-pulse">
                    Live Analysis
                  </span>
                </div>

                {/* Animated SVG Radar Chart */}
                <div className="relative h-72 flex items-center justify-center mb-6">
                  {/* ViewBox adjusted to prevent clipping of labels. Center is 150,150. */}
                  <svg width="100%" height="100%" viewBox="0 0 300 300" className="transform transition-all duration-500">
                    {/* Grid Levels */}
                    {[20, 40, 60, 80, 100].map((level, i) => (
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
                        className="text-gray-200 dark:text-gray-700"
                        strokeWidth="1"
                      />
                    ))}

                    {/* Axes */}
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
                          className="text-gray-200 dark:text-gray-700"
                          strokeWidth="1"
                        />
                      );
                    })}

                    {/* Data Polygon */}
                    <polygon
                      points={skills.map(skill => {
                        const radian = (skill.angle * Math.PI) / 180;
                        const val = skillProgress[skill.key] / 100;
                        const x = 150 + 80 * val * Math.cos(radian);
                        const y = 150 + 80 * val * Math.sin(radian);
                        return `${x},${y}`;
                      }).join(' ')}
                      fill="rgba(59, 130, 246, 0.2)"
                      stroke="#3b82f6"
                      strokeWidth="2"
                      className="transition-all duration-1000 ease-out"
                    />

                    {/* Data Points & Labels */}
                    {skills.map(skill => {
                      const radian = (skill.angle * Math.PI) / 180;
                      const val = skillProgress[skill.key] / 100;
                      const x = 150 + 80 * val * Math.cos(radian);
                      const y = 150 + 80 * val * Math.sin(radian);

                      // Label position (radius 110)
                      const lx = 150 + 110 * Math.cos(radian);
                      const ly = 150 + 110 * Math.sin(radian);

                      return (
                        <g key={skill.key}
                          onMouseEnter={() => setHoveredSkill(skill.key)}
                          onMouseLeave={() => setHoveredSkill(null)}
                          className="cursor-pointer group"
                        >
                          {/* Point */}
                          <circle
                            cx={x}
                            cy={y}
                            r={hoveredSkill === skill.key ? 6 : 4}
                            className={`fill-white stroke-2 transition-all duration-300 ${skill.color.replace('text', 'stroke')}`}
                          />

                          {/* Native SVG Text Label */}
                          <text
                            x={lx}
                            y={ly}
                            dy="0.35em"
                            textAnchor="middle"
                            className={`text-[10px] uppercase font-bold tracking-wider transition-colors duration-300 ${hoveredSkill === skill.key ? 'fill-blue-600 dark:fill-blue-400' : 'fill-gray-500 dark:fill-gray-400'}`}
                            style={{ fontSize: '10px' }}
                          >
                            {skill.label}
                          </text>

                          {/* Tooltip on Hover */}
                          {hoveredSkill === skill.key && (
                            <g transform={`translate(${x}, ${y - 20})`}>
                              <rect x="-25" y="-18" width="50" height="18" rx="4" fill="#1f2937" className="dark:fill-white" />
                              <text x="0" y="-6" textAnchor="middle" fill="white" className="dark:fill-gray-900 text-[9px] font-bold">
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
                  <div className="text-xs font-semibold text-muted-foreground mb-2">DETAILED BREAKDOWN</div>
                  {skills.map((skill) => (
                    <div
                      key={skill.key}
                      className={`p-2 rounded-lg transition-colors duration-200 ${hoveredSkill === skill.key ? 'bg-muted/50' : ''}`}
                      onMouseEnter={() => setHoveredSkill(skill.key)}
                      onMouseLeave={() => setHoveredSkill(null)}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`text-sm font-medium transition-colors ${hoveredSkill === skill.key ? skill.color : 'text-foreground'}`}>
                          {skill.fullLabel}
                        </span>
                        <span className="text-sm font-bold text-foreground">{skill.progress}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${skill.barColor} transition-all duration-1000 ease-out`}
                          style={{ width: `${skillProgress[skill.key]}%` }}
                        />
                      </div>
                      {skill.key === 'machineLearning' && (
                        <div className="mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium animate-pulse">
                          → Recommended Focus
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Matched Internships */}
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center">
                      <Icon name="Target" size={18} className="text-purple-500" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">Matched Internships</h3>
                  </div>
                </div>

                <div className="space-y-3">
                  {internships.map((internship, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold transform group-hover:rotate-12 transition-transform duration-300">
                          {internship.company.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                            {internship.company}
                          </div>
                          <div className="text-xs text-muted-foreground">{internship.role}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{internship.match}%</div>
                        <div className="text-xs text-muted-foreground">{internship.level}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="w-full mt-4 py-2 text-sm font-medium text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors group">
                  View All Opportunities <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                </button>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Recommended Projects */}
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                      <Icon name="Briefcase" size={18} className="text-emerald-500" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">Recommended Projects</h3>
                  </div>
                  <button className="text-sm text-primary hover:underline">View All →</button>
                </div>

                <div className="space-y-4">
                  {projects.map((project, index) => (
                    <div
                      key={index}
                      className="group bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all overflow-hidden cursor-pointer hover:shadow-md hover:-translate-y-1"
                    >
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-2xl transform group-hover:scale-125 transition-transform duration-300">{project.image}</span>
                              <div>
                                <div className="font-bold text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                  {project.title}
                                </div>
                                <div className="text-xs text-muted-foreground">{project.difficulty} • {project.hours}</div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              {project.tags.map(tag => (
                                <span key={tag} className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-muted-foreground rounded-md group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/30 transition-colors">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="text-right ml-3">
                            <div className="text-xs font-bold px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full group-hover:bg-emerald-500 group-hover:text-white transition-all">
                              {project.match}% Match
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Icon name="Clock" size={12} />
                          <span>Est. {project.hours}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Projected Growth */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900 rounded-2xl p-6 border border-slate-700 text-white hover:shadow-xl hover:shadow-slate-900/50 transition-all duration-500 group">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center group-hover:bg-orange-500/30 transition-colors">
                    <Icon name="TrendingUp" size={18} className="text-orange-400" />
                  </div>
                  <h3 className="text-lg font-bold">Projected Growth</h3>
                </div>

                <div className="text-sm text-gray-400 mb-4">Based on current learning velocity</div>

                {/* Growth Chart */}
                <div className="relative h-48 mb-6">
                  <svg className="w-full h-full" viewBox="0 0 300 150">
                    <defs>
                      <linearGradient id="growthGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                      </linearGradient>
                    </defs>

                    {/* Grid lines */}
                    <line x1="0" y1="120" x2="300" y2="120" stroke="#334155" strokeDasharray="4 4" />
                    <line x1="0" y1="60" x2="300" y2="60" stroke="#334155" strokeDasharray="4 4" />

                    <path
                      d="M 0 120 Q 75 100, 150 60 T 300 20"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="3"
                      className="drop-shadow-lg"
                      strokeDasharray="1000"
                      strokeDashoffset="0"
                    >
                      <animate attributeName="stroke-dashoffset" from="1000" to="0" dur="2s" fill="freeze" />
                    </path>

                    <path
                      d="M 0 120 Q 75 100, 150 60 T 300 20 L 300 150 L 0 150 Z"
                      fill="url(#growthGradient)"
                      opacity="0"
                    >
                      <animate attributeName="opacity" from="0" to="1" dur="2s" begin="0.5s" fill="freeze" />
                    </path>

                    {/* Interactive Data points */}
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
                          fill="#3b82f6"
                          className="transition-all duration-300 group-hover/point:r-6 cursor-pointer"
                        />
                        <foreignObject x={pt.x - 20} y={pt.y - 30} width="40" height="24" className="opacity-0 group-hover/point:opacity-100 transition-opacity">
                          <div className="bg-slate-800 text-[9px] text-center rounded py-1 border border-slate-600">{pt.val}</div>
                        </foreignObject>
                      </g>
                    ))}
                  </svg>

                  <div className="absolute bottom-2 left-4 text-xs text-gray-500">Jan</div>
                  <div className="absolute bottom-2 right-4 text-xs text-gray-500">Dec</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Next Milestone:</div>
                    <div className="text-sm font-semibold group-hover:text-blue-400 transition-colors">Full Stack Ready</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Timeline:</div>
                    <div className="text-sm font-semibold text-blue-400">Senior Dev (6 mos)</div>
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