enum AuthProvider {
  google,
  apple,
  microsoft,
  email;

  static AuthProvider fromString(String value) {
    return AuthProvider.values.firstWhere(
      (e) => e.name.toUpperCase() == value.toUpperCase(),
      orElse: () => AuthProvider.email,
    );
  }

  String toApiString() => name.toUpperCase();
}
