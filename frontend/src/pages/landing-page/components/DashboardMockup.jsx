import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const DashboardMockup = () => {
  const [activeTab, setActiveTab] = useState('Overview');

  const learningVelocityBars = [
    { day: 'M', height: 40 },
    { day: 'T', height: 65 },
    { day: 'W', height: 50 },
    { day: 'T', height: 90 },
    { day: 'F', height: 75 },
    { day: 'S', height: 95 },
    { day: 'S', height: 60 },
  ];

  const curatedProjects = [
    {
      id: 1,
      title: 'E-commerce Platform',
      desc: 'Full stack store with checkout & auth',
      match: 92,
      hours: '40h',
      tag: 'Full Stack',
      badgeColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
    },
    {
      id: 2,
      title: 'ML Price Predictor',
      desc: 'Python regression model & API deploy',
      match: 73,
      hours: '50h',
      tag: 'Python ML',
      badgeColor: 'bg-amber-500/10 text-amber-600 border-amber-500/20'
    },
    {
      id: 3,
      title: 'Real-time Chat App',
      desc: 'WebSocket server with team rooms',
      match: 88,
      hours: '30h',
      tag: 'WebSockets',
      badgeColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
    }
  ];

  return (
    <section className="relative py-20 px-4 bg-[#F9F8F6] dark:bg-[#1C1B1A]">
      <div className="container mx-auto max-w-7xl space-y-12">
        {/* Section Header */}
        <div className="text-center animate-fade-in max-w-3xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-4 text-[#141414] dark:text-white tracking-tight">
            Your <span className="text-[#FF5722]">AI-Powered</span> Dashboard
          </h2>
          <p className="text-lg text-[#555555] dark:text-[#A1A1A1] leading-relaxed">
            Real-time skills analysis, personalized project paths, and matched internship opportunities
          </p>
        </div>

        {/* Outer Dashboard Framing Card */}
        <div className="bg-[#EFE9E3] dark:bg-[#262422] rounded-3xl shadow-card border border-[#D9CFC7] dark:border-[rgba(217,207,199,0.15)] p-6 sm:p-8 animate-slide-up space-y-6">

          {/* Top Compact Header Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-[#1C1B1A] p-4 sm:p-5 rounded-2xl border border-[#D9CFC7] shadow-sm">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 bg-[#141414] text-white rounded-full flex items-center justify-center font-bold text-sm shadow-inner">
                AM
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-[#141414] dark:text-white tracking-tight flex items-center gap-2">
                  Career & Skill Matrix
                </h3>
                <p className="text-xs text-[#555555] dark:text-[#A1A1A1]">
                  Full-Stack Software Engineer Track
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[#F9F8F6] dark:bg-[#262422] border border-[#D9CFC7] rounded-full text-xs font-semibold text-[#141414] dark:text-white">
                <span className="w-2 h-2 rounded-full bg-[#FF5722] animate-pulse"></span>
                August 2026 Assessment
              </div>
              <button
                className="px-4 py-2 bg-[#141414] hover:bg-[#262422] text-white text-xs font-bold rounded-full transition-all shadow-sm flex items-center gap-1.5"
              >
                <Icon name="Download" size={14} />
                Export Profile
              </button>
            </div>
          </div>

          {/* MAIN BENTO GRID - ROW 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* CARD 1: SKILL SCORE GOAL (DARK ONYX CARD) */}
            <div className="bg-[#141414] text-white rounded-3xl p-6 border border-[#262422] shadow-xl flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute -top-16 -right-16 w-36 h-36 bg-[#FF5722]/15 rounded-full blur-2xl pointer-events-none"></div>

              <div className="flex justify-between items-center text-xs font-semibold text-[#A1A1A1] uppercase tracking-wider mb-4">
                <span className="flex items-center gap-1.5 text-white">
                  <Icon name="Target" size={15} className="text-[#FF5722]" />
                  SKILL SCORE GOAL
                </span>
                <span>Target: 1,000</span>
              </div>

              {/* Gauge Ring Chart */}
              <div className="relative py-4 flex items-center justify-center">
                <svg className="w-48 h-48 transform -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r="72"
                    stroke="#262422"
                    strokeWidth="16"
                    fill="transparent"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="72"
                    stroke="#FF5722"
                    strokeWidth="16"
                    strokeDasharray="452"
                    strokeDashoffset="108"
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000 ease-out"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="72"
                    stroke="#C9B59C"
                    strokeWidth="16"
                    strokeDasharray="452"
                    strokeDashoffset="339"
                    strokeLinecap="round"
                    fill="transparent"
                    className="opacity-40"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-4xl font-extrabold text-white tracking-tight">760</span>
                  <span className="text-xs text-[#A1A1A1] font-medium mt-0.5">Overall Score</span>
                </div>
              </div>

              <div className="flex justify-between items-end pt-4 border-t border-[#262422] text-xs">
                <span className="text-[#A1A1A1]">Readiness target:</span>
                <span className="text-xl font-bold text-white">76%</span>
              </div>
            </div>

            {/* CARD 2: SKILL COMPETENCY (LIGHT WARM CARD) */}
            <div className="bg-[#EFE9E3] dark:bg-[#262422] rounded-3xl p-6 border border-[#D9CFC7] dark:border-[rgba(217,207,199,0.15)] shadow-card flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-base font-bold text-[#141414] dark:text-white flex items-center gap-2">
                    <Icon name="BarChart2" size={18} className="text-[#FF5722]" />
                    Skill Competency
                  </h3>
                  <div className="flex bg-[#D9CFC7]/50 dark:bg-[#141414] p-1 rounded-full text-xs font-semibold">
                    <button
                      onClick={() => setActiveTab('Overview')}
                      className={`px-3 py-1 rounded-full transition-all ${
                        activeTab === 'Overview'
                          ? 'bg-[#141414] text-white shadow-sm'
                          : 'text-[#555555] dark:text-[#A1A1A1] hover:text-[#141414]'
                      }`}
                    >
                      Overview
                    </button>
                    <button
                      onClick={() => setActiveTab('Breakdown')}
                      className={`px-3 py-1 rounded-full transition-all ${
                        activeTab === 'Breakdown'
                          ? 'bg-[#141414] text-white shadow-sm'
                          : 'text-[#555555] dark:text-[#A1A1A1] hover:text-[#141414]'
                      }`}
                    >
                      Breakdown
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <span className="text-3xl font-extrabold text-[#141414] dark:text-white">85.4%</span>
                  <span className="text-xs text-[#555555] dark:text-[#A1A1A1] ml-2">Average Proficiency</span>
                </div>

                {/* Multi-segment Proficiency Bar */}
                <div className="flex h-2.5 rounded-full overflow-hidden mb-5 bg-[#D9CFC7]/40">
                  <div className="bg-[#FF5722] w-[40%]" title="Data Structures"></div>
                  <div className="bg-[#C9B59C] w-[25%]" title="Web Development"></div>
                  <div className="bg-[#141414] dark:bg-white w-[20%]" title="System Design"></div>
                  <div className="bg-amber-400 w-[15%]" title="Machine Learning"></div>
                </div>

                {/* Skills List */}
                <div className="space-y-3 text-xs font-medium">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FF5722]"></span>
                      <span className="text-[#141414] dark:text-white">Data Structures & Algo</span>
                    </div>
                    <span className="font-bold text-[#141414] dark:text-white">85%</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#C9B59C]"></span>
                      <span className="text-[#141414] dark:text-white">Web Development</span>
                    </div>
                    <span className="font-bold text-[#141414] dark:text-white">72%</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#141414] dark:bg-white"></span>
                      <span className="text-[#141414] dark:text-white">System Design</span>
                    </div>
                    <span className="font-bold text-[#141414] dark:text-white">60%</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                      <span className="text-[#141414] dark:text-white">Machine Learning</span>
                    </div>
                    <span className="font-bold text-[#FF5722]">(Focus) 45%</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#D9CFC7] dark:border-[rgba(217,207,199,0.15)] flex justify-between items-center text-xs mt-4">
                <span className="text-[#555555] dark:text-[#A1A1A1]">Practice Hours Logged:</span>
                <span className="font-bold text-[#141414] dark:text-white">120 hrs</span>
              </div>
            </div>

            {/* CARD 3: READINESS & PORTFOLIO ACTIONS */}
            <div className="bg-[#EFE9E3] dark:bg-[#262422] rounded-3xl p-6 border border-[#D9CFC7] dark:border-[rgba(217,207,199,0.15)] shadow-card flex flex-col justify-between">
              <div className="space-y-5">
                {/* Action Buttons Top */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    className="py-2.5 px-4 bg-[#141414] hover:bg-[#262422] text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <span>Resume</span>
                    <Icon name="ArrowUpRight" size={14} />
                  </button>
                  <button
                    className="py-2.5 px-4 bg-white dark:bg-[#1C1B1A] hover:bg-[#F9F8F6] text-[#141414] dark:text-white border border-[#D9CFC7] text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <span>Mock Exam</span>
                    <Icon name="ArrowDownRight" size={14} />
                  </button>
                </div>

                {/* Projects Completed */}
                <div className="bg-[#F9F8F6] dark:bg-[#1C1B1A] p-4 rounded-2xl border border-[#D9CFC7]/60">
                  <div className="text-[10px] font-bold text-[#555555] uppercase tracking-wider mb-1">
                    PROJECTS COMPLETED
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-extrabold text-[#141414] dark:text-white">5 / 8</span>
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <span key={i} className="w-3 h-3 rounded-full bg-[#FF5722]"></span>
                      ))}
                      {[6, 7, 8].map((i) => (
                        <span key={i} className="w-3 h-3 rounded-full bg-[#D9CFC7]"></span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Interview Readiness */}
                <div className="bg-[#F9F8F6] dark:bg-[#1C1B1A] p-4 rounded-2xl border border-[#D9CFC7]/60">
                  <div className="text-[10px] font-bold text-[#555555] uppercase tracking-wider mb-1">
                    INTERVIEW READINESS
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-extrabold text-[#141414] dark:text-white">87.5%</span>
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4].map((i) => (
                        <span key={i} className="w-3 h-3 rounded-full bg-[#C9B59C]"></span>
                      ))}
                      <span className="w-3 h-3 rounded-full bg-[#D9CFC7]"></span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#D9CFC7] dark:border-[rgba(217,207,199,0.15)] flex justify-end items-center text-xs font-bold text-[#141414] dark:text-white hover:text-[#FF5722] transition-colors gap-1 cursor-pointer">
                View Portfolio →
              </div>
            </div>
          </div>

          {/* MAIN BENTO GRID - ROW 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* CARD 1: LEARNING VELOCITY (VIBRANT CORAL/ORANGE CARD) */}
            <div className="bg-[#FF5722] text-white rounded-3xl p-6 shadow-xl flex flex-col justify-between relative overflow-hidden">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-white/90">
                    LEARNING VELOCITY
                  </span>
                  <button className="text-white/80 hover:text-white">
                    <Icon name="MoreHorizontal" size={18} />
                  </button>
                </div>

                <div className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-1">
                  28.4 hrs
                </div>
                <div className="text-xs text-white/80 font-medium mb-6">
                  Weekly Practice Volume (+14%)
                </div>

                {/* Bar Chart Visual */}
                <div className="flex items-end justify-between gap-2 h-24 mb-6 px-2">
                  {learningVelocityBars.map((bar, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-1.5 flex-1 h-full justify-end">
                      <div
                        className="w-full bg-[#FFE082] rounded-t-lg transition-all duration-500 hover:brightness-110"
                        style={{ height: `${bar.height}%` }}
                      ></div>
                      <span className="text-[10px] font-bold text-white/80">{bar.day}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-white/20 text-xs font-semibold">
                <span>Current Streak</span>
                <span className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full text-white">
                  14 Days Active 🔥
                </span>
              </div>
            </div>

            {/* CARD 2: TOP MATCH OPPORTUNITY (DARK ONYX CARD) */}
            <div className="bg-[#141414] text-white rounded-3xl p-6 border border-[#262422] shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-[#FF5722] rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-md">
                      TCS
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-[#A1A1A1] uppercase tracking-wider">
                        TOP MATCH OPPORTUNITY
                      </div>
                      <div className="text-base font-bold text-white">Software Developer</div>
                    </div>
                  </div>
                  <button className="text-[#A1A1A1] hover:text-white">
                    <Icon name="MoreHorizontal" size={18} />
                  </button>
                </div>

                {/* Match Metrics Grid */}
                <div className="grid grid-cols-2 gap-4 my-4 p-4 bg-[#1C1B1A] rounded-2xl border border-[#262422]">
                  <div>
                    <div className="text-[10px] text-[#A1A1A1] font-semibold uppercase mb-1">MATCH SCORE</div>
                    <div className="text-2xl font-extrabold text-emerald-400">94%</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#A1A1A1] font-semibold uppercase mb-1">ROLE FIT</div>
                    {/* Sparkline Wave */}
                    <svg className="w-20 h-7" viewBox="0 0 80 28">
                      <path
                        d="M0 20 Q 20 5, 40 18 T 80 8"
                        fill="none"
                        stroke="#FF5722"
                        strokeWidth="2.5"
                      />
                    </svg>
                  </div>
                </div>

                {/* Profile Readiness Bar */}
                <div className="space-y-1.5 mb-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-[#A1A1A1]">Profile Readiness</span>
                    <span className="text-emerald-400">High Reach</span>
                  </div>
                  <div className="w-full bg-[#262422] h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-400 h-full w-[94%] rounded-full"></div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-[#262422] text-xs">
                <span className="text-[#A1A1A1]">Tata Consultancy Services</span>
                <button
                  className="px-4 py-1.5 bg-white text-[#141414] hover:bg-[#EFE9E3] font-bold rounded-full transition-all text-xs"
                >
                  Apply Now
                </button>
              </div>
            </div>

            {/* CARD 3: CALENDAR CARD */}
            <div className="bg-[#EFE9E3] dark:bg-[#262422] rounded-3xl p-6 border border-[#D9CFC7] dark:border-[rgba(217,207,199,0.15)] shadow-card flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <button className="p-1 hover:bg-[#D9CFC7]/50 rounded-lg transition-colors">
                    <Icon name="ChevronLeft" size={16} />
                  </button>
                  <span className="text-sm font-bold text-[#141414] dark:text-white">August 2026</span>
                  <button className="p-1 hover:bg-[#D9CFC7]/50 rounded-lg transition-colors">
                    <Icon name="ChevronRight" size={16} />
                  </button>
                </div>

                {/* Days Header */}
                <div className="grid grid-cols-7 text-center text-[10px] font-bold text-[#555555] dark:text-[#A1A1A1] uppercase mb-2">
                  <span>SUN</span><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span>
                </div>

                {/* Date Grid */}
                <div className="grid grid-cols-7 text-center text-xs font-semibold gap-y-1.5">
                  {[26, 27, 28, 29, 30, 1, 2, 3].map((d, i) => (
                    <span key={i} className="text-[#A1A1A1] py-1">{d}</span>
                  ))}
                  {/* Highlighted Assessment Range 4-8 */}
                  {[4, 5, 6, 7, 8].map((d) => (
                    <span key={d} className="bg-[#FF5722] text-white py-1 rounded-full font-bold shadow-sm">
                      {d}
                    </span>
                  ))}
                  {[9, 10, 11, 12, 13, 14, 15, 16].map((d) => (
                    <span key={d} className="text-[#141414] dark:text-white py-1">{d}</span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#D9CFC7] dark:border-[rgba(217,207,199,0.15)] flex justify-between items-center text-xs">
                <div>
                  <div className="text-[10px] text-[#555555] dark:text-[#A1A1A1] uppercase font-semibold">NEXT MILESTONE:</div>
                  <div className="font-bold text-[#141414] dark:text-white">Full-Stack Mock Exam</div>
                </div>
                <span className="px-3 py-1 bg-[#C9B59C]/30 text-[#141414] dark:text-white rounded-full font-bold text-[11px]">
                  Aug 18
                </span>
              </div>
            </div>
          </div>

          {/* CURATED PROJECT RECOMMENDATIONS - ROW 3 */}
          <div className="bg-[#EFE9E3] dark:bg-[#262422] rounded-3xl p-6 sm:p-8 border border-[#D9CFC7] dark:border-[rgba(217,207,199,0.15)] shadow-card space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <h3 className="text-lg font-bold text-[#141414] dark:text-white">
                  Curated Project Recommendations
                </h3>
                <p className="text-xs text-[#555555] dark:text-[#A1A1A1]">
                  Practice projects mapped to boost your lowest competency scores
                </p>
              </div>
              <div
                className="text-xs font-bold text-[#141414] dark:text-white hover:text-[#FF5722] transition-colors cursor-pointer"
              >
                View All Projects →
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {curatedProjects.map((project) => (
                <div
                  key={project.id}
                  className="bg-[#F9F8F6] dark:bg-[#1C1B1A] p-5 rounded-2xl border border-[#D9CFC7] dark:border-[rgba(217,207,199,0.15)] flex flex-col justify-between hover:border-[#FF5722] transition-all hover:shadow-md group cursor-pointer"
                >
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${project.badgeColor}`}>
                        {project.match}% Match
                      </span>
                      <span className="text-xs text-[#555555] font-semibold">~{project.hours}</span>
                    </div>

                    <h4 className="font-bold text-base text-[#141414] dark:text-white group-hover:text-[#FF5722] transition-colors mb-1">
                      {project.title}
                    </h4>
                    <p className="text-xs text-[#555555] dark:text-[#A1A1A1] leading-relaxed mb-4">
                      {project.desc}
                    </p>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-[#D9CFC7]/40">
                    <span className="px-2.5 py-1 bg-[#EFE9E3] dark:bg-[#262422] text-[#141414] dark:text-white text-[11px] font-semibold rounded-lg border border-[#D9CFC7]">
                      {project.tag}
                    </span>
                    <span className="text-xs font-bold text-[#141414] dark:text-white group-hover:text-[#FF5722] transition-colors flex items-center gap-1">
                      Start →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default DashboardMockup;