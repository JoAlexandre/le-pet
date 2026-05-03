import 'package:flutter/material.dart';
import 'package:material_design_icons_flutter/material_design_icons_flutter.dart';
import 'package:provider/provider.dart';
import '../../../../../core/presentation/routes/app_routes.dart';
import '../../../../../features/animal/domain/entities/animal.dart';
import '../../../../../features/animal/presentation/providers/animal_provider.dart';
import '../../../../../features/auth/presentation/providers/auth_provider.dart';
import '../../../../../features/vaccine/presentation/pages/vaccine_list_page.dart';
import '../../../../../features/vaccine/presentation/providers/vaccine_provider.dart';
import '../../../../../shared/constants/app_colors.dart';
import '../../../../../shared/constants/app_text_styles.dart';
import '../../../../../shared/widgets/pet_carousel.dart';

class TutorHomePage extends StatefulWidget {
  const TutorHomePage({super.key});

  @override
  State<TutorHomePage> createState() => _TutorHomePageState();
}

class _TutorHomePageState extends State<TutorHomePage> {
  int _selectedPetIndex = 0;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<AnimalProvider>().loadAnimals();
    });
  }

  @override
  Widget build(BuildContext context) {
    final user = context.watch<AuthProvider>().user;
    final animalProvider = context.watch<AnimalProvider>();
    final animals = animalProvider.animals;

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 16),
              Row(
                children: [
                  CircleAvatar(
                    radius: 22,
                    backgroundColor: AppColors.primary.withValues(alpha: 0.2),
                    child: Icon(
                      MdiIcons.accountOutline,
                      color: AppColors.primary,
                      size: 24,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Ola, ${user?.name.split(' ').first ?? 'Tutor'}!',
                          style: AppTextStyles.h4,
                        ),
                        Text(
                          'Bom te ver por aqui',
                          style: AppTextStyles.bodySmall,
                        ),
                      ],
                    ),
                  ),
                  Stack(
                    children: [
                      IconButton(
                        icon: Icon(
                          MdiIcons.bellOutline,
                          color: AppColors.textPrimary,
                        ),
                        onPressed: () {},
                      ),
                      Positioned(
                        right: 8,
                        top: 8,
                        child: Container(
                          width: 8,
                          height: 8,
                          decoration: const BoxDecoration(
                            color: AppColors.error,
                            shape: BoxShape.circle,
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
              const SizedBox(height: 20),
              PetCarousel(
                animals: animals,
                selectedIndex: _selectedPetIndex,
                isLoading: animalProvider.isLoading,
                onSelectIndex: (i) => setState(() => _selectedPetIndex = i),
                onAddPet: () =>
                    Navigator.of(context).pushNamed(AppRoutes.animalCreate),
              ),
              const SizedBox(height: 20),
              _UpcomingAppointmentCard(),
              const SizedBox(height: 24),
              Text('Acoes Rapidas', style: AppTextStyles.h4),
              const SizedBox(height: 12),
              _QuickActionsGrid(
                animals: animals,
                selectedIndex: _selectedPetIndex,
              ),
              const SizedBox(height: 24),
              _VaccinationReminder(
                animals: animals,
                selectedIndex: _selectedPetIndex,
              ),
              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }
}

class _UpcomingAppointmentCard extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF7B5EA7), Color(0xFFE05FA3)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Proximo Agendamento',
                  style: AppTextStyles.bodySmall.copyWith(
                    color: Colors.white70,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  'Vacina & Check-up',
                  style: AppTextStyles.h4.copyWith(color: Colors.white),
                ),
                const SizedBox(height: 10),
                Row(
                  children: [
                    Icon(MdiIcons.calendar, color: Colors.white70, size: 14),
                    const SizedBox(width: 4),
                    Text(
                      'Em breve',
                      style: AppTextStyles.bodySmall.copyWith(
                        color: Colors.white70,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                ElevatedButton(
                  onPressed: () {},
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.white,
                    foregroundColor: const Color(0xFF7B5EA7),
                    padding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 8,
                    ),
                    minimumSize: Size.zero,
                    tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(20),
                    ),
                  ),
                  child: const Text(
                    'Ver Detalhes',
                    style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13),
                  ),
                ),
              ],
            ),
          ),
          Icon(MdiIcons.needle, color: Colors.white54, size: 36),
        ],
      ),
    );
  }
}

class _QuickActionsGrid extends StatelessWidget {
  final List<Animal> animals;
  final int selectedIndex;

