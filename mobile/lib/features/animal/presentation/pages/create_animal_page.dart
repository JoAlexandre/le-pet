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

class CreateAnimalPage extends StatefulWidget {
  const CreateAnimalPage({super.key});

  @override
  State<CreateAnimalPage> createState() => _CreateAnimalPageState();
}

class _CreateAnimalPageState extends State<CreateAnimalPage> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _ageController = TextEditingController();
  final _weightController = TextEditingController();
  final _allergiesController = TextEditingController();
  final _clinicController = TextEditingController();
  final _doctorController = TextEditingController();
  final _phoneController = TextEditingController();

  AnimalSpecies? _selectedSpecies;
  String? _selectedBreed;
  AnimalGender? _selectedGender;
  DateTime? _birthDate;
  String? _selectedPhotoPath;

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
    if (_selectedSpecies == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Selecione a especie do pet.'),
          backgroundColor: AppColors.error,
        ),
      );
      return;
    }
    if (_selectedGender == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Selecione o sexo do pet.'),
          backgroundColor: AppColors.error,
        ),
      );
      return;
    }

    final provider = context.read<AnimalProvider>();
    final animal = Animal(
      tutorId: '',
      name: _nameController.text.trim(),
      species: _selectedSpecies!,
      breed: _selectedBreed,
      gender: _selectedGender!,
      birthDate: _birthDate,
      weight: _weightController.text.trim().isEmpty
          ? null
          : double.tryParse(_weightController.text.trim()),
      allergies: _allergiesController.text.trim().isEmpty
          ? null
          : _allergiesController.text.trim(),
      notes: _buildNotes(),
    );

    final success = await provider.createAnimal(animal);
    if (!mounted) return;

    if (success) {
      // Faz upload da foto se selecionada
      if (_selectedPhotoPath != null) {
        final animals = provider.animals;
        if (animals.isNotEmpty && animals.first.id != null) {
          await provider.uploadPhoto(animals.first.id!, _selectedPhotoPath!);
        }
      }
      Navigator.of(context).pop();
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Pet cadastrado com sucesso!'),
          backgroundColor: AppColors.success,
        ),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(provider.errorMessage ?? 'Erro ao cadastrar pet.'),
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

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
        elevation: 0,
        title: Text(
          'Perfil do Pet',
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
              _PhotoPicker(
                selectedPhotoPath: _selectedPhotoPath,
                onTap: isLoading ? null : _showImageSourceSheet,
              ),
              const SizedBox(height: 20),
              _buildNameField(isLoading),
              const SizedBox(height: 16),
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(child: _buildSpeciesDropdown(isLoading)),
                  const SizedBox(width: 12),
                  Expanded(child: _buildBreedField(isLoading)),
                ],
              ),
              const SizedBox(height: 16),
              _buildGenderSelector(isLoading),
              const SizedBox(height: 16),
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(child: _buildBirthDateField(isLoading)),
                  const SizedBox(width: 12),
                  Expanded(child: _buildAgeField(isLoading)),
                ],
              ),
              const SizedBox(height: 16),
              _buildWeightField(isLoading),
              const SizedBox(height: 16),
              _buildAllergiesField(isLoading),
              const SizedBox(height: 24),
              _VetSection(
                clinicController: _clinicController,
                doctorController: _doctorController,
                phoneController: _phoneController,
                enabled: !isLoading,
              ),
              const SizedBox(height: 32),
              _SaveButton(isLoading: isLoading, onPressed: _save),
              const SizedBox(height: 16),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildNameField(bool isLoading) {
    return _FormField(
      label: 'Nome do Pet',
      required: true,
      child: TextFormField(
        controller: _nameController,
        enabled: !isLoading,
        decoration: _inputDecoration('Digite o nome do pet'),
        validator: (v) =>
            v == null || v.trim().isEmpty ? 'Nome e obrigatorio' : null,
      ),
    );
  }

  Widget _buildSpeciesDropdown(bool isLoading) {
    return _FormField(
      label: 'Especie',
      required: true,
      child: DropdownButtonFormField<AnimalSpecies>(
        value: _selectedSpecies,
        isExpanded: true,
        decoration: _inputDecoration('Selecionar'),
        items: AnimalSpecies.values
            .map((s) => DropdownMenuItem(value: s, child: Text(s.displayName)))
            .toList(),
        onChanged: isLoading
            ? null
            : (v) => setState(() {
                _selectedSpecies = v;
                _selectedBreed = null;
              }),
        validator: (v) => v == null ? 'Obrigatorio' : null,
      ),
    );
  }

  Widget _buildBreedField(bool isLoading) {
    final breeds = _selectedSpecies != null
        ? (animalBreeds[_selectedSpecies] ?? [])
        : <String>[];
    return _FormField(
      label: 'Raca',
      child: DropdownButtonFormField<String>(
        value: _selectedBreed,
        isExpanded: true,
        decoration: _inputDecoration(
          _selectedSpecies == null
              ? 'Selecione a especie primeiro'
              : 'Selecionar',
        ),
        items: breeds
            .map((b) => DropdownMenuItem(value: b, child: Text(b)))
            .toList(),
        onChanged: isLoading || _selectedSpecies == null
            ? null
            : (v) => setState(() => _selectedBreed = v),
      ),
    );
  }

  Widget _buildGenderSelector(bool isLoading) {
    return _FormField(
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
                  : () => setState(() => _selectedGender = AnimalGender.male),
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
                  : () => setState(() => _selectedGender = AnimalGender.female),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBirthDateField(bool isLoading) {
    final dateFormat = DateFormat('dd/MM/yyyy');
    return _FormField(
      label: 'Data de Nascimento',
      child: TextFormField(
        controller: TextEditingController(
          text: _birthDate != null ? dateFormat.format(_birthDate!) : '',
        ),
        readOnly: true,
        enabled: !isLoading,
        decoration: _inputDecoration('dd/mm/aaaa').copyWith(
          suffixIcon: Icon(MdiIcons.calendar, color: AppColors.textSecondary),
        ),
        onTap: isLoading ? null : _selectBirthDate,
      ),
    );
  }

  Widget _buildAgeField(bool isLoading) {
    return _FormField(
      label: 'Idade (opicional)',
      child: TextFormField(
        controller: _ageController,
        enabled: !isLoading && _birthDate == null,
        decoration: _inputDecoration('ex. 2 anos'),
        onChanged: (_) {
          if (_birthDate != null) setState(() => _birthDate = null);
        },
      ),
    );
  }

  Widget _buildWeightField(bool isLoading) {
    return _FormField(
      label: 'Peso',
      child: TextFormField(
        controller: _weightController,
        enabled: !isLoading,
        keyboardType: const TextInputType.numberWithOptions(decimal: true),
        decoration: _inputDecoration('Digite o peso').copyWith(
          suffixText: 'kg',
          suffixStyle: AppTextStyles.bodyMedium.copyWith(
            color: AppColors.textSecondary,
          ),
        ),
        validator: (v) {
          if (v != null && v.isNotEmpty && double.tryParse(v) == null) {
            return 'Peso invalido';
          }
          return null;
        },
      ),
    );
  }

  Widget _buildAllergiesField(bool isLoading) {
    return _FormField(
      label: 'Alergias e Notas Medicas',
      child: TextFormField(
        controller: _allergiesController,
        enabled: !isLoading,
        maxLines: 4,
        decoration: _inputDecoration(
          'Alergias, condicoes medicas ou observacoes especiais...',
        ),
      ),
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

class _PhotoPicker extends StatelessWidget {
  final String? selectedPhotoPath;
  final VoidCallback? onTap;

  const _PhotoPicker({this.selectedPhotoPath, this.onTap});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.center,
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
                  border: Border.all(
                    color: AppColors.border,
                    style: BorderStyle.solid,
                    width: 2,
                  ),
                ),
                child: selectedPhotoPath != null
                    ? ClipRRect(
                        borderRadius: BorderRadius.circular(10),
                        child: Image.asset(
                          selectedPhotoPath!,
                          fit: BoxFit.cover,
                          errorBuilder: (_, __, ___) => Icon(
                            MdiIcons.camera,
                            color: AppColors.textHint,
                            size: 36,
                          ),
                        ),
                      )
                    : Icon(
                        MdiIcons.camera,
                        color: AppColors.textHint,
                        size: 36,
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
          Text(
            'Adicionar foto do pet',
            style: AppTextStyles.bodySmall.copyWith(color: AppColors.textHint),
          ),
          // const SizedBox(height: 8),
          // Row(
          //   mainAxisAlignment: MainAxisAlignment.center,
          //   children: [
          //     TextButton.icon(
          //       onPressed: onTap,
          //       icon: Icon(MdiIcons.camera, size: 16, color: AppColors.secondary),
          //       label: Text(
          //         'Camera',
          //         style: AppTextStyles.bodySmall.copyWith(
          //           color: AppColors.secondary,
          //         ),
          //       ),
          //       style: TextButton.styleFrom(
          //         padding: const EdgeInsets.symmetric(horizontal: 8),
          //       ),
          //     ),
          //     TextButton.icon(
          //       onPressed: onTap,
          //       icon: Icon(
          //         MdiIcons.imageMultiple,
          //         size: 16,
          //         color: AppColors.primary,
          //       ),
          //       label: Text(
          //         'Galeria',
          //         style: AppTextStyles.bodySmall.copyWith(
          //           color: AppColors.primary,
          //         ),
          //       ),
          //       style: TextButton.styleFrom(
          //         padding: const EdgeInsets.symmetric(horizontal: 8),
          //       ),
          //     ),
          //   ],
          // ),
        ],
      ),
    );
  }
}

