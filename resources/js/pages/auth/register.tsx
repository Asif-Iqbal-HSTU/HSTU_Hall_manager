import { useState } from 'react';
import { Form, Head, Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { store } from '@/routes/register';
import { 
    User, 
    GraduationCap, 
    MapPin, 
    Home, 
    HeartHandshake, 
    ArrowLeft, 
    ArrowRight, 
    Check,
    Lock
} from 'lucide-react';
import districtsUpazilasData from '@/data/districts_upazilas.json';

const suggestedDegrees: Record<string, string[]> = {
    "Agriculture": [
        "B. Sc in Agriculture (Hons.)"
    ],
    "Computer Science and Engineering": [
        "B.Sc. (Engineering) in Computer Science and Engineering.",
        "B.Sc. (Engineering) in Electronic and Communication Engineering.",
        "B.Sc. (Engineering) in Electrical and Electronic Engineering."
    ],
    "Business Studies": [
        "Bachelor of Business Administration (BBA).",
        "MBA in HRM, Finance, Marketing, Accounting and Information Systems.",
        "MBA (Evening)."
    ],
    "Fisheries": [
        "B. Sc in Fisheries.(Hons.)"
    ],
    "Veterinary and Animal Science": [
        "Doctor of Veterinary Medicine"
    ],
    "Engineering": [
        "B.Sc. in Food and Process Engineering",
        "B. Sc. in Agricultural Engineering",
        "Bachelor of Architecture",
        "B. Sc. in Civil Engineering",
        "B. Sc. in Mechanical Engineering"
    ],
    "Science": [
        "B.Sc. in Chemistry",
        "B.Sc. in Physics",
        "B.Sc. in Mathematics",
        "B.Sc. in Statistics"
    ],
    "Social Science and Humanities": [
        "B.S.S. (Hons) in Sociology",
        "B.S.S. (Hons) in Economics",
        "B.A. (Hons) in English",
        "B.S.S. (Hons) in Development Studies"
    ]
};

interface Hall {
    id: number;
    name: string;
    gender: string;
    floors?: Array<{
        id: number;
        rooms?: Array<{
            id: number;
            room_number: string;
            seats?: Array<{
                id: number;
                seat_number: string;
                status: string;
            }>;
        }>;
    }>;
}

interface District {
    id: number;
    district: string;
    distance: number;
}

export default function Register({ 
    halls = [], 
    districts = [] 
}: { 
    halls?: Hall[]; 
    districts?: District[] 
}) {
    const [step, setStep] = useState(1);
    const [sameAddress, setSameAddress] = useState(false);

    // Form inputs state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        student_id: '',
        department: '',
        degree: '',
        level: '1',
        semester: 'I',
        current_cgpa: '',
        perm_district: '',
        perm_upazilla: '',
        perm_village_area: '',
        pres_district: '',
        pres_upazilla: '',
        pres_village_area: '',
        status: 'Non-Residential',
        hall_id: '',
        room_no: '',
        seat_no: '',
        staying_from: '',
        father_name: '',
        mother_name: '',
        guardian_name: '',
        guardian_occupation: '',
        annual_income_amount: '',
        distance_from_home: '0',
    });

    const [isCustomDegree, setIsCustomDegree] = useState(false);
    const [fetchingDistance, setFetchingDistance] = useState(false);

    const handleChange = (field: string, value: string) => {
        setFormData(prev => {
            const next = { ...prev, [field]: value } as any;
            
            // Sync present address if 'Same as Permanent' is checked
            if (sameAddress && field.startsWith('perm_')) {
                const presentField = field.replace('perm_', 'pres_');
                next[presentField] = value;
            }
            
            return next;
        });
    };

    const handleSameAddressChange = (checked: boolean) => {
        setSameAddress(checked);
        if (checked) {
            setFormData(prev => ({
                ...prev,
                pres_district: prev.perm_district,
                pres_upazilla: prev.perm_upazilla,
                pres_village_area: prev.perm_village_area,
            }));
        }
    };

    const calculateDistance = async (district: string, upazila: string) => {
        if (!district || !upazila) return;
        
        const upazilas = (districtsUpazilasData as Record<string, Array<{ upazila: string; id: number }>>)[district];
        if (!upazilas) return;
        
        const found = upazilas.find(u => u.upazila === upazila);
        if (!found) return;
        
        setFetchingDistance(true);
        try {
            const response = await fetch(`/api/distance?upazila_id=${found.id}&district=${encodeURIComponent(district)}`);
            const data = await response.json();
            if (data && typeof data.distance === 'number') {
                handleChange('distance_from_home', data.distance.toString());
            }
        } catch (error) {
            console.error('Error fetching distance:', error);
        } finally {
            setFetchingDistance(false);
        }
    };

    const handleDistrictChange = (field: 'perm_district' | 'pres_district', value: string) => {
        handleChange(field, value);
        const upazilaField = field === 'perm_district' ? 'perm_upazilla' : 'pres_upazilla';
        handleChange(upazilaField, '');
        
        if (field === 'perm_district') {
            handleChange('distance_from_home', '0');
        }
    };

    const handleUpazillaChange = (field: 'perm_upazilla' | 'pres_upazilla', value: string) => {
        handleChange(field, value);
        
        if (field === 'perm_upazilla') {
            calculateDistance(formData.perm_district, value);
        }
    };

    // Filter available seats for the selected hall
    const selectedHall = halls.find(h => h.id.toString() === formData.hall_id);
    const availableSeats: Array<{ id: number; label: string }> = [];
    if (selectedHall?.floors) {
        selectedHall.floors.forEach(floor => {
            floor.rooms?.forEach(room => {
                room.seats?.forEach(seat => {
                    if (seat.status === 'available') {
                        availableSeats.push({
                            id: seat.id,
                            label: `Room ${room.room_number} - Seat ${seat.seat_number}`
                        });
                    }
                });
            });
        });
    }

    const steps = [
        { id: 1, title: 'Account', icon: User },
        { id: 2, title: 'Academics', icon: GraduationCap },
        { id: 3, title: 'Addresses', icon: MapPin },
        { id: 4, title: 'Residential', icon: Home },
        { id: 5, title: 'Guardian', icon: HeartHandshake },
    ];

    const nextStep = () => {
        // Basic validation before going to next step
        if (step === 1 && (!formData.name || !formData.email)) return;
        if (step === 2 && (!formData.student_id || !formData.department || !formData.degree || !formData.current_cgpa)) return;
        if (step === 3 && (!formData.perm_district || !formData.perm_upazilla || !formData.perm_village_area || fetchingDistance)) return;
        if (step === 4 && formData.status === 'Residential' && (!formData.hall_id || !formData.room_no || !formData.seat_no)) return;
        
        setStep(prev => Math.min(prev + 1, 5));
    };

    const prevStep = () => {
        setStep(prev => Math.max(prev - 1, 1));
    };

    return (
        <>
            <Head title="Register Student" />
            <div className="min-h-screen bg-slate-50 text-slate-900 font-sans dark:bg-slate-950 dark:text-slate-100 selection:bg-indigo-500 selection:text-white flex flex-col justify-between">
                
                {/* Minimal Header */}
                <header className="px-6 py-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
                    <Link href="/" className="flex items-center gap-3 group">
                        <img className="h-9 w-auto" src="/images/hstu_logo.png" alt="HSTU Logo" />
                        <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">
                            HSTU Hall Portal
                        </span>
                    </Link>
                    <div className="text-sm">
                        Already registered?{' '}
                        <Link href={login()} className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                            Log in &rarr;
                        </Link>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 flex items-center justify-center p-6 md:p-12 relative overflow-hidden">
                    {/* Background Decorative Blob */}
                    <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl" aria-hidden="true">
                        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#9089fc] to-[#f472b6] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72rem]" />
                    </div>

                    <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-4 min-h-[500px]">
                        
                        {/* Left Sidebar Steps Navigator (Web) */}
                        <div className="bg-slate-50 dark:bg-slate-950 p-8 border-r border-slate-200 dark:border-slate-800 hidden lg:block col-span-1">
                            <div className="space-y-6">
                                <h3 className="font-bold text-slate-400 text-xs uppercase tracking-wider mb-8">Registration Steps</h3>
                                {steps.map((s) => {
                                    const IconComponent = s.icon;
                                    const isActive = s.id === step;
                                    const isCompleted = s.id < step;
                                    return (
                                        <div key={s.id} className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                                                isActive 
                                                    ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-500/20' 
                                                    : isCompleted 
                                                        ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300' 
                                                        : 'bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                                            }`}>
                                                {isCompleted ? <Check className="w-4 h-4" /> : <IconComponent className="w-4 h-4" />}
                                            </div>
                                            <span className={`text-sm font-semibold transition-all ${
                                                isActive 
                                                    ? 'text-slate-900 dark:text-white font-bold' 
                                                    : 'text-slate-400 dark:text-slate-500'
                                            }`}>
                                                {s.title}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Right Content Form Area */}
                        <div className="p-8 lg:p-12 col-span-3 flex flex-col justify-between">
                            
                            {/* Step Indicator (Mobile) */}
                            <div className="lg:hidden flex items-center justify-between mb-8 pb-4 border-b">
                                <span className="font-bold text-sm text-indigo-600">
                                    Step {step} of 5: {steps[step - 1].title}
                                </span>
                                <div className="flex gap-1">
                                    {steps.map((s) => (
                                        <div 
                                            key={s.id} 
                                            className={`h-1.5 w-6 rounded-full transition-all ${
                                                s.id === step 
                                                    ? 'bg-indigo-600' 
                                                    : s.id < step 
                                                        ? 'bg-green-500' 
                                                        : 'bg-slate-200 dark:bg-slate-800'
                                            }`} 
                                        />
                                    ))}
                                </div>
                            </div>

                            <Form
                                {...store.form()}
                                disableWhileProcessing
                                className="flex-1 flex flex-col justify-between"
                            >
                                {({ processing, errors }) => (
                                    <>
                                        {/* STEP 1: Account Details */}
                                        <div className={step !== 1 ? 'hidden' : 'space-y-6'}>
                                            <div className="space-y-1">
                                                <h2 className="text-2xl font-extrabold tracking-tight">Create your account</h2>
                                                <p className="text-sm text-slate-500 dark:text-slate-400">Enter your core identification credentials.</p>
                                            </div>

                                            <div className="grid gap-4">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="name">Full Name</Label>
                                                    <Input
                                                        id="name"
                                                        name="name"
                                                        type="text"
                                                        required
                                                        placeholder="e.g. Asif Iqbal"
                                                        value={formData.name}
                                                        onChange={(e) => handleChange('name', e.target.value)}
                                                    />
                                                    <InputError message={errors.name} />
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label htmlFor="email">Email address</Label>
                                                    <Input
                                                        id="email"
                                                        name="email"
                                                        type="email"
                                                        required
                                                        placeholder="yourname@domain.com"
                                                        value={formData.email}
                                                        onChange={(e) => handleChange('email', e.target.value)}
                                                    />
                                                    <InputError message={errors.email} />
                                                </div>
                                            </div>
                                        </div>

                                        {/* STEP 2: Academics */}
                                        <div className={step !== 2 ? 'hidden' : 'space-y-6'}>
                                            <div className="space-y-1">
                                                <h2 className="text-2xl font-extrabold tracking-tight">Academic Information</h2>
                                                <p className="text-sm text-slate-500 dark:text-slate-400">Provide your official university academic records.</p>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="grid gap-2 col-span-2">
                                                    <Label htmlFor="student_id">Student ID</Label>
                                                    <Input
                                                        id="student_id"
                                                        name="student_id"
                                                        type="text"
                                                        required
                                                        placeholder="e.g. 1902001"
                                                        value={formData.student_id}
                                                        onChange={(e) => handleChange('student_id', e.target.value)}
                                                    />
                                                    <InputError message={errors.student_id} />
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label htmlFor="department">Faculty</Label>
                                                    <select
                                                        id="department"
                                                        name="department"
                                                        required
                                                        className="w-full border rounded-md p-2 bg-transparent text-sm dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                                                        value={formData.department}
                                                        onChange={(e) => {
                                                            handleChange('department', e.target.value);
                                                            handleChange('degree', '');
                                                            setIsCustomDegree(false);
                                                        }}
                                                    >
                                                        <option value="">-- Select Faculty --</option>
                                                        <option value="Agriculture">Faculty of Agriculture</option>
                                                        <option value="Computer Science and Engineering">Faculty of Computer Science and Engineering</option>
                                                        <option value="Business Studies">Faculty of Business Studies</option>
                                                        <option value="Fisheries">Faculty of Fisheries</option>
                                                        <option value="Veterinary and Animal Science">Faculty of Veterinary and Animal Science</option>
                                                        <option value="Engineering">Faculty of Engineering</option>
                                                        <option value="Science">Faculty of Science</option>
                                                        <option value="Social Science and Humanities">Faculty of Social Science and Humanities</option>
                                                    </select>
                                                    <InputError message={errors.department} />
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label htmlFor="degree">Degree Program</Label>
                                                    {isCustomDegree || !formData.department ? (
                                                        <div className="flex gap-2">
                                                            <div className="flex-1">
                                                                <Input
                                                                    id="degree"
                                                                    name="degree"
                                                                    type="text"
                                                                    required
                                                                    placeholder="e.g. MSc in CSE"
                                                                    value={formData.degree}
                                                                    onChange={(e) => handleChange('degree', e.target.value)}
                                                                />
                                                            </div>
                                                            {formData.department && (
                                                                <Button 
                                                                    type="button" 
                                                                    variant="outline" 
                                                                    onClick={() => {
                                                                        setIsCustomDegree(false);
                                                                        handleChange('degree', '');
                                                                    }}
                                                                    className="text-xs"
                                                                >
                                                                    Suggest
                                                                </Button>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <select
                                                            id="degree"
                                                            name="degree"
                                                            required
                                                            className="w-full border rounded-md p-2 bg-transparent text-sm dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                                                            value={formData.degree}
                                                            onChange={(e) => {
                                                                if (e.target.value === 'custom_other') {
                                                                    setIsCustomDegree(true);
                                                                    handleChange('degree', '');
                                                                } else {
                                                                    handleChange('degree', e.target.value);
                                                                }
                                                            }}
                                                        >
                                                            <option value="">-- Select Degree --</option>
                                                            {(suggestedDegrees[formData.department] || []).map((deg) => (
                                                                <option key={deg} value={deg}>{deg}</option>
                                                            ))}
                                                            <option value="custom_other">Other (Enter manually...)</option>
                                                        </select>
                                                    )}
                                                    <InputError message={errors.degree} />
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label htmlFor="level">Level</Label>
                                                    <select
                                                        id="level"
                                                        name="level"
                                                        className="w-full border rounded-md p-2 bg-transparent text-sm dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                                                        value={formData.level}
                                                        onChange={(e) => handleChange('level', e.target.value)}
                                                    >
                                                        <option value="1">Level 1</option>
                                                        <option value="2">Level 2</option>
                                                        <option value="3">Level 3</option>
                                                        <option value="4">Level 4</option>
                                                    </select>
                                                    <InputError message={errors.level} />
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label htmlFor="semester">Semester</Label>
                                                    <select
                                                        id="semester"
                                                        name="semester"
                                                        className="w-full border rounded-md p-2 bg-transparent text-sm dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                                                        value={formData.semester}
                                                        onChange={(e) => handleChange('semester', e.target.value)}
                                                    >
                                                        <option value="I">Semester I</option>
                                                        <option value="II">Semester II</option>
                                                    </select>
                                                    <InputError message={errors.semester} />
                                                </div>

                                                <div className="grid gap-2 col-span-2">
                                                    <Label htmlFor="current_cgpa">Current CGPA</Label>
                                                    <Input
                                                        id="current_cgpa"
                                                        name="current_cgpa"
                                                        type="number"
                                                        step="0.01"
                                                        min="0.00"
                                                        max="4.00"
                                                        required
                                                        placeholder="0.00 - 4.00"
                                                        value={formData.current_cgpa}
                                                        onChange={(e) => handleChange('current_cgpa', e.target.value)}
                                                    />
                                                    <InputError message={errors.current_cgpa} />
                                                </div>
                                            </div>
                                        </div>

                                        {/* STEP 3: Address Details */}
                                        <div className={step !== 3 ? 'hidden' : 'space-y-6'}>
                                            <div className="space-y-1">
                                                <h2 className="text-2xl font-extrabold tracking-tight">Address Details</h2>
                                                <p className="text-sm text-slate-500 dark:text-slate-400">Fill in your present and permanent address parameters.</p>
                                            </div>

                                            <div className="space-y-4 max-h-[380px] overflow-y-auto pr-2">
                                                {/* Permanent Address */}
                                                <div className="space-y-3">
                                                    <h4 className="font-bold text-sm text-indigo-600 dark:text-indigo-400 border-b pb-1">Permanent Address</h4>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        <div className="grid gap-1">
                                                            <Label htmlFor="perm_district" className="text-xs">District</Label>
                                                            <select
                                                                id="perm_district"
                                                                name="perm_district"
                                                                className="w-full border rounded-md p-2 bg-transparent text-sm dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                                                                value={formData.perm_district}
                                                                onChange={(e) => handleDistrictChange('perm_district', e.target.value)}
                                                            >
                                                                <option value="">-- Select District --</option>
                                                                {Object.keys(districtsUpazilasData).map(dName => (
                                                                    <option key={dName} value={dName}>{dName}</option>
                                                                ))}
                                                            </select>
                                                            <InputError message={errors.perm_district} />
                                                        </div>
                                                        <div className="grid gap-1">
                                                            <Label htmlFor="perm_upazilla" className="text-xs">Upazilla</Label>
                                                            <select
                                                                id="perm_upazilla"
                                                                name="perm_upazilla"
                                                                className="w-full border rounded-md p-2 bg-transparent text-sm dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                                                                disabled={!formData.perm_district}
                                                                value={formData.perm_upazilla}
                                                                onChange={(e) => handleUpazillaChange('perm_upazilla', e.target.value)}
                                                            >
                                                                <option value="">-- Select Upazilla --</option>
                                                                {((districtsUpazilasData as Record<string, Array<{ upazila: string; id: number }>>)[formData.perm_district] || []).map(u => (
                                                                    <option key={u.id} value={u.upazila}>{u.upazila}</option>
                                                                ))}
                                                            </select>
                                                            <InputError message={errors.perm_upazilla} />
                                                        </div>
                                                        <div className="grid gap-1 col-span-2">
                                                            <Label htmlFor="perm_village_area" className="text-xs">Village / Area</Label>
                                                            <Input
                                                                id="perm_village_area"
                                                                name="perm_village_area"
                                                                placeholder="Village, Road, House No"
                                                                value={formData.perm_village_area}
                                                                onChange={(e) => handleChange('perm_village_area', e.target.value)}
                                                            />
                                                            <InputError message={errors.perm_village_area} />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Present Address */}
                                                <div className="space-y-3 pt-3">
                                                    <div className="flex justify-between items-center border-b pb-1">
                                                        <h4 className="font-bold text-sm text-indigo-600 dark:text-indigo-400">Present Address</h4>
                                                        <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                                                            <input 
                                                                type="checkbox" 
                                                                checked={sameAddress} 
                                                                onChange={(e) => handleSameAddressChange(e.target.checked)} 
                                                                className="rounded border-slate-300 text-indigo-600"
                                                            />
                                                            Same as Permanent
                                                        </label>
                                                    </div>
                                                    {!sameAddress && (
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                            <div className="grid gap-1">
                                                                <Label htmlFor="pres_district" className="text-xs">District</Label>
                                                                <select
                                                                    id="pres_district"
                                                                    name="pres_district"
                                                                    className="w-full border rounded-md p-2 bg-transparent text-sm dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                                                                    value={formData.pres_district}
                                                                    onChange={(e) => handleDistrictChange('pres_district', e.target.value)}
                                                                >
                                                                    <option value="">-- Select District --</option>
                                                                    {Object.keys(districtsUpazilasData).map(dName => (
                                                                        <option key={dName} value={dName}>{dName}</option>
                                                                    ))}
                                                                </select>
                                                                <InputError message={errors.pres_district} />
                                                            </div>
                                                            <div className="grid gap-1">
                                                                <Label htmlFor="pres_upazilla" className="text-xs">Upazilla</Label>
                                                                <select
                                                                    id="pres_upazilla"
                                                                    name="pres_upazilla"
                                                                    className="w-full border rounded-md p-2 bg-transparent text-sm dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                                                                    disabled={!formData.pres_district}
                                                                    value={formData.pres_upazilla}
                                                                    onChange={(e) => handleUpazillaChange('pres_upazilla', e.target.value)}
                                                                >
                                                                    <option value="">-- Select Upazilla --</option>
                                                                    {((districtsUpazilasData as Record<string, Array<{ upazila: string; id: number }>>)[formData.pres_district] || []).map(u => (
                                                                        <option key={u.id} value={u.upazila}>{u.upazila}</option>
                                                                    ))}
                                                                </select>
                                                                <InputError message={errors.pres_upazilla} />
                                                            </div>
                                                            <div className="grid gap-1 col-span-2">
                                                                <Label htmlFor="pres_village_area" className="text-xs">Village / Area</Label>
                                                                <Input
                                                                    id="pres_village_area"
                                                                    name="pres_village_area"
                                                                    placeholder="Present Village, Road, Flat"
                                                                    value={formData.pres_village_area}
                                                                    onChange={(e) => handleChange('pres_village_area', e.target.value)}
                                                                />
                                                                <InputError message={errors.pres_village_area} />
                                                            </div>
                                                        </div>
                                                    )}
                                                    {/* Distance calculation display & hidden fields */}
                                                    <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl flex flex-col md:flex-row justify-between items-center text-sm gap-2 border border-slate-200 dark:border-slate-800">
                                                        <span className="font-semibold text-slate-600 dark:text-slate-400">Calculated Distance from Campus:</span>
                                                        {fetchingDistance ? (
                                                            <div className="flex items-center gap-2">
                                                                <Spinner className="w-4 h-4 text-indigo-600" />
                                                                <span className="text-xs text-muted-foreground">Calculating via iBAS++...</span>
                                                            </div>
                                                        ) : (
                                                            <span className="font-bold text-indigo-600 dark:text-indigo-400 text-lg">
                                                                {formData.distance_from_home} km
                                                            </span>
                                                        )}
                                                    </div>
                                                    <input type="hidden" name="distance_from_home" value={formData.distance_from_home} />

                                                    {/* Hidden present fields to keep serialized values in form */}
                                                    {sameAddress && (
                                                        <>
                                                            <input type="hidden" name="pres_district" value={formData.pres_district} />
                                                            <input type="hidden" name="pres_upazilla" value={formData.pres_upazilla} />
                                                            <input type="hidden" name="pres_village_area" value={formData.pres_village_area} />
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* STEP 4: Residential */}
                                        <div className={step !== 4 ? 'hidden' : 'space-y-6'}>
                                            <div className="space-y-1">
                                                <h2 className="text-2xl font-extrabold tracking-tight">Residential Status</h2>
                                                <p className="text-sm text-slate-500 dark:text-slate-400">Select your current hall residency status.</p>
                                            </div>

                                            <div className="grid gap-4">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="status">Residency Status</Label>
                                                    <select
                                                        id="status"
                                                        name="status"
                                                        className="w-full border rounded-md p-2 bg-transparent text-sm dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                                                        value={formData.status}
                                                        onChange={(e) => handleChange('status', e.target.value)}
                                                    >
                                                        <option value="Non-Residential">Non-Residential</option>
                                                        <option value="Residential">Residential</option>
                                                    </select>
                                                    <InputError message={errors.status} />
                                                </div>

                                                {formData.status === 'Residential' && (
                                                    <>
                                                        <div className="grid gap-2">
                                                            <Label htmlFor="hall_id">Assigned Hall</Label>
                                                            <select
                                                                id="hall_id"
                                                                name="hall_id"
                                                                className="w-full border rounded-md p-2 bg-transparent text-sm dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                                                                value={formData.hall_id}
                                                                onChange={(e) => handleChange('hall_id', e.target.value)}
                                                            >
                                                                <option value="">-- Select Hall --</option>
                                                                {halls.map(h => (
                                                                    <option key={h.id} value={h.id}>{h.name} ({h.gender})</option>
                                                                ))}
                                                            </select>
                                                            <InputError message={errors.hall_id} />
                                                        </div>

                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                             <div className="grid gap-2">
                                                                 <Label htmlFor="room_no">Room No.</Label>
                                                                 <Input
                                                                     id="room_no"
                                                                     name="room_no"
                                                                     type="text"
                                                                     placeholder="e.g. 305"
                                                                     required={formData.status === 'Residential'}
                                                                     disabled={!formData.hall_id}
                                                                     value={formData.room_no}
                                                                     onChange={(e) => handleChange('room_no', e.target.value)}
                                                                 />
                                                                 <InputError message={errors.room_no} />
                                                             </div>

                                                             <div className="grid gap-2">
                                                                 <Label htmlFor="seat_no">Seat No.</Label>
                                                                 <Input
                                                                     id="seat_no"
                                                                     name="seat_no"
                                                                     type="text"
                                                                     placeholder="e.g. 305-A"
                                                                     required={formData.status === 'Residential'}
                                                                     disabled={!formData.hall_id}
                                                                     value={formData.seat_no}
                                                                     onChange={(e) => handleChange('seat_no', e.target.value)}
                                                                 />
                                                                 <InputError message={errors.seat_no} />
                                                             </div>
                                                         </div>

                                                        <div className="grid gap-2">
                                                            <Label htmlFor="staying_from">Staying From (Optional)</Label>
                                                            <Input
                                                                id="staying_from"
                                                                name="staying_from"
                                                                type="date"
                                                                value={formData.staying_from}
                                                                onChange={(e) => handleChange('staying_from', e.target.value)}
                                                            />
                                                            <InputError message={errors.staying_from} />
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {/* STEP 5: Guardian Details */}
                                        <div className={step !== 5 ? 'hidden' : 'space-y-6'}>
                                            <div className="space-y-1">
                                                <h2 className="text-2xl font-extrabold tracking-tight">Guardian & Financials</h2>
                                                <p className="text-sm text-slate-500 dark:text-slate-400">Fill in family and financial parameters.</p>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="father_name">Father's Name (Optional)</Label>
                                                    <Input
                                                        id="father_name"
                                                        name="father_name"
                                                        placeholder="Father's full name"
                                                        value={formData.father_name}
                                                        onChange={(e) => handleChange('father_name', e.target.value)}
                                                    />
                                                    <InputError message={errors.father_name} />
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label htmlFor="mother_name">Mother's Name (Optional)</Label>
                                                    <Input
                                                        id="mother_name"
                                                        name="mother_name"
                                                        placeholder="Mother's full name"
                                                        value={formData.mother_name}
                                                        onChange={(e) => handleChange('mother_name', e.target.value)}
                                                    />
                                                    <InputError message={errors.mother_name} />
                                                </div>

                                                <div className="grid gap-2 col-span-2">
                                                    <Label htmlFor="guardian_occupation">Guardian's Occupation</Label>
                                                    <Input
                                                        id="guardian_occupation"
                                                        name="guardian_occupation"
                                                        required
                                                        placeholder="e.g. Farmer, Teacher, Businessman"
                                                        value={formData.guardian_occupation}
                                                        onChange={(e) => handleChange('guardian_occupation', e.target.value)}
                                                    />
                                                    <InputError message={errors.guardian_occupation} />
                                                </div>

                                                <div className="grid gap-2 col-span-2">
                                                    <Label htmlFor="annual_income_amount">Guardian's Annual Income (Tk)</Label>
                                                    <Input
                                                        id="annual_income_amount"
                                                        name="annual_income_amount"
                                                        type="number"
                                                        required
                                                        placeholder="Yearly income amount in BDT"
                                                        value={formData.annual_income_amount}
                                                        onChange={(e) => handleChange('annual_income_amount', e.target.value)}
                                                    />
                                                    <InputError message={errors.annual_income_amount} />
                                                </div>
                                            </div>

                                            <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50 flex items-start gap-3 mt-4 text-xs">
                                                <Lock className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                                                <div>
                                                    <span className="font-bold block mb-0.5 text-indigo-950 dark:text-indigo-200">Secure Password Auto-generation</span>
                                                    To simplify onboarding, your password will be generated automatically. You'll view and copy it on the dashboard immediately after registering.
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action buttons */}
                                        <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                                            {step > 1 ? (
                                                <Button 
                                                    type="button" 
                                                    variant="outline" 
                                                    onClick={prevStep}
                                                    className="gap-2 rounded-full border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                                                >
                                                    <ArrowLeft className="w-4 h-4" /> Back
                                                </Button>
                                            ) : (
                                                <div />
                                            )}

                                            {step < 5 ? (
                                                <Button 
                                                    type="button" 
                                                    onClick={nextStep}
                                                    className="bg-indigo-600 text-white hover:bg-indigo-500 gap-2 rounded-full px-6 shadow-md shadow-indigo-600/10 hover:shadow-lg"
                                                >
                                                    Next <ArrowRight className="w-4 h-4" />
                                                </Button>
                                            ) : (
                                                <Button 
                                                    type="submit" 
                                                    className="bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-500 hover:to-fuchsia-500 text-white gap-2 rounded-full px-8 shadow-md"
                                                    data-test="register-user-button"
                                                >
                                                    {processing && <Spinner />}
                                                    Complete Registration
                                                </Button>
                                            )}
                                        </div>
                                    </>
                                )}
                            </Form>
                        </div>
                    </div>
                </main>

                {/* Minimal Footer */}
                <footer className="py-6 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400">
                    &copy; {new Date().getFullYear()} Hajee Mohammad Danesh Science and Technology University (HSTU). All rights reserved.
                </footer>
            </div>
        </>
    );
}
