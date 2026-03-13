import React from 'react';
import { motion } from 'framer-motion';

import { uiTranslations } from '../data/uiTranslations';

const Header = ({ currentLang = 'en' }) => {
    const t = uiTranslations[currentLang] || uiTranslations.en;
    const text = t.welcome;

    const container = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08
            }
        }
    };

    const child = {
        hidden: { opacity: 0, y: 10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100
            }
        }
    };

    return (
        <header className="px-5 pt-6 pb-0">
            <motion.h1
                className="text-[1.65rem] font-black text-slate-800 tracking-tighter flex flex-wrap leading-tight"
                variants={container}
                initial="hidden"
                animate="visible"
                key={currentLang} // Re-animate on language change
            >
                {text.split("").map((letter, index) => (
                    <motion.span variants={child} key={index}>
                        {letter === " " ? "\u00A0" : letter}
                    </motion.span>
                ))}
            </motion.h1>
            <motion.p
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="text-slate-500 text-[13px] mt-0.5 leading-snug"
            >
                {t.hotelSubtitle}
            </motion.p>
        </header>
    );
};

export default Header;
