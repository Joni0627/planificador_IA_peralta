import React from 'react';
import { Truck, Driver, TruckStatus, DriverStatus, DriverLicenseStatus } from '../types';
import { Truck as TruckIcon, User, AlertCircle } from 'lucide-react';

interface FleetOverviewProps {
  trucks: Truck[];
  drivers: Driver[];
}

const FleetOverview: React.FC<FleetOverviewProps> = ({ trucks, drivers }) => {
  
  const getStatusColor = (status: string) => {
    if (status === TruckStatus.AVAILABLE || status === DriverStatus.RESTED || status === DriverLicenseStatus.VALID) return 'text-green-600 bg-green-50 border-green-200';
    if (status === TruckStatus.MAINTENANCE_PLANNED || status === DriverStatus.TIRED) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-full flex flex-col">
      <div className="p-4 border-b border-slate-100 bg-slate-50">
        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          Estado de Flota en Tiempo Real
        </h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Trucks Section */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Unidades ({trucks.length})</h4>
          <div className="grid gap-3">
            {trucks.map(truck => (
              <div key={truck.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-slate-300 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${truck.status === TruckStatus.AVAILABLE ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                    <TruckIcon size={18} />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{truck.plate}</p>
                    <p className="text-xs text-slate-500">{truck.type} • {truck.capacityTons}t</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(truck.status)}`}>
                  {truck.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Drivers Section */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Choferes ({drivers.length})</h4>
          <div className="grid gap-3">
            {drivers.map(driver => (
              <div key={driver.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-slate-300 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${driver.status === DriverStatus.RESTED ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                    <User size={18} />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{driver.name}</p>
                    <p className="text-xs text-slate-500">Exp: {driver.yearsExperience} años</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${getStatusColor(driver.status)}`}>
                    {driver.status}
                  </span>
                   {driver.licenseStatus !== DriverLicenseStatus.VALID && (
                     <span className="text-[10px] text-red-600 font-bold flex items-center gap-1">
                       <AlertCircle size={10} /> {driver.licenseStatus}
                     </span>
                   )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FleetOverview;