@php
    $amount = number_format((float) $amount, 2);
    $generated = \Illuminate\Support\Carbon::now()->format('d M Y, h:i A');
    $studentId = optional($academic)->student_id ?? '—';
    $dept = optional($academic)->department ?? '—';
    $copies = ['Bank Copy', 'Student Copy'];
@endphp
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        * { font-family: DejaVu Sans, sans-serif; }
        body { margin: 0; color: #111; font-size: 12px; }
        .copy { border: 1px solid #333; padding: 14px 16px; margin-bottom: 14px; }
        .head { text-align: center; border-bottom: 1.5px solid #111; padding-bottom: 6px; margin-bottom: 8px; }
        .head h1 { font-size: 15px; margin: 0; }
        .head h2 { font-size: 12px; margin: 2px 0 0; font-weight: normal; }
        .tag { float: right; font-size: 10px; border: 1px solid #111; padding: 1px 6px; border-radius: 3px; }
        table.kv { width: 100%; border-collapse: collapse; margin-top: 6px; }
        table.kv td { padding: 3px 4px; vertical-align: top; font-size: 12px; }
        table.kv td.l { width: 26%; color: #444; }
        .amount { margin-top: 8px; padding: 6px 8px; background: #f0f0f0; border: 1px solid #999; font-weight: bold; font-size: 14px; }
        .banks { margin-top: 8px; font-size: 11px; color: #333; }
        .sign { margin-top: 26px; }
        .sign span { display: inline-block; width: 45%; border-top: 1px solid #111; padding-top: 3px; text-align: center; font-size: 10px; }
        .note { font-size: 9px; color: #777; margin-top: 6px; }
    </style>
</head>
<body>
    @foreach ($copies as $copy)
        <div class="copy">
            <div class="head">
                <span class="tag">{{ $copy }}</span>
                <h1>Hajee Mohammad Danesh Science &amp; Technology University</h1>
                <h2>{{ $hall->name }} &mdash; Hall Fee Payment Voucher</h2>
            </div>
            <table class="kv">
                <tr><td class="l">Voucher No</td><td><strong>{{ $voucherNo }}</strong></td>
                    <td class="l">Academic Level</td><td>Level {{ $level }} (Yearly Hall Fee)</td></tr>
                <tr><td class="l">Student Name</td><td>{{ $user->name }}</td>
                    <td class="l">Student ID</td><td>{{ $studentId }}</td></tr>
                <tr><td class="l">Department</td><td>{{ $dept }}</td>
                    <td class="l">Student Type</td><td>{{ $residency ?? 'Residential' }}</td></tr>
            </table>
            <div class="amount">Amount Payable: Tk. {{ $amount }} /=</div>
            <div class="banks">
                Payable at: Sonali Bank PLC, HSTU Branch (A/C: Hall Fund &mdash; {{ $hall->name }}).
                Please collect the sealed &amp; signed copy from the bank and submit it to the Hall Office.
            </div>
            <div class="sign">
                <span>Depositor's Signature</span>
                <span style="float:right;">Bank Seal &amp; Signature</span>
            </div>
            <div class="note">Generated on {{ $generated }} via HSTU Hall Manager. This voucher is valid only for the level shown above.</div>
        </div>
    @endforeach
</body>
</html>
