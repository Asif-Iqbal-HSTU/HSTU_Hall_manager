@php
    $studentId = optional($academic)->student_id ?? '—';
    $dept = optional($academic)->department ?? '—';
    $amount = number_format((float) $payment->amount, 2);
    $paidOn = \Illuminate\Support\Carbon::parse($payment->paid_on)->format('d M Y');
    $issued = \Illuminate\Support\Carbon::now()->format('d M Y');
    $method = ucfirst($payment->payment_method);
@endphp
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        * { font-family: DejaVu Sans, sans-serif; }
        body { margin: 0; color: #111; font-size: 13px; }
        .frame { border: 3px double #1a3c6e; padding: 28px 32px; margin: 6px; }
        .head { text-align: center; border-bottom: 2px solid #1a3c6e; padding-bottom: 10px; }
        .head h1 { font-size: 20px; margin: 0; color: #1a3c6e; }
        .head h2 { font-size: 14px; margin: 4px 0 0; font-weight: normal; }
        .title { text-align: center; font-size: 22px; letter-spacing: 2px; margin: 26px 0 6px; color: #1a3c6e; font-weight: bold; }
        .subtitle { text-align: center; font-size: 12px; color: #555; margin-bottom: 24px; }
        .body { line-height: 1.9; font-size: 14px; text-align: justify; }
        .body b { color: #111; }
        table.kv { width: 100%; border-collapse: collapse; margin: 20px 0; }
        table.kv td { padding: 6px 8px; border: 1px solid #bbb; font-size: 13px; }
        table.kv td.l { width: 32%; background: #f4f6fa; color: #333; font-weight: bold; }
        .foot { margin-top: 60px; }
        .foot .sign { display: inline-block; width: 45%; border-top: 1px solid #111; padding-top: 4px; text-align: center; font-size: 12px; }
        .seal { text-align: center; font-size: 11px; color: #888; margin-top: 30px; }
        .refno { font-size: 11px; color: #666; }
    </style>
</head>
<body>
    <div class="frame">
        <div class="head">
            <h1>Hajee Mohammad Danesh Science &amp; Technology University</h1>
            <h2>Dinajpur-5200, Bangladesh &mdash; Office of the {{ $hall->name }}</h2>
        </div>

        <div class="title">HALL CLEARANCE CERTIFICATE</div>
        <div class="subtitle">Ref: HC/{{ $hall->id }}/{{ $studentId }}/L{{ $level }} &nbsp;|&nbsp; Issued on {{ $issued }}</div>

        <div class="body">
            This is to certify that <b>{{ $user->name }}</b>, bearing Student ID <b>{{ $studentId }}</b>,
            Department of <b>{{ $dept }}</b>, a resident/attached student of <b>{{ $hall->name }}</b>,
            has duly paid the prescribed hall fee for <b>Level {{ $level }}</b> and has
            <b>no outstanding dues</b> against the hall for the said level.
        </div>

        <table class="kv">
            <tr><td class="l">Student Name</td><td>{{ $user->name }}</td></tr>
            <tr><td class="l">Student ID</td><td>{{ $studentId }}</td></tr>
            <tr><td class="l">Hall</td><td>{{ $hall->name }}</td></tr>
            <tr><td class="l">Level Cleared</td><td>Level {{ $level }}</td></tr>
            <tr><td class="l">Amount Paid</td><td>Tk. {{ $amount }} /=</td></tr>
            <tr><td class="l">Payment Method</td><td>{{ $method }}@if($payment->bank_name), {{ $payment->bank_name }}@endif</td></tr>
            @if($payment->voucher_no || $payment->transaction_ref)
            <tr><td class="l">Voucher / Ref No</td><td>{{ $payment->voucher_no ?: $payment->transaction_ref }}</td></tr>
            @endif
            <tr><td class="l">Date of Payment</td><td>{{ $paidOn }}</td></tr>
        </table>

        <div class="foot">
            <span class="sign" style="float:right;">Provost / Hall Authority<br>{{ $hall->name }}</span>
        </div>

        <div class="seal">This is a system-generated clearance certificate from the HSTU Hall Manager portal and is valid for the level stated above.</div>
    </div>
</body>
</html>
