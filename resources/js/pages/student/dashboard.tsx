import { Head, usePage, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import student from '@/routes/student';
import { Badge } from '@/components/ui/badge';
import { User, MapPin, GraduationCap, Home, HeartHandshake, Copy, Check, Info } from 'lucide-react';
import { useState } from 'react';

export default function StudentDashboard() {
    const { props } = usePage();
    const user = props.auth.user as any;
    const academic = props.academic as any;
    const address = props.address as any;
    const residential = props.residential as any;
    const guardian = props.guardian as any;
    const application = props.application as any;
    const hall = props.hall as any;
    const { flash } = props as any;

    const tempPassword = flash?.generated_password;
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(!!tempPassword);
    const [copied, setCopied] = useState(false);

    const handleCopyPassword = () => {
        if (tempPassword) {
            navigator.clipboard.writeText(tempPassword);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleStartTutorial = () => {
        setIsPasswordModalOpen(false);
        localStorage.setItem('student_tutorial_step', '1');
        // Force refresh to start the tutorial overlay cleanly
        window.location.reload();
    };

    const now = new Date();
    const isWithinPeriod = hall && 
                           hall.is_application_active && 
                           (!hall.application_start || now >= new Date(hall.application_start)) && 
                           (!hall.application_end || now <= new Date(hall.application_end));

    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

    const handleApply = () => {
        router.post(student.apply().url, {}, {
            onSuccess: () => setIsApplyModalOpen(false)
        });
    };

    const isResidential = residential?.status === 'Residential';

    return (
        <>
            <Head title="Student Dashboard" />
            
            <div className="flex flex-col gap-6 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                
                {/* Welcome Card */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Welcome, {user.name}</h1>
                        <p className="text-slate-500 mt-1">Hajee Mohammad Danesh Science and Technology University (HSTU) Portal</p>
                    </div>
                    {isResidential ? (
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300 hover:bg-green-200 border-none text-sm px-4 py-1.5 font-bold">
                            Residential
                        </Badge>
                    ) : (
                        <Badge variant="secondary" className="text-sm px-4 py-1.5 font-bold">
                            Non-Residential
                        </Badge>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left & Middle Column */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* Personal & Academic Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                                        <User className="w-5 h-5" /> Account Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Email address</p>
                                        <p className="font-semibold text-sm">{user.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Father's Name</p>
                                        <p className="font-semibold text-sm">{guardian?.father_name || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Mother's Name</p>
                                        <p className="font-semibold text-sm">{guardian?.mother_name || 'N/A'}</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                                        <GraduationCap className="w-5 h-5" /> Academics
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Student ID</p>
                                        <p className="font-bold text-sm text-slate-800 dark:text-slate-200">{academic?.student_id}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider">CGPA</p>
                                        <p className="font-bold text-sm text-indigo-600 dark:text-indigo-400">{academic?.current_cgpa}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Faculty</p>
                                        <p className="font-semibold text-sm">{academic?.department}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Degree</p>
                                        <p className="font-semibold text-sm">{academic?.degree}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Level & Semester</p>
                                        <p className="font-semibold text-sm">Level {academic?.level} / Sem {academic?.semester}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Addresses Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                                    <MapPin className="w-5 h-5" /> Address Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 border-b pb-1 mb-2">Permanent Address</h4>
                                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{address?.perm_village_area}</p>
                                    <p className="text-xs text-muted-foreground mt-1">Upazilla: {address?.perm_upazilla}, District: {address?.perm_district}</p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 border-b pb-1 mb-2">Present Address</h4>
                                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{address?.pres_village_area}</p>
                                    <p className="text-xs text-muted-foreground mt-1">Upazilla: {address?.pres_upazilla}, District: {address?.pres_district}</p>
                                </div>
                                <div className="md:col-span-2 bg-slate-50 dark:bg-slate-950 p-3 rounded-xl flex justify-between items-center text-xs">
                                    <span className="font-semibold">Calculated Distance from Campus:</span>
                                    <span className="font-bold text-indigo-600 dark:text-indigo-400">{address?.distance_from_home ?? 0} km</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Guardian & Financial Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                                    <HeartHandshake className="w-5 h-5" /> Guardian & Financials
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Guardian Name</p>
                                    <p className="font-semibold text-sm">{guardian?.guardian_name}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Occupation</p>
                                    <p className="font-semibold text-sm">{guardian?.guardian_occupation}</p>
                                </div>
                                <div className="col-span-2 bg-indigo-50/30 dark:bg-indigo-950/10 p-3 rounded-xl flex justify-between items-center text-sm border border-indigo-100/50 dark:border-indigo-950/20">
                                    <span className="font-semibold text-slate-600 dark:text-slate-400">Guardian's Annual Income:</span>
                                    <span className="font-bold text-slate-900 dark:text-white">৳ {parseFloat(guardian?.annual_income_amount).toLocaleString()}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Seat / Application Info */}
                    <div className="space-y-6 col-span-1">
                        
                        {/* Seat / Hall Info */}
                        <Card className="border-indigo-100 dark:border-indigo-900 shadow-md">
                            <CardHeader className="bg-indigo-50/50 dark:bg-indigo-900/20 rounded-t-xl">
                                <CardTitle className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
                                    <Home className="w-5 h-5" /> Room Placement
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                {isResidential ? (
                                    <div className="text-center py-4 space-y-4">
                                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-100 dark:bg-green-950/30 text-green-600 mb-2">
                                            <Home className="w-7 h-7" />
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{residential?.hall?.name || 'Assigned Hall'}</h3>
                                        <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl space-y-1">
                                            <p className="text-sm font-semibold">Room: {residential?.seat?.room?.room_number}</p>
                                            <p className="text-xs text-muted-foreground">Seat: {residential?.seat?.seat_number}</p>
                                        </div>
                                        {residential?.staying_from && (
                                            <p className="text-xs text-muted-foreground">Resident since: {new Date(residential.staying_from).toLocaleDateString()}</p>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-4 flex flex-col items-center">
                                        <p className="text-sm text-slate-500 mb-6">You currently do not have a seat allocated in any hall.</p>
                                        
                                        {application && application.status === 'pending' ? (
                                            <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 py-2 px-4 rounded-md text-sm border-none font-semibold">
                                                Application Pending Review
                                            </Badge>
                                        ) : isWithinPeriod ? (
                                            <>
                                                <div className="w-full text-left mb-6 p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="relative flex h-2 w-2">
                                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                                        </span>
                                                        <span className="font-bold text-xs text-indigo-950 dark:text-indigo-200">Seat Applications are Open</span>
                                                    </div>
                                                    <p className="text-xs text-indigo-700 dark:text-indigo-300 font-medium mb-3">
                                                        Deadline: {new Date(hall.application_end).toLocaleString()}
                                                    </p>
                                                    <div className="text-xs text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-950 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                                                        {hall.application_message}
                                                    </div>
                                                </div>

                                                {!application || application.status === 'denied' ? (
                                                    <Dialog open={isApplyModalOpen} onOpenChange={setIsApplyModalOpen}>
                                                        <DialogTrigger asChild>
                                                            <Button className="bg-indigo-600 text-white hover:bg-indigo-500 w-full rounded-full shadow-md shadow-indigo-600/10">
                                                                Apply for Seat
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent>
                                                            <DialogHeader>
                                                                <DialogTitle>Confirm Application</DialogTitle>
                                                                <DialogDescription>
                                                                    Please read carefully before proceeding.
                                                                </DialogDescription>
                                                            </DialogHeader>
                                                            <div className="py-4 text-sm text-slate-600 dark:text-slate-300">
                                                                By applying, your <strong>CGPA ({academic?.current_cgpa})</strong>, <strong>Address Distance ({address?.distance_from_home} km)</strong>, and <strong>Guardian's Yearly Income (৳ {parseFloat(guardian?.annual_income_amount).toLocaleString()})</strong> will be sent to the hall authority for evaluation.
                                                            </div>
                                                            <DialogFooter>
                                                                <Button variant="outline" onClick={() => setIsApplyModalOpen(false)}>Cancel</Button>
                                                                <Button onClick={handleApply} className="bg-indigo-600 text-white">I Agree, Submit</Button>
                                                            </DialogFooter>
                                                        </DialogContent>
                                                    </Dialog>
                                                ) : null}
                                            </>
                                        ) : (
                                            <div className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                                                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Seat applications are currently closed.</p>
                                                {hall?.application_end && new Date() > new Date(hall.application_end) && (
                                                    <p className="text-xs text-slate-500 mt-1">Application window closed on {new Date(hall.application_end).toLocaleString()}</p>
                                                )}
                                                {hall?.application_message && (
                                                    <p className="text-xs text-slate-500 mt-3 italic">"{hall.application_message}"</p>
                                                )}
                                            </div>
                                        )}

                                        {application?.status === 'denied' && (
                                            <p className="text-sm text-red-500 mt-4 text-center">Your last application was denied. You may not apply again during this period.</p>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Generated Password Modal on First Load */}
            <Dialog open={isPasswordModalOpen} onOpenChange={(open) => {
                if (!open) handleStartTutorial();
            }}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                            <Check className="w-6 h-6 bg-green-100 dark:bg-green-950 text-green-600 rounded-full p-1 shrink-0" />
                            Registration Successful!
                        </DialogTitle>
                        <DialogDescription className="text-slate-500 pt-1">
                            Your account has been created. Below is your randomly generated temporary password. Copy and save it safely.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="py-6 flex flex-col gap-4">
                        <Label className="text-xs text-slate-400 uppercase tracking-wider">Temporary Password</Label>
                        <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl p-4 font-mono text-lg font-bold tracking-wider select-all">
                            <span>{tempPassword}</span>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={handleCopyPassword}
                                className="h-9 px-3 gap-2 hover:bg-slate-200 dark:hover:bg-slate-900 border-slate-300 dark:border-slate-800 shrink-0 ml-4"
                            >
                                {copied ? (
                                    <>
                                        <Check className="w-4 h-4 text-green-600" />
                                        <span className="text-xs">Copied</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-4 h-4" />
                                        <span className="text-xs">Copy</span>
                                    </>
                                )}
                            </Button>
                        </div>

                        <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-950/50 rounded-xl flex gap-2.5 text-xs text-amber-800 dark:text-amber-300 mt-2">
                            <Info className="w-4 h-4 shrink-0 mt-0.5" />
                            <p>For security, please change this password immediately. Once you close this modal, a guided tour will show you exactly how to do so.</p>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button 
                            onClick={handleStartTutorial} 
                            className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-full w-full py-2.5 font-bold shadow-md shadow-indigo-600/10"
                        >
                            Copy Password & Start Tour &rarr;
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

StudentDashboard.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: '/dashboard' }],
};
