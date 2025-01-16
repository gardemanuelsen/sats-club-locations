"use client";
import { useState, useMemo, useEffect } from "react";
import { Club } from "../types/clubs";
import MapView from "./MapView";
import ListView from "./ListView";

interface ClientWrapperProps {
  clubs: Club[];
}

export default function ClientWrapper({ clubs }: ClientWrapperProps) {
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string>("all");
  const [selectedSalesCluster, setSelectedSalesCluster] = useState<string>("all");
  const [isFilterExpanded, setIsFilterExpanded] = useState(true);

  // Get unique countries from clubs
  const countries = useMemo(() => {
    const uniqueCountries = Array.from(
      new Set(clubs.map((club) => club.address?.country || 'Unknown'))
    );
    return ["all", ...uniqueCountries];
  }, [clubs]);

  // Get unique sales clusters
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
    // Reset sales cluster when country changes to avoid list being empty
    setSelectedSalesCluster("all");
  }, [selectedCountry]);


  // Reset sales cluster when country changes
  useMemo(() => {
    if (selectedCountry === "all") {
      setSelectedSalesCluster("all");
    }
  }, [selectedCountry]);

  // Filter clubs based on all criteria
  const filteredClubs = useMemo(() => {
    return clubs.filter((club) => {
      // Filter by search term
      const matchesSearch = club.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      // Filter by country
      const matchesCountry =
        selectedCountry === "all" ||
        club.address?.country === selectedCountry;

      // Filter by sales cluster
      const matchesSalesCluster =
        selectedSalesCluster === "all" ||
        club.salesCluster?.name === selectedSalesCluster;

      return matchesSearch && matchesCountry && matchesSalesCluster;
    });
  }, [clubs, searchTerm, selectedCountry, selectedSalesCluster]);

  return (
    <div className="relative h-dvh">
      {/* Title */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20">
        <h1 className="text-4xl font-bold bg-white p-4 rounded-lg shadow-md">
          Sats Club Locations
        </h1>
      </div>

      {/* Main content */}
      <div className="flex w-full h-full">
        <div className="w-1/4 h-full">
          <div className="h-full bg-white border-r">
            <ListView
              clubs={filteredClubs}
              selectedClub={selectedClub}
              onClubSelect={setSelectedClub}
            />
          </div>
        </div>

        <div className="w-3/4 h-full">
          <MapView
            clubs={filteredClubs}
            selectedClub={selectedClub}
            selectedCountry={selectedCountry}
            
            onClubSelect={setSelectedClub}
          />
        </div>
      </div>

      {/* Filter box */}
      <div className="absolute bottom-8 right-8 z-20">
        <div className="bg-white rounded-lg shadow-md relative">
          {/* Toggle button */}
          <button 
            onClick={() => setIsFilterExpanded(!isFilterExpanded)}
            className="absolute top-0 right-0 m-2 text-gray-600 hover:text-gray-900"
            aria-label={isFilterExpanded ? "Collapse filters" : "Expand filters"}
          >
            {isFilterExpanded ? '▼' : '▲'}
          </button>

          {isFilterExpanded && (
            <div className="p-4 w-80">
              <h2 className="font-semibold mb-4">Filter Clubs</h2>
              
              {/* Search input */}
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search clubs..."
                className="w-full px-3 py-2 border rounded-md mb-4"
              />

              {/* Country select */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Country</label>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country === "all" ? "All Countries" : country}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sales Cluster select */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Area</label>
                <select
                  value={selectedSalesCluster}
                  onChange={(e) => setSelectedSalesCluster(e.target.value)}
                  disabled={selectedCountry === "all"}
                  className={`w-full px-3 py-2 border rounded-md 
                    ${selectedCountry === "all" ? "bg-gray-200 cursor-not-allowed" : ""}`}
                >
                  {salesClusters.map((cluster) => (
                    <option key={cluster} value={cluster}>
                      {cluster === "all" ? "All Areas" : cluster}
                    </option>
                  ))}
                </select>
              </div>

              {/* Results count */}
              <div className="mt-4 text-sm text-gray-600">
                Showing {filteredClubs.length} of {clubs.length} clubs
              </div>
            </div>
          )}

          {/* Collapsed state */}
          {!isFilterExpanded && (
            <div className="w-6 h-12 m-4 flex items-center justify-center">
                 <h2 className="font-semibold mb-4"></h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}