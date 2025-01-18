import React, { useState, useRef, useEffect } from 'react';
import { Search, Check } from 'lucide-react';
import languages from '../constants/constants';
import { Language } from '../types';

interface Props {
  selectedLanguage: Language;
  onLanguageSelect: (language: Language) => void;
}


export default function LanguageSelect({ selectedLanguage, onLanguageSelect }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredLanguages = languages.filter(lang =>
    lang.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative z-[100]" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 text-left rounded-lg bg-white/10 border border-white/20 
                   hover:bg-white/20 transition-all focus:outline-none focus:ring-2 
                   focus:ring-purple-500 text-white"
      >
        {selectedLanguage.name}
      </button>

      {isOpen && (
        <div className="fixed w-[calc(100%-3rem)] md:w-[calc(100%-2rem)] max-w-[30rem] mt-2 bg-gray-800/95 backdrop-blur-xl rounded-lg shadow-xl border border-white/10">
          <div className="p-2 border-b border-white/10">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-white/50" />
              <input
                type="text"
                placeholder="Search languages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white/5 rounded-md text-white placeholder-white/50
                         border border-white/10 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
            </div>
          </div>
          <div className="max-h-60 overflow-auto">
            {filteredLanguages.map((language) => (
              <button
                key={language.code}
                onClick={() => {
                  onLanguageSelect(language);
                  setIsOpen(false);
                  setSearchQuery('');
                }}
                className="w-full px-4 py-2 text-left hover:bg-white/10 transition-colors flex items-center justify-between text-white"
              >
                <span>{language.name}</span>
                {selectedLanguage === language && (
                  <Check className="h-4 w-4 text-purple-500" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}