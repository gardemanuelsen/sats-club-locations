
export interface OpeningHours {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
}

export interface DayHours {
  isOpen: boolean;
  opens: string;  
  closes: string; 
}

export interface Address {
  country: string;
  address1: string;
  address2?: string;
  postalCode: string;
  city: string;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
  street: string;
  postalCode: string;
  city: string;
  country: string;
}

export interface SalesCluster {
  id: string;
  name: string;
}

export interface ClosestClubs {
  id: string;
  distanceInKilometers: number;
}

export interface ClubFeatureProduct {
  productKey: string;
  productType: string;
  name: string;
  country: string;
}

export interface ClubFeature {
  id: string;
  name: string;
  products: ClubFeatureProduct[];
}

export interface Club {
  id: string;
  name: string;
  clubType: string;
  address: Address;
  geoLocation?: GeoLocation;
  openingHours: OpeningHours;
  phoneNumber?: string;
  email?: string;
  clubFeatures?: ClubFeature[]; 
  salesCluster?: SalesCluster;
  closestClubs: ClosestClubs;
  maxGymFloorCapacity: number;
}
