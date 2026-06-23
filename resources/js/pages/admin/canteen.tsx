import { Head, router } from '@inertiajs/react';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Coffee, Sun, Moon, Calendar, Save, Trash2, Edit2, ListOrdered } from 'lucide-react';

interface Menu {
    day_of_week: string;
    breakfast: string | null;
    lunch: string | null;
    dinner: string | null;
}

interface Costing {
    id: number;
    date: string;
    breakfast_price: string;
    lunch_price: string;
    dinner_price: string;
}

interface BookingSummary {
    date: string;
    total_breakfast: string | number;
    total_lunch: string | number;
    total_dinner: string | number;
}

interface Props {
    hall: any;
    menus: Menu[];
    costings: Costing[];
    summaries: BookingSummary[];
}

const weekdays = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export default function CanteenAdmin({ hall, menus, costings, summaries }: Props) {
    const [activeTab, setActiveTab] = useState<'menu' | 'costing' | 'bookings'>('menu');

    // Menu Form State
    const [menuDay, setMenuDay] = useState<string>('Saturday');
    const [menuBreakfast, setMenuBreakfast] = useState<string>('');
    const [menuLunch, setMenuLunch] = useState<string>('');
    const [menuDinner, setMenuDinner] = useState<string>('');

    // Default Prices State
    const [defaultBreakfast, setDefaultBreakfast] = useState<number>(parseFloat(hall.canteen_default_breakfast_price));
    const [defaultLunch, setDefaultLunch] = useState<number>(parseFloat(hall.canteen_default_lunch_price));
    const [defaultDinner, setDefaultDinner] = useState<number>(parseFloat(hall.canteen_default_dinner_price));

    // Custom Date Costing State
    const [costingDate, setCostingDate] = useState<string>('');
    const [costingBreakfast, setCostingBreakfast] = useState<number>(0);
    const [costingLunch, setCostingLunch] = useState<number>(0);
    const [costingDinner, setCostingDinner] = useState<number>(0);

    // Helpers
    const getMenuForDay = (day: string) => {
        return menus.find(m => m.day_of_week.toLowerCase() === day.toLowerCase()) || {
            breakfast: '',
            lunch: '',
            dinner: ''
        };
    };

    // Actions
    const handleSelectDay = (day: string) => {
        setMenuDay(day);
        const m = getMenuForDay(day);
        setMenuBreakfast(m.breakfast || '');
        setMenuLunch(m.lunch || '');
        setMenuDinner(m.dinner || '');
    };

    const handleSaveMenu = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/admin/canteen/menu', {
            day_of_week: menuDay,
            breakfast: menuBreakfast,
            lunch: menuLunch,
            dinner: menuDinner
        });
    };

    const handleSaveDefaults = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/admin/canteen/defaults', {
            canteen_default_breakfast_price: defaultBreakfast,
            canteen_default_lunch_price: defaultLunch,
            canteen_default_dinner_price: defaultDinner
        });
    };

    const handleSaveCosting = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/admin/canteen/costing', {
            date: costingDate,
            breakfast_price: costingBreakfast,
            lunch_price: costingLunch,
            dinner_price: costingDinner
        }, {
            onSuccess: () => {
                setCostingDate('');
                setCostingBreakfast(0);
                setCostingLunch(0);
                setCostingDinner(0);
            }
        });
    };

    const handleDeleteCosting = (id: number) => {
        if (confirm('Are you sure you want to remove custom costing for this date? It will revert to default prices.')) {
            router.post('/admin/canteen/costing/delete', { id });
        }
    };

    return (
        <>
            <Head title="Canteen Management" />

            <div className="flex flex-col gap-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                
                {/* Header Section */}
                <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Canteen Management</h1>
                        <p className="text-slate-500 mt-1">{hall.name} - Kitchen Administration</p>
                    </div>
                </div>

                {/* Tabs selection */}
                <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6">
                    <button 
                        onClick={() => setActiveTab('menu')}
                        className={`pb-3 text-sm font-semibold border-b-2 transition-all ${
                            activeTab === 'menu' 
                                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400' 
                                : 'border-transparent text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        Weekly Menu Editor
                    </button>
                    <button 
                        onClick={() => setActiveTab('costing')}
                        className={`pb-3 text-sm font-semibold border-b-2 transition-all ${
                            activeTab === 'costing' 
                                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400' 
                                : 'border-transparent text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        Meal Costings & Pricing
                    </button>
                    <button 
                        onClick={() => setActiveTab('bookings')}
                        className={`pb-3 text-sm font-semibold border-b-2 transition-all ${
                            activeTab === 'bookings' 
                                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400' 
                                : 'border-transparent text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        Booking Summaries
                    </button>
                </div>

                {/* Tab Content */}
                {activeTab === 'menu' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Day Selector and Editor Form */}
                        <div className="lg:col-span-1 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Edit Day Menu</CardTitle>
                                    <CardDescription>Select a day to update its meals.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-1.5 mb-6">
                                        {weekdays.map(day => (
                                            <button
                                                key={day}
                                                type="button"
                                                onClick={() => handleSelectDay(day)}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                                    menuDay === day
                                                        ? 'bg-indigo-600 text-white shadow'
                                                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300'
                                                }`}
                                            >
                                                {day}
                                            </button>
                                        ))}
                                    </div>

                                    <form onSubmit={handleSaveMenu} className="space-y-4">
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5 mb-1.5">
                                                <Coffee className="w-3.5 h-3.5 text-amber-500" /> Breakfast Menu
                                            </label>
                                            <textarea 
                                                value={menuBreakfast} 
                                                onChange={e => setMenuBreakfast(e.target.value)}
                                                className="w-full border rounded-lg p-2.5 text-sm bg-transparent min-h-[70px]"
                                                placeholder="e.g. Khichuri, Egg, Tea"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5 mb-1.5">
                                                <Sun className="w-3.5 h-3.5 text-rose-500" /> Lunch Menu
                                            </label>
                                            <textarea 
                                                value={menuLunch} 
                                                onChange={e => setMenuLunch(e.target.value)}
                                                className="w-full border rounded-lg p-2.5 text-sm bg-transparent min-h-[70px]"
                                                placeholder="e.g. Rice, Fish Curry, Lentils"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5 mb-1.5">
                                                <Moon className="w-3.5 h-3.5 text-indigo-500" /> Dinner Menu
                                            </label>
                                            <textarea 
                                                value={menuDinner} 
                                                onChange={e => setMenuDinner(e.target.value)}
                                                className="w-full border rounded-lg p-2.5 text-sm bg-transparent min-h-[70px]"
                                                placeholder="e.g. Rice, Chicken Vuna, Vegetables"
                                            />
                                        </div>

                                        <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white gap-2">
                                            <Save className="w-4 h-4" /> Save Menu for {menuDay}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Complete Weekly Overview */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Weekly Menu Overview</CardTitle>
                                    <CardDescription>Current active menu of the week shown to students.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {weekdays.map(day => {
                                            const m = getMenuForDay(day);
                                            return (
                                                <div key={day} className="p-4 border dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/10 flex flex-col md:flex-row gap-4 items-start justify-between">
                                                    <div className="w-[100px] shrink-0 font-bold text-sm text-slate-900 dark:text-slate-100">{day}</div>
                                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                                                        <div>
                                                            <span className="font-semibold text-amber-600 dark:text-amber-400 block mb-1">Breakfast</span>
                                                            <p className="text-slate-600 dark:text-slate-400 whitespace-pre-line">{m.breakfast || 'Not set'}</p>
                                                        </div>
                                                        <div>
                                                            <span className="font-semibold text-rose-600 dark:text-rose-400 block mb-1">Lunch</span>
                                                            <p className="text-slate-600 dark:text-slate-400 whitespace-pre-line">{m.lunch || 'Not set'}</p>
                                                        </div>
                                                        <div>
                                                            <span className="font-semibold text-indigo-600 dark:text-indigo-400 block mb-1">Dinner</span>
                                                            <p className="text-slate-600 dark:text-slate-400 whitespace-pre-line">{m.dinner || 'Not set'}</p>
                                                        </div>
                                                    </div>
                                                    <Button variant="ghost" size="icon" onClick={() => handleSelectDay(day)} className="h-7 w-7 text-indigo-500">
                                                        <Edit2 className="w-3.5 h-3.5" />
                                                    </Button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}

                {activeTab === 'costing' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        {/* Costing setup forms */}
                        <div className="lg:col-span-1 space-y-6">
                            
                            {/* Defaults Config Card */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Default Prices</CardTitle>
                                    <CardDescription>Default meal pricing used when no custom date costings are set.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSaveDefaults} className="space-y-4">
                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <label className="text-xs font-semibold text-slate-500 mb-1 block">Breakfast</label>
                                                <input 
                                                    type="number" 
                                                    value={defaultBreakfast} 
                                                    onChange={e => setDefaultBreakfast(parseFloat(e.target.value) || 0)}
                                                    className="w-full border rounded-lg p-2 text-sm bg-transparent"
                                                    required 
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-semibold text-slate-500 mb-1 block">Lunch</label>
                                                <input 
                                                    type="number" 
                                                    value={defaultLunch} 
                                                    onChange={e => setDefaultLunch(parseFloat(e.target.value) || 0)}
                                                    className="w-full border rounded-lg p-2 text-sm bg-transparent"
                                                    required 
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-semibold text-slate-500 mb-1 block">Dinner</label>
                                                <input 
                                                    type="number" 
                                                    value={defaultDinner} 
                                                    onChange={e => setDefaultDinner(parseFloat(e.target.value) || 0)}
                                                    className="w-full border rounded-lg p-2 text-sm bg-transparent"
                                                    required 
                                                    min="0"
                                                />
                                            </div>
                                        </div>
                                        <Button type="submit" className="w-full bg-indigo-600 text-white gap-2">
                                            <Save className="w-4 h-4" /> Save Default Prices
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>

                            {/* Date specific costing Card */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Set Custom Date Costing</CardTitle>
                                    <CardDescription>Set meal prices for a specific date (e.g. for special feast meals).</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSaveCosting} className="space-y-4">
                                        <div>
                                            <label className="text-xs font-semibold text-slate-500 mb-1 block">Select Date</label>
                                            <input 
                                                type="date" 
                                                value={costingDate} 
                                                onChange={e => setCostingDate(e.target.value)}
                                                className="w-full border rounded-lg p-2 text-sm bg-transparent"
                                                required 
                                            />
                                        </div>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <label className="text-xs font-semibold text-slate-500 mb-1 block">Breakfast</label>
                                                <input 
                                                    type="number" 
                                                    value={costingBreakfast} 
                                                    onChange={e => setCostingBreakfast(parseFloat(e.target.value) || 0)}
                                                    className="w-full border rounded-lg p-2 text-sm bg-transparent"
                                                    required 
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-semibold text-slate-500 mb-1 block">Lunch</label>
                                                <input 
                                                    type="number" 
                                                    value={costingLunch} 
                                                    onChange={e => setCostingLunch(parseFloat(e.target.value) || 0)}
                                                    className="w-full border rounded-lg p-2 text-sm bg-transparent"
                                                    required 
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-semibold text-slate-500 mb-1 block">Dinner</label>
                                                <input 
                                                    type="number" 
                                                    value={costingDinner} 
                                                    onChange={e => setCostingDinner(parseFloat(e.target.value) || 0)}
                                                    className="w-full border rounded-lg p-2 text-sm bg-transparent"
                                                    required 
                                                    min="0"
                                                />
                                            </div>
                                        </div>
                                        <Button type="submit" className="w-full bg-indigo-600 text-white gap-2">
                                            <Save className="w-4 h-4" /> Save Custom Costing
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Existing custom pricing list */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Date-based Custom Prices</CardTitle>
                                    <CardDescription>Active costings configured for specific calendar dates.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {costings.length === 0 ? (
                                        <p className="text-sm text-slate-500 text-center py-6">No custom date-based pricing set. All dates are using defaults.</p>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm text-left">
                                                <thead className="text-xs uppercase bg-slate-50 dark:bg-slate-800 text-slate-500">
                                                    <tr>
                                                        <th className="px-4 py-3">Date</th>
                                                        <th className="px-4 py-3">Breakfast</th>
                                                        <th className="px-4 py-3">Lunch</th>
                                                        <th className="px-4 py-3">Dinner</th>
                                                        <th className="px-4 py-3 text-right">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {costings.map(c => (
                                                        <tr key={c.id} className="border-b dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                                                            <td className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">
                                                                {new Date(c.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                                                            </td>
                                                            <td className="px-4 py-3">৳{parseFloat(c.breakfast_price).toFixed(0)}</td>
                                                            <td className="px-4 py-3">৳{parseFloat(c.lunch_price).toFixed(0)}</td>
                                                            <td className="px-4 py-3">৳{parseFloat(c.dinner_price).toFixed(0)}</td>
                                                            <td className="px-4 py-3 text-right">
                                                                <Button variant="ghost" size="icon" onClick={() => handleDeleteCosting(c.id)} className="h-8 w-8 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20">
                                                                    <Trash2 className="w-4 h-4" />
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}

                {activeTab === 'bookings' && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ListOrdered className="w-5 h-5 text-indigo-500" /> Kitchen Booking Summary
                            </CardTitle>
                            <CardDescription>Aggregated total units booked by all students for breakfast, lunch, and dinner.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {summaries.length === 0 ? (
                                <p className="text-sm text-slate-500 text-center py-6">No meals booked by students for the upcoming period.</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="text-xs uppercase bg-slate-50 dark:bg-slate-800 text-slate-500">
                                            <tr>
                                                <th className="px-4 py-3">Meal Date</th>
                                                <th className="px-4 py-3 text-center">Breakfast Total (Units)</th>
                                                <th className="px-4 py-3 text-center">Lunch Total (Units)</th>
                                                <th className="px-4 py-3 text-center">Dinner Total (Units)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {summaries.map(s => (
                                                <tr key={s.date} className="border-b dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                                                    <td className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">
                                                        {new Date(s.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        <Badge variant="outline" className="px-3 py-1 bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-300 dark:border-amber-900/50 font-bold text-sm">
                                                            {s.total_breakfast} units
                                                        </Badge>
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        <Badge variant="outline" className="px-3 py-1 bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-300 dark:border-rose-900/50 font-bold text-sm">
                                                            {s.total_lunch} units
                                                        </Badge>
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        <Badge variant="outline" className="px-3 py-1 bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/20 dark:text-indigo-300 dark:border-indigo-900/50 font-bold text-sm">
                                                            {s.total_dinner} units
                                                        </Badge>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

            </div>
        </>
    );
}

CanteenAdmin.layout = {
    breadcrumbs: [
        {
            title: 'Canteen Management',
            href: '/admin/canteen',
        },
    ],
};
