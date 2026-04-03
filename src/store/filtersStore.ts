import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Filters {
  searchQuery: string;
  country: string | null;
  minSalary: number | null;
  maxSalary: number | null;
  currency: string | null;
  salaryPeriod: string | null;  // 'year', 'month', 'day', 'hour'
}

interface FiltersStore {
  filters: Filters;
  setSearchQuery: (query: string) => void;
  setCountry: (country: string | null) => void;
  setMinSalary: (salary: number | null) => void;
  setMaxSalary: (salary: number | null) => void;
  setCurrency: (currency: string | null) => void;
  setSalaryPeriod: (period: string | null) => void;
  resetFilters: () => void;
  hasActiveFilters: () => boolean;
}

const defaultFilters: Filters = {
  searchQuery: '',
  country: null,
  minSalary: null,
  maxSalary: null,
  currency: null,
  salaryPeriod: null,
};

export const useFiltersStore = create<FiltersStore>()(
  persist(
    (set, get) => ({
      filters: defaultFilters,
      
      setSearchQuery: (searchQuery) =>
        set((state) => ({ filters: { ...state.filters, searchQuery } })),
      
      setCountry: (country) =>
        set((state) => ({ filters: { ...state.filters, country } })),
      
      setMinSalary: (minSalary) =>
        set((state) => ({ filters: { ...state.filters, minSalary } })),
      
      setMaxSalary: (maxSalary) =>
        set((state) => ({ filters: { ...state.filters, maxSalary } })),
      
      setCurrency: (currency) =>
        set((state) => ({ filters: { ...state.filters, currency } })),
      
      setSalaryPeriod: (salaryPeriod) =>
        set((state) => ({ filters: { ...state.filters, salaryPeriod } })),
      
      resetFilters: () =>
        set({ filters: defaultFilters }),
      
      hasActiveFilters: () => {
        const { filters } = get();
        return !!(
          filters.searchQuery ||
          filters.country ||
          filters.minSalary ||
          filters.maxSalary ||
          filters.currency ||
          filters.salaryPeriod
        );
      },
    }),
    {
      name: 'job-filters-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);