  const _QuickActionsGrid({required this.animals, required this.selectedIndex});

  @override
  Widget build(BuildContext context) {
    final hasAnimal = animals.isNotEmpty;
    final selectedAnimal = hasAnimal
        ? animals[selectedIndex.clamp(0, animals.length - 1)]
        : null;

    return GridView.count(
      crossAxisCount: 2,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      crossAxisSpacing: 12,
      mainAxisSpacing: 12,
      childAspectRatio: 1.4,
      children: [
        _QuickActionCard(
          icon: MdiIcons.calendarPlus,
          iconColor: AppColors.secondary,
          title: 'Agendar Servico',
          subtitle: 'Marcar consulta',
          onTap: () {},
        ),
        _QuickActionCard(
          icon: MdiIcons.needle,
          iconColor: const Color(0xFF4CAF50),
          title: 'Vacinas',
          subtitle: 'Central & registros',
          onTap: selectedAnimal != null
              ? () => Navigator.of(context).push(
                  MaterialPageRoute(
                    builder: (_) => ChangeNotifierProvider.value(
                      value: context.read<VaccineProvider>(),
                      child: VaccineListPage(animal: selectedAnimal),
                    ),
                  ),
                )
              : () => Navigator.of(context).pushNamed(AppRoutes.animals),
        ),
        _QuickActionCard(
          icon: MdiIcons.food,
          iconColor: const Color(0xFF9C27B0),
          title: 'Repor Alimento',
          subtitle: 'Pedido automatico',
          onTap: () {},
        ),
        _QuickActionCard(
          icon: MdiIcons.filePlus,
          iconColor: const Color(0xFFF59E0B),
          title: 'Adicionar Registro',
          subtitle: 'Documentos de saude',
          onTap: () => Navigator.of(context).pushNamed(AppRoutes.animals),
        ),
      ],
    );
  }
}

class _QuickActionCard extends StatelessWidget {
  final IconData icon;
  final Color iconColor;
  final String title;
  final String subtitle;
  final VoidCallback onTap;

  const _QuickActionCard({
    required this.icon,
    required this.iconColor,
    required this.title,
    required this.subtitle,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 0,
      color: AppColors.surface,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(14),
        side: const BorderSide(color: AppColors.border),
      ),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(14),
        child: Padding(
          padding: const EdgeInsets.all(14),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                width: 38,
                height: 38,
                decoration: BoxDecoration(
                  color: iconColor.withValues(alpha: 0.12),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(icon, color: iconColor, size: 20),
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: AppTextStyles.labelLarge.copyWith(fontSize: 13),
                  ),
                  Text(subtitle, style: AppTextStyles.bodySmall),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _VaccinationReminder extends StatelessWidget {
  final List<Animal> animals;
  final int selectedIndex;

  const _VaccinationReminder({
    required this.animals,
    required this.selectedIndex,
  });

  @override
  Widget build(BuildContext context) {
    if (animals.isEmpty) return const SizedBox.shrink();

    final animal = animals[selectedIndex.clamp(0, animals.length - 1)];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Lembretes', style: AppTextStyles.h4),
        const SizedBox(height: 12),
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: const Color(0xFFFFFBEB),
            borderRadius: BorderRadius.circular(12),
            border: const Border(
              left: BorderSide(color: AppColors.warning, width: 4),
            ),
          ),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: AppColors.warning.withValues(alpha: 0.15),
                  shape: BoxShape.circle,
                ),
                child: Icon(
                  MdiIcons.bellRingOutline,
                  color: AppColors.warning,
                  size: 20,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Vacina Proxima', style: AppTextStyles.labelLarge),
                    const SizedBox(height: 4),
                    Text(
                      'Verifique o cartao de vacinas de ${animal.name} para nao perder datas importantes.',
                      style: AppTextStyles.bodySmall.copyWith(
                        color: AppColors.textSecondary,
                      ),
                    ),
                    const SizedBox(height: 10),
                    GestureDetector(
                      onTap: () => Navigator.of(context).push(
                        MaterialPageRoute(
                          builder: (_) => ChangeNotifierProvider.value(
                            value: context.read<VaccineProvider>(),
                            child: VaccineListPage(animal: animal),
                          ),
                        ),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text(
                            'Ver vacinas',
                            style: AppTextStyles.labelMedium.copyWith(
                              color: AppColors.primary,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                          const SizedBox(width: 2),
                          Icon(
                            MdiIcons.arrowRight,
                            color: AppColors.primary,
                            size: 14,
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
