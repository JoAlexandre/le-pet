enum SpecialtyType {
  veterinarian,
  groomer,
  bather,
  trainer,
  other;

  static SpecialtyType fromString(String value) {
    return SpecialtyType.values.firstWhere(
      (e) => e.name.toUpperCase() == value.toUpperCase(),
      orElse: () => SpecialtyType.other,
    );
  }

  String toApiString() => name.toUpperCase();

  String get displayName {
    switch (this) {
      case SpecialtyType.veterinarian:
        return 'Veterinario';
      case SpecialtyType.groomer:
        return 'Tosador';
      case SpecialtyType.bather:
        return 'Banhista';
      case SpecialtyType.trainer:
        return 'Adestrador';
      case SpecialtyType.other:
        return 'Outro';
    }
  }
}
