'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Check, Loader2, FolderOpen, Power, PowerOff } from 'lucide-react';
import toast from 'react-hot-toast';

interface Category {
    id: string;
    name: string;
    slug: string;
}

export default function CategoryManager() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [newName, setNewName] = useState('');
    const [editName, setEditName] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/admin/categories');
            const data = await res.json();
            setCategories(data);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName.trim()) return;

        setActionLoading('add');
        try {
            const res = await fetch('/api/admin/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newName }),
            });
            const data = await res.json();
            if (res.ok) {
                setCategories([...categories, data]);
                setNewName('');
                setShowAddForm(false);
            } else {
                alert(data.error || 'Failed to add category');
            }
        } catch (error) {
            alert('Something went wrong');
        } finally {
            setActionLoading(null);
        }
    };

    const handleUpdate = async (id: string) => {
        if (!editName.trim()) return;

        setActionLoading(id);
        try {
            const res = await fetch('/api/admin/categories', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, name: editName }),
            });
            const data = await res.json();
            if (res.ok) {
                setCategories(categories.map(c => c.id === id ? data : c));
                setEditingId(null);
            } else {
                alert(data.error || 'Failed to update category');
            }
        } catch (error) {
            alert('Something went wrong');
        } finally {
            setActionLoading(null);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete "${name}"? This will only work if no menu items are assigned to it.`)) return;

        setActionLoading(id);
        try {
            const res = await fetch(`/api/admin/categories?id=${id}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if (res.ok) {
                setCategories(categories.filter(c => c.id !== id));
            } else {
                alert(data.error || 'Failed to delete category');
            }
        } catch (error) {
            alert('Something went wrong');
        } finally {
            setActionLoading(null);
        }
    };

    const handleToggleAvailability = async (categoryId: string, name: string, isAvailable: boolean) => {
        const action = isAvailable ? 'ENABLE' : 'DISABLE';
        if (!confirm(`Are you sure you want to ${action} all items in "${name}"?`)) return;

        setActionLoading(`toggle-${categoryId}`);
        try {
            const res = await fetch('/api/admin/categories/bulk-availability', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ categoryId, isAvailable }),
            });

            if (res.ok) {
                toast.success(`Success! All items in ${name} are now ${isAvailable ? 'available' : 'hidden'}.`, {
                    icon: isAvailable ? '✅' : '🚫',
                    style: {
                        borderRadius: '15px',
                        background: '#333',
                        color: '#fff',
                        fontWeight: 'bold'
                    },
                });
            } else {
                const data = await res.json();
                toast.error(data.error || 'Failed to update availability');
            }
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                    <FolderOpen className="w-5 h-5 text-orange-500" />
                    Menu Categories
                </h3>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-black transition-all"
                >
                    {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    {showAddForm ? 'Cancel' : 'Add Category'}
                </button>
            </div>

            {showAddForm && (
                <form onSubmit={handleAdd} className="bg-orange-50 p-6 rounded-2xl border border-orange-100 flex gap-4 animate-in slide-in-from-top duration-300">
                    <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="Category Name (e.g. Desserts)"
                        className="flex-1 px-4 py-2 rounded-xl border-2 border-orange-200 focus:border-orange-500 outline-none font-bold text-gray-900"
                        autoFocus
                    />
                    <button
                        type="submit"
                        disabled={actionLoading === 'add'}
                        className="px-6 py-2 bg-orange-500 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-orange-600 disabled:opacity-50 flex items-center gap-2"
                    >
                        {actionLoading === 'add' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                        Save
                    </button>
                </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category) => (
                    <div
                        key={category.id}
                        className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col gap-4 group"
                    >
                        {editingId === category.id ? (
                            <div className="flex items-center gap-2 w-full">
                                <input
                                    type="text"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    className="flex-1 px-3 py-1.5 rounded-lg border-2 border-orange-500 outline-none font-bold text-sm text-gray-900"
                                    autoFocus
                                />
                                <button
                                    onClick={() => handleUpdate(category.id)}
                                    className="p-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                >
                                    <Check className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setEditingId(null)}
                                    className="p-1.5 bg-gray-100 text-gray-500 rounded-lg hover:bg-gray-200"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-black text-gray-900">{category.name}</p>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">slug: {category.slug}</p>
                                    </div>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => {
                                                setEditingId(category.id);
                                                setEditName(category.name);
                                            }}
                                            className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-all"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(category.id, category.name)}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Bulk Action Buttons */}
                                <div className="flex gap-2 pt-2 border-t border-gray-50">
                                    <button
                                        onClick={() => handleToggleAvailability(category.id, category.name, true)}
                                        disabled={actionLoading === `toggle-${category.id}`}
                                        className="flex-1 py-2 bg-green-50 text-green-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-600 hover:text-white transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                                    >
                                        {actionLoading === `toggle-${category.id}` ? <Loader2 className="w-3 h-3 animate-spin" /> : <Power className="w-3 h-3" />}
                                        {actionLoading === `toggle-${category.id}` ? 'Updating' : 'Enable All'}
                                    </button>
                                    <button
                                        onClick={() => handleToggleAvailability(category.id, category.name, false)}
                                        disabled={actionLoading === `toggle-${category.id}`}
                                        className="flex-1 py-2 bg-red-50 text-red-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                                    >
                                        {actionLoading === `toggle-${category.id}` ? <Loader2 className="w-3 h-3 animate-spin" /> : <PowerOff className="w-3 h-3" />}
                                        {actionLoading === `toggle-${category.id}` ? 'Updating' : 'Disable All'}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>

            {categories.length === 0 && !loading && (
                <div className="text-center py-12 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No categories found.</p>
                </div>
            )}
        </div>
    );
}
