import 'package:flutter/foundation.dart';

/// Servico de permissoes do app
class PermissionService extends ChangeNotifier {
  final Map<String, bool> _permissions = {};

  bool hasPermission(String permission) {
    return _permissions[permission] ?? false;
  }

  void setPermission(String permission, bool value) {
    _permissions[permission] = value;
    notifyListeners();
  }

  void setPermissions(Map<String, bool> permissions) {
    _permissions.addAll(permissions);
    notifyListeners();
  }

  void clearPermissions() {
    _permissions.clear();
    notifyListeners();
  }
}
