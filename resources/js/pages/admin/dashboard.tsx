import { Head, usePage, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import admin from '@/routes/admin';
import { Badge } from '@/components/ui/badge';
import { Building, Users, BedDouble, FileText, User, GraduationCap, MapPin, HeartHandshake, Home } from 'lucide-react';
import { useState } from 'react';

export default function AdminDashboard() {
    const { props } = usePage();
    const hall = props.hall as any;
    const students = props.students as any[];
    const residentialStudents = props.residentialStudents as any[];
    const rooms = props.rooms as any[];
    const applications = props.applications as any[];
    
    const [selectedStudent, setSelectedStudent] = useState<any>(null);
    const [selectedRoom, setSelectedRoom] = useState<any>(null);
    const [selectedProfile, setSelectedProfile] = useState<any>(null);
    const [selectedApplication, setSelectedApplication] = useState<any>(null);
    const [allocateRoomId, setAllocateRoomId] = useState<string>('');
    const [allocateSeatId, setAllocateSeatId] = useState<string>('');

    const [filterCgpa, setFilterCgpa] = useState(false);
    const [filterDistance, setFilterDistance] = useState(false);
    const [filterIncome, setFilterIncome] = useState(false);

    const [isStartModalOpen, setIsStartModalOpen] = useState(false);
    const [startDate, setStartDate] = useState(hall.application_start ? new Date(hall.application_start).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16));
    const [endDate, setEndDate] = useState(hall.application_end ? new Date(hall.application_end).toISOString().slice(0, 16) : '');
    const [applicationMessage, setApplicationMessage] = useState(hall.application_message || `Applications are now open for seat allocation in ${hall.name}. Please submit your application with correct academic and personal details before the deadline.`);

    const handleStartSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(admin.startProcess().url, {
            start_date: startDate,
            end_date: endDate,
            message: applicationMessage
        }, {
            onSuccess: () => setIsStartModalOpen(false)
        });
    };

    const handleCloseProcess = () => {
        if(confirm("Are you sure you want to close the seat application process? Students will no longer be able to apply.")) {
            router.post(admin.closeProcess().url);
        }
    };

    const handleAllocate = (appId: number) => {
        router.post(admin.allocate().url, {
            application_id: appId,
            seat_id: allocateSeatId
        }, {
            onSuccess: () => setSelectedApplication(null)
        });
    };

    const handleDeny = (appId: number) => {
        if(confirm("Are you sure you want to deny this request?")) {
            router.post(admin.deny().url, { application_id: appId });
        }
    };

    let sortedApplications = [...applications];
    if (filterCgpa || filterDistance || filterIncome) {
        sortedApplications.sort((a, b) => {
            let scoreA = 0;
            let scoreB = 0;
            if (filterCgpa) {
                scoreA += parseFloat(a.cgpa) * 1000;
                scoreB += parseFloat(b.cgpa) * 1000;
            }
            if (filterDistance) {
                scoreA += parseInt(a.distance_from_home) * 10;
                scoreB += parseInt(b.distance_from_home) * 10;
            }
            if (filterIncome) {
                // less income gets priority
                scoreA += (1000000 - parseFloat(a.guardian_income)) / 1000;
                scoreB += (1000000 - parseFloat(b.guardian_income)) / 1000;
            }
            return scoreB - scoreA;
        });
    }

    const availableRooms = rooms.filter(r => r.seats.some((s:any) => s.status === 'available'));
    const selectedRoomDetails = availableRooms.find(r => r.id.toString() === allocateRoomId);

    return (
        <>
            <Head title="Admin Dashboard" />
            
            <div className="flex flex-col gap-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{hall.name}</h1>
                            <p className="text-slate-500 mt-1">Admin Dashboard</p>
                        </div>
                        {hall.is_application_active ? (
                            <Button onClick={handleCloseProcess} variant="destructive" className="gap-2">
                                Close Application
                            </Button>
                        ) : (
                            <Dialog open={isStartModalOpen} onOpenChange={setIsStartModalOpen}>
                                <DialogTrigger asChild>
                                    <Button className="bg-indigo-600 hover:bg-indigo-500 text-white gap-2">
                                        <FileText className="w-4 h-4" /> Start "Apply for seats"
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>Start Seat Applications</DialogTitle>
                                    </DialogHeader>
                                    <form onSubmit={handleStartSubmit} className="space-y-4 pt-4">
                                        <div className="flex flex-col gap-1">
                                            <label className="text-sm font-medium">Start Date & Time</label>
                                            <input 
                                                type="datetime-local" 
                                                className="border rounded-md p-2 bg-transparent text-sm"
                                                required 
                                                value={startDate}
                                                onChange={e => setStartDate(e.target.value)}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label className="text-sm font-medium">End Date & Time</label>
                                            <input 
                                                type="datetime-local" 
                                                className="border rounded-md p-2 bg-transparent text-sm"
                                                required 
                                                value={endDate}
                                                onChange={e => setEndDate(e.target.value)}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label className="text-sm font-medium">Notice Message for Students</label>
                                            <textarea 
                                                className="border rounded-md p-2 bg-transparent text-sm min-h-[100px]"
                                                required 
                                                value={applicationMessage}
                                                onChange={e => setApplicationMessage(e.target.value)}
                                            />
                                        </div>
                                        <div className="flex justify-end gap-2 pt-2">
                                            <Button type="button" variant="outline" onClick={() => setIsStartModalOpen(false)}>Cancel</Button>
                                            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white">Start Process</Button>
                                        </div>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        )}
                    </div>

                    {hall.is_application_active && (
                        <div className="mt-4 p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50">
                            <div className="flex justify-between items-start gap-4">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                        </span>
                                        <span className="font-bold text-indigo-950 dark:text-indigo-200">Seat Applications are Currently Open</span>
                                    </div>
                                    <p className="text-sm text-indigo-700 dark:text-indigo-300 font-medium">
                                        Period: {new Date(hall.application_start).toLocaleString()} to {new Date(hall.application_end).toLocaleString()}
                                    </p>
                                    <div className="text-sm text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-950 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                                        <span className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">Notice Message:</span>
                                        {hall.application_message}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{students.length}</div>
                            <p className="text-xs text-muted-foreground">Attached to this hall</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Residential Students</CardTitle>
                            <BedDouble className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{residentialStudents.length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{applications.length}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Applications Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Seat Applications</CardTitle>
                        <CardDescription>Filter and sort applications to allocate seats.</CardDescription>
                        <div className="flex gap-4 mt-4">
                            <label className="flex items-center gap-2">
                                <input type="checkbox" checked={filterCgpa} onChange={e => setFilterCgpa(e.target.checked)} className="rounded text-indigo-600" /> Sort by CGPA
                            </label>
                            <label className="flex items-center gap-2">
                                <input type="checkbox" checked={filterDistance} onChange={e => setFilterDistance(e.target.checked)} className="rounded text-indigo-600" /> Sort by Distance
                            </label>
                            <label className="flex items-center gap-2">
                                <input type="checkbox" checked={filterIncome} onChange={e => setFilterIncome(e.target.checked)} className="rounded text-indigo-600" /> Sort by Income
                            </label>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-800 dark:text-gray-400">
                                    <tr>
                                        <th className="px-4 py-3">Student</th>
                                        <th className="px-4 py-3">CGPA</th>
                                        <th className="px-4 py-3">Distance (km)</th>
                                        <th className="px-4 py-3">Income</th>
                                        <th className="px-4 py-3">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedApplications.map(app => (
                                        <tr key={app.id} className="border-b dark:border-gray-700">
                                            <td className="px-4 py-3">{app.student?.name} ({app.student?.academic?.student_id ?? 'N/A'})</td>
                                            <td className="px-4 py-3">{app.cgpa}</td>
                                            <td className="px-4 py-3">{app.distance_from_home}</td>
                                            <td className="px-4 py-3">{app.guardian_income}</td>
                                            <td className="px-4 py-3 flex gap-2">
                                                <Dialog open={selectedApplication?.id === app.id} onOpenChange={(open) => !open && setSelectedApplication(null)}>
                                                    <DialogTrigger asChild>
                                                        <Button size="sm" variant="outline" onClick={() => setSelectedApplication(app)}>Allocate</Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>Allocate Seat</DialogTitle>
                                                        </DialogHeader>
                                                        <div className="py-4 flex flex-col gap-4">
                                                            <div>
                                                                <label className="block text-sm font-medium mb-1">Select Room</label>
                                                                <select className="w-full border rounded-md p-2" value={allocateRoomId} onChange={e => { setAllocateRoomId(e.target.value); setAllocateSeatId(''); }}>
                                                                    <option value="">-- Choose Room --</option>
                                                                    {availableRooms.map(r => (
                                                                        <option key={r.id} value={r.id}>Room {r.room_number} (Capacity: {r.capacity})</option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                            {selectedRoomDetails && (
                                                                <div>
                                                                    <label className="block text-sm font-medium mb-1">Select Seat</label>
                                                                    <select className="w-full border rounded-md p-2" value={allocateSeatId} onChange={e => setAllocateSeatId(e.target.value)}>
                                                                        <option value="">-- Choose Seat --</option>
                                                                        {selectedRoomDetails.seats.filter((s:any) => s.status === 'available').map((s:any) => (
                                                                            <option key={s.id} value={s.id}>Seat {s.seat_number}</option>
                                                                        ))}
                                                                    </select>
                                                                </div>
                                                            )}
                                                            <div className="flex justify-end gap-2 mt-4">
                                                                <Button onClick={() => handleAllocate(app.id)} disabled={!allocateSeatId} className="bg-indigo-600 text-white">Confirm Allocation</Button>
                                                            </div>
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                                <Button size="sm" variant="destructive" onClick={() => handleDeny(app.id)}>Deny</Button>
                                            </td>
                                        </tr>
                                    ))}
                                    {sortedApplications.length === 0 && (
                                        <tr><td colSpan={5} className="px-4 py-4 text-center text-gray-500">No pending applications</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Rooms Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Residential Rooms</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {rooms.map(room => {
                                const booked = room.seats.filter((s:any) => s.status === 'booked').length;
                                return (
                                    <Dialog key={room.id} open={selectedRoom?.id === room.id} onOpenChange={(open) => !open && setSelectedRoom(null)}>
                                        <DialogTrigger asChild>
                                            <div 
                                                onClick={() => setSelectedRoom(room)}
                                                className="border rounded-xl p-4 cursor-pointer hover:border-indigo-500 hover:shadow-md transition-all text-center flex flex-col items-center gap-2"
                                            >
                                                <Building className="w-8 h-8 text-indigo-400" />
                                                <div className="font-bold">{room.room_number}</div>
                                                <Badge variant={booked === room.capacity ? 'destructive' : 'secondary'}>
                                                    {booked}/{room.capacity}
                                                </Badge>
                                            </div>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-md">
                                            <DialogHeader>
                                                <DialogTitle>Room {room.room_number} Details</DialogTitle>
                                            </DialogHeader>
                                            <div className="py-4">
                                                <h4 className="font-medium mb-3">Seats</h4>
                                                <div className="flex flex-col gap-3">
                                                    {room.seats.map((seat:any) => {
                                                        const occupant = seat.student_residential;
                                                        const isBooked = seat.status === 'booked' && occupant?.user;
                                                        return (
                                                        <div key={seat.id} className="flex justify-between items-center p-3 border rounded-lg">
                                                            <div className="font-semibold">{seat.seat_number}</div>
                                                            <div>
                                                                {isBooked ? (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => { setSelectedRoom(null); setSelectedProfile(occupant); }}
                                                                        className="flex items-center gap-2 text-left rounded-md px-2 py-1 -my-1 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-colors group"
                                                                    >
                                                                        <div className="flex flex-col">
                                                                            <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400 group-hover:underline">{occupant.user.name}</span>
                                                                            <span className="text-xs text-muted-foreground">{occupant.user.academic?.student_id ?? 'N/A'}</span>
                                                                        </div>
                                                                        <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-900">Occupied</Badge>
                                                                    </button>
                                                                ) : (
                                                                    <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600">Available</Badge>
                                                                )}
                                                            </div>
                                                        </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

            </div>

            {/* Student Profile Modal (opened from a booked seat) */}
            <Dialog open={!!selectedProfile} onOpenChange={(open) => !open && setSelectedProfile(null)}>
                <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                    {selectedProfile && (() => {
                        const p = selectedProfile;
                        const u = p.user ?? {};
                        const academic = u.academic ?? {};
                        const address = u.address ?? {};
                        const guardian = u.guardian ?? {};
                        const income = guardian.annual_income_amount != null ? parseFloat(guardian.annual_income_amount) : null;
                        return (
                            <>
                                <DialogHeader>
                                    <DialogTitle className="flex items-center gap-2">
                                        <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
                                            <User className="w-5 h-5" />
                                        </span>
                                        {u.name}
                                    </DialogTitle>
                                </DialogHeader>

                                <div className="flex flex-col gap-5 pt-2">
                                    {/* Room placement */}
                                    <div className="rounded-xl border border-indigo-100 dark:border-indigo-900/50 bg-indigo-50/50 dark:bg-indigo-950/20 p-4">
                                        <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-semibold text-sm mb-3">
                                            <Home className="w-4 h-4" /> Room Placement
                                        </div>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                                            <div>
                                                <p className="text-xs text-muted-foreground uppercase tracking-wider">Hall</p>
                                                <p className="font-semibold">{p.hall?.name ?? hall.name}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground uppercase tracking-wider">Room</p>
                                                <p className="font-semibold">{p.seat?.room?.room_number ?? 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground uppercase tracking-wider">Seat</p>
                                                <p className="font-semibold">{p.seat?.seat_number ?? 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground uppercase tracking-wider">Resident Since</p>
                                                <p className="font-semibold">{p.staying_from ? new Date(p.staying_from).toLocaleDateString() : 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        {/* Account */}
                                        <div className="rounded-xl border p-4">
                                            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-sm mb-3">
                                                <User className="w-4 h-4" /> Account Information
                                            </div>
                                            <div className="space-y-3 text-sm">
                                                <div>
                                                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Email address</p>
                                                    <p className="font-semibold break-all">{u.email ?? 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Father's Name</p>
                                                    <p className="font-semibold">{guardian.father_name || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Mother's Name</p>
                                                    <p className="font-semibold">{guardian.mother_name || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Academics */}
                                        <div className="rounded-xl border p-4">
                                            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-sm mb-3">
                                                <GraduationCap className="w-4 h-4" /> Academics
                                            </div>
                                            <div className="grid grid-cols-2 gap-3 text-sm">
                                                <div>
                                                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Student ID</p>
                                                    <p className="font-bold">{academic.student_id ?? 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-muted-foreground uppercase tracking-wider">CGPA</p>
                                                    <p className="font-bold text-indigo-600 dark:text-indigo-400">{academic.current_cgpa ?? 'N/A'}</p>
                                                </div>
                                                <div className="col-span-2">
                                                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Faculty</p>
                                                    <p className="font-semibold">{academic.department ?? 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Degree</p>
                                                    <p className="font-semibold">{academic.degree ?? 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Level & Semester</p>
                                                    <p className="font-semibold">Level {academic.level ?? '-'} / Sem {academic.semester ?? '-'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Address */}
                                    <div className="rounded-xl border p-4">
                                        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-sm mb-3">
                                            <MapPin className="w-4 h-4" /> Address Details
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 border-b pb-1 mb-2">Permanent Address</h4>
                                                <p className="font-medium">{address.perm_village_area ?? 'N/A'}</p>
                                                <p className="text-xs text-muted-foreground mt-1">Upazilla: {address.perm_upazilla ?? 'N/A'}, District: {address.perm_district ?? 'N/A'}</p>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 border-b pb-1 mb-2">Present Address</h4>
                                                <p className="font-medium">{address.pres_village_area ?? 'N/A'}</p>
                                                <p className="text-xs text-muted-foreground mt-1">Upazilla: {address.pres_upazilla ?? 'N/A'}, District: {address.pres_district ?? 'N/A'}</p>
                                            </div>
                                            <div className="md:col-span-2 bg-slate-50 dark:bg-slate-950 p-3 rounded-xl flex justify-between items-center text-xs">
                                                <span className="font-semibold">Calculated Distance from Campus:</span>
                                                <span className="font-bold text-indigo-600 dark:text-indigo-400">{address.distance_from_home ?? 0} km</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Guardian & Financials */}
                                    <div className="rounded-xl border p-4">
                                        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-sm mb-3">
                                            <HeartHandshake className="w-4 h-4" /> Guardian & Financials
                                        </div>
                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                            <div>
                                                <p className="text-xs text-muted-foreground uppercase tracking-wider">Guardian Name</p>
                                                <p className="font-semibold">{guardian.guardian_name ?? 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground uppercase tracking-wider">Occupation</p>
                                                <p className="font-semibold">{guardian.guardian_occupation ?? 'N/A'}</p>
                                            </div>
                                            <div className="col-span-2 bg-indigo-50/30 dark:bg-indigo-950/10 p-3 rounded-xl flex justify-between items-center border border-indigo-100/50 dark:border-indigo-950/20">
                                                <span className="font-semibold text-slate-600 dark:text-slate-400">Guardian's Annual Income:</span>
                                                <span className="font-bold text-slate-900 dark:text-white">৳ {income != null && !isNaN(income) ? income.toLocaleString() : 'N/A'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        );
                    })()}
                </DialogContent>
            </Dialog>
        </>
    );
}

AdminDashboard.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: '/dashboard' }],
};
