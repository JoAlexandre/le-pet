import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:material_design_icons_flutter/material_design_icons_flutter.dart';
import '../../../../../core/domain/enums/animal_species.dart';
import '../../../../../shared/constants/app_colors.dart';
import '../../../../../shared/constants/app_text_styles.dart';
import '../../domain/entities/animal.dart';

class AnimalCard extends StatelessWidget {
  final Animal animal;
  final VoidCallback? onTap;

  const AnimalCard({super.key, required this.animal, this.onTap});

  IconData _speciesIcon(AnimalSpecies species) {
    switch (species) {
      case AnimalSpecies.dog:
        return MdiIcons.dog;
      case AnimalSpecies.cat:
        return MdiIcons.cat;
      case AnimalSpecies.bird:
        return MdiIcons.bird;
      case AnimalSpecies.fish:
        return MdiIcons.fish;
      case AnimalSpecies.reptile:
        return MdiIcons.snake;
      case AnimalSpecies.horse:
        return MdiIcons.horse;
      case AnimalSpecies.cow:
        return MdiIcons.cow;
      case AnimalSpecies.other:
        return MdiIcons.paw;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 2,
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      color: AppColors.surface,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Row(
            children: [
              _AnimalPhoto(
                photoUrl: animal.photoUrl,
                speciesIcon: _speciesIcon(animal.species),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      animal.name,
                      style: AppTextStyles.labelLarge,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 2),
                    Text(
                      animal.species.displayName,
                      style: AppTextStyles.bodySmall,
                    ),
                    if (animal.breed != null && animal.breed!.isNotEmpty) ...[
                      const SizedBox(height: 2),
                      Text(
                        animal.breed!,
                        style: AppTextStyles.bodySmall.copyWith(
                          color: AppColors.textHint,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                    if (animal.ageDisplayText != null) ...[
                      const SizedBox(height: 2),
                      Text(
                        animal.ageDisplayText!,
                        style: AppTextStyles.bodySmall.copyWith(
                          color: AppColors.textHint,
                        ),
                      ),
                    ],
                  ],
                ),
              ),
              Icon(MdiIcons.chevronRight, color: AppColors.textHint, size: 20),
            ],
          ),
        ),
      ),
    );
  }
}

class _AnimalPhoto extends StatelessWidget {
  final String? photoUrl;
  final IconData speciesIcon;

  const _AnimalPhoto({required this.photoUrl, required this.speciesIcon});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 60,
      height: 60,
      decoration: BoxDecoration(
        color: AppColors.primaryLight.withOpacity(0.2),
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: AppColors.border),
      ),
      child: photoUrl != null && photoUrl!.isNotEmpty
          ? ClipRRect(
              borderRadius: BorderRadius.circular(9),
              child: CachedNetworkImage(
                imageUrl: photoUrl!,
                fit: BoxFit.cover,
                placeholder: (_, __) =>
                    Icon(speciesIcon, color: AppColors.primary, size: 28),
                errorWidget: (_, __, ___) =>
                    Icon(speciesIcon, color: AppColors.primary, size: 28),
              ),
            )
          : Icon(speciesIcon, color: AppColors.primary, size: 28),
    );
  }
}
