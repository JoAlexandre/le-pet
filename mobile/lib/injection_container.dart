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

  // ============================================
  //  4. REPOSITORIES
  // ============================================

  // Auth
  sl.registerLazySingleton(() => GoogleSignIn());
  sl.registerLazySingleton<AuthRepository>(
    () => AuthRepositoryImpl(
      remoteDatasource: sl(),
      localDatasource: sl(),
      networkInfo: sl(),
      googleSignIn: sl(),
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

  // ============================================
  //  6. PROVIDERS
  // ============================================

  // Auth
  sl.registerFactory(
    () => AuthProvider(
      loginUseCase: sl(),
      googleAuthUseCase: sl(),
      appleAuthUseCase: sl(),
      logoutUseCase: sl(),
      checkAuthStatusUseCase: sl(),
      updateOnboardingUseCase: sl(),
    ),
  );
}
