import React, { useState } from 'react';
import { Sparkles, User as UserIcon, Menu, X, ArrowRight } from 'lucide-react';
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
    <header className="sticky top-0 z-40 w-full border-b border-stone-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container flex h-16 items-center justify-between px-4 md:px-8 mx-auto">

        {/* Logo */}
        <button
          onClick={() => onNavigate(user ? 'dashboard' : 'landing')}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div className="rounded-lg bg-amber-600 p-2">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-stone-900">ProHeadshot<span className="text-amber-600">AI</span></span>
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-6">
          {navLinks.map(link => (
            <button
              key={link.step}
              onClick={() => onNavigate(link.step)}
              className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-3">
          {!user ? (
            <>
              <button
                onClick={onLoginClick}
                className="text-sm font-medium text-stone-600 hover:text-stone-900 px-4 py-2 rounded-lg transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={onLoginClick}
                className="inline-flex items-center gap-1.5 text-sm font-bold text-white bg-amber-600 hover:bg-amber-700 px-4 py-2 rounded-lg transition-colors shadow-sm shadow-amber-100"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-stone-600 hidden sm:block">{user.email}</span>
              <div
                className="w-9 h-9 bg-amber-600 rounded-full flex items-center justify-center text-white font-bold cursor-pointer hover:opacity-90 transition-opacity border-2 border-white shadow-sm"
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
          className="md:hidden p-2 text-stone-500 hover:text-stone-900 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white px-4 py-4 flex flex-col gap-4 animate-in slide-in-from-top-2 duration-200">
          {navLinks.map(link => (
            <button
              key={link.step}
              onClick={() => { onNavigate(link.step); setMobileMenuOpen(false); }}
              className="text-left text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors py-1"
            >
              {link.label}
            </button>
          ))}
          <div className="border-t border-stone-200 pt-4 flex flex-col gap-3">
            {!user ? (
              <>
                <button
                  onClick={() => { onLoginClick(); setMobileMenuOpen(false); }}
                  className="w-full py-2.5 text-sm font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors"
                >
                  Get Started — $2.99
                </button>
                <button
                  onClick={() => { onLoginClick(); setMobileMenuOpen(false); }}
                  className="w-full py-2.5 text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
                >
                  Sign In
                </button>
              </>
            ) : (
              <button
                onClick={() => { onLogoutClick(); setMobileMenuOpen(false); }}
                className="w-full py-2.5 text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors text-left"
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
