import { Head } from '@inertiajs/react';

export default function SystemDashboard() {
    return (
        <>
            <Head title="System Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <h1 className="text-2xl font-bold">System Admin Dashboard</h1>
                <p>Welcome to the central system administration dashboard.</p>
            </div>
        </>
    );
}

SystemDashboard.layout = {
    breadcrumbs: [{ title: 'System Dashboard', href: '/dashboard' }],
};

