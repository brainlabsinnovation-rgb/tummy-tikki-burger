'use client';

import Link from 'next/link';
import { ChevronLeft, Utensils, FolderOpen } from 'lucide-react';
import { useState } from 'react';
import MenuManager from '@/components/admin/MenuManager';
import CategoryManager from '@/components/admin/CategoryManager';

export default function AdminMenuPage() {
    const [activeTab, setActiveTab] = useState<'menu' | 'categories'>('menu');

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-12">
                <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <Link
                        href="/admin/dashboard"
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors font-bold group"
                    >
                        <div className="p-2 bg-white rounded-xl shadow-sm group-hover:bg-gray-100 transition-all">
                            <ChevronLeft className="w-5 h-5 text-gray-400 group-hover:text-gray-900" />
                        </div>
                        Back to Dashboard
                    </Link>
                    <div className="md:text-right">
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">System Management</h1>
                        <p className="text-gray-500 text-sm font-medium">Control your menu items and categories</p>
                    </div>
                </div>

                <div className="mb-8 flex gap-2 p-1 bg-gray-200/50 rounded-2xl w-fit">
                    <button
                        onClick={() => setActiveTab('menu')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'menu'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <Utensils className={`w-4 h-4 ${activeTab === 'menu' ? 'text-orange-500' : 'text-gray-400'}`} />
                        Menu Items
                    </button>
                    <button
                        onClick={() => setActiveTab('categories')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'categories'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <FolderOpen className={`w-4 h-4 ${activeTab === 'categories' ? 'text-orange-500' : 'text-gray-400'}`} />
                        Categories
                    </button>
                </div>

                <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 p-8 md:p-12 border border-white relative overflow-hidden">
                    {/* Decorative Background */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-full blur-3xl opacity-50 -mr-32 -mt-32 pointer-events-none" />

                    <div className="relative z-10">
                        {activeTab === 'menu' ? <MenuManager /> : <CategoryManager />}
                    </div>
                </div>
            </div>
        </div>
    );
}
