import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:material_design_icons_flutter/material_design_icons_flutter.dart';
import 'package:provider/provider.dart';
import '../../../../../shared/constants/app_colors.dart';
import '../../../../../shared/constants/app_text_styles.dart';
import '../../../../../shared/widgets/pet_loading_overlay.dart';
import '../../../../../features/animal/domain/entities/animal.dart';
import '../../../../../features/auth/presentation/providers/auth_provider.dart';
import '../../domain/entities/vaccine_record.dart';
import '../providers/vaccine_provider.dart';

class RegisterVaccinePage extends StatefulWidget {
  final Animal animal;

  const RegisterVaccinePage({super.key, required this.animal});

  @override
  State<RegisterVaccinePage> createState() => _RegisterVaccinePageState();
}

class _RegisterVaccinePageState extends State<RegisterVaccinePage> {
  final _formKey = GlobalKey<FormState>();
  final _vaccineNameController = TextEditingController();
  final _manufacturerController = TextEditingController();
  final _batchNumberController = TextEditingController();
  final _notesController = TextEditingController();

  DateTime _applicationDate = DateTime.now();
  DateTime? _nextDoseDate;
  final _dateFormat = DateFormat('dd/MM/yyyy');

  @override
  void dispose() {
    _vaccineNameController.dispose();
    _manufacturerController.dispose();
    _batchNumberController.dispose();
    _notesController.dispose();
    super.dispose();
  }

