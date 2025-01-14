
export async function getClubs(): Promise<any> {
    const res = await fetch("https://hfnapi.sats.com/clubs-v2/sats/clubs/");
    
    if (!res.ok) {
      throw new Error('Failed to fetch clubs');
    }
    
    return res.json();
  }