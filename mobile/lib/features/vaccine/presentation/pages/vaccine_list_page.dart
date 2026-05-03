import 'package:flutter/material.dart';
import 'package:material_design_icons_flutter/material_design_icons_flutter.dart';
import 'package:provider/provider.dart';
import '../../../../../shared/constants/app_colors.dart';
import '../../../../../shared/constants/app_text_styles.dart';
import '../../../../../shared/widgets/pet_carousel.dart';
import '../../../../../features/animal/domain/entities/animal.dart';
import '../../../../../features/animal/presentation/providers/animal_provider.dart';
import '../../../../../features/auth/presentation/providers/auth_provider.dart';
import '../../../../../core/domain/enums/user_role.dart';
import '../../../../../core/domain/enums/crmv_status.dart';
import '../../domain/entities/vaccine_record.dart';
import '../providers/vaccine_provider.dart';
import '../widgets/vaccine_card.dart';
import 'vaccine_detail_page.dart';
import 'register_vaccine_page.dart';

class VaccineListPage extends StatefulWidget {
  final Animal animal;

  const VaccineListPage({super.key, required this.animal});

  @override
  State<VaccineListPage> createState() => _VaccineListPageState();
}

class _VaccineListPageState extends State<VaccineListPage> {
  late Animal _selectedAnimal;
  int _selectedIndex = 0;