class _VetSection extends StatelessWidget {
  final TextEditingController clinicController;
  final TextEditingController doctorController;
  final TextEditingController phoneController;
  final bool enabled;

  const _VetSection({
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
          _FormField(
            label: 'Nome da Clinica',
            child: TextFormField(
              controller: clinicController,
              enabled: enabled,
              decoration: _inputDecoration('Digite o nome da clinica'),
            ),
          ),
          const SizedBox(height: 12),
          _FormField(
            label: 'Nome do Medico',
            child: TextFormField(
              controller: doctorController,
              enabled: enabled,
              decoration: _inputDecoration('Digite o nome do medico'),
            ),
          ),
          const SizedBox(height: 12),
          _FormField(
            label: 'Telefone',
            child: TextFormField(
              controller: phoneController,
              enabled: enabled,
              keyboardType: TextInputType.phone,
              decoration: _inputDecoration('Digite o telefone'),
            ),
          ),
        ],
      ),
    );
  }
}

class _FormField extends StatelessWidget {
  final String label;
  final Widget child;
  final bool required;

  const _FormField({
    required this.label,
    required this.child,
    this.required = false,
  });

  @override
  Widget build(BuildContext context) {
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
}

class _SaveButton extends StatelessWidget {
  final bool isLoading;
  final VoidCallback onPressed;

  const _SaveButton({required this.isLoading, required this.onPressed});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      child: ElevatedButton(
        onPressed: isLoading ? null : onPressed,
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
            : Text('Salvar Perfil', style: AppTextStyles.button),
      ),
    );
  }
}
