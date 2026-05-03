import '../../domain/entities/vaccine_record.dart';

class VaccineRecordModel extends VaccineRecord {
  const VaccineRecordModel({
    super.id,
    required super.animalId,
    super.professionalId,
    required super.vaccineName,
    super.vaccineManufacturer,
    super.batchNumber,
    required super.applicationDate,
    super.nextDoseDate,
    super.notes,
    super.createdAt,
  });

  factory VaccineRecordModel.fromJson(Map<String, dynamic> json) {
    return VaccineRecordModel(
      id: json['id'] as String?,
      animalId: (json['animalId'] ?? json['petId'] ?? '') as String,
      professionalId: json['professionalId'] as String?,
      vaccineName: json['vaccineName'] as String,
      vaccineManufacturer: json['vaccineManufacturer'] as String?,
      batchNumber: json['batchNumber'] as String?,
      applicationDate: DateTime.parse(json['applicationDate'] as String),
      nextDoseDate: json['nextDoseDate'] != null
          ? DateTime.tryParse(json['nextDoseDate'] as String)
          : null,
      notes: json['notes'] as String?,
      createdAt: json['createdAt'] != null
          ? DateTime.tryParse(json['createdAt'] as String)
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      if (id != null) 'id': id,
      'animalId': animalId,
      if (professionalId != null) 'professionalId': professionalId,
      'vaccineName': vaccineName,
      if (vaccineManufacturer != null)
        'vaccineManufacturer': vaccineManufacturer,
      if (batchNumber != null) 'batchNumber': batchNumber,
      'applicationDate': applicationDate.toIso8601String(),
      if (nextDoseDate != null) 'nextDoseDate': nextDoseDate!.toIso8601String(),
      if (notes != null) 'notes': notes,
      if (createdAt != null) 'createdAt': createdAt!.toIso8601String(),
    };
  }

  Map<String, dynamic> toCreateJson() {
    return {
      'animalId': animalId,
      'vaccineName': vaccineName,
      if (vaccineManufacturer != null && vaccineManufacturer!.isNotEmpty)
        'vaccineManufacturer': vaccineManufacturer,
      if (batchNumber != null && batchNumber!.isNotEmpty)
        'batchNumber': batchNumber,
      'applicationDate': applicationDate.toIso8601String(),
      if (nextDoseDate != null) 'nextDoseDate': nextDoseDate!.toIso8601String(),
      if (notes != null && notes!.isNotEmpty) 'notes': notes,
    };
  }

  Map<String, dynamic> toRow() {
    return {
      if (id != null) 'id': id,
      'animalId': animalId,
      if (professionalId != null) 'professionalId': professionalId,
      'vaccineName': vaccineName,
      'vaccineManufacturer': vaccineManufacturer,
      'batchNumber': batchNumber,
      'applicationDate': applicationDate.toIso8601String(),
      'nextDoseDate': nextDoseDate?.toIso8601String(),
      'notes': notes,
      'createdAt': createdAt?.toIso8601String(),
    };
  }

  factory VaccineRecordModel.fromRow(Map<String, dynamic> row) {
    return VaccineRecordModel(
      id: row['id'] as String?,
      animalId: row['animalId'] as String,
      professionalId: row['professionalId'] as String?,
      vaccineName: row['vaccineName'] as String,
      vaccineManufacturer: row['vaccineManufacturer'] as String?,
      batchNumber: row['batchNumber'] as String?,
      applicationDate: DateTime.parse(row['applicationDate'] as String),
      nextDoseDate: row['nextDoseDate'] != null
          ? DateTime.tryParse(row['nextDoseDate'] as String)
          : null,
      notes: row['notes'] as String?,
      createdAt: row['createdAt'] != null
          ? DateTime.tryParse(row['createdAt'] as String)
          : null,
    );
  }
}
