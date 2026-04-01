import 'package:flutter/material.dart';
import 'package:material_design_icons_flutter/material_design_icons_flutter.dart';
import '../../../../core/presentation/routes/app_routes.dart';
import '../../../../shared/constants/app_colors.dart';
import '../../../../shared/constants/app_text_styles.dart';

class WelcomePage extends StatefulWidget {
  const WelcomePage({super.key});

  @override
  State<WelcomePage> createState() => _WelcomePageState();
}

class _WelcomePageState extends State<WelcomePage> {
  final _pageController = PageController();
  int _currentPage = 0;

  static const _totalPages = 3;

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  void _goToLogin() {
    Navigator.of(context).pushReplacementNamed(AppRoutes.login);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Column(
          children: [
            _buildTopBar(),
            Expanded(
              child: PageView(
                controller: _pageController,
                onPageChanged: (index) {
                  setState(() => _currentPage = index);
                },
                children: const [
                  _WelcomeSlide(),
                  _FeaturesSlide(),
                  _ConnectedSlide(),
                ],
              ),
            ),
            _buildSignInButton(),
            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }

  Widget _buildTopBar() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
      child: Row(
        children: [
          GestureDetector(
            onTap: _goToLogin,
            child: Text(
              'Pular',
              style: AppTextStyles.bodyMedium.copyWith(
                color: AppColors.textSecondary,
              ),
            ),
          ),
          const Spacer(),
          _buildPageIndicator(),
          const Spacer(),
          const SizedBox(width: 32),
        ],
      ),
    );
  }

  Widget _buildPageIndicator() {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: List.generate(_totalPages, (index) {
        final isActive = index == _currentPage;
        return AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          margin: const EdgeInsets.symmetric(horizontal: 4),
          width: isActive ? 24 : 8,
          height: 8,
          decoration: BoxDecoration(
            color: isActive ? AppColors.primary : AppColors.border,
            borderRadius: BorderRadius.circular(4),
          ),
        );
      }),
    );
  }

  Widget _buildSignInButton() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24),
      child: SizedBox(
        width: double.infinity,
        height: 56,
        child: ElevatedButton(
          onPressed: _goToLogin,
          style: ElevatedButton.styleFrom(
            backgroundColor: AppColors.primary,
            foregroundColor: AppColors.textLight,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16),
            ),
            elevation: 0,
          ),
          child: const Text('Começar', style: AppTextStyles.button),
        ),
      ),
    );
  }
}

/// Slide 1: Logo, ilustracao, mensagem de boas-vindas
class _WelcomeSlide extends StatelessWidget {
  const _WelcomeSlide();

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 24),
      child: Column(
        children: [
          const SizedBox(height: 16),
          // Logo
          Image.asset('assets/icons/app-logo.png', width: 200, height: 200),
          const SizedBox(height: 32),
          const Text(
            'Bem vindo ao',
            style: AppTextStyles.h1,
            textAlign: TextAlign.center,
          ),
          Text(
            'Le Pet',
            style: AppTextStyles.h1.copyWith(
              color: AppColors.primary,
              fontSize: 32,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 12),
          Text(
            'Tudo o que o seu amigão precisa em \num só lugar. Da saúde à felicidade.',
            style: AppTextStyles.bodyMedium.copyWith(
              color: AppColors.textSecondary,
              height: 1.6,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }
}

/// Slide 2: Cards de funcionalidades em grid 2x2
class _FeaturesSlide extends StatelessWidget {
  const _FeaturesSlide();

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 24),
      child: Column(
        children: [
          const SizedBox(height: 24),
          Text(
            'Tudo o que voce precisa',
            style: AppTextStyles.h2.copyWith(fontSize: 22),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 8),
          Text(
            'Recursos poderosos para tutores de pets',
            style: AppTextStyles.bodyMedium.copyWith(
              color: AppColors.textSecondary,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 32),
          Row(
            children: [
              Expanded(
                child: _FeatureCard(
                  icon: MdiIcons.calendarMultiple,
                  iconColor: const Color(0xFF4A90D9),
                  iconBgColor: const Color(0xFFE8F0FE),
                  title: 'Agendamentos',
                  description: 'Agende consultas e\nbanho e tosa',
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _FeatureCard(
                  icon: MdiIcons.heartOutline,
                  iconColor: const Color(0xFF22C55E),
                  iconBgColor: const Color(0xFFE8F8EE),
                  title: 'Saude em Dia',
                  description: 'Lembretes de\nvacinacao',
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: _FeatureCard(
                  icon: MdiIcons.shoppingOutline,
                  iconColor: const Color(0xFF9333EA),
                  iconBgColor: const Color(0xFFF3E8FF),
                  title: 'Compras',
                  description: 'Tudo que seu pet precisa',
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _FeatureCard(
                  icon: MdiIcons.folderOutline,
                  iconColor: const Color(0xFFF59E0B),
                  iconBgColor: const Color(0xFFFEF3C7),
                  title: 'Registros',
                  description: 'Tenha o histórico\nem um so lugar',
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

/// Slide 3: Secao "stay connected"
class _ConnectedSlide extends StatelessWidget {
  const _ConnectedSlide();

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 24),
      child: Column(
        children: [
          const SizedBox(height: 24),
          Text(
            'Fique conectado',
            style: AppTextStyles.h2.copyWith(fontSize: 22),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 8),
          Text(
            'Nunca perca um momento importante',
            style: AppTextStyles.bodyMedium.copyWith(
              color: AppColors.textSecondary,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 40),
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppColors.borderLight),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Vamos te ajudar a ficar conectado',
                  style: AppTextStyles.h4.copyWith(fontSize: 16),
                ),
                const SizedBox(height: 20),
                _ConnectedItem(
                  icon: MdiIcons.bellOutline,
                  iconColor: AppColors.info,
                  iconBgColor: const Color(0xFFE8F0FE),
                  title: 'Lembretes de consultas',
                  description: 'Nunca perca uma consulta',
                ),
                const SizedBox(height: 16),
                _ConnectedItem(
                  icon: MdiIcons.cameraOutline,
                  iconColor: const Color(0xFF22C55E),
                  iconBgColor: const Color(0xFFE8F8EE),
                  title: 'Envio de fotos',
                  description: 'Adicione fotos fofas do seu pet',
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _FeatureCard extends StatelessWidget {
  final IconData icon;
  final Color iconColor;
  final Color iconBgColor;
  final String title;
  final String description;

  const _FeatureCard({
    required this.icon,
    required this.iconColor,
    required this.iconBgColor,
    required this.title,
    required this.description,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.borderLight),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
              color: iconBgColor,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icon, color: iconColor, size: 22),
          ),
          const SizedBox(height: 12),
          Text(
            title,
            style: AppTextStyles.labelLarge.copyWith(
              fontWeight: FontWeight.w700,
            ),
          ),
          const SizedBox(height: 4),
          Text(description, style: AppTextStyles.bodySmall),
        ],
      ),
    );
  }
}

class _ConnectedItem extends StatelessWidget {
  final IconData icon;
  final Color iconColor;
  final Color iconBgColor;
  final String title;
  final String description;

  const _ConnectedItem({
    required this.icon,
    required this.iconColor,
    required this.iconBgColor,
    required this.title,
    required this.description,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Container(
          width: 40,
          height: 40,
          decoration: BoxDecoration(
            color: iconBgColor,
            borderRadius: BorderRadius.circular(10),
          ),
          child: Icon(icon, color: iconColor, size: 20),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: AppTextStyles.labelLarge),
              Text(description, style: AppTextStyles.bodySmall),
            ],
          ),
        ),
      ],
    );
  }
}
