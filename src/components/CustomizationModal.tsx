'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Minus, Check } from 'lucide-react'
import { CustomizationOption } from '@/lib/customizations'
import { Button } from './ui/button'

interface CustomizationModalProps {
    isOpen: boolean
    onCloseAction: () => void
    onConfirmAction: (selected: CustomizationOption[]) => void
    item: {
        name: string
        price: number
    }
    options: CustomizationOption[]
}

export default function CustomizationModal({
    isOpen,
    onCloseAction,
    onConfirmAction,
    item,
    options
}: CustomizationModalProps) {
    const [selectedIds, setSelectedIds] = useState<string[]>([])
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    const toggleOption = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        )
    }

    const currentTotal = item.price + options
        .filter(o => selectedIds.includes(o.id))
        .reduce((acc, o) => acc + o.price, 0)

    const handleConfirm = () => {
        const selectedOptions = options.filter(o => selectedIds.includes(o.id))
        onConfirmAction(selectedOptions)
        onCloseAction()
    }

    if (!mounted) return null

    const modalContent = (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onCloseAction}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-lg mx-4 bg-white rounded-[2.5rem] shadow-2xl overflow-hidden pointer-events-auto"
                    >
                        {/* Header */}
                        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gradient-to-br from-orange-50 to-white">
                            <div>
                                <h3 className="text-2xl font-black text-gray-900 tracking-tight">Customize Your {item.name}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                                    <p className="text-sm text-orange-600 font-bold uppercase tracking-wider">Make it yours!</p>
                                </div>
                            </div>
                            <button
                                onClick={onCloseAction}
                                className="p-3 hover:bg-white rounded-2xl transition-all shadow-sm hover:shadow-md active:scale-95 bg-gray-50 text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Options List */}
                        <div className="p-8 space-y-4 max-h-[50vh] overflow-y-auto scrollbar-hide">
                            {options.map((option) => (
                                <motion.div
                                    key={option.id}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => toggleOption(option.id)}
                                    className={`flex items-center justify-between p-5 rounded-3xl border-2 transition-all cursor-pointer group ${selectedIds.includes(option.id)
                                        ? 'border-orange-500 bg-orange-50/50 shadow-inner'
                                        : 'border-gray-100 hover:border-orange-200 hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-all duration-300 ${selectedIds.includes(option.id)
                                            ? 'bg-orange-500 border-orange-500 rotate-0'
                                            : 'border-gray-200 rotate-45 group-hover:rotate-0'
                                            }`}>
                                            {selectedIds.includes(option.id) && <Check className="w-4 h-4 text-white" />}
                                        </div>
                                        <div>
                                            <p className="font-extrabold text-gray-900 text-lg leading-tight">{option.name}</p>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                                                {option.type === 'extra' ? 'Premium Add-on' : 'Special Request'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="bg-white px-3 py-1.5 rounded-xl border border-gray-100 shadow-sm">
                                        <span className="font-black text-orange-600">
                                            {option.price > 0 ? `+₹${option.price}` : 'FREE'}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="p-8 bg-gray-50/50 border-t border-gray-100">
                            <div className="flex justify-between items-end mb-6">
                                <div>
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Final Amount</p>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-3xl font-black text-gray-900">₹{currentTotal}</span>
                                        <span className="text-sm font-bold text-gray-400">inc. extras</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Ready to cook!</p>
                                </div>
                            </div>
                            <Button
                                onClick={handleConfirm}
                                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 h-16 rounded-[1.5rem] text-xl font-black text-white shadow-xl shadow-orange-200/50 transition-all hover:-translate-y-1 active:translate-y-0"
                            >
                                Confirm & Add to Cart
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )

    return createPortal(modalContent, document.body)
}
