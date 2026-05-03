import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:material_design_icons_flutter/material_design_icons_flutter.dart';
import 'package:mobile/shared/utils/mask_formatters.dart';
import 'package:provider/provider.dart';
import '../../../../../shared/constants/app_colors.dart';
import '../../../../../shared/constants/app_text_styles.dart';
import '../../../../../features/auth/presentation/providers/auth_provider.dart';
import '../../domain/entities/company.dart';
import '../providers/company_provider.dart';

class CreateCompanyPage extends StatefulWidget {
  const CreateCompanyPage({super.key});

  @override
  State<CreateCompanyPage> createState() => _CreateCompanyPageState();
}

class _CreateCompanyPageState extends State<CreateCompanyPage> {
  final _formKey = GlobalKey<FormState>();
  final _tradeNameController = TextEditingController();
  final _legalNameController = TextEditingController();
  final _cnpjController = TextEditingController();
  final _phoneController = TextEditingController();
  final _addressController = TextEditingController();
  final _cityController = TextEditingController();
  final _stateController = TextEditingController();
  final _descriptionController = TextEditingController();

  @override
  void dispose() {
    _tradeNameController.dispose();
    _legalNameController.dispose();
    _cnpjController.dispose();
    _phoneController.dispose();
    _addressController.dispose();
    _cityController.dispose();
    _stateController.dispose();
    _descriptionController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;

    final provider = context.read<CompanyProvider>();
    final user = context.read<AuthProvider>().user;

    final company = Company(
      id: '',
      userId: user?.id ?? '',
      tradeName: _tradeNameController.text.trim(),
      legalName: _legalNameController.text.trim().isEmpty
          ? null
          : _legalNameController.text.trim(),
      cnpj: _cnpjController.text.trim().isEmpty
          ? null
          : _cnpjController.text.trim(),
      phone: _phoneController.text.trim(),
      address: _addressController.text.trim(),
      city: _cityController.text.trim(),
      state: _stateController.text.trim().toUpperCase(),
      description: _descriptionController.text.trim().isEmpty
          ? null
          : _descriptionController.text.trim(),
    );

    final success = await provider.createCompany(company);
    if (mounted) {
      if (success) {
        Navigator.of(context).pop(true);
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(provider.errorMessage ?? 'Erro ao criar empresa'),
            backgroundColor: AppColors.error,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<CompanyProvider>();

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
        elevation: 0,
        title: Text(
          'Criar Empresa',
          style: AppTextStyles.h4.copyWith(color: Colors.white),
        ),
        actions: [
          TextButton(
            onPressed: provider.isActionLoading ? null : _submit,
            child: Text(
              'Criar',
              style: AppTextStyles.labelLarge.copyWith(color: Colors.white),
            ),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppColors.primary.withValues(alpha: 0.08),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: AppColors.primary.withValues(alpha: 0.3),
                  ),
                ),
                child: Row(
                  children: [
                    Icon(
                      MdiIcons.informationOutline,
                      color: AppColors.primary,
                      size: 20,
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Text(
                        'Preencha os dados da sua empresa. Voce podera editar essas informacoes depois.',
                        style: AppTextStyles.bodySmall.copyWith(
                          color: AppColors.primary,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),
              _buildField(
                controller: _tradeNameController,
                label: 'Nome Comercial *',
                icon: MdiIcons.domain,
                validator: (v) =>
                    v == null || v.trim().isEmpty ? 'Campo obrigatorio' : null,
              ),
              const SizedBox(height: 16),
              _buildField(
                controller: _legalNameController,
                label: 'Razao Social',
                icon: MdiIcons.fileDocumentOutline,
              ),
              const SizedBox(height: 16),
              _buildField(
                controller: _cnpjController,
                label: 'CNPJ',
                icon: MdiIcons.cardAccountDetailsOutline,
                formatters: [MaskFormatters.cnpj],
                keyboardType: TextInputType.number,
              ),
              const SizedBox(height: 16),
              _buildField(
                controller: _phoneController,
                label: 'Telefone *',
                icon: MdiIcons.phoneOutline,
                keyboardType: TextInputType.phone,
                formatters: [MaskFormatters.phone],
                validator: (v) =>
                    v == null || v.trim().isEmpty ? 'Campo obrigatorio' : null,
              ),
              const SizedBox(height: 16),
              _buildField(
                controller: _addressController,
                label: 'Endereco *',
                icon: MdiIcons.mapOutline,
                validator: (v) =>
                    v == null || v.trim().isEmpty ? 'Campo obrigatorio' : null,
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(
                    flex: 2,
                    child: _buildField(
                      controller: _cityController,
                      label: 'Cidade *',
                      icon: MdiIcons.city,
                      validator: (v) => v == null || v.trim().isEmpty
                          ? 'Campo obrigatorio'
                          : null,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildField(
                      controller: _stateController,
                      label: 'UF *',
                      icon: MdiIcons.mapMarkerOutline,
                      maxLength: 2,
                      validator: (v) {
                        if (v == null || v.trim().isEmpty) {
                          return 'Obrigatorio';
                        }
                        if (v.trim().length != 2) return '2 letras';
                        return null;
                      },
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              _buildField(
                controller: _descriptionController,
                label: 'Descricao',
                icon: MdiIcons.informationOutline,
                maxLines: 4,
              ),
              const SizedBox(height: 28),
              ElevatedButton(
                onPressed: provider.isActionLoading ? null : _submit,
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                child: provider.isActionLoading
                    ? const SizedBox(
                        height: 20,
                        width: 20,
                        child: CircularProgressIndicator(
                          color: Colors.white,
                          strokeWidth: 2,
                        ),
                      )
                    : const Text('Criar Empresa'),
              ),
              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildField({
    required TextEditingController controller,
    required String label,
    required IconData icon,
    TextInputType keyboardType = TextInputType.text,
    String? Function(String?)? validator,
    int maxLines = 1,
    int? maxLength,
    List<TextInputFormatter>? formatters,
  }) {
    return TextFormField(
      controller: controller,
      keyboardType: keyboardType,
      maxLines: maxLines,
      maxLength: maxLength,
      inputFormatters: formatters,
      validator: validator,
      decoration: InputDecoration(
        labelText: label,
        prefixIcon: Icon(icon, color: AppColors.primary),
        filled: true,
        fillColor: AppColors.surface,
        counterText: '',
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.border),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.border),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.primary, width: 2),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.error),
        ),
      ),
    );
  }
}
