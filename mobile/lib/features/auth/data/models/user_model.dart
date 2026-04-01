import '../../../../core/domain/enums/user_role.dart';
import '../../../../core/domain/enums/specialty_type.dart';
import '../../../../core/domain/enums/crmv_status.dart';
import '../../domain/entities/user.dart';

class UserModel extends User {
  const UserModel({
    required super.id,
    required super.name,
    required super.email,
    super.role,
    super.authProvider,
    super.specialtyType,
    super.crmvNumber,
    super.crmvState,
    super.crmvStatus,
    super.phone,
    super.isActive,
    super.isOnboardingComplete,
    super.createdAt,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'] as String,
      name: json['name'] as String,
      email: json['email'] as String,
      role: json['role'] != null
          ? UserRole.fromString(json['role'] as String)
          : null,
      authProvider: json['authProvider'] as String?,
      specialtyType: json['specialtyType'] != null
          ? SpecialtyType.fromString(json['specialtyType'] as String)
          : null,
      crmvNumber: json['crmvNumber'] as String?,
      crmvState: json['crmvState'] as String?,
      crmvStatus: json['crmvStatus'] != null
          ? CrmvStatus.fromString(json['crmvStatus'] as String)
          : null,
      phone: json['phone'] as String?,
      isActive: json['isActive'] as bool? ?? true,
      isOnboardingComplete: json['isOnboardingComplete'] as bool? ?? false,
      createdAt: json['createdAt'] != null
          ? DateTime.parse(json['createdAt'] as String)
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'role': role?.toApiString(),
      'authProvider': authProvider,
      'specialtyType': specialtyType?.toApiString(),
      'crmvNumber': crmvNumber,
      'crmvState': crmvState,
      'crmvStatus': crmvStatus?.toApiString(),
      'phone': phone,
      'isActive': isActive,
      'isOnboardingComplete': isOnboardingComplete,
      'createdAt': createdAt?.toIso8601String(),
    };
  }

  factory UserModel.fromEntity(User user) {
    return UserModel(
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      authProvider: user.authProvider,
      specialtyType: user.specialtyType,
      crmvNumber: user.crmvNumber,
      crmvState: user.crmvState,
      crmvStatus: user.crmvStatus,
      phone: user.phone,
      isActive: user.isActive,
      isOnboardingComplete: user.isOnboardingComplete,
      createdAt: user.createdAt,
    );
  }
}
