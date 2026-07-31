'use client';

import { useSession } from 'next-auth/react';
import Layout from '../../layouts/Layout';
import Loader from '../../components/ui/Loader';

export default function DashboardPage() {
    const { status } = useSession();

    if (status === 'loading') {
        return <Loader fullScreen text="Loading Dashboard..." />;
    }

    return <Layout />;
}
