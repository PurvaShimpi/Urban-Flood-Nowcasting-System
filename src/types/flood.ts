export type FloodRiskLevel = 'Safe' | 'Low' | 'Moderate' | 'High' | 'Critical';

export type UserRole = 'citizen' | 'pmc';

export interface OfficerUser {
  badgeId: string;
  name: string;
  designation: string;
  department: string;
  wardZone: string;
  role: 'pmc';
  loginTime: string;
}

export type VehicleCategory = 'two-wheeler' | 'four-wheeler' | 'suv-heavy';

export interface RoadSegment {
  id: string;
  name: string;
  zone: string;
  coordinates: [number, number][]; // [x, y] in GIS projection coords
  currentDepthCm: number;
  predictedDepthCm: number;
  peakTime: string;
  rainfallMmHr: number;
  drainageLoadPct: number;
  riskLevel: FloodRiskLevel;
  submergedSections: string;
  elevationMeters: number;
  trafficStatus: 'Normal' | 'Slow' | 'Diverted' | 'Closed';
}

export interface FloodZone {
  id: string;
  name: string;
  zoneType: 'Depression' | 'Riverbank' | 'Underpass' | 'Nullah Corridors';
  polygon: [number, number][]; // [x, y] polygon points
  center: [number, number];
  currentDepthCm: number;
  predictedDepthCm: number;
  riskLevel: FloodRiskLevel;
}

export interface DrainagePoint {
  id: string;
  code: string; // e.g., D-104
  name: string;
  locationName: string;
  type: 'Pumping Station' | 'Gravity Outfall' | 'Culvert' | 'Sluice Gate';
  coordinates: [number, number];
  capacityLps: number; // liters per second
  capacityPct: number;
  currentLoadPct: number;
  predictedOverloadMin: number | null;
  status: 'Normal' | 'Warning' | 'Overloaded';
  gateStatus: 'Fully Open' | 'Partially Open' | 'Closed';
  isPumpActive?: boolean;
  pumpFlowLps?: number;
  lastInspected: string;
}

export interface FloodAlert {
  id: string;
  severity: 'Critical' | 'High' | 'Moderate' | 'Low';
  title: string;
  location: string;
  predictedDepthCm?: number;
  rainfallMmHr?: number;
  expectedIn: string;
  timestamp: string;
  acknowledged: boolean;
  statusMessage?: string;
  recommendedAction: string;
  isOfficialBroadcast?: boolean;
}

export interface ForecastTimeStep {
  timeLabel: string; // 'Now' | '+30 min' | '+1 hr' | '+2 hr' | '+3 hr'
  offsetMinutes: number;
  overallRisk: FloodRiskLevel;
  maxDepthCm: number;
  avgRainfallMmHr: number;
  drainageLoadPct: number;
  affectedRoadsCount: number;
}

export interface AreaAtRisk {
  name: string;
  locality: string;
  risk: FloodRiskLevel;
  currentDepthCm: number;
  maxDepthCm: number;
  peakAt: string;
  clearanceEstimate: string;
}

export interface RouteOption {
  id: string;
  name: string;
  durationMin: number;
  distanceKm: number;
  riskLevel: FloodRiskLevel;
  maxWaterDepthCm: number;
  isRecommended: boolean;
  pathCoordinates: [number, number][];
  advisory: string;
  submergedSectionsCount: number;
  vehicleSuitability?: {
    twoWheelerSafe: boolean;
    carSafe: boolean;
    suvSafe: boolean;
  };
}

export interface WeatherStationReading {
  id: string;
  name: string;
  elevation: number;
  rainfall1Hr: number;
  rainfall24Hr: number;
  trend: 'Increasing' | 'Stable' | 'Decreasing';
  windSpeedKmh: number;
}

// Common Citizen Crowdsourced Inundation Report
export interface CitizenReport {
  id: string;
  location: string;
  landmark: string;
  waterDepthCm: number;
  description: string;
  reportedAt: string;
  reportedBy: string;
  status: 'Investigating' | 'Team Dispatched' | 'Resolved';
  coordinates: [number, number];
  upvotes: number;
}

// PMC Dam Discharge & River Basin Telemetry
export interface DamTelemetry {
  id: string;
  name: string;
  catchment: string;
  capacityMcft: number;
  currentStoragePct: number;
  inflowCusecs: number;
  dischargeCusecs: number;
  riverBasin: string;
  warningStatus: 'Normal' | 'Alert' | 'Emergency Danger';
  gatesOpen: number;
  totalGates: number;
  lastUpdated: string;
}

// PMC Municipal Quick Response Teams & NDRF Units
export interface EmergencyDispatchUnit {
  id: string;
  unitCode: string;
  name: string;
  type: 'NDRF Boat Unit' | 'Dewatering Pump Van' | 'PMC Ward QRT' | 'Traffic Police Diverter';
  baseLocation: string;
  currentSector: string;
  status: 'Standby' | 'En Route' | 'On Scene';
  contactRadio: string;
}

// Emergency Relief Shelter
export interface ReliefShelter {
  id: string;
  name: string;
  ward: string;
  address: string;
  capacityBeds: number;
  occupiedBeds: number;
  suppliesStatus: 'Adequate' | 'Replenishing';
  contact: string;
  distanceKm: number;
  isOpen: boolean;
}
