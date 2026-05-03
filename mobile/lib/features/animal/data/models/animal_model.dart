import '../../../../core/domain/enums/animal_species.dart';
import '../../../../core/domain/enums/animal_gender.dart';
import '../../domain/entities/animal.dart';

class AnimalModel extends Animal {
  const AnimalModel({
    super.id,
    required super.tutorId,
    required super.name,
    required super.species,
    super.breed,
    required super.gender,
    super.birthDate,
    super.weight,
    super.color,
    super.microchipNumber,
    super.photoUrl,
    super.allergies,
    super.notes,
    super.isActive,
    super.createdAt,
  });

  factory AnimalModel.fromJson(Map<String, dynamic> json) {
    return AnimalModel(
      id: json['id'] as String?,
      tutorId: json['tutorId'] as String? ?? '',
      name: json['name'] as String,
      species: AnimalSpecies.fromString(json['species'] as String),
      breed: json['breed'] as String?,
      gender: AnimalGender.fromString(json['gender'] as String),
      birthDate: json['birthDate'] != null
          ? DateTime.tryParse(json['birthDate'] as String)
          : null,
      weight: json['weight'] != null
          ? (json['weight'] as num).toDouble()
          : null,
      color: json['color'] as String?,
      microchipNumber: json['microchipNumber'] as String?,
      photoUrl: json['photoUrl'] as String?,
      allergies: json['allergies'] as String?,
      notes: json['notes'] as String?,
      isActive: json['isActive'] as bool? ?? true,
      createdAt: json['createdAt'] != null
          ? DateTime.tryParse(json['createdAt'] as String)
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      if (id != null) 'id': id,
      'tutorId': tutorId,
      'name': name,
      'species': species.toApiString(),
      if (breed != null) 'breed': breed,
      'gender': gender.toApiString(),
      if (birthDate != null) 'birthDate': birthDate!.toIso8601String(),
      if (weight != null) 'weight': weight,
      if (color != null) 'color': color,
      if (microchipNumber != null) 'microchipNumber': microchipNumber,
      if (photoUrl != null) 'photoUrl': photoUrl,
      if (allergies != null) 'allergies': allergies,
      if (notes != null) 'notes': notes,
      'isActive': isActive,
      if (createdAt != null) 'createdAt': createdAt!.toIso8601String(),
    };
  }

  Map<String, dynamic> toCreateJson() {
    return {
      'name': name,
      'species': species.toApiString(),
      if (breed != null && breed!.isNotEmpty) 'breed': breed,
      'gender': gender.toApiString(),
      if (birthDate != null) 'birthDate': birthDate!.toIso8601String(),
      if (weight != null) 'weight': weight,
      if (color != null && color!.isNotEmpty) 'color': color,
      if (microchipNumber != null && microchipNumber!.isNotEmpty)
        'microchipNumber': microchipNumber,
      if (allergies != null && allergies!.isNotEmpty) 'allergies': allergies,
      if (notes != null && notes!.isNotEmpty) 'notes': notes,
    };
  }

  factory AnimalModel.fromEntity(Animal animal) {
    return AnimalModel(
      id: animal.id,
      tutorId: animal.tutorId,
      name: animal.name,
      species: animal.species,
      breed: animal.breed,
      gender: animal.gender,
      birthDate: animal.birthDate,
      weight: animal.weight,
      color: animal.color,
      microchipNumber: animal.microchipNumber,
      photoUrl: animal.photoUrl,
      allergies: animal.allergies,
      notes: animal.notes,
      isActive: animal.isActive,
      createdAt: animal.createdAt,
    );
  }
}
