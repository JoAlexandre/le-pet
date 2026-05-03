enum AnimalGender {
  male,
  female;

  static AnimalGender fromString(String value) {
    return AnimalGender.values.firstWhere(
      (e) => e.toApiString() == value.toUpperCase(),
      orElse: () => AnimalGender.male,
    );
  }

  String toApiString() {
    switch (this) {
      case AnimalGender.male:
        return 'MALE';
      case AnimalGender.female:
        return 'FEMALE';
    }
  }

  String get displayName {
    switch (this) {
      case AnimalGender.male:
        return 'Macho';
      case AnimalGender.female:
        return 'Femea';
    }
  }
}
