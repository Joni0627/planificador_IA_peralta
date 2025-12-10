import React, { useState } from 'react';
import TripForm from './components/TripForm';
import FleetOverview from './components/FleetOverview';
import MatchResult from './components/MatchResult';
import AssignmentForm from './components/AssignmentForm';
import AssignmentHistory from './components/AssignmentHistory';
import { MOCK_DRIVERS, MOCK_TRUCKS } from './constants';
import { MatchRecommendation, TripRequest, TripAnalysis, ConfirmedAssignment } from './types';
import { findMatches } from './services/geminiService';
import { Activity, LayoutDashboard, CheckCircle, FileClock, Menu } from 'lucide-react';

type ViewState = 'SEARCH' | 'ASSIGNMENT' | 'SUCCESS' | 'HISTORY';

export default function App() {
  const [view, setView] = useState<ViewState>('SEARCH');
  const [isLoading, setIsLoading] = useState(false);
  
  // Current Flow Data
  const [currentRequest, setCurrentRequest] = useState<TripRequest | null>(null);
  const [matches, setMatches] = useState<MatchRecommendation[]>([]);
  const [tripAnalysis, setTripAnalysis] = useState<TripAnalysis | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<MatchRecommendation | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Application Data (In-memory storage for demo)
  const [history, setHistory] = useState<ConfirmedAssignment[]>([]);

  const handleAnalyzeTrip = async (request: TripRequest) => {
    setIsLoading(true);
    setError(null);
    setMatches([]);
    setTripAnalysis(null);
    setCurrentRequest(request);

    try {
      const { analysis, recommendations } = await findMatches(request, MOCK_TRUCKS, MOCK_DRIVERS);
      setTripAnalysis(analysis);
      setMatches(recommendations);
    } catch (err) {
      setError("Hubo un error al comunicarse con la IA. Por favor verifica tu API Key.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignClick = (match: MatchRecommendation) => {
    setSelectedMatch(match);
    setView('ASSIGNMENT');
  };

  const handleConfirmAssignment = (data: { internalId: string; customerTransportId: string }) => {
    if (!selectedMatch || !currentRequest) return;

    // Save to history
    const truck = MOCK_TRUCKS.find(t => t.id === selectedMatch.truckId);
    const driver = MOCK_DRIVERS.find(d => d.id === selectedMatch.driverId);

    const newAssignment: ConfirmedAssignment = {
      id: data.internalId,
      customerTransportId: data.customerTransportId,
      date: new Date().toLocaleDateString(),
      origin: currentRequest.origin,
      destination: currentRequest.destination,
      materialType: currentRequest.materialType,
      truckPlate: truck?.plate || 'Unknown',
      driverName: driver?.name || 'Unknown',
      status: 'Programado'
    };

    setHistory(prev => [newAssignment, ...prev]);

    // Show success screen
    setView('SUCCESS');
    
    // Reset flow
    setTimeout(() => {
      setMatches([]);
      setTripAnalysis(null);
      setSelectedMatch(null);
      setCurrentRequest(null);
      setView('SEARCH');
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Navbar - Peralta Style (White bg, Red/Green Logo) */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo Area */}
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => setView('SEARCH')}
          >
            {/* Simulated Logo Icon */}
            <div className="relative">
              <div className="w-10 h-10 bg-brand-700 rounded-md flex items-center justify-center shadow-md transform -skew-x-12">
                <span className="text-white font-black text-xl transform skew-x-12">P</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-peralta-green rounded-sm transform -skew-x-12 border-2 border-white"></div>
            </div>

            <div className="flex flex-col justify-center">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-none mb-0.5">
                Transporte
              </div>
              <div className="text-2xl font-black tracking-tight leading-none text-slate-900 flex">
                <span className="text-brand-700">P</span>
                <span className="text-peralta-green">ERALTA</span>
              </div>
            </div>
          </div>
          
          {/* Navigation */}
          <div className="flex items-center gap-8">
            <button 
              onClick={() => setView('HISTORY')}
              className={`flex items-center gap-2 text-sm font-bold uppercase tracking-wide transition-colors ${view === 'HISTORY' ? 'text-brand-700' : 'text-slate-500 hover:text-brand-700'}`}
            >
              <FileClock size={18} />
              Historial
            </button>
            
            <div className="hidden md:flex items-center gap-4 border-l border-slate-200 pl-8">
              <div className="flex flex-col items-end">
                <span className="text-xs font-bold text-slate-800">Operador Logístico</span>
                <span className="text-[10px] text-green-600 font-bold flex items-center gap-1 bg-green-50 px-2 rounded-full">
                  <span className="w-1.5 h-1.5 bg-green-600 rounded-full animate-pulse"></span>
                  En Línea
                </span>
              </div>
              <div className="h-10 w-10 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-bold shadow-sm">
                AD
              </div>
            </div>

             {/* Mobile Menu Icon */}
             <button className="md:hidden text-slate-600">
               <Menu size={24} />
             </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-6">
        
        {view === 'HISTORY' ? (
           <AssignmentHistory history={history} onBack={() => setView('SEARCH')} />
        ) : view === 'SUCCESS' ? (
           <div className="flex flex-col items-center justify-center h-[60vh] animate-in zoom-in duration-500">
             <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-sm border border-green-200">
               <CheckCircle className="text-peralta-green w-12 h-12" />
             </div>
             <h2 className="text-3xl font-bold text-slate-900 mb-2">¡Orden Confirmada!</h2>
             <p className="text-slate-500 text-lg">El viaje ha sido asignado al sistema de Transporte Peralta.</p>
             <p className="text-sm text-slate-400 mt-8">Volviendo al panel...</p>
           </div>
        ) : view === 'ASSIGNMENT' && selectedMatch && currentRequest ? (
          
          <div className="max-w-4xl mx-auto">
            <AssignmentForm 
              match={selectedMatch}
              truck={MOCK_TRUCKS.find(t => t.id === selectedMatch.truckId)!}
              driver={MOCK_DRIVERS.find(d => d.id === selectedMatch.driverId)!}
              request={currentRequest}
              onBack={() => setView('SEARCH')}
              onConfirm={handleConfirmAssignment}
            />
          </div>

        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Form & Results (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Introduction / Welcome Message */}
              {!matches.length && !isLoading && (
                 <div className="mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">Gestión de Cargas</h2>
                    <p className="text-slate-500">Utilice el asistente IA para optimizar la asignación de la flota Peralta.</p>
                 </div>
              )}

              <TripForm onSubmit={handleAnalyzeTrip} isLoading={isLoading} />
              
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                  {error}
                </div>
              )}

              <MatchResult 
                matches={matches} 
                analysis={tripAnalysis}
                trucks={MOCK_TRUCKS} 
                drivers={MOCK_DRIVERS} 
                request={currentRequest}
                onAssign={handleAssignClick}
              />

              {!matches.length && !isLoading && !error && (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
                  <div className="bg-slate-50 p-4 rounded-full mb-4">
                    <Activity className="text-slate-300" size={48} />
                  </div>
                  <p className="text-slate-500 font-medium">Sistema listo para consultar</p>
                  <p className="text-slate-400 text-sm max-w-xs text-center mt-2">
                    Ingrese origen, destino y carga para recibir sugerencias de la flota.
                  </p>
                </div>
              )}
            </div>

            {/* Right Column: Fleet Status (4 cols) */}
            <div className="lg:col-span-4 h-full min-h-[500px]">
              <FleetOverview trucks={MOCK_TRUCKS} drivers={MOCK_DRIVERS} />
            </div>
          </div>
        )}

      </main>
    </div>
  );
}