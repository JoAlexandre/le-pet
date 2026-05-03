import 'package:dartz/dartz.dart';
import '../../../../core/domain/failures/failure.dart';
import '../entities/vaccine_record.dart';

abstract class VaccineRepository {
  Future<Either<Failure, List<VaccineRecord>>> listByAnimal(String animalId);
  Future<Either<Failure, VaccineRecord>> getById(String id);
  Future<Either<Failure, VaccineRecord>> register(VaccineRecord record);
  Future<Either<Failure, VaccineRecord>> update(VaccineRecord record);
  Future<Either<Failure, void>> delete(String id);
}
