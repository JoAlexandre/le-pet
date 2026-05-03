import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:intl/intl.dart';
import 'package:material_design_icons_flutter/material_design_icons_flutter.dart';
import 'package:provider/provider.dart';
import '../../../../../core/domain/enums/animal_gender.dart';
import '../../../../../core/domain/enums/animal_species.dart';
import '../../../../../shared/constants/animal_breeds.dart';
import '../../../../../shared/constants/app_colors.dart';
import '../../../../../shared/constants/app_text_styles.dart';
import '../../domain/entities/animal.dart';
import '../providers/animal_provider.dart';

class EditAnimalPage extends StatefulWidget {
  final Animal animal;

  const EditAnimalPage({super.key, required this.animal});

  @override
  State<EditAnimalPage> createState() => _EditAnimalPageState();
}

class _EditAnimalPageState extends State<EditAnimalPage> {
  final _formKey = GlobalKey<FormState>();
  late final TextEditingController _nameController;
  late final TextEditingController _ageController;
  late final TextEditingController _weightController;
  late final TextEditingController _allergiesController;
  late final TextEditingController _clinicController;
  late final TextEditingController _doctorController;
  late final TextEditingController _phoneController;

  late AnimalSpecies _selectedSpecies;
  late AnimalGender _selectedGender;
  String? _selectedBreed;
  DateTime? _birthDate;
  String? _selectedPhotoPath;

  @override
  void initState() {
    super.initState();
    final animal = widget.animal;
    _nameController = TextEditingController(text: animal.name);
    _ageController = TextEditingController();
    _weightController = TextEditingController(
      text: animal.weight != null ? animal.weight!.toString() : '',
    );
    _allergiesController = TextEditingController(text: animal.allergies ?? '');
    _selectedSpecies = animal.species;
    _selectedGender = animal.gender;
    _selectedBreed = animal.breed;
    _birthDate = animal.birthDate;

    // Parse vet info from notes
    final vetInfo = _parseVetInfo(animal.notes ?? '');
    _clinicController = TextEditingController(text: vetInfo['clinic'] ?? '');
    _doctorController = TextEditingController(text: vetInfo['doctor'] ?? '');
    _phoneController = TextEditingController(text: vetInfo['phone'] ?? '');
  }

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
  void dispose() {
    _nameController.dispose();
    _ageController.dispose();
    _weightController.dispose();
    _allergiesController.dispose();
    _clinicController.dispose();
    _doctorController.dispose();
    _phoneController.dispose();
    super.dispose();
  }

  Future<void> _pickImage(ImageSource source) async {
    Navigator.of(context).pop();
    final picker = ImagePicker();
    final picked = await picker.pickImage(
      source: source,
      maxWidth: 800,
      maxHeight: 800,
      imageQuality: 80,
    );
    if (picked != null) {
      setState(() => _selectedPhotoPath = picked.path);
    }
  }

