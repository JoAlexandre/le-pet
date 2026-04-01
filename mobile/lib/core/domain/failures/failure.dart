import 'package:equatable/equatable.dart';

/// Classe base para Failures (erros de dominio)
abstract class Failure extends Equatable {
  final String message;
  final String? code;
  final dynamic details;

  const Failure({required this.message, this.code, this.details});

  @override
  List<Object?> get props => [message, code, details];

  @override
  String toString() => 'Failure(message: $message, code: $code)';
}

/// Erro de servidor (5xx)
class ServerFailure extends Failure {
  const ServerFailure({
    super.message = 'Erro no servidor. Tente novamente mais tarde.',
    super.code,
    super.details,
  });
}

/// Erro de cache/local storage
class CacheFailure extends Failure {
  const CacheFailure({
    super.message = 'Erro ao acessar dados locais.',
    super.code,
    super.details,
  });
}

/// Erro de rede/conexao
class NetworkFailure extends Failure {
  const NetworkFailure({
    super.message = 'Sem conexao com a internet.',
    super.code,
    super.details,
  });
}

/// Erro de autenticacao
class AuthFailure extends Failure {
  const AuthFailure({
    super.message = 'Erro de autenticacao.',
    super.code,
    super.details,
  });
}

/// Erro de validacao
class ValidationFailure extends Failure {
  const ValidationFailure({required super.message, super.code, super.details});
}

/// Erro de permissao/autorizacao
class PermissionFailure extends Failure {
  const PermissionFailure({
    super.message = 'Voce nao tem permissao para realizar esta acao.',
    super.code,
    super.details,
  });
}

/// Erro de recurso nao encontrado
class NotFoundFailure extends Failure {
  const NotFoundFailure({
    super.message = 'Recurso nao encontrado.',
    super.code,
    super.details,
  });
}

/// Erro generico
class UnexpectedFailure extends Failure {
  const UnexpectedFailure({
    super.message = 'Erro inesperado. Tente novamente.',
    super.code,
    super.details,
  });
}
