'use client'

import { ToastProvider } from '@/contexts/ToastContext'
import ToastContainer from '@/components/ToastContainer'

export default function RootLayoutClient({ children }) {
    return (
        <ToastProvider>
            {children}
            <ToastContainer />
        </ToastProvider>
    )
}
