'use client';

import { motion } from 'framer-motion';
import { TrendingUp, ArrowUpRight } from 'lucide-react';

interface SalesData {
    day: string;
    total: number;
}

interface SalesChartProps {
    data: SalesData[];
}

export default function SalesChart({ data }: SalesChartProps) {
    const maxSales = Math.max(...data.map(d => d.total), 1);
    const totalWeekSales = data.reduce((acc, curr) => acc + curr.total, 0);

    return (
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-100/50">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-xl font-black text-gray-900 flex items-center gap-2 uppercase tracking-tight">
                        <TrendingUp className="w-5 h-5 text-orange-500" />
                        Weekly Performance
                    </h3>
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-1">Last 7 Days Revenue</p>
                </div>
                <div className="text-right">
                    <div className="flex items-center gap-1 text-green-500 font-black text-sm">
                        <ArrowUpRight className="w-4 h-4" />
                        Live
                    </div>
                    <p className="text-lg font-black text-gray-900 mt-1">₹{totalWeekSales}</p>
                </div>
            </div>

            <div className="flex items-end justify-between h-48 gap-4 mt-12 mb-6">
                {data.map((day, idx) => {
                    const heightPercentage = (day.total / maxSales) * 100;

                    return (
                        <div key={day.day} className="flex-1 flex flex-col items-center gap-4 group">
                            <div className="relative w-full flex justify-center items-end h-full">
                                {/* Tooltip */}
                                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100 pointer-events-none z-20">
                                    <div className="bg-gray-900 text-white text-[10px] font-black px-3 py-1.5 rounded-lg whitespace-nowrap shadow-xl uppercase tracking-tighter">
                                        ₹{day.total}
                                    </div>
                                    <div className="w-2 h-2 bg-gray-900 rotate-45 mx-auto -mt-1" />
                                </div>

                                {/* Bar */}
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${heightPercentage}%` }}
                                    transition={{ duration: 1, delay: idx * 0.1, ease: "circOut" }}
                                    className="w-full max-w-[40px] bg-gradient-to-t from-orange-400 to-orange-600 rounded-t-xl group-hover:from-gray-800 group-hover:to-gray-900 transition-colors duration-300 shadow-lg shadow-orange-100 group-hover:shadow-gray-200"
                                />
                            </div>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{day.day}</span>
                        </div>
                    );
                })}
            </div>

            {/* X-Axis Indicator */}
            <div className="h-0.5 w-full bg-gray-50 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="h-full bg-gradient-to-r from-orange-200 via-orange-400 to-orange-200"
                />
            </div>
        </div>
    );
}
