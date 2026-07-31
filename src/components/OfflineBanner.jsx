'use client';

import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { WifiOff } from 'lucide-react';

const CHECK_INTERVAL = 8000;

export default function OfflineBanner() {
    const [isOffline, setIsOffline] = useState(false);

    const checkConnection = useCallback(async () => {
        if (!navigator.onLine) {
            setIsOffline(true);
            return;
        }
        try {
            // Bypasses the service worker's cache fallback (see sw.js) so a
            // real outage actually surfaces as a failed request here.
            const response = await fetch('/manifest.webmanifest', {
                method: 'HEAD',
                cache: 'no-store',
                headers: { 'x-connectivity-check': '1' },
            });
            setIsOffline(!response.ok);
        } catch {
            setIsOffline(true);
        }
    }, []);

    useEffect(() => {
        checkConnection();

        const handleOffline = () => setIsOffline(true);
        const handleOnline = () => checkConnection();

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        const interval = setInterval(checkConnection, CHECK_INTERVAL);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
            clearInterval(interval);
        };
    }, [checkConnection]);

    return (
        <AnimatePresence>
            {isOffline && (
                <motion.div
                    initial={{ y: -60, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -60, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-center gap-2 py-2 px-4 bg-amber-500 text-amber-950 text-sm font-medium shadow-md"
                >
                    <WifiOff size={16} />
                    You&apos;re offline — please reconnect to fetch and sync your todos.
                </motion.div>
            )}
        </AnimatePresence>
    );
}
