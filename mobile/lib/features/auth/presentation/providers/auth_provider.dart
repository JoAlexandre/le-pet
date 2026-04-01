import 'package:flutter/foundation.dart';
import '../../domain/entities/user.dart';
import '../../domain/usecases/apple_auth_usecase.dart';
import '../../domain/usecases/check_auth_status_usecase.dart';
import '../../domain/usecases/google_auth_usecase.dart';
import '../../domain/usecases/login_usecase.dart';
import '../../domain/usecases/logout_usecase.dart';
import '../../domain/usecases/update_onboarding_usecase.dart';

enum AuthStatus { initial, loading, authenticated, unauthenticated, error }

class AuthProvider extends ChangeNotifier {
  final LoginUseCase _loginUseCase;
  final GoogleAuthUseCase _googleAuthUseCase;
  final AppleAuthUseCase _appleAuthUseCase;
  final LogoutUseCase _logoutUseCase;
  final CheckAuthStatusUseCase _checkAuthStatusUseCase;
  final UpdateOnboardingUseCase _updateOnboardingUseCase;

  AuthProvider({
    required LoginUseCase loginUseCase,
    required GoogleAuthUseCase googleAuthUseCase,
    required AppleAuthUseCase appleAuthUseCase,
    required LogoutUseCase logoutUseCase,
    required CheckAuthStatusUseCase checkAuthStatusUseCase,
    required UpdateOnboardingUseCase updateOnboardingUseCase,
  }) : _loginUseCase = loginUseCase,
       _googleAuthUseCase = googleAuthUseCase,
       _appleAuthUseCase = appleAuthUseCase,
       _logoutUseCase = logoutUseCase,
       _checkAuthStatusUseCase = checkAuthStatusUseCase,
       _updateOnboardingUseCase = updateOnboardingUseCase;

  AuthStatus _status = AuthStatus.initial;
  User? _user;
  String? _errorMessage;

  AuthStatus get status => _status;
  User? get user => _user;
  String? get errorMessage => _errorMessage;
  bool get isAuthenticated => _status == AuthStatus.authenticated;
  bool get isLoading => _status == AuthStatus.loading;
  bool get needsOnboarding => _user != null && !_user!.isOnboardingComplete;

  void _setLoading() {
    _status = AuthStatus.loading;
    _errorMessage = null;
    notifyListeners();
  }

  void _setAuthenticated(User user) {
    _status = AuthStatus.authenticated;
    _user = user;
    _errorMessage = null;
    notifyListeners();
  }

  void _setUnauthenticated() {
    _status = AuthStatus.unauthenticated;
    _user = null;
    _errorMessage = null;
    notifyListeners();
  }

  void _setError(String message) {
    _status = AuthStatus.error;
    _errorMessage = message;
    notifyListeners();
  }

  Future<void> checkAuthStatus() async {
    _setLoading();
    final result = await _checkAuthStatusUseCase();
    result.fold((failure) => _setUnauthenticated(), (user) {
      if (user != null) {
        _setAuthenticated(user);
      } else {
        _setUnauthenticated();
      }
    });
  }

  Future<bool> login(String email, String password) async {
    _setLoading();
    final result = await _loginUseCase(email, password);
    return result.fold(
      (failure) {
        _setError(failure.message);
        return false;
      },
      (user) {
        _setAuthenticated(user);
        return true;
      },
    );
  }

  Future<bool> loginWithGoogle() async {
    _setLoading();
    final result = await _googleAuthUseCase();
    return result.fold(
      (failure) {
        _setError(failure.message);
        return false;
      },
      (user) {
        _setAuthenticated(user);
        return true;
      },
    );
  }

  Future<bool> loginWithApple() async {
    _setLoading();
    final result = await _appleAuthUseCase();
    return result.fold(
      (failure) {
        _setError(failure.message);
        return false;
      },
      (user) {
        _setAuthenticated(user);
        return true;
      },
    );
  }

  Future<bool> updateOnboarding({
    required String role,
    String? specialtyType,
    String? crmvNumber,
    String? crmvState,
    String? phone,
  }) async {
    _setLoading();
    final result = await _updateOnboardingUseCase(
      role: role,
      specialtyType: specialtyType,
      crmvNumber: crmvNumber,
      crmvState: crmvState,
      phone: phone,
    );
    return result.fold(
      (failure) {
        _setError(failure.message);
        return false;
      },
      (user) {
        _setAuthenticated(user);
        return true;
      },
    );
  }

  Future<void> logout() async {
    _setLoading();
    final result = await _logoutUseCase();
    result.fold(
      (failure) => _setError(failure.message),
      (_) => _setUnauthenticated(),
    );
  }

  void clearError() {
    _errorMessage = null;
    notifyListeners();
  }
}
