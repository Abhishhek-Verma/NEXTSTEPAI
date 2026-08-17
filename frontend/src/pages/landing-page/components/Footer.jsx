import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const Footer = () => {
  const currentYear = new Date()?.getFullYear();
  const [activeModal, setActiveModal] = useState(null);

  const modalContents = {
    about: {
      title: 'About NextStepAI',
      icon: 'Info',
      content: (
        <div className="space-y-4 text-sm text-[#555555] dark:text-[#A1A1A1] leading-relaxed">
          <p>
            <strong className="text-[#000000] dark:text-white">NextStepAI</strong> is an advanced, AI-powered career intelligence platform designed specifically for engineering and B.Tech students.
          </p>
          <p>
            Our core mission is to bridge the gap between academic education and industry expectations. By synthesizing academic transcript performance, live coding metrics (GitHub, LeetCode, Codeforces, CodeChef), and psychometric personality traits, NextStepAI provides personalized milestone roadmaps and targeted project recommendations.
          </p>
          <p>
            NextStepAI empowers students to make data-backed career decisions and secure placement opportunities.
          </p>
        </div>
      )
    },
    privacy: {
      title: 'Privacy Policy',
      icon: 'ShieldCheck',
      content: (
        <div className="space-y-4 text-sm text-[#555555] dark:text-[#A1A1A1] leading-relaxed">
          <p>
            At NextStepAI, your data privacy and security are paramount. This Privacy Policy outlines how we collect, protect, and handle your information.
          </p>
          <h4 className="font-bold text-[#000000] dark:text-white mt-2">1. Data Collection</h4>
          <p>
            We only gather data necessary to provide personalized career recommendations: academic records, public coding platform handle statistics, and optional psychometric responses.
          </p>
          <h4 className="font-bold text-[#000000] dark:text-white mt-2">2. Data Security & Storage</h4>
          <p>
            Authentication is securely managed via Clerk with enterprise-grade encryption. We never store raw login passwords or unauthorized platform tokens.
          </p>
          <h4 className="font-bold text-[#000000] dark:text-white mt-2">3. Zero Third-Party Selling</h4>
          <p>
            Your personal data, code profiles, and academic transcripts will never be sold, leased, or distributed to third-party data brokers.
          </p>
        </div>
      )
    },
    terms: {
      title: 'Terms of Service',
      icon: 'FileText',
      content: (
        <div className="space-y-4 text-sm text-[#555555] dark:text-[#A1A1A1] leading-relaxed">
          <p>
            Welcome to NextStepAI. By accessing or using our platform, you agree to comply with and be bound by the following Terms of Service.
          </p>
          <h4 className="font-bold text-[#000000] dark:text-white mt-2">1. Account Responsibility</h4>
          <p>
            You are responsible for maintaining the confidentiality of your account credentials and for all activities conducted under your profile.
          </p>
          <h4 className="font-bold text-[#000000] dark:text-white mt-2">2. Acceptable Use</h4>
          <p>
            You agree to use NextStepAI strictly for genuine career guidance, skill evaluation, and educational development. Automated scraping or misuse of our AI models is prohibited.
          </p>
          <h4 className="font-bold text-[#000000] dark:text-white mt-2">3. Intellectual Property</h4>
          <p>
            All platform designs, AI recommendation algorithms, and visual interfaces are the property of NextStepAI.
          </p>
        </div>
      )
    },
    cookies: {
      title: 'Cookie Policy',
      icon: 'Cookie',
      content: (
        <div className="space-y-4 text-sm text-[#555555] dark:text-[#A1A1A1] leading-relaxed">
          <p>
            NextStepAI uses minimal, essential cookies and browser storage to ensure smooth platform operation.
          </p>
          <h4 className="font-bold text-[#000000] dark:text-white mt-2">1. Essential Authentication Cookies</h4>
          <p>
            Used exclusively by Clerk to maintain active login sessions securely across pages.
          </p>
          <h4 className="font-bold text-[#000000] dark:text-white mt-2">2. Local Storage Caching</h4>
          <p>
            We use your browser's local storage to cache user preferences (such as sidebar state and offline dashboard metrics) for faster page rendering.
          </p>
          <h4 className="font-bold text-[#000000] dark:text-white mt-2">3. No Advertising Cookies</h4>
          <p>
            NextStepAI does not utilize any third-party tracking or advertising cookies.
          </p>
        </div>
      )
    }
  };

  return (
    <footer className="bg-[#1C1B1A] text-white py-14 px-4 border-t border-[#D9CFC7]/15">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-4 gap-8 mb-10">
          {/* Brand Column */}
          <div className="space-y-4 md:col-span-1">
            <a href="/" className="inline-flex items-center gap-3 group">
              <img
                src="/logo.jpeg"
                alt="NextStepAI Logo"
                className="w-10 h-10 rounded-xl object-cover transition-transform duration-200 group-hover:scale-105"
              />
              <span className="text-2xl font-bold text-white tracking-tight">
                NextStep<span className="text-[#FF5722]">AI</span>
              </span>
            </a>
            <p className="text-sm text-[#A1A1A1] leading-relaxed">
              AI-powered career guidance platform helping B.Tech students achieve their dream placements through personalized roadmaps.
            </p>
            {/* Social & Contact */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.linkedin.com/in/abhishhek-verma"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 bg-[#262422] border border-[#D9CFC7]/20 text-white rounded-xl flex items-center justify-center hover:bg-[#FF5722] hover:text-white transition-colors duration-300"
                title="LinkedIn Profile"
              >
                <Icon name="Linkedin" size={18} />
              </a>

              <a
                href="mailto:abhishekatkiet@gmail.com"
                aria-label="Email"
                className="w-9 h-9 bg-[#262422] border border-[#D9CFC7]/20 text-white rounded-xl flex items-center justify-center hover:bg-[#FF5722] hover:text-white transition-colors duration-300"
                title="Contact Email"
              >
                <Icon name="Mail" size={18} />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold text-[#F9F8F6] mb-4">Product</h3>
            <ul className="space-y-2.5">
              <li>
                <a href="#features" className="text-sm text-[#A1A1A1] hover:text-[#FF5722] transition-colors duration-200">
                  Features
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="text-sm text-[#A1A1A1] hover:text-[#FF5722] transition-colors duration-200">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#success-stories" className="text-sm text-[#A1A1A1] hover:text-[#FF5722] transition-colors duration-200">
                  Success Stories
                </a>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-[#F9F8F6] mb-4">Company</h3>
            <ul className="space-y-2.5">
              <li>
                <button
                  onClick={() => setActiveModal('about')}
                  className="text-sm text-[#A1A1A1] hover:text-[#FF5722] transition-colors duration-200 text-left"
                >
                  About NextStepAI
                </button>
              </li>
              <li>
                <a
                  href="mailto:abhishekatkiet@gmail.com"
                  className="text-sm text-[#A1A1A1] hover:text-[#FF5722] transition-colors duration-200 flex items-center gap-1.5"
                >
                  <span>Contact Us</span>
                  <Icon name="ExternalLink" size={12} />
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Policy Links */}
          <div>
            <h3 className="font-semibold text-[#F9F8F6] mb-4">Legal & Support</h3>
            <ul className="space-y-2.5">
              <li>
                <button
                  onClick={() => setActiveModal('privacy')}
                  className="text-sm text-[#A1A1A1] hover:text-[#FF5722] transition-colors duration-200 text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveModal('terms')}
                  className="text-sm text-[#A1A1A1] hover:text-[#FF5722] transition-colors duration-200 text-left"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveModal('cookies')}
                  className="text-sm text-[#A1A1A1] hover:text-[#FF5722] transition-colors duration-200 text-left"
                >
                  Cookie Policy
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#D9CFC7]/15 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#A1A1A1]">
            &copy; {currentYear} NextStep AI. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-[#A1A1A1]">
            <button onClick={() => setActiveModal('privacy')} className="hover:text-[#FF5722] transition-colors">
              Privacy Policy
            </button>
            <span>•</span>
            <button onClick={() => setActiveModal('terms')} className="hover:text-[#FF5722] transition-colors">
              Terms of Service
            </button>
            <span>•</span>
            <button onClick={() => setActiveModal('cookies')} className="hover:text-[#FF5722] transition-colors">
              Cookie Policy
            </button>
          </div>
        </div>
      </div>

      {/* Info Content Modal */}
      {activeModal && modalContents[activeModal] && (
        <div className="fixed inset-0 bg-[#000000]/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-[#EFE9E3] dark:bg-[#262422] rounded-3xl shadow-lift border border-[#D9CFC7] dark:border-[rgba(217,207,199,0.15)] max-w-lg w-full p-6 sm:p-8 animate-slide-up text-[#141414] dark:text-white">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#D9CFC7] dark:border-[rgba(217,207,199,0.15)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#FF5722]/15 rounded-xl flex items-center justify-center text-[#FF5722]">
                  <Icon name={modalContents[activeModal].icon} size={20} />
                </div>
                <h3 className="text-xl font-bold text-[#141414] dark:text-white">
                  {modalContents[activeModal].title}
                </h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-2 text-[#555555] hover:text-[#141414] dark:text-[#A1A1A1] dark:hover:text-white rounded-xl hover:bg-[#D9CFC7]/50 transition-colors"
              >
                <Icon name="X" size={20} />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto pr-2">
              {modalContents[activeModal].content}
            </div>

            <div className="mt-6 pt-4 border-t border-[#D9CFC7] dark:border-[rgba(217,207,199,0.15)] flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-6 py-2.5 bg-[#FF5722] text-white font-bold text-sm rounded-xl hover:bg-[#e04d1d] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;