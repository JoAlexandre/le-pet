import { SequelizeUserRepository } from '../database/repositories/sequelize-user-repository';
import { SequelizeCompanyRepository } from '../database/repositories/sequelize-company-repository';
import { SequelizeSessionRepository } from '../database/repositories/sequelize-refresh-token-repository';
import { SequelizeCompanyProfessionalRepository } from '../database/repositories/sequelize-company-professional-repository';
import { BcryptHashProvider } from '../external/providers/bcrypt-hash-provider';
import { JwtTokenProvider } from '../external/providers/jwt-token-provider';
import { GoogleOAuthProvider } from '../external/providers/google-oauth-provider';
import { AppleOAuthProvider } from '../external/providers/apple-oauth-provider';
import { MicrosoftOAuthProvider } from '../external/providers/microsoft-oauth-provider';
import { CfmvCrmvValidationProvider } from '../external/providers/cfmv-crmv-validation-provider';
import { SessionService } from '../../application/services/refresh-token-service';
import { GoogleAuthUseCase } from '../../application/use-cases/auth/google-auth-use-case';
import { GoogleWebAuthUseCase } from '../../application/use-cases/auth/google-web-auth-use-case';
import { AppleAuthUseCase } from '../../application/use-cases/auth/apple-auth-use-case';
import { MicrosoftAuthUseCase } from '../../application/use-cases/auth/microsoft-auth-use-case';
import { EmailLoginUseCase } from '../../application/use-cases/auth/email-login-use-case';
import { RefreshTokenUseCase } from '../../application/use-cases/auth/refresh-token-use-case';
import { CompleteOnboardingUseCase } from '../../application/use-cases/auth/complete-onboarding-use-case';
import { LogoutUseCase } from '../../application/use-cases/auth/logout-use-case';
import { GetCurrentUserUseCase } from '../../application/use-cases/auth/get-current-user-use-case';
import { CreateCompanyUseCase } from '../../application/use-cases/company/create-company-use-case';
import { GetCompanyUseCase } from '../../application/use-cases/company/get-company-use-case';
import { ListCompaniesUseCase } from '../../application/use-cases/company/list-companies-use-case';
import { UpdateCompanyUseCase } from '../../application/use-cases/company/update-company-use-case';
import { CreateProfessionalUseCase } from '../../application/use-cases/professional/create-professional-use-case';
import { GetProfessionalUseCase } from '../../application/use-cases/professional/get-professional-use-case';
import { ListProfessionalsUseCase } from '../../application/use-cases/professional/list-professionals-use-case';
import { UpdateProfessionalUseCase } from '../../application/use-cases/professional/update-professional-use-case';
import { VerifyCrmvUseCase } from '../../application/use-cases/professional/verify-crmv-use-case';
import { LookupCrmvUseCase } from '../../application/use-cases/professional/lookup-crmv-use-case';
import { AssociateCompanyUseCase } from '../../application/use-cases/professional/associate-company-use-case';
import { SequelizeAnimalRepository } from '../database/repositories/sequelize-animal-repository';
import { CreateAnimalUseCase } from '../../application/use-cases/animal/create-animal-use-case';
import { GetAnimalUseCase } from '../../application/use-cases/animal/get-animal-use-case';
import { ListAnimalsUseCase } from '../../application/use-cases/animal/list-animals-use-case';
import { UpdateAnimalUseCase } from '../../application/use-cases/animal/update-animal-use-case';
import { DeleteAnimalUseCase } from '../../application/use-cases/animal/delete-animal-use-case';
import { AuthController } from './controllers/auth-controller';
import { CompanyController } from './controllers/company-controller';
import { ProfessionalController } from './controllers/professional-controller';
import { AnimalController } from './controllers/animal-controller';
import { LgpdLogController } from './controllers/lgpd-log-controller';
import { ListLgpdLogsUseCase } from '../../application/use-cases/lgpd/list-lgpd-logs-use-case';

// Repositorios
const userRepository = new SequelizeUserRepository();
const companyRepository = new SequelizeCompanyRepository();
const sessionRepository = new SequelizeSessionRepository();
const companyProfessionalRepository = new SequelizeCompanyProfessionalRepository();
const animalRepository = new SequelizeAnimalRepository();

