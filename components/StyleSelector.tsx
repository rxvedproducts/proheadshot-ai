
import React, { useState } from 'react';
import { HEADSHOT_STYLES, CREATIVE_CATEGORIES, INDIAN_CULTURE_CATEGORIES, INDIAN_COSTUME_CATEGORIES } from '../constants';
import { HeadshotStyle } from '../types';
import { Check, Briefcase, Palette, Sparkles, LayoutGrid, Globe, Shirt } from 'lucide-react';

interface StyleSelectorProps {
  onSelect: (style: HeadshotStyle) => void;
  selectedStyle: HeadshotStyle | null;
}

const StyleSelector: React.FC<StyleSelectorProps> = ({ onSelect, selectedStyle }) => {
  const [mode, setMode] = useState<'professional' | 'creative' | 'culture' | 'costume'>('professional');

  const modes: ('professional' | 'creative' | 'culture' | 'costume')[] = ['professional', 'creative', 'culture', 'costume'];
  const modeIndex = modes.indexOf(mode);

  const StyleCard = ({ style }: { style: HeadshotStyle; key?: React.Key }) => {
    const isSelected = selectedStyle?.id === style.id;
    return (
      <button
        onClick={() => onSelect(style)}
        className={`relative group flex flex-col overflow-hidden rounded-2xl border-2 text-left transition-all duration-300 h-full transform
          ${isSelected 
            ? 'border-blue-500 bg-slate-800/80 shadow-[0_0_25px_rgba(37,99,235,0.2)] scale-[1.02]' 
            : 'border-slate-800 bg-slate-900/50 hover:border-blue-500/40 hover:bg-slate-900 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-900/10'
          }
        `}
      >
        <div className="h-40 w-full relative overflow-hidden bg-slate-800">
          {style.thumbnail ? (
            <img 
              src={style.thumbnail} 
              alt={style.name} 
              className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${isSelected ? 'opacity-100' : 'opacity-80 group-hover:opacity-100'}`}
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className={`w-full h-full ${style.previewColor} opacity-80 group-hover:opacity-100 transition-opacity`} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />
          
          {isSelected && (
            <div className="absolute top-3 right-3 bg-blue-600 rounded-full p-1 shadow-lg animate-in zoom-in duration-300">
              <Check className="w-4 h-4 text-white" />
            </div>
          )}
          
          {/* Subtle hover overlay for better contrast */}
          <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/5 transition-colors duration-300" />
        </div>

        <div className="p-5 flex-1 flex flex-col">
          <h3 className={`font-bold text-lg mb-1.5 transition-colors duration-300 ${isSelected ? 'text-white' : 'text-slate-200 group-hover:text-white'}`}>
            {style.name}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 transition-colors duration-300 group-hover:text-slate-300">
            {style.description}
          </p>
        </div>
      </button>
    );
  };

  return (
    <div className="flex flex-col items-center py-12 px-4 w-full max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* Selector Header & Toggle */}
      <div className="text-center mb-12 w-full max-w-2xl">
        <h2 className="text-4xl font-extrabold text-white mb-4">Choose your Vibe</h2>
        <p className="text-slate-400 mb-10 text-lg">
          Select a professional studio look or explore artistic, cultural, and traditional styles.
        </p>

        {/* 4-Way Segmented Toggle */}
        <div className="relative inline-flex bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 shadow-inner w-full max-w-xl">
          <div 
            className={`absolute top-1.5 bottom-1.5 w-[calc(25%-4px)] bg-blue-600 rounded-xl transition-all duration-300 ease-out shadow-lg shadow-blue-900/40`}
            style={{ 
              transform: `translateX(${modeIndex * 100}%)`,
              left: modeIndex === 0 ? '1.5px' : modeIndex === 1 ? '1px' : modeIndex === 2 ? '0.5px' : '0px'
            }}
          />
          <button 
            onClick={() => setMode('professional')}
            className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] sm:text-xs font-bold transition-colors ${mode === 'professional' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Briefcase className={`w-4 h-4 ${mode === 'professional' ? 'animate-pulse' : ''}`} />
            Professional
          </button>
          <button 
            onClick={() => setMode('creative')}
            className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] sm:text-xs font-bold transition-colors ${mode === 'creative' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Palette className={`w-4 h-4 ${mode === 'creative' ? 'animate-pulse' : ''}`} />
            Creative
          </button>
          <button 
            onClick={() => setMode('culture')}
            className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] sm:text-xs font-bold transition-colors ${mode === 'culture' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Globe className={`w-4 h-4 ${mode === 'culture' ? 'animate-pulse' : ''}`} />
            Culture
          </button>
          <button 
            onClick={() => setMode('costume')}
            className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] sm:text-xs font-bold transition-colors ${mode === 'costume' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Shirt className={`w-4 h-4 ${mode === 'costume' ? 'animate-pulse' : ''}`} />
            Costume
          </button>
        </div>
      </div>

      {/* Grid Display */}
      {mode === 'professional' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full animate-in fade-in duration-500">
          {HEADSHOT_STYLES.map((style) => (
            <StyleCard key={style.id} style={style} />
          ))}
        </div>
      )}

      {mode === 'creative' && (
        <div className="space-y-16 w-full animate-in fade-in duration-500">
          {CREATIVE_CATEGORIES.map((category) => (
            <div key={category.name} className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-800/50" />
                <h3 className="text-xs font-bold text-blue-500 uppercase tracking-[0.2em] flex items-center gap-2">
                   <Sparkles className="w-3 h-3" />
                   {category.name}
                </h3>
                <div className="h-px flex-1 bg-slate-800/50" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {category.styles.map((style) => (
                  <StyleCard key={style.id} style={style as HeadshotStyle} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {mode === 'culture' && (
        <div className="space-y-16 w-full animate-in fade-in duration-500">
          {INDIAN_CULTURE_CATEGORIES.map((category) => (
            <div key={category.name} className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-800/50" />
                <h3 className="text-xs font-bold text-orange-500 uppercase tracking-[0.2em] flex items-center gap-2">
                   <Globe className="w-3 h-3" />
                   {category.name}
                </h3>
                <div className="h-px flex-1 bg-slate-800/50" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {category.styles.map((style) => (
                  <StyleCard key={style.id} style={style as HeadshotStyle} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {mode === 'costume' && (
        <div className="space-y-16 w-full animate-in fade-in duration-500">
          {INDIAN_COSTUME_CATEGORIES.map((category) => (
            <div key={category.name} className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-800/50" />
                <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-[0.2em] flex items-center gap-2">
                   <Shirt className="w-3 h-3" />
                   {category.name}
                </h3>
                <div className="h-px flex-1 bg-slate-800/50" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {category.styles.map((style) => (
                  <StyleCard key={style.id} style={style as HeadshotStyle} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Info Badge */}
      <div className="mt-16 flex items-center gap-2 px-4 py-2 bg-slate-900/50 border border-slate-800 rounded-full text-[10px] text-slate-500 uppercase tracking-widest font-bold">
        <LayoutGrid className="w-3 h-3 text-blue-500" />
        {mode === 'professional' ? '6 Studio Profiles' : mode === 'creative' ? '13 Artistic Profiles' : mode === 'culture' ? '16 Cultural Profiles' : '24 Regional Costumes'} Available
      </div>
    </div>
  );
};

export default StyleSelector;
