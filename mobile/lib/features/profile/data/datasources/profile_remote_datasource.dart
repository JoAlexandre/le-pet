import '../../../auth/data/models/user_model.dart';

abstract class ProfileRemoteDatasource {
  Future<UserModel> updateUser({
    required String userId,
    String? name,
    String? phone,
  });

  Future<void> changePassword({required String newPassword});
}
