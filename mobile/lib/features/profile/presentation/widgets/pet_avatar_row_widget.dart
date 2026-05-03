import 'package:flutter/material.dart';
import 'package:material_design_icons_flutter/material_design_icons_flutter.dart';
import 'package:mobile/core/infrastructure/network/api_config.dart';
import '../../../../../shared/constants/app_colors.dart';
import '../../../../../shared/constants/app_text_styles.dart';

class PetAvatarItem {
  final String name;
  final String? photoUrl;

  const PetAvatarItem({required this.name, this.photoUrl});
}

class PetAvatarRowWidget extends StatelessWidget {
  final List<PetAvatarItem> pets;
  final VoidCallback? onManageTap;
  final VoidCallback? onAddPetTap;

  const PetAvatarRowWidget({
    super.key,
    required this.pets,
    this.onManageTap,
    this.onAddPetTap,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'MEUS PETS',
                style: AppTextStyles.labelSmall.copyWith(
                  color: AppColors.textSecondary,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 1.2,
                ),
              ),
              GestureDetector(
                onTap: onManageTap,
                child: Text(
                  'Gerenciar',
                  style: AppTextStyles.labelMedium.copyWith(
                    color: AppColors.secondary,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: [
                ...pets.map((pet) => _PetAvatar(pet: pet)),
                _AddPetButton(onTap: onAddPetTap),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _PetAvatar extends StatelessWidget {
  final PetAvatarItem pet;

  const _PetAvatar({required this.pet});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(right: 16),
      child: Column(
        children: [
          Container(
            width: 60,
            height: 60,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              border: Border.all(color: AppColors.border, width: 2),
            ),
            child: ClipOval(
              child: pet.photoUrl != null && pet.photoUrl!.isNotEmpty
                  ? Image.network(
                      pet.photoUrl!,
                      fit: BoxFit.cover,
                      errorBuilder: (ctx, err, _) => _buildFallback(),
                    )
                  : _buildFallback(),
            ),
          ),
          const SizedBox(height: 6),
          Text(
            pet.name,
            style: AppTextStyles.labelSmall.copyWith(
              color: AppColors.textPrimary,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFallback() {
    return Container(
      color: AppColors.primaryLight.withValues(alpha: 0.3),
      child: Icon(MdiIcons.paw, color: AppColors.primary, size: 28),
    );
  }
}

class _AddPetButton extends StatelessWidget {
  final VoidCallback? onTap;

  const _AddPetButton({this.onTap});

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
                color: AppColors.border,
                width: 2,
                style: BorderStyle.solid,
              ),
            ),
            child: const Icon(Icons.add, color: AppColors.textHint, size: 24),
          ),
          const SizedBox(height: 6),
          Text(
            'Add Pet',
            style: AppTextStyles.labelSmall.copyWith(color: AppColors.textHint),
          ),
        ],
      ),
    );
  }
}
