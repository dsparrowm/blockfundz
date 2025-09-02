import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail } from 'lucide-react';
import NexGenLogo from '../components/ui/NexGenLogo';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Product",
      links: [
        { label: "Features", href: "#features" },
        { label: "Pricing", href: "#pricing" },
        { label: "Documentation", href: "#docs" },
        { label: "Release Notes", href: "#releases" }
      ]
    },
    {
      title: "Company",
      links: [
        { label: "About Us", href: "#about" },
        { label: "Careers", href: "#careers" },
        { label: "Blog", href: "#blog" },
        { label: "Press Kit", href: "#press" }
      ]
    },
    {
      title: "Support",
      links: [
        { label: "Help Center", href: "#help" },
        { label: "Community", href: "#community" },
        { label: "Contact Us", href: "#contact" },
        { label: "Status", href: "#status" }
      ]
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy", href: "#privacy" },
        { label: "Terms", href: "#terms" },
        { label: "Cookie Policy", href: "#cookies" },
        { label: "License", href: "#license" }
      ]
    }
  ];

  const socialLinks = [
    { icon: <Facebook size={20} />, href: "#facebook", label: "Facebook" },
    { icon: <Twitter size={20} />, href: "#twitter", label: "Twitter" },
    { icon: <Instagram size={20} />, href: "#instagram", label: "Instagram" },
    { icon: <Linkedin size={20} />, href: "#linkedin", label: "LinkedIn" },
    { icon: <Mail size={20} />, href: "#mail", label: "Email" }
  ];

  return (
    <footer className="bg-gray-900 text-gray-200 bg-transparent px-4 sm:px-6">
      {/* Main Footer Content */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6 sm:mb-8 max-w-6xl mx-auto">
        {footerSections.map((section) => (
          <div key={section.title}>
            <h3 className="font-semibold text-white mb-4 text-lg sm:text-xl">{section.title}</h3>
            <ul className="space-y-2">
              {section.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 pt-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Logo and Copyright */}
          <div className="flex flex-col items-center md:items-start space-y-2">
            <div className='flex items-center gap-1'>
              <a href="/">
                <NexGenLogo variant="full" size="sm" />
              </a>
            </div>
            <p className="text-sm text-gray-400">
              © {currentYear} NexGen. All rights reserved.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex space-x-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label={social.label}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;