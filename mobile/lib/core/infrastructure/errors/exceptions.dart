class CancelledException implements Exception {
  final String message;
  CancelledException(this.message);
  @override
  String toString() => message;
}

class ServerException implements Exception {
  final String message;
  ServerException(this.message);
  @override
  String toString() => message;
}

class NetworkException implements Exception {
  final String message;
  NetworkException(this.message);
  @override
  String toString() => message;
}

class CacheException implements Exception {
  final String message;
  CacheException(this.message);
  @override
  String toString() => message;
}

class NotFoundException implements Exception {}

class TimeoutException implements Exception {}
