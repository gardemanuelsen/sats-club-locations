import { Club } from "../types/clubs";

export async function getClubs(): Promise<Club[]> {
  try {
   
    const res = await fetch("https://hfnapi.sats.com/clubs-v2/sats/clubs/", {
      // Caching for 1 hour
      next: {
        revalidate: 3600 
      },
      
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch clubs: ${res.status} ${res.statusText}`);
    }
    
    const data = await res.json() as { clubs: Club[] };
    
    const validClubs = data.clubs.filter((club) =>
      club.geoLocation &&
      club.geoLocation.latitude != null &&
      club.geoLocation.longitude != null &&
      club.clubType !== "WebCenter" &&
      club.clubType !== "OnlineService"
    );
    
    if (!validClubs.length) {
      throw new Error('No valid clubs found');
    }
    
    return validClubs;
  } catch (error) {
  
    console.error('Error fetching clubs:', error);
    throw error; 
  }
}