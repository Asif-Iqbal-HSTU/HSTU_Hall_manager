<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::get('/api/distance', [\App\Http\Controllers\DistanceController::class, 'getDistance']);

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');
    Route::post('/admin/applications/allocate', [\App\Http\Controllers\AdminController::class, 'allocateSeat'])->name('admin.allocate');
    Route::post('/admin/applications/deny', [\App\Http\Controllers\AdminController::class, 'denyApplication'])->name('admin.deny');
    Route::post('/admin/notice', [\App\Http\Controllers\AdminController::class, 'startApplicationProcess'])->name('admin.startProcess');
    Route::post('/admin/notice/close', [\App\Http\Controllers\AdminController::class, 'closeApplicationProcess'])->name('admin.closeProcess');
    
    Route::post('/student/apply', [\App\Http\Controllers\StudentController::class, 'applyForSeat'])->name('student.apply');

    // Canteen Routes
    Route::get('/canteen', [\App\Http\Controllers\CanteenController::class, 'index'])->name('canteen.index');
    Route::post('/canteen/book', [\App\Http\Controllers\CanteenController::class, 'bookMeal'])->name('canteen.book');
    Route::get('/admin/canteen', [\App\Http\Controllers\CanteenController::class, 'adminIndex'])->name('canteen.adminIndex');
    Route::post('/admin/canteen/defaults', [\App\Http\Controllers\CanteenController::class, 'updateDefaults'])->name('canteen.updateDefaults');
    Route::post('/admin/canteen/menu', [\App\Http\Controllers\CanteenController::class, 'updateMenu'])->name('canteen.updateMenu');
    Route::post('/admin/canteen/costing', [\App\Http\Controllers\CanteenController::class, 'updateCosting'])->name('canteen.updateCosting');
    Route::post('/admin/canteen/costing/delete', [\App\Http\Controllers\CanteenController::class, 'deleteCosting'])->name('canteen.deleteCosting');
    Route::get('/admin/canteen/meal-list', [\App\Http\Controllers\CanteenController::class, 'mealBookingList'])->name('canteen.mealList');
    Route::get('/admin/canteen/meal-list/pdf', [\App\Http\Controllers\CanteenController::class, 'mealBookingListPdf'])->name('canteen.mealListPdf');

    // Complaint (anonymous) Routes
    Route::get('/complaints', [\App\Http\Controllers\ComplaintController::class, 'index'])->name('complaints.index');
    Route::post('/complaints', [\App\Http\Controllers\ComplaintController::class, 'store'])->name('complaints.store');
    Route::get('/admin/complaints', [\App\Http\Controllers\ComplaintController::class, 'adminIndex'])->name('complaints.adminIndex');
    Route::post('/admin/complaints/respond', [\App\Http\Controllers\ComplaintController::class, 'respond'])->name('complaints.respond');

    // Hall Clearance / Fee Routes
    Route::get('/clearance', [\App\Http\Controllers\ClearanceController::class, 'index'])->name('clearance.index');
    Route::get('/clearance/voucher', [\App\Http\Controllers\ClearanceController::class, 'voucher'])->name('clearance.voucher');
    Route::get('/clearance/certificate', [\App\Http\Controllers\ClearanceController::class, 'certificate'])->name('clearance.certificate');
    Route::get('/admin/clearance', [\App\Http\Controllers\ClearanceController::class, 'adminIndex'])->name('clearance.adminIndex');
    Route::post('/admin/clearance/record', [\App\Http\Controllers\ClearanceController::class, 'recordPayment'])->name('clearance.record');
    Route::post('/admin/clearance/fee-structure', [\App\Http\Controllers\ClearanceController::class, 'updateFeeStructure'])->name('clearance.feeStructure');
});

require __DIR__.'/settings.php';
