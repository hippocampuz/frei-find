
export interface Company {
  id: string;
  name: string;
  orgNumber: string;
  industry: string;
  sector?: string;
  location: {
    city: string;
    county: string;
    address?: string;
    postalCode?: string;
  };
  financials: {
    revenue: number;
    profit: number;
    assets: number;
    employees: number;
    year: number;
  };
  contacts?: Contact[];
  foundedYear?: number;
  website?: string;
  description?: string;
}

export interface Contact {
  id: string;
  name: string;
  title: string;
  email?: string;
  phone?: string;
  linkedin?: string;
}

export interface Filter {
  key: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'range' | 'multiSelect';
  options?: string[];
}

export interface SavedList {
  id: string;
  name: string;
  companyIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SearchQuery {
  name?: string;
  industry?: string[];
  county?: string[];
  revenue?: [number | null, number | null];
  employees?: [number | null, number | null];
  foundedYear?: [number | null, number | null];
}

export type TriggerType = 
  | 'newCompany'
  | 'financialChange'
  | 'ownershipChange'
  | 'newRoles'
  | 'leadershipChange'
  | 'addressChange'
  | 'websiteChange'
  | 'newTenders'
  | 'creditScoreChange'
  | 'bankruptcyRisk';

export interface AlertTrigger {
  id: string;
  name: string;
  type: TriggerType;
  listId: string;
  enabled: boolean;
  createdAt: Date;
  lastTriggered?: Date;
  configuration: {
    threshold?: number;
    notifyVia: ('email' | 'hubspot' | 'slack')[];
    frequency: 'immediately' | 'daily' | 'weekly';
    conditions?: Record<string, any>;
  };
}
