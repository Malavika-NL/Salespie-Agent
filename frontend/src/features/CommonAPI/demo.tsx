import React, { useEffect, useState } from 'react';
import { Country, State, City } from 'country-state-city';
import {type ICountry,type IState,type ICity } from 'country-state-city';

const StateCitySelector: React.FC = () => {
  const [countries, setCountries] = useState<ICountry[]>([]);
  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedState, setSelectedState] = useState<string>('');

  useEffect(() => {
    const fetchedCountries = Country.getAllCountries();
    setCountries(fetchedCountries);
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      const fetchedStates = State.getStatesOfCountry(selectedCountry);
      setStates(fetchedStates);
    } else {
      setStates([]);
    }
    setSelectedState('');
    setCities([]);
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedState) {
      const fetchedCities = City.getCitiesOfState(selectedCountry, selectedState);
      setCities(fetchedCities);
    } else {
      setCities([]);
    }
  }, [selectedState, selectedCountry]);

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCountry(e.target.value);
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedState(e.target.value);
  };

  return (
    <div>
      <h1>State and City Selector</h1>
      <div>
        <label>
          Country:
          <select value={selectedCountry} onChange={handleCountryChange}>
            <option value="">Select a country</option>
            {countries.map(country => (
              <option key={country.isoCode} value={country.isoCode}>
                {country.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div>
        <label>
          State:
          <select value={selectedState} onChange={handleStateChange} disabled={!selectedCountry}>
            <option value="">Select a state</option>
            {states.map(state => (
              <option key={state.isoCode} value={state.isoCode}>
                {state.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div>
        <label>
          City:
          <select disabled={!selectedState}>
            <option value="">Select a city</option>
            {cities.map(city => (
              <option key={city.name} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
};

export default StateCitySelector;
