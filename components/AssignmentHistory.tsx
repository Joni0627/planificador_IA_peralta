import React from 'react';
import { ConfirmedAssignment } from '../types';
import { ArrowLeft, Search, Truck, User, Calendar, FileText } from 'lucide-react';

interface AssignmentHistoryProps {
  history: ConfirmedAssignment[];
  onBack: () => void;
}

const AssignmentHistory: React.FC<AssignmentHistoryProps> = ({ history, onBack }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden min-h-[500px] flex flex-col">
      {/* Header */}
      <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Historial de Agenciamientos</h2>
            <p className="text-xs text-slate-500">Listado de órdenes generadas y confirmadas.</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400">
             <div className="p-4 bg-slate-50 rounded-full mb-3">
               <FileText size={32} />
             </div>
             <p>No hay agenciamientos registrados aún.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-xs">
                <tr>
                  <th className="px-4 py-3 rounded-l-lg">ID Interno</th>
                  <th className="px-4 py-3">Cliente ID</th>
                  <th className="px-4 py-3">Fecha</th>
                  <th className="px-4 py-3">Ruta</th>
                  <th className="px-4 py-3">Recursos</th>
                  <th className="px-4 py-3 rounded-r-lg text-right">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {history.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-4 font-mono font-medium text-slate-700">{item.id}</td>
                    <td className="px-4 py-4 font-semibold text-brand-700">{item.customerTransportId}</td>
                    <td className="px-4 py-4 text-slate-500">
                      <div className="flex items-center gap-1">
                        <Calendar size={12} /> {item.date}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-800">{item.origin}</span>
                        <span className="text-xs text-slate-400">a {item.destination}</span>
                        <span className="text-[10px] text-slate-400 bg-slate-100 w-fit px-1.5 rounded mt-1">{item.materialType}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                       <div className="flex flex-col gap-1">
                         <div className="flex items-center gap-2 text-slate-600">
                           <Truck size={12} className="text-blue-500"/> {item.truckPlate}
                         </div>
                         <div className="flex items-center gap-2 text-slate-600">
                           <User size={12} className="text-indigo-500"/> {item.driverName}
                         </div>
                       </div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignmentHistory;