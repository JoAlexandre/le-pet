import 'package:flutter/services.dart';
import 'package:mask_text_input_formatter/mask_text_input_formatter.dart';

/// Classe utilitária com máscaras de formatação reutilizáveis
///
/// Centraliza todas as máscaras usadas no projeto para manter consistência
/// e facilitar manutenção.
class MaskFormatters {
  MaskFormatters._(); // Construtor privado para classe estática

  // ==================== DOCUMENTOS ====================

  /// Máscara para CPF: 000.000.000-00
  static final cpf = MaskTextInputFormatter(
    mask: '###.###.###-##',
    filter: {'#': RegExp(r'[0-9]')},
    type: MaskAutoCompletionType.lazy,
  );

  /// Máscara para CNPJ: 00.000.000/0000-00
  static final cnpj = MaskTextInputFormatter(
    mask: '##.###.###/####-##',
    filter: {'#': RegExp(r'[0-9]')},
    type: MaskAutoCompletionType.lazy,
  );

  // ==================== CONTATO ====================

  /// Máscara para telefone celular: (00) 00000-0000
  static final phone = MaskTextInputFormatter(
    mask: '(##) #####-####',
    filter: {'#': RegExp(r'[0-9]')},
    type: MaskAutoCompletionType.lazy,
  );

  /// Máscara para telefone fixo: (00) 0000-0000
  static final landline = MaskTextInputFormatter(
    mask: '(##) ####-####',
    filter: {'#': RegExp(r'[0-9]')},
    type: MaskAutoCompletionType.lazy,
  );

  // ==================== DATAS ====================

  /// Máscara para data: 00/00/0000
  static final date = MaskTextInputFormatter(
    mask: '##/##/####',
    filter: {'#': RegExp(r'[0-9]')},
    type: MaskAutoCompletionType.lazy,
  );

  /// Máscara para data e hora: 00/00/0000 00:00
  static final dateTime = MaskTextInputFormatter(
    mask: '##/##/#### ##:##',
    filter: {'#': RegExp(r'[0-9]')},
    type: MaskAutoCompletionType.lazy,
  );

  /// Máscara para hora: 00:00
  static final time = MaskTextInputFormatter(
    mask: '##:##',
    filter: {'#': RegExp(r'[0-9]')},
    type: MaskAutoCompletionType.lazy,
  );

  // ==================== CNH ====================

  /// Máscara para número de CNH: 00000000000 (11 dígitos)
  static final cnh = MaskTextInputFormatter(
    mask: '###########',
    filter: {'#': RegExp(r'[0-9]')},
    type: MaskAutoCompletionType.lazy,
  );

  // ==================== ENDEREÇO ====================

  /// Máscara para CEP: 00000-000
  static final cep = MaskTextInputFormatter(
    mask: '#####-###',
    filter: {'#': RegExp(r'[0-9]')},
    type: MaskAutoCompletionType.lazy,
  );

  // ==================== CARTÃO ====================

  /// Máscara para número de cartão de crédito: 0000 0000 0000 0000
  static final cardNumber = MaskTextInputFormatter(
    mask: '#### #### #### ####',
    filter: {'#': RegExp(r'[0-9]')},
    type: MaskAutoCompletionType.lazy,
  );

  /// Máscara para validade do cartão: MM/AA
  static final cardExpiry = MaskTextInputFormatter(
    mask: '##/##',
    filter: {'#': RegExp(r'[0-9]')},
    type: MaskAutoCompletionType.lazy,
  );

  // ==================== VALORES ====================

  /// Máscara para valores monetários: R$ 0.000,00
  static final currency = MaskTextInputFormatter(
    mask: 'R\$ #.###.###.###,##',
    filter: {'#': RegExp(r'[0-9]')},
    type: MaskAutoCompletionType.lazy,
  );

  /// Máscara para porcentagem: 000,00%
  static final percentage = MaskTextInputFormatter(
    mask: '###,##%',
    filter: {'#': RegExp(r'[0-9]')},
    type: MaskAutoCompletionType.lazy,
  );

  // ==================== DECIMAL ====================

  /// Cria um formatador decimal com preenchimento da direita para esquerda
  ///
  /// [decimalDigits] - Quantidade de dígitos após a vírgula (padrão: 2)
  /// [maxIntegerDigits] - Quantidade máxima de dígitos inteiros (padrão: 10)
  ///
  /// Exemplo de uso:
  /// ```dart
  /// TextField(
  ///   inputFormatters: [MaskFormatters.decimal()],
  /// )
  /// ```
  static DecimalInputFormatter decimal({
    int decimalDigits = 2,
    int maxIntegerDigits = 10,
  }) {
    return DecimalInputFormatter(
      decimalDigits: decimalDigits,
      maxIntegerDigits: maxIntegerDigits,
    );
  }

