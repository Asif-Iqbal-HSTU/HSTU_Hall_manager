import { Head, router, usePage } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { MessageSquareWarning, ShieldCheck, Reply } from 'lucide-react';

interface Complaint {
    id: number;
    category: string;
    subject: string;
    message: string;
    status: 'pending' | 'in_progress' | 'resolved';
    response: string | null;
    responded_at: string | null;
    created_at: string;
}

interface Props {
    hall: any;
    complaints: Complaint[];
    stats: { pending: number; in_progress: number; resolved: number };
}

const statusStyles: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300',
    in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300',
    resolved: 'bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-300',
};
const statusLabels: Record<string, string> = { pending: 'Pending', in_progress: 'In Progress', resolved: 'Resolved' };

export default function AdminComplaints({ hall, complaints, stats }: Props) {
    const { flash } = usePage().props as any;
    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'resolved'>('all');
    const [selected, setSelected] = useState<Complaint | null>(null);
    const [status, setStatus] = useState<Complaint['status']>('pending');
    const [response, setResponse] = useState('');

    const openRespond = (c: Complaint) => {
        setSelected(c);
        setStatus(c.status);
        setResponse(c.response ?? '');
    };

    const submitRespond = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selected) return;
        router.post('/admin/complaints/respond', { id: selected.id, status, response }, {
            preserveScroll: true,
            onSuccess: () => setSelected(null),
        });
    };

    const filtered = filter === 'all' ? complaints : complaints.filter(c => c.status === filter);

    return (
        <>
            <Head title="Complaints" />
            <div className="flex flex-col gap-6 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                        <MessageSquareWarning className="w-7 h-7 text-indigo-500" /> Complaints
                    </h1>
                    <p className="text-slate-500 mt-1">{hall.name} — submitted anonymously by students.</p>
                    <div className="mt-3 inline-flex items-center gap-2 text-xs text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/20 rounded-lg px-3 py-1.5">
                        <ShieldCheck className="w-4 h-4" /> Student identities are hidden from you by design.
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    {(['pending', 'in_progress', 'resolved'] as const).map(k => (
                        <Card key={k}>
                            <CardContent className="p-4">
                                <p className="text-xs uppercase text-slate-500 font-semibold">{statusLabels[k]}</p>
                                <p className="text-2xl font-bold mt-1">{stats[k]}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Card>
                    <CardHeader className="flex-row items-center justify-between gap-3">
                        <div>
                            <CardTitle>All Complaints</CardTitle>
                            <CardDescription>Review, set status and respond. Replies are visible to the (anonymous) submitter.</CardDescription>
                        </div>
                        <select value={filter} onChange={e => setFilter(e.target.value as any)} className="border rounded-lg p-2 text-sm bg-transparent">
                            <option value="all" className="dark:bg-slate-900">All</option>
                            <option value="pending" className="dark:bg-slate-900">Pending</option>
                            <option value="in_progress" className="dark:bg-slate-900">In Progress</option>
                            <option value="resolved" className="dark:bg-slate-900">Resolved</option>
                        </select>
                    </CardHeader>
                    <CardContent>
                        {filtered.length === 0 ? (
                            <p className="text-sm text-slate-500 text-center py-6">No complaints{filter !== 'all' ? ` with status "${statusLabels[filter]}"` : ''}.</p>
                        ) : (
                            <div className="space-y-3">
                                {filtered.map(c => (
                                    <div key={c.id} className="p-4 border dark:border-slate-800 rounded-xl">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="font-semibold text-slate-900 dark:text-slate-100">{c.subject}</span>
                                                    <Badge variant="outline" className="text-xs">{c.category}</Badge>
                                                    <Badge className={`border-none ${statusStyles[c.status]}`}>{statusLabels[c.status]}</Badge>
                                                </div>
                                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1.5 whitespace-pre-line">{c.message}</p>
                                                {c.response && (
                                                    <div className="mt-2 rounded-lg bg-slate-50 dark:bg-slate-900/40 p-2.5 text-sm">
                                                        <span className="font-semibold text-indigo-600 dark:text-indigo-400">Your response:</span>
                                                        <p className="text-slate-700 dark:text-slate-300 whitespace-pre-line">{c.response}</p>
                                                    </div>
                                                )}
                                                <p className="text-xs text-slate-400 mt-2">{new Date(c.created_at).toLocaleString()}</p>
                                            </div>
                                            <Button size="sm" variant="outline" className="shrink-0 gap-1.5" onClick={() => openRespond(c)}>
                                                <Reply className="w-3.5 h-3.5" /> Respond
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Respond to Complaint</DialogTitle>
                    </DialogHeader>
                    {selected && (
                        <form onSubmit={submitRespond} className="space-y-4">
                            <div className="rounded-lg bg-slate-50 dark:bg-slate-900/40 p-3 text-sm">
                                <p className="font-semibold">{selected.subject} <span className="font-normal text-slate-500">· {selected.category}</span></p>
                                <p className="text-slate-600 dark:text-slate-400 mt-1 whitespace-pre-line">{selected.message}</p>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">Status</label>
                                <select value={status} onChange={e => setStatus(e.target.value as any)} className="w-full border rounded-lg p-2.5 text-sm bg-transparent">
                                    <option value="pending" className="dark:bg-slate-900">Pending</option>
                                    <option value="in_progress" className="dark:bg-slate-900">In Progress</option>
                                    <option value="resolved" className="dark:bg-slate-900">Resolved</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">Response (optional)</label>
                                <textarea value={response} onChange={e => setResponse(e.target.value)} maxLength={5000}
                                    className="w-full border rounded-lg p-2.5 text-sm bg-transparent min-h-[110px]"
                                    placeholder="Message shown to the (anonymous) student…" />
                            </div>
                            <DialogFooter className="gap-2">
                                <Button type="button" variant="outline" onClick={() => setSelected(null)}>Cancel</Button>
                                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white">Save</Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}

AdminComplaints.layout = {
    breadcrumbs: [{ title: 'Complaints', href: '/admin/complaints' }],
};
