import React from 'react';
import { MatchRecommendation, Truck, Driver, TripAnalysis, TripRequest } from '../types';
import { Truck as TruckIcon, User, ArrowRight, Map, AlertTriangle, ShieldCheck, ShieldAlert, Navigation } from 'lucide-react';

interface MatchResultProps {
  analysis: TripAnalysis | null;
  matches: MatchRecommendation[];
  trucks: Truck[];
  drivers: Driver[];
  request: TripRequest | null;
  onAssign: (match: MatchRecommendation) => void;
}

const MatchResult: React.FC<MatchResultProps> = ({ analysis, matches, trucks, drivers, request, onAssign }) => {
  if (!matches.length || !analysis || !request) return null;

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Bajo': return 'text-green-700 border-green-200 bg-green-50';
      case 'Medio': return 'text-yellow-700 border-yellow-200 bg-yellow-50';
      case 'Alto': return 'text-red-700 border-red-200 bg-red-50';
      default: return 'text-slate-400';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'Bajo': return <ShieldCheck size={16} />;
      case 'Medio': return <AlertTriangle size={16} />;
      case 'Alto': return <ShieldAlert size={16} />;
      default: return <ShieldCheck size={16} />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* 1. Trip Analysis Summary (Updated to Brand Dark/Red theme) */}
      <div className="bg-slate-900 rounded-xl p-5 text-white shadow-lg border-t-4 border-brand-600">
        
        {/* Row 1: Origin -> Dest & Basic Stats */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-4">
           <div className="flex items-center gap-3">
              <div className="bg-brand-700 p-2.5 rounded-lg shadow-lg">
                <Map size={22} className="text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 text-base font-semibold text-white">
                  <span>{request.origin}</span> 
                  <ArrowRight size={14} className="text-slate-500" /> 
                  <span>{request.destination}</span>
                </div>
                <div className="flex gap-4 text-xs text-slate-400 mt-1">
                  <span className="flex items-center gap-1">⏱ {analysis.estimatedDuration}</span>
                  <span className="flex items-center gap-1">📏 {analysis.estimatedDistanceKm}</span>
                </div>
              </div>
           </div>
           
           <div className="text-right">
             <span className="text-xs text-slate-500 uppercase tracking-wider block mb-1">Vehículo Ideal</span>
             <span className="text-sm font-medium text-brand-200">{analysis.idealVehicleDescription}</span>
           </div>
        </div>

        {/* Row 2: Route & Risk Analysis */}
        <div className="grid md:grid-cols-2 gap-4">
          
          {/* Suggested Route */}
          <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
            <h4 className="text-[10px] uppercase tracking-wider text-brand-400 mb-2 flex items-center gap-2">
              <Navigation size={12} /> Ruta Sugerida
            </h4>
            <p className="text-sm text-slate-200 font-medium leading-relaxed">
              {analysis.suggestedRoute}
            </p>
          </div>

          {/* Risk Analysis */}
          <div className={`rounded-lg p-3 border ${getRiskColor(analysis.riskLevel)} bg-opacity-10 border-opacity-30`}>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-[10px] uppercase tracking-wider font-bold opacity-100 flex items-center gap-2">
                {getRiskIcon(analysis.riskLevel)} Análisis de Riesgo: {analysis.riskLevel}
              </h4>
            </div>
            <p className="text-sm opacity-90 leading-relaxed">
              {analysis.riskAnalysis}
            </p>
          </div>

        </div>
      </div>

      {/* 2. Recommendations List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">
            Opciones Disponibles
          </h3>
        </div>

        <div className="grid gap-3">
          {matches.map((match, index) => {
            const truck = trucks.find(t => t.id === match.truckId);
            const driver = drivers.find(d => d.id === match.driverId);

            if (!truck || !driver) return null;

            const isBestMatch = index === 0;
            const capacityShortage = truck.capacityTons < request.weightTons;

            return (
              <div 
                key={`${match.truckId}-${match.driverId}`}
                className={`group relative bg-white rounded-lg p-4 border transition-all hover:shadow-md ${isBestMatch ? 'border-brand-300 ring-1 ring-brand-100 shadow-brand-100' : 'border-slate-200'}`}
              >
                <div className="flex items-center justify-between gap-4">
                  
                  {/* Left: Score & Basic Info */}
                  <div className="flex items-center gap-4">
                     <div className={`flex flex-col items-center justify-center w-12 h-12 rounded-lg ${isBestMatch ? 'bg-brand-50 text-brand-700' : 'bg-slate-50 text-slate-500'}`}>
                        <span className="text-lg font-bold">{match.matchScore}%</span>
                     </div>
                     
                     <div>
                       <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-slate-900 text-sm">{match.tripType}</h4>
                          {isBestMatch && <span className="text-[10px] bg-brand-100 text-brand-700 px-2 rounded-full font-medium">Recomendado</span>}
                       </div>
                       
                       {/* Compact Resources Line */}
                       <div className="flex items-center gap-3 mt-1 text-xs text-slate-600">
                          <span className="flex items-center gap-1 font-medium"><TruckIcon size={12} className="text-blue-600"/> {truck.plate}</span>
                          <span className="text-slate-300">|</span>
                          <span className="flex items-center gap-1"><User size={12} className="text-indigo-600"/> {driver.name}</span>
                          {capacityShortage && (
                            <span className="flex items-center gap-1 text-orange-600 font-bold ml-2">
                              <AlertTriangle size={10} /> Cap. Limitada
                            </span>
                          )}
                       </div>
                     </div>
                  </div>

                  {/* Right: Action */}
                  <button 
                    onClick={() => onAssign(match)}
                    className="px-4 py-2 bg-white border border-slate-200 hover:border-brand-700 hover:bg-brand-700 hover:text-white text-slate-700 text-xs font-medium rounded-md transition-all flex items-center gap-2 whitespace-nowrap"
                  >
                    Seleccionar <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MatchResult;