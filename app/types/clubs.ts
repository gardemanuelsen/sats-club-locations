//Types based on JSON
export interface OpeningHours {
  regularOpeningHours: []
}

export interface RegularOpeningHours {
hoursFor: string;
days: Days[]
}


export interface Days {
  day: string;
  timeSpans: TimeSpan[];
}

export interface TimeSpan {
  opens: TimeFormat;
  closes: TimeFormat;
}

export interface TimeFormat {
  hour: number;
  minute: number;
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


//Own types

export interface ClosestClub {
  club: Club;
  distance: number;
}

export interface Location {
  latitude: number;
  longitude: number;
}