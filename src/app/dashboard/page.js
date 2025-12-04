'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Layout from '../../layouts/Layout';
import Loader from '../../components/ui/Loader';

export default function DashboardPage() {
    const { status } = useSession();
    const router = useRouter();

    useEffect(() => {
        // If we wanted to force login, we'd do it here, but we allow guest access now.
        // However, if we wanted to redirect unauthenticated users back to home:
        // if (status === 'unauthenticated') router.push('/');
    }, [status, router]);

    if (status === 'loading') {
        return <Loader fullScreen text="Loading Dashboard..." />;
    }

    return <Layout />;
}
