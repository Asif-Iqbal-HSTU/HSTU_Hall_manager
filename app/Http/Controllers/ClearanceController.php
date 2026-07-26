<?php

namespace App\Http\Controllers;

use App\Models\FeePayment;
use App\Models\FeeStructure;
use App\Models\Hall;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class ClearanceController extends Controller
{
    // ==========================================================
    //   Student
    // ==========================================================

    /** Student's fee-clearance page: per-level amount due / paid status. */
    public function index(Request $request)
    {
        $user = $request->user();
        if ($user->role !== 'student') abort(403);

        $user->load('academic');

        return inertia('clearance/index', [
            'hall' => $user->hall_id ? Hall::find($user->hall_id) : null,
            'academic' => $user->academic,
            'summary' => $user->clearanceSummary(),
        ]);
    }

    /** Downloadable bank payment voucher for a given level. */
    public function voucher(Request $request)
    {
        $user = $request->user();
        if ($user->role !== 'student') abort(403);
        $user->load(['academic', 'hall']);

        $level = $this->validatedLevel($request, $user);
        $structure = FeeStructure::where('hall_id', $user->hall_id)->where('level', $level)->first();
        abort_if(! $structure, 404, 'No fee is configured for this level.');

        $voucherNo = $this->voucherNumber($user, $level);

        $pdf = $this->renderPdf('pdf.fee-voucher', [
            'user' => $user,
            'academic' => $user->academic,
            'hall' => $user->hall,
            'level' => $level,
            'amount' => $structure->amount,
            'voucherNo' => $voucherNo,
        ]);

        return $this->pdfResponse($pdf, 'Fee-Voucher-' . $voucherNo . '.pdf');
    }

    /** Downloadable Hall Clearance certificate for a paid level. */
    public function certificate(Request $request)
    {
        $user = $request->user();
        if ($user->role !== 'student') abort(403);
        $user->load(['academic', 'hall']);

        $level = $this->validatedLevel($request, $user);
        $payment = FeePayment::where('user_id', $user->id)->where('level', $level)->first();
        abort_if(! $payment, 403, 'This level has not been cleared yet.');

        $pdf = $this->renderPdf('pdf.clearance-certificate', [
            'user' => $user,
            'academic' => $user->academic,
            'hall' => $user->hall,
            'level' => $level,
            'payment' => $payment,
        ]);

        return $this->pdfResponse($pdf, 'Hall-Clearance-L' . $level . '-' . optional($user->academic)->student_id . '.pdf');
    }

    // ==========================================================
    //   Authority (admin / hall_super)
    // ==========================================================

    /** Authority view: fee structure editor + students and their clearance status. */
    public function adminIndex(Request $request)
    {
        $user = $request->user();
        if ($user->role !== 'admin' && $user->role !== 'hall_super') abort(403);
        if (! $user->hall_id) {
            return back()->with('error', 'You are not assigned to a hall.');
        }

        $hall = Hall::findOrFail($user->hall_id);

        $structures = FeeStructure::where('hall_id', $hall->id)->orderBy('level')->get()->keyBy('level');
        $feeStructure = [];
        for ($level = 1; $level <= 4; $level++) {
            $feeStructure[] = [
                'level' => $level,
                'amount' => (float) optional($structures->get($level))->amount,
            ];
        }

        $students = User::where('hall_id', $hall->id)
            ->where('role', 'student')
            ->with(['academic', 'feePayments'])
            ->get()
            ->map(function ($s) {
                $level = (int) optional($s->academic)->level;
                $paidLevels = $s->feePayments->pluck('level')->all();
                return [
                    'name' => $s->name,
                    'student_id' => optional($s->academic)->student_id ?? '—',
                    'department' => optional($s->academic)->department ?? '—',
                    'level' => $level ?: null,
                    'paid_levels' => $paidLevels,
                    'current_paid' => $level ? in_array($level, $paidLevels, true) : false,
                ];
            })
            ->sortBy('student_id')
            ->values();

        return inertia('admin/clearance', [
            'hall' => $hall,
            'feeStructure' => $feeStructure,
            'students' => $students,
        ]);
    }

    /** Authority records a student's payment against a level. */
    public function recordPayment(Request $request)
    {
        $user = $request->user();
        if ($user->role !== 'admin' && $user->role !== 'hall_super') abort(403);
        if (! $user->hall_id) abort(400, 'Hall not assigned.');

        $validated = $request->validate([
            'student_id' => 'required|string',
            'level' => 'required|integer|min:1|max:4',
            'amount' => 'required|numeric|min:0',
            'payment_method' => 'required|in:online,offline',
            'bank_name' => 'nullable|string|max:150',
            'transaction_ref' => 'nullable|string|max:150',
            'voucher_no' => 'nullable|string|max:150',
            'paid_on' => 'required|date',
            'remarks' => 'nullable|string|max:1000',
        ]);

        // Resolve the student by their academic student_id, scoped to this hall.
        $student = User::where('hall_id', $user->hall_id)
            ->where('role', 'student')
            ->whereHas('academic', fn ($q) => $q->where('student_id', $validated['student_id']))
            ->first();

        if (! $student) {
            return back()->with('error', 'No student with ID "' . $validated['student_id'] . '" found in this hall.');
        }

        FeePayment::updateOrCreate(
            ['user_id' => $student->id, 'level' => $validated['level']],
            [
                'hall_id' => $user->hall_id,
                'amount' => $validated['amount'],
                'payment_method' => $validated['payment_method'],
                'bank_name' => $validated['bank_name'] ?? null,
                'transaction_ref' => $validated['transaction_ref'] ?? null,
                'voucher_no' => $validated['voucher_no'] ?? null,
                'paid_on' => $validated['paid_on'],
                'verified_by' => $user->id,
                'remarks' => $validated['remarks'] ?? null,
            ]
        );

        return back()->with('success', 'Payment recorded for ' . $student->name . ' (Level ' . $validated['level'] . ').');
    }

    /** Authority sets/updates the yearly fee amount for a level. */
    public function updateFeeStructure(Request $request)
    {
        $user = $request->user();
        if ($user->role !== 'admin' && $user->role !== 'hall_super') abort(403);
        if (! $user->hall_id) abort(400, 'Hall not assigned.');

        $validated = $request->validate([
            'level' => 'required|integer|min:1|max:4',
            'amount' => 'required|numeric|min:0',
        ]);

        FeeStructure::updateOrCreate(
            ['hall_id' => $user->hall_id, 'level' => $validated['level']],
            ['amount' => $validated['amount']]
        );

        return back()->with('success', 'Fee amount for Level ' . $validated['level'] . ' updated.');
    }

    // ==========================================================
    //   Helpers
    // ==========================================================

    private function validatedLevel(Request $request, User $user): int
    {
        $request->validate(['level' => 'required|integer|min:1|max:4']);
        $level = (int) $request->query('level', $request->input('level'));
        $currentLevel = (int) optional($user->academic)->level;
        abort_if($currentLevel && $level > $currentLevel, 403, 'Level not applicable yet.');
        return $level;
    }

    private function voucherNumber(User $user, int $level): string
    {
        return sprintf('HSTU-%02d-%d-L%d', $user->hall_id, $user->id, $level);
    }

    private function renderPdf(string $view, array $data): string
    {
        $html = view($view, $data)->render();
        $dompdf = new \Dompdf\Dompdf(['isRemoteEnabled' => false]);
        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();
        return $dompdf->output();
    }

    private function pdfResponse(string $pdf, string $filename)
    {
        return response($pdf, 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ]);
    }
}
