'use client'

import { useToast } from '@/contexts/ToastContext'

export default function ToastContainer() {
    const { toasts, removeToast } = useToast()

    return (
        <div className="fixed bottom-4 right-4 z-50 space-y-2">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`px-4 py-3 rounded-lg shadow-lg text-white font-medium animate-in fade-in slide-in-from-bottom-4 ${
                        toast.type === 'success'
                            ? 'bg-green-500'
                            : toast.type === 'error'
                            ? 'bg-red-500'
                            : 'bg-blue-500'
                    }`}
                >
                    <div className="flex items-center justify-between gap-3">
                        <span>{toast.message}</span>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="text-white hover:opacity-75 transition-opacity"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}
