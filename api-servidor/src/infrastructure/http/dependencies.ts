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
import { SequelizeProductSizeRepository } from '../database/repositories/sequelize-product-size-repository';
import { SequelizeProductRatingRepository } from '../database/repositories/sequelize-product-rating-repository';
import { SequelizeProductFavoriteRepository } from '../database/repositories/sequelize-product-favorite-repository';
import { SequelizeProductQuestionRepository } from '../database/repositories/sequelize-product-question-repository';
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
import { SequelizeVaccineRecordRepository } from '../database/repositories/sequelize-vaccine-record-repository';
import { SequelizeServiceRepository } from '../database/repositories/sequelize-service-repository';
import { SequelizeProductRepository } from '../database/repositories/sequelize-product-repository';
import { CreateAnimalUseCase } from '../../application/use-cases/animal/create-animal-use-case';
import { GetAnimalUseCase } from '../../application/use-cases/animal/get-animal-use-case';
import { ListAnimalsUseCase } from '../../application/use-cases/animal/list-animals-use-case';
import { UpdateAnimalUseCase } from '../../application/use-cases/animal/update-animal-use-case';
import { DeleteAnimalUseCase } from '../../application/use-cases/animal/delete-animal-use-case';
import { RegisterVaccineUseCase } from '../../application/use-cases/vaccine/register-vaccine-use-case';
import { ListVaccineRecordsUseCase } from '../../application/use-cases/vaccine/list-vaccine-records-use-case';
import { ListAllVaccineRecordsUseCase } from '../../application/use-cases/vaccine/list-all-vaccine-records-use-case';
import { ListVaccineRecordsByTutorUseCase } from '../../application/use-cases/vaccine/list-vaccine-records-by-tutor-use-case';
import { ListVaccineRecordsByProfessionalUseCase } from '../../application/use-cases/vaccine/list-vaccine-records-by-professional-use-case';
import { CreateServiceUseCase } from '../../application/use-cases/service/create-service-use-case';
import { GetServiceUseCase } from '../../application/use-cases/service/get-service-use-case';
import { ListServicesUseCase } from '../../application/use-cases/service/list-services-use-case';
import { UpdateServiceUseCase } from '../../application/use-cases/service/update-service-use-case';
import { DeleteServiceUseCase } from '../../application/use-cases/service/delete-service-use-case';
import { CreateProductUseCase } from '../../application/use-cases/product/create-product-use-case';
import { GetProductUseCase } from '../../application/use-cases/product/get-product-use-case';
import { ListProductsUseCase } from '../../application/use-cases/product/list-products-use-case';
import { UpdateProductUseCase } from '../../application/use-cases/product/update-product-use-case';
import { DeleteProductUseCase } from '../../application/use-cases/product/delete-product-use-case';
import { AddProductSizeUseCase } from '../../application/use-cases/product/add-product-size-use-case';
import { UpdateProductSizeUseCase } from '../../application/use-cases/product/update-product-size-use-case';
import { DeleteProductSizeUseCase } from '../../application/use-cases/product/delete-product-size-use-case';
import { RateProductUseCase } from '../../application/use-cases/product/rate-product-use-case';
import { ListProductRatingsUseCase } from '../../application/use-cases/product/list-product-ratings-use-case';
import { ToggleFavoriteUseCase } from '../../application/use-cases/product/toggle-favorite-use-case';
import { ListFavoritesUseCase } from '../../application/use-cases/product/list-favorites-use-case';
import { AskProductQuestionUseCase } from '../../application/use-cases/product/ask-product-question-use-case';
import { AnswerProductQuestionUseCase } from '../../application/use-cases/product/answer-product-question-use-case';
import { ListProductQuestionsUseCase } from '../../application/use-cases/product/list-product-questions-use-case';
import { AuthController } from './controllers/auth-controller';
import { CompanyController } from './controllers/company-controller';
import { ProfessionalController } from './controllers/professional-controller';
import { AnimalController } from './controllers/animal-controller';
import { VaccineController } from './controllers/vaccine-controller';
import { ServiceController } from './controllers/service-controller';
import { ProductController } from './controllers/product-controller';
import { LgpdLogController } from './controllers/lgpd-log-controller';
import { ListLgpdLogsUseCase } from '../../application/use-cases/lgpd/list-lgpd-logs-use-case';
import { SequelizeScheduleRepository } from '../database/repositories/sequelize-schedule-repository';
import { SequelizeAppointmentRepository } from '../database/repositories/sequelize-appointment-repository';
import { CreateScheduleUseCase } from '../../application/use-cases/schedule/create-schedule-use-case';
import { ListSchedulesUseCase } from '../../application/use-cases/schedule/list-schedules-use-case';
import { GetProfessionalScheduleUseCase } from '../../application/use-cases/schedule/get-professional-schedule-use-case';
import { GetCompanyScheduleUseCase } from '../../application/use-cases/schedule/get-company-schedule-use-case';
import { UpdateScheduleUseCase } from '../../application/use-cases/schedule/update-schedule-use-case';
import { DeleteScheduleUseCase } from '../../application/use-cases/schedule/delete-schedule-use-case';
import { CreateAppointmentUseCase } from '../../application/use-cases/appointment/create-appointment-use-case';
import { GetAppointmentUseCase } from '../../application/use-cases/appointment/get-appointment-use-case';
import { ListAppointmentsUseCase } from '../../application/use-cases/appointment/list-appointments-use-case';
import { UpdateAppointmentStatusUseCase } from '../../application/use-cases/appointment/update-appointment-status-use-case';
import { CancelAppointmentUseCase } from '../../application/use-cases/appointment/cancel-appointment-use-case';
import { ScheduleController } from './controllers/schedule-controller';
import { AppointmentController } from './controllers/appointment-controller';
import { SequelizeLostAnimalRepository } from '../database/repositories/sequelize-lost-animal-repository';
import { SequelizeLostAnimalMediaRepository } from '../database/repositories/sequelize-lost-animal-media-repository';
import { CreateLostAnimalUseCase } from '../../application/use-cases/lost-animal/create-lost-animal-use-case';
import { GetLostAnimalUseCase } from '../../application/use-cases/lost-animal/get-lost-animal-use-case';
import { ListLostAnimalsUseCase } from '../../application/use-cases/lost-animal/list-lost-animals-use-case';
import { ListMyLostAnimalsUseCase } from '../../application/use-cases/lost-animal/list-my-lost-animals-use-case';
import { UpdateLostAnimalUseCase } from '../../application/use-cases/lost-animal/update-lost-animal-use-case';
import { DeleteLostAnimalUseCase } from '../../application/use-cases/lost-animal/delete-lost-animal-use-case';
import { LostAnimalController } from './controllers/lost-animal-controller';
import { LocalFileStorageProvider } from '../external/providers/local-file-storage-provider';