  @override
  void initState() {
    super.initState();
    _selectedAnimal = widget.animal;
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final animals = context.read<AnimalProvider>().animals;
      final idx = animals.indexWhere((a) => a.id == widget.animal.id);
      if (idx >= 0) setState(() => _selectedIndex = idx);
      context.read<VaccineProvider>().loadVaccinesByAnimal(_selectedAnimal.id!);
    });
  }

  void _onAnimalSelected(int index) {
    final animals = context.read<AnimalProvider>().animals;
    if (index < 0 || index >= animals.length) return;
    final animal = animals[index];
    setState(() {
      _selectedIndex = index;
      _selectedAnimal = animal;
    });
    context.read<VaccineProvider>().loadVaccinesByAnimal(animal.id!);
  }

  bool _isProfessionalVet(AuthProvider authProvider) {
    final user = authProvider.user;
    if (user == null) return false;
    return user.role == UserRole.professional &&
        user.crmvStatus == CrmvStatus.verified;
  }

  @override
  Widget build(BuildContext context) {
    final vaccineProvider = context.watch<VaccineProvider>();
    final authProvider = context.watch<AuthProvider>();
    final isVet = _isProfessionalVet(authProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
        elevation: 0,
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Central de Vacinas',
              style: AppTextStyles.h4.copyWith(color: Colors.white),
            ),
            Text(
              _selectedAnimal.name,
              style: AppTextStyles.bodySmall.copyWith(color: Colors.white70),
            ),
          ],
        ),
      ),
      body: RefreshIndicator(
        color: AppColors.primary,
        onRefresh: () =>
            vaccineProvider.loadVaccinesByAnimal(_selectedAnimal.id!),
        child: vaccineProvider.isLoading
            ? _buildShimmerList()
            : vaccineProvider.errorMessage != null
            ? _buildError(vaccineProvider.errorMessage!)
            : _buildContent(vaccineProvider, isVet),
      ),
      floatingActionButton: isVet
          ? FloatingActionButton.extended(
              onPressed: vaccineProvider.isActionLoading
                  ? null
                  : () async {
                      final result = await Navigator.of(context).push<bool>(
                        MaterialPageRoute(
                          builder: (_) => ChangeNotifierProvider.value(
                            value: vaccineProvider,
                            child: RegisterVaccinePage(animal: _selectedAnimal),
                          ),
                        ),
                      );
                      if (result == true && mounted) {
                        vaccineProvider.loadVaccinesByAnimal(
                          _selectedAnimal.id!,
                        );
                      }
                    },
              backgroundColor: AppColors.primary,
              foregroundColor: Colors.white,
              icon: Icon(MdiIcons.plus),
              label: const Text('Registrar Vacina'),
            )
          : null,
    );
  }

  Widget _buildContent(VaccineProvider provider, bool isVet) {
    final vaccines = provider.vaccines;
    final animalProvider = context.read<AnimalProvider>();

    return SingleChildScrollView(
      physics: const AlwaysScrollableScrollPhysics(),
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (animalProvider.animals.length > 1) ...[
            PetCarousel(
              animals: animalProvider.animals,
              selectedIndex: _selectedIndex,
              isLoading: animalProvider.isLoading,
              onSelectIndex: _onAnimalSelected,
            ),
            const SizedBox(height: 16),
          ],
          _AnimalHeaderCard(animal: _selectedAnimal),
          const SizedBox(height: 20),
          _VaccineSummaryCard(vaccines: vaccines),
          const SizedBox(height: 20),
          if (vaccines.isEmpty)
            _buildEmptyState(isVet)
          else ...[
            Text(
              'HISTORICO DE VACINAS',
              style: AppTextStyles.labelSmall.copyWith(
                color: AppColors.textSecondary,
                fontWeight: FontWeight.w700,
                letterSpacing: 1.2,
              ),
            ),
            const SizedBox(height: 12),
            ...vaccines.map(
              (v) => VaccineCard(
                vaccine: v,
                onTap: () => Navigator.of(context).push(
                  MaterialPageRoute(
                    builder: (_) => ChangeNotifierProvider.value(
                      value: context.read<VaccineProvider>(),
                      child: VaccineDetailPage(
                        vaccineId: v.id!,
                        animal: _selectedAnimal,
                        isVet: isVet,
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildShimmerList() {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: List.generate(4, (_) => const VaccineCardShimmer()),
      ),
    );
  }

  Widget _buildError(String message) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(MdiIcons.alertCircleOutline, color: AppColors.error, size: 48),
            const SizedBox(height: 12),
            Text(
              message,
              style: AppTextStyles.bodyMedium,
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: () => context
                  .read<VaccineProvider>()
                  .loadVaccinesByAnimal(_selectedAnimal.id!),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
              ),
              child: const Text('Tentar novamente'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildEmptyState(bool isVet) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 40),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(MdiIcons.needle, color: AppColors.textHint, size: 56),
            const SizedBox(height: 16),
            Text(
              'Nenhuma vacina registrada',
              style: AppTextStyles.h4.copyWith(color: AppColors.textSecondary),
            ),
            const SizedBox(height: 8),
            Text(
              isVet
                  ? 'Toque no botao abaixo para registrar a primeira vacina.'
                  : 'As vacinas de ${_selectedAnimal.name} apareceram aqui.',
              style: AppTextStyles.bodyMedium.copyWith(
                color: AppColors.textHint,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}

class _AnimalHeaderCard extends StatelessWidget {
  final Animal animal;

  const _AnimalHeaderCard({required this.animal});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        children: [
          Container(
            width: 56,
            height: 56,
            decoration: BoxDecoration(
              color: AppColors.primary.withValues(alpha: 0.12),
              shape: BoxShape.circle,
            ),
            child: Icon(MdiIcons.paw, color: AppColors.primary, size: 28),
          ),
          const SizedBox(width: 14),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(animal.name, style: AppTextStyles.h4),
              if (animal.breed != null && animal.breed!.isNotEmpty)
                Text(animal.breed!, style: AppTextStyles.bodySmall),
              if (animal.ageDisplayText != null)
                Text(
                  animal.ageDisplayText!,
                  style: AppTextStyles.bodySmall.copyWith(
                    color: AppColors.primary,
                  ),
                ),
            ],
          ),
        ],
      ),
    );
  }
}

class _VaccineSummaryCard extends StatelessWidget {
  final List<VaccineRecord> vaccines;

  const _VaccineSummaryCard({required this.vaccines});

  @override
  Widget build(BuildContext context) {
    final total = vaccines.length;
    final dueSoon = vaccines.where((v) => v.isDueSoon).length;
    final upToDate = vaccines.where((v) => !v.isOverdue && !v.isDueSoon).length;

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFFFF7F6B), Color(0xFFFF9A8B)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Passaporte de Vacinas',
                style: AppTextStyles.h4.copyWith(color: Colors.white),
              ),
              Icon(MdiIcons.shieldCheck, color: Colors.white70, size: 24),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              _SummaryItem(
                value: '$total',
                label: 'Total',
                color: Colors.white,
              ),
              const SizedBox(width: 24),
              _SummaryItem(
                value: '$dueSoon',
                label: 'Proximas',
                color: Colors.yellow.shade200,
              ),
              const SizedBox(width: 24),
              _SummaryItem(
                value: '$upToDate',
                label: 'Em dia',
                color: Colors.greenAccent.shade100,
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _SummaryItem extends StatelessWidget {
  final String value;
  final String label;
  final Color color;

  const _SummaryItem({
    required this.value,
    required this.label,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          value,
          style: TextStyle(
            fontSize: 28,
            fontWeight: FontWeight.bold,
            color: color,
          ),
        ),
        Text(
          label,
          style: const TextStyle(fontSize: 12, color: Colors.white70),
        ),
      ],
    );
  }
}
