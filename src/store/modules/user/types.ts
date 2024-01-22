export type RoleType = [];
export interface UserState {
  name?: string;
  userName?: string;
  avatar?: string;
  job?: string;
  organization?: string;
  location?: string;
  email?: string;
  mobile?: string;
  introduction?: string;
  personalWebsite?: string;
  jobName?: string;
  administrator?: boolean;
  organizationName?: string;
  locationName?: string;
  phone?: string;
  registrationDate?: string;
  accountId?: string | number;
  certification?: number;
  role?: RoleType;
  roleId?: number;
}
