export interface AuthResponseDto {
  user: {
    id: string;
    name: string;
    email: string;
    role: string | null;
    specialtyType: string | null;
    crmvStatus: string | null;
    phone: string | null;
    isOnboardingComplete: boolean;
  };
  token: string;
  refreshToken: string;
  isOnboardingComplete: boolean;
}
