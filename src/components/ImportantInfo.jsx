import React from 'react';

import { uiTranslations } from '../data/uiTranslations';

const ImportantInfo = ({ currentLang = 'en' }) => {
    const t = uiTranslations[currentLang] || uiTranslations.en;

    return (
        <div className="px-6 py-4 bg-amber-50 border-l-4 border-hotel-gold mx-4 rounded-r-lg shadow-sm">
            <div className="space-y-3">
                <div>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                        {t.allergy}
                    </p>
                </div>

                <div className="pt-2 border-t border-amber-200">
                    <h4 className="text-sm font-bold text-hotel-dark">{t.hotelName}</h4>
                    <p className="text-xs text-slate-600">{t.location}</p>
                </div>

                <div className="pt-2 border-t border-amber-200 space-y-1">
                    <p className="text-[11px] text-slate-600 font-bold uppercase tracking-wider">
                        {t.taxInfo}
                    </p>
                    <p className="text-[11px] text-slate-600 font-bold uppercase tracking-wider">
                        {t.currencyInfo}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ImportantInfo;
