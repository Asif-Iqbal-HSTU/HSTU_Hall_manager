@php
    $mealLabel = ucfirst($meal);
    $dateLabel = \Illuminate\Support\Carbon::parse($date)->format('l, d F Y');
    $generated = \Illuminate\Support\Carbon::now()->format('d M Y, h:i A');
    $totalStudents = $bookings->count();
    $totalUnits = $bookings->sum('units');
@endphp
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        * { font-family: DejaVu Sans, sans-serif; }
        body { margin: 0; color: #111; font-size: 12px; }
        .header { text-align: center; border-bottom: 2px solid #111; padding-bottom: 8px; margin-bottom: 12px; }
        .header h1 { font-size: 18px; margin: 0; }
        .header h2 { font-size: 14px; margin: 3px 0 0; font-weight: normal; }
        .meta { margin: 10px 0; }
        .meta table { width: 100%; }
        .meta td { padding: 2px 0; font-size: 12px; }
        .badge {
            display: inline-block; padding: 3px 10px; border: 1px solid #111;
            border-radius: 4px; font-weight: bold; font-size: 13px;
        }
        table.list { width: 100%; border-collapse: collapse; margin-top: 8px; }
        table.list th, table.list td { border: 1px solid #333; padding: 6px 6px; }
        table.list th { background: #eee; font-size: 11px; text-transform: uppercase; text-align: left; }
        table.list td { font-size: 12px; }
        .center { text-align: center; }
        .tick-box { width: 16px; height: 16px; border: 1.5px solid #111; display: inline-block; }
        .totals { margin-top: 12px; font-weight: bold; }
        .footer { margin-top: 36px; }
        .sign { display: inline-block; width: 45%; border-top: 1px solid #111; padding-top: 4px; margin-top: 30px; text-align: center; font-size: 11px; }
        .empty { text-align: center; padding: 24px; color: #666; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Hajee Mohammad Danesh Science &amp; Technology University</h1>
        <h2>{{ $hall->name }} &mdash; Canteen Meal Collection List</h2>
    </div>

    <div class="meta">
        <table>
            <tr>
                <td><strong>Meal:</strong> <span class="badge">{{ $mealLabel }}</span></td>
                <td><strong>Date:</strong> {{ $dateLabel }}</td>
                <td style="text-align:right;"><strong>Booked students:</strong> {{ $totalStudents }} &nbsp; | &nbsp; <strong>Total units:</strong> {{ $totalUnits }}</td>
            </tr>
        </table>
    </div>

    @if ($bookings->isEmpty())
        <p class="empty">No students booked {{ strtolower($mealLabel) }} for this date.</p>
    @else
        <table class="list">
            <thead>
                <tr>
                    <th class="center" style="width:6%;">SL</th>
                    <th style="width:28%;">Name</th>
                    <th style="width:16%;">Student ID</th>
                    <th style="width:24%;">Department</th>
                    <th class="center" style="width:12%;">Room / Seat</th>
                    <th class="center" style="width:7%;">Units</th>
                    <th class="center" style="width:7%;">Taken</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($bookings as $i => $b)
                    <tr>
                        <td class="center">{{ $i + 1 }}</td>
                        <td>{{ $b['name'] }}</td>
                        <td>{{ $b['student_id'] }}</td>
                        <td>{{ $b['department'] }}</td>
                        <td class="center">{{ $b['room'] }} / {{ $b['seat'] }}</td>
                        <td class="center">{{ $b['units'] }}</td>
                        <td class="center"><span class="tick-box"></span></td>
                    </tr>
                @endforeach
            </tbody>
        </table>

        <p class="totals">Total students: {{ $totalStudents }} &nbsp;&nbsp; Total meal units: {{ $totalUnits }}</p>
    @endif

    <div class="footer">
        <span class="sign">Canteen Manager Signature</span>
        <span class="sign" style="float:right;">Hall Authority Signature</span>
    </div>

    <p style="margin-top:40px; font-size:9px; color:#888; text-align:right;">Generated on {{ $generated }} by HSTU Hall Manager</p>
</body>
</html>
