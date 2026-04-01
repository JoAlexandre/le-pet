import 'package:flutter/material.dart';
import '../../../features/auth/presentation/pages/login_page.dart';
import '../../../features/auth/presentation/pages/onboarding_page.dart';
import '../../../features/auth/presentation/pages/splash_page.dart';
import '../../../features/auth/presentation/pages/welcome_page.dart';

class AppRoutes {
  AppRoutes._();

  static const String splash = '/';
  static const String welcome = '/welcome';
  static const String onboarding = '/onboarding';
  static const String login = '/login';
  static const String home = '/home';

  static const String initialRoute = splash;

  static Map<String, WidgetBuilder> get routes => {
    splash: (context) => const SplashPage(),
    welcome: (context) => const WelcomePage(),
    login: (context) => const LoginPage(),
    onboarding: (context) => const OnboardingPage(),
    home: (context) => const MainPagePlaceholder(),
  };

  static Route<dynamic>? onUnknownRoute(RouteSettings settings) {
    return MaterialPageRoute(
      builder: (context) => Scaffold(
        body: Center(child: Text('Rota nao encontrada: ${settings.name}')),
      ),
    );
  }

  static Route<dynamic>? onGenerateRoute(RouteSettings settings) {
    final routeBuilder = routes[settings.name];
    if (routeBuilder != null) {
      return MaterialPageRoute(settings: settings, builder: routeBuilder);
    }
    return null;
  }
}

/// Placeholder para MainPage ate a implementacao real
class MainPagePlaceholder extends StatelessWidget {
  const MainPagePlaceholder({super.key});

  @override
  Widget build(BuildContext context) {
    return const Scaffold(body: Center(child: Text('Home')));
  }
}
