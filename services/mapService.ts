
export const MapService = {
  // Koordinat kontrolü (Virgülle ayrılmış iki sayı mı?)
  isCoordinates(str: string): boolean {
    const coordRegex = /^-?\d+\.?\d*,\s*-?\d+\.?\d*$/;
    return coordRegex.test(str.trim());
  },

  getMapsSearchUrl(location: string, address?: string): string {
    const isCoord = address ? this.isCoordinates(address) : false;
    const query = isCoord ? address! : `${location}${address ? ', ' + address : ''}`;
    
    if (isCoord) {
      return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query.trim())}`;
    }
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  }
};
