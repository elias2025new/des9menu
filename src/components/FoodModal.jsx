import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const FoodModal = React.memo(({ item, onClose }) => {
    useEffect(() => {
        if (item) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [item]);

    if (!item) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md will-change-[opacity,backdrop-filter]"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white rounded-[32px] overflow-hidden shadow-2xl max-w-sm w-full relative max-h-[90vh] overflow-y-auto no-scrollbar will-change-transform"
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-20 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg text-hotel-dark hover:bg-white transition-colors"
                    >
                        <X size={20} />
                    </button>

                    {/* Image Header */}
                    <div className="w-full h-56 relative bg-slate-100 overflow-hidden">
                        <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/images/placeholder.jpg';
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        <div className="flex justify-between items-start mb-3">
                            <h2 className="text-xl font-black text-hotel-dark leading-tight">
                                {item.name}
                            </h2>
                            {item.price && (
                                <p className="text-hotel-green text-lg font-black whitespace-nowrap ml-4">
                                    {item.price} <span className="text-xs">ETB</span>
                                </p>
                            )}
                        </div>

                        {item.description && (
                            <p className="text-slate-600 text-sm leading-relaxed font-medium">
                                {item.description}
                            </p>
                        )}

                        <div className="mt-6 pt-4 border-t border-slate-100 italic text-[11px] text-slate-400 text-center space-y-2">
                            <p>Prices include taxes and service charge</p>
                            <p className="text-[9px] bg-red-50 text-red-400/80 py-1.5 px-3 rounded-lg border border-red-100/50 leading-tight">
                                Note: Pictures are for illustrative purposes and may vary from the actual dish.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
});

FoodModal.displayName = 'FoodModal';

export default FoodModal;
