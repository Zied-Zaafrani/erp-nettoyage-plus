import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Check } from 'lucide-react';
import { languages, type LanguageCode } from '@/i18n';
import { clsx } from 'clsx';

// ============================================
// LANGUAGE SWITCHER COMPONENT
// ============================================

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isRTL = i18n.language === 'ar';

  const currentLanguage = languages.find((lang) => lang.code === i18n.language) || languages[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (code: LanguageCode) => {
    i18n.changeLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          'flex items-center gap-2 px-3 py-2 rounded-lg',
          'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800',
          'transition-colors duration-200',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
        )}
      >
        <Globe className="h-4 w-4" />
        <span className="text-sm font-medium">
          {currentLanguage.name}
        </span>
      </button>

      {isOpen && (
        <div
          className={clsx(
            'absolute top-full mt-2 py-1',
            'w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700',
            'z-50',
            isRTL ? 'left-0' : 'right-0'
          )}
        >
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={clsx(
                'w-full flex items-center gap-3 px-4 py-2',
                'text-sm',
                isRTL ? 'text-right flex-row-reverse' : 'text-left',
                'hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors',
                i18n.language === language.code && 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
              )}
            >
              <span className="text-lg">{language.flag}</span>
              <span className="flex-1">{language.name}</span>
              {i18n.language === language.code && (
                <Check className="h-4 w-4 text-primary-600" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
