import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info } from 'lucide-react';

const FoodCard = memo(({ item, onClick }) => {
    return (
        <motion.div
            whileTap={{ scale: 0.98 }}
            onClick={() => onClick(item)}
            className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] border border-gray-100 flex p-2 gap-3 min-h-[90px] cursor-pointer active:bg-slate-50 transition-colors hover:shadow-md"
        >
            {/* Image on Left */}
            <div className="w-[76px] h-[76px] flex-shrink-0 rounded-[14px] overflow-hidden shadow-sm bg-slate-50 self-center">
                <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/images/des9-logo.jpg';
                    }}
                />
            </div>

            {/* Content on Right */}
            <div className="flex flex-col justify-center py-0.5 flex-1">
                <h3 className="text-[15px] font-extrabold text-hotel-dark leading-[1.15] mb-1">
                    {item.name}
                </h3>

                {item.price && (
                    <p className="text-hotel-green text-[13px] font-bold mb-1">
                        {item.price} ETB
                    </p>
                )}

                {item.description && (
                    <p className="text-slate-600 text-[11px] leading-[1.3] line-clamp-2 font-medium opacity-80">
                        {item.description}
                    </p>
                )}
            </div>
        </motion.div>
    );
});

FoodCard.displayName = 'FoodCard';

export default FoodCard;
