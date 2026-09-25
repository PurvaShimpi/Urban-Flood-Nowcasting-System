import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  RoadSegment,
  FloodZone,
  DrainagePoint,
  FloodAlert,
  ForecastTimeStep,
  FloodRiskLevel,
  RouteOption,
  UserRole,
  CitizenReport,
  DamTelemetry,
  EmergencyDispatchUnit,
  VehicleCategory,
  OfficerUser,
} from '../types/flood';
import {
  INITIAL_ROADS,
  INITIAL_FLOOD_ZONES,
  INITIAL_DRAINAGE_POINTS,
  INITIAL_ALERTS,
  FORECAST_STEPS,
  INITIAL_ROUTES,
  INITIAL_CITIZEN_REPORTS,
  INITIAL_DAMS,
  INITIAL_DISPATCH_UNITS,
  AUTHORIZED_PMC_OFFICERS,
} from '../data/puneFloodData';

export type NavPage =
  | 'landing'
  | 'dashboard'
  | 'flood-map'
  | 'forecast'
  | 'rainfall'
  | 'safe-routes'
  | 'alerts'
  | 'helplines'
  | 'reports'
  | 'settings'
  | 'citizen-reports'
  | 'control-room'
  | 'dams'
  | 'dispatch';

interface FloodContextType {
  // Role switcher: Citizen vs PMC Disaster Cell
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;

  // Officer Authentication
  authenticatedOfficer: OfficerUser | null;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  loginOfficer: (badgeId: string, pin: string) => { success: boolean; message: string };
  logoutOfficer: () => void;

  activePage: NavPage;
  setActivePage: (page: NavPage) => void;
  forecastIndex: number;
  setForecastIndex: (idx: number) => void;
  currentTimeStep: ForecastTimeStep;
  roads: RoadSegment[];
  floodZones: FloodZone[];
  drainagePoints: DrainagePoint[];
  alerts: FloodAlert[];
  selectedRoad: RoadSegment | null;
  setSelectedRoad: (road: RoadSegment | null) => void;
  selectedDrainage: DrainagePoint | null;
  setSelectedDrainage: (dp: DrainagePoint | null) => void;

  // Simulation Mode
  isSimulating: boolean;
  simulationStep: number;
  startSimulation: () => void;
  stopSimulation: () => void;
  resetSimulation: () => void;

  // Layers
  layers: {
    roads: boolean;
    floodZones: boolean;
    rainfallRadar: boolean;
    drainagePoints: boolean;
    citizenMarkers: boolean;
  };
  toggleLayer: (layer: 'roads' | 'floodZones' | 'rainfallRadar' | 'drainagePoints' | 'citizenMarkers') => void;

  // Location Filter
  selectedLocality: string;
  setSelectedLocality: (loc: string) => void;

  // Metrics
  currentMetrics: {
    rainfallMmHr: number;
    rainfallTrend: 'Increasing' | 'Stable' | 'Decreasing';
    overallRisk: FloodRiskLevel;
    maxDepthCm: number;
    drainageLoadPct: number;
  };

  // Actions
  acknowledgeAlert: (id: string) => void;
  findSaferRouteForRoad: (roadName: string) => void;

  // Route Navigation & Vehicle Selection
  routeOrigin: string;
  setRouteOrigin: (from: string) => void;
  routeDestination: string;
  setRouteDestination: (to: string) => void;
  vehicleCategory: VehicleCategory;
  setVehicleCategory: (cat: VehicleCategory) => void;
  routesList: RouteOption[];
  selectedRouteId: string;
  setSelectedRouteId: (id: string) => void;
  isCalculatingRoute: boolean;
  calculateRoutes: () => void;

  // Citizen Crowdsourced Reports
  citizenReports: CitizenReport[];
  submitCitizenReport: (report: Omit<CitizenReport, 'id' | 'reportedAt' | 'upvotes' | 'status'>) => void;
  upvoteReport: (reportId: string) => void;

