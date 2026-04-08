"use client";
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, X, Info } from 'lucide-react';

type NotificationType = 'success' | 'error' | 'info';

interface Notification {
    id: string;
    message: string;
    type: NotificationType;
}

interface NotificationContextType {
    addNotification: (message: string, type?: NotificationType) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const addNotification = useCallback((message: string, type: NotificationType = 'success') => {
        const id = Math.random().toString(36).substring(2, 9);
        setNotifications((prev) => [...prev, { id, message, type }]);

        // Auto-remove after 3 seconds
        setTimeout(() => {
            setNotifications((prev) => prev.filter((n) => n.id !== id));
        }, 3000);
    }, []);

    const removeNotification = (id: string) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    return (
        <NotificationContext.Provider value={{ addNotification }}>
            {children}
            
            {/* Notification Container */}
            <div className="fixed top-24 right-4 md:right-8 z-[9999] flex flex-col items-end gap-3 w-full max-w-md px-4 pointer-events-none">
                <AnimatePresence mode="popLayout">
                    {notifications.map((n) => (
                        <motion.div
                            key={n.id}
                            layout
                            initial={{ opacity: 0, x: 20, scale: 0.95 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                            className="pointer-events-auto"
                        >
                            <div className={`
                                flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl backdrop-blur-xl border
                                ${n.type === 'success' ? 'bg-emerald-500/90 border-emerald-400/20 text-white' : 
                                  n.type === 'error' ? 'bg-rose-500/90 border-rose-400/20 text-white' : 
                                  'bg-white/90 border-black/5 text-black'}
                            `}>
                                {n.type === 'success' && <CheckCircle2 size={18} className="shrink-0" />}
                                {n.type === 'error' && <AlertCircle size={18} className="shrink-0" />}
                                {n.type === 'info' && <Info size={18} className="shrink-0" />}
                                
                                <span className="text-[12px] font-bold tracking-wide uppercase">{n.message}</span>
                                
                                <button 
                                    onClick={() => removeNotification(n.id)}
                                    className="ml-2 hover:opacity-70 transition-opacity"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};
