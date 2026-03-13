import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Globe, ChevronDown } from 'lucide-react';

import { uiTranslations } from '../data/uiTranslations';

const CategoryNav = ({ categories, activeCategory, onCategoryClick, currentLang, onLanguageChange }) => {
    const t = uiTranslations[currentLang] || uiTranslations.en;
    const scrollRef = useRef(null);
    const buttonRefs = useRef({});
    const [showLeftIndicator, setShowLeftIndicator] = useState(false);
    const [showRightIndicator, setShowRightIndicator] = useState(true);
    const [showScrollHint, setShowScrollHint] = useState(false);
    const [isLangOpen, setIsLangOpen] = useState(false);
    const [showAmharicNumeral, setShowAmharicNumeral] = useState(true);

    const languages = [
        { code: 'am', name: 'Amharic', flag: 'https://flagcdn.com/w40/et.png' },
        { code: 'en', name: 'English', flag: 'https://flagcdn.com/w40/us.png' }
    ];

    // Find the current language object for display
    const currentLanguageObj = languages.find(l => l.code === currentLang) || languages[0];

    useEffect(() => {
        // Show hint after header animation finishes (wait 2.5s)
        const showTimer = setTimeout(() => {
            setShowScrollHint(true);
        }, 2500);

        // Hide hint 5 seconds after showing (2.5s + 5s = 7.5s)
        const hideTimer = setTimeout(() => {
            setShowScrollHint(false);
        }, 7500);

        return () => {
            clearTimeout(showTimer);
            clearTimeout(hideTimer);
        };
    }, []);

    // Sequence: Amharic (3s) → "9" for 5s → back to Amharic
    useEffect(() => {
        // After 3s, switch to "9"
        const showNineTimer = setTimeout(() => setShowAmharicNumeral(false), 3000);
        // After 3+5=8s, switch back to Amharic
        const revertTimer = setTimeout(() => setShowAmharicNumeral(true), 8000);
        return () => {
            clearTimeout(showNineTimer);
            clearTimeout(revertTimer);
        };
    }, []);

    // Helper to get display name — shows "9" instead of "፱" briefly
    const displayName = currentLang === 'am' && !showAmharicNumeral
        ? t.hotelNameSmall.replace('፱', '9')
        : t.hotelNameSmall;

    // Auto-scroll active category into view
    useEffect(() => {
        if (scrollRef.current && buttonRefs.current[activeCategory]) {
            const container = scrollRef.current;
            const activeButton = buttonRefs.current[activeCategory];

            // Scroll the active button into the center of the container
            const scrollLeft = activeButton.offsetLeft - (container.offsetWidth / 2) + (activeButton.offsetWidth / 2);
            container.scrollTo({
                left: scrollLeft,
                behavior: 'smooth'
            });
        }
    }, [activeCategory]);

    useEffect(() => {
        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    if (scrollRef.current) {
                        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
                        setShowLeftIndicator(scrollLeft > 10);
                        setShowRightIndicator(scrollLeft < scrollWidth - clientWidth - 10);
                    }
                    ticking = false;
                });
                ticking = true;
            }
        };

        const scrollElement = scrollRef.current;
        if (scrollElement) {
            scrollElement.addEventListener('scroll', handleScroll, { passive: true });
            handleScroll(); // Initial check
        }

        return () => {
            if (scrollElement) {
                scrollElement.removeEventListener('scroll', handleScroll);
            }
        };
    }, []);

    return (
        <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 max-w-[430px] mx-auto shadow-[0_2px_16px_-4px_rgba(0,0,0,0.08)]">
            <div className="px-5 pt-3.5 pb-3 flex justify-between items-center relative z-20" style={{background: 'linear-gradient(135deg, #6B4F1E 0%, #A07830 60%, #C5A059 100%)'}}>
                <div className="flex flex-col">
                    <h1 className="text-[13px] font-black text-white tracking-tight leading-tight flex items-center gap-1">
                        {currentLang === 'am' ? (
                            <>
                                <span>ደሥ</span>
                                <span className="inline-block overflow-hidden" style={{ height: '1.2em' }}>
                                    <AnimatePresence mode="wait">
                                        <motion.span
                                            key={showAmharicNumeral ? 'am' : 'en'}
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                                            className="inline-block"
                                        >
                                            {showAmharicNumeral ? '፱' : '9'}
                                        </motion.span>
                                    </AnimatePresence>
                                </span>
                                <span>Restaurant N Lounge</span>
                            </>
                        ) : (
                            t.hotelNameSmall
                        )}
                    </h1>
                    <span className="text-[9px] text-white/70 font-semibold tracking-[0.18em] uppercase mt-0.5">
                        {t.roomMenu}
                    </span>
                </div>

                <div className="relative">
                    <button
                        onClick={() => setIsLangOpen(!isLangOpen)}
                        className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 px-2.5 py-1.5 rounded-lg transition-colors border border-white/25 backdrop-blur-sm"
                    >
                        <img
                            src={currentLanguageObj.flag}
                            alt={currentLanguageObj.name}
                            className="w-4 h-3 object-cover rounded-[1px] shadow-sm"
                        />
                        <span className="text-xs font-semibold text-white">{currentLanguageObj.code.toUpperCase()}</span>
                        <ChevronDown size={12} className={`text-white/70 transition-transform duration-200 ${isLangOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                        {isLangOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 5, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 5, scale: 0.95 }}
                                transition={{ duration: 0.1 }}
                                className="absolute right-0 top-full mt-2 w-40 bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden py-1.5 z-[100]"
                            >
                                {languages.map((lang) => (
                                    <button
                                        key={lang.code}
                                        onClick={() => {
                                            onLanguageChange(lang.code);
                                            setIsLangOpen(false);
                                        }}
                                        className={`w-full text-left px-3 py-2 text-xs font-medium hover:bg-gray-50 transition-colors flex items-center gap-3
                                            ${currentLang === lang.code ? 'text-hotel-green bg-green-50/50' : 'text-gray-600'}
                                        `}
                                    >
                                        <img
                                            src={lang.flag}
                                            alt={lang.name}
                                            className="w-5 h-3.5 object-cover rounded-[1px] shadow-sm"
                                        />
                                        <span className="flex-grow">{lang.name}</span>
                                        {currentLang === lang.code && (
                                            <div className="w-1.5 h-1.5 rounded-full bg-hotel-accent" />
                                        )}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <div className="relative pt-2 pb-3 z-10">
                {/* Left scroll indicator */}
                <AnimatePresence>
                    {showLeftIndicator && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="absolute left-0 top-3 bottom-0 w-10 bg-gradient-to-r from-white to-transparent z-10 flex items-center justify-start pl-1 pointer-events-none"
                        >
                            <ChevronLeft size={16} className="text-gray-400" />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Right scroll indicator */}
                <AnimatePresence>
                    {showRightIndicator && (
                        <motion.div
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="absolute right-0 top-3 bottom-0 w-10 bg-gradient-to-l from-white to-transparent z-10 flex items-center justify-end pr-1 pointer-events-none"
                        >
                            <ChevronRight size={16} className="text-gray-400" />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Scroll hint text */}
                <AnimatePresence>
                    {showScrollHint && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            style={{
                                backgroundColor: '#2D5A27',
                                color: '#ffffff',
                                zIndex: 100
                            }}
                            className="absolute top-0 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full shadow-lg whitespace-nowrap uppercase font-bold text-[10px] tracking-widest text-center"
                        >
                            {t.swipeHint}
                        </motion.div>
                    )}
                </AnimatePresence>

                <div
                    ref={scrollRef}
                    className="flex overflow-x-auto no-scrollbar px-3 space-x-1 scroll-smooth"
                >
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            ref={(el) => (buttonRefs.current[category.id] = el)}
                            onClick={() => onCategoryClick(category.id)}
                            className={`
                                flex-shrink-0 w-[88px] flex flex-col items-center gap-1.5 pt-1 pb-2.5 px-1 rounded-2xl transition-all duration-300
                                ${activeCategory === category.id
                                    ? 'bg-amber-50 scale-[1.02]'
                                    : 'opacity-65 hover:opacity-100 hover:bg-gray-50'
                                }
                            `}
                        >
                            <div className="w-[80px] h-[80px] rounded-2xl overflow-hidden shadow-sm transition-all duration-300">
                                <img
                                    src={category.categoryImage}
                                    alt={category.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <span className={`
                                text-[11px] font-bold text-center leading-tight transition-all duration-300 tracking-tight
                                ${activeCategory === category.id
                                    ? 'text-hotel-gold'
                                    : 'text-gray-500'
                                }
                            `}>
                                {category.title}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CategoryNav;
