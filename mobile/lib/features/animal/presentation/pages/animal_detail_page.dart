import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:material_design_icons_flutter/material_design_icons_flutter.dart';
import 'package:provider/provider.dart';
import '../../../../../shared/constants/app_colors.dart';
import '../../../../../shared/constants/app_text_styles.dart';
import '../../../vaccine/presentation/pages/vaccine_list_page.dart';
import '../../../vaccine/presentation/providers/vaccine_provider.dart';
import '../../domain/entities/animal.dart';
import '../providers/animal_provider.dart';
import 'edit_animal_page.dart';

class AnimalDetailPage extends StatefulWidget {
  final String animalId;

  const AnimalDetailPage({super.key, required this.animalId});

  @override
  State<AnimalDetailPage> createState() => _AnimalDetailPageState();
}

class _AnimalDetailPageState extends State<AnimalDetailPage> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<AnimalProvider>().loadAnimal(widget.animalId);
    });
  }

  Future<void> _confirmDelete(Animal animal) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Remover Pet'),
        content: Text(
          'Tem certeza que deseja remover ${animal.name}? Esta acao nao pode ser desfeita.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(false),
            child: const Text('Cancelar'),
          ),
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(true),
            style: TextButton.styleFrom(foregroundColor: AppColors.error),
            child: const Text('Remover'),
          ),
        ],
      ),
    );

    if (confirmed == true && mounted) {
      final provider = context.read<AnimalProvider>();
      final success = await provider.deleteAnimal(animal.id!);
      if (!mounted) return;
      if (success) {
        Navigator.of(context).pop();
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Pet removido com sucesso.'),
            backgroundColor: AppColors.success,
          ),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(provider.errorMessage ?? 'Erro ao remover pet.'),
            backgroundColor: AppColors.error,
          ),
        );
        provider.resetStatus();
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<AnimalProvider>();
    final animal = provider.selectedAnimal;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
        elevation: 0,
        title: Text(
          animal?.name ?? 'Detalhes do Pet',
          style: AppTextStyles.h4.copyWith(color: Colors.white),
        ),
        actions: animal != null
            ? [
                IconButton(
                  icon: Icon(MdiIcons.pencil),
                  onPressed: () => Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (_) => EditAnimalPage(animal: animal),
                    ),
                  ),
                ),
                IconButton(
                  icon: Icon(MdiIcons.trashCanOutline),
                  onPressed: provider.isActionLoading
                      ? null
                      : () => _confirmDelete(animal),
                ),
              ]
            : null,
      ),
      body: provider.isLoading
          ? const Center(
              child: CircularProgressIndicator(color: AppColors.primary),
            )
          : animal == null
          ? const Center(child: Text('Pet nao encontrado.'))
          : _AnimalDetailBody(animal: animal),
    );
  }
}

class _AnimalDetailBody extends StatelessWidget {
  final Animal animal;

  const _AnimalDetailBody({required this.animal});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _PhotoSection(animal: animal),
          const SizedBox(height: 20),
          _InfoSection(animal: animal),
          const SizedBox(height: 16),
          _QuickLinksSection(animal: animal),
          if (animal.allergies != null && animal.allergies!.isNotEmpty) ...[
            const SizedBox(height: 16),
            _NotesSection(
              title: 'Alergias e Notas Médicas',
              content: animal.allergies!,
              icon: MdiIcons.alertCircleOutline,
            ),
          ],
          if (animal.notes != null && animal.notes!.isNotEmpty) ...[
            const SizedBox(height: 16),
            _VetSection(notes: animal.notes!),
          ],
        ],
      ),
    );
  }
}

class _PhotoSection extends StatelessWidget {
  final Animal animal;

  const _PhotoSection({required this.animal});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Container(
        width: 120,
        height: 120,
        decoration: BoxDecoration(
          color: AppColors.primaryLight.withOpacity(0.2),
          shape: BoxShape.circle,
          border: Border.all(color: AppColors.primary, width: 2),
        ),
        child: animal.photoUrl != null && animal.photoUrl!.isNotEmpty
            ? ClipOval(
                child: CachedNetworkImage(
                  imageUrl: animal.photoUrl!,
                  fit: BoxFit.cover,
                  placeholder: (_, __) => const _PhotoPlaceholder(),
                  errorWidget: (_, __, ___) => const _PhotoPlaceholder(),
                ),
              )
            : const _PhotoPlaceholder(),
      ),
    );
  }
}

class _PhotoPlaceholder extends StatelessWidget {
  const _PhotoPlaceholder();

  @override
  Widget build(BuildContext context) {
    return Icon(MdiIcons.paw, color: AppColors.primary, size: 48);
  }
}

class _InfoSection extends StatelessWidget {
  final Animal animal;

  const _InfoSection({required this.animal});

