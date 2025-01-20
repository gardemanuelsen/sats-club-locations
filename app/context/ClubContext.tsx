import { createContext, useContext, useState, useMemo, useEffect, ReactNode } from 'react';
import { Club } from '../types/clubs';

interface ClubsContextTypes {
  clubs: Club[];
  filteredClubs: Club[];
  selectedClub: Club | null;
  searchTerm: string;
  selectedCountry: string;
  selectedSalesCluster: string;
  countries: string[];
  salesClusters: string[];
  setSelectedClub: (club: Club | null) => void;
  setSearchTerm: (term: string) => void;
  setSelectedCountry: (country: string) => void;
  setSelectedSalesCluster: (cluster: string) => void;
}

const ClubsContext = createContext<ClubsContextTypes | null>(null);

export function ClubsProvider({ clubs, children }: { clubs: Club[], children: ReactNode }) {
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string>("all");
  const [selectedSalesCluster, setSelectedSalesCluster] = useState<string>("all");


  const countries = useMemo(() => {
    const uniqueCountries = Array.from(
      new Set(clubs.map((club) => club.address?.country || 'Unknown'))
    );
    return ["all", ...uniqueCountries];
  }, [clubs]);

  const salesClusters = useMemo(() => {
    const uniqueSalesClusters = Array.from(
      new Set(
        clubs
          .filter((club) => club.address?.country === selectedCountry)
          .map((club) => club.salesCluster?.name || "Unknown")
      )
    );
    return ["all", ...uniqueSalesClusters];
  }, [clubs, selectedCountry]);

  useEffect(() => {
    setSelectedSalesCluster("all");
  }, [selectedCountry]);

  const filteredClubs = useMemo(() => {
    return clubs.filter((club) => {
      const matchesSearch = club.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCountry =
        selectedCountry === "all" ||
        club.address?.country === selectedCountry;
      const matchesSalesCluster =
        selectedSalesCluster === "all" ||
        club.salesCluster?.name === selectedSalesCluster;

      return matchesSearch && matchesCountry && matchesSalesCluster;
    });
  }, [clubs, searchTerm, selectedCountry, selectedSalesCluster]);

  const value = {
    clubs,
    filteredClubs,
    selectedClub,
    searchTerm,
    selectedCountry,
    selectedSalesCluster,
    countries,
    salesClusters,
    setSelectedClub,
    setSearchTerm,
    setSelectedCountry,
    setSelectedSalesCluster,
  };

  return <ClubsContext.Provider value={value}>{children}</ClubsContext.Provider>;
}

export function useClubs() {
  const context = useContext(ClubsContext);
  if (!context) {
    throw new Error('useClubs must be used within a ClubsProvider');
  }
  return context;
}
