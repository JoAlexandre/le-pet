import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../../../core/domain/enums/user_role.dart';
import '../../../../../features/auth/presentation/providers/auth_provider.dart';
import '../../../../../features/profile/presentation/pages/profile_page.dart';
import '../../../../../shared/constants/app_colors.dart';
import '../../../../../shared/constants/app_text_styles.dart';
import '../widgets/role_bottom_navigation.dart';
import 'tutor_home_page.dart';
import 'company_home_page.dart';
import 'professional_home_page.dart';
import 'servicos_page.dart';

class HomeShellPage extends StatefulWidget {
  const HomeShellPage({super.key});

  @override
  State<HomeShellPage> createState() => _HomeShellPageState();
}

class _HomeShellPageState extends State<HomeShellPage> {
  int _currentIndex = 0;

  List<Widget> _buildPages(UserRole role) {
    final Widget homePage;
    switch (role) {
      case UserRole.tutor:
        homePage = const TutorHomePage();
      case UserRole.company:
        homePage = const CompanyHomePage();
      case UserRole.professional:
        homePage = const ProfessionalHomePage();
      case UserRole.admin:
        homePage = const TutorHomePage();
    }

    // Para o tutor, a segunda aba e "Servicos" (clinicas e empresas)
    final Widget servicosTab = role == UserRole.tutor
        ? const ServicosPage()
        : const _PlaceholderTab(label: 'Em breve');

    return [
      homePage,
      servicosTab,
      const _PlaceholderTab(label: 'Em breve'),
      const _PlaceholderTab(label: 'Em breve'),
      const ProfilePage(),
    ];
  }

  void _onTabSelected(int index) {
    setState(() {
      _currentIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = context.watch<AuthProvider>();
    final role = authProvider.user?.role ?? UserRole.tutor;
    final pages = _buildPages(role);

    return PopScope(
      canPop: _currentIndex == 0,
      onPopInvokedWithResult: (didPop, result) {
        if (!didPop && _currentIndex != 0) {
          setState(() {
            _currentIndex = 0;
          });
        }
      },
      child: Scaffold(
        body: IndexedStack(index: _currentIndex, children: pages),
        bottomNavigationBar: RoleBottomNavigation(
          currentIndex: _currentIndex,
          onTap: _onTabSelected,
          role: role,
        ),
      ),
    );
  }
}

class _PlaceholderTab extends StatelessWidget {
  final String label;

  const _PlaceholderTab({required this.label});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: Center(
        child: Text(
          label,
          style: AppTextStyles.bodyMedium.copyWith(
            color: AppColors.textSecondary,
          ),
        ),
      ),
    );
  }
}
