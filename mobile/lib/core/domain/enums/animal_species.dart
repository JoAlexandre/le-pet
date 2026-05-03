enum AnimalSpecies {
  dog,
  cat,
  bird,
  fish,
  reptile,
  horse,
  cow,
  other;

  static AnimalSpecies fromString(String value) {
    return AnimalSpecies.values.firstWhere(
      (e) => e.toApiString() == value.toUpperCase(),
      orElse: () => AnimalSpecies.other,
    );
  }

  String toApiString() {
    switch (this) {
      case AnimalSpecies.dog:
        return 'DOG';
      case AnimalSpecies.cat:
        return 'CAT';
      case AnimalSpecies.bird:
        return 'BIRD';
      case AnimalSpecies.fish:
        return 'FISH';
      case AnimalSpecies.reptile:
        return 'REPTILE';
      case AnimalSpecies.horse:
        return 'HORSE';
      case AnimalSpecies.cow:
        return 'COW';
      case AnimalSpecies.other:
        return 'OTHER';
    }
  }

  String get displayName {
    switch (this) {
      case AnimalSpecies.dog:
        return 'Cachorro';
      case AnimalSpecies.cat:
        return 'Gato';
      case AnimalSpecies.bird:
        return 'Ave';
      case AnimalSpecies.fish:
        return 'Peixe';
      case AnimalSpecies.reptile:
        return 'Reptil';
      case AnimalSpecies.horse:
        return 'Cavalo';
      case AnimalSpecies.cow:
        return 'Bovino';
      case AnimalSpecies.other:
        return 'Outro';
    }
  }
}