// Repositorios
const userRepository = new SequelizeUserRepository();
const companyRepository = new SequelizeCompanyRepository();
const sessionRepository = new SequelizeSessionRepository();
const companyProfessionalRepository = new SequelizeCompanyProfessionalRepository();
const animalRepository = new SequelizeAnimalRepository();
const vaccineRecordRepository = new SequelizeVaccineRecordRepository();
const serviceRepository = new SequelizeServiceRepository();
const productRepository = new SequelizeProductRepository();
const productSizeRepository = new SequelizeProductSizeRepository();
const productRatingRepository = new SequelizeProductRatingRepository();
const productFavoriteRepository = new SequelizeProductFavoriteRepository();
const productQuestionRepository = new SequelizeProductQuestionRepository();
const scheduleRepository = new SequelizeScheduleRepository();
const appointmentRepository = new SequelizeAppointmentRepository();
const lostAnimalRepository = new SequelizeLostAnimalRepository();
const lostAnimalMediaRepository = new SequelizeLostAnimalMediaRepository();

// Providers
const hashProvider = new BcryptHashProvider();
const tokenProvider = new JwtTokenProvider();
const googleOAuthProvider = new GoogleOAuthProvider();
const appleOAuthProvider = new AppleOAuthProvider();
const microsoftOAuthProvider = new MicrosoftOAuthProvider();
const crmvValidationProvider = new CfmvCrmvValidationProvider();
const fileStorageProvider = new LocalFileStorageProvider();

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

