export interface CrmvValidationResult {
  found: boolean;
  active: boolean;
  name: string | null;
  registrationNumber: string | null;
  state: string | null;
  rawData: Record<string, unknown> | null;
}

export interface CrmvValidationProvider {
  validate(crmvNumber: string, crmvState: string): Promise<CrmvValidationResult>;
}
