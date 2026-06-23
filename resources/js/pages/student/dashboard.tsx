import { Head, usePage, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import student from '@/routes/student';
import { Badge } from '@/components/ui/badge';
import { User, MapPin, GraduationCap, Home } from 'lucide-react';
import { useState } from 'react';

export default function StudentDashboard() {
    const { props } = usePage();
    const user = props.auth.user as any;
    const profile = props.profile as any;
    const application = props.application as any;
    const hall = props.hall as any;

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

    return (
        <>
            <Head title="Student Dashboard" />
            
            <div className="flex flex-col gap-6 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                
                <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Welcome, {user.name}</h1>
                        <p className="text-slate-500 mt-1">Student Profile & Seat Status</p>
                    </div>
                    {profile.is_residential ? (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-none text-sm px-4 py-1">Residential</Badge>
                    ) : (
                        <Badge variant="secondary" className="text-sm px-4 py-1">Non-Residential</Badge>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left Column: Profile Info */}
                    <div className="md:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><User className="w-5 h-5 text-indigo-500" /> Personal Information</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                                    <div>
                                        <p className="text-muted-foreground">Student ID</p>
                                        <p className="font-medium text-base">{profile.student_id}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Email</p>
                                        <p className="font-medium text-base">{user.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Father's Name</p>
                                        <p className="font-medium text-base">{profile.father_name || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Mother's Name</p>
                                        <p className="font-medium text-base">{profile.mother_name || 'N/A'}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><GraduationCap className="w-5 h-5 text-indigo-500" /> Academic Information</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-3 gap-y-4 gap-x-6 text-sm">
                                    <div>
                                        <p className="text-muted-foreground">Degree</p>
                                        <p className="font-medium text-base">{profile.degree || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Level / Semester</p>
                                        <p className="font-medium text-base">{profile.level || '-'} / {profile.semester || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">CGPA</p>
                                        <p className="font-medium text-base text-indigo-600 dark:text-indigo-400">{profile.cgpa || 'N/A'}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Seat / Application Info */}
                    <div className="space-y-6">
                        <Card className="border-indigo-100 dark:border-indigo-900 shadow-md">
                            <CardHeader className="bg-indigo-50/50 dark:bg-indigo-900/20 rounded-t-xl">
                                <CardTitle className="flex items-center gap-2"><Home className="w-5 h-5 text-indigo-600" /> Seat Status</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                {profile.is_residential ? (
                                    <div className="text-center py-4">
                                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
                                            <Home className="w-8 h-8" />
                                        </div>
                                        <h3 className="text-xl font-bold">Room {profile.seat?.room?.room_number}</h3>
                                        <p className="text-slate-500 mt-1">Seat: {profile.seat?.seat_number}</p>
                                    </div>
                                ) : (
                                    <div className="text-center py-4 flex flex-col items-center">
                                        <p className="text-slate-500 mb-6">You currently do not have a seat allocated.</p>
                                        
                                        {application && application.status === 'pending' ? (
                                            <Badge className="bg-amber-100 text-amber-800 py-2 px-4 rounded-md text-sm border-none">
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
                                                            <Button className="bg-indigo-600 text-white hover:bg-indigo-500 w-full">Apply for Seat</Button>
                                                        </DialogTrigger>
                                                        <DialogContent>
                                                            <DialogHeader>
                                                                <DialogTitle>Confirm Application</DialogTitle>
                                                                <DialogDescription>
                                                                    Please read carefully before proceeding.
                                                                </DialogDescription>
                                                            </DialogHeader>
                                                            <div className="py-4 text-sm text-slate-600 dark:text-slate-300">
                                                                By applying, your <strong>CGPA ({profile.cgpa})</strong>, <strong>Address Distance ({profile.distance_from_home} km)</strong>, and <strong>Guardian's Yearly Income (৳ {profile.guardian_income})</strong> will be sent to the hall authority for evaluation.
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
        </>
    );
}

StudentDashboard.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: '/dashboard' }],
};
