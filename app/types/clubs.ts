// types/clubs.ts
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
    opens: string;  // e.g. "06:00"
    closes: string; // e.g. "22:00"
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
  
  export interface Club {
    id: string;
    name: string;
    clubType: string;
    address: Address;
    geoLocation?: GeoLocation;
    openingHours: OpeningHours;
    phoneNumber?: string;
    email?: string;
    clubFeatures?: string[];
    salesCluster?: SalesCluster;
    // Add any other properties your clubs have
  }
  
  export interface ClubsResponse {
    clubs: Club[];
  }