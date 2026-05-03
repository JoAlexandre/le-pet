import 'package:flutter/material.dart';
import 'package:material_design_icons_flutter/material_design_icons_flutter.dart';
import 'package:provider/provider.dart';
import '../../../../../shared/constants/app_colors.dart';
import '../../../../../shared/constants/app_text_styles.dart';
import '../../domain/entities/company.dart';
import '../providers/company_provider.dart';

class EditCompanyPage extends StatefulWidget {
  final Company company;

  const EditCompanyPage({super.key, required this.company});

  @override
  State<EditCompanyPage> createState() => _EditCompanyPageState();
}

class _EditCompanyPageState extends State<EditCompanyPage> {
  final _formKey = GlobalKey<FormState>();
  late final TextEditingController _tradeNameController;
  late final TextEditingController _legalNameController;
  late final TextEditingController _cnpjController;
  late final TextEditingController _phoneController;
  late final TextEditingController _addressController;
  late final TextEditingController _cityController;
  late final TextEditingController _stateController;
  late final TextEditingController _descriptionController;

  @override
  void initState() {
    super.initState();
    _tradeNameController = TextEditingController(
      text: widget.company.tradeName,
    );
    _legalNameController = TextEditingController(
      text: widget.company.legalName ?? '',
    );
    _cnpjController = TextEditingController(text: widget.company.cnpj ?? '');
    _phoneController = TextEditingController(text: widget.company.phone);
    _addressController = TextEditingController(text: widget.company.address);
    _cityController = TextEditingController(text: widget.company.city);
    _stateController = TextEditingController(text: widget.company.state);
    _descriptionController = TextEditingController(
      text: widget.company.description ?? '',
    );
  }

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
    final updated = Company(
      id: widget.company.id,
      userId: widget.company.userId,
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
      state: _stateController.text.trim(),
      description: _descriptionController.text.trim().isEmpty
          ? null
          : _descriptionController.text.trim(),
      logoUrl: widget.company.logoUrl,
      isActive: widget.company.isActive,
      createdAt: widget.company.createdAt,
    );

    final success = await provider.updateCompany(updated);
    if (mounted) {
      if (success) {
        Navigator.of(context).pop(true);
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(provider.errorMessage ?? 'Erro ao salvar alteracoes'),
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
          'Editar Empresa',
          style: AppTextStyles.h4.copyWith(color: Colors.white),
        ),
        actions: [
          TextButton(
            onPressed: provider.isActionLoading ? null : _submit,
            child: Text(
              'Salvar',
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
              _buildField(
                controller: _tradeNameController,
                label: 'Nome Comercial',
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
                keyboardType: TextInputType.number,
              ),
              const SizedBox(height: 16),
              _buildField(
                controller: _phoneController,
                label: 'Telefone',
                icon: MdiIcons.phoneOutline,
                keyboardType: TextInputType.phone,
                validator: (v) =>
                    v == null || v.trim().isEmpty ? 'Campo obrigatorio' : null,
              ),
              const SizedBox(height: 16),
              _buildField(
                controller: _addressController,
                label: 'Endereco',
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
                      label: 'Cidade',
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
                      label: 'Estado',
                      icon: MdiIcons.mapMarkerOutline,
                      validator: (v) => v == null || v.trim().isEmpty
                          ? 'Campo obrigatorio'
                          : null,
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
              const SizedBox(height: 24),
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
                    : const Text('Salvar Alteracoes'),
              ),
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
  }) {
    return TextFormField(
      controller: controller,
      keyboardType: keyboardType,
      maxLines: maxLines,
      validator: validator,
      decoration: InputDecoration(
        labelText: label,
        prefixIcon: Icon(icon, color: AppColors.primary),
        filled: true,
        fillColor: AppColors.surface,
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
      ),
    );
  }
}
