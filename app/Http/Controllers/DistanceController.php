<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\DistrictDistance;

class DistanceController extends Controller
{
    public function getDistance(Request $request)
    {
        $upazilaId = $request->query('upazila_id');
        $districtName = $request->query('district');
        
        if (!$upazilaId) {
            return response()->json(['error' => 'Upazila ID is required'], 400);
        }
        
        try {
            // Query iBAS++ Distance Matrix (without verifying SSL to handle invalid chains on govt server)
            $response = Http::withoutVerifying()->timeout(5)->get('https://ibas.finance.gov.bd/Public/GetDistanceBetweenUpazillaForDistanceMatrix', [
                'departureLocationId' => 231308, // Dinajpur Sadar (HSTU)
                'arrivalLocationId' => $upazilaId
            ]);
            
            if ($response->successful()) {
                $data = $response->json();
                if (is_array($data) && count($data) > 0 && isset($data[0]['DISTANCE'])) {
                    return response()->json([
                        'distance' => (int) $data[0]['DISTANCE'],
                        'source' => 'ibas'
                    ]);
                }
            }
        } catch (\Exception $e) {
            // Log warning or handle gracefully
        }
        
        // Fallback to local DB distance if iBAS is down or has no entry
        if ($districtName) {
            $normalizedName = trim($districtName);
            // Normalization mappings
            $mappings = [
                'Cumilla' => 'Comilla',
                'Comilla' => 'Cumilla',
                'Barishal' => 'Barisal',
                'Barisal' => 'Barishal',
                'Chapainawabganj' => 'Chapai Nababganj',
                'Chapai Nababganj' => 'Chapainawabganj',
                'Bogura' => 'Bogra',
                'Bogra' => 'Bogura',
                'Chattogram' => 'Chittagong',
                'Chittagong' => 'Chattogram'
            ];
            
            $mappedName = $mappings[$normalizedName] ?? $normalizedName;
            
            $fallback = DistrictDistance::where('district', $normalizedName)
                ->orWhere('district', $mappedName)
                ->first();
                
            if ($fallback) {
                return response()->json([
                    'distance' => $fallback->distance,
                    'source' => 'local'
                ]);
            }
        }
        
        return response()->json([
            'distance' => 0,
            'source' => 'default'
        ]);
    }
}
