import 'package:dartz/dartz.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:sign_in_with_apple/sign_in_with_apple.dart';
import '../../../../core/domain/failures/failure.dart';
import '../../../../core/infrastructure/errors/exceptions.dart';
import '../../../../core/infrastructure/network/network_info.dart';
import '../../domain/entities/user.dart';
import '../../domain/repositories/auth_repository.dart';
import '../datasources/auth_local_datasource.dart';
import '../datasources/auth_remote_datasource.dart';
import '../models/user_model.dart';

class AuthRepositoryImpl implements AuthRepository {
  final AuthRemoteDatasource _remoteDatasource;
  final AuthLocalDatasource _localDatasource;
  final NetworkInfo _networkInfo;
  final GoogleSignIn _googleSignIn;

  const AuthRepositoryImpl({
    required AuthRemoteDatasource remoteDatasource,
    required AuthLocalDatasource localDatasource,
    required NetworkInfo networkInfo,
    required GoogleSignIn googleSignIn,
  }) : _remoteDatasource = remoteDatasource,
       _localDatasource = localDatasource,
       _networkInfo = networkInfo,
       _googleSignIn = googleSignIn;

  @override
  Future<Either<Failure, User>> login(String email, String password) async {
    if (!await _networkInfo.isConnected) {
      return const Left(NetworkFailure());
    }
    try {
      final response = await _remoteDatasource.login(email, password);
      await _saveAuthData(
        response.user,
        response.tokens.accessToken,
        response.tokens.refreshToken,
        response.isOnboardingComplete,
      );
      return Right(response.user);
    } on ServerException catch (e) {
      return Left(AuthFailure(message: e.message));
    } on NetworkException {
      return const Left(NetworkFailure());
    } catch (e) {
      return const Left(UnexpectedFailure());
    }
  }

  @override
  Future<Either<Failure, User>> loginWithGoogle() async {
    if (!await _networkInfo.isConnected) {
      return const Left(NetworkFailure());
    }
    try {
      final googleUser = await _googleSignIn.signIn();
      if (googleUser == null) {
        return const Left(AuthFailure(message: 'Login com Google cancelado.'));
      }

      final googleAuth = await googleUser.authentication;
      final idToken = googleAuth.idToken;
      if (idToken == null) {
        return const Left(
          AuthFailure(message: 'Erro ao obter token do Google.'),
        );
      }

      final response = await _remoteDatasource.loginWithGoogle(idToken);
      await _saveAuthData(
        response.user,
        response.tokens.accessToken,
        response.tokens.refreshToken,
        response.isOnboardingComplete,
      );
      return Right(response.user);
    } on ServerException catch (e) {
      return Left(AuthFailure(message: e.message));
    } on NetworkException {
      return const Left(NetworkFailure());
    } catch (e) {
      return const Left(
        UnexpectedFailure(message: 'Erro ao autenticar com Google.'),
      );
    }
  }

  @override
  Future<Either<Failure, User>> loginWithApple() async {
    if (!await _networkInfo.isConnected) {
      return const Left(NetworkFailure());
    }
    try {
      final credential = await SignInWithApple.getAppleIDCredential(
        scopes: [
          AppleIDAuthorizationScopes.email,
          AppleIDAuthorizationScopes.fullName,
        ],
      );

      final idToken = credential.identityToken;
      if (idToken == null) {
        return const Left(
          AuthFailure(message: 'Erro ao obter token da Apple.'),
        );
      }

      final response = await _remoteDatasource.loginWithApple(
        idToken: idToken,
        firstName: credential.givenName,
        lastName: credential.familyName,
      );
      await _saveAuthData(
        response.user,
        response.tokens.accessToken,
        response.tokens.refreshToken,
        response.isOnboardingComplete,
      );
      return Right(response.user);
    } on SignInWithAppleAuthorizationException {
      return const Left(AuthFailure(message: 'Login com Apple cancelado.'));
    } on ServerException catch (e) {
      return Left(AuthFailure(message: e.message));
    } on NetworkException {
      return const Left(NetworkFailure());
    } catch (e) {
      return const Left(
        UnexpectedFailure(message: 'Erro ao autenticar com Apple.'),
      );
    }
  }

  @override
  Future<Either<Failure, void>> refreshToken() async {
    if (!await _networkInfo.isConnected) {
      return const Left(NetworkFailure());
    }
    try {
      final storedRefreshToken = _localDatasource.getRefreshToken();
      if (storedRefreshToken == null) {
        return const Left(AuthFailure(message: 'Sessao expirada.'));
      }

      final response = await _remoteDatasource.refreshToken(storedRefreshToken);
      await _saveAuthData(
        response.user,
        response.tokens.accessToken,
        response.tokens.refreshToken,
        response.isOnboardingComplete,
      );
      return const Right(null);
    } on ServerException catch (e) {
      return Left(AuthFailure(message: e.message));
    } catch (e) {
      return const Left(UnexpectedFailure());
    }
  }

  @override
  Future<Either<Failure, void>> logout() async {
    try {
      if (await _networkInfo.isConnected) {
        await _remoteDatasource.logout();
      }
    } catch (_) {
      // Ignora erros de rede no logout - limpa dados locais de qualquer forma
    }
    try {
      await _googleSignIn.signOut();
    } catch (_) {
      // Ignora erros do Google Sign Out
    }
    await _localDatasource.clearAuthData();
    return const Right(null);
  }

  @override
  Future<Either<Failure, User>> getCurrentUser() async {
    if (!await _networkInfo.isConnected) {
      // Tenta retornar dados do cache quando offline
      final cachedUser = _localDatasource.getUserData();
      if (cachedUser != null) {
        return Right(cachedUser);
      }
      return const Left(NetworkFailure());
    }
    try {
      final user = await _remoteDatasource.getCurrentUser();
      await _localDatasource.saveUserData(user);
      return Right(user);
    } on ServerException catch (e) {
      return Left(ServerFailure(message: e.message));
    } catch (e) {
      return const Left(UnexpectedFailure());
    }
  }

  @override
  Future<bool> isLoggedIn() async {
    final token = _localDatasource.getAccessToken();
    return token != null && token.isNotEmpty;
  }

  @override
  Future<Either<Failure, User>> updateOnboarding({
    required String role,
    String? specialtyType,
    String? crmvNumber,
    String? crmvState,
    String? phone,
  }) async {
    if (!await _networkInfo.isConnected) {
      return const Left(NetworkFailure());
    }
    try {
      final response = await _remoteDatasource.updateOnboarding(
        role: role,
        specialtyType: specialtyType,
        crmvNumber: crmvNumber,
        crmvState: crmvState,
        phone: phone,
      );
      await _saveAuthData(
        response.user,
        response.tokens.accessToken,
        response.tokens.refreshToken,
        response.isOnboardingComplete,
      );
      return Right(response.user);
    } on ServerException catch (e) {
      return Left(ServerFailure(message: e.message));
    } on NetworkException {
      return const Left(NetworkFailure());
    } catch (e) {
      return const Left(UnexpectedFailure());
    }
  }

  Future<void> _saveAuthData(
    UserModel user,
    String accessToken,
    String refreshToken,
    bool isOnboardingComplete,
  ) async {
    await _localDatasource.saveAccessToken(accessToken);
    await _localDatasource.saveRefreshToken(refreshToken);
    await _localDatasource.saveUserData(user);
    await _localDatasource.saveOnboardingStatus(isOnboardingComplete);
  }
}
