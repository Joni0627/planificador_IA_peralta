export enum TruckStatus {
  AVAILABLE = 'Disponible',
  IN_TRANSIT = 'En Tránsito',
  MAINTENANCE_PLANNED = 'Mantenimiento Programado',
  MAINTENANCE_URGENT = 'Mantenimiento Urgente'
}

export enum TruckType {
  VOLCADOR = 'Volcador', // Dump truck (stones, sand)
  SIDER = 'Sider', // Curtain side (pallets)
  PLAYO = 'Playo', // Flatbed (containers, machinery)
  REFRIGERADO = 'Refrigerado' // Cool chain
}

export enum DriverStatus {
  RESTED = 'Descansado',
  TIRED = 'Horas Cumplidas (Fatigado)',
  ON_LEAVE = 'Licencia',
}

export enum DriverLicenseStatus {
  VALID = 'Vigente',
  EXPIRED = 'Vencida',
  IRREGULAR = 'Irregularidad Detectada'
}

export interface Truck {
  id: string;
  plate: string;
  type: TruckType;
  status: TruckStatus;
  capacityTons: number;
  currentLocation: string;
}

export interface Driver {
  id: string;
  name: string;
  dni: string;
  status: DriverStatus;
  licenseStatus: DriverLicenseStatus;
  yearsExperience: number;
}

export interface TripRequest {
  origin: string;
  destination: string;
  materialType: string;
  weightTons: number;
  urgency: 'Normal' | 'Urgente';
}

export interface MatchRecommendation {
  truckId: string;
  driverId: string;
  matchScore: number; // 0-100
  reasoning: string;
  tripType: 'Corta Distancia' | 'Media Distancia' | 'Larga Distancia';
}

export interface TripAnalysis {
  estimatedDistanceKm: string;
  estimatedDuration: string;
  idealVehicleDescription: string;
  suggestedRoute: string; // e.g., "RN 9 -> Autopista Rosario-Córdoba"
  riskLevel: 'Bajo' | 'Medio' | 'Alto';
  riskAnalysis: string; // e.g., "Tráfico pesado en zona portuaria, posible demora."
}

export interface AIServiceResponse {
  analysis: TripAnalysis;
  recommendations: MatchRecommendation[];
}

export interface ConfirmedAssignment {
  id: string; // Internal ID
  customerTransportId: string;
  date: string;
  origin: string;
  destination: string;
  materialType: string;
  truckPlate: string;
  driverName: string;
  status: 'Programado' | 'En Curso' | 'Finalizado';
}