// Use Cases - Vaccine
const registerVaccineUseCase = new RegisterVaccineUseCase(
  vaccineRecordRepository,
  animalRepository,
);
const listVaccineRecordsUseCase = new ListVaccineRecordsUseCase(
  vaccineRecordRepository,
  animalRepository,
);
const listAllVaccineRecordsUseCase = new ListAllVaccineRecordsUseCase(vaccineRecordRepository);
const listVaccineRecordsByTutorUseCase = new ListVaccineRecordsByTutorUseCase(
  vaccineRecordRepository,
);
const listVaccineRecordsByProfessionalUseCase = new ListVaccineRecordsByProfessionalUseCase(
  vaccineRecordRepository,
);

// Use Cases - Service
const createServiceUseCase = new CreateServiceUseCase(
  serviceRepository,
  companyRepository,
  userRepository,
);
const getServiceUseCase = new GetServiceUseCase(serviceRepository);
const listServicesUseCase = new ListServicesUseCase(serviceRepository);
const updateServiceUseCase = new UpdateServiceUseCase(serviceRepository, companyRepository);
const deleteServiceUseCase = new DeleteServiceUseCase(serviceRepository, companyRepository);

// Use Cases - Product
const createProductUseCase = new CreateProductUseCase(
  productRepository,
  productSizeRepository,
  companyRepository,
);
const getProductUseCase = new GetProductUseCase(
  productRepository,
  productSizeRepository,
  productFavoriteRepository,
);
const listProductsUseCase = new ListProductsUseCase(
  productRepository,
  productSizeRepository,
  productFavoriteRepository,
);
const updateProductUseCase = new UpdateProductUseCase(
  productRepository,
  productSizeRepository,
  productFavoriteRepository,
  companyRepository,
);
const deleteProductUseCase = new DeleteProductUseCase(productRepository, companyRepository);
const addProductSizeUseCase = new AddProductSizeUseCase(
  productRepository,
  productSizeRepository,
  companyRepository,
);
const updateProductSizeUseCase = new UpdateProductSizeUseCase(
  productRepository,
  productSizeRepository,
  companyRepository,
);
const deleteProductSizeUseCase = new DeleteProductSizeUseCase(
  productRepository,
  productSizeRepository,
  companyRepository,
);
const rateProductUseCase = new RateProductUseCase(productRepository, productRatingRepository);
const listProductRatingsUseCase = new ListProductRatingsUseCase(
  productRepository,
  productRatingRepository,
);
const toggleFavoriteUseCase = new ToggleFavoriteUseCase(
  productRepository,
  productFavoriteRepository,
);
const listFavoritesUseCase = new ListFavoritesUseCase(
  productRepository,
  productFavoriteRepository,
  productSizeRepository,
);
const askProductQuestionUseCase = new AskProductQuestionUseCase(
  productRepository,
  productQuestionRepository,
);
const answerProductQuestionUseCase = new AnswerProductQuestionUseCase(
  productRepository,
  productQuestionRepository,
  companyRepository,
);
const listProductQuestionsUseCase = new ListProductQuestionsUseCase(
  productRepository,
  productQuestionRepository,
);

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

export const vaccineController = new VaccineController(
  registerVaccineUseCase,
  listVaccineRecordsUseCase,
  listAllVaccineRecordsUseCase,
  listVaccineRecordsByTutorUseCase,
  listVaccineRecordsByProfessionalUseCase,
);

export const serviceController = new ServiceController(
  createServiceUseCase,
  getServiceUseCase,
  listServicesUseCase,
  updateServiceUseCase,
  deleteServiceUseCase,
);

