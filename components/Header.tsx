import React, { useState } from 'react';
import { Sparkles, Lock, User as UserIcon, Menu, X, ArrowRight } from 'lucide-react';
import { AppStep, User } from '../types';

interface HeaderProps {
  onNavigate: (step: AppStep) => void;
  user: User | null;
  onLoginClick: () => void;
  onLogoutClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, user, onLoginClick, onLogoutClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = !user ? [
    { label: 'How it works', step: 'how-it-works' as AppStep },
    { label: 'Styles', step: 'style' as AppStep },
    { label: 'Pricing', step: 'pricing' as AppStep },
  ] : [
    { label: 'Dashboard', step: 'dashboard' as AppStep },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur supports-[backdrop-filter]:bg-slate-950/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-8 mx-auto">

        {/* Logo */}
        <button
          onClick={() => onNavigate(user ? 'dashboard' : 'landing')}
          className="flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <div className="rounded-lg bg-blue-600 p-2">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-white">ProHeadshot<span className="text-blue-500">AI</span></span>
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-6">
          {navLinks.map(link => (
            <button
              key={link.step}
              onClick={() => onNavigate(link.step)}
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-3">
          {!user ? (
            <>
              <div className="group relative flex items-center gap-1 text-xs text-slate-400 cursor-help">
                <Lock className="w-3 h-3" />
                <span>Secure</span>
                <div className="absolute right-0 top-full mt-3 w-72 p-4 bg-slate-800 border border-slate-700 rounded-xl text-slate-300 text-xs leading-relaxed shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="absolute -top-1.5 right-6 w-3 h-3 bg-slate-800 border-t border-l border-slate-700 transform rotate-45" />
                  TLS encryption in transit · AES-256 at rest. Your photos are never shared.
                </div>
              </div>
              <button
                onClick={onLoginClick}
                className="text-sm font-medium text-slate-300 hover:text-white px-4 py-2 rounded-lg transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={onLoginClick}
                className="inline-flex items-center gap-1.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg transition-colors shadow-lg shadow-blue-900/30"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-300 hidden sm:block">{user.email}</span>
              <div
                className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold border-2 border-slate-900 cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => onNavigate('dashboard')}
              >
                {user.avatar ? (
                  <img src={user.avatar} alt="Avatar" className="w-full h-full rounded-full" referrerPolicy="no-referrer" />
                ) : (
                  <UserIcon className="w-5 h-5" />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileMenuOpen(prev => !prev)}
          className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950 px-4 py-4 flex flex-col gap-4 animate-in slide-in-from-top-2 duration-200">
          {navLinks.map(link => (
            <button
              key={link.step}
              onClick={() => { onNavigate(link.step); setMobileMenuOpen(false); }}
              className="text-left text-sm font-medium text-slate-300 hover:text-white transition-colors py-1"
            >
              {link.label}
            </button>
          ))}
          <div className="border-t border-slate-800 pt-4 flex flex-col gap-3">
            {!user ? (
              <>
                <button
                  onClick={() => { onLoginClick(); setMobileMenuOpen(false); }}
                  className="w-full py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
                >
                  Get Started — $2.99
                </button>
                <button
                  onClick={() => { onLoginClick(); setMobileMenuOpen(false); }}
                  className="w-full py-2.5 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Sign In
                </button>
              </>
            ) : (
              <button
                onClick={() => { onLogoutClick(); setMobileMenuOpen(false); }}
                className="w-full py-2.5 text-sm font-medium text-slate-400 hover:text-white transition-colors text-left"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
