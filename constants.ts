import { Driver, DriverLicenseStatus, DriverStatus, Truck, TruckStatus, TruckType } from "./types";

export const MOCK_TRUCKS: Truck[] = [
  {
    id: 'T001',
    plate: 'AA 123 CD',
    type: TruckType.VOLCADOR,
    status: TruckStatus.AVAILABLE,
    capacityTons: 30,
    currentLocation: 'Base Central'
  },
  {
    id: 'T002',
    plate: 'AD 456 EF',
    type: TruckType.SIDER,
    status: TruckStatus.AVAILABLE,
    capacityTons: 25,
    currentLocation: 'Base Central'
  },
  {
    id: 'T003',
    plate: 'AF 789 GH',
    type: TruckType.PLAYO,
    status: TruckStatus.MAINTENANCE_PLANNED, // Unavailable
    capacityTons: 28,
    currentLocation: 'Taller Norte'
  },
  {
    id: 'T004',
    plate: 'AE 321 IJ',
    type: TruckType.PLAYO,
    status: TruckStatus.AVAILABLE,
    capacityTons: 28,
    currentLocation: 'Base Central'
  },
  {
    id: 'T005',
    plate: 'AB 654 KL',
    type: TruckType.VOLCADOR,
    status: TruckStatus.IN_TRANSIT, // Unavailable
    capacityTons: 30,
    currentLocation: 'Ruta 9 km 200'
  },
  {
    id: 'T006',
    plate: 'AC 987 MN',
    type: TruckType.REFRIGERADO,
    status: TruckStatus.AVAILABLE,
    capacityTons: 22,
    currentLocation: 'Base Sur'
  }
];

export const MOCK_DRIVERS: Driver[] = [
  {
    id: 'D001',
    name: 'Carlos Perez',
    dni: '24.567.890',
    status: DriverStatus.RESTED,
    licenseStatus: DriverLicenseStatus.VALID,
    yearsExperience: 10
  },
  {
    id: 'D002',
    name: 'Miguel Rodriguez',
    dni: '30.123.456',
    status: DriverStatus.RESTED, // Changed to AVAILABLE for demo purposes so we have 3 options
    licenseStatus: DriverLicenseStatus.VALID,
    yearsExperience: 5
  },
  {
    id: 'D003',
    name: 'Ana Gomez',
    dni: '28.901.234',
    status: DriverStatus.RESTED,
    licenseStatus: DriverLicenseStatus.EXPIRED, // Unavailable
    yearsExperience: 8
  },
  {
    id: 'D004',
    name: 'Roberto Diaz',
    dni: '22.345.678',
    status: DriverStatus.RESTED,
    licenseStatus: DriverLicenseStatus.VALID,
    yearsExperience: 15
  },
  {
    id: 'D005',
    name: 'Fernando Ruiz',
    dni: '41.234.567',
    status: DriverStatus.ON_LEAVE, // Unavailable
    licenseStatus: DriverLicenseStatus.VALID,
    yearsExperience: 2
  }
];