  // ==================== MÉTODOS AUXILIARES ====================

  /// Aplica máscara de CPF em um texto
  ///
  /// Exemplo: formatCpf('12345678900') → '123.456.789-00'
  static String formatCpf(String text) {
    final formatter = MaskTextInputFormatter(
      initialText: text,
      mask: '###.###.###-##',
      filter: {'#': RegExp(r'[0-9]')},
    );
    return formatter.getMaskedText();
  }

  /// Aplica máscara de CNPJ em um texto
  ///
  /// Exemplo: formatCnpj('12345678000190') → '12.345.678/0001-90'
  static String formatCnpj(String text) {
    final formatter = MaskTextInputFormatter(
      initialText: text,
      mask: '##.###.###/####-##',
      filter: {'#': RegExp(r'[0-9]')},
    );
    return formatter.getMaskedText();
  }

  /// Aplica máscara de telefone em um texto
  ///
  /// Exemplo: formatPhone('11987654321') → '(11) 98765-4321'
  static String formatPhone(String text) {
    final formatter = MaskTextInputFormatter(
      initialText: text,
      mask: '(##) #####-####',
      filter: {'#': RegExp(r'[0-9]')},
    );
    return formatter.getMaskedText();
  }

  /// Aplica máscara de data em um texto
  ///
  /// Exemplo: formatDate('31122025') → '31/12/2025'
  static String formatDate(String text) {
    final formatter = MaskTextInputFormatter(
      initialText: text,
      mask: '##/##/####',
      filter: {'#': RegExp(r'[0-9]')},
    );
    return formatter.getMaskedText();
  }

  /// Converte data ISO (YYYY-MM-DD) para formato brasileiro (DD/MM/YYYY)
  ///
  /// Exemplo: formatDateIsoString('2025-12-31') → '31/12/2025'
  static String formatDateIsoString(String text) {
    // Remove caracteres não numéricos
    text = text.split("T")[0];
    final digits = text.replaceAll(RegExp(r'[^0-9]'), '');
    if (digits.length != 8) return text;

    // Reorganiza de YYYYMMDD para DDMMYYYY
    final year = digits.substring(0, 4);
    final month = digits.substring(4, 6);
    final day = digits.substring(6, 8);

    return '$day/$month/$year';
  }

  /// Aplica máscara de CEP em um texto
  ///
  /// Exemplo: formatCep('12345678') → '12345-678'
  static String formatCep(String text) {
    final formatter = MaskTextInputFormatter(
      initialText: text,
      mask: '#####-###',
      filter: {'#': RegExp(r'[0-9]')},
    );
    return formatter.getMaskedText();
  }

  /// Aplica máscara de CNH em um texto
  ///
  /// Exemplo: formatCnh('12345678901') → '12345678901'
  static String formatCnh(String text) {
    final formatter = MaskTextInputFormatter(
      initialText: text,
      mask: '###########',
      filter: {'#': RegExp(r'[0-9]')},
    );
    return formatter.getMaskedText();
  }

  /// Remove toda formatação de um texto (deixa apenas números)
  ///
  /// Exemplo: unmask('123.456.789-00') → '12345678900'
  static String unmask(String text) {
    return text.replaceAll(RegExp(r'[^0-9]'), '');
  }

  // ==================== MASCARAMENTO DE DADOS CONFIDENCIAIS ====================

  /// Mascara um texto mostrando apenas os 2 primeiros e 2 últimos dígitos
  ///
  /// Exemplo: maskConfidential('12345678') → '12****78'
  static String _maskConfidential(String text, {String maskChar = '*'}) {
    final digits = text.replaceAll(RegExp(r'[^0-9]'), '');
    if (digits.length <= 4) return digits;

    final firstTwo = digits.substring(0, 2);
    final lastTwo = digits.substring(digits.length - 2);
    final middleMask = maskChar * (digits.length - 4);

    return '$firstTwo$middleMask$lastTwo';
  }

  /// Formata CNPJ mascarado (mostra apenas 2 primeiros e 2 últimos dígitos)
  ///
  /// Exemplo: formatCnpjMasked('12345678000190') → '12.**.***.****-90'
  static String formatCnpjMasked(String text) {
    final masked = _maskConfidential(text);
    if (masked.length != 14) return masked;

    // Aplica formatação de CNPJ no valor mascarado
    return '${masked.substring(0, 2)}.${masked.substring(2, 5)}.${masked.substring(5, 8)}/${masked.substring(8, 12)}-${masked.substring(12, 14)}';
  }

