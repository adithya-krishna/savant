export type SectionTypes = 'team-member' | 'lead' | 'stage';

export interface TeamMemberOption {
  id: string;
  first_name: string;
  last_name: string;
}

export type InstrumentType = {
  id: string;
  name: string;
  description?: string;
};
