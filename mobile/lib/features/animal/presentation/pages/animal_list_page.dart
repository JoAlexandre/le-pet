import 'package:flutter/material.dart';
import 'package:material_design_icons_flutter/material_design_icons_flutter.dart';
import 'package:provider/provider.dart';
import '../../../../../shared/constants/app_colors.dart';
import '../../../../../shared/constants/app_text_styles.dart';
import '../providers/animal_provider.dart';
import '../widgets/animal_card.dart';
import '../widgets/animal_card_shimmer.dart';
import 'animal_detail_page.dart';
import 'create_animal_page.dart';

class AnimalListPage extends StatefulWidget {
  const AnimalListPage({super.key});

  @override
  State<AnimalListPage> createState() => _AnimalListPageState();
}

class _AnimalListPageState extends State<AnimalListPage> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<AnimalProvider>().loadAnimals();
    });
  }

  Future<void> _refresh() async {
    await context.read<AnimalProvider>().loadAnimals();
  }

  void _navigateToCreate() {
    Navigator.of(
      context,
    ).push(MaterialPageRoute(builder: (_) => const CreateAnimalPage()));
  }

  void _navigateToDetail(String id) {
    Navigator.of(
      context,
    ).push(MaterialPageRoute(builder: (_) => AnimalDetailPage(animalId: id)));
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<AnimalProvider>();

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.background,
        elevation: 0,
        automaticallyImplyLeading: true,
        title: Text(
          'Meus Pets',
          style: AppTextStyles.h4.copyWith(color: AppColors.textPrimary),
        ),
      ),
      body: _buildBody(provider),
      floatingActionButton: FloatingActionButton(
        onPressed: _navigateToCreate,
        backgroundColor: AppColors.primary,
        child: Icon(MdiIcons.plus, color: Colors.white),
      ),
    );
  }

  Widget _buildBody(AnimalProvider provider) {
    if (provider.isLoading && provider.animals.isEmpty) {
      return const AnimalListShimmer();
    }

    if (provider.animals.isEmpty) {
      return _EmptyState(onCreateTap: _navigateToCreate);
    }

    return RefreshIndicator(
      onRefresh: _refresh,
      color: AppColors.primary,
      child: ListView.builder(
        padding: const EdgeInsets.only(top: 8, bottom: 80),
        itemCount: provider.animals.length,
        itemBuilder: (context, index) {
          final animal = provider.animals[index];
          return AnimalCard(
            animal: animal,
            onTap: animal.id != null
                ? () => _navigateToDetail(animal.id!)
                : null,
          );
        },
      ),
    );
  }
}

class _EmptyState extends StatelessWidget {
  final VoidCallback onCreateTap;

  const _EmptyState({required this.onCreateTap});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(MdiIcons.pawOff, size: 80, color: AppColors.textHint),
            const SizedBox(height: 16),
            Text(
              'Nenhum pet cadastrado',
              style: AppTextStyles.h4.copyWith(color: AppColors.textSecondary),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 8),
            Text(
              'Adicione seu primeiro pet para comecar a acompanhar a saude dele.',
              style: AppTextStyles.bodyMedium.copyWith(
                color: AppColors.textHint,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 24),
            ElevatedButton.icon(
              onPressed: onCreateTap,
              icon: Icon(MdiIcons.plus),
              label: const Text('Adicionar Pet'),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(
                  horizontal: 24,
                  vertical: 12,
                ),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
