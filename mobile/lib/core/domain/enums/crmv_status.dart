enum CrmvStatus {
  pending,
  verified,
  rejected;

  static CrmvStatus fromString(String value) {
    return CrmvStatus.values.firstWhere(
      (e) => e.name.toUpperCase() == value.toUpperCase(),
      orElse: () => CrmvStatus.pending,
    );
  }

  String toApiString() => name.toUpperCase();

  String get displayName {
    switch (this) {
      case CrmvStatus.pending:
        return 'Pendente';
      case CrmvStatus.verified:
        return 'Verificado';
      case CrmvStatus.rejected:
        return 'Rejeitado';
    }
  }
}
