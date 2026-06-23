import { Head, router } from '@inertiajs/react';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Coffee, Sun, Moon, Calendar, ChevronLeft, ChevronRight, Lock, Save, UtensilsCrossed } from 'lucide-react';

interface Menu {
    day_of_week: string;
    breakfast: string | null;
    lunch: string | null;
    dinner: string | null;
}

interface Booking {
    date: string;
    breakfast_units: number;
    lunch_units: number;
    dinner_units: number;
}

interface Costing {
    date: string;
    breakfast_price: string;
    lunch_price: string;
    dinner_price: string;
}

interface Props {
    hall: any;
    menus: Menu[];
    bookings: Booking[];
    costings: Costing[];
}

const weekdays = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export default function CanteenIndex({ hall, menus, bookings, costings }: Props) {
    const [selectedMenuDay, setSelectedMenuDay] = useState<string>('Saturday');
    
    // Calendar Navigation State
    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Selected Day booking modal state
    const [bookingModalOpen, setBookingModalOpen] = useState(false);
    const [selectedDateStr, setSelectedDateStr] = useState<string>('');
    const [breakfastUnits, setBreakfastUnits] = useState<number>(0);
    const [lunchUnits, setLunchUnits] = useState<number>(0);
    const [dinnerUnits, setDinnerUnits] = useState<number>(0);

    // Helpers
    const getMenuForDay = (day: string) => {
        return menus.find(m => m.day_of_week.toLowerCase() === day.toLowerCase()) || {
            breakfast: 'No menu set',
            lunch: 'No menu set',
            dinner: 'No menu set'
        };
    };

    const getBookingForDate = (dateStr: string) => {
        return bookings.find(b => b.date === dateStr);
    };

    const getPricesForDate = (dateStr: string) => {
        const costing = costings.find(c => c.date === dateStr);
        if (costing) {
            return {
                breakfast: parseFloat(costing.breakfast_price),
                lunch: parseFloat(costing.lunch_price),
                dinner: parseFloat(costing.dinner_price)
            };
        }
        return {
            breakfast: parseFloat(hall.canteen_default_breakfast_price),
            lunch: parseFloat(hall.canteen_default_lunch_price),
            dinner: parseFloat(hall.canteen_default_dinner_price)
        };
    };

    const isDateLocked = (dateStr: string) => {
        const bookingDate = new Date(dateStr);
        bookingDate.setHours(0, 0, 0, 0);
        
        // Deadline is previous day at 5:00 PM
        const deadline = new Date(bookingDate);
        deadline.setDate(deadline.getDate() - 1);
        deadline.setHours(17, 0, 0, 0);
        
        return new Date() > deadline;
    };

    const handleCellClick = (dateStr: string) => {
        const locked = isDateLocked(dateStr);
        if (locked) return; // Prevent opening edit modal for locked dates

        const booking = getBookingForDate(dateStr);
        setSelectedDateStr(dateStr);
        setBreakfastUnits(booking ? booking.breakfast_units : 0);
        setLunchUnits(booking ? booking.lunch_units : 0);
        setDinnerUnits(booking ? booking.dinner_units : 0);
        setBookingModalOpen(true);
    };

    const handleSaveBooking = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/canteen/book', {
            date: selectedDateStr,
            breakfast_units: breakfastUnits,
            lunch_units: lunchUnits,
            dinner_units: dinnerUnits
        }, {
            onSuccess: () => setBookingModalOpen(false)
        });
    };

    // Calendar Generation
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday

    const prevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const currentMenu = getMenuForDay(selectedMenuDay);

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Calendar Cells Generation
    const cells = [];
    // Padding offsets
    for (let i = 0; i < firstDayIndex; i++) {
        cells.push(<div key={`empty-${i}`} className="min-h-[100px] border border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/10 rounded-lg"></div>);
    }
    // Days
    for (let day = 1; day <= daysInMonth; day++) {
        const cellDate = new Date(year, month, day);
        // Format ISO String YYYY-MM-DD
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const booking = getBookingForDate(dateStr);
        const prices = getPricesForDate(dateStr);
        const locked = isDateLocked(dateStr);

        let totalCost = 0;
        if (booking) {
            totalCost = (booking.breakfast_units * prices.breakfast) + 
                        (booking.lunch_units * prices.lunch) + 
                        (booking.dinner_units * prices.dinner);
        }

        const isToday = new Date().toDateString() === cellDate.toDateString();

        cells.push(
            <div 
                key={`day-${day}`} 
                onClick={() => handleCellClick(dateStr)}
                className={`min-h-[105px] p-2 border border-slate-100 dark:border-slate-800 rounded-lg flex flex-col justify-between transition-all select-none group relative ${
                    locked 
                        ? 'bg-slate-50/50 dark:bg-slate-900/30 cursor-not-allowed opacity-85' 
                        : 'bg-white dark:bg-slate-950 hover:border-indigo-500 dark:hover:border-indigo-500 cursor-pointer shadow-sm hover:shadow'
                } ${isToday ? 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-950' : ''}`}
            >
                <div className="flex justify-between items-center">
                    <span className={`text-sm font-bold ${isToday ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'}`}>
                        {day}
                    </span>
                    {locked ? (
                        <Lock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600" />
                    ) : (
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">Edit</span>
                    )}
                </div>

                <div className="flex flex-col gap-1 my-1">
                    {booking && (booking.breakfast_units > 0 || booking.lunch_units > 0 || booking.dinner_units > 0) ? (
                        <>
                            {booking.breakfast_units > 0 && (
                                <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-300 dark:border-amber-900/50">
                                    B: {booking.breakfast_units}u
                                </Badge>
                            )}
                            {booking.lunch_units > 0 && (
                                <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-300 dark:border-rose-900/50">
                                    L: {booking.lunch_units}u
                                </Badge>
                            )}
                            {booking.dinner_units > 0 && (
                                <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/20 dark:text-indigo-300 dark:border-indigo-900/50">
                                    D: {booking.dinner_units}u
                                </Badge>
                            )}
                        </>
                    ) : (
                        <span className="text-[11px] text-slate-400 dark:text-slate-600 italic">No bookings</span>
                    )}
                </div>

                <div className="text-right">
                    {totalCost > 0 ? (
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100">৳{totalCost.toFixed(0)}</span>
                    ) : (
                        <span className="text-xs text-slate-400 dark:text-slate-600">-</span>
                    )}
                </div>
            </div>
        );
    }

    return (
        <>
            <Head title="Canteen - Meal Booking" />
            
            <div className="flex flex-col gap-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                
                {/* Header Banner */}
                <div className="flex justify-between items-center bg-gradient-to-r from-indigo-600 to-violet-600 p-6 rounded-2xl shadow-md text-white">
                    <div className="flex items-center gap-3">
                        <UtensilsCrossed className="w-8 h-8 text-indigo-100" />
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">{hall.name} Canteen</h1>
                            <p className="text-indigo-100 text-sm mt-1">Book your daily meals and view the menu of the week.</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Left Pane: Weekly Canteen Menu */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card className="shadow-sm border-slate-200 dark:border-slate-800">
                            <CardHeader className="pb-3 border-b dark:border-slate-800">
                                <CardTitle className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                                    <UtensilsCrossed className="w-5 h-5" /> Menu of the Week
                                </CardTitle>
                                <CardDescription>Check daily meals served at the canteen.</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-4">
                                {/* Weekday selection pills */}
                                <div className="flex flex-wrap gap-1.5 mb-6">
                                    {weekdays.map(day => (
                                        <button
                                            key={day}
                                            onClick={() => setSelectedMenuDay(day)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                                selectedMenuDay.toLowerCase() === day.toLowerCase()
                                                    ? 'bg-indigo-600 text-white shadow'
                                                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300'
                                            }`}
                                        >
                                            {day.slice(0,3)}
                                        </button>
                                    ))}
                                </div>

                                {/* Meal details card */}
                                <div className="space-y-4">
                                    <div className="p-3 bg-amber-50/50 dark:bg-amber-950/10 border border-amber-100 dark:border-amber-900/30 rounded-xl flex items-start gap-3">
                                        <div className="p-2 bg-amber-100 dark:bg-amber-950/30 rounded-lg text-amber-700 dark:text-amber-400">
                                            <Coffee className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider">Breakfast</div>
                                            <div className="text-sm mt-1 text-slate-700 dark:text-slate-300 whitespace-pre-line">
                                                {currentMenu.breakfast || 'Not specified'}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-3 bg-rose-50/50 dark:bg-rose-950/10 border border-rose-100 dark:border-rose-900/30 rounded-xl flex items-start gap-3">
                                        <div className="p-2 bg-rose-100 dark:bg-rose-950/30 rounded-lg text-rose-700 dark:text-rose-400">
                                            <Sun className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-rose-800 dark:text-rose-400 uppercase tracking-wider">Lunch</div>
                                            <div className="text-sm mt-1 text-slate-700 dark:text-slate-300 whitespace-pre-line">
                                                {currentMenu.lunch || 'Not specified'}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/10 border border-indigo-100 dark:border-indigo-900/30 rounded-xl flex items-start gap-3">
                                        <div className="p-2 bg-indigo-100 dark:bg-indigo-950/30 rounded-lg text-indigo-700 dark:text-indigo-400">
                                            <Moon className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-indigo-800 dark:text-indigo-400 uppercase tracking-wider">Dinner</div>
                                            <div className="text-sm mt-1 text-slate-700 dark:text-slate-300 whitespace-pre-line">
                                                {currentMenu.dinner || 'Not specified'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Pane: Booking Calendar */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="shadow-sm border-slate-200 dark:border-slate-800">
                            <CardHeader className="pb-3 border-b dark:border-slate-800 flex flex-row items-center justify-between space-y-0">
                                <div>
                                    <CardTitle className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                                        <Calendar className="w-5 h-5" /> Booking Calendar
                                    </CardTitle>
                                    <CardDescription>Click a date cell to book or adjust your meal units.</CardDescription>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Button variant="outline" size="icon" onClick={prevMonth} className="h-8 w-8">
                                        <ChevronLeft className="w-4 h-4" />
                                    </Button>
                                    <span className="text-sm font-bold px-2 w-[110px] text-center text-slate-800 dark:text-slate-200">
                                        {monthNames[month]} {year}
                                    </span>
                                    <Button variant="outline" size="icon" onClick={nextMonth} className="h-8 w-8">
                                        <ChevronRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6">
                                {/* Weekdays header */}
                                <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    <div>Sun</div>
                                    <div>Mon</div>
                                    <div>Tue</div>
                                    <div>Wed</div>
                                    <div>Thu</div>
                                    <div>Fri</div>
                                    <div>Sat</div>
                                </div>
                                {/* Calendar grid */}
                                <div className="grid grid-cols-7 gap-2">
                                    {cells}
                                </div>
                                
                                <div className="mt-4 flex gap-4 text-xs text-slate-500 items-center justify-end">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-2.5 h-2.5 bg-slate-50/50 dark:bg-slate-900/30 border rounded"></div>
                                        <span>Locked/Past Date</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-2.5 h-2.5 bg-white dark:bg-slate-950 border rounded ring-1 ring-indigo-500"></div>
                                        <span>Today</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Lock className="w-3 h-3 text-slate-400" />
                                        <span>Deadline: Day before 5:00 PM</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                </div>

            </div>

            {/* Booking Modal Dialog */}
            <Dialog open={bookingModalOpen} onOpenChange={setBookingModalOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <UtensilsCrossed className="w-5 h-5 text-indigo-500" /> Canteen Meal Booking
                        </DialogTitle>
                        <CardDescription>
                            Date: {selectedDateStr ? new Date(selectedDateStr).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : ''}
                        </CardDescription>
                    </DialogHeader>
                    <form onSubmit={handleSaveBooking} className="space-y-5 pt-4">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 bg-amber-50/30 dark:bg-amber-950/10 border border-slate-100 dark:border-slate-800 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <Coffee className="w-5 h-5 text-amber-500" />
                                    <div>
                                        <div className="text-sm font-bold text-slate-800 dark:text-slate-200">Breakfast</div>
                                        <div className="text-xs text-slate-500">Price: ৳{getPricesForDate(selectedDateStr).breakfast.toFixed(0)}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button type="button" onClick={() => setBreakfastUnits(Math.max(0, breakfastUnits - 1))} className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center font-bold text-sm text-slate-700 dark:text-slate-300">-</button>
                                    <span className="w-6 text-center font-bold text-sm text-slate-800 dark:text-slate-200">{breakfastUnits}</span>
                                    <button type="button" onClick={() => setBreakfastUnits(breakfastUnits + 1)} className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center font-bold text-sm text-slate-700 dark:text-slate-300">+</button>
                                </div>
                            </div>

                            <div className="flex justify-between items-center p-3 bg-rose-50/30 dark:bg-rose-950/10 border border-slate-100 dark:border-slate-800 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <Sun className="w-5 h-5 text-rose-500" />
                                    <div>
                                        <div className="text-sm font-bold text-slate-800 dark:text-slate-200">Lunch</div>
                                        <div className="text-xs text-slate-500">Price: ৳{getPricesForDate(selectedDateStr).lunch.toFixed(0)}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button type="button" onClick={() => setLunchUnits(Math.max(0, lunchUnits - 1))} className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center font-bold text-sm text-slate-700 dark:text-slate-300">-</button>
                                    <span className="w-6 text-center font-bold text-sm text-slate-800 dark:text-slate-200">{lunchUnits}</span>
                                    <button type="button" onClick={() => setLunchUnits(lunchUnits + 1)} className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center font-bold text-sm text-slate-700 dark:text-slate-300">+</button>
                                </div>
                            </div>

                            <div className="flex justify-between items-center p-3 bg-indigo-50/30 dark:bg-indigo-950/10 border border-slate-100 dark:border-slate-800 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <Moon className="w-5 h-5 text-indigo-500" />
                                    <div>
                                        <div className="text-sm font-bold text-slate-800 dark:text-slate-200">Dinner</div>
                                        <div className="text-xs text-slate-500">Price: ৳{getPricesForDate(selectedDateStr).dinner.toFixed(0)}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button type="button" onClick={() => setDinnerUnits(Math.max(0, dinnerUnits - 1))} className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center font-bold text-sm text-slate-700 dark:text-slate-300">-</button>
                                    <span className="w-6 text-center font-bold text-sm text-slate-800 dark:text-slate-200">{dinnerUnits}</span>
                                    <button type="button" onClick={() => setDinnerUnits(dinnerUnits + 1)} className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center font-bold text-sm text-slate-700 dark:text-slate-300">+</button>
                                </div>
                            </div>
                        </div>

                        <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl flex justify-between items-center">
                            <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">Estimated Day Cost:</span>
                            <span className="text-base font-bold text-indigo-600 dark:text-indigo-400">
                                ৳{(
                                    (breakfastUnits * getPricesForDate(selectedDateStr).breakfast) +
                                    (lunchUnits * getPricesForDate(selectedDateStr).lunch) +
                                    (dinnerUnits * getPricesForDate(selectedDateStr).dinner)
                                ).toFixed(0)}
                            </span>
                        </div>

                        <DialogFooter className="gap-2">
                            <Button type="button" variant="outline" onClick={() => setBookingModalOpen(false)}>Cancel</Button>
                            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white gap-2">
                                <Save className="w-4 h-4" /> Save Booking
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

CanteenIndex.layout = {
    breadcrumbs: [
        {
            title: 'Canteen',
            href: '/canteen',
        },
    ],
};
