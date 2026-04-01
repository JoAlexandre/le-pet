enum UserRole {
  tutor,
  company,
  professional,
  admin;

  static UserRole fromString(String value) {
    return UserRole.values.firstWhere(
      (e) => e.name.toUpperCase() == value.toUpperCase(),
      orElse: () => UserRole.tutor,
    );
  }

  String toApiString() => name.toUpperCase();

  String get displayName {
    switch (this) {
      case UserRole.tutor:
        return 'Tutor';
      case UserRole.company:
        return 'Empresa';
      case UserRole.professional:
        return 'Profissional';
      case UserRole.admin:
        return 'Administrador';
    }
  }
}
