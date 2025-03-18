import { useState, useEffect, useRef } from "react";

// Sample list of countries
const countries = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina", "Australia",
  "Austria", "Belgium", "Brazil", "Canada", "China", "Denmark", "Egypt", "France", "Germany",
  "India", "Italy", "Japan", "Kenya", "Mexico", "Nepal", "Nigeria", "Norway", "Poland", "Russia",
  "South Africa", "Spain", "United Kingdom", "United States"
];

export default function App() {
  const [syncSearchQuery, setSyncSearchQuery] = useState<string>("");
  const [asyncSearchQuery, setAsyncSearchQuery] = useState<string>("");
  const [selectedSyncCountries, setSelectedSyncCountries] = useState<string[]>([]);
  const [selectedAsyncCountries, setSelectedAsyncCountries] = useState<string[]>([]);
  const [filteredSyncCountries, setFilteredSyncCountries] = useState<string[]>(countries);
  const [filteredAsyncCountries, setFilteredAsyncCountries] = useState<string[]>([]);
  const [isDropdownVisibleSync, setIsDropdownVisibleSync] = useState<boolean>(false);
  const [isDropdownVisibleAsync, setIsDropdownVisibleAsync] = useState<boolean>(false);

  // Track the index of the selected option
  const [syncSelectedOptionIndex, setSyncSelectedOptionIndex] = useState<number | null>(null);
  const [asyncSelectedOptionIndex, setAsyncSelectedOptionIndex] = useState<number | null>(null);

  // Refs for search bar and dropdown
  const searchRefSync = useRef<HTMLInputElement | null>(null);
  const dropdownRefSync = useRef<HTMLDivElement | null>(null);
  const searchRefAsync = useRef<HTMLInputElement | null>(null);
  const dropdownRefAsync = useRef<HTMLDivElement | null>(null);

  const handleSyncSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSyncSearchQuery(event.target.value);
    setIsDropdownVisibleSync(true);  // Show dropdown when user types
  };

  const handleAsyncSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAsyncSearchQuery(event.target.value);
    setIsDropdownVisibleAsync(true);  // Show dropdown when user types
  };

  // Handle Async Search filtering
  useEffect(() => {
    if (asyncSearchQuery === "") {
      setFilteredAsyncCountries([]);  // Empty list when query is empty
    } else {
      setFilteredAsyncCountries(
        countries.filter(country =>
          country.toLowerCase().includes(asyncSearchQuery.toLowerCase())
        )
      );
    }
  }, [asyncSearchQuery]);

  // Handle Sync Search filtering
  useEffect(() => {
    if (syncSearchQuery === "") {
      setFilteredSyncCountries(countries); // Show default list when search query is empty
    } else {
      setFilteredSyncCountries(
        countries.filter(country =>
          country.toLowerCase().includes(syncSearchQuery.toLowerCase())
        )
      );
    }
  }, [syncSearchQuery]);

  const toggleSyncCountrySelection = (country: string) => {
    if (selectedSyncCountries.includes(country)) {
      setSelectedSyncCountries(selectedSyncCountries.filter(c => c !== country));
    } else {
      setSelectedSyncCountries([...selectedSyncCountries, country]);
    }
  };

  const toggleAsyncCountrySelection = (country: string) => {
    if (selectedAsyncCountries.includes(country)) {
      setSelectedAsyncCountries(selectedAsyncCountries.filter(c => c !== country));
    } else {
      setSelectedAsyncCountries([...selectedAsyncCountries, country]);
    }
  };

  // Close the dropdown if clicked outside
  const closeDropdownIfClickedOutside = (e: MouseEvent) => {
    if (
      searchRefSync.current && !searchRefSync.current.contains(e.target as Node) &&
      dropdownRefSync.current && !dropdownRefSync.current.contains(e.target as Node)
    ) {
      setIsDropdownVisibleSync(false);
    }
    if (
      searchRefAsync.current && !searchRefAsync.current.contains(e.target as Node) &&
      dropdownRefAsync.current && !dropdownRefAsync.current.contains(e.target as Node)
    ) {
      setIsDropdownVisibleAsync(false);
    }
  };

  // Add event listener to handle click outside to close dropdown
  useEffect(() => {
    document.addEventListener("click", closeDropdownIfClickedOutside);

    return () => {
      document.removeEventListener("click", closeDropdownIfClickedOutside);
    };
  }, []);

  // Handle keyboard navigation for Sync Search
  const handleSyncKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      if (syncSelectedOptionIndex === null || syncSelectedOptionIndex === filteredSyncCountries.length - 1) {
        setSyncSelectedOptionIndex(0); // Loop back to the first option
      } else {
        setSyncSelectedOptionIndex(syncSelectedOptionIndex + 1); // Move down
      }
    } else if (e.key === "ArrowUp") {
      if (syncSelectedOptionIndex === null || syncSelectedOptionIndex === 0) {
        setSyncSelectedOptionIndex(filteredSyncCountries.length - 1); // Loop back to the last option
      } else {
        setSyncSelectedOptionIndex(syncSelectedOptionIndex - 1); // Move up
      }
    } else if (e.key === "Enter" && syncSelectedOptionIndex !== null) {
      const country = filteredSyncCountries[syncSelectedOptionIndex];
      toggleSyncCountrySelection(country); // Toggle selection using enter
    } else if (e.key === "Escape") {
      setIsDropdownVisibleSync(false); //Close the dropdown using esc
    }
  };

  // Handle keyboard navigation for Async Search
  const handleAsyncKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      if (asyncSelectedOptionIndex === null || asyncSelectedOptionIndex === filteredAsyncCountries.length - 1) {
        setAsyncSelectedOptionIndex(0); // Loop back to the first option
      } else {
        setAsyncSelectedOptionIndex(asyncSelectedOptionIndex + 1); // Move down
      }
    } else if (e.key === "ArrowUp") {
      if (asyncSelectedOptionIndex === null || asyncSelectedOptionIndex === 0) {
        setAsyncSelectedOptionIndex(filteredAsyncCountries.length - 1); // Loop back to the last option
      } else {
        setAsyncSelectedOptionIndex(asyncSelectedOptionIndex - 1); // Move up
      }
    } else if (e.key === "Enter" && asyncSelectedOptionIndex !== null) {
      const country = filteredAsyncCountries[asyncSelectedOptionIndex];
      toggleAsyncCountrySelection(country); // Toggle selection using enter
    } else if (e.key === "Escape") {
      setIsDropdownVisibleAsync(false); // Close the dropdown using esc
    }
  };

  const handleSyncSearchFocus = () => {
    setFilteredSyncCountries(countries); // Show default list
    setIsDropdownVisibleSync(true); 
  };

  const handleAsyncSearchFocus = () => {
    if (asyncSearchQuery === "") {
      setFilteredAsyncCountries([]); 
    }
    setIsDropdownVisibleAsync(true); 
  };

  // Scroll the selected option into view
  useEffect(() => {
    if (dropdownRefSync.current && syncSelectedOptionIndex !== null) {
      const focusedItem = dropdownRefSync.current.querySelector(`li:nth-child(${syncSelectedOptionIndex + 1})`);
      if (focusedItem) {
        focusedItem.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      }
    }
  }, [syncSelectedOptionIndex]);

  useEffect(() => {
    if (dropdownRefAsync.current && asyncSelectedOptionIndex !== null) {
      const focusedItem = dropdownRefAsync.current.querySelector(`li:nth-child(${asyncSelectedOptionIndex + 1})`);
      if (focusedItem) {
        focusedItem.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      }
    }
  }, [asyncSelectedOptionIndex]);

  return (
    <div className="App bg-grey">
      <div className="content-container">
        {/* Async Search */}
        <div className="search-container">
          <label htmlFor="async-search">Async Search</label>
          <div className="input-wrapper">
            <i className="fas fa-search search-icon"></i>
            <input
              ref={searchRefAsync}
              id="async-search"
              type="text"
              value={asyncSearchQuery}
              onChange={handleAsyncSearchChange}
              onFocus={handleAsyncSearchFocus}
              onKeyDown={handleAsyncKeyDown} // Handle keyboard 
              placeholder="Search for a country..."
            />
          </div>

          {/* Scrollable Dropdown for Async Search */}
          {asyncSearchQuery && isDropdownVisibleAsync && (
            <div ref={dropdownRefAsync} className="dropdown">
              <ul>
                {filteredAsyncCountries.length === 0 ? (
                  <li>No results found</li>
                ) : (
                  filteredAsyncCountries.map((country, index) => (
                    <li key={index} className={asyncSelectedOptionIndex === index ? "highlighted" : ""}>
                      <label htmlFor={country}>{country}</label>
                      <input
                        type="checkbox"
                        id={country}
                        checked={selectedAsyncCountries.includes(country)}
                        onChange={() => toggleAsyncCountrySelection(country)}
                      />
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Selected Countries for Async Search */}
        {selectedAsyncCountries.length > 0 && (
          <div className="selected-countries">
            {selectedAsyncCountries.map((country, index) => (
              <span key={index} className="selected-country">
                {country}
                <span
                  className="remove-country"
                  onClick={() => {
                    setSelectedAsyncCountries(selectedAsyncCountries.filter(c => c !== country));
                  }}
                >
                  &times;
                </span>
              </span>
            ))}
          </div>
        )}

        <div className="gap"></div>

        {/* Sync Search */}
        <div className="search-container">
          <label htmlFor="sync-search">Sync Search</label>
          <div className="input-wrapper">
            <i className="fas fa-search search-icon"></i>
            <input
              ref={searchRefSync}
              id="sync-search"
              type="text"
              value={syncSearchQuery}
              onChange={handleSyncSearchChange}
              onFocus={handleSyncSearchFocus}
              onKeyDown={handleSyncKeyDown} // Handle keyboard 
              placeholder="Search for a country..."
            />
          </div>

          {/* Scrollable Dropdown for Sync Search */}
          {isDropdownVisibleSync && (
            <div ref={dropdownRefSync} className="dropdown">
              <ul>
                {filteredSyncCountries.length === 0 ? (
                  <li>No results found</li>
                ) : (
                  filteredSyncCountries.map((country, index) => (
                    <li key={index} className={syncSelectedOptionIndex === index ? "highlighted" : ""}>
                      <label htmlFor={country}>{country}</label>
                      <input
                        type="checkbox"
                        id={country}
                        checked={selectedSyncCountries.includes(country)}
                        onChange={() => toggleSyncCountrySelection(country)}
                      />
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Selected Countries for Sync Search */}
        {selectedSyncCountries.length > 0 && (
          <div className="selected-countries">
            {selectedSyncCountries.map((country, index) => (
              <span key={index} className="selected-country">
                {country}
                <span
                  className="remove-country"
                  onClick={() => {
                    setSelectedSyncCountries(selectedSyncCountries.filter(c => c !== country));
                  }}
                >
                  &times;
                </span>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}