'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Utensils } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-orange-50 flex items-center justify-center px-4 overflow-hidden relative">
            {/* Background Decorative Elements */}
            <div className="absolute top-10 left-10 text-9xl opacity-10 select-none pointer-events-none rotate-12">🍔</div>
            <div className="absolute bottom-10 right-10 text-9xl opacity-10 select-none pointer-events-none -rotate-12">🍟</div>
            <div className="absolute top-1/2 right-20 text-8xl opacity-10 select-none pointer-events-none rotate-45">🥤</div>

            <div className="max-w-2xl w-full text-center relative z-10">
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="mb-8"
                >
                    <div className="text-[120px] md:text-[180px] font-black text-orange-500 leading-none drop-shadow-2xl">
                        404
                    </div>
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                        Oops! This Burger Got Away! 🏃‍♂️🍔
                    </h1>
                    <p className="text-lg text-gray-600 mb-10 max-w-md mx-auto leading-relaxed">
                        The page you're looking for seems to have been eaten or never existed. Don't worry, there's plenty more in the kitchen!
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/" className="w-full sm:w-auto">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-full bg-orange-500 text-white px-8 py-4 rounded-full font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-orange-200"
                            >
                                <Home className="w-4 h-4" />
                                Back to Home
                            </motion.button>
                        </Link>
                        <Link href="/#menu" className="w-full sm:w-auto">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-full bg-white text-gray-900 px-8 py-4 rounded-full font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 border-2 border-gray-100 shadow-xl shadow-gray-100/50"
                            >
                                <Utensils className="w-4 h-4 text-orange-500" />
                                View Menu
                            </motion.button>
                        </Link>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-16"
                >
                    <button
                        onClick={() => window.history.back()}
                        className="text-gray-400 hover:text-orange-500 font-bold text-xs uppercase tracking-widest flex items-center gap-2 mx-auto transition-colors"
                    >
                        <ArrowLeft className="w-3 h-3" />
                        Go Back To Previous Page
                    </button>
                </motion.div>
            </div>
        </div>
    );
}
