import { useClubs } from "../context/ClubContext";

interface FilterBoxProps {
    isExpanded: boolean;
    onToggleExpand: () => void;
  }
  

export function FilterBox({ isExpanded, onToggleExpand }: FilterBoxProps) {
    const {
      clubs,
      filteredClubs,
      searchTerm,
      selectedCountry,
      selectedSalesCluster,
      countries,
      salesClusters,
      setSearchTerm,
      setSelectedCountry,
      setSelectedSalesCluster,
    } = useClubs();
  
    return (
      <div className="absolute bottom-4 right-8 z-20">
        <div className="bg-white border-2 border-blue-950 rounded-lg shadow-md relative">
          <button 
            onClick={onToggleExpand}
            className="absolute top-0 right-0 m-2 text-gray-600 hover:text-gray-900"
            aria-label={isExpanded ? "Collapse filters" : "Expand filters"}
          >
            {isExpanded ? '▼' : '▲'}
          </button>
  
          {isExpanded && (
            <div className="p-4 w-80">
              <h2 className="font-semibold mb-4">Filter Clubs</h2>
              
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search clubs..."
                className="w-full px-3 py-2 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-950 focus:border-blue-950"
              />
  
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Country</label>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-950 focus:border-blue-950"
                >
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country === "all" ? "All Countries" : country}
                    </option>
                  ))}
                </select>
              </div>
  
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Area</label>
                <select
                  value={selectedSalesCluster}
                  onChange={(e) => setSelectedSalesCluster(e.target.value)}
                  disabled={selectedCountry === "all"}
                  className={`w-full px-3 py-2 border-2 border-blue-950 rounded-md focus:outline-none focus:ring-0 focus:border-blue-950
                      ${selectedCountry === "all" ? "bg-gray-200 cursor-not-allowed border-gray-300" : ""}`}
                >
                  {salesClusters.map((cluster) => (
                    <option key={cluster} value={cluster}>
                      {cluster === "all" ? "All Areas" : cluster}
                    </option>
                  ))}
                </select>
              </div>
  
              <div className="mt-4 text-sm text-gray-600">
                Showing {filteredClubs.length} of {clubs.length} clubs
              </div>
            </div>
          )}
  
          {!isExpanded && (
            <div className="w-6 h-12 m-4 flex items-center justify-center">
              <h2 className="font-semibold mb-4"></h2>
            </div>
          )}
        </div>
      </div>
    );
  }