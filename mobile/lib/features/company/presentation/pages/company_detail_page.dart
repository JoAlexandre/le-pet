import 'package:flutter/material.dart';
import 'package:material_design_icons_flutter/material_design_icons_flutter.dart';
import 'package:provider/provider.dart';
import '../../../../../shared/constants/app_colors.dart';
import '../../../../../shared/constants/app_text_styles.dart';
import '../../../../../features/auth/presentation/providers/auth_provider.dart';
import '../../../../../core/domain/enums/user_role.dart';
import '../../domain/entities/company.dart';
import '../providers/company_provider.dart';
import 'edit_company_page.dart';

class CompanyDetailPage extends StatefulWidget {
  final String companyId;

  const CompanyDetailPage({super.key, required this.companyId});

  @override
  State<CompanyDetailPage> createState() => _CompanyDetailPageState();
}

class _CompanyDetailPageState extends State<CompanyDetailPage> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<CompanyProvider>().loadCompany(widget.companyId);
    });
  }

  bool _canEdit(AuthProvider authProvider, String companyUserId) {
    final user = authProvider.user;
    if (user == null) return false;
    return user.role == UserRole.company && user.id == companyUserId;
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<CompanyProvider>();
    final authProvider = context.watch<AuthProvider>();
    final company = provider.selectedCompany;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
        elevation: 0,
        title: Text(
          company?.tradeName ?? 'Detalhes',
          style: AppTextStyles.h4.copyWith(color: Colors.white),
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
        ),
        actions: [
          if (company != null && _canEdit(authProvider, company.userId))
            IconButton(
              icon: Icon(MdiIcons.pencilOutline),
              onPressed: () async {
                final result = await Navigator.of(context).push<bool>(
                  MaterialPageRoute(
                    builder: (_) => ChangeNotifierProvider.value(
                      value: provider,
                      child: EditCompanyPage(company: company),
                    ),
                  ),
                );
                if (result == true && mounted) {
                  provider.loadCompany(widget.companyId);
                }
              },
            ),
        ],
      ),
      body: provider.isLoading
          ? const Center(
              child: CircularProgressIndicator(color: AppColors.primary),
            )
          : provider.errorMessage != null
          ? _buildError(provider.errorMessage!)
          : company == null
          ? const SizedBox.shrink()
          : RefreshIndicator(
              color: AppColors.primary,
              onRefresh: () => provider.loadCompany(widget.companyId),
              child: SingleChildScrollView(
                physics: const AlwaysScrollableScrollPhysics(),
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _buildHeader(company.tradeName, company.logoUrl),
                    const SizedBox(height: 24),
                    _buildInfoSection(company),
                    const SizedBox(height: 16),
                    _buildServicesPlaceholder(),
                  ],
                ),
              ),
            ),
    );
  }

  Widget _buildHeader(String tradeName, String? logoUrl) {
    return Center(
      child: Column(
        children: [
          Container(
            width: 88,
            height: 88,
            decoration: BoxDecoration(
              color: AppColors.primary.withValues(alpha: 0.12),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppColors.border),
            ),
            child: logoUrl != null
                ? ClipRRect(
                    borderRadius: BorderRadius.circular(16),
                    child: Image.network(
                      logoUrl,
                      fit: BoxFit.cover,
                      errorBuilder: (context, error, stackTrace) => Icon(
                        MdiIcons.hospitalBuilding,
                        color: AppColors.primary,
                        size: 40,
                      ),
                    ),
                  )
                : Icon(
                    MdiIcons.hospitalBuilding,
                    color: AppColors.primary,
                    size: 40,
                  ),
          ),
          const SizedBox(height: 12),
          Text(tradeName, style: AppTextStyles.h3, textAlign: TextAlign.center),
        ],
      ),
    );
  }

  Widget _buildInfoSection(Company company) {
    return Card(
      elevation: 0,
      color: AppColors.surface,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: const BorderSide(color: AppColors.border),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Informacoes',
              style: AppTextStyles.labelLarge.copyWith(
                color: AppColors.textPrimary,
              ),
            ),
            const SizedBox(height: 12),
            _buildInfoRow(
              MdiIcons.mapMarkerOutline,
              '${company.city}, ${company.state}',
            ),
            _buildInfoRow(MdiIcons.mapOutline, company.address),
            _buildInfoRow(MdiIcons.phoneOutline, company.phone),
            if (company.legalName != null && company.legalName!.isNotEmpty)
              _buildInfoRow(MdiIcons.domain, company.legalName!),
            if (company.cnpj != null && company.cnpj!.isNotEmpty)
              _buildInfoRow(
                MdiIcons.cardAccountDetailsOutline,
                'CNPJ: ${company.cnpj}',
              ),
            if (company.description != null && company.description!.isNotEmpty)
              _buildInfoRow(MdiIcons.informationOutline, company.description!),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoRow(IconData icon, String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, size: 18, color: AppColors.primary),
          const SizedBox(width: 10),
          Expanded(
            child: Text(
              text,
              style: AppTextStyles.bodyMedium.copyWith(
                color: AppColors.textSecondary,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildServicesPlaceholder() {
    return Card(
      elevation: 0,
      color: AppColors.surface,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: const BorderSide(color: AppColors.border),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Servicos',
              style: AppTextStyles.labelLarge.copyWith(
                color: AppColors.textPrimary,
              ),
            ),
            const SizedBox(height: 12),
            const Center(
              child: Padding(
                padding: EdgeInsets.symmetric(vertical: 16),
                child: Text(
                  'Servicos disponiveis em breve',
                  style: AppTextStyles.bodySmall,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildError(String message) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(MdiIcons.alertCircleOutline, size: 48, color: AppColors.error),
            const SizedBox(height: 16),
            Text(
              message,
              style: AppTextStyles.bodyMedium.copyWith(
                color: AppColors.textSecondary,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}
