'use client'

import { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext(null)

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([])

    const addToast = useCallback((message, { type = 'info', duration = 4000 } = {}) => {
        const id = Date.now() + Math.random().toString(36).substr(2, 9)
        const toast = { id, message, type }
        setToasts((t) => [toast, ...t])
        if (duration > 0) {
            setTimeout(() => {
                setToasts((t) => t.filter((x) => x.id !== id))
            }, duration)
        }
        return id
    }, [])

    const removeToast = useCallback((id) => {
        setToasts((t) => t.filter((x) => x.id !== id))
    }, [])

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
        </ToastContext.Provider>
    )
}

export const useToast = () => {
    const ctx = useContext(ToastContext)
    if (!ctx) throw new Error('useToast must be used within ToastProvider')
    return ctx
}