  // PMC Operational Telemetry & Actuation
  damsList: DamTelemetry[];
  dispatchUnits: EmergencyDispatchUnit[];
  dispatchUnitToSector: (unitId: string, sector: string) => void;
  toggleDrainagePump: (drainageId: string) => void;
  setDrainageSluiceGate: (drainageId: string, status: 'Fully Open' | 'Partially Open' | 'Closed') => void;
  broadcastEmergencyAlert: (title: string, location: string, action: string, severity: 'Critical' | 'High') => void;

  // Emergency Citizen Broadcast Banner
  emergencyBroadcast: FloodAlert | null;
  dismissEmergencyBroadcast: () => void;

  // Toast notifications
  toastMessage: string | null;
  clearToast: () => void;
}

const FloodContext = createContext<FloodContextType | undefined>(undefined);

export const FloodProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Active page: defaults to landing page
  const [activePage, setActivePage] = useState<NavPage>('landing');

  // Officer authentication state
  const [authenticatedOfficer, setAuthenticatedOfficer] = useState<OfficerUser | null>(() => {
    try {
      const saved = localStorage.getItem('pmc_authenticated_officer');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return null;
  });

  const [userRole, setUserRoleState] = useState<UserRole>(() => {
    try {
      const saved = localStorage.getItem('pmc_authenticated_officer');
      if (saved) return 'pmc';
    } catch {
      // fallback
    }
    return 'citizen';
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const openAuthModal = useCallback(() => setIsAuthModalOpen(true), []);
  const closeAuthModal = useCallback(() => setIsAuthModalOpen(false), []);

  const setUserRole = useCallback((role: UserRole) => {
    if (role === 'pmc' && !authenticatedOfficer) {
      setIsAuthModalOpen(true);
      return;
    }
    setUserRoleState(role);
  }, [authenticatedOfficer]);

  const loginOfficer = useCallback((badgeId: string, pin: string) => {
    const cleanBadge = badgeId.trim().toUpperCase();
    const cleanPin = pin.trim();

    const officer = AUTHORIZED_PMC_OFFICERS.find(
      o => o.badgeId.toUpperCase() === cleanBadge && o.pin === cleanPin
    );

    if (officer) {
      const user: OfficerUser = {
        badgeId: officer.badgeId,
        name: officer.name,
        designation: officer.designation,
        department: officer.department,
        wardZone: officer.wardZone,
        role: 'pmc',
        loginTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setAuthenticatedOfficer(user);
      setUserRoleState('pmc');
      setActivePage('dashboard');
      setIsAuthModalOpen(false);
      try {
        localStorage.setItem('pmc_authenticated_officer', JSON.stringify(user));
      } catch {
        // storage fallback
      }
      return { success: true, message: 'Authentication successful.' };
    } else {
      return {
        success: false,
        message: 'Invalid PMC Officer Badge ID or PIN. Please check credentials or use Quick Demo selection.',
      };
    }
  }, []);

  const logoutOfficer = useCallback(() => {
    setAuthenticatedOfficer(null);
    setUserRoleState('citizen');
    try {
      localStorage.removeItem('pmc_authenticated_officer');
    } catch {
      // fallback
    }
    setActivePage('landing');
  }, []);

  const [forecastIndex, setForecastIndex] = useState<number>(0);
  const [selectedRoad, setSelectedRoad] = useState<RoadSegment | null>(null);
  const [selectedDrainage, setSelectedDrainage] = useState<DrainagePoint | null>(null);

  // Simulation State
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationStep, setSimulationStep] = useState<number>(0);

  // Layers
  const [layers, setLayers] = useState({
    roads: true,
    floodZones: true,
    rainfallRadar: true,
    drainagePoints: true,
    citizenMarkers: true,
  });

  const [selectedLocality, setSelectedLocality] = useState<string>('Pune Central');
  const [alerts, setAlerts] = useState<FloodAlert[]>(INITIAL_ALERTS);

  // Route & Vehicle state
  const [routeOrigin, setRouteOrigin] = useState<string>('Shivajinagar Bus Station');
  const [routeDestination, setRouteDestination] = useState<string>('Hinjawadi Phase 1 via Baner');
  const [vehicleCategory, setVehicleCategory] = useState<VehicleCategory>('four-wheeler');
  const [routesList, setRoutesList] = useState<RouteOption[]>(INITIAL_ROUTES);
  const [selectedRouteId, setSelectedRouteId] = useState<string>('route-2');
  const [isCalculatingRoute, setIsCalculatingRoute] = useState<boolean>(false);

  // Citizen Reports state
  const [citizenReports, setCitizenReports] = useState<CitizenReport[]>(INITIAL_CITIZEN_REPORTS);

  // PMC Dam & Operations state
  const [damsList, setDamsList] = useState<DamTelemetry[]>(INITIAL_DAMS);
  const [dispatchUnits, setDispatchUnits] = useState<EmergencyDispatchUnit[]>(INITIAL_DISPATCH_UNITS);
  const [drainageControlState, setDrainageControlState] = useState<Record<string, { isPumpActive?: boolean; gateStatus?: DrainagePoint['gateStatus'] }>>({
    'drain-d104': { isPumpActive: true, gateStatus: 'Partially Open' },
    'drain-d201': { isPumpActive: true, gateStatus: 'Fully Open' },
    'drain-d118': { isPumpActive: false, gateStatus: 'Partially Open' },
    'drain-d305': { isPumpActive: false, gateStatus: 'Fully Open' },
    'drain-d402': { isPumpActive: true, gateStatus: 'Fully Open' },
  });

  // Emergency Broadcast banner
  const [emergencyBroadcast, setEmergencyBroadcast] = useState<FloodAlert | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const clearToast = useCallback(() => setToastMessage(null), []);

  const toggleLayer = useCallback((layer: keyof typeof layers) => {
    setLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  }, []);

  // Time step multiplier
  const currentTimeStep = useMemo(() => {
    return FORECAST_STEPS[forecastIndex] || FORECAST_STEPS[0];
  }, [forecastIndex]);

  // Handle Simulation Ticks
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setSimulationStep(prev => {
        const next = (prev + 1) % 4;
        if (next === 1) {
          setToastMessage('Cloudburst telemetry: 58 mm/hr over Pashan & Baner catchment.');
        } else if (next === 2) {
          setToastMessage('Drainage capacity at 88% — Sangvi Causeway water level crossed 35 cm.');
          setDamsList(prevDams =>
            prevDams.map(d =>
              d.id === 'dam-khadakwasla' ? { ...d, dischargeCusecs: 34500, warningStatus: 'Alert' } : d
            )
          );
        } else if (next === 3) {
          setToastMessage('Critical PMC Red Alert: Khadakwasla releasing 38,000 cusecs into Mutha river.');
          setEmergencyBroadcast({
            id: 'sim-broadcast',
            severity: 'Critical',
            title: 'PMC RED ALERT: Riverside Societies Inundation Warning',
            location: 'Sinhagad Road, Deccan, Pulachi Wadi, Sangvi',
            expectedIn: 'Immediate',
            timestamp: 'Just Now (Disaster Cell)',
            acknowledged: false,
            recommendedAction: 'Move vehicles to elevated parking; ground-floor residents prepare for temporary evacuation.',
            isOfficialBroadcast: true,
          });
        }
        return next;
      });
    }, 3800);

    return () => clearInterval(interval);
  }, [isSimulating]);

  // Dynamic simulation multipliers
  const simRainfallBoost = isSimulating ? simulationStep * 14 : 0;
  const simDrainageBoost = isSimulating ? simulationStep * 7 : 0;
  const simDepthBoost = isSimulating ? simulationStep * 7 : 0;

  // Compute Road Status dynamically based on Forecast + Simulation
  const roads = useMemo(() => {
    const timeMultiplier = 1 + forecastIndex * 0.18;

    return INITIAL_ROADS.map(road => {
      const depth = Math.round(road.currentDepthCm * timeMultiplier + simDepthBoost);
      const predictedDepth = Math.round(road.predictedDepthCm * (1 + forecastIndex * 0.1) + simDepthBoost * 1.2);
      const rain = Math.round(road.rainfallMmHr + forecastIndex * 4 + simRainfallBoost);
      const load = Math.min(99, Math.round(road.drainageLoadPct + forecastIndex * 3 + simDrainageBoost));

      let risk: FloodRiskLevel = 'Safe';
      if (depth >= 40) risk = 'Critical';
      else if (depth >= 25) risk = 'High';
      else if (depth >= 12) risk = 'Moderate';
      else if (depth >= 5) risk = 'Low';

      let traffic: RoadSegment['trafficStatus'] = road.trafficStatus;
      if (depth >= 40) traffic = 'Closed';
      else if (depth >= 25) traffic = 'Diverted';
      else if (depth >= 15) traffic = 'Slow';

      return {
        ...road,
        currentDepthCm: depth,
        predictedDepthCm: predictedDepth,
        rainfallMmHr: rain,
        drainageLoadPct: load,
        riskLevel: risk,
        trafficStatus: traffic,
      };
    });
  }, [forecastIndex, simDepthBoost, simRainfallBoost, simDrainageBoost]);

  // Compute Flood Zones dynamically
  const floodZones = useMemo(() => {
    const timeMultiplier = 1 + forecastIndex * 0.2;
    return INITIAL_FLOOD_ZONES.map(zone => {
      const depth = Math.round(zone.currentDepthCm * timeMultiplier + simDepthBoost);
      let risk: FloodRiskLevel = 'Low';
      if (depth >= 40) risk = 'Critical';
      else if (depth >= 25) risk = 'High';
      else if (depth >= 12) risk = 'Moderate';

      return {
        ...zone,
        currentDepthCm: depth,
        predictedDepthCm: Math.round(zone.predictedDepthCm * timeMultiplier + simDepthBoost * 1.1),
        riskLevel: risk,
      };
    });
  }, [forecastIndex, simDepthBoost]);

  // Compute Drainage Points with live pump state
  const drainagePoints = useMemo(() => {
    return INITIAL_DRAINAGE_POINTS.map(dp => {
      const overrides = drainageControlState[dp.id] || {};
      const load = Math.min(
        99,
        Math.max(10, Math.round(dp.currentLoadPct + forecastIndex * 4 + simDrainageBoost - (overrides.isPumpActive ? 15 : 0)))
      );

      let status: DrainagePoint['status'] = 'Normal';
      if (load >= 90) status = 'Overloaded';
      else if (load >= 70) status = 'Warning';

      return {
        ...dp,
        currentLoadPct: load,
        status,
        predictedOverloadMin: load >= 85 ? Math.max(15, 60 - forecastIndex * 15) : dp.predictedOverloadMin,
        isPumpActive: overrides.isPumpActive !== undefined ? overrides.isPumpActive : true,
        gateStatus: overrides.gateStatus || dp.gateStatus,
        pumpFlowLps: overrides.isPumpActive ? Math.round(dp.capacityLps * 0.85) : 0,
      };
    });
  }, [forecastIndex, simDrainageBoost, drainageControlState]);

  // Current status metrics
  const currentMetrics = useMemo(() => {
    const baseRain = 42 + forecastIndex * 5 + simRainfallBoost;
    const baseDepth = 28 + forecastIndex * 4 + simDepthBoost;
    const baseDrain = Math.min(98, 72 + forecastIndex * 4 + simDrainageBoost);

    let risk: FloodRiskLevel = 'Moderate';
    if (baseDepth >= 40 || baseRain >= 70) risk = 'High';
    if (baseDepth >= 45 || isSimulating && simulationStep >= 3) risk = 'Critical';
    if (forecastIndex === 0 && !isSimulating) risk = 'Moderate';

    return {
      rainfallMmHr: baseRain,
      rainfallTrend: (isSimulating || forecastIndex > 0 ? 'Increasing' : 'Increasing') as 'Increasing' | 'Stable' | 'Decreasing',
      overallRisk: risk,
      maxDepthCm: baseDepth,
      drainageLoadPct: baseDrain,
    };
  }, [forecastIndex, simRainfallBoost, simDepthBoost, simDrainageBoost, isSimulating, simulationStep]);

  // Keep selectedRoad in sync
  useEffect(() => {
    if (selectedRoad) {
      const fresh = roads.find(r => r.id === selectedRoad.id);
      if (fresh) setSelectedRoad(fresh);
    }
  }, [roads]);

  // Keep selectedDrainage in sync
  useEffect(() => {
    if (selectedDrainage) {
      const fresh = drainagePoints.find(d => d.id === selectedDrainage.id);
      if (fresh) setSelectedDrainage(fresh);
    }
  }, [drainagePoints]);

  const startSimulation = useCallback(() => {
    setIsSimulating(true);
    setSimulationStep(0);
    setToastMessage('Simulation started: Monsoon squall event active.');
  }, []);

  const stopSimulation = useCallback(() => {
    setIsSimulating(false);
    setToastMessage('Simulation stopped: Returned to baseline live telemetry.');
  }, []);

  const resetSimulation = useCallback(() => {
    setIsSimulating(false);
    setSimulationStep(0);
    setForecastIndex(0);
    setEmergencyBroadcast(null);
    setToastMessage('Telemetry reset to nominal Pune observations.');
  }, []);

  const acknowledgeAlert = useCallback((id: string) => {
    setAlerts(prev => prev.map(a => (a.id === id ? { ...a, acknowledged: true } : a)));
  }, []);

  const findSaferRouteForRoad = useCallback((roadName: string) => {
    setSelectedRoad(null);
    setRouteDestination(`${roadName} Area`);
    setActivePage('safe-routes');
  }, []);

  const calculateRoutes = useCallback(() => {
    setIsCalculatingRoute(true);
    setTimeout(() => {
      setRoutesList(INITIAL_ROUTES.map(route => {
        // Evaluate suitability based on vehicle clearance
        const maxD = route.maxWaterDepthCm;
        const twoWheelerSafe = maxD <= 12;
        const carSafe = maxD <= 22;
        const suvSafe = maxD <= 42;

        let rec = false;
        if (vehicleCategory === 'two-wheeler') rec = twoWheelerSafe;
        else if (vehicleCategory === 'four-wheeler') rec = carSafe && route.id === 'route-2';
        else rec = route.id === 'route-2' || (route.id === 'route-1' && maxD < 30);

        return {
          ...route,
          isRecommended: rec,
          vehicleSuitability: { twoWheelerSafe, carSafe, suvSafe },
        };
      }));
      setIsCalculatingRoute(false);
      setToastMessage(`Safe routing computed for ${vehicleCategory.replace('-', ' ')} with flood depth clearance.`);
    }, 550);
  }, [vehicleCategory]);

  // Citizen report submission
  const submitCitizenReport = useCallback((report: Omit<CitizenReport, 'id' | 'reportedAt' | 'upvotes' | 'status'>) => {
    const newReport: CitizenReport = {
      ...report,
      id: `rep-${Date.now()}`,
      reportedAt: 'Just Now',
      status: 'Investigating',
      upvotes: 1,
    };
    setCitizenReports(prev => [newReport, ...prev]);
    setToastMessage(`Report logged for ${report.location}. Sent to PMC Disaster Control Ward Desk.`);
  }, []);

  const upvoteReport = useCallback((reportId: string) => {
    setCitizenReports(prev =>
      prev.map(r => (r.id === reportId ? { ...r, upvotes: r.upvotes + 1 } : r))
    );
  }, []);

  // PMC Operations
  const dispatchUnitToSector = useCallback((unitId: string, sector: string) => {
    setDispatchUnits(prev =>
      prev.map(u => (u.id === unitId ? { ...u, status: 'En Route', currentSector: sector } : u))
    );
    setToastMessage(`Unit ${unitId} dispatched to ${sector}.`);
  }, []);

  const toggleDrainagePump = useCallback((drainageId: string) => {
    setDrainageControlState(prev => {
      const current = prev[drainageId] || {};
      const newStatus = !current.isPumpActive;
      return {
        ...prev,
        [drainageId]: { ...current, isPumpActive: newStatus },
      };
    });
    setToastMessage(`Drainage pump state toggled on ${drainageId}.`);
  }, []);

  const setDrainageSluiceGate = useCallback((drainageId: string, status: 'Fully Open' | 'Partially Open' | 'Closed') => {
    setDrainageControlState(prev => ({
      ...prev,
      [drainageId]: { ...(prev[drainageId] || {}), gateStatus: status },
    }));
    setToastMessage(`Sluice gate on ${drainageId} set to: ${status}.`);
  }, []);

  const broadcastEmergencyAlert = useCallback((title: string, location: string, action: string, severity: 'Critical' | 'High') => {
    const newAlert: FloodAlert = {
      id: `alert-broadcast-${Date.now()}`,
      severity,
      title,
      location,
      expectedIn: 'Immediate broadcast',
      timestamp: 'Just Now (PMC Control Room)',
      acknowledged: false,
      recommendedAction: action,
      isOfficialBroadcast: true,
    };
    setAlerts(prev => [newAlert, ...prev]);
    setEmergencyBroadcast(newAlert);
    setToastMessage(`EMERGENCY BROADCAST TRANSMITTED: All citizens notified in ${location}.`);
  }, []);

  const dismissEmergencyBroadcast = useCallback(() => {
    setEmergencyBroadcast(null);
  }, []);

  const value = {
    userRole,
    setUserRole,
    authenticatedOfficer,
    isAuthModalOpen,
    openAuthModal,
    closeAuthModal,
    loginOfficer,
    logoutOfficer,
    activePage,
    setActivePage,
    forecastIndex,
    setForecastIndex,
    currentTimeStep,
    roads,
    floodZones,
    drainagePoints,
    alerts,
    selectedRoad,
    setSelectedRoad,
    selectedDrainage,
    setSelectedDrainage,
    isSimulating,
    simulationStep,
    startSimulation,
    stopSimulation,
    resetSimulation,
    layers,
    toggleLayer,
    selectedLocality,
    setSelectedLocality,
    currentMetrics,
    acknowledgeAlert,
    findSaferRouteForRoad,
    routeOrigin,
    setRouteOrigin,
    routeDestination,
    setRouteDestination,
    vehicleCategory,
    setVehicleCategory,
    routesList,
    selectedRouteId,
    setSelectedRouteId,
    isCalculatingRoute,
    calculateRoutes,
    citizenReports,
    submitCitizenReport,
    upvoteReport,
    damsList,
    dispatchUnits,
    dispatchUnitToSector,
    toggleDrainagePump,
    setDrainageSluiceGate,
    broadcastEmergencyAlert,
    emergencyBroadcast,
    dismissEmergencyBroadcast,
    toastMessage,
    clearToast,
  };

  return <FloodContext.Provider value={value}>{children}</FloodContext.Provider>;
};

export const useFlood = (): FloodContextType => {
  const context = useContext(FloodContext);
  if (!context) {
    throw new Error('useFlood must be used within a FloodProvider');
  }
  return context;
};
