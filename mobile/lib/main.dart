import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'package:intl/date_symbol_data_local.dart';

import 'injection_container.dart' as di;
import 'core/domain/services/permission_service.dart';
import 'core/infrastructure/services/navigation_service.dart';
import 'core/presentation/routes/app_routes.dart';
import 'features/auth/presentation/providers/auth_provider.dart';
import 'shared/themes/app_theme.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);

  await di.init();

  initializeDateFormatting().then((_) => runApp(const LePetApp()));
}

class LePetApp extends StatelessWidget {
  const LePetApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider<PermissionService>(
          create: (_) => di.sl<PermissionService>(),
        ),
        ChangeNotifierProvider<AuthProvider>(
          create: (_) => di.sl<AuthProvider>(),
        ),
      ],
      child: MaterialApp(
        title: 'LePet',
        debugShowCheckedModeBanner: false,
        navigatorKey: NavigationService.navigatorKey,
        theme: AppTheme.lightTheme,
        darkTheme: AppTheme.darkTheme,
        themeMode: ThemeMode.light,
        initialRoute: AppRoutes.initialRoute,
        routes: AppRoutes.routes,
        onGenerateRoute: AppRoutes.onGenerateRoute,
        onUnknownRoute: AppRoutes.onUnknownRoute,
        builder: (context, child) {
          return GestureDetector(
            onTap: () => FocusManager.instance.primaryFocus?.unfocus(),
            child: child,
          );
        },
      ),
    );
  }
}