  Future<void> _pickApplicationDate() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: _applicationDate,
      firstDate: DateTime(2000),
      lastDate: DateTime.now(),
      builder: (context, child) => Theme(
        data: Theme.of(context).copyWith(
          colorScheme: const ColorScheme.light(primary: AppColors.primary),
        ),
        child: child!,
      ),
    );
    if (picked != null) {
      setState(() => _applicationDate = picked);
    }
  }

  Future<void> _pickNextDoseDate() async {
    final picked = await showDatePicker(
      context: context,
      initialDate:
          _nextDoseDate ?? DateTime.now().add(const Duration(days: 365)),
      firstDate: DateTime.now(),
      lastDate: DateTime(2100),
      builder: (context, child) => Theme(
        data: Theme.of(context).copyWith(
          colorScheme: const ColorScheme.light(primary: AppColors.primary),
        ),
        child: child!,
      ),
    );
    if (picked != null) {
      setState(() => _nextDoseDate = picked);
    }
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;

    final authProvider = context.read<AuthProvider>();
    final provider = context.read<VaccineProvider>();

    final record = VaccineRecord(
      animalId: widget.animal.id!,
      professionalId: authProvider.user?.id,
      vaccineName: _vaccineNameController.text.trim(),
      vaccineManufacturer: _manufacturerController.text.trim().isNotEmpty
          ? _manufacturerController.text.trim()
          : null,
      batchNumber: _batchNumberController.text.trim().isNotEmpty
          ? _batchNumberController.text.trim()
          : null,
      applicationDate: _applicationDate,
      nextDoseDate: _nextDoseDate,
      notes: _notesController.text.trim().isNotEmpty
          ? _notesController.text.trim()
          : null,
    );

    PetLoadingOverlay.show(context, message: 'Registrando vacina...');
    final success = await provider.registerVaccine(record);
    if (!mounted) return;
    PetLoadingOverlay.hide(context);
    if (success) {
      Navigator.of(context).pop(true);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Vacina registrada com sucesso.'),
          backgroundColor: AppColors.success,
        ),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(provider.errorMessage ?? 'Erro ao registrar vacina.'),
          backgroundColor: AppColors.error,
        ),
      );
      provider.resetStatus();
    }
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<VaccineProvider>();

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
        elevation: 0,
        title: Text(
          'Registrar Vacina',
          style: AppTextStyles.h4.copyWith(color: Colors.white),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Animal info header
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
                      width: 40,
                      height: 40,
                      decoration: BoxDecoration(
                        color: AppColors.primary.withValues(alpha: 0.12),
                        shape: BoxShape.circle,
                      ),
                      child: Icon(
                        MdiIcons.paw,
                        color: AppColors.primary,
                        size: 20,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Text(widget.animal.name, style: AppTextStyles.labelLarge),
                  ],
                ),
              ),
              const SizedBox(height: 20),
              Text('Dados da Vacina', style: AppTextStyles.h4),
              const SizedBox(height: 12),
              // Vaccine name
              TextFormField(
                controller: _vaccineNameController,
                decoration: InputDecoration(
                  labelText: 'Nome da Vacina *',
                  prefixIcon: Icon(MdiIcons.needle, color: AppColors.primary),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(10),
                    borderSide: const BorderSide(color: AppColors.primary),
                  ),
                ),
                validator: (value) {
                  if (value == null || value.trim().isEmpty) {
                    return 'Informe o nome da vacina';
                  }
                  return null;
                },
                textCapitalization: TextCapitalization.words,
              ),
              const SizedBox(height: 12),
              // Manufacturer
              TextFormField(
                controller: _manufacturerController,
                decoration: InputDecoration(
                  labelText: 'Fabricante',
                  prefixIcon: Icon(
                    MdiIcons.factoryIcon,
                    color: AppColors.primary,
                  ),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(10),
                    borderSide: const BorderSide(color: AppColors.primary),
                  ),
                ),
                textCapitalization: TextCapitalization.words,
              ),
              const SizedBox(height: 12),
              // Batch number
              TextFormField(
                controller: _batchNumberController,
                decoration: InputDecoration(
                  labelText: 'Numero do Lote',
                  prefixIcon: Icon(MdiIcons.barcode, color: AppColors.primary),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(10),
                    borderSide: const BorderSide(color: AppColors.primary),
                  ),
                ),
                textCapitalization: TextCapitalization.characters,
              ),
              const SizedBox(height: 16),
              Text('Datas', style: AppTextStyles.h4),
              const SizedBox(height: 12),
              // Application date
              InkWell(
                onTap: _pickApplicationDate,
                child: Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 12,
                    vertical: 16,
                  ),
                  decoration: BoxDecoration(
                    border: Border.all(color: AppColors.border),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Row(
                    children: [
                      Icon(
                        MdiIcons.calendarCheck,
                        color: AppColors.primary,
                        size: 20,
                      ),
                      const SizedBox(width: 12),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Data de Aplicacao *',
                            style: AppTextStyles.caption,
                          ),
                          Text(
                            _dateFormat.format(_applicationDate),
                            style: AppTextStyles.bodyMedium.copyWith(
                              color: AppColors.textPrimary,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 12),
              // Next dose date
              InkWell(
                onTap: _pickNextDoseDate,
                child: Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 12,
                    vertical: 16,
                  ),
                  decoration: BoxDecoration(
                    border: Border.all(color: AppColors.border),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Row(
                    children: [
                      Icon(
                        MdiIcons.calendarArrowRight,
                        color: AppColors.primary,
                        size: 20,
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Proxima Dose (opcional)',
                              style: AppTextStyles.caption,
                            ),
                            Text(
                              _nextDoseDate != null
                                  ? _dateFormat.format(_nextDoseDate!)
                                  : 'Selecionar data',
                              style: AppTextStyles.bodyMedium.copyWith(
                                color: _nextDoseDate != null
                                    ? AppColors.textPrimary
                                    : AppColors.textHint,
                              ),
                            ),
                          ],
                        ),
                      ),
                      if (_nextDoseDate != null)
                        GestureDetector(
                          onTap: () => setState(() => _nextDoseDate = null),
                          child: Icon(
                            MdiIcons.closeCircleOutline,
                            color: AppColors.textHint,
                            size: 18,
                          ),
                        ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16),
              // Notes
              TextFormField(
                controller: _notesController,
                maxLines: 3,
                decoration: InputDecoration(
                  labelText: 'Observacoes',
                  alignLabelWithHint: true,
                  prefixIcon: Padding(
                    padding: const EdgeInsets.only(bottom: 48),
                    child: Icon(
                      MdiIcons.noteTextOutline,
                      color: AppColors.primary,
                    ),
                  ),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(10),
                    borderSide: const BorderSide(color: AppColors.primary),
                  ),
                ),
                textCapitalization: TextCapitalization.sentences,
              ),
              const SizedBox(height: 24),
              SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton(
                  onPressed: provider.isActionLoading ? null : _submit,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  child: Text('Registrar Vacina', style: AppTextStyles.button),
                ),
              ),
              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }
}
