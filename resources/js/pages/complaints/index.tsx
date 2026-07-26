import { Head, router, usePage } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, Send, Info, MessageSquareWarning } from 'lucide-react';

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
    categories: string[];
    myComplaints: Complaint[];
    hall: any;
}

const statusStyles: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300',
    in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300',
    resolved: 'bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-300',
};
const statusLabels: Record<string, string> = { pending: 'Pending', in_progress: 'In Progress', resolved: 'Resolved' };

export default function ComplaintsIndex({ categories, myComplaints, hall }: Props) {
    const { flash } = usePage().props as any;
    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    const [category, setCategory] = useState(categories[0] ?? 'Other');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        router.post('/complaints', { category, subject, message }, {
            preserveScroll: true,
            onSuccess: () => { setSubject(''); setMessage(''); setCategory(categories[0] ?? 'Other'); },
            onFinish: () => setSubmitting(false),
        });
    };

    return (
        <>
            <Head title="Complaint Box" />
            <div className="flex flex-col gap-6 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                        <MessageSquareWarning className="w-7 h-7 text-indigo-500" /> Anonymous Complaint Box
                    </h1>
                    <p className="text-slate-500 mt-1">{hall ? `${hall.name} — ` : ''}Reach the hall authority directly and anonymously.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Guideline */}
                    <Card className="lg:col-span-1 border-indigo-200 dark:border-indigo-900/50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                                <Info className="w-5 h-5" /> How to Write
                            </CardTitle>
                            <CardDescription>Guidelines for an effective complaint</CardDescription>
                        </CardHeader>
                        <CardContent className="text-sm text-slate-600 dark:text-slate-400 space-y-3">
                            <div className="flex items-start gap-2 rounded-lg bg-green-50 dark:bg-green-950/20 p-3 text-green-800 dark:text-green-300">
                                <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
                                <span><strong>Fully anonymous.</strong> The hall authority never sees who submitted a complaint. Please be honest and responsible.</span>
                            </div>
                            <ul className="list-disc pl-5 space-y-1.5">
                                <li>Pick the most relevant <strong>category</strong>.</li>
                                <li>Write a short, clear <strong>subject</strong>.</li>
                                <li>Describe <strong>what</strong> happened, <strong>where</strong> (block/room/floor), and <strong>when</strong>.</li>
                                <li>Be specific and factual; avoid abusive language.</li>
                                <li>Do <strong>not</strong> include your name or ID if you wish to stay anonymous.</li>
                                <li>For emergencies (fire, medical, security), contact the hall office directly by phone.</li>
                                <li>You can track status &amp; replies below — this is visible only to you.</li>
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Form */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Submit a Complaint</CardTitle>
                            <CardDescription>Your identity is not shared with the authority.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">Category</label>
                                    <select value={category} onChange={e => setCategory(e.target.value)} className="w-full border rounded-lg p-2.5 text-sm bg-transparent" required>
                                        {categories.map(c => <option key={c} value={c} className="dark:bg-slate-900">{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">Subject</label>
                                    <input value={subject} onChange={e => setSubject(e.target.value)} maxLength={150} required
                                        className="w-full border rounded-lg p-2.5 text-sm bg-transparent" placeholder="e.g. No hot water in Block B" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">Message</label>
                                    <textarea value={message} onChange={e => setMessage(e.target.value)} maxLength={5000} required
                                        className="w-full border rounded-lg p-2.5 text-sm bg-transparent min-h-[140px]"
                                        placeholder="Describe your complaint with details (location, time, what happened)…" />
                                </div>
                                <Button type="submit" disabled={submitting} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white gap-2">
                                    <Send className="w-4 h-4" /> {submitting ? 'Submitting…' : 'Submit Anonymously'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* My complaints */}
                <Card>
                    <CardHeader>
                        <CardTitle>My Complaints</CardTitle>
                        <CardDescription>Track the status and authority responses (visible only to you).</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {myComplaints.length === 0 ? (
                            <p className="text-sm text-slate-500 text-center py-6">You haven't submitted any complaints yet.</p>
                        ) : (
                            <div className="space-y-3">
                                {myComplaints.map(c => (
                                    <div key={c.id} className="p-4 border dark:border-slate-800 rounded-xl">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-slate-900 dark:text-slate-100">{c.subject}</span>
                                                    <Badge variant="outline" className="text-xs">{c.category}</Badge>
                                                </div>
                                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 whitespace-pre-line">{c.message}</p>
                                            </div>
                                            <Badge className={`shrink-0 border-none ${statusStyles[c.status]}`}>{statusLabels[c.status]}</Badge>
                                        </div>
                                        {c.response && (
                                            <div className="mt-3 rounded-lg bg-slate-50 dark:bg-slate-900/40 p-3 text-sm">
                                                <span className="font-semibold text-indigo-600 dark:text-indigo-400">Authority response:</span>
                                                <p className="text-slate-700 dark:text-slate-300 mt-1 whitespace-pre-line">{c.response}</p>
                                            </div>
                                        )}
                                        <p className="text-xs text-slate-400 mt-2">Submitted {new Date(c.created_at).toLocaleString()}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

ComplaintsIndex.layout = {
    breadcrumbs: [{ title: 'Complaint Box', href: '/complaints' }],
};
