import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../../../../core/infrastructure/network/storage_keys.dart';
import '../models/user_model.dart';
import 'auth_local_datasource.dart';

class AuthLocalDatasourceImpl implements AuthLocalDatasource {
  final SharedPreferences _prefs;

  const AuthLocalDatasourceImpl({required SharedPreferences prefs})
    : _prefs = prefs;

  @override
  Future<void> saveAccessToken(String token) async {
    await _prefs.setString(StorageKeys.accessToken, token);
  }

  @override
  Future<void> saveRefreshToken(String token) async {
    await _prefs.setString(StorageKeys.refreshToken, token);
  }

  @override
  Future<void> saveUserData(UserModel user) async {
    final jsonString = jsonEncode(user.toJson());
    await _prefs.setString(StorageKeys.userData, jsonString);
  }

  @override
  Future<void> saveOnboardingStatus(bool isComplete) async {
    await _prefs.setBool(StorageKeys.isOnboardingComplete, isComplete);
  }

  @override
  String? getAccessToken() {
    return _prefs.getString(StorageKeys.accessToken);
  }

  @override
  String? getRefreshToken() {
    return _prefs.getString(StorageKeys.refreshToken);
  }

  @override
  UserModel? getUserData() {
    final jsonString = _prefs.getString(StorageKeys.userData);
    if (jsonString == null) return null;
    final json = jsonDecode(jsonString) as Map<String, dynamic>;
    return UserModel.fromJson(json);
  }

  @override
  bool getOnboardingStatus() {
    return _prefs.getBool(StorageKeys.isOnboardingComplete) ?? false;
  }

  @override
  Future<void> clearAuthData() async {
    await _prefs.remove(StorageKeys.accessToken);
    await _prefs.remove(StorageKeys.refreshToken);
    await _prefs.remove(StorageKeys.userData);
    await _prefs.remove(StorageKeys.isOnboardingComplete);
  }
}
