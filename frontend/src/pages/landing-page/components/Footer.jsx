import React from 'react';
import Icon from '../../../components/AppIcon';

const Footer = () => {
  const currentYear = new Date()?.getFullYear();

  const footerLinks = {
    product: [
      { label: 'Features', href: '#features' },
      { label: 'How It Works', href: '#how-it-works' },
      { label: 'Success Stories', href: '#success-stories' },
      { label: 'Pricing', href: '#pricing' }
    ],
    company: [
      { label: 'About Us', href: '#about' },
      { label: 'Careers', href: '#careers' },
      { label: 'Blog', href: '#blog' },
      { label: 'Contact', href: '#contact' }
    ],
    support: [
      { label: 'Help Center', href: '#help' },
      { label: 'Privacy Policy', href: '#privacy' },
      { label: 'Terms of Service', href: '#terms' },
      { label: 'FAQs', href: '#faqs' }
    ]
  };

  const socialLinks = [
    { icon: 'Linkedin', href: '#', label: 'LinkedIn' },
    { icon: 'Twitter', href: '#', label: 'Twitter' },
    { icon: 'Instagram', href: '#', label: 'Instagram' },
    { icon: 'Youtube', href: '#', label: 'YouTube' }
  ];

  return (
    <footer className="bg-[#1C1B1A] text-white py-14 px-4 border-t border-[#D9CFC7]/15">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-4 gap-8 mb-10">
          <div className="space-y-4">
            <a href="/" className="inline-flex items-center gap-3 group">
              <div className="w-10 h-10 bg-[#C9B59C] rounded-xl flex items-center justify-center text-[#000000] font-bold text-sm transition-transform duration-200 group-hover:scale-105">
                NS
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">
                NextStep<span className="text-[#C9B59C]">AI</span>
              </span>
            </a>
            <p className="text-sm text-[#A1A1A1] leading-relaxed">
              AI-powered career guidance platform helping B.Tech students achieve their dream placements through personalized roadmaps.
            </p>
            <div className="flex gap-3">
              {socialLinks?.map((social, index) => (
                <a
                  key={index}
                  href={social?.href}
                  aria-label={social?.label}
                  className="w-9 h-9 bg-[#262422] border border-[#D9CFC7]/20 text-white rounded-xl flex items-center justify-center hover:bg-[#C9B59C] hover:text-[#000000] transition-colors duration-300"
                >
                  <Icon name={social?.icon} size={18} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-[#F9F8F6] mb-4">Product</h3>
            <ul className="space-y-2.5">
              {footerLinks?.product?.map((link, index) => (
                <li key={index}>
                  <a
                    href={link?.href}
                    className="text-sm text-[#A1A1A1] hover:text-[#C9B59C] transition-colors duration-200"
                  >
                    {link?.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-[#F9F8F6] mb-4">Company</h3>
            <ul className="space-y-2.5">
              {footerLinks?.company?.map((link, index) => (
                <li key={index}>
                  <a
                    href={link?.href}
                    className="text-sm text-[#A1A1A1] hover:text-[#C9B59C] transition-colors duration-200"
                  >
                    {link?.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-[#F9F8F6] mb-4">Support</h3>
            <ul className="space-y-2.5">
              {footerLinks?.support?.map((link, index) => (
                <li key={index}>
                  <a
                    href={link?.href}
                    className="text-sm text-[#A1A1A1] hover:text-[#C9B59C] transition-colors duration-200"
                  >
                    {link?.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-[#D9CFC7]/15">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-[#A1A1A1]">
              &copy; {currentYear} NextStep AI. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-sm text-[#A1A1A1]">
              <a href="#privacy" className="hover:text-[#C9B59C] transition-colors">
                Privacy Policy
              </a>
              <span>•</span>
              <a href="#terms" className="hover:text-[#C9B59C] transition-colors">
                Terms of Service
              </a>
              <span>•</span>
              <a href="#cookies" className="hover:text-[#C9B59C] transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;