// Providers
const hashProvider = new BcryptHashProvider();
const tokenProvider = new JwtTokenProvider();
const googleOAuthProvider = new GoogleOAuthProvider();
const appleOAuthProvider = new AppleOAuthProvider();
const microsoftOAuthProvider = new MicrosoftOAuthProvider();
const crmvValidationProvider = new CfmvCrmvValidationProvider();

// Services
const sessionService = new SessionService(sessionRepository);

// Use Cases - Auth
const googleAuthUseCase = new GoogleAuthUseCase(
  userRepository,
  googleOAuthProvider,
  tokenProvider,
  sessionService,
);
const googleWebAuthUseCase = new GoogleWebAuthUseCase(
  userRepository,
  googleOAuthProvider,
  tokenProvider,
  sessionService,
);
const appleAuthUseCase = new AppleAuthUseCase(
  userRepository,
  appleOAuthProvider,
  tokenProvider,
  sessionService,
);
const microsoftAuthUseCase = new MicrosoftAuthUseCase(
  userRepository,
  microsoftOAuthProvider,
  tokenProvider,
  sessionService,
);
const emailLoginUseCase = new EmailLoginUseCase(
  userRepository,
  hashProvider,
  tokenProvider,
  sessionService,
);
const refreshTokenUseCase = new RefreshTokenUseCase(userRepository, tokenProvider, sessionService);
const completeOnboardingUseCase = new CompleteOnboardingUseCase(
  userRepository,
  tokenProvider,
  sessionService,
);
const logoutUseCase = new LogoutUseCase(sessionService);
const getCurrentUserUseCase = new GetCurrentUserUseCase(userRepository);

// Use Cases - Company
const createCompanyUseCase = new CreateCompanyUseCase(companyRepository);
const getCompanyUseCase = new GetCompanyUseCase(companyRepository);
const listCompaniesUseCase = new ListCompaniesUseCase(companyRepository);
const updateCompanyUseCase = new UpdateCompanyUseCase(companyRepository);

// Use Cases - Professional
const createProfessionalUseCase = new CreateProfessionalUseCase(
  userRepository,
  companyRepository,
  companyProfessionalRepository,
  hashProvider,
);
const getProfessionalUseCase = new GetProfessionalUseCase(userRepository);
const listProfessionalsUseCase = new ListProfessionalsUseCase(userRepository);
const updateProfessionalUseCase = new UpdateProfessionalUseCase(userRepository);
const verifyCrmvUseCase = new VerifyCrmvUseCase(
  userRepository,
  tokenProvider,
  sessionService,
  crmvValidationProvider,
);
const lookupCrmvUseCase = new LookupCrmvUseCase(crmvValidationProvider);
const associateCompanyUseCase = new AssociateCompanyUseCase(
  userRepository,
  companyRepository,
  companyProfessionalRepository,
);

// Use Cases - Animal
const createAnimalUseCase = new CreateAnimalUseCase(animalRepository);
const getAnimalUseCase = new GetAnimalUseCase(animalRepository);
const listAnimalsUseCase = new ListAnimalsUseCase(animalRepository);
const updateAnimalUseCase = new UpdateAnimalUseCase(animalRepository);
const deleteAnimalUseCase = new DeleteAnimalUseCase(animalRepository);

// Controllers
export const authController = new AuthController(
  googleAuthUseCase,
  googleWebAuthUseCase,
  appleAuthUseCase,
  microsoftAuthUseCase,
  emailLoginUseCase,
  refreshTokenUseCase,
  completeOnboardingUseCase,
  logoutUseCase,
  getCurrentUserUseCase,
);

export const companyController = new CompanyController(
  createCompanyUseCase,
  getCompanyUseCase,
  listCompaniesUseCase,
  updateCompanyUseCase,
);

export const professionalController = new ProfessionalController(
  createProfessionalUseCase,
  getProfessionalUseCase,
  listProfessionalsUseCase,
  updateProfessionalUseCase,
  verifyCrmvUseCase,
  lookupCrmvUseCase,
  associateCompanyUseCase,
);

export const animalController = new AnimalController(
  createAnimalUseCase,
  getAnimalUseCase,
  listAnimalsUseCase,
  updateAnimalUseCase,
  deleteAnimalUseCase,
);

// LGPD
const listLgpdLogsUseCase = new ListLgpdLogsUseCase();
export const lgpdLogController = new LgpdLogController(listLgpdLogsUseCase);

export { tokenProvider };