  /// Formata CEP mascarado (mostra apenas 2 primeiros e 2 últimos dígitos)
  ///
  /// Exemplo: formatCepMasked('12345678') → '12***-*78'
  static String formatCepMasked(String text) {
    final masked = _maskConfidential(text);
    if (masked.length != 8) return masked;

    // Aplica formatação de CEP no valor mascarado
    return '${masked.substring(0, 5)}-${masked.substring(5, 8)}';
  }

  /// Formata Inscrição Estadual mascarada (mostra apenas 2 primeiros e 2 últimos dígitos)
  ///
  /// Exemplo: formatStateRegistrationMasked('123456789') → '12*****89'
  static String formatStateRegistrationMasked(String text) {
    return _maskConfidential(text);
  }
}

/// Formatador de entrada decimal com preenchimento da direita para esquerda
///
/// Ideal para campos de valores numéricos onde o usuário digita valores
/// e os dígitos preenchem da direita para a esquerda, como em calculadoras.
/// Segue o padrão brasileiro de formatação (vírgula decimal e ponto para milhar).
///
/// Exemplo:
/// - Digitando "1" → "0,01"
/// - Digitando "12" → "0,12"
/// - Digitando "123" → "1,23"
/// - Digitando "1234" → "12,34"
/// - Digitando "123456" → "1.234,56"
/// - Digitando "1234567" → "12.345,67"
/// - Digitando "123456789" → "1.234.567,89"
class DecimalInputFormatter extends TextInputFormatter {
  /// Quantidade de dígitos após a vírgula
  final int decimalDigits;

  /// Quantidade máxima de dígitos inteiros (antes da vírgula)
  final int maxIntegerDigits;

  /// Valor atual sem formatação (apenas dígitos)
  String _rawValue = '';

  DecimalInputFormatter({this.decimalDigits = 2, this.maxIntegerDigits = 10});

  /// Retorna o valor numérico atual como double
  double get doubleValue {
    if (_rawValue.isEmpty) return 0.0;
    final intValue = int.tryParse(_rawValue) ?? 0;
    return intValue / _divisor;
  }

  /// Retorna o divisor baseado na quantidade de casas decimais
  int get _divisor => int.parse('1${'0' * decimalDigits}');

  /// Quantidade máxima total de dígitos
  int get _maxDigits => maxIntegerDigits + decimalDigits;

  @override
  TextEditingValue formatEditUpdate(
    TextEditingValue oldValue,
    TextEditingValue newValue,
  ) {
    // Extrai apenas os dígitos do novo valor
    final newDigits = newValue.text.replaceAll(RegExp(r'[^0-9]'), '');

    // Se não tiver mudança nos dígitos, mantém o valor antigo
    if (newDigits == _rawValue) {
      return oldValue;
    }

    // Limita a quantidade máxima de dígitos
    if (newDigits.length > _maxDigits) {
      return oldValue;
    }

    // Atualiza o valor bruto
    _rawValue = newDigits;

    // Formata o valor
    final formattedValue = _format(_rawValue);

    return TextEditingValue(
      text: formattedValue,
      selection: TextSelection.collapsed(offset: formattedValue.length),
    );
  }

  /// Formata o valor bruto com a vírgula decimal e separadores de milhar
  String _format(String digits) {
    if (digits.isEmpty) return '';

    final value = int.parse(digits.padLeft(decimalDigits + 1, '0'));
    final integerPart = value ~/ _divisor;

    final formattedInteger = integerPart.toString().replaceAllMapped(
      RegExp(r'(\d)(?=(\d{3})+(?!\d))'),
      (match) => '${match[1]}.',
    );

    // Se não houver casas decimais, retorna apenas a parte inteira
    if (decimalDigits == 0) {
      return formattedInteger;
    }

    final decimalPart = (value % _divisor).toString().padLeft(
      decimalDigits,
      '0',
    );

    return '$formattedInteger,$decimalPart';
  }

  /// Limpa o valor do formatador
  void clear() {
    _rawValue = '';
  }

  /// Define um valor inicial
  void setValue(double value) {
    final intValue = (value * _divisor).round();
    _rawValue = intValue.toString();
  }

  /// Retorna o texto formatado para um valor double
  String formatValue(num value) {
    final intValue = (value * _divisor).round();
    return _format(intValue.toString());
  }
}
