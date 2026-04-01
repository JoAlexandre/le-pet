import 'package:flutter/material.dart';

class NavigationService {
  static final GlobalKey<NavigatorState> navigatorKey =
      GlobalKey<NavigatorState>();

  NavigatorState? get navigator => navigatorKey.currentState;

  Future<dynamic>? navigateTo(String routeName, {Object? arguments}) {
    return navigator?.pushNamed(routeName, arguments: arguments);
  }

  Future<dynamic>? navigateAndReplace(String routeName, {Object? arguments}) {
    return navigator?.pushReplacementNamed(routeName, arguments: arguments);
  }

  Future<dynamic>? navigateAndRemoveUntil(String routeName) {
    return navigator?.pushNamedAndRemoveUntil(routeName, (route) => false);
  }

  void goBack() {
    navigator?.pop();
  }

  void showLoadingDialog(String message) {
    final context = navigatorKey.currentContext;
    if (context != null) {
      showDialog(
        context: context,
        barrierDismissible: false,
        builder: (_) => AlertDialog(
          content: Row(
            children: [
              const CircularProgressIndicator(),
              const SizedBox(width: 16),
              Expanded(child: Text(message)),
            ],
          ),
        ),
      );
    }
  }

  void closeLoadingDialog() {
    navigator?.pop();
  }
}
