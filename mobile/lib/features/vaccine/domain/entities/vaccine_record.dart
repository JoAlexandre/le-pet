import 'package:equatable/equatable.dart';

class VaccineRecord extends Equatable {
  final String? id;
  final String animalId;
  final String? professionalId;
  final String vaccineName;
  final String? vaccineManufacturer;
  final String? batchNumber;
  final DateTime applicationDate;
  final DateTime? nextDoseDate;
  final String? notes;
  final DateTime? createdAt;

  const VaccineRecord({
    this.id,
    required this.animalId,
    this.professionalId,
    required this.vaccineName,
    this.vaccineManufacturer,
    this.batchNumber,
    required this.applicationDate,
    this.nextDoseDate,
    this.notes,
    this.createdAt,
  });

  bool get isDueSoon {
    if (nextDoseDate == null) return false;
    final now = DateTime.now();
    final diff = nextDoseDate!.difference(now).inDays;
    return diff >= 0 && diff <= 30;
  }

  bool get isOverdue {
    if (nextDoseDate == null) return false;
    return nextDoseDate!.isBefore(DateTime.now());
  }

  bool get isUpToDate {
    if (nextDoseDate == null) return true;
    return nextDoseDate!.isAfter(DateTime.now());
  }

  @override
  List<Object?> get props => [id, animalId, vaccineName, applicationDate];
}
