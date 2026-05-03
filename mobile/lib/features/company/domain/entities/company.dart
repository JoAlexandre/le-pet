import 'package:equatable/equatable.dart';

class Company extends Equatable {
  final String id;
  final String userId;
  final String tradeName;
  final String? legalName;
  final String? cnpj;
  final String phone;
  final String address;
  final String city;
  final String state;
  final String? description;
  final String? logoUrl;
  final bool isActive;
  final DateTime? createdAt;

  const Company({
    required this.id,
    required this.userId,
    required this.tradeName,
    this.legalName,
    this.cnpj,
    required this.phone,
    required this.address,
    required this.city,
    required this.state,
    this.description,
    this.logoUrl,
    this.isActive = true,
    this.createdAt,
  });

  @override
  List<Object?> get props => [id, userId, tradeName, city, state];
}
