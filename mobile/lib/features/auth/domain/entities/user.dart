import 'package:equatable/equatable.dart';
import '../../../../core/domain/enums/user_role.dart';
import '../../../../core/domain/enums/specialty_type.dart';
import '../../../../core/domain/enums/crmv_status.dart';

class User extends Equatable {
  final String id;
  final String name;
  final String email;
  final UserRole? role;
  final String? authProvider;
  final SpecialtyType? specialtyType;
  final String? crmvNumber;
  final String? crmvState;
  final CrmvStatus? crmvStatus;
  final String? phone;
  final bool isActive;
  final bool isOnboardingComplete;
  final DateTime? createdAt;

  const User({
    required this.id,
    required this.name,
    required this.email,
    this.role,
    this.authProvider,
    this.specialtyType,
    this.crmvNumber,
    this.crmvState,
    this.crmvStatus,
    this.phone,
    this.isActive = true,
    this.isOnboardingComplete = false,
    this.createdAt,
  });

  @override
  List<Object?> get props => [id, email];
}
