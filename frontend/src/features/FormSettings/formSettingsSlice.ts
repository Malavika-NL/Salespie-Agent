import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../app/axiosInstance';

export interface VerticalOption {
  category: string;
  subdivisions?: VerticalOption[];
}

export interface DesignationOption {
  title: string;
  abbreviation: string;
}

export interface AccountFormSettings {
  verticals: VerticalOption[];
  leadHierarchy: VerticalOption[];
  salesTypes: string[];
  opportunities: string[];
  productCategories: VerticalOption[];
  regions: string[];
  departments: string[];
  businessTypes: string[];
  designations: DesignationOption[];
  activityOptions: string[];
  nextActions: string[];
  states: string[];
  cities: string[];
  stateCities: Record<string, string[]>;
  eventTypes: string[];
  requiredFields: string[];
}

export interface FormSettingsState {
  account: AccountFormSettings;
  loading: boolean;
  loadedFromApi: boolean;
}

const STORAGE_KEY = 'salespie_form_settings_v1';

export const defaultAccountFormSettings: AccountFormSettings = {
  verticals: [
    {
      category: 'Automobile',
      subdivisions: [
        { category: 'Automotive' },
        { category: 'Auto Component' },
        { category: 'Tier 1' },
        { category: 'Tier 2' },
      ],
    },
    { category: 'Health Care' },
    { category: 'Logistics' },
    { category: 'E-Commerce' },
    {
      category: 'E&E',
      subdivisions: [{ category: 'Electronics' }, { category: 'Electrical Components' }, { category: 'Tier 1' }],
    },
    { category: 'FMCG' },
    { category: 'Chemical Mfg' },
    { category: 'Other Mfg' },
    {
      category: 'F&B',
      subdivisions: [
        { category: 'F&B Mfg' },
        { category: 'Food Mfg' },
        { category: 'Beverages Mfg' },
        { category: 'Cloud Kitchen' },
      ],
    },
    {
      category: 'Pharmaceutical',
      subdivisions: [{ category: 'Pharma/Health Care' }, { category: 'Hospitals' }, { category: 'Tier 1/Supplier' }],
    },
    {
      category: 'Retails',
      subdivisions: [{ category: 'E-Commerce' }, { category: 'Retails' }],
    },
    { category: 'Transport & Logistics' },
    { category: 'Apparel' },
    { category: 'Government' },
    { category: 'Others' },
  ],
  leadHierarchy: [
    {
      category: 'Printer',
      subdivisions: [{ category: 'Zebra' }, { category: 'Sato' }, { category: 'Argox' }, { category: 'Godex' }, { category: 'Bixolon' }, { category: 'TSC' }, { category: 'Printronix' }, { category: 'Others' }],
    },
    { category: 'Scanners', subdivisions: [{ category: 'Zebra' }, { category: 'Honey Well' }, { category: 'Argox' }] },
    { category: 'HHT', subdivisions: [{ category: 'Zebra' }, { category: 'Seuic' }, { category: 'Cipherlab' }] },
    {
      category: 'Consumables',
      subdivisions: [
        {
          category: 'Label',
          subdivisions: [
            { category: 'Paper', subdivisions: [{ category: 'Normal Chrome' }, { category: 'AD Chrome' }] },
            { category: 'Polyster' },
            { category: 'Tafatta' },
            { category: 'PET' },
            { category: 'PP' },
          ],
        },
        {
          category: 'Ribbon',
          subdivisions: [
            { category: 'Wax', subdivisions: [{ category: 'Economical' }, { category: 'Standard' }, { category: 'Premium' }] },
            { category: 'Wax Resin', subdivisions: [{ category: 'Economical' }, { category: 'Standard' }, { category: 'Premium' }] },
            { category: 'Resin', subdivisions: [{ category: 'Economical' }, { category: 'Standard' }, { category: 'Premium' }] },
          ],
        },
      ],
    },
    {
      category: 'Software',
      subdivisions: [
        { category: 'WMS Solution' },
        { category: 'WIP Solution' },
        { category: 'Asset Management Solution' },
        { category: 'Life Science Solutions' },
        { category: 'Printing Software' },
        { category: 'Scanning Software' },
        { category: 'RFID Truck management solutions' },
        { category: 'Customised software' },
      ],
    },
    {
      category: 'Automation',
      subdivisions: [
        { category: 'Line Automation' },
        { category: 'Visual Inspection System' },
        { category: 'Poka Yoke System' },
        { category: 'Print and Apply System' },
        { category: 'Conveyor Scanning' },
        { category: 'Direct part Marking' },
        { category: 'SPM' },
        { category: 'Vision Guided Robots' },
      ],
    },
  ],
  salesTypes: ['Direct Business', 'Business Partner'],
  opportunities: ['Printer', 'Scanners', 'HHT', 'Consumables', 'Software', 'Automation'],
  productCategories: [
    {
      category: 'Printer',
      subdivisions: [{ category: 'Zebra' }, { category: 'Sato' }, { category: 'Argox' }],
    },
    {
      category: 'Scanners',
      subdivisions: [{ category: 'Zebra' }, { category: 'Honey Well' }, { category: 'Argox' }],
    },
  ],
  regions: ['North', 'South', 'East', 'West', 'INT'],
  departments: [
    'Purchase',
    'Procurement',
    'PPC Head',
    'IT Head',
    'Plant Head',
    'Quality',
    'Logistics',
    'Supply Chain',
    'Operations',
    'Information System',
    'Vendor Development',
    'Commertials',
    'Project Development',
    'Maintenance',
    'Support & Services',
    'Manufacturing Head',
    'Production Head',
    'Warehouse Manager',
    'Business Development',
    'Sales Manager',
    'Marketing',
    'Admin/HR',
  ],
  businessTypes: ['Direct Business', 'Business Partner'],
  designations: [
    { title: 'Assistant Manager', abbreviation: 'AM' },
    { title: 'Senior Manager', abbreviation: 'Sr.M' },
    { title: 'Assistant General Manager', abbreviation: 'AGM' },
    { title: 'General Manager', abbreviation: 'GM' },
    { title: 'Deputy Manager', abbreviation: 'DM' },
    { title: 'Deputy General Manager', abbreviation: 'Dy.GM' },
    { title: 'Vice President', abbreviation: 'VP' },
    { title: 'Director', abbreviation: 'Director' },
    { title: 'Director/Owner', abbreviation: 'Director/Owner' },
    { title: 'Owner', abbreviation: 'Owner' },
    { title: 'Senior Engineer', abbreviation: 'Sr.Engineer' },
    { title: 'Executive', abbreviation: 'EX' },
    { title: 'Senior Executive', abbreviation: 'Sr.EX' },
  ],
  activityOptions: [
    'Campaign',
    'Cold Call',
    'Sales Call',
    'Share Company Profile',
    'Introducing Meeting',
    'Demo',
    'Quotation Submission',
    'Q.Follow-Up',
    'Objection Handling',
    'OH.Follow-Up',
    'Negotiation',
    'N.Follow-Up',
    'Close',
    'C.Follow-Up',
    'Repeat Sales',
    'R.Follow-Up',
    'R.Close',
    'Up/Cross Sales',
    'U.C Follow-Up',
    'U.C Close',
    'RelationShip Maintenance',
  ],
  nextActions: [
    'Campaign',
    'Cold Call',
    'Sales Call',
    'Share Company Profile',
    'Introducing Meeting',
    'Demo',
    'Quotation Submission',
    'Negotiation',
    'Close',
    'Repeat Sales',
    'RelationShip Maintenance',
  ],
  states: [],
  cities: [],
  stateCities: {},
  eventTypes: [
    'Follow-up for meeting',
    'Follow-up after quotation',
    'Follow-up for negotiation',
    'Follow-up after negotiation',
    'Follow-up for new product/project',
  ],
  requiredFields: [
    'account_name',
    'pic',
    'vertical',
    'department',
    'designation',
    'business',
    'region',
    'mobile_number',
    'email_id',
    'location',
    'address',
  ],
};

