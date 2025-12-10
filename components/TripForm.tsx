import React, { useState } from 'react';
import { TripRequest } from '../types';
import { MapPin, Box, Scale, ArrowRight, Search, Loader2 } from 'lucide-react';

interface TripFormProps {
  onSubmit: (data: TripRequest) => void;
  isLoading: boolean;
}

const TripForm: React.FC<TripFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<TripRequest>({
    origin: '',
    destination: '',
    materialType: '',
    weightTons: 0,
    urgency: 'Normal'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
      <h2 className="text-xl font-bold text-slate-900 mb-2">Nuevo Agenciamiento</h2>
      <p className="text-sm text-slate-500 mb-6">Complete los detalles del viaje para encontrar recursos disponibles.</p>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 uppercase">Origen</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-slate-400" size={16} />
              <input 
                type="text" 
                required
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all text-sm"
                placeholder="Ej. Córdoba Capital"
                value={formData.origin}
                onChange={(e) => setFormData({...formData, origin: e.target.value})}
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 uppercase">Destino</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-slate-400" size={16} />
              <input 
                type="text" 
                required
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all text-sm"
                placeholder="Ej. Villa María, Córdoba"
                value={formData.destination}
                onChange={(e) => setFormData({...formData, destination: e.target.value})}
              />
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700 uppercase">Material a Transportar</label>
          <div className="relative">
            <Box className="absolute left-3 top-3 text-slate-400" size={16} />
            <input 
              type="text" 
              required
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all text-sm"
              placeholder="Ej. Piedras, Pallets de Bebidas, Maquinaria..."
              value={formData.materialType}
              onChange={(e) => setFormData({...formData, materialType: e.target.value})}
            />
          </div>
          <p className="text-[10px] text-slate-400 mt-1">* Esto determinará el tipo de camión (Volcador, Sider, etc.)</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 uppercase">Peso Estimado (TN)</label>
            <div className="relative">
              <Scale className="absolute left-3 top-3 text-slate-400" size={16} />
              <input 
                type="number" 
                required
                min="1"
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all text-sm"
                placeholder="0"
                value={formData.weightTons || ''}
                onChange={(e) => setFormData({...formData, weightTons: Number(e.target.value)})}
              />
            </div>
          </div>
          <div className="space-y-1">
             <label className="text-xs font-semibold text-slate-700 uppercase">Prioridad</label>
             <select 
               className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all text-sm appearance-none"
               value={formData.urgency}
               onChange={(e) => setFormData({...formData, urgency: e.target.value as any})}
             >
               <option value="Normal">Normal</option>
               <option value="Urgente">Urgente</option>
             </select>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-brand-600 hover:bg-brand-700 disabled:bg-slate-300 text-white font-medium py-3 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-4"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Analizando Flota...
            </>
          ) : (
            <>
              <Search size={20} />
              Buscar Asignación Inteligente
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default TripForm;