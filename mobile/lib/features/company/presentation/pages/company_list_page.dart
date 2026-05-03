import 'package:flutter/material.dart';
import 'package:material_design_icons_flutter/material_design_icons_flutter.dart';
import 'package:provider/provider.dart';
import '../../../../../shared/constants/app_colors.dart';
import '../../../../../shared/constants/app_text_styles.dart';
import '../providers/company_provider.dart';
import '../widgets/company_card.dart';
import '../widgets/company_card_shimmer.dart';
import 'company_detail_page.dart';

class CompanyListPage extends StatefulWidget {
  const CompanyListPage({super.key});

  @override
  State<CompanyListPage> createState() => _CompanyListPageState();
}

class _CompanyListPageState extends State<CompanyListPage> {
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
        title: Text(
          'Clinicas e Empresas',
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
                  ? _buildError(provider.errorMessage!)
                  : provider.companies.isEmpty
                  ? _buildEmpty(provider.searchQuery)
                  : _buildList(provider),
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
          hintText: 'Pesquisar clinicas ou cidades...',
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

  Widget _buildShimmerList() {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: 6,
      itemBuilder: (context, index) => const CompanyCardShimmer(),
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
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: () => context.read<CompanyProvider>().loadCompanies(),
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

  Widget _buildList(CompanyProvider provider) {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: provider.companies.length,
      itemBuilder: (context, index) {
        final company = provider.companies[index];
        return CompanyCard(
          company: company,
          onTap: () {
            Navigator.of(context).push(
              MaterialPageRoute(
                builder: (_) => ChangeNotifierProvider.value(
                  value: provider,
                  child: CompanyDetailPage(companyId: company.id),
                ),
              ),
            );
          },
        );
      },
    );
  }
}
