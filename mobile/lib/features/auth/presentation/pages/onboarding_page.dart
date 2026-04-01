import 'package:flutter/material.dart';
import 'package:material_design_icons_flutter/material_design_icons_flutter.dart';
import 'package:provider/provider.dart';
import '../../../../core/domain/enums/specialty_type.dart';
import '../../../../core/domain/enums/user_role.dart';
import '../../../../core/presentation/routes/app_routes.dart';
import '../../../../shared/constants/app_colors.dart';
import '../../../../shared/constants/app_text_styles.dart';
import '../providers/auth_provider.dart';

class OnboardingPage extends StatefulWidget {
  const OnboardingPage({super.key});

  @override
  State<OnboardingPage> createState() => _OnboardingPageState();
}

class _OnboardingPageState extends State<OnboardingPage> {
  final _pageController = PageController();
  int _currentStep = 0;

  // Dados do onboarding
  UserRole? _selectedRole;
  SpecialtyType? _selectedSpecialty;
  final _crmvNumberController = TextEditingController();
  final _crmvStateController = TextEditingController();
  final _phoneController = TextEditingController();

  int get _totalSteps {
    if (_selectedRole == null) return 1;
    if (_selectedRole == UserRole.professional) {
      if (_selectedSpecialty == SpecialtyType.veterinarian) return 4;
      return 3;
    }
    return 2;
  }

  @override
  void dispose() {
    _pageController.dispose();
    _crmvNumberController.dispose();
    _crmvStateController.dispose();
    _phoneController.dispose();
    super.dispose();
  }

  void _nextStep() {
    if (_currentStep < _totalSteps - 1) {
      setState(() => _currentStep++);
      _pageController.animateToPage(
        _currentStep,
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
      );
    } else {
      _submitOnboarding();
    }
  }

  void _previousStep() {
    if (_currentStep > 0) {
      setState(() => _currentStep--);
      _pageController.animateToPage(
        _currentStep,
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
      );
    }
  }

