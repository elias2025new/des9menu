import React from 'react';
import { AlertCircle, WifiOff, RefreshCw } from 'lucide-react';

const ErrorPage = () => {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-[#3c4043] font-sans">
            <div className="max-w-[500px] w-full">
                <div className="mb-8">
                    <WifiOff size={48} className="text-[#5f6368] mb-6" />
                    <h1 className="text-[22px] font-normal leading-[1.3] mb-4">
                        This site can’t be reached
                    </h1>
                    <p className="text-sm leading-[1.6] mb-1">
                        <strong className="font-medium text-black">www.des9restaurant.net</strong>’s server IP address could not be found.
                    </p>
                </div>

                <div className="border-t border-[#dadce0] pt-6 space-y-4">
                    <p className="text-sm">Try:</p>
                    <ul className="list-disc ml-5 text-sm space-y-2">
                        <li>Checking the connection</li>
                        <li>Checking the proxy, firewall, and DNS configuration</li>
                    </ul>
                </div>

                <div className="mt-10 flex flex-col gap-4">
                    <button
                        onClick={() => window.location.reload()}
                        className="w-fit bg-[#1a73e8] hover:bg-[#185abc] text-white text-sm font-medium px-6 py-2 rounded transition-colors"
                    >
                        Reload
                    </button>

                    <div className="text-[11px] text-[#70757a] uppercase tracking-wider mt-4">
                        ERR_NAME_NOT_RESOLVED
                    </div>
                </div>
            </div>

            <div className="fixed bottom-6 left-6 text-[10px] text-slate-300 pointer-events-none select-none">
                Admin note: Redirect mode is ACTIVE.
            </div>
        </div>
    );
};

export default ErrorPage;