const hasMeaningfulValue = (value: unknown): boolean => {
  if (Array.isArray(value)) {
    return value.length > 0;
  }

  if (value && typeof value === 'object') {
    return Object.keys(value as Record<string, unknown>).length > 0;
  }

  if (typeof value === 'string') {
    return value.trim().length > 0;
  }

  return value !== null && value !== undefined;
};

const hasMeaningfulSettings = (payload: Partial<AccountFormSettings>): boolean =>
  Object.values(payload).some(hasMeaningfulValue);

const resolveAccountSettings = (payload: Partial<AccountFormSettings>): AccountFormSettings => ({
  ...defaultAccountFormSettings,
  ...payload,
});

const hasLocalOverrides = (account: AccountFormSettings): boolean =>
  JSON.stringify(account) !== JSON.stringify(defaultAccountFormSettings);

const loadInitialState = (): FormSettingsState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { account: defaultAccountFormSettings, loading: false, loadedFromApi: false };
    const parsed = JSON.parse(raw) as FormSettingsState;
    return {
      account: {
        ...defaultAccountFormSettings,
        ...parsed.account,
      },
      loading: false,
      loadedFromApi: false,
    };
  } catch {
    return { account: defaultAccountFormSettings, loading: false, loadedFromApi: false };
  }
};

const persist = (state: FormSettingsState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // no-op
  }
};

const initialState: FormSettingsState = loadInitialState();

