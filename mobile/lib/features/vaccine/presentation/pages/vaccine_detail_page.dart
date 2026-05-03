import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:material_design_icons_flutter/material_design_icons_flutter.dart';
import 'package:provider/provider.dart';
import '../../../../../shared/constants/app_colors.dart';
import '../../../../../shared/constants/app_text_styles.dart';
import '../../../../../shared/widgets/loading_indicator.dart';
import '../../../../../features/animal/domain/entities/animal.dart';
import '../providers/vaccine_provider.dart';
import '../../domain/entities/vaccine_record.dart';

class VaccineDetailPage extends StatefulWidget {
  final String vaccineId;
  final Animal animal;
  final bool isVet;

  const VaccineDetailPage({
    super.key,
    required this.vaccineId,
    required this.animal,
    this.isVet = false,
  });

  @override
  State<VaccineDetailPage> createState() => _VaccineDetailPageState();
}

class _VaccineDetailPageState extends State<VaccineDetailPage> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<VaccineProvider>().loadVaccine(widget.vaccineId);
    });
  }

  Future<void> _confirmDelete(VaccineRecord vaccine) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Remover Vacina'),
        content: Text(
          'Deseja remover o registro de ${vaccine.vaccineName}? Esta acao nao pode ser desfeita.',
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
      final provider = context.read<VaccineProvider>();
      final success = await provider.deleteVaccine(vaccine.id!);
      if (!mounted) return;
      if (success) {
        Navigator.of(context).pop(true);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Vacina removida com sucesso.'),
            backgroundColor: AppColors.success,
          ),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(provider.errorMessage ?? 'Erro ao remover vacina.'),
            backgroundColor: AppColors.error,
          ),
        );
        provider.resetStatus();
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<VaccineProvider>();
    final vaccine = provider.selectedVaccine;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
        elevation: 0,
        title: Text(
          'Registro de Vacina',
          style: AppTextStyles.h4.copyWith(color: Colors.white),
        ),
        actions: widget.isVet && vaccine != null
            ? [
                IconButton(
                  icon: Icon(MdiIcons.trashCanOutline),
                  onPressed: provider.isActionLoading
                      ? null
                      : () => _confirmDelete(vaccine),
                ),
              ]
            : null,
      ),
      body: provider.isLoading
          ? const LoadingIndicator()
          : vaccine == null
          ? const Center(child: Text('Registro nao encontrado.'))
          : _VaccineDetailBody(vaccine: vaccine, animal: widget.animal),
    );
  }
}

class _VaccineDetailBody extends StatelessWidget {
  final VaccineRecord vaccine;
  final Animal animal;

  const _VaccineDetailBody({required this.vaccine, required this.animal});

  @override
  Widget build(BuildContext context) {
    final dateFormat = DateFormat('dd/MM/yyyy');

    Color statusColor;
    String statusLabel;
    if (vaccine.isOverdue) {
      statusColor = AppColors.error;
      statusLabel = 'Vencida';
    } else if (vaccine.isDueSoon) {
      statusColor = AppColors.warning;
      statusLabel = 'Vence em breve';
    } else {
      statusColor = AppColors.success;
      statusLabel = 'Em dia';
    }

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Animal header
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: AppColors.border),
            ),
            child: Row(
              children: [
                Container(
                  width: 44,
                  height: 44,
                  decoration: BoxDecoration(
                    color: AppColors.primary.withValues(alpha: 0.12),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(MdiIcons.paw, color: AppColors.primary, size: 22),
                ),
                const SizedBox(width: 12),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(animal.name, style: AppTextStyles.labelLarge),
                    if (animal.breed != null && animal.breed!.isNotEmpty)
                      Text('${animal.breed}', style: AppTextStyles.bodySmall),
                  ],
                ),
                const Spacer(),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 10,
                    vertical: 4,
                  ),
                  decoration: BoxDecoration(
                    color: statusColor.withValues(alpha: 0.12),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(
                      color: statusColor.withValues(alpha: 0.4),
                    ),
                  ),
                  child: Text(
                    statusLabel,
                    style: AppTextStyles.labelSmall.copyWith(
                      color: statusColor,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),
          _DetailCard(
            title: 'Informacoes da Vacina',
            children: [
              _DetailRow(
                icon: MdiIcons.needle,
                label: 'Vacina',
                value: vaccine.vaccineName,
              ),
              if (vaccine.vaccineManufacturer != null &&
                  vaccine.vaccineManufacturer!.isNotEmpty)
                _DetailRow(
                  icon: MdiIcons.factoryIcon,
                  label: 'Fabricante',
                  value: vaccine.vaccineManufacturer!,
                ),
              if (vaccine.batchNumber != null &&
                  vaccine.batchNumber!.isNotEmpty)
                _DetailRow(
                  icon: MdiIcons.barcode,
                  label: 'Lote',
                  value: vaccine.batchNumber!,
                ),
              _DetailRow(
                icon: MdiIcons.calendarCheck,
                label: 'Data de Aplicacao',
                value: dateFormat.format(vaccine.applicationDate),
              ),
              if (vaccine.nextDoseDate != null)
                _DetailRow(
                  icon: MdiIcons.calendarArrowRight,
                  label: 'Proxima Dose',
                  value: dateFormat.format(vaccine.nextDoseDate!),
                  valueColor: statusColor,
                ),
            ],
          ),
          if (vaccine.notes != null && vaccine.notes!.isNotEmpty) ...[
            const SizedBox(height: 16),
            _DetailCard(
              title: 'Observacoes',
              children: [
                Padding(
                  padding: const EdgeInsets.only(top: 4),
                  child: Text(
                    vaccine.notes!,
                    style: AppTextStyles.bodyMedium.copyWith(
                      color: AppColors.textSecondary,
                    ),
                  ),
                ),
              ],
            ),
          ],
        ],
      ),
    );
  }
}

class _DetailCard extends StatelessWidget {
  final String title;
  final List<Widget> children;

  const _DetailCard({required this.title, required this.children});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: AppTextStyles.h4),
          const SizedBox(height: 12),
          ...children,
        ],
      ),
    );
  }
}

class _DetailRow extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;
  final Color? valueColor;

  const _DetailRow({
    required this.icon,
    required this.label,
    required this.value,
    this.valueColor,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, size: 16, color: AppColors.textSecondary),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(label, style: AppTextStyles.caption),
                const SizedBox(height: 2),
                Text(
                  value,
                  style: AppTextStyles.bodyMedium.copyWith(
                    color: valueColor ?? AppColors.textPrimary,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
