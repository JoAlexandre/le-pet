import '../../domain/entities/company.dart';

class CompanyModel extends Company {
  const CompanyModel({
    required super.id,
    required super.userId,
    required super.tradeName,
    super.legalName,
    super.cnpj,
    required super.phone,
    required super.address,
    required super.city,
    required super.state,
    super.description,
    super.logoUrl,
    super.isActive,
    super.createdAt,
  });

  factory CompanyModel.fromJson(Map<String, dynamic> json) {
    return CompanyModel(
      id: json['id'] as String,
      userId: json['userId'] as String,
      tradeName: json['tradeName'] as String,
      legalName: json['legalName'] as String?,
      cnpj: json['cnpj'] as String?,
      phone: json['phone'] as String,
      address: json['address'] as String,
      city: json['city'] as String,
      state: json['state'] as String,
      description: json['description'] as String?,
      logoUrl: json['logoUrl'] as String?,
      isActive: json['isActive'] == true || json['isActive'] == 1,
      createdAt: json['createdAt'] != null
          ? DateTime.tryParse(json['createdAt'] as String)
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'userId': userId,
      'tradeName': tradeName,
      if (legalName != null) 'legalName': legalName,
      if (cnpj != null) 'cnpj': cnpj,
      'phone': phone,
      'address': address,
      'city': city,
      'state': state,
      if (description != null) 'description': description,
      if (logoUrl != null) 'logoUrl': logoUrl,
      'isActive': isActive,
      if (createdAt != null) 'createdAt': createdAt!.toIso8601String(),
    };
  }

  Map<String, dynamic> toUpdateJson() {
    return {
      'tradeName': tradeName,
      if (legalName != null && legalName!.isNotEmpty) 'legalName': legalName,
      if (cnpj != null && cnpj!.isNotEmpty) 'cnpj': cnpj,
      'phone': phone,
      'address': address,
      'city': city,
      'state': state,
      if (description != null && description!.isNotEmpty)
        'description': description,
    };
  }

  Map<String, dynamic> toRow() {
    return {
      'id': id,
      'userId': userId,
      'tradeName': tradeName,
      'legalName': legalName,
      'cnpj': cnpj,
      'phone': phone,
      'address': address,
      'city': city,
      'state': state,
      'description': description,
      'logoUrl': logoUrl,
      'isActive': isActive ? 1 : 0,
      'createdAt': createdAt?.toIso8601String(),
    };
  }

  factory CompanyModel.fromRow(Map<String, dynamic> row) {
    return CompanyModel(
      id: row['id'] as String,
      userId: row['userId'] as String,
      tradeName: row['tradeName'] as String,
      legalName: row['legalName'] as String?,
      cnpj: row['cnpj'] as String?,
      phone: row['phone'] as String,
      address: row['address'] as String,
      city: row['city'] as String,
      state: row['state'] as String,
      description: row['description'] as String?,
      logoUrl: row['logoUrl'] as String?,
      isActive: (row['isActive'] as int? ?? 1) == 1,
      createdAt: row['createdAt'] != null
          ? DateTime.tryParse(row['createdAt'] as String)
          : null,
    );
  }
}
