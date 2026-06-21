
import React from 'react';
import { Camera, Lock, User as UserIcon } from 'lucide-react';
import { AppStep, User } from '../types';

interface HeaderProps {
  onNavigate: (step: AppStep) => void;
  user: User | null;
  onLoginClick: () => void;
  onLogoutClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, user, onLoginClick, onLogoutClick }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur supports-[backdrop-filter]:bg-slate-950/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-8 mx-auto">
        <button 
          onClick={() => onNavigate(user ? 'dashboard' : 'landing')}
          className="flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <div className="rounded-lg bg-blue-600 p-2">
            <Camera className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-white">ProHeadshot<span className="text-blue-500">AI</span></span>
        </button>
        
        <nav className="hidden md:flex gap-6">
          {!user && (
            <>
              <button onClick={() => onNavigate('how-it-works')} className="text-sm font-medium text-slate-300 hover:text-white transition-colors">How it works</button>
              <button onClick={() => onNavigate('landing')} className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Styles</button>
              <button onClick={() => onNavigate('pricing')} className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Pricing</button>
            </>
          )}
          {user && (
             <button onClick={() => onNavigate('dashboard')} className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Dashboard</button>
          )}
        </nav>

        <div className="flex items-center gap-4">
           {!user ? (
              <>
                <div className="hidden sm:flex group relative items-center gap-1 text-xs text-slate-400 cursor-help mr-2">
                    <Lock className="w-3 h-3" />
                    <span>Secure</span>
                    <div className="absolute right-0 top-full mt-3 w-72 p-4 bg-slate-800 border border-slate-700 rounded-xl text-slate-300 text-xs leading-relaxed shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="absolute -top-1.5 right-6 w-3 h-3 bg-slate-800 border-t border-l border-slate-700 transform rotate-45"></div>
                      We apply industry-standard encryption—TLS for data in transit and AES-256 for data at rest.
                    </div>
                </div>
                <button 
                  onClick={onLoginClick}
                  className="text-sm font-bold text-white bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg transition-colors"
                >
                  Sign In
                </button>
              </>
           ) : (
              <div className="flex items-center gap-3">
                 <span className="text-sm font-medium text-slate-300 hidden sm:block">{user.email}</span>
                 <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold border-2 border-slate-900 cursor-pointer hover:opacity-90 transition-opacity" onClick={() => onNavigate('dashboard')}>
                    {user.avatar ? (
                      <img src={user.avatar} alt="Avatar" className="w-full h-full rounded-full" referrerPolicy="no-referrer" />
                    ) : (
                      <UserIcon className="w-5 h-5" />
                    )}
                 </div>
              </div>
           )}
        </div>
      </div>
    </header>
  );
};

export default Header;
