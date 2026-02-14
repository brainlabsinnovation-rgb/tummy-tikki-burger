'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { RefreshCcw, Home, AlertCircle } from 'lucide-react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Application Error:', error);
    }, [error]);

    return (
        <div className="min-h-screen bg-white flex items-center justify-center px-4">
            <div className="max-w-2xl w-full text-center">
                <motion.div
                    initial={{ rotate: -10, scale: 0.8, opacity: 0 }}
                    animate={{ rotate: 0, scale: 1, opacity: 1 }}
                    className="mb-8 inline-block p-6 bg-red-50 rounded-[3rem]"
                >
                    <AlertCircle className="w-24 h-24 text-red-500" />
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                        Kitchen Overload! 👨‍🍳🔥
                    </h1>
                    <p className="text-lg text-gray-600 mb-4 max-w-md mx-auto">
                        Something went wrong while preparing your page. Don't worry, our chefs are on it!
                    </p>

                    {process.env.NODE_ENV === 'development' && (
                        <div className="mb-10 p-4 bg-gray-50 rounded-2xl border border-gray-100 text-left overflow-auto max-h-40">
                            <p className="text-xs font-mono text-red-600 break-all">{error.message}</p>
                            {error.digest && <p className="text-[10px] text-gray-400 mt-2 font-mono">ID: {error.digest}</p>}
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => reset()}
                            className="w-full sm:w-auto bg-gray-900 text-white px-8 py-4 rounded-full font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-gray-200"
                        >
                            <RefreshCcw className="w-4 h-4" />
                            Try Again
                        </motion.button>

                        <Link href="/" className="w-full sm:w-auto">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-full bg-white text-gray-900 px-8 py-4 rounded-full font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 border-2 border-gray-100 shadow-lg shadow-gray-100/50"
                            >
                                <Home className="w-4 h-4 text-orange-500" />
                                Back to Home
                            </motion.button>
                        </Link>
                    </div>
                </motion.div>

                <p className="mt-12 text-gray-400 text-xs font-bold uppercase tracking-widest">
                    If this persists, please contact our support at support@tummytikki.com
                </p>
            </div>
        </div>
    );
}
