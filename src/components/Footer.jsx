import React from 'react';

import { uiTranslations } from '../data/uiTranslations';

import { Phone, MapPin, Globe, Instagram, Send, Music2, Facebook } from 'lucide-react';

const Footer = ({ currentLang = 'en' }) => {
    const t = uiTranslations[currentLang] || uiTranslations.en;

    const socialLinks = [
        {
            name: 'Facebook',
            icon: <Facebook size={20} />,
            url: 'https://www.facebook.com/swissinnnexusaddisababa',
            color: 'text-white',
            bg: 'bg-[#1877F2]'
        },
        {
            name: 'Instagram',
            icon: <Instagram size={20} />,
            url: 'https://www.instagram.com/swissinnnexus/',
            color: 'text-white',
            bg: 'bg-gradient-to-tr from-[#FFB400] via-[#FF0000] to-[#D300C5]'
        },
        {
            name: 'TikTok',
            icon: <Music2 size={20} />,
            url: 'https://www.tiktok.com/@swiss_inn_nexus_hotel',
            color: 'text-white',
            bg: 'bg-black'
        },
        {
            name: 'Telegram',
            icon: <Send size={20} />,
            url: 'https://t.me/swissinnnexus',
            color: 'text-white',
            bg: 'bg-[#229ED9]'
        }
    ];

    return (
        <footer id="footer-contact" className="bg-hotel-maroon mt-auto w-full shadow-[0_-10px_40px_rgba(128,0,0,0.1)]">
            <div className="max-w-[430px] mx-auto px-6 py-5 space-y-4">
                {/* Contact Section */}
                <div className="space-y-4">
                    <h3 className="text-xs font-black text-white/50 uppercase tracking-[0.2em] text-center">
                        {t.contactUs}
                    </h3>

                    <div className="space-y-3">
                        {/* Phone */}
                        <div className="flex items-center gap-4 group">
                            <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-white/70 border border-white/10">
                                <Phone size={18} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">{t.phone}</span>
                                <span className="text-sm font-bold text-white tracking-tight">Addis Ababa, Ethiopia</span>
                            </div>
                        </div>

                        {/* Location */}
                        <div className="flex items-center gap-4">
                            <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-white/70 border border-white/10">
                                <MapPin size={18} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">{t.locationLabel}</span>
                                <span className="text-sm font-bold text-white tracking-tight">{t.location}</span>
                            </div>
                        </div>

                        {/* Website */}
                        <a
                            href="#"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-4 group"
                        >
                            <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-white/70 group-hover:bg-white/20 group-hover:text-white transition-all duration-300 border border-white/10">
                                <Globe size={18} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">{t.website}</span>
                                <span className="text-sm font-bold text-white tracking-tight lowercase">#</span>
                            </div>
                        </a>
                    </div>
                </div>

                {/* Social Media */}
                <div className="space-y-4 pt-2">
                    <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] block text-center">
                        {t.followUs}
                    </span>
                    <div className="flex justify-center gap-4">
                        {socialLinks.map((social) => (
                            <a
                                key={social.name}
                                href={social.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`w-10 h-10 rounded-2xl ${social.bg} ${social.color} flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all duration-300 border border-white/10`}
                                title={social.name}
                            >
                                {social.icon}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Info Section */}
                <div className="pt-6 border-t border-white/10 flex flex-col items-center space-y-3">

                    <div className="mt-4 opacity-40">
                        <h4 className="text-[10px] font-black text-white uppercase tracking-tighter">
                            DES 9 RESTAURANT & LOUNGE
                        </h4>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
