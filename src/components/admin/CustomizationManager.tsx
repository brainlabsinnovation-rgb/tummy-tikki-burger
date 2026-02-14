'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Settings2, Trash } from 'lucide-react';

interface Customization {
    id: string;
    name: string;
    price: number;
    type: 'extra' | 'removal' | 'choice';
    categoryId: string;
    isActive: boolean;
    Category?: { name: string };
}

interface Category {
    id: string;
    name: string;
}

export default function CustomizationManager() {
    const [customizations, setCustomizations] = useState<Customization[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<Customization>>({
        name: '',
        price: 0,
        type: 'extra',
        categoryId: '',
        isActive: true
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [custRes, catsRes] = await Promise.all([
                fetch('/api/admin/customizations'),
                fetch('/api/admin/categories')
            ]);

            const custData = await custRes.json();
            const catsData = await catsRes.json();

            setCustomizations(custData);
            setCategories(catsData);

            if (catsData.length > 0 && !formData.categoryId) {
                setFormData(prev => ({ ...prev, categoryId: catsData[0].id }));
            }
        } catch (error) {
            console.error('Error fetching customizations:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const method = isEditing === 'new' ? 'POST' : 'PATCH';
            const body = isEditing === 'new' ? formData : { ...formData, id: isEditing };

            const response = await fetch('/api/admin/customizations', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (!response.ok) throw new Error('Failed to save customization');

            await fetchData();
            setIsEditing(null);
            setFormData({
                name: '',
                price: 0,
                type: 'extra',
                categoryId: categories[0]?.id || '',
                isActive: true
            });
        } catch (error) {
            console.error('Error saving customization:', error);
            alert('Error saving customization');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this option?')) return;

        setLoading(true);
        try {
            const response = await fetch(`/api/admin/customizations?id=${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete customization');
            await fetchData();
        } catch (error) {
            console.error('Error deleting customization:', error);
            alert('Error deleting customization');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">Customization Engine</h2>
                    <p className="text-sm text-gray-500 font-medium">Manage add-ons, removals, and special requests per category</p>
                </div>
                <button
                    onClick={() => {
                        setIsEditing('new');
                        setFormData({
                            name: '',
                            price: 0,
                            type: 'extra',
                            categoryId: categories[0]?.id || '',
                            isActive: true
                        });
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-2xl font-black hover:bg-black transition-all shadow-xl active:scale-95 uppercase tracking-widest text-xs"
                >
                    <Plus className="w-4 h-4" />
                    New Option
                </button>
            </div>

            {isEditing && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20">
                        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gradient-to-br from-gray-50 to-white">
                            <div>
                                <h3 className="text-xl font-black text-gray-900 tracking-tight">
                                    {isEditing === 'new' ? '✨ Add New Option' : '📝 Update Option'}
                                </h3>
                                <p className="text-xs text-gray-400 font-black uppercase tracking-widest mt-1">Configure customization</p>
                            </div>
                            <button onClick={() => setIsEditing(null)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                                <X className="w-6 h-6 text-gray-400" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-1">Option Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-5 py-3 rounded-2xl border-2 border-gray-100 focus:border-orange-500 outline-none transition-all font-bold text-gray-900"
                                    placeholder="e.g. Extra Cheese"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-1">Price (₹)</label>
                                    <input
                                        type="number"
                                        required
                                        value={formData.price || ''}
                                        onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                                        className="w-full px-5 py-3 rounded-2xl border-2 border-gray-100 focus:border-orange-500 outline-none transition-all font-bold text-gray-900"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-1">Type</label>
                                    <select
                                        value={formData.type}
                                        onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                                        className="w-full px-5 py-3 rounded-2xl border-2 border-gray-100 focus:border-orange-500 outline-none transition-all font-bold text-gray-900 bg-white"
                                    >
                                        <option value="extra">Add-on</option>
                                        <option value="removal">Removal</option>
                                        <option value="choice">Choice</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-1">Category</label>
                                <select
                                    required
                                    value={formData.categoryId}
                                    onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                                    className="w-full px-5 py-3 rounded-2xl border-2 border-gray-100 focus:border-orange-500 outline-none transition-all font-bold text-gray-900 bg-white"
                                >
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-orange-500 hover:bg-orange-600 h-14 rounded-2xl text-white font-black shadow-xl shadow-orange-100 transition-all uppercase tracking-widest text-xs"
                            >
                                <Save className="w-4 h-4 inline-block mr-2" />
                                Save Configuration
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map(cat => {
                    const catOptions = customizations.filter(c => c.categoryId === cat.id);
                    if (catOptions.length === 0) return null;

                    return (
                        <div key={cat.id} className="bg-gray-50/50 rounded-[2rem] p-6 border border-gray-100">
                            <h3 className="text-sm font-black text-orange-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                <Settings2 className="w-4 h-4" />
                                {cat.name} Options
                            </h3>
                            <div className="space-y-3">
                                {catOptions.map(option => (
                                    <div key={option.id} className="group flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-transparent hover:border-orange-200 transition-all">
                                        <div className="flex-1">
                                            <p className="font-bold text-gray-900 text-sm">{option.name}</p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest ${option.type === 'extra' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-500'
                                                    }`}>
                                                    {option.type}
                                                </span>
                                                <span className="text-[10px] font-bold text-gray-400">₹{option.price}</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => {
                                                    setIsEditing(option.id);
                                                    setFormData(option);
                                                }}
                                                className="p-2 hover:bg-orange-50 text-gray-400 hover:text-orange-500 rounded-lg transition-colors"
                                            >
                                                <Edit2 className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(option.id)}
                                                className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}

                {/* Categories with no options */}
                <div className="md:col-span-full border-t border-dashed border-gray-200 pt-8 mt-4">
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] text-center">
                        Total {customizations.length} Global Options Configured
                    </p>
                </div>
            </div>
        </div>
    );
}
