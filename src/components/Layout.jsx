import React from 'react';
import { Analytics } from "@vercel/analytics/react";

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-slate-50 flex justify-center py-4 md:py-10">
            {/* 
        Constraints for mobile-only feel:
        - max-w-[430px] for smartphone width
        - shadow-xl to give it a "contained" look on larger screens
        - rounded-[3rem] to match the high-end feel in the mockup
      */}
            <div className="w-full max-w-[430px] bg-white min-h-[90vh] shadow-[0_20px_50px_rgba(0,0,0,0.05)] relative flex flex-col rounded-t-[3rem] overflow-hidden border border-gray-100">
                {children}
                <Analytics />
            </div>
        </div>
    );
};

export default Layout;
