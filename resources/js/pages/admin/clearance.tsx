import { Head, router, usePage } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wallet, Save, CheckCircle2, Search } from 'lucide-react';

interface FeeRow { level: number; residential: number; non_residential: number; }
interface Student {
    name: string;
    student_id: string;
    department: string;
    level: number | null;
    residency: 'residential' | 'non_residential';
    paid_levels: number[];
    current_paid: boolean;
}
interface Props {
    hall: any;
    feeStructure: FeeRow[];
    students: Student[];
}

export default function AdminClearance({ hall, feeStructure, students }: Props) {
    const { flash } = usePage().props as any;
    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    // Fee structure editor state: per level -> { residential, non_residential }
    const [fees, setFees] = useState<Record<number, { residential: number; non_residential: number }>>(
        Object.fromEntries(feeStructure.map(f => [f.level, { residential: f.residential, non_residential: f.non_residential }]))
    );
    const setFee = (level: number, key: 'residential' | 'non_residential', val: number) =>
        setFees(prev => ({ ...prev, [level]: { ...prev[level], [key]: val } }));
    const saveFee = (level: number) => {
        router.post('/admin/clearance/fee-structure', {
            level,
            residential: fees[level]?.residential ?? 0,
            non_residential: fees[level]?.non_residential ?? 0,
        }, { preserveScroll: true });
    };

    // Record payment state
    const today = new Date().toISOString().slice(0, 10);
    const [studentId, setStudentId] = useState('');
    const [level, setLevel] = useState<number>(1);
    const [residency, setResidency] = useState<'residential' | 'non_residential'>('residential');
    const [amount, setAmount] = useState<number>(feeStructure[0]?.residential ?? 0);
    const [method, setMethod] = useState<'offline' | 'online'>('offline');
    const [bankName, setBankName] = useState('');
    const [voucherNo, setVoucherNo] = useState('');
    const [txnRef, setTxnRef] = useState('');
    const [paidOn, setPaidOn] = useState(today);
    const [remarks, setRemarks] = useState('');

    // Keep amount in sync with the selected level's fee for the chosen residency.
    useEffect(() => {
        const f = feeStructure.find(x => x.level === level);
        if (f) setAmount(residency === 'residential' ? f.residential : f.non_residential);
    }, [level, residency, feeStructure]);

    const submitPayment = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/admin/clearance/record', {
            student_id: studentId, level, amount, payment_method: method,
            bank_name: bankName, voucher_no: voucherNo, transaction_ref: txnRef,
            paid_on: paidOn, remarks,
        }, {
            preserveScroll: true,
            onSuccess: () => { setStudentId(''); setVoucherNo(''); setTxnRef(''); setRemarks(''); },
        });
    };

    const prefillStudent = (s: Student) => {
        setStudentId(s.student_id);
        setResidency(s.residency);
        if (s.level) setLevel(s.level);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const [q, setQ] = useState('');
    const filtered = students.filter(s =>
        !q || s.name.toLowerCase().includes(q.toLowerCase()) || s.student_id.toLowerCase().includes(q.toLowerCase())
    );
    const taka = (n: number) => `Tk. ${Number(n).toLocaleString()}`;

    return (
        <>
            <Head title="Hall Clearance" />
            <div className="flex flex-col gap-6 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                        <Wallet className="w-7 h-7 text-indigo-500" /> Hall Clearance &amp; Fees
                    </h1>
                    <p className="text-slate-500 mt-1">{hall.name} — configure fees &amp; record student payments.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Fee structure editor */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Yearly Fee by Level</CardTitle>
                            <CardDescription>Set separate amounts for residential and non-residential (attached) students, charged at each level's 1st semester.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center gap-3 text-xs font-semibold text-slate-500 uppercase px-1">
                                <span className="w-16">Level</span>
                                <span className="flex-1">Residential (Tk.)</span>
                                <span className="flex-1">Non-Residential (Tk.)</span>
                                <span className="w-[70px]"></span>
                            </div>
                            {feeStructure.map(f => (
                                <div key={f.level} className="flex items-center gap-3">
                                    <span className="w-16 text-sm font-semibold">L{f.level}</span>
                                    <input type="number" min="0" value={fees[f.level]?.residential ?? 0}
                                        onChange={e => setFee(f.level, 'residential', parseFloat(e.target.value) || 0)}
                                        className="flex-1 w-full border rounded-lg p-2 text-sm bg-transparent" />
                                    <input type="number" min="0" value={fees[f.level]?.non_residential ?? 0}
                                        onChange={e => setFee(f.level, 'non_residential', parseFloat(e.target.value) || 0)}
                                        className="flex-1 w-full border rounded-lg p-2 text-sm bg-transparent" />
                                    <Button size="sm" variant="outline" className="gap-1.5 w-[70px]" onClick={() => saveFee(f.level)}>
                                        <Save className="w-3.5 h-3.5" /> Save
                                    </Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Record payment */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Record a Payment</CardTitle>
                            <CardDescription>Enter details from the student's sealed bank voucher.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submitPayment} className="space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs font-semibold text-slate-500 mb-1 block">Student ID *</label>
                                        <input value={studentId} onChange={e => setStudentId(e.target.value)} required
                                            className="w-full border rounded-lg p-2 text-sm bg-transparent" placeholder="e.g. 2405001" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-slate-500 mb-1 block">Level *</label>
                                        <select value={level} onChange={e => setLevel(parseInt(e.target.value))} className="w-full border rounded-lg p-2 text-sm bg-transparent">
                                            {[1, 2, 3, 4].map(l => <option key={l} value={l} className="dark:bg-slate-900">Level {l}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-slate-500 mb-1 block">Student Type *</label>
                                        <select value={residency} onChange={e => setResidency(e.target.value as any)} className="w-full border rounded-lg p-2 text-sm bg-transparent">
                                            <option value="residential" className="dark:bg-slate-900">Residential</option>
                                            <option value="non_residential" className="dark:bg-slate-900">Non-Residential</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-slate-500 mb-1 block">Amount (Tk.) *</label>
                                        <input type="number" min="0" value={amount} onChange={e => setAmount(parseFloat(e.target.value) || 0)} required
                                            className="w-full border rounded-lg p-2 text-sm bg-transparent" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-slate-500 mb-1 block">Method *</label>
                                        <select value={method} onChange={e => setMethod(e.target.value as any)} className="w-full border rounded-lg p-2 text-sm bg-transparent">
                                            <option value="offline" className="dark:bg-slate-900">Offline (Bank)</option>
                                            <option value="online" className="dark:bg-slate-900">Online</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-slate-500 mb-1 block">Bank Name</label>
                                        <input value={bankName} onChange={e => setBankName(e.target.value)}
                                            className="w-full border rounded-lg p-2 text-sm bg-transparent" placeholder="e.g. Sonali Bank" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-slate-500 mb-1 block">Paid On *</label>
                                        <input type="date" value={paidOn} onChange={e => setPaidOn(e.target.value)} required
                                            className="w-full border rounded-lg p-2 text-sm bg-transparent" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-slate-500 mb-1 block">Voucher No</label>
                                        <input value={voucherNo} onChange={e => setVoucherNo(e.target.value)}
                                            className="w-full border rounded-lg p-2 text-sm bg-transparent" placeholder="Bank voucher no." />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-slate-500 mb-1 block">Transaction Ref</label>
                                        <input value={txnRef} onChange={e => setTxnRef(e.target.value)}
                                            className="w-full border rounded-lg p-2 text-sm bg-transparent" placeholder="Online/bank ref" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-500 mb-1 block">Remarks</label>
                                    <input value={remarks} onChange={e => setRemarks(e.target.value)}
                                        className="w-full border rounded-lg p-2 text-sm bg-transparent" placeholder="Optional" />
                                </div>
                                <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white gap-2">
                                    <CheckCircle2 className="w-4 h-4" /> Mark as Paid
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* Students status */}
                <Card>
                    <CardHeader className="flex-row items-center justify-between gap-3">
                        <div>
                            <CardTitle>Students &amp; Clearance Status</CardTitle>
                            <CardDescription>Click a student to prefill the payment form.</CardDescription>
                        </div>
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-slate-400" />
                            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search name / ID"
                                className="border rounded-lg pl-8 pr-3 py-2 text-sm bg-transparent" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs uppercase bg-slate-50 dark:bg-slate-800 text-slate-500">
                                    <tr>
                                        <th className="px-4 py-3">Name</th>
                                        <th className="px-4 py-3">Student ID</th>
                                        <th className="px-4 py-3 text-center">Level</th>
                                        <th className="px-4 py-3">Type</th>
                                        <th className="px-4 py-3 text-center">Current Level</th>
                                        <th className="px-4 py-3">Paid Levels</th>
                                        <th className="px-4 py-3 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map(s => (
                                        <tr key={s.student_id} className="border-b dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                                            <td className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">{s.name}</td>
                                            <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{s.student_id}</td>
                                            <td className="px-4 py-3 text-center">{s.level ?? '—'}</td>
                                            <td className="px-4 py-3">
                                                <span className="text-xs">{s.residency === 'residential' ? 'Residential' : 'Non-Res.'}</span>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                {s.current_paid
                                                    ? <Badge className="bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-300 border-none">Paid</Badge>
                                                    : <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border-none">Due</Badge>}
                                            </td>
                                            <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{s.paid_levels.length ? s.paid_levels.sort().join(', ') : '—'}</td>
                                            <td className="px-4 py-3 text-right">
                                                <Button size="sm" variant="outline" onClick={() => prefillStudent(s)}>Record</Button>
                                            </td>
                                        </tr>
                                    ))}
                                    {filtered.length === 0 && (
                                        <tr><td colSpan={7} className="px-4 py-6 text-center text-slate-500">No students found.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

AdminClearance.layout = {
    breadcrumbs: [{ title: 'Hall Clearance', href: '/admin/clearance' }],
};
