import { Club, ClubsResponse } from "../types/clubs";

export async function getClubs(): Promise<Club[]> {
  try {
   
    const res = await fetch("https://hfnapi.sats.com/clubs-v2/sats/clubs/", {
      // Add caching options
      next: {
        revalidate: 3600 // Revalidate every hour
      },
      // Add proper headers
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch clubs: ${res.status} ${res.statusText}`);
    }
    
    const data: ClubsResponse = await res.json();
    
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
    // Log error for debugging
    console.error('Error fetching clubs:', error);
    throw error; // Re-throw to be handled by error boundary
  }
}