export const productController = new ProductController(
  createProductUseCase,
  getProductUseCase,
  listProductsUseCase,
  updateProductUseCase,
  deleteProductUseCase,
  addProductSizeUseCase,
  updateProductSizeUseCase,
  deleteProductSizeUseCase,
  rateProductUseCase,
  listProductRatingsUseCase,
  toggleFavoriteUseCase,
  listFavoritesUseCase,
  askProductQuestionUseCase,
  answerProductQuestionUseCase,
  listProductQuestionsUseCase,
);

// LGPD
const listLgpdLogsUseCase = new ListLgpdLogsUseCase();
export const lgpdLogController = new LgpdLogController(listLgpdLogsUseCase);

// Use Cases - Schedule
const createScheduleUseCase = new CreateScheduleUseCase(
  scheduleRepository,
  companyRepository,
  companyProfessionalRepository,
);
const listSchedulesUseCase = new ListSchedulesUseCase(scheduleRepository, companyRepository);
const getProfessionalScheduleUseCase = new GetProfessionalScheduleUseCase(
  scheduleRepository,
  companyProfessionalRepository,
);
const getCompanyScheduleUseCase = new GetCompanyScheduleUseCase(
  scheduleRepository,
  companyRepository,
);
const updateScheduleUseCase = new UpdateScheduleUseCase(scheduleRepository, companyRepository);
const deleteScheduleUseCase = new DeleteScheduleUseCase(scheduleRepository, companyRepository);

// Use Cases - Appointment
const createAppointmentUseCase = new CreateAppointmentUseCase(
  appointmentRepository,
  animalRepository,
  serviceRepository,
  scheduleRepository,
  companyProfessionalRepository,
  userRepository,
);
const getAppointmentUseCase = new GetAppointmentUseCase(appointmentRepository);
const listAppointmentsUseCase = new ListAppointmentsUseCase(
  appointmentRepository,
  companyRepository,
);
const updateAppointmentStatusUseCase = new UpdateAppointmentStatusUseCase(
  appointmentRepository,
  companyRepository,
);
const cancelAppointmentUseCase = new CancelAppointmentUseCase(appointmentRepository);

// Controllers - Schedule & Appointment
export const scheduleController = new ScheduleController(
  createScheduleUseCase,
  listSchedulesUseCase,
  getProfessionalScheduleUseCase,
  getCompanyScheduleUseCase,
  updateScheduleUseCase,
  deleteScheduleUseCase,
);

export const appointmentController = new AppointmentController(
  createAppointmentUseCase,
  getAppointmentUseCase,
  listAppointmentsUseCase,
  updateAppointmentStatusUseCase,
  cancelAppointmentUseCase,
);

// Use Cases - Lost Animal
const createLostAnimalUseCase = new CreateLostAnimalUseCase(
  lostAnimalRepository,
  lostAnimalMediaRepository,
  animalRepository,
);
const getLostAnimalUseCase = new GetLostAnimalUseCase(
  lostAnimalRepository,
  lostAnimalMediaRepository,
);
const listLostAnimalsUseCase = new ListLostAnimalsUseCase(
  lostAnimalRepository,
  lostAnimalMediaRepository,
);
const listMyLostAnimalsUseCase = new ListMyLostAnimalsUseCase(
  lostAnimalRepository,
  lostAnimalMediaRepository,
);
const updateLostAnimalUseCase = new UpdateLostAnimalUseCase(
  lostAnimalRepository,
  lostAnimalMediaRepository,
);
const deleteLostAnimalUseCase = new DeleteLostAnimalUseCase(
  lostAnimalRepository,
  lostAnimalMediaRepository,
);

export const lostAnimalController = new LostAnimalController(
  createLostAnimalUseCase,
  getLostAnimalUseCase,
  listLostAnimalsUseCase,
  listMyLostAnimalsUseCase,
  updateLostAnimalUseCase,
  deleteLostAnimalUseCase,
  fileStorageProvider,
);

export { tokenProvider };
