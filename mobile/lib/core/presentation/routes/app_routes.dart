import 'package:flutter/material.dart';
import '../../../features/animal/domain/entities/animal.dart';
import '../../../features/animal/presentation/pages/animal_detail_page.dart';
import '../../../features/animal/presentation/pages/animal_list_page.dart';
import '../../../features/animal/presentation/pages/create_animal_page.dart';
import '../../../features/animal/presentation/pages/edit_animal_page.dart';
import '../../../features/auth/presentation/pages/login_page.dart';
import '../../../features/auth/presentation/pages/onboarding_page.dart';
import '../../../features/auth/presentation/pages/splash_page.dart';
import '../../../features/auth/presentation/pages/welcome_page.dart';
import '../../../features/home/presentation/pages/home_shell_page.dart';
import '../../../features/profile/presentation/pages/edit_profile_page.dart';
import '../../../features/profile/presentation/pages/change_password_page.dart';
import '../../../features/company/presentation/pages/company_list_page.dart';

class AppRoutes {
  AppRoutes._();

  static const String splash = '/';
  static const String welcome = '/welcome';
  static const String onboarding = '/onboarding';
  static const String login = '/login';
  static const String home = '/home';
  static const String editProfile = '/profile/edit';
  static const String changePassword = '/profile/change-password';
  static const String animals = '/animals';
  static const String animalCreate = '/animals/create';
  static const String animalDetail = '/animals/detail';
  static const String animalEdit = '/animals/edit';
  static const String companies = '/companies';

  static const String initialRoute = splash;

  static Map<String, WidgetBuilder> get routes => {
    splash: (context) => const SplashPage(),
    welcome: (context) => const WelcomePage(),
    login: (context) => const LoginPage(),
    onboarding: (context) => const OnboardingPage(),
    home: (context) => const HomeShellPage(),
    editProfile: (context) => const EditProfilePage(),
    changePassword: (context) => const ChangePasswordPage(),
    animals: (context) => const AnimalListPage(),
    animalCreate: (context) => const CreateAnimalPage(),
    companies: (context) => const CompanyListPage(),
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

    // Rotas com argumentos dinamicos
    if (settings.name == animalDetail) {
      final id = settings.arguments as String;
      return MaterialPageRoute(
        settings: settings,
        builder: (_) => AnimalDetailPage(animalId: id),
      );
    }

    if (settings.name == animalEdit) {
      final animal = settings.arguments as Animal;
      return MaterialPageRoute(
        settings: settings,
        builder: (_) => EditAnimalPage(animal: animal),
      );
    }

    return null;
  }
}
