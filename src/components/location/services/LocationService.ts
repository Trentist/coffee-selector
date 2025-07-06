/**
 * خدمة إدارة الموقع
 * Location Management Service
 */

export interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface LocationState {
  currentLocation: Location | null;
  availableLocations: Location[];
  loading: boolean;
  error: string | null;
}

class LocationService {
  private locations: Location[] = [];
  private currentLocation: Location | null = null;

  // تعيين الموقع الحالي
  setCurrentLocation(location: Location): void {
    this.currentLocation = location;
  }

  // الحصول على الموقع الحالي
  getCurrentLocation(): Location | null {
    return this.currentLocation;
  }

  // إضافة موقع جديد
  addLocation(location: Location): void {
    this.locations.push(location);
  }

  // الحصول على جميع المواقع
  getLocations(): Location[] {
    return this.locations;
  }

  // البحث عن موقع بالاسم
  findLocationByName(name: string): Location | undefined {
    return this.locations.find(loc => loc.name === name);
  }

  // مسح جميع المواقع
  clearLocations(): void {
    this.locations = [];
    this.currentLocation = null;
  }
}

export default new LocationService();