  void _showImageSourceSheet() {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
      ),
      builder: (ctx) => SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 8),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              ListTile(
                leading: Icon(MdiIcons.camera, color: AppColors.primary),
                title: const Text('Camera'),
                onTap: () => _pickImage(ImageSource.camera),
              ),
              ListTile(
                leading: Icon(MdiIcons.imageMultiple, color: AppColors.primary),
                title: const Text('Galeria'),
                onTap: () => _pickImage(ImageSource.gallery),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Future<void> _selectBirthDate() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: _birthDate ?? DateTime.now(),
      firstDate: DateTime(2000),
      lastDate: DateTime.now(),
      builder: (ctx, child) => Theme(
        data: Theme.of(ctx).copyWith(
          colorScheme: const ColorScheme.light(primary: AppColors.primary),
        ),
        child: child!,
      ),
    );
    if (picked != null) {
      setState(() {
        _birthDate = picked;
        _ageController.clear();
      });
    }
  }

  String? _buildNotes() {
    final parts = <String>[];
    if (_clinicController.text.trim().isNotEmpty) {
      parts.add('Clinica: ${_clinicController.text.trim()}');
    }
    if (_doctorController.text.trim().isNotEmpty) {
      parts.add('Veterinario: ${_doctorController.text.trim()}');
    }
    if (_phoneController.text.trim().isNotEmpty) {
      parts.add('Telefone: ${_phoneController.text.trim()}');
    }
    return parts.isEmpty ? null : parts.join('\n');
  }

  Future<void> _save() async {
    if (!_formKey.currentState!.validate()) return;

    final provider = context.read<AnimalProvider>();
    final updated = Animal(
      id: widget.animal.id,
      tutorId: widget.animal.tutorId,
      name: _nameController.text.trim(),
      species: _selectedSpecies,
      breed: _selectedBreed,
      gender: _selectedGender,
      birthDate: _birthDate,
      weight: _weightController.text.trim().isEmpty
          ? null
          : double.tryParse(_weightController.text.trim()),
      allergies: _allergiesController.text.trim().isEmpty
          ? null
          : _allergiesController.text.trim(),
      notes: _buildNotes(),
      photoUrl: widget.animal.photoUrl,
      isActive: widget.animal.isActive,
    );

    bool success = await provider.updateAnimal(updated);
    if (!mounted) return;

    if (success && _selectedPhotoPath != null && widget.animal.id != null) {
      success = await provider.uploadPhoto(
        widget.animal.id!,
        _selectedPhotoPath!,
      );
      if (!mounted) return;
    }

    if (success) {
      Navigator.of(context).pop();
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Pet atualizado com sucesso!'),
          backgroundColor: AppColors.success,
        ),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(provider.errorMessage ?? 'Erro ao atualizar pet.'),
          backgroundColor: AppColors.error,
        ),
      );
      provider.resetStatus();
    }
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<AnimalProvider>();
    final isLoading = provider.isActionLoading;
    final dateFormat = DateFormat('dd/MM/yyyy');

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
        elevation: 0,
        title: Text(
          'Editar Pet',
          style: AppTextStyles.h4.copyWith(color: Colors.white),
        ),
        leading: IconButton(
          icon: Icon(MdiIcons.arrowLeft),
          onPressed: isLoading ? null : () => Navigator.of(context).pop(),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _PhotoPickerEdit(
                currentPhotoUrl: widget.animal.photoUrl,
                selectedPhotoPath: _selectedPhotoPath,
                onTap: isLoading ? null : _showImageSourceSheet,
              ),
              const SizedBox(height: 20),
              _buildField(
                label: 'Nome do Pet',
                required: true,
                child: TextFormField(
                  controller: _nameController,
                  enabled: !isLoading,
                  decoration: _inputDecoration('Digite o nome do pet'),
                  validator: (v) => v == null || v.trim().isEmpty
                      ? 'Nome e obrigatorio'
                      : null,
                ),
              ),
              const SizedBox(height: 16),
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(
                    child: _buildField(
                      label: 'Especie',
                      required: true,
                      child: DropdownButtonFormField<AnimalSpecies>(
                        value: _selectedSpecies,
                        isExpanded: true,
                        decoration: _inputDecoration('Selecionar'),
                        items: AnimalSpecies.values
                            .map(
                              (s) => DropdownMenuItem(
                                value: s,
                                child: Text(s.displayName),
                              ),
                            )
                            .toList(),
                        onChanged: isLoading
                            ? null
                            : (v) => setState(() {
                                _selectedSpecies = v!;
                                final breeds = animalBreeds[v] ?? [];
                                if (_selectedBreed != null &&
                                    !breeds.contains(_selectedBreed)) {
                                  _selectedBreed = null;
                                }
                              }),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildField(
                      label: 'Raca',
                      child: DropdownButtonFormField<String>(
                        value: _selectedBreed,
                        isExpanded: true,
                        decoration: _inputDecoration('Selecionar'),
                        items: (animalBreeds[_selectedSpecies] ?? [])
                            .map(
                              (b) => DropdownMenuItem(value: b, child: Text(b)),
                            )
                            .toList(),
                        onChanged: isLoading
                            ? null
                            : (v) => setState(() => _selectedBreed = v),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              _buildField(
                label: 'Sexo',
                required: true,
                child: Row(
                  children: [
                    Expanded(
                      child: _GenderOption(
                        label: 'Macho',
                        icon: MdiIcons.genderMale,
                        selected: _selectedGender == AnimalGender.male,
                        onTap: isLoading
                            ? null
                            : () => setState(
                                () => _selectedGender = AnimalGender.male,
                              ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: _GenderOption(
                        label: 'Femea',
                        icon: MdiIcons.genderFemale,
                        selected: _selectedGender == AnimalGender.female,
                        onTap: isLoading
                            ? null
                            : () => setState(
                                () => _selectedGender = AnimalGender.female,
                              ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(
                    child: _buildField(
                      label: 'Data de Nascimento',
                      child: TextFormField(
                        controller: TextEditingController(
                          text: _birthDate != null
                              ? dateFormat.format(_birthDate!)
                              : '',
                        ),
                        readOnly: true,
                        enabled: !isLoading,
                        decoration: _inputDecoration('dd/mm/aaaa').copyWith(
                          suffixIcon: Icon(
                            MdiIcons.calendar,
                            color: AppColors.textSecondary,
                          ),
                        ),
                        onTap: isLoading ? null : _selectBirthDate,
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildField(
                      label: 'Idade (opicional)',
                      child: TextFormField(
                        controller: _ageController,
                        enabled: !isLoading && _birthDate == null,
                        decoration: _inputDecoration('ex. 2 anos'),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              _buildField(
                label: 'Peso',
                child: TextFormField(
                  controller: _weightController,
                  enabled: !isLoading,
                  keyboardType: const TextInputType.numberWithOptions(
                    decimal: true,
                  ),
                  decoration: _inputDecoration('Digite o peso').copyWith(
                    suffixText: 'kg',
                    suffixStyle: AppTextStyles.bodyMedium.copyWith(
                      color: AppColors.textSecondary,
                    ),
                  ),
                  validator: (v) {
                    if (v != null &&
                        v.isNotEmpty &&
                        double.tryParse(v) == null) {
                      return 'Peso invalido';
                    }
                    return null;
                  },
                ),
              ),
              const SizedBox(height: 16),
              _buildField(
                label: 'Alergias e Notas Medicas',
                child: TextFormField(
                  controller: _allergiesController,
                  enabled: !isLoading,
                  maxLines: 4,
                  decoration: _inputDecoration(
                    'Alergias, condicoes medicas ou observacoes especiais...',
                  ),
                ),
              ),
              const SizedBox(height: 24),
              _VetSectionEdit(
                clinicController: _clinicController,
                doctorController: _doctorController,
                phoneController: _phoneController,
                enabled: !isLoading,
              ),
              const SizedBox(height: 32),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: isLoading ? null : _save,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14),
                    ),
                    disabledBackgroundColor: AppColors.primaryLight,
                  ),
                  child: isLoading
                      ? const SizedBox(
                          height: 20,
                          width: 20,
                          child: CircularProgressIndicator(
                            color: Colors.white,
                            strokeWidth: 2,
                          ),
                        )
                      : Text('Salvar Alteracoes', style: AppTextStyles.button),
                ),
              ),
              const SizedBox(height: 16),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildField({
    required String label,
    required Widget child,
    bool required = false,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        RichText(
          text: TextSpan(
            text: label,
            style: AppTextStyles.labelLarge,
            children: required
                ? [
                    const TextSpan(
                      text: '*',
                      style: TextStyle(color: AppColors.error),
                    ),
                  ]
                : null,
          ),
        ),
        const SizedBox(height: 6),
        child,
      ],
    );
  }

  InputDecoration _inputDecoration(String hint) {
    return InputDecoration(
      hintText: hint,
      hintStyle: AppTextStyles.bodyMedium.copyWith(color: AppColors.textHint),
      contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(10),
        borderSide: const BorderSide(color: AppColors.border),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(10),
        borderSide: const BorderSide(color: AppColors.border),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(10),
        borderSide: const BorderSide(color: AppColors.primary, width: 1.5),
      ),
      errorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(10),
        borderSide: const BorderSide(color: AppColors.error),
      ),
      focusedErrorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(10),
        borderSide: const BorderSide(color: AppColors.error),
      ),
      filled: true,
      fillColor: AppColors.surface,
    );
  }
}

class _GenderOption extends StatelessWidget {
  final String label;
  final IconData icon;
  final bool selected;
  final VoidCallback? onTap;

  const _GenderOption({
    required this.label,
    required this.icon,
    required this.selected,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 8),
        decoration: BoxDecoration(
          color: selected
              ? AppColors.primary.withOpacity(0.1)
              : AppColors.surface,
          border: Border.all(
            color: selected ? AppColors.primary : AppColors.border,
            width: selected ? 1.5 : 1,
          ),
          borderRadius: BorderRadius.circular(10),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.radio_button_checked,
              size: 18,
              color: selected ? AppColors.primary : AppColors.border,
            ),
            const SizedBox(width: 6),
            Text(
              label,
              style: AppTextStyles.bodyMedium.copyWith(
                color: selected ? AppColors.primary : AppColors.textSecondary,
                fontWeight: selected ? FontWeight.w600 : FontWeight.normal,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _PhotoPickerEdit extends StatelessWidget {
  final String? currentPhotoUrl;
  final String? selectedPhotoPath;
  final VoidCallback? onTap;

  const _PhotoPickerEdit({
    this.currentPhotoUrl,
    this.selectedPhotoPath,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Stack(
          alignment: Alignment.bottomRight,
          children: [
            Container(
              width: 120,
              height: 90,
              decoration: BoxDecoration(
                color: AppColors.surfaceVariant,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppColors.border, width: 2),
              ),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(10),
                child: selectedPhotoPath != null
                    ? Image.asset(
                        selectedPhotoPath!,
                        fit: BoxFit.cover,
                        errorBuilder: (_, __, ___) => Icon(
                          MdiIcons.camera,
                          color: AppColors.textHint,
                          size: 36,
                        ),
                      )
                    : currentPhotoUrl != null
                    ? Image.network(
                        currentPhotoUrl!,
                        fit: BoxFit.cover,
                        errorBuilder: (_, __, ___) => Icon(
                          MdiIcons.camera,
                          color: AppColors.textHint,
                          size: 36,
                        ),
                      )
                    : Icon(
                        MdiIcons.camera,
                        color: AppColors.textHint,
                        size: 36,
                      ),
              ),
            ),
            GestureDetector(
              onTap: onTap,
              child: Container(
                decoration: const BoxDecoration(
                  color: AppColors.primary,
                  shape: BoxShape.circle,
                ),
                padding: const EdgeInsets.all(6),
                child: const Icon(Icons.add, color: Colors.white, size: 16),
              ),
            ),
          ],
        ),
        const SizedBox(height: 8),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            TextButton.icon(
              onPressed: onTap,
              icon: Icon(MdiIcons.camera, size: 16, color: AppColors.secondary),
              label: Text(
                'Camera',
                style: AppTextStyles.bodySmall.copyWith(
                  color: AppColors.secondary,
                ),
              ),
              style: TextButton.styleFrom(
                padding: const EdgeInsets.symmetric(horizontal: 8),
              ),
            ),
            TextButton.icon(
              onPressed: onTap,
              icon: Icon(
                MdiIcons.imageMultiple,
                size: 16,
                color: AppColors.primary,
              ),
              label: Text(
                'Galeria',
                style: AppTextStyles.bodySmall.copyWith(
                  color: AppColors.primary,
                ),
              ),
              style: TextButton.styleFrom(
                padding: const EdgeInsets.symmetric(horizontal: 8),
              ),
            ),
          ],
        ),
      ],
    );
  }
}

class _VetSectionEdit extends StatelessWidget {
  final TextEditingController clinicController;
  final TextEditingController doctorController;
  final TextEditingController phoneController;
  final bool enabled;

  const _VetSectionEdit({
    required this.clinicController,
    required this.doctorController,
    required this.phoneController,
    required this.enabled,
  });

  InputDecoration _inputDecoration(String hint) {
    return InputDecoration(
      hintText: hint,
      hintStyle: AppTextStyles.bodyMedium.copyWith(color: AppColors.textHint),
      contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(10),
        borderSide: const BorderSide(color: AppColors.border),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(10),
        borderSide: const BorderSide(color: AppColors.border),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(10),
        borderSide: const BorderSide(color: AppColors.primary, width: 1.5),
      ),
      filled: true,
      fillColor: AppColors.surface,
    );
  }

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
          Row(
            children: [
              Icon(MdiIcons.doctor, size: 20, color: AppColors.primary),
              const SizedBox(width: 8),
              Text('Veterinario Principal', style: AppTextStyles.h4),
            ],
          ),
          const SizedBox(height: 14),
          _FieldLabel(label: 'Nome da Clinica'),
          const SizedBox(height: 6),
          TextFormField(
            controller: clinicController,
            enabled: enabled,
            decoration: _inputDecoration('Digite o nome da clinica'),
          ),
          const SizedBox(height: 12),
          _FieldLabel(label: 'Nome do Medico'),
          const SizedBox(height: 6),
          TextFormField(
            controller: doctorController,
            enabled: enabled,
            decoration: _inputDecoration('Digite o nome do medico'),
          ),
          const SizedBox(height: 12),
          _FieldLabel(label: 'Telefone'),
          const SizedBox(height: 6),
          TextFormField(
            controller: phoneController,
            enabled: enabled,
            keyboardType: TextInputType.phone,
            decoration: _inputDecoration('Digite o telefone'),
          ),
        ],
      ),
    );
  }
}

class _FieldLabel extends StatelessWidget {
  final String label;

  const _FieldLabel({required this.label});

  @override
  Widget build(BuildContext context) {
    return Text(label, style: AppTextStyles.labelLarge);
  }
}
