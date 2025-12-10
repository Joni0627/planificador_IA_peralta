import { GoogleGenAI, Type } from "@google/genai";
import { Driver, AIServiceResponse, TripRequest, Truck } from "../types";

// Fix for TS2580: Cannot find name 'process'
declare const process: any;

// NOTE: In production, do not hardcode keys. 
// The system assumes process.env.API_KEY is available.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const findMatches = async (
  request: TripRequest,
  trucks: Truck[],
  drivers: Driver[]
): Promise<AIServiceResponse> => {
  
  const model = "gemini-2.5-flash";

  const prompt = `
    Actúa como un despachante de logística experto con inteligencia artificial.
    Tu tarea tiene dos partes:
    1. ANALIZAR EL VIAJE Y RIESGOS: 
       - Calcular distancia y tiempo entre ${request.origin} y ${request.destination}.
       - SUGERIR LA MEJOR RUTA (Nombres de Rutas Nacionales/Provinciales).
       - ANALIZAR RIESGOS DE RUTA: Evaluar tráfico, estado general conocido de esas rutas, seguridad o condiciones climáticas típicas de la zona. Determinar nivel de riesgo (Bajo/Medio/Alto).
       - Definir vehículo ideal para ${request.materialType}.
    2. ASIGNAR RECURSOS: Buscar en el inventario provisto los mejores pares de Camión/Chofer.

    DATOS DEL VIAJE:
    - Origen: ${request.origin}
    - Destino: ${request.destination}
    - Material: ${request.materialType}
    - Peso Solicitado: ${request.weightTons} toneladas

    REGLAS DE ASIGNACIÓN:
    - Prioriza camiones 'Disponible' y choferes 'Descansado'.
    - El tipo de camión debe coincidir con el material.
    - Si un camión tiene MENOS capacidad que el peso solicitado, PUEDES recomendarlo (aclarar en reasoning).

    INVENTARIO (JSON):
    ${JSON.stringify({ trucks, drivers })}

    Retorna un JSON con la estructura solicitada.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            analysis: {
              type: Type.OBJECT,
              properties: {
                estimatedDistanceKm: { type: Type.STRING, description: "Ej: '750 km'" },
                estimatedDuration: { type: Type.STRING, description: "Ej: '9 horas'" },
                idealVehicleDescription: { type: Type.STRING, description: "Descripción técnica del vehículo ideal." },
                suggestedRoute: { type: Type.STRING, description: "Nombre de las rutas principales a tomar (Ej: RN 9 -> RN 158)." },
                riskLevel: { type: Type.STRING, enum: ["Bajo", "Medio", "Alto"] },
                riskAnalysis: { type: Type.STRING, description: "Breve explicación del riesgo (tráfico, estado calzada, seguridad)." }
              },
              required: ["estimatedDistanceKm", "estimatedDuration", "idealVehicleDescription", "suggestedRoute", "riskLevel", "riskAnalysis"]
            },
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  truckId: { type: Type.STRING },
                  driverId: { type: Type.STRING },
                  matchScore: { type: Type.NUMBER },
                  tripType: { type: Type.STRING, enum: ["Corta Distancia", "Media Distancia", "Larga Distancia"] },
                  reasoning: { type: Type.STRING }
                },
                required: ["truckId", "driverId", "matchScore", "tripType", "reasoning"]
              }
            }
          },
          required: ["analysis", "recommendations"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as AIServiceResponse;

  } catch (error) {
    console.error("Error fetching matches from Gemini:", error);
    throw error;
  }
};