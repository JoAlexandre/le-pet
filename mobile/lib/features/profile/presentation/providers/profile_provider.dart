import 'package:flutter/foundation.dart';
import '../../../auth/domain/entities/user.dart';
import '../../../auth/presentation/providers/auth_provider.dart';
import '../../domain/usecases/update_user_usecase.dart';
import '../../domain/usecases/change_password_usecase.dart';

enum ProfileUpdateStatus { idle, loading, success, error }

class ProfileProvider extends ChangeNotifier {
  final UpdateUserUseCase _updateUserUseCase;
  final ChangePasswordUseCase _changePasswordUseCase;
  final AuthProvider _authProvider;

  ProfileProvider({
    required UpdateUserUseCase updateUserUseCase,
    required ChangePasswordUseCase changePasswordUseCase,
    required AuthProvider authProvider,
  }) : _updateUserUseCase = updateUserUseCase,
       _changePasswordUseCase = changePasswordUseCase,
       _authProvider = authProvider;

  ProfileUpdateStatus _status = ProfileUpdateStatus.idle;
  String? _errorMessage;

  ProfileUpdateStatus get status => _status;
  String? get errorMessage => _errorMessage;
  User? get user => _authProvider.user;
  bool get isLoading => _status == ProfileUpdateStatus.loading;

  void _setLoading() {
    _status = ProfileUpdateStatus.loading;
    _errorMessage = null;
    notifyListeners();
  }

  void _setSuccess() {
    _status = ProfileUpdateStatus.success;
    _errorMessage = null;
    notifyListeners();
  }

  void _setError(String message) {
    _status = ProfileUpdateStatus.error;
    _errorMessage = message;
    notifyListeners();
  }

  void resetStatus() {
    _status = ProfileUpdateStatus.idle;
    _errorMessage = null;
    notifyListeners();
  }

  Future<bool> updateUser({String? name, String? phone}) async {
    final currentUser = _authProvider.user;
    if (currentUser == null) {
      _setError('Usuario nao autenticado.');
      return false;
    }

    _setLoading();
    final result = await _updateUserUseCase(
      userId: currentUser.id,
      name: name,
      phone: phone,
    );

    return result.fold(
      (failure) {
        _setError(failure.message);
        return false;
      },
      (updatedUser) {
        // Atualiza o usuario no AuthProvider para refletir em toda a app
        _authProvider.updateUser(updatedUser);
        _setSuccess();
        return true;
      },
    );
  }

  Future<bool> changePassword({required String newPassword}) async {
    _setLoading();
    final result = await _changePasswordUseCase(newPassword: newPassword);

    return result.fold(
      (failure) {
        _setError(failure.message);
        return false;
      },
      (_) {
        _setSuccess();
        return true;
      },
    );
  }
}
