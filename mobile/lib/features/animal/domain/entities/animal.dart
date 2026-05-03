import 'package:equatable/equatable.dart';
import '../../../../core/domain/enums/animal_species.dart';
import '../../../../core/domain/enums/animal_gender.dart';

class Animal extends Equatable {
  final String? id;
  final String tutorId;
  final String name;
  final AnimalSpecies species;
  final String? breed;
  final AnimalGender gender;
  final DateTime? birthDate;
  final double? weight;
  final String? color;
  final String? microchipNumber;
  final String? photoUrl;
  final String? allergies;
  final String? notes;
  final bool isActive;
  final DateTime? createdAt;

  const Animal({
    this.id,
    required this.tutorId,
    required this.name,
    required this.species,
    this.breed,
    required this.gender,
    this.birthDate,
    this.weight,
    this.color,
    this.microchipNumber,
    this.photoUrl,
    this.allergies,
    this.notes,
    this.isActive = true,
    this.createdAt,
  });

  int? get ageInMonths {
    if (birthDate == null) return null;
    final now = DateTime.now();
    return (now.year - birthDate!.year) * 12 + (now.month - birthDate!.month);
  }

  String? get ageDisplayText {
    final months = ageInMonths;
    if (months == null) return null;
    if (months < 12) return '$months meses';
    final years = months ~/ 12;
    final remainingMonths = months % 12;
    if (remainingMonths == 0) return '$years ano${years > 1 ? 's' : ''}';
    return '$years ano${years > 1 ? 's' : ''} e $remainingMonths mes${remainingMonths > 1 ? 'es' : ''}';
  }

  @override
  List<Object?> get props => [id, tutorId, name];
}
