'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Upload, Check, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Category {
    id: string;
    name: string;
    slug: string;
}

interface MenuItem {
    id: string;
    name: string;
    description: string;
    price: number;
    categoryId: string;
    image: string;
    isVeg: boolean;
    isAvailable: boolean;
    Category?: Category;
}

export default function MenuManager() {
    const [items, setItems] = useState<MenuItem[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState<string | null>(null); // 'new' or Item ID
    const [formData, setFormData] = useState<Partial<MenuItem>>({
        name: '',
        description: '',
        price: 0,
        categoryId: '',
        isVeg: true,
        isAvailable: true,
        image: '',
    });
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [itemsRes, catsRes] = await Promise.all([
                fetch('/api/admin/menu'),
                fetch('/api/admin/categories')
            ]);

            const itemsData = await itemsRes.json();
            const catsData = await catsRes.json();

            setItems(itemsData);
            setCategories(catsData);

            if (catsData.length > 0 && !formData.categoryId) {
                setFormData(prev => ({ ...prev, categoryId: catsData[0].id }));
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const uploadData = new FormData();
            uploadData.append('file', file);

            const response = await fetch('/api/admin/upload', {
                method: 'POST',
                body: uploadData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Upload failed');
            }

            const { url } = await response.json();
            setFormData(prev => ({ ...prev, image: url }));

            // Helpful log for debugging
            console.log('Image uploaded successfully:', url);
        } catch (error: any) {
            console.error('Error uploading image:', error);
            alert(`Error uploading image: ${error.message}`);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const method = isEditing === 'new' ? 'POST' : 'PATCH';
            const body = isEditing === 'new' ? formData : { ...formData, id: isEditing };

            const response = await fetch('/api/admin/menu', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (!response.ok) throw new Error('Failed to save item');

            await fetchData();
            setIsEditing(null);
            setFormData({
                name: '',
                description: '',
                price: 0,
                categoryId: categories[0]?.id || '',
                isVeg: true,
                isAvailable: true,
                image: '',
            });
        } catch (error) {
            console.error('Error saving item:', error);
            alert('Error saving item');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this item?')) return;

        setLoading(true);
        try {
            const response = await fetch(`/api/admin/menu?id=${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete item');
            await fetchData();
        } catch (error) {
            console.error('Error deleting item:', error);
            alert('Error deleting item');
        } finally {
            setLoading(false);
        }
    };

    const startEdit = (item: MenuItem) => {
        setIsEditing(item.id);
        setFormData(item);
    };

    if (loading && items.length === 0) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Menu Items</h2>
                <button
                    onClick={() => {
                        setIsEditing('new');
                        setFormData({
                            name: '',
                            description: '',
                            price: 0,
                            categoryId: categories[0]?.id || '',
                            isVeg: true,
                            isAvailable: true,
                            image: '',
                        });
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg font-bold hover:bg-orange-600 transition-colors shadow-lg shadow-orange-100"
                >
                    <Plus className="w-5 h-5" />
                    Add New Item
                </button>
            </div>

            {isEditing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div
                        className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300 border border-white/20"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md px-8 py-6 border-b border-gray-100 flex justify-between items-center">
                            <div>
                                <h3 className="text-2xl font-black text-gray-900 tracking-tight">
                                    {isEditing === 'new' ? '✨ Create New Product' : '📝 Update Product'}
                                </h3>
                                <p className="text-gray-500 text-sm font-medium">Fine-tune your menu item details below</p>
                            </div>
                            <button
                                onClick={() => setIsEditing(null)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors group"
                            >
                                <X className="w-6 h-6 text-gray-400 group-hover:text-gray-600" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-800 mb-2 px-1 text-left">Item Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-5 py-3 rounded-2xl border-2 border-gray-100 focus:border-orange-500 focus:ring-0 outline-none transition-all text-gray-900 font-medium placeholder:text-gray-300"
                                        placeholder="Enter dish name..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-800 mb-2 px-1 text-left">Description</label>
                                    <textarea
                                        rows={4}
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-5 py-3 rounded-2xl border-2 border-gray-100 focus:border-orange-500 focus:ring-0 outline-none transition-all text-gray-900 font-medium placeholder:text-gray-300 resize-none"
                                        placeholder="Describe the flavors..."
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-800 mb-2 px-1 text-left">Price (₹)</label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                required
                                                value={formData.price || ''}
                                                onChange={e => {
                                                    const val = e.target.value;
                                                    setFormData({ ...formData, price: val === '' ? 0 : parseFloat(val) });
                                                }}
                                                className="w-full pl-10 pr-5 py-3 rounded-2xl border-2 border-gray-100 focus:border-orange-500 focus:ring-0 outline-none transition-all text-gray-900 font-bold"
                                            />
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-800 mb-2 px-1 text-left">Category</label>
                                        <select
                                            required
                                            value={formData.categoryId}
                                            onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                                            className="w-full px-5 py-3 rounded-2xl border-2 border-gray-100 focus:border-orange-500 focus:ring-0 outline-none transition-all text-gray-900 font-bold appearance-none bg-white cursor-pointer"
                                        >
                                            {categories.map(cat => (
                                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-800 mb-2 px-1 text-left">Product Image</label>
                                    <div className="group relative w-full aspect-[4/3] rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center bg-gray-50 overflow-hidden transition-all hover:border-orange-500 hover:bg-orange-50/30">
                                        {formData.image ? (
                                            <>
                                                <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-[2px]">
                                                    <label className="cursor-pointer bg-white text-gray-900 px-6 py-2.5 rounded-xl font-black text-sm shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-all active:scale-95">
                                                        CHANGE PHOTO
                                                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                                    </label>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                {uploading ? (
                                                    <div className="flex flex-col items-center gap-3">
                                                        <div className="animate-spin rounded-full h-10 w-10 border-4 border-orange-100 border-t-orange-500"></div>
                                                        <p className="text-orange-500 font-bold text-xs animate-pulse">UPLOADING...</p>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center text-center px-6">
                                                        <div className="p-4 bg-white rounded-2xl shadow-sm mb-3 group-hover:scale-110 transition-transform">
                                                            <Upload className="w-8 h-8 text-orange-500" />
                                                        </div>
                                                        <p className="text-sm font-bold text-gray-900 mb-1">Upload Image</p>
                                                        <p className="text-xs text-gray-400 leading-relaxed font-medium">Click to browse or drag and drop<br />highly recommended for sales</p>
                                                    </div>
                                                )}
                                                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={handleImageUpload} />
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-8 justify-center p-5 bg-gray-50 rounded-2xl border border-gray-100">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className="relative">
                                            <input
                                                type="checkbox"
                                                className="sr-only"
                                                checked={formData.isVeg}
                                                onChange={e => setFormData({ ...formData, isVeg: e.target.checked })}
                                            />
                                            <div className={`w-12 h-6 rounded-full transition-all duration-300 ${formData.isVeg ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                            <div className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${formData.isVeg ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                        </div>
                                        <span className={`text-sm font-black transition-colors ${formData.isVeg ? 'text-green-600' : 'text-gray-500'}`}>VEG ONLY</span>
                                    </label>

                                    <div className="w-[2px] h-8 bg-gray-200"></div>

                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className="relative">
                                            <input
                                                type="checkbox"
                                                className="sr-only"
                                                checked={formData.isAvailable}
                                                onChange={e => setFormData({ ...formData, isAvailable: e.target.checked })}
                                            />
                                            <div className={`w-12 h-6 rounded-full transition-all duration-300 ${formData.isAvailable ? 'bg-orange-500' : 'bg-gray-300'}`}></div>
                                            <div className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${formData.isAvailable ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                        </div>
                                        <span className={`text-sm font-black transition-colors ${formData.isAvailable ? 'text-orange-600' : 'text-gray-500'}`}>IN STOCK</span>
                                    </label>
                                </div>
                            </div>

                            <div className="md:col-span-2 flex items-center justify-between gap-4 pt-6 mt-2 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(null)}
                                    className="px-8 py-4 rounded-2xl font-black text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all uppercase tracking-widest text-xs"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex items-center gap-3 px-12 py-4 bg-gray-900 text-white rounded-2xl font-black hover:bg-black transition-all shadow-xl hover:shadow-gray-200 active:scale-95 uppercase tracking-widest text-xs"
                                >
                                    <Save className="w-5 h-5" />
                                    Save Product
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {items.map((item) => (
                    <div key={item.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden relative group">
                        {!item.isAvailable && (
                            <div className="absolute top-5 left-5 z-10 bg-black/80 backdrop-blur-md text-white px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl">
                                SOLDOUT
                            </div>
                        )}
                        <div className="aspect-[16/10] w-full bg-gray-50 overflow-hidden relative">
                            {item.image && item.image.trim() !== '' ? (
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    key={`${item.id}-${item.image}`}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800'; // Global fallback
                                    }}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-orange-50/30">
                                    <AlertCircle className="w-10 h-10 text-orange-200" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                        <div className="p-6">
                            <div className="flex justify-between items-start gap-4 mb-3">
                                <div className="flex-1">
                                    <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em] mb-1">{item.Category?.name}</p>
                                    <h4 className="font-bold text-gray-900 text-xl leading-tight group-hover:text-orange-500 transition-colors">{item.name}</h4>
                                </div>
                                <div className="bg-gray-900 text-white px-4 py-2 rounded-2xl font-black text-lg shadow-lg">
                                    ₹{item.price}
                                </div>
                            </div>
                            <p className="text-sm text-gray-500 font-medium leading-relaxed line-clamp-2 mb-6 h-10">{item.description}</p>

                            <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                                <div className={`flex items-center gap-2 px-3 py-1 rounded-lg ${item.isVeg ? 'bg-green-50' : 'bg-red-50'}`}>
                                    <div className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                    <span className={`text-[10px] font-black uppercase tracking-wider ${item.isVeg ? 'text-green-600' : 'text-red-600'}`}>
                                        {item.isVeg ? 'VEG' : 'NON-VEG'}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => startEdit(item)}
                                        className="p-3 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-2xl transition-all duration-300 shadow-sm"
                                        title="Edit Item"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="p-3 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-2xl transition-all duration-300 shadow-sm"
                                        title="Delete Item"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
