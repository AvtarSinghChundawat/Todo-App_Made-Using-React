'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Loader from '../components/ui/Loader';
import { useTodos } from '../context/TodoContext';

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { isDark } = useTodos(); // Use context for theme if needed, or just system preference

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        try {
            await signIn('google', { callbackUrl: '/dashboard' });
        } catch (error) {
            console.error("Login failed", error);
            setIsLoading(false);
        }
    };

    const handleGuestAccess = () => {
        setIsLoading(true);
        // Simulate loading for aesthetic feel
        setTimeout(() => {
            router.push('/dashboard');
        }, 800);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-neutral-900 dark:to-neutral-800 p-4">
            {isLoading && <Loader fullScreen text="Authenticating..." />}

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-neutral-800 p-8 rounded-2xl shadow-xl w-full max-w-md border border-neutral-100 dark:border-neutral-700"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 mb-2">
                        Todo App
                    </h1>
                    <p className="text-neutral-500 dark:text-neutral-400">
                        Organize your life, one task at a time.
                    </p>
                </div>

                <div className="space-y-4">
                    <button
                        onClick={handleGoogleSignIn}
                        className="w-full flex items-center justify-center gap-3 bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-600 text-neutral-700 dark:text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                        Continue with Google
                    </button>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-neutral-200 dark:border-neutral-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white dark:bg-neutral-800 text-neutral-500">Or continue as</span>
                        </div>
                    </div>

                    <button
                        onClick={handleGuestAccess}
                        className="w-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium py-3 px-4 rounded-xl hover:opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                    >
                        Guest User
                    </button>

                    <div className="text-center">
                        <p className="text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 py-2 px-3 rounded-lg border border-amber-100 dark:border-amber-900/30 inline-block">
                            ⚠️ Caution: Guest data is not saved to the cloud.
                        </p>
                    </div>
                </div>

                <p className="mt-8 text-center text-xs text-neutral-400 dark:text-neutral-500">
                    By continuing, you agree to our Terms of Service and Privacy Policy.
                </p>
            </motion.div>
        </div>
    );
}
