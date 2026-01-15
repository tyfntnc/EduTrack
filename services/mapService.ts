
import { GoogleGenAI } from "@google/genai";

export const MapService = {
  // Koordinat kontrolü (Virgülle ayrılmış iki sayı mı?)
  isCoordinates(str: string): boolean {
    const coordRegex = /^-?\d+\.?\d*,\s*-?\d+\.?\d*$/;
    return coordRegex.test(str.trim());
  },

  async getGroundedMapUrl(searchTarget: string): Promise<string> {
    // Eğer girdi doğrudan koordinat ise, doğrudan navigasyon linki dön
    if (this.isCoordinates(searchTarget)) {
      return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(searchTarget.trim())}`;
    }

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Kullanıcının mevcut konumunu al (daha iyi arama sonuçları için)
      let coords: { latitude: number; longitude: number } | undefined;
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
        });
        coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
      } catch (e) {
        console.warn("EduTrack: Konum alınamadı, genel arama yapılacak.");
      }

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Find the exact Google Maps URL for this location: "${searchTarget}". Only return the URL if possible or a description of where it is on the map.`,
        config: {
          tools: [{ googleMaps: {} }],
          toolConfig: {
            retrievalConfig: {
              latLng: coords
            }
          }
        },
      });

      // Grounding chunks içinden harita URL'ini çek
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      const mapChunk = chunks?.find(chunk => chunk.maps?.uri);
      
      if (mapChunk?.maps?.uri) {
        return mapChunk.maps.uri;
      }

      // Eğer model spesifik bir link dönmediyse standart arama linkini fallback olarak kullan
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(searchTarget)}`;
    } catch (error) {
      console.error("EduTrack: Harita linki oluşturma hatası:", error);
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(searchTarget)}`;
    }
  }
};
