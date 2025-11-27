
import React from 'react';

// Enhanced shimmer animation with gradient effect
const shimmerClasses = "animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%]";

export const ShimmerTableRows = ({ count = 6 }: { count?: number }) => {
    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <tr key={i} className="hover:bg-gray-50">
                    {/* Checkbox cell */}
                    <td className="px-4 py-4">
                        <div className={`h-4 w-4 rounded ${shimmerClasses}`} />
                    </td>
                    
                    {/* Agent cell - Avatar + Name + ID */}
                    <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full ${shimmerClasses}`} />
                            <div className="flex-1">
                                <div className={`h-4 w-32 rounded mb-2 ${shimmerClasses}`} />
                                <div className={`h-3 w-20 rounded ${shimmerClasses}`} />
                            </div>
                        </div>
                    </td>
                    
                    {/* Role cell */}
                    <td className="px-4 py-4">
                        <div className={`h-4 w-24 rounded ${shimmerClasses}`} />
                    </td>
                    
                    {/* Contact cell - Email + Phone */}
                    <td className="px-4 py-4">
                        <div className="space-y-2">
                            <div className={`h-3 w-40 rounded ${shimmerClasses}`} />
                            <div className={`h-3 w-32 rounded ${shimmerClasses}`} />
                        </div>
                    </td>
                    
                    {/* Team cell */}
                    <td className="px-4 py-4">
                        <div className={`h-4 w-28 rounded ${shimmerClasses}`} />
                    </td>
                    
                    {/* Status cell - Badge shape */}
                    <td className="px-4 py-4">
                        <div className={`h-7 w-20 rounded-full ${shimmerClasses}`} />
                    </td>
                    
                    {/* Tickets Closed cell - Number + Label */}
                    <td className="px-4 py-4">
                        <div className={`h-5 w-8 rounded mb-1 ${shimmerClasses}`} />
                        <div className={`h-3 w-12 rounded ${shimmerClasses}`} />
                    </td>
                    
                    {/* Avg. Response cell */}
                    <td className="px-4 py-4">
                        <div className={`h-4 w-16 rounded ${shimmerClasses}`} />
                    </td>
                    
                    {/* Score cell - Progress bar + Percentage */}
                    <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                            <div className={`w-full h-2 rounded-full ${shimmerClasses}`} />
                            <div className={`h-4 w-10 rounded ${shimmerClasses}`} />
                        </div>
                    </td>
                </tr>
            ))}
        </>
    );
};

export const ShimmerGridCards = ({ count = 6 }: { count?: number }) => {
    return (
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: count }).map((_, i) => (
                <div 
                    key={i} 
                    className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm"
                >
                    {/* Header: Avatar + Status Badge */}
                    <div className="flex items-center justify-between mb-4">
                        <div className={`w-14 h-14 rounded-full ${shimmerClasses}`} />
                        <div className={`h-6 w-20 rounded-full ${shimmerClasses}`} />
                    </div>

                    {/* Name */}
                    <div className={`h-5 w-3/4 rounded mb-1 ${shimmerClasses}`} />
                    
                    {/* Role / Team */}
                    <div className={`h-4 w-1/2 rounded mb-4 ${shimmerClasses}`} />

                    {/* Contact Info - 3 rows */}
                    <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2">
                            <div className={`h-4 w-4 rounded ${shimmerClasses}`} />
                            <div className={`h-3 w-full rounded ${shimmerClasses}`} />
                        </div>
                        <div className="flex items-center gap-2">
                            <div className={`h-4 w-4 rounded ${shimmerClasses}`} />
                            <div className={`h-3 w-3/4 rounded ${shimmerClasses}`} />
                        </div>
                        <div className="flex items-center gap-2">
                            <div className={`h-4 w-4 rounded ${shimmerClasses}`} />
                            <div className={`h-3 w-2/3 rounded ${shimmerClasses}`} />
                        </div>
                    </div>

                    {/* Stats Grid - 3 columns */}
                    <div className="pt-4 border-t border-gray-200 grid grid-cols-3 gap-2 text-center">
                        <div>
                            <div className={`h-5 w-8 rounded mx-auto mb-1 ${shimmerClasses}`} />
                            <div className={`h-3 w-12 rounded mx-auto ${shimmerClasses}`} />
                        </div>
                        <div>
                            <div className={`h-5 w-10 rounded mx-auto mb-1 ${shimmerClasses}`} />
                            <div className={`h-3 w-10 rounded mx-auto ${shimmerClasses}`} />
                        </div>
                        <div>
                            <div className={`h-5 w-8 rounded mx-auto mb-1 ${shimmerClasses}`} />
                            <div className={`h-3 w-14 rounded mx-auto ${shimmerClasses}`} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
