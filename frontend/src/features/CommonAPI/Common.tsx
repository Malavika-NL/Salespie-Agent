
import { State, City } from 'country-state-city';
import type { IState, ICity } from 'country-state-city';

const defaultCountryCode = 'IN'; // India ISO Code
// Exporting for use in other components
export const getAllStates = () => State.getStatesOfCountry(defaultCountryCode); // Function to fetch states

export const getAllCities = (stateName: string) => {
  const state = State.getStatesOfCountry(defaultCountryCode).find(s => s.name === stateName);
  if (state) {
    console.log('state', stateName);
    return City.getCitiesOfState(defaultCountryCode, state.isoCode); // Function to fetch cities of a state
  }
  return [];
};


