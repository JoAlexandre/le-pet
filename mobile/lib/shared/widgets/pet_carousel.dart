import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:material_design_icons_flutter/material_design_icons_flutter.dart';
import '../constants/app_colors.dart';
import '../constants/app_text_styles.dart';
import '../../features/animal/domain/entities/animal.dart';

class PetCarousel extends StatelessWidget {
  final List<Animal> animals;
  final int selectedIndex;
  final bool isLoading;
  final ValueChanged<int> onSelectIndex;
  final VoidCallback? onAddPet;

  const PetCarousel({
    super.key,
    required this.animals,
    required this.selectedIndex,
    required this.isLoading,
    required this.onSelectIndex,
    this.onAddPet,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 90,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        itemCount: animals.length + (onAddPet != null ? 1 : 0),
        separatorBuilder: (_, __) => const SizedBox(width: 12),
        itemBuilder: (context, index) {
          if (onAddPet != null && index == animals.length) {
            return _AddPetItem(onTap: onAddPet!);
          }
          final animal = animals[index];
          return _PetAvatarItem(
            animal: animal,
            isSelected: index == selectedIndex,
            onTap: () => onSelectIndex(index),
          );
        },
      ),
    );
  }
}

class _PetAvatarItem extends StatelessWidget {
  final Animal animal;
  final bool isSelected;
  final VoidCallback onTap;

  const _PetAvatarItem({
    required this.animal,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Column(
        children: [
          Container(
            width: 60,
            height: 60,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              border: Border.all(
                color: isSelected ? AppColors.primary : Colors.transparent,
                width: 2.5,
              ),
            ),
            child: ClipOval(
              child: animal.photoUrl != null && animal.photoUrl!.isNotEmpty
                  ? CachedNetworkImage(
                      imageUrl: animal.photoUrl!,
                      fit: BoxFit.cover,
                      placeholder: (_, __) => _PetAvatarPlaceholder(),
                      errorWidget: (_, __, ___) => _PetAvatarPlaceholder(),
                    )
                  : _PetAvatarPlaceholder(),
            ),
          ),
          const SizedBox(height: 6),
          Text(
            animal.name,
            style: AppTextStyles.labelSmall.copyWith(
              color: isSelected ? AppColors.primary : AppColors.textSecondary,
              fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }
}

class _PetAvatarPlaceholder extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      color: AppColors.primary.withValues(alpha: 0.15),
      child: Icon(MdiIcons.paw, color: AppColors.primary, size: 28),
    );
  }
}

class _AddPetItem extends StatelessWidget {
  final VoidCallback onTap;

  const _AddPetItem({required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Column(
        children: [
          Container(
            width: 60,
            height: 60,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: AppColors.surfaceVariant,
              border: Border.all(color: AppColors.border),
            ),
            child: Icon(
              MdiIcons.plus,
              color: AppColors.textSecondary,
              size: 28,
            ),
          ),
          const SizedBox(height: 6),
          Text(
            'Adicionar',
            style: AppTextStyles.labelSmall.copyWith(
              color: AppColors.textSecondary,
            ),
          ),
        ],
      ),
    );
  }
}
