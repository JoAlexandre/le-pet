class ApiConfig {
  ApiConfig._();

  /// URLs por ambiente
  static const String baseUrlProd = 'https://lepet-api.codji.com.br/api';
  static const String baseUrlDev = 'http://192.168.1.110:3001/api';
  static const String baseUrl = baseUrlDev;
  static const String domain = 'http://192.168.1.110:3001';

  /// Versao da API
  static const String apiVersion = 'v1';
  static String get apiUrl => '$baseUrl/$apiVersion';

  /// Endpoints
  static const String usersEndpoint = 'users';
  static const String sessionsEndpoint = 'sessions';
  static const String animalsEndpoint = 'animals';
  static const String companiesEndpoint = 'companies';
  static const String servicesEndpoint = 'services';
  static const String schedulesEndpoint = 'schedules';
  static const String appointmentsEndpoint = 'appointments';

  /// Timeouts (segundos)
  static const int connectTimeout = 30;
  static const int receiveTimeout = 30;
  static const int sendTimeout = 30;

  /// Headers padrao
  static Map<String, String> get defaultHeaders => {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
}