const normalizeAccountSettings = (payload: Partial<AccountFormSettings> & Record<string, any>): Partial<AccountFormSettings> => {
  const normalized: Partial<AccountFormSettings> = { ...payload };

  if (!normalized.opportunities && Array.isArray(payload.opportunity)) {
    normalized.opportunities = payload.opportunity;
  }
  if (!normalized.leadHierarchy && Array.isArray(payload.lead_hierarchy)) {
    normalized.leadHierarchy = payload.lead_hierarchy;
  }
  if (!normalized.salesTypes && Array.isArray(payload.sales_types)) {
    normalized.salesTypes = payload.sales_types;
  }
  if (!normalized.productCategories && Array.isArray(payload.product_categories)) {
    normalized.productCategories = payload.product_categories;
  }
  if (!normalized.businessTypes && Array.isArray(payload.business_types)) {
    normalized.businessTypes = payload.business_types;
  }
  if (!normalized.nextActions && Array.isArray(payload.next_actions)) {
    normalized.nextActions = payload.next_actions;
  }
  if (!normalized.requiredFields && Array.isArray(payload.required_fields)) {
    normalized.requiredFields = payload.required_fields;
  }
  if (!normalized.activityOptions && Array.isArray(payload.activity_options)) {
    normalized.activityOptions = payload.activity_options;
  }
  if (!normalized.eventTypes && Array.isArray(payload.event_types)) {
    normalized.eventTypes = payload.event_types;
  }
  if (!normalized.stateCities && payload.state_cities && typeof payload.state_cities === 'object') {
    normalized.stateCities = payload.state_cities;
  }

  return normalized;
};

export const fetchAccountFormSettings = createAsyncThunk(
  'formSettings/fetchAccountFormSettings',
  async (_, { rejectWithValue, getState }) => {
    const endpoints = ['/form-settings/', '/account-form-settings/', '/settings/form-fields/'];
    const localAccount =
      ((getState() as { formSettings?: FormSettingsState }).formSettings?.account) || defaultAccountFormSettings;

    for (const endpoint of endpoints) {
      try {
        const res = await axiosInstance.get(endpoint);
        const payload = res.data?.account ?? res.data;
        if (payload && typeof payload === 'object') {
          const normalized = normalizeAccountSettings(payload as Partial<AccountFormSettings> & Record<string, any>);

          if (hasMeaningfulSettings(normalized)) {
            return normalized;
          }

          if (hasLocalOverrides(localAccount)) {
            try {
              const syncRes = await axiosInstance.put(endpoint, { account: localAccount });
              const syncPayload = syncRes.data?.account ?? syncRes.data;
              if (syncPayload && typeof syncPayload === 'object') {
                return normalizeAccountSettings(syncPayload as Partial<AccountFormSettings> & Record<string, any>);
              }
              return localAccount;
            } catch {
              return {};
            }
          }

          return {};
        }
      } catch {
        // try next endpoint
      }
    }
    return rejectWithValue('No form settings endpoint returned data');
  }
);

export const saveAccountFormSettings = createAsyncThunk(
  'formSettings/saveAccountFormSettings',
  async (account: Partial<AccountFormSettings>, { rejectWithValue }) => {
    const endpoints = ['/form-settings/', '/account-form-settings/', '/settings/form-fields/'];

    for (const endpoint of endpoints) {
      try {
        const res = await axiosInstance.put(endpoint, { account });
        const payload = res.data?.account ?? res.data;
        if (payload && typeof payload === 'object') {
          return payload as Partial<AccountFormSettings>;
        }
        return account;
      } catch (error: any) {
        if (endpoint === endpoints[endpoints.length - 1]) {
          return rejectWithValue(error.response?.data || 'Failed to save form settings');
        }
      }
    }

    return rejectWithValue('Failed to save form settings');
  }
);

const formSettingsSlice = createSlice({
  name: 'formSettings',
  initialState,
  reducers: {
    updateAccountFormSettings(state, action: PayloadAction<Partial<AccountFormSettings>>) {
      state.account = { ...state.account, ...action.payload };
      persist(state);
    },
    resetAccountFormSettings(state) {
      state.account = defaultAccountFormSettings;
      persist(state);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccountFormSettings.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAccountFormSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.loadedFromApi = true;
        const normalized = normalizeAccountSettings(action.payload as Partial<AccountFormSettings> & Record<string, any>);
        state.account = resolveAccountSettings(normalized);
        persist(state);
      })
      .addCase(fetchAccountFormSettings.rejected, (state) => {
        state.loading = false;
      })
      .addCase(saveAccountFormSettings.fulfilled, (state, action) => {
        const normalized = normalizeAccountSettings(action.payload as Partial<AccountFormSettings> & Record<string, any>);
        state.account = resolveAccountSettings(normalized);
        persist(state);
      });
  },
});

export const { updateAccountFormSettings, resetAccountFormSettings } = formSettingsSlice.actions;
export default formSettingsSlice.reducer;