  Future<void> _submitOnboarding() async {
    final authProvider = context.read<AuthProvider>();

    final success = await authProvider.updateOnboarding(
      role: _selectedRole!.toApiString(),
      specialtyType: _selectedSpecialty?.toApiString(),
      crmvNumber: _crmvNumberController.text.isNotEmpty
          ? _crmvNumberController.text.trim()
          : null,
      crmvState: _crmvStateController.text.isNotEmpty
          ? _crmvStateController.text.trim().toUpperCase()
          : null,
      phone: _phoneController.text.isNotEmpty
          ? _phoneController.text.trim()
          : null,
    );

    if (!mounted) return;

    if (success) {
      Navigator.of(context).pushReplacementNamed(AppRoutes.home);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: _currentStep > 0
            ? IconButton(
                icon: Icon(MdiIcons.arrowLeft, color: AppColors.textPrimary),
                onPressed: _previousStep,
              )
            : null,
        title: const Text('Configurar perfil', style: AppTextStyles.h4),
        centerTitle: true,
      ),
      body: Consumer<AuthProvider>(
        builder: (context, authProvider, _) {
          return Column(
            children: [
              _buildProgressIndicator(),
              Expanded(
                child: PageView(
                  controller: _pageController,
                  physics: const NeverScrollableScrollPhysics(),
                  children: _buildSteps(),
                ),
              ),
              _buildBottomBar(authProvider),
              if (authProvider.errorMessage != null)
                _buildErrorBar(authProvider.errorMessage!),
            ],
          );
        },
      ),
    );
  }

  Widget _buildProgressIndicator() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
      child: Row(
        children: List.generate(_totalSteps, (index) {
          return Expanded(
            child: Container(
              height: 4,
              margin: const EdgeInsets.symmetric(horizontal: 2),
              decoration: BoxDecoration(
                color: index <= _currentStep
                    ? AppColors.primary
                    : AppColors.border,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          );
        }),
      ),
    );
  }

  List<Widget> _buildSteps() {
    final steps = <Widget>[_buildRoleStep()];

    if (_selectedRole == UserRole.professional) {
      steps.add(_buildSpecialtyStep());
      if (_selectedSpecialty == SpecialtyType.veterinarian) {
        steps.add(_buildCrmvStep());
      }
    }

    steps.add(_buildPhoneStep());
    return steps;
  }

  Widget _buildRoleStep() {
    return _StepContent(
      title: 'Qual e o seu perfil?',
      subtitle: 'Selecione como voce vai usar o LePet',
      child: Column(
        children: [
          _RoleOption(
            icon: MdiIcons.accountOutline,
            title: 'Tutor',
            description: 'Cuido dos meus pets',
            isSelected: _selectedRole == UserRole.tutor,
            onTap: () => setState(() => _selectedRole = UserRole.tutor),
          ),
          const SizedBox(height: 12),
          _RoleOption(
            icon: MdiIcons.medicalBag,
            title: 'Profissional',
            description: 'Veterinario, tosador, banhista...',
            isSelected: _selectedRole == UserRole.professional,
            onTap: () => setState(() {
              _selectedRole = UserRole.professional;
              _selectedSpecialty = null;
            }),
          ),
          const SizedBox(height: 12),
          _RoleOption(
            icon: MdiIcons.domain,
            title: 'Empresa',
            description: 'Petshop, clinica, hotel...',
            isSelected: _selectedRole == UserRole.company,
            onTap: () => setState(() => _selectedRole = UserRole.company),
          ),
        ],
      ),
    );
  }

  Widget _buildSpecialtyStep() {
    final specialties = [
      SpecialtyType.veterinarian,
      SpecialtyType.groomer,
      SpecialtyType.bather,
      SpecialtyType.trainer,
      SpecialtyType.other,
    ];

    return _StepContent(
      title: 'Qual sua especialidade?',
      subtitle: 'Selecione a area em que voce atua',
      child: Column(
        children: specialties.map((specialty) {
          return Padding(
            padding: const EdgeInsets.only(bottom: 12),
            child: _RoleOption(
              icon: _specialtyIcon(specialty),
              title: specialty.displayName,
              description: '',
              isSelected: _selectedSpecialty == specialty,
              onTap: () => setState(() => _selectedSpecialty = specialty),
            ),
          );
        }).toList(),
      ),
    );
  }

  Widget _buildCrmvStep() {
    return _StepContent(
      title: 'Registro CRMV',
      subtitle: 'Informe seu registro profissional',
      child: Column(
        children: [
          TextFormField(
            controller: _crmvNumberController,
            keyboardType: TextInputType.text,
            decoration: InputDecoration(
              labelText: 'Numero do CRMV',
              hintText: 'Ex: 12345',
              prefixIcon: Icon(
                MdiIcons.badgeAccountOutline,
                color: AppColors.textHint,
              ),
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
                borderSide: const BorderSide(
                  color: AppColors.primary,
                  width: 2,
                ),
              ),
            ),
          ),
          const SizedBox(height: 16),
          TextFormField(
            controller: _crmvStateController,
            keyboardType: TextInputType.text,
            textCapitalization: TextCapitalization.characters,
            maxLength: 2,
            decoration: InputDecoration(
              labelText: 'Estado (UF)',
              hintText: 'Ex: SP',
              prefixIcon: Icon(
                MdiIcons.mapMarkerOutline,
                color: AppColors.textHint,
              ),
              counterText: '',
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
                borderSide: const BorderSide(
                  color: AppColors.primary,
                  width: 2,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPhoneStep() {
    return _StepContent(
      title: 'Seu telefone',
      subtitle: 'Opcional - facilita o contato com clientes',
      child: TextFormField(
        controller: _phoneController,
        keyboardType: TextInputType.phone,
        decoration: InputDecoration(
          labelText: 'Telefone',
          hintText: '(11) 99999-9999',
          prefixIcon: Icon(
            MdiIcons.phoneOutline,
            color: AppColors.textHint,
          ),
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
      ),
    );
  }

  Widget _buildBottomBar(AuthProvider authProvider) {
    final canProceed = _currentStep == 0
        ? _selectedRole != null
        : _currentStep == 1 && _selectedRole == UserRole.professional
        ? _selectedSpecialty != null
        : true;

    final isLastStep = _currentStep == _totalSteps - 1;

    return Container(
      padding: const EdgeInsets.all(24),
      child: SizedBox(
        width: double.infinity,
        height: 52,
        child: ElevatedButton(
          onPressed: canProceed && !authProvider.isLoading ? _nextStep : null,
          style: ElevatedButton.styleFrom(
            backgroundColor: AppColors.primary,
            foregroundColor: AppColors.textLight,
            disabledBackgroundColor: AppColors.border,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
            elevation: 0,
          ),
          child: authProvider.isLoading
              ? const SizedBox(
                  width: 20,
                  height: 20,
                  child: CircularProgressIndicator(
                    strokeWidth: 2,
                    valueColor: AlwaysStoppedAnimation<Color>(
                      AppColors.textLight,
                    ),
                  ),
                )
              : Text(
                  isLastStep ? 'Concluir' : 'Continuar',
                  style: AppTextStyles.button,
                ),
        ),
      ),
    );
  }

  Widget _buildErrorBar(String message) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
      color: AppColors.error.withValues(alpha: 0.1),
      child: Text(
        message,
        style: AppTextStyles.bodySmall.copyWith(color: AppColors.error),
        textAlign: TextAlign.center,
      ),
    );
  }

  IconData _specialtyIcon(SpecialtyType type) {
    switch (type) {
      case SpecialtyType.veterinarian:
        return MdiIcons.medicalBag;
      case SpecialtyType.groomer:
        return MdiIcons.contentCut;
      case SpecialtyType.bather:
        return MdiIcons.waterOutline;
      case SpecialtyType.trainer:
        return MdiIcons.schoolOutline;
      case SpecialtyType.other:
        return MdiIcons.dotsHorizontal;
    }
  }
}

class _StepContent extends StatelessWidget {
  final String title;
  final String subtitle;
  final Widget child;

  const _StepContent({
    required this.title,
    required this.subtitle,
    required this.child,
  });

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SizedBox(height: 24),
          Text(title, style: AppTextStyles.h2),
          const SizedBox(height: 8),
          Text(
            subtitle,
            style: AppTextStyles.bodyMedium.copyWith(
              color: AppColors.textSecondary,
            ),
          ),
          const SizedBox(height: 32),
          child,
        ],
      ),
    );
  }
}

class _RoleOption extends StatelessWidget {
  final IconData icon;
  final String title;
  final String description;
  final bool isSelected;
  final VoidCallback onTap;

  const _RoleOption({
    required this.icon,
    required this.title,
    required this.description,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: isSelected
              ? AppColors.primary.withValues(alpha: 0.08)
              : AppColors.surface,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: isSelected ? AppColors.primary : AppColors.border,
            width: isSelected ? 2 : 1,
          ),
        ),
        child: Row(
          children: [
            Container(
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                color: isSelected
                    ? AppColors.primary.withValues(alpha: 0.15)
                    : AppColors.surfaceVariant,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(
                icon,
                color: isSelected ? AppColors.primary : AppColors.textSecondary,
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: AppTextStyles.labelLarge.copyWith(
                      color: isSelected
                          ? AppColors.primary
                          : AppColors.textPrimary,
                    ),
                  ),
                  if (description.isNotEmpty) ...[
                    const SizedBox(height: 2),
                    Text(description, style: AppTextStyles.bodySmall),
                  ],
                ],
              ),
            ),
            if (isSelected)
              Icon(MdiIcons.checkCircle, color: AppColors.primary),
          ],
        ),
      ),
    );
  }
}
