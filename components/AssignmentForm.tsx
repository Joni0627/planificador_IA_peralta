import React, { useState, useEffect } from 'react';
import { Driver, MatchRecommendation, TripRequest, Truck } from '../types';
import { ArrowLeft, CheckCircle, FileText, Truck as TruckIcon, User, MapPin, Hash } from 'lucide-react';

interface AssignmentFormProps {
  match: MatchRecommendation;
  truck: Truck;
  driver: Driver;
  request: TripRequest;
  onBack: () => void;
  onConfirm: (data: { internalId: string; customerTransportId: string }) => void;
}

const AssignmentForm: React.FC<AssignmentFormProps> = ({ 
  match, truck, driver, request, onBack, onConfirm 
}) => {
  const [internalId, setInternalId] = useState('');
  const [customerTransportId, setCustomerTransportId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Generate a random internal ID (Agenciamiento ID) like AGE-2024-XXXX
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    setInternalId(`AGE-${new Date().getFullYear()}-${randomNum}`);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      onConfirm({ internalId, customerTransportId });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
      
      {/* Header */}
      <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Confirmar Agenciamiento</h2>
          <p className="text-xs text-slate-500">Verifique los datos y asigne el número de transporte.</p>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Col: Trip Summary */}
        <div className="space-y-6">
          
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide border-b pb-2">Detalles del Viaje</h3>
            <div className="grid gap-3 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="text-brand-500 mt-0.5" size={16} />
                <div>
                  <p className="text-slate-500 text-xs">Origen</p>
                  <p className="font-medium text-slate-800">{request.origin}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="text-red-500 mt-0.5" size={16} />
                <div>
                  <p className="text-slate-500 text-xs">Destino</p>
                  <p className="font-medium text-slate-800">{request.destination}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FileText className="text-slate-400 mt-0.5" size={16} />
                <div>
                  <p className="text-slate-500 text-xs">Carga</p>
                  <p className="font-medium text-slate-800">{request.materialType} ({request.weightTons} TN)</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide border-b pb-2">Recursos Asignados</h3>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="flex items-center gap-3 mb-2">
                <TruckIcon className="text-blue-600" size={20} />
                <span className="font-bold text-blue-900">Camión: {truck.plate}</span>
              </div>
              <p className="text-xs text-blue-700 ml-8">{truck.type} • {truck.capacityTons} Toneladas</p>
            </div>

            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
               <div className="flex items-center gap-3 mb-2">
                <User className="text-indigo-600" size={20} />
                <span className="font-bold text-indigo-900">Chofer: {driver.name}</span>
              </div>
              <p className="text-xs text-indigo-700 ml-8">DNI: {driver.dni}</p>
            </div>
          </div>

        </div>

        {/* Right Col: Form */}
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 h-fit">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">N° Interno de Agenciamiento</label>
              <div className="flex items-center gap-2 bg-slate-200 border border-slate-300 rounded-lg px-4 py-3 text-slate-500 cursor-not-allowed">
                <Hash size={18} />
                <span className="font-mono font-medium">{internalId}</span>
              </div>
              <p className="text-[10px] text-slate-400">Generado automáticamente por el sistema.</p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-brand-700 uppercase">N° de Transporte (Cliente)</label>
              <input 
                type="text" 
                autoFocus
                required
                value={customerTransportId}
                onChange={(e) => setCustomerTransportId(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-brand-200 rounded-lg focus:ring-4 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all font-medium text-slate-900"
                placeholder="Ej. TR-9988-X"
              />
              <p className="text-[10px] text-slate-500">Ingrese el número de remito o transporte provisto por el cliente.</p>
            </div>

            <div className="pt-4">
              <button 
                type="submit"
                disabled={isSubmitting || !customerTransportId}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span className="animate-pulse">Procesando...</span>
                ) : (
                  <>
                    <CheckCircle size={20} />
                    Confirmar y Generar Orden
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

export default AssignmentForm;