  @override
  Widget build(BuildContext context) {
    final dateFormat = DateFormat('dd/MM/yyyy');

    return Card(
      elevation: 1,
      color: AppColors.surface,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Informações', style: AppTextStyles.h4),
            const SizedBox(height: 12),
            _InfoRow(label: 'Nome', value: animal.name, icon: MdiIcons.paw),
            _InfoRow(
              label: 'Espécie',
              value: animal.species.displayName,
              icon: MdiIcons.tag,
            ),
            if (animal.breed != null && animal.breed!.isNotEmpty)
              _InfoRow(label: 'Raça', value: animal.breed!, icon: MdiIcons.dna),
            _InfoRow(
              label: 'Sexo',
              value: animal.gender.displayName,
              icon: MdiIcons.genderMaleFemale,
            ),
            if (animal.birthDate != null)
              _InfoRow(
                label: 'Data de Nascimento',
                value: dateFormat.format(animal.birthDate!),
                icon: MdiIcons.calendarHeart,
              ),
            if (animal.ageDisplayText != null)
              _InfoRow(
                label: 'Idade',
                value: animal.ageDisplayText!,
                icon: MdiIcons.clockOutline,
              ),
            if (animal.weight != null)
              _InfoRow(
                label: 'Peso',
                value: '${animal.weight!.toStringAsFixed(2)} kg',
                icon: MdiIcons.scaleBalance,
              ),
            if (animal.color != null && animal.color!.isNotEmpty)
              _InfoRow(
                label: 'Cor / Pelagem',
                value: animal.color!,
                icon: MdiIcons.palette,
              ),
            if (animal.microchipNumber != null &&
                animal.microchipNumber!.isNotEmpty)
              _InfoRow(
                label: 'Microchip',
                value: animal.microchipNumber!,
                icon: MdiIcons.chip,
              ),
          ],
        ),
      ),
    );
  }
}

class _InfoRow extends StatelessWidget {
  final String label;
  final String value;
  final IconData icon;

  const _InfoRow({
    required this.label,
    required this.value,
    required this.icon,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, size: 18, color: AppColors.primary),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(label, style: AppTextStyles.labelMedium),
                Text(value, style: AppTextStyles.bodyMedium),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _NotesSection extends StatelessWidget {
  final String title;
  final String content;
  final IconData icon;

  const _NotesSection({
    required this.title,
    required this.content,
    required this.icon,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 1,
      color: AppColors.surface,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(icon, size: 18, color: AppColors.primary),
                const SizedBox(width: 8),
                Text(title, style: AppTextStyles.h4),
              ],
            ),
            const SizedBox(height: 8),
            Text(content, style: AppTextStyles.bodyMedium),
          ],
        ),
      ),
    );
  }
}

class _VetSection extends StatelessWidget {
  final String notes;

  const _VetSection({required this.notes});

  Map<String, String> _parseVetInfo(String notes) {
    final result = <String, String>{};
    final lines = notes.split('\n');
    for (final line in lines) {
      if (line.startsWith('Clinica:')) {
        result['clinic'] = line.substring('Clinica:'.length).trim();
      } else if (line.startsWith('Veterinario:')) {
        result['doctor'] = line.substring('Veterinario:'.length).trim();
      } else if (line.startsWith('Telefone:')) {
        result['phone'] = line.substring('Telefone:'.length).trim();
      }
    }
    return result;
  }

  @override
  Widget build(BuildContext context) {
    final info = _parseVetInfo(notes);
    if (info.isEmpty) return const SizedBox.shrink();

    return Card(
      elevation: 1,
      color: AppColors.surface,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(MdiIcons.doctor, size: 18, color: AppColors.primary),
                const SizedBox(width: 8),
                Text('Veterinario Principal', style: AppTextStyles.h4),
              ],
            ),
            const SizedBox(height: 8),
            if (info['clinic'] != null && info['clinic']!.isNotEmpty)
              Padding(
                padding: const EdgeInsets.only(bottom: 4),
                child: Row(
                  children: [
                    Icon(
                      MdiIcons.hospitalBuilding,
                      size: 16,
                      color: AppColors.textSecondary,
                    ),
                    const SizedBox(width: 6),
                    Text(info['clinic']!, style: AppTextStyles.bodyMedium),
                  ],
                ),
              ),
            if (info['doctor'] != null && info['doctor']!.isNotEmpty)
              Padding(
                padding: const EdgeInsets.only(bottom: 4),
                child: Row(
                  children: [
                    Icon(
                      MdiIcons.accountOutline,
                      size: 16,
                      color: AppColors.textSecondary,
                    ),
                    const SizedBox(width: 6),
                    Text(info['doctor']!, style: AppTextStyles.bodyMedium),
                  ],
                ),
              ),
            if (info['phone'] != null && info['phone']!.isNotEmpty)
              Row(
                children: [
                  Icon(
                    MdiIcons.phone,
                    size: 16,
                    color: AppColors.textSecondary,
                  ),
                  const SizedBox(width: 6),
                  Text(info['phone']!, style: AppTextStyles.bodyMedium),
                ],
              ),
          ],
        ),
      ),
    );
  }
}

class _QuickLinksSection extends StatelessWidget {
  final Animal animal;

  const _QuickLinksSection({required this.animal});

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: () {
        Navigator.of(context).push(
          MaterialPageRoute(
            builder: (_) => ChangeNotifierProvider.value(
              value: context.read<VaccineProvider>(),
              child: VaccineListPage(animal: animal),
            ),
          ),
        );
      },
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 16),
        decoration: BoxDecoration(
          color: AppColors.primary.withValues(alpha: 0.08),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: AppColors.primary.withValues(alpha: 0.3)),
        ),
        child: Row(
          children: [
            Icon(MdiIcons.needle, color: AppColors.primary, size: 22),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Central de Vacinas',
                    style: AppTextStyles.labelLarge.copyWith(
                      color: AppColors.primary,
                    ),
                  ),
                  Text(
                    'Ver historico e registros',
                    style: AppTextStyles.bodySmall,
                  ),
                ],
              ),
            ),
            Icon(MdiIcons.chevronRight, color: AppColors.primary, size: 18),
          ],
        ),
      ),
    );
  }
}
