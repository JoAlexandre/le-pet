import 'package:flutter/material.dart';
import 'package:material_design_icons_flutter/material_design_icons_flutter.dart';
import 'package:provider/provider.dart';
import 'package:shimmer/shimmer.dart';
import '../../../../../core/domain/enums/user_role.dart';
import '../../../../../core/presentation/routes/app_routes.dart';
import '../../../../../features/auth/presentation/providers/auth_provider.dart';
import '../../../../../shared/constants/app_colors.dart';
import '../../../../../shared/constants/app_text_styles.dart';
import '../widgets/feature_quick_access_card.dart';
import '../widgets/pet_avatar_row_widget.dart';
import '../widgets/profile_header_widget.dart';
import '../widgets/profile_menu_item_widget.dart';
import '../widgets/profile_section_widget.dart';

class ProfilePage extends StatelessWidget {
  const ProfilePage({super.key});

  @override
  Widget build(BuildContext context) {
    final authProvider = context.watch<AuthProvider>();
    final user = authProvider.user;
    final role = user?.role ?? UserRole.tutor;
    final isLoading = authProvider.isLoading;

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            isLoading
                ? _buildHeaderShimmer()
                : ProfileHeaderWidget(
                    name: user?.name ?? '',
                    email: user?.email ?? '',
                    role: role,
                    onSettingsTap: () {},
                  ),
            const SizedBox(height: 24),
            if (role == UserRole.tutor) ...[
              PetAvatarRowWidget(
                // Lista vazia ate fase de animais ser implementada
                pets: const [],
                onManageTap: () {},
                onAddPetTap: () {},
              ),
              const SizedBox(height: 24),
              _buildFeatureCards(context),
            ],
            _buildAccountSection(context, role),
            _buildSupportSection(context),
            const SizedBox(height: 24),
            _buildLogOutButton(context, authProvider),
            const SizedBox(height: 12),
            Center(
              child: Text(
                'Versao 1.0.0',
                style: AppTextStyles.labelSmall.copyWith(
                  color: AppColors.textHint,
                ),
              ),
            ),
            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }

