
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
            ? 'border-amber-500 bg-white shadow-[0_0_20px_rgba(245,158,11,0.15)] scale-[1.02]'
            : 'border-stone-200 bg-white hover:border-amber-400/60 hover:scale-[1.02] hover:shadow-md'
          }
        `}
      >
        <div className="h-40 w-full relative overflow-hidden bg-stone-100">
          {style.thumbnail ? (
            <img
              src={style.thumbnail}
              alt={style.name}
              className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${isSelected ? 'opacity-100' : 'opacity-90 group-hover:opacity-100'}`}
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className={`w-full h-full ${style.previewColor} opacity-80 group-hover:opacity-100 transition-opacity`} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent opacity-60" />

          {isSelected && (
            <div className="absolute top-3 right-3 bg-amber-600 rounded-full p-1 shadow-lg animate-in zoom-in duration-300">
              <Check className="w-4 h-4 text-white" />
            </div>
          )}
        </div>

        <div className="p-4 flex-1 flex flex-col">
          <h3 className={`font-bold text-base mb-1.5 transition-colors duration-300 ${isSelected ? 'text-amber-700' : 'text-stone-800 group-hover:text-stone-900'}`}>
            {style.name}
          </h3>
          <p className="text-xs text-stone-500 leading-relaxed line-clamp-2">
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
        <h2 className="text-4xl font-extrabold text-stone-900 mb-4">Choose your Vibe</h2>
        <p className="text-stone-500 mb-10 text-lg">
          Select a professional studio look or explore artistic, cultural, and traditional styles.
        </p>

        {/* 4-Way Segmented Toggle */}
        <div className="relative inline-flex bg-stone-100 p-1.5 rounded-2xl border border-stone-200 shadow-inner w-full max-w-xl">
          <div
            className="absolute top-1.5 bottom-1.5 w-[calc(25%-4px)] bg-stone-900 rounded-xl transition-all duration-300 ease-out shadow-md"
            style={{
              transform: `translateX(${modeIndex * 100}%)`,
              left: modeIndex === 0 ? '1.5px' : modeIndex === 1 ? '1px' : modeIndex === 2 ? '0.5px' : '0px'
            }}
          />
          <button
            onClick={() => setMode('professional')}
            className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] sm:text-xs font-bold transition-colors ${mode === 'professional' ? 'text-white' : 'text-stone-500 hover:text-stone-700'}`}
          >
            <Briefcase className="w-4 h-4" />
            Professional
          </button>
          <button
            onClick={() => setMode('creative')}
            className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] sm:text-xs font-bold transition-colors ${mode === 'creative' ? 'text-white' : 'text-stone-500 hover:text-stone-700'}`}
          >
            <Palette className="w-4 h-4" />
            Creative
          </button>
          <button
            onClick={() => setMode('culture')}
            className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] sm:text-xs font-bold transition-colors ${mode === 'culture' ? 'text-white' : 'text-stone-500 hover:text-stone-700'}`}
          >
            <Globe className="w-4 h-4" />
            Culture
          </button>
          <button
            onClick={() => setMode('costume')}
            className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] sm:text-xs font-bold transition-colors ${mode === 'costume' ? 'text-white' : 'text-stone-500 hover:text-stone-700'}`}
          >
            <Shirt className="w-4 h-4" />
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
                <div className="h-px flex-1 bg-stone-200" />
                <h3 className="text-xs font-bold text-amber-700 uppercase tracking-[0.2em] flex items-center gap-2">
                   <Sparkles className="w-3 h-3" />
                   {category.name}
                </h3>
                <div className="h-px flex-1 bg-stone-200" />
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
                <div className="h-px flex-1 bg-stone-200" />
                <h3 className="text-xs font-bold text-orange-700 uppercase tracking-[0.2em] flex items-center gap-2">
                   <Globe className="w-3 h-3" />
                   {category.name}
                </h3>
                <div className="h-px flex-1 bg-stone-200" />
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
                <div className="h-px flex-1 bg-stone-200" />
                <h3 className="text-xs font-bold text-stone-700 uppercase tracking-[0.2em] flex items-center gap-2">
                   <Shirt className="w-3 h-3" />
                   {category.name}
                </h3>
                <div className="h-px flex-1 bg-stone-200" />
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
      <div className="mt-16 flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 rounded-full text-[10px] text-stone-500 uppercase tracking-widest font-bold shadow-sm">
        <LayoutGrid className="w-3 h-3 text-amber-600" />
        {mode === 'professional' ? '6 Studio Profiles' : mode === 'creative' ? '13 Artistic Profiles' : mode === 'culture' ? '16 Cultural Profiles' : '24 Regional Costumes'} Available
      </div>
    </div>
  );
};

export default StyleSelector;
