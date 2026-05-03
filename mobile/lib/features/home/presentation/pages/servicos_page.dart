import 'package:flutter/material.dart';
import 'package:material_design_icons_flutter/material_design_icons_flutter.dart';
import 'package:provider/provider.dart';
import '../../../../../shared/constants/app_colors.dart';
import '../../../../../shared/constants/app_text_styles.dart';
import '../../../../../features/company/presentation/pages/company_detail_page.dart';
import '../../../../../features/company/presentation/providers/company_provider.dart';
import '../../../../../features/company/presentation/widgets/company_card.dart';
import '../../../../../features/company/presentation/widgets/company_card_shimmer.dart';

class ServicosPage extends StatefulWidget {
  const ServicosPage({super.key});

  @override
  State<ServicosPage> createState() => _ServicosPageState();
}

class _ServicosPageState extends State<ServicosPage> {
  final _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<CompanyProvider>().loadCompanies();
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<CompanyProvider>();

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
        elevation: 0,
        automaticallyImplyLeading: false,
        title: Text(
          'Servicos',
          style: AppTextStyles.h4.copyWith(color: Colors.white),
        ),
      ),
      body: Column(
        children: [
          _buildSearchBar(provider),
          Expanded(
            child: RefreshIndicator(
              color: AppColors.primary,
              onRefresh: () => provider.loadCompanies(),
              child: provider.isLoading
                  ? _buildShimmerList()
                  : provider.errorMessage != null
                  ? _buildError(provider.errorMessage!, provider)
                  : provider.companies.isEmpty
                  ? _buildEmpty(provider.searchQuery)
                  : _buildContent(provider),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSearchBar(CompanyProvider provider) {
    return Container(
      color: AppColors.primary,
      padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
      child: TextField(
        controller: _searchController,
        onChanged: provider.search,
        style: AppTextStyles.bodyMedium.copyWith(color: Colors.white),
        decoration: InputDecoration(
          hintText: 'Buscar clinicas ou cidades...',
          hintStyle: AppTextStyles.bodyMedium.copyWith(color: Colors.white60),
          prefixIcon: Icon(MdiIcons.magnify, color: Colors.white70),
          suffixIcon: _searchController.text.isNotEmpty
              ? IconButton(
                  icon: Icon(MdiIcons.close, color: Colors.white70),
                  onPressed: () {
                    _searchController.clear();
                    provider.search('');
                  },
                )
              : null,
          filled: true,
          fillColor: Colors.white.withValues(alpha: 0.15),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: BorderSide.none,
          ),
          contentPadding: const EdgeInsets.symmetric(
            horizontal: 16,
            vertical: 12,
          ),
        ),
      ),
    );
  }

  Widget _buildContent(CompanyProvider provider) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        _buildSectionHeader(MdiIcons.hospitalBuilding, 'Clinicas e Empresas'),
        const SizedBox(height: 12),
        ...provider.companies.map(
          (company) => CompanyCard(
            company: company,
            onTap: () => Navigator.of(context).push(
              MaterialPageRoute(
                builder: (_) => ChangeNotifierProvider.value(
                  value: provider,
                  child: CompanyDetailPage(companyId: company.id),
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildSectionHeader(IconData icon, String title) {
    return Row(
      children: [
        Icon(icon, size: 20, color: AppColors.primary),
        const SizedBox(width: 8),
        Text(
          title,
          style: AppTextStyles.labelLarge.copyWith(
            color: AppColors.textPrimary,
          ),
        ),
      ],
    );
  }

  Widget _buildShimmerList() {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: 5,
      itemBuilder: (context, index) => const CompanyCardShimmer(),
    );
  }

  Widget _buildError(String message, CompanyProvider provider) {
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
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: () => provider.loadCompanies(),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                foregroundColor: Colors.white,
              ),
              child: const Text('Tentar novamente'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildEmpty(String query) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              MdiIcons.hospitalBuilding,
              size: 64,
              color: AppColors.textHint,
            ),
            const SizedBox(height: 16),
            Text(
              query.isNotEmpty
                  ? 'Nenhuma clinica encontrada para "$query"'
                  : 'Nenhuma clinica cadastrada',
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