  Widget _buildHeaderShimmer() {
    return Container(
      width: double.infinity,
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [AppColors.primary, AppColors.primaryDark],
        ),
      ),
      child: SafeArea(
        bottom: false,
        child: Padding(
          padding: const EdgeInsets.fromLTRB(16, 8, 16, 32),
          child: Column(
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const SizedBox(width: 40),
                  Text(
                    'Perfil',
                    style: AppTextStyles.h4.copyWith(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(width: 40),
                ],
              ),
              const SizedBox(height: 20),
              Shimmer.fromColors(
                baseColor: Colors.white.withValues(alpha: 0.3),
                highlightColor: Colors.white.withValues(alpha: 0.6),
                child: Column(
                  children: [
                    Container(
                      width: 80,
                      height: 80,
                      decoration: const BoxDecoration(
                        color: Colors.white,
                        shape: BoxShape.circle,
                      ),
                    ),
                    const SizedBox(height: 12),
                    Container(
                      width: 160,
                      height: 18,
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                    const SizedBox(height: 8),
                    Container(
                      width: 200,
                      height: 14,
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildFeatureCards(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Row(
        children: [
          FeatureQuickAccessCard(
            icon: MdiIcons.heart,
            title: 'Petinder',
            subtitle: 'Find pet matches',
            gradientColors: const [Color(0xFF9B59B6), Color(0xFF8E44AD)],
            onTap: () {},
          ),
          const SizedBox(width: 12),
          FeatureQuickAccessCard(
            icon: MdiIcons.mapMarkerOutline,
            title: 'Lost & Found',
            subtitle: 'Report & search',
            gradientColors: const [Color(0xFFE91E63), Color(0xFFAD1457)],
            onTap: () {},
          ),
        ],
      ),
    );
  }

  Widget _buildAccountSection(
    BuildContext context,
    UserRole role,
  ) {
    return ProfileSectionWidget(
      title: 'Conta',
      children: [
        ProfileMenuItemWidget(
          icon: MdiIcons.crownOutline,
          iconBackgroundColor: const Color(0xFFFF6B35),
          title: 'Planos de Assinatura',
          subtitle: 'Gerencie sua assinatura',
          onTap: () {},
        ),
        ProfileMenuItemWidget(
          icon: MdiIcons.accountEditOutline,
          iconBackgroundColor: const Color(0xFF26A69A),
          title: 'Editar Perfil',
          subtitle: 'Atualize suas informacoes',
          onTap: () => Navigator.of(context).pushNamed(AppRoutes.editProfile),
        ),
        ProfileMenuItemWidget(
          icon: MdiIcons.lockReset,
          iconBackgroundColor: AppColors.secondary,
          title: 'Alterar Senha',
          subtitle: 'Redefina sua senha de acesso',
          onTap: () =>
              Navigator.of(context).pushNamed(AppRoutes.changePassword),
        ),
        ProfileMenuItemWidget(
          icon: MdiIcons.bellOutline,
          iconBackgroundColor: const Color(0xFF42A5F5),
          title: 'Notificacoes',
          subtitle: 'Gerencie alertas e lembretes',
          onTap: () {},
        ),
        ProfileMenuItemWidget(
          icon: MdiIcons.shieldCheckOutline,
          iconBackgroundColor: const Color(0xFF66BB6A),
          title: 'Privacidade e Seguranca',
          subtitle: 'Controle seus dados',
          onTap: () {},
          showDivider: false,
        ),
      ],
    );
  }

  Widget _buildSupportSection(BuildContext context) {
    return ProfileSectionWidget(
      title: 'Suporte',
      children: [
        ProfileMenuItemWidget(
          icon: MdiIcons.helpCircleOutline,
          iconBackgroundColor: const Color(0xFFFFA726),
          title: 'Central de Ajuda',
          subtitle: 'FAQs e guias',
          onTap: () {},
        ),
        ProfileMenuItemWidget(
          icon: MdiIcons.headset,
          iconBackgroundColor: const Color(0xFF7E57C2),
          title: 'Contato e Suporte',
          subtitle: 'Fale com nosso time',
          onTap: () {},
        ),
        ProfileMenuItemWidget(
          icon: MdiIcons.fileDocumentOutline,
          iconBackgroundColor: const Color(0xFF90A4AE),
          title: 'Termos e Politicas',
          subtitle: 'Informacoes legais',
          onTap: () {},
          showDivider: false,
        ),
      ],
    );
  }

  Widget _buildLogOutButton(BuildContext context, AuthProvider authProvider) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: OutlinedButton.icon(
        onPressed: () => _confirmLogout(context, authProvider),
        icon: Icon(MdiIcons.logout, color: AppColors.error, size: 20),
        label: Text(
          'Sair',
          style: AppTextStyles.labelLarge.copyWith(color: AppColors.error),
        ),
        style: OutlinedButton.styleFrom(
          minimumSize: const Size(double.infinity, 52),
          side: const BorderSide(color: AppColors.error),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
        ),
      ),
    );
  }

  Future<void> _confirmLogout(
    BuildContext context,
    AuthProvider authProvider,
  ) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Sair'),
        content: const Text('Tem certeza que deseja sair da sua conta?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(false),
            child: const Text('Cancelar'),
          ),
          ElevatedButton(
            onPressed: () => Navigator.of(ctx).pop(true),
            style: ElevatedButton.styleFrom(backgroundColor: AppColors.error),
            child: const Text('Sair'),
          ),
        ],
      ),
    );

    if (confirmed == true) {
      await authProvider.logout();
      if (context.mounted) {
        Navigator.of(
          context,
        ).pushNamedAndRemoveUntil(AppRoutes.welcome, (_) => false);
      }
    }
  }
}
