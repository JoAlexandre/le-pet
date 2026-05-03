import 'package:dio/dio.dart';
import 'package:get_it/get_it.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:internet_connection_checker/internet_connection_checker.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'core/domain/services/permission_service.dart';
import 'core/infrastructure/auth/auth_helper.dart';
import 'core/infrastructure/database/database_provider.dart';
import 'core/infrastructure/http/auth_interceptor.dart';
import 'core/infrastructure/http/dio_client.dart';
import 'core/infrastructure/network/network_info.dart';
import 'core/infrastructure/network/network_info_impl.dart';
import 'core/infrastructure/services/navigation_service.dart';
import 'features/animal/data/datasources/animal_local_datasource.dart';
import 'features/animal/data/datasources/animal_local_datasource_impl.dart';
import 'features/animal/data/datasources/animal_remote_datasource.dart';
import 'features/animal/data/datasources/animal_remote_datasource_impl.dart';
import 'features/animal/data/repositories/animal_repository_impl.dart';
import 'features/animal/domain/repositories/animal_repository.dart';
import 'features/animal/domain/usecases/create_animal_usecase.dart';
import 'features/animal/domain/usecases/delete_animal_usecase.dart';
import 'features/animal/domain/usecases/get_animal_usecase.dart';
import 'features/animal/domain/usecases/list_animals_usecase.dart';
import 'features/animal/domain/usecases/update_animal_usecase.dart';
import 'features/animal/domain/usecases/upload_animal_photo_usecase.dart';
import 'features/animal/presentation/providers/animal_provider.dart';
import 'features/vaccine/data/datasources/vaccine_local_datasource.dart';
import 'features/vaccine/data/datasources/vaccine_local_datasource_impl.dart';
import 'features/vaccine/data/datasources/vaccine_remote_datasource.dart';
import 'features/vaccine/data/datasources/vaccine_remote_datasource_impl.dart';
import 'features/vaccine/data/repositories/vaccine_repository_impl.dart';
import 'features/vaccine/domain/repositories/vaccine_repository.dart';
import 'features/vaccine/domain/usecases/list_vaccines_by_animal_usecase.dart';
import 'features/vaccine/domain/usecases/get_vaccine_usecase.dart';
import 'features/vaccine/domain/usecases/register_vaccine_usecase.dart';
import 'features/vaccine/domain/usecases/update_vaccine_usecase.dart';
import 'features/vaccine/domain/usecases/delete_vaccine_usecase.dart';
import 'features/vaccine/presentation/providers/vaccine_provider.dart';
import 'features/company/data/datasources/company_local_datasource.dart';
import 'features/company/data/datasources/company_local_datasource_impl.dart';
import 'features/company/data/datasources/company_remote_datasource.dart';
import 'features/company/data/datasources/company_remote_datasource_impl.dart';
import 'features/company/data/repositories/company_repository_impl.dart';
import 'features/company/domain/repositories/company_repository.dart';
import 'features/company/domain/usecases/list_companies_usecase.dart';
import 'features/company/domain/usecases/get_company_usecase.dart';
import 'features/company/domain/usecases/create_company_usecase.dart';
import 'features/company/domain/usecases/update_company_usecase.dart';
import 'features/company/presentation/providers/company_provider.dart';
import 'features/auth/data/datasources/auth_local_datasource.dart';
import 'features/auth/data/datasources/auth_local_datasource_impl.dart';
import 'features/auth/data/datasources/auth_remote_datasource.dart';
import 'features/auth/data/datasources/auth_remote_datasource_impl.dart';
import 'features/auth/data/repositories/auth_repository_impl.dart';
import 'features/auth/domain/repositories/auth_repository.dart';
import 'features/auth/domain/usecases/apple_auth_usecase.dart';
import 'features/auth/domain/usecases/check_auth_status_usecase.dart';
import 'features/auth/domain/usecases/google_auth_usecase.dart';
import 'features/auth/domain/usecases/login_usecase.dart';
import 'features/auth/domain/usecases/logout_usecase.dart';
import 'features/auth/domain/usecases/update_onboarding_usecase.dart';
import 'features/auth/presentation/providers/auth_provider.dart';
import 'features/profile/data/datasources/profile_remote_datasource.dart';
import 'features/profile/data/datasources/profile_remote_datasource_impl.dart';
import 'features/profile/data/repositories/profile_repository_impl.dart';
import 'features/profile/domain/repositories/profile_repository.dart';
import 'features/profile/domain/usecases/update_user_usecase.dart';
import 'features/profile/domain/usecases/change_password_usecase.dart';
import 'features/profile/presentation/providers/profile_provider.dart';

