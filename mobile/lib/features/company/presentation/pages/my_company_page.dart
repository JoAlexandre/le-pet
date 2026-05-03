import 'package:flutter/material.dart';
import 'package:material_design_icons_flutter/material_design_icons_flutter.dart';
import 'package:provider/provider.dart';
import '../../../../../shared/constants/app_colors.dart';
import '../../../../../shared/constants/app_text_styles.dart';
import '../../../../../features/auth/presentation/providers/auth_provider.dart';
import '../../../../../features/company/domain/entities/company.dart';
import '../../../../../features/company/presentation/providers/company_provider.dart';
import '../../../../../features/company/presentation/pages/edit_company_page.dart';
import '../../../../../features/company/presentation/pages/create_company_page.dart';

class MyCompanyPage extends StatefulWidget {
  const MyCompanyPage({super.key});

  @override
  State<MyCompanyPage> createState() => _MyCompanyPageState();
}

class _MyCompanyPageState extends State<MyCompanyPage> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<CompanyProvider>().loadCompanies();
    });
  }

  Company? _getMyCompany(CompanyProvider provider, String userId) {
    try {
      return provider.allCompanies.firstWhere((c) => c.userId == userId);
    } catch (_) {
      return null;
    }
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<CompanyProvider>();
    final user = context.watch<AuthProvider>().user;
    final myCompany = user != null ? _getMyCompany(provider, user.id) : null;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
        elevation: 0,
        title: Text(
          'Minha Empresa',
          style: AppTextStyles.h4.copyWith(color: Colors.white),
        ),
      ),
      body: provider.isLoading
          ? const Center(
              child: CircularProgressIndicator(color: AppColors.primary),
            )
          : myCompany == null
          ? _buildNoCompany()
          : RefreshIndicator(
              color: AppColors.primary,
              onRefresh: () => provider.loadCompanies(),
              child: SingleChildScrollView(
                physics: const AlwaysScrollableScrollPhysics(),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _buildStatusBanner(myCompany),
                    Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          _buildStatsGrid(),
                          const SizedBox(height: 24),
                          _buildQuickActions(context, myCompany, provider),
                          const SizedBox(height: 24),
                          _buildCompanyInfoCard(context, myCompany, provider),
                          const SizedBox(height: 24),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
    );
  }

  // ---------------------------------------------------------------------------
  // Status banner
  // ---------------------------------------------------------------------------

  Widget _buildStatusBanner(Company company) {
    final isActive = company.isActive;
    final gradient = isActive
        ? const LinearGradient(colors: [Color(0xFF43A047), Color(0xFF2E7D32)])
        : const LinearGradient(colors: [Color(0xFFFF9800), Color(0xFFF57C00)]);
    final icon = isActive ? MdiIcons.checkCircleOutline : MdiIcons.clockOutline;
    final title = isActive ? 'Empresa Ativa' : 'Verificacao Pendente';
    final subtitle = isActive
        ? 'Seu perfil esta visivel para os clientes.'
        : 'Sua empresa esta em analise. Voce sera notificado em 24-48 horas.';

    return Container(
      width: double.infinity,
      decoration: BoxDecoration(gradient: gradient),
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: Colors.white, size: 28),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: AppTextStyles.labelLarge.copyWith(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  subtitle,
                  style: AppTextStyles.bodySmall.copyWith(
                    color: Colors.white.withValues(alpha: 0.9),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Stats grid (2 x 2)
  // ---------------------------------------------------------------------------

  Widget _buildStatsGrid() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('Resumo', style: AppTextStyles.h4),
        const SizedBox(height: 12),
        Row(
          children: [
            _buildStatCard(
              icon: MdiIcons.calendarCheckOutline,
              iconColor: const Color(0xFF4A90D9),
              value: '--',
              label: 'Agendamentos\nHoje',
            ),
            const SizedBox(width: 12),
            _buildStatCard(
              icon: MdiIcons.pawOutline,
              iconColor: const Color(0xFF4CAF50),
              value: '--',
              label: 'Total de\nClientes',
            ),
          ],
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            _buildStatCard(
              icon: MdiIcons.starOutline,
              iconColor: const Color(0xFFFFC107),
              value: '--',
              label: 'Avaliacao\nMedia',
            ),
            const SizedBox(width: 12),
            _buildStatCard(
              icon: MdiIcons.currencyUsd,
              iconColor: const Color(0xFF9C27B0),
              value: '--',
              label: 'Receita\nEsta Semana',
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildStatCard({
    required IconData icon,
    required Color iconColor,
    required String value,
    required String label,
  }) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppColors.border),
        ),
        child: Row(
          children: [
            Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                color: iconColor.withValues(alpha: 0.12),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icon, color: iconColor, size: 22),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    value,
                    style: AppTextStyles.h3.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  Text(label, style: AppTextStyles.bodySmall, maxLines: 2),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Quick Actions (2 x 2 grid)
  // ---------------------------------------------------------------------------

  Widget _buildQuickActions(
    BuildContext context,
    Company company,
    CompanyProvider provider,
  ) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('Acoes Rapidas', style: AppTextStyles.h4),
        const SizedBox(height: 12),
        Row(
          children: [
            _buildActionTile(
              icon: MdiIcons.packageVariantClosed,
              bgColor: const Color(0xFF9C27B0),
              label: 'Produtos',
              onTap: () =>
                  _showComingSoon(context, 'Gerenciamento de Produtos'),
            ),
            const SizedBox(width: 12),
            _buildActionTile(
              icon: MdiIcons.storeCogOutline,
              bgColor: AppColors.primary,
              label: 'Editar Empresa',
              onTap: () => _navigateToEditCompany(context, company, provider),
            ),
          ],
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            _buildActionTile(
              icon: MdiIcons.clipboardListOutline,
              bgColor: const Color(0xFF2196F3),
              label: 'Servicos',
              onTap: () =>
                  _showComingSoon(context, 'Gerenciamento de Servicos'),
            ),
            const SizedBox(width: 12),
            _buildActionTile(
              icon: MdiIcons.calendarMonthOutline,
              bgColor: const Color(0xFF4CAF50),
              label: 'Agenda',
              onTap: () => _showComingSoon(context, 'Agenda de Funcionamento'),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildActionTile({
    required IconData icon,
    required Color bgColor,
    required String label,
    required VoidCallback onTap,
  }) {
    return Expanded(
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 20),
          decoration: BoxDecoration(
            color: AppColors.surface,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: AppColors.border),
          ),
          child: Column(
            children: [
              Container(
                width: 56,
                height: 56,
                decoration: BoxDecoration(
                  color: bgColor.withValues(alpha: 0.12),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Icon(icon, color: bgColor, size: 28),
              ),
              const SizedBox(height: 10),
              Text(
                label,
                style: AppTextStyles.labelMedium,
                textAlign: TextAlign.center,
                maxLines: 2,
              ),
            ],
          ),
        ),
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Company info card
  // ---------------------------------------------------------------------------

  Widget _buildCompanyInfoCard(
    BuildContext context,
    Company company,
    CompanyProvider provider,
  ) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('Informacoes da Empresa', style: AppTextStyles.h4),
        const SizedBox(height: 12),
        Container(
          decoration: BoxDecoration(
            color: AppColors.surface,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: AppColors.border),
          ),
          padding: const EdgeInsets.all(20),
          child: Column(
            children: [
              Row(
                children: [
                  Container(
                    width: 64,
                    height: 64,
                    decoration: BoxDecoration(
                      color: AppColors.primary.withValues(alpha: 0.12),
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(color: AppColors.border),
                    ),
                    child: company.logoUrl != null
                        ? ClipRRect(
                            borderRadius: BorderRadius.circular(14),
                            child: Image.network(
                              company.logoUrl!,
                              fit: BoxFit.cover,
                              errorBuilder: (context, error, stackTrace) =>
                                  Icon(
                                    MdiIcons.hospitalBuilding,
                                    color: AppColors.primary,
                                    size: 28,
                                  ),
                            ),
                          )
                        : Icon(
                            MdiIcons.hospitalBuilding,
                            color: AppColors.primary,
                            size: 28,
                          ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          company.tradeName,
                          style: AppTextStyles.h4,
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),
                        const SizedBox(height: 4),
                        _buildInfoRow(
                          MdiIcons.mapMarkerOutline,
                          '${company.city}, ${company.state}',
                        ),
                        const SizedBox(height: 2),
                        _buildInfoRow(MdiIcons.phoneOutline, company.phone),
                      ],
                    ),
                  ),
                ],
              ),
              if (company.description != null &&
                  company.description!.isNotEmpty) ...[
                const SizedBox(height: 12),
                const Divider(color: AppColors.border),
                const SizedBox(height: 8),
                Align(
                  alignment: Alignment.centerLeft,
                  child: Text(
                    company.description!,
                    style: AppTextStyles.bodySmall.copyWith(
                      color: AppColors.textSecondary,
                    ),
                  ),
                ),
              ],
              const SizedBox(height: 16),
              SizedBox(
                width: double.infinity,
                child: OutlinedButton.icon(
                  onPressed: () =>
                      _navigateToEditCompany(context, company, provider),
                  icon: Icon(
                    MdiIcons.pencilOutline,
                    size: 18,
                    color: AppColors.primary,
                  ),
                  label: Text(
                    'Editar Perfil da Empresa',
                    style: AppTextStyles.labelLarge.copyWith(
                      color: AppColors.primary,
                    ),
                  ),
                  style: OutlinedButton.styleFrom(
                    side: const BorderSide(color: AppColors.primary),
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildInfoRow(IconData icon, String text) {
    return Row(
      children: [
        Icon(icon, size: 13, color: AppColors.textSecondary),
        const SizedBox(width: 4),
        Expanded(
          child: Text(
            text,
            style: AppTextStyles.bodySmall,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
        ),
      ],
    );
  }

  // ---------------------------------------------------------------------------
  // Empty state
  // ---------------------------------------------------------------------------

  Widget _buildNoCompany() {
    final provider = context.read<CompanyProvider>();

    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              MdiIcons.hospitalBuilding,
              size: 80,
              color: AppColors.textHint,
            ),
            const SizedBox(height: 20),
            Text(
              'Nenhuma empresa cadastrada',
              style: AppTextStyles.h4.copyWith(color: AppColors.textSecondary),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 8),
            Text(
              'Crie agora o perfil da sua empresa e comece a receber clientes.',
              style: AppTextStyles.bodyMedium.copyWith(
                color: AppColors.textSecondary,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 28),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: () async {
                  final result = await Navigator.of(context).push<bool>(
                    MaterialPageRoute(
                      builder: (_) => ChangeNotifierProvider.value(
                        value: provider,
                        child: const CreateCompanyPage(),
                      ),
                    ),
                  );
                  if (result == true && context.mounted) {
                    provider.loadCompanies();
                  }
                },
                icon: Icon(MdiIcons.plusCircleOutline, size: 20),
                label: const Text('Criar Minha Empresa'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  Future<void> _navigateToEditCompany(
    BuildContext context,
    Company company,
    CompanyProvider provider,
  ) async {
    final result = await Navigator.of(context).push<bool>(
      MaterialPageRoute(
        builder: (_) => ChangeNotifierProvider.value(
          value: provider,
          child: EditCompanyPage(company: company),
        ),
      ),
    );
    if (result == true && context.mounted) {
      provider.loadCompanies();
    }
  }

  void _showComingSoon(BuildContext context, String feature) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('$feature - Disponivel em breve'),
        backgroundColor: AppColors.primary,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      ),
    );
  }
}
