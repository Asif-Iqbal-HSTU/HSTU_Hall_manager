import { Head, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wallet, FileDown, BadgeCheck, Info, AlertCircle } from 'lucide-react';

interface Payment {
    amount: string;
    payment_method: string;
    paid_on: string;
    bank_name: string | null;
    voucher_no: string | null;
    transaction_ref: string | null;
}
interface Row {
    level: number;
    amount: number;
    paid: boolean;
    payment: Payment | null;
}
interface Props {
    hall: any;
    academic: any;
    summary: Row[];
    residency: 'residential' | 'non_residential';
}

export default function ClearanceIndex({ hall, academic, summary, residency }: Props) {
    const residencyLabel = residency === 'residential' ? 'Residential' : 'Non-Residential (Attached)';
    const { flash } = usePage().props as any;
    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    const currentLevel = academic?.level;
    const current = summary.find(r => r.level === currentLevel);
    const taka = (n: number | string) => `Tk. ${Number(n).toLocaleString(undefined, { minimumFractionDigits: 0 })}`;

    if (!academic || !hall) {
        return (
            <>
                <Head title="Hall Clearance" />
                <div className="max-w-3xl mx-auto px-4 py-10">
                    <Card><CardContent className="p-8 text-center text-slate-500">
                        Your academic profile or hall assignment is incomplete, so no hall fee is applicable yet.
                    </CardContent></Card>
                </div>
            </>
        );
    }

    return (
        <>
            <Head title="Hall Clearance" />
            <div className="flex flex-col gap-6 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                        <Wallet className="w-7 h-7 text-indigo-500" /> Hall Fee &amp; Clearance
                    </h1>
                    <p className="text-slate-500 mt-1">{hall.name} — {academic.department}, Level {currentLevel}</p>
                    <div className="mt-3">
                        <Badge variant="outline" className="text-xs">Fee type: {residencyLabel}</Badge>
                    </div>
                </div>

                {/* Current level highlight */}
                {current && (
                    <Card className={current.paid ? 'border-green-300 dark:border-green-900/60' : 'border-amber-300 dark:border-amber-900/60'}>
                        <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                                <p className="text-xs font-bold uppercase text-slate-500">Current Level {currentLevel} — Yearly Hall Fee</p>
                                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{taka(current.amount)}</p>
                                <div className="mt-2">
                                    {current.paid ? (
                                        <Badge className="bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-300 border-none gap-1"><BadgeCheck className="w-4 h-4" /> Paid &amp; Cleared</Badge>
                                    ) : (
                                        <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border-none gap-1"><AlertCircle className="w-4 h-4" /> Due — not cleared</Badge>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 w-full sm:w-auto">
                                {current.amount > 0 && (
                                    <a href={`/clearance/voucher?level=${currentLevel}`} target="_blank" rel="noopener noreferrer">
                                        <Button variant="outline" className="w-full gap-2"><FileDown className="w-4 h-4" /> Download Payment Voucher</Button>
                                    </a>
                                )}
                                {current.paid && (
                                    <a href={`/clearance/certificate?level=${currentLevel}`} target="_blank" rel="noopener noreferrer">
                                        <Button className="w-full bg-green-600 hover:bg-green-500 text-white gap-2"><FileDown className="w-4 h-4" /> Download Clearance</Button>
                                    </a>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* How to pay */}
                <Card className="border-indigo-200 dark:border-indigo-900/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400"><Info className="w-5 h-5" /> How to clear your hall fee</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-slate-600 dark:text-slate-400">
                        <ol className="list-decimal pl-5 space-y-1.5">
                            <li><strong>Download</strong> the payment voucher for your level.</li>
                            <li><strong>Pay</strong> the amount online, or at the designated bank branch (offline).</li>
                            <li>Collect the <strong>sealed &amp; signed</strong> bank copy of the voucher.</li>
                            <li>Submit the sealed voucher to the <strong>Hall Office</strong>. The authority will record your payment.</li>
                            <li>Once recorded, the status here turns <strong>Paid</strong> and you can <strong>download your Hall Clearance</strong> certificate.</li>
                        </ol>
                    </CardContent>
                </Card>

                {/* All levels */}
                <Card>
                    <CardHeader>
                        <CardTitle>Year-wise Clearance Status</CardTitle>
                        <CardDescription>Hall fee is charged once per level (1st semester of each level).</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs uppercase bg-slate-50 dark:bg-slate-800 text-slate-500">
                                    <tr>
                                        <th className="px-4 py-3">Level</th>
                                        <th className="px-4 py-3">Amount</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3">Paid On</th>
                                        <th className="px-4 py-3 text-right">Documents</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {summary.map(r => (
                                        <tr key={r.level} className="border-b dark:border-slate-800">
                                            <td className="px-4 py-3 font-semibold">Level {r.level}</td>
                                            <td className="px-4 py-3">{taka(r.amount)}</td>
                                            <td className="px-4 py-3">
                                                {r.paid
                                                    ? <Badge className="bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-300 border-none">Paid</Badge>
                                                    : <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border-none">Due</Badge>}
                                            </td>
                                            <td className="px-4 py-3 text-slate-500">{r.payment ? new Date(r.payment.paid_on).toLocaleDateString() : '—'}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex justify-end gap-2">
                                                    {r.amount > 0 && (
                                                        <a href={`/clearance/voucher?level=${r.level}`} target="_blank" rel="noopener noreferrer" title="Payment voucher">
                                                            <Button size="sm" variant="ghost" className="gap-1.5 text-slate-600"><FileDown className="w-3.5 h-3.5" /> Voucher</Button>
                                                        </a>
                                                    )}
                                                    {r.paid && (
                                                        <a href={`/clearance/certificate?level=${r.level}`} target="_blank" rel="noopener noreferrer" title="Clearance certificate">
                                                            <Button size="sm" variant="ghost" className="gap-1.5 text-green-600"><FileDown className="w-3.5 h-3.5" /> Clearance</Button>
                                                        </a>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

ClearanceIndex.layout = {
    breadcrumbs: [{ title: 'Hall Clearance', href: '/clearance' }],
};