final sl = GetIt.instance;

Future<void> init() async {
  // ============================================
  //  1. EXTERNAL
  // ============================================
  final sharedPreferences = await SharedPreferences.getInstance();
  sl.registerLazySingleton(() => sharedPreferences);
  sl.registerLazySingleton(() => InternetConnectionChecker.instance);

  // ============================================
  //  2. CORE SERVICES
  // ============================================
  sl.registerLazySingleton(() => NavigationService());
  sl.registerLazySingleton(() => DatabaseProvider());
  sl.registerLazySingleton<NetworkInfo>(() => NetworkInfoImpl(sl()));
  sl.registerLazySingleton(() => PermissionService());
  sl.registerLazySingleton(() => AuthHelper(sharedPreferences: sl()));

  // HTTP
  sl.registerLazySingleton(
    () => AuthInterceptor(sharedPreferences: sl(), navigationService: sl()),
  );
  sl.registerLazySingleton(() => DioClient.createDio(authInterceptor: sl()));
  sl.registerLazySingleton<Dio>(
    () => DioClient.createPublicDio(),
    instanceName: 'publicDio',
  );

  // ============================================
  //  3. DATASOURCES
  // ============================================

  // Auth
  sl.registerLazySingleton<AuthLocalDatasource>(
    () => AuthLocalDatasourceImpl(prefs: sl()),
  );
  sl.registerLazySingleton<AuthRemoteDatasource>(
    () => AuthRemoteDatasourceImpl(
      dio: sl<Dio>(),
      publicDio: sl<Dio>(instanceName: 'publicDio'),
    ),
  );

  // Profile
  sl.registerLazySingleton<ProfileRemoteDatasource>(
    () => ProfileRemoteDatasourceImpl(dio: sl<Dio>()),
  );

  // Animal
  sl.registerLazySingleton<AnimalRemoteDatasource>(
    () => AnimalRemoteDatasourceImpl(dio: sl<Dio>()),
  );
  sl.registerLazySingleton<AnimalLocalDatasource>(
    () => AnimalLocalDatasourceImpl(databaseProvider: sl()),
  );

  // Vaccine
  sl.registerLazySingleton<VaccineRemoteDatasource>(
    () => VaccineRemoteDatasourceImpl(dio: sl<Dio>()),
  );
  sl.registerLazySingleton<VaccineLocalDatasource>(
    () => VaccineLocalDatasourceImpl(databaseProvider: sl()),
  );

  // Company
  sl.registerLazySingleton<CompanyRemoteDatasource>(
    () => CompanyRemoteDatasourceImpl(dio: sl<Dio>()),
  );
  sl.registerLazySingleton<CompanyLocalDatasource>(
    () => CompanyLocalDatasourceImpl(databaseProvider: sl()),
  );

  // ============================================
  //  4. REPOSITORIES
  // ============================================

  // Auth
  sl.registerLazySingleton(
    () => GoogleSignIn(
      // Web client ID - define o audience do idToken para validacao no servidor
      serverClientId:
          '919429457771-jf5ec2lbt4nhtdd6o95g8be671pcg3hk.apps.googleusercontent.com',
      scopes: ['email', 'profile'],
    ),
  );
  sl.registerLazySingleton<AuthRepository>(
    () => AuthRepositoryImpl(
      remoteDatasource: sl(),
      localDatasource: sl(),
      networkInfo: sl(),
      googleSignIn: sl(),
    ),
  );

  // Profile
  sl.registerLazySingleton<ProfileRepository>(
    () => ProfileRepositoryImpl(
      remoteDatasource: sl(),
      localDatasource: sl(),
      networkInfo: sl(),
    ),
  );

  // Animal
  sl.registerLazySingleton<AnimalRepository>(
    () => AnimalRepositoryImpl(
      remoteDatasource: sl(),
      localDatasource: sl(),
      networkInfo: sl(),
    ),
  );

  // Vaccine
  sl.registerLazySingleton<VaccineRepository>(
    () => VaccineRepositoryImpl(
      remoteDatasource: sl(),
      localDatasource: sl(),
      networkInfo: sl(),
    ),
  );

  // Company
  sl.registerLazySingleton<CompanyRepository>(
    () => CompanyRepositoryImpl(
      remoteDatasource: sl(),
      localDatasource: sl(),
      networkInfo: sl(),
    ),
  );

  // ============================================
  //  5. USE CASES
  // ============================================

  // Auth
  sl.registerLazySingleton(() => LoginUseCase(sl()));
  sl.registerLazySingleton(() => GoogleAuthUseCase(sl()));
  sl.registerLazySingleton(() => AppleAuthUseCase(sl()));
  sl.registerLazySingleton(() => LogoutUseCase(sl()));
  sl.registerLazySingleton(() => CheckAuthStatusUseCase(sl()));
  sl.registerLazySingleton(() => UpdateOnboardingUseCase(sl()));

  // Profile
  sl.registerLazySingleton(() => UpdateUserUseCase(sl()));
  sl.registerLazySingleton(() => ChangePasswordUseCase(sl()));

  // Animal
  sl.registerLazySingleton(() => ListAnimalsUseCase(sl()));
  sl.registerLazySingleton(() => GetAnimalUseCase(sl()));
  sl.registerLazySingleton(() => CreateAnimalUseCase(sl()));
  sl.registerLazySingleton(() => UpdateAnimalUseCase(sl()));
  sl.registerLazySingleton(() => DeleteAnimalUseCase(sl()));
  sl.registerLazySingleton(() => UploadAnimalPhotoUseCase(sl()));

  // Vaccine
  sl.registerLazySingleton(() => ListVaccinesByAnimalUseCase(sl()));
  sl.registerLazySingleton(() => GetVaccineUseCase(sl()));
  sl.registerLazySingleton(() => RegisterVaccineUseCase(sl()));
  sl.registerLazySingleton(() => UpdateVaccineUseCase(sl()));
  sl.registerLazySingleton(() => DeleteVaccineUseCase(sl()));

  // Company
  sl.registerLazySingleton(() => ListCompaniesUseCase(sl()));
  sl.registerLazySingleton(() => GetCompanyUseCase(sl()));
  sl.registerLazySingleton(() => CreateCompanyUseCase(sl()));
  sl.registerLazySingleton(() => UpdateCompanyUseCase(sl()));

  // ============================================
  //  6. PROVIDERS
  // ============================================

  // Auth
  sl.registerLazySingleton(
    () => AuthProvider(
      loginUseCase: sl(),
      googleAuthUseCase: sl(),
      appleAuthUseCase: sl(),
      logoutUseCase: sl(),
      checkAuthStatusUseCase: sl(),
      updateOnboardingUseCase: sl(),
    ),
  );

  // Profile
  sl.registerFactory(
    () => ProfileProvider(
      updateUserUseCase: sl(),
      changePasswordUseCase: sl(),
      authProvider: sl(),
    ),
  );

  // Animal
  sl.registerFactory(
    () => AnimalProvider(
      listAnimalsUseCase: sl(),
      getAnimalUseCase: sl(),
      createAnimalUseCase: sl(),
      updateAnimalUseCase: sl(),
      deleteAnimalUseCase: sl(),
      uploadAnimalPhotoUseCase: sl(),
    ),
  );

  // Vaccine
  sl.registerFactory(
    () => VaccineProvider(
      listVaccinesByAnimalUseCase: sl(),
      getVaccineUseCase: sl(),
      registerVaccineUseCase: sl(),
      updateVaccineUseCase: sl(),
      deleteVaccineUseCase: sl(),
    ),
  );

  // Company
  sl.registerFactory(
    () => CompanyProvider(
      listCompaniesUseCase: sl(),
      getCompanyUseCase: sl(),
      createCompanyUseCase: sl(),
      updateCompanyUseCase: sl(),
    ),
  );
}
