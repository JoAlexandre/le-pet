import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';
import '../../../../../shared/constants/app_colors.dart';

class AnimalCardShimmer extends StatelessWidget {
  const AnimalCardShimmer({super.key});

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 2,
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      color: AppColors.surface,
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Row(
          children: [
            // Foto placeholder
            Container(
              width: 60,
              height: 60,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: AppColors.border),
              ),
              child: Shimmer.fromColors(
                baseColor: AppColors.surfaceVariant,
                highlightColor: AppColors.borderLight,
                child: Container(
                  decoration: BoxDecoration(
                    color: AppColors.surfaceVariant,
                    borderRadius: BorderRadius.circular(9),
                  ),
                ),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Shimmer.fromColors(
                    baseColor: AppColors.surfaceVariant,
                    highlightColor: AppColors.borderLight,
                    child: Container(
                      height: 14,
                      width: 120,
                      decoration: BoxDecoration(
                        color: AppColors.surfaceVariant,
                        borderRadius: BorderRadius.circular(4),
                      ),
                    ),
                  ),
                  const SizedBox(height: 6),
                  Shimmer.fromColors(
                    baseColor: AppColors.surfaceVariant,
                    highlightColor: AppColors.borderLight,
                    child: Container(
                      height: 12,
                      width: 80,
                      decoration: BoxDecoration(
                        color: AppColors.surfaceVariant,
                        borderRadius: BorderRadius.circular(4),
                      ),
                    ),
                  ),
                  const SizedBox(height: 6),
                  Shimmer.fromColors(
                    baseColor: AppColors.surfaceVariant,
                    highlightColor: AppColors.borderLight,
                    child: Container(
                      height: 10,
                      width: 60,
                      decoration: BoxDecoration(
                        color: AppColors.surfaceVariant,
                        borderRadius: BorderRadius.circular(4),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class AnimalListShimmer extends StatelessWidget {
  final int itemCount;

  const AnimalListShimmer({super.key, this.itemCount = 5});

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      itemCount: itemCount,
      padding: const EdgeInsets.only(top: 8),
      itemBuilder: (_, __) => const AnimalCardShimmer(),
    );
  }
}
