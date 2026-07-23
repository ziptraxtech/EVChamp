export type RegionId = 'IN' | 'GCC' | 'SEA';

export interface RegionConfig {
  id: RegionId;
  label: string;
  countryCodes: string[];
  center: [number, number];
  zoom: number;
  hasEvchampNetwork: boolean;
}

export const REGIONS: RegionConfig[] = [
  { id: 'IN', label: 'India', countryCodes: ['IN'], center: [20.5937, 78.9629], zoom: 5, hasEvchampNetwork: true },
  { id: 'GCC', label: 'Gulf (GCC)', countryCodes: ['AE', 'SA', 'QA', 'OM', 'KW', 'BH'], center: [24.5, 51.0], zoom: 5, hasEvchampNetwork: false },
  { id: 'SEA', label: 'Southeast Asia', countryCodes: ['MY', 'TH', 'ID', 'VN', 'PH', 'SG'], center: [5.0, 108.0], zoom: 4, hasEvchampNetwork: false },
];

export const DEFAULT_REGION: RegionId = 'IN';
