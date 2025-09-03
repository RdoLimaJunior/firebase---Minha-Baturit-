export const haversineDistance = (
    coords1: { lat: number; lng: number },
    coords2: { lat: number; lng: number }
  ) => {
    const toRad = (x: number) => (x * Math.PI) / 180;
    const R = 6371; // Earth radius in km

    const dLat = toRad(coords2.lat - coords1.lat);
    const dLon = toRad(coords2.lng - coords1.lng);
    const lat1 = toRad(coords1.lat);
    const lat2 = toRad(coords2.lat);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // in kilometers
};

export const timeSince = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return `${Math.floor(interval)} anos atrás`;
    interval = seconds / 2592000;
    if (interval > 1) return `${Math.floor(interval)} meses atrás`;
    interval = seconds / 86400;
    if (interval > 1) return `${Math.floor(interval)} dias atrás`;
    interval = seconds / 3600;
    if (interval > 1) return `${Math.floor(interval)} horas atrás`;
    interval = seconds / 60;
    if (interval > 1) return `${Math.floor(interval)} minutos atrás`;
    return `${Math.floor(seconds)} segundos atrás`;
};

export const mapWeatherCodeToIcon = (code: string): { icon: string; color: string } => {
    const codeNum = parseInt(code, 10);
    switch (codeNum) {
        case 113: return { icon: 'wb_sunny', color: 'text-amber-500' };
        case 116: return { icon: 'partly_cloudy_day', color: 'text-sky-600' };
        case 119: return { icon: 'cloud', color: 'text-gray-500' };
        case 122: return { icon: 'cloudy', color: 'text-gray-600' };
        case 143: return { icon: 'foggy', color: 'text-gray-400' };
        case 176: return { icon: 'rainy', color: 'text-blue-500' };
        case 179: case 182: case 185: return { icon: 'ac_unit', color: 'text-cyan-400' };
        case 200: return { icon: 'thunderstorm', color: 'text-yellow-500' };
        case 227: case 230: return { icon: 'weather_snowy', color: 'text-cyan-300' };
        case 248: case 260: return { icon: 'foggy', color: 'text-gray-400' };
        case 263: case 266: case 281: case 284: return { icon: 'grain', color: 'text-gray-500' };
        case 293: case 296: case 299: case 302: case 305: case 308: return { icon: 'rainy', color: 'text-blue-500' };
        case 311: case 314: case 317: case 320: return { icon: 'ac_unit', color: 'text-cyan-400' };
        case 323: case 326: case 329: case 332: case 335: case 338: return { icon: 'weather_snowy', color: 'text-cyan-300' };
        case 350: return { icon: 'grain', color: 'text-gray-500' };
        case 353: case 356: case 359: return { icon: 'shower', color: 'text-blue-600' };
        case 362: case 365: return { icon: 'ac_unit', color: 'text-cyan-400' };
        case 368: case 371: return { icon: 'weather_snowy', color: 'text-cyan-300' };
        case 374: case 377: return { icon: 'grain', color: 'text-gray-500' };
        case 386: case 389: case 392: case 395: return { icon: 'thunderstorm', color: 'text-yellow-500' };
        default: return { icon: 'thermostat', color: 'text-gray-600' };
    }
};