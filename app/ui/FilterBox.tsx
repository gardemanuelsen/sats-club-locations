import { useClubs } from "../context/ClubContext";
import { IoFilter } from "react-icons/io5";


interface Props {
  isExpanded: boolean;
  onToggleExpand: () => void;
  mobileView: boolean;
  showMap: boolean;
  setShowMap: (value: boolean) => void;
}

export function FilterBox({
  isExpanded,
  onToggleExpand,
  mobileView,
  showMap,
  setShowMap,
}: Props) {
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
    <div
      className={`${
        mobileView
          ? "fixed left-1/2 -translate-x-1/2 bottom-2"
          : "absolute bottom-4 right-8"
      } z-20`}
    >
      <div className="bg-white border-2 border-blue-950 shadow-md  inline-block">
        {isExpanded ? (
          <div className="w-80">
            <button
              onClick={onToggleExpand}
              className="absolute top-2 right-2 p-2 text-blue-950 hover:text-blue-700"
            >
              <IoFilter size={20} />
            </button>

            <div className="p-4">
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
                    ${
                      selectedCountry === "all"
                        ? "bg-gray-200 cursor-not-allowed border-gray-300"
                        : ""
                    }`}
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
          </div>
        ) : (
          <div className="flex p-1.5 ">
            {mobileView && (
              <button
                onClick={() => setShowMap(!showMap)}
                className="bg-blue-950 hover:bg-blue-900 text-white px-4 py-1.5 shadow-lg text-sm"
              >
                {showMap ? "List" : "Map"}
              </button>
            )}
            <button
              onClick={onToggleExpand}
              className="bg-blue-950 hover:bg-blue-900 text-white px-4 py-1.5 shadow-lg flex items-center gap-1.5  text-sm"
            >
              <IoFilter size={16} />
              Filter
            </button>
          </div>
        )}
      </div>
    </div>
  );
}