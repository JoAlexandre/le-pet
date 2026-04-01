import 'package:intl/intl.dart';

class AppDateUtils {
  AppDateUtils._();

  static final DateFormat _dayMonthYear = DateFormat('dd/MM/yyyy');
  static final DateFormat _dayMonthYearTime = DateFormat('dd/MM/yyyy HH:mm');
  static final DateFormat _timeOnly = DateFormat('HH:mm');
  static final DateFormat _isoDate = DateFormat('yyyy-MM-dd');

  static String formatDate(DateTime date) => _dayMonthYear.format(date);

  static String formatDateTime(DateTime date) => _dayMonthYearTime.format(date);

  static String formatTime(DateTime date) => _timeOnly.format(date);

  static String formatIso(DateTime date) => _isoDate.format(date);

  static DateTime? tryParse(String value) => DateTime.tryParse(value);

  static String timeAgo(DateTime date) {
    final now = DateTime.now();
    final diff = now.difference(date);

    if (diff.inDays > 365) {
      final years = (diff.inDays / 365).floor();
      return '$years ${years == 1 ? "ano" : "anos"} atras';
    }
    if (diff.inDays > 30) {
      final months = (diff.inDays / 30).floor();
      return '$months ${months == 1 ? "mes" : "meses"} atras';
    }
    if (diff.inDays > 0) {
      return '${diff.inDays} ${diff.inDays == 1 ? "dia" : "dias"} atras';
    }
    if (diff.inHours > 0) {
      return '${diff.inHours} ${diff.inHours == 1 ? "hora" : "horas"} atras';
    }
    if (diff.inMinutes > 0) {
      return '${diff.inMinutes} min atras';
    }
    return 'agora';
  }
}
