import 'package:flutter/material.dart';
import '../constants/app_colors.dart';
import '../constants/app_text_styles.dart';

/// Overlay de loading tematico com o mascote LePet.
/// Exibe o logo animado (bounce + scale) sobre um fundo escuro semi-transparente.
///
/// Uso:
///   PetLoadingOverlay.show(context, message: 'Entrando...');
///   await minhaOperacao();
///   if (mounted) PetLoadingOverlay.hide(context);
class PetLoadingOverlay {
  static bool _isShowing = false;

  static void show(BuildContext context, {String? message}) {
    if (_isShowing) return;
    _isShowing = true;

    showDialog(
      context: context,
      barrierDismissible: false,
      barrierColor: Colors.black54,
      builder: (_) =>
          PopScope(canPop: false, child: _PetLoadingDialog(message: message)),
    ).then((_) => _isShowing = false);
  }

  static void hide(BuildContext context) {
    if (!_isShowing) return;
    Navigator.of(context, rootNavigator: false).pop();
    _isShowing = false;
  }
}

class _PetLoadingDialog extends StatefulWidget {
  final String? message;

  const _PetLoadingDialog({this.message});

  @override
  State<_PetLoadingDialog> createState() => __PetLoadingDialogState();
}

class __PetLoadingDialogState extends State<_PetLoadingDialog>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _bounceY;
  late Animation<double> _scale;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 700),
    )..repeat(reverse: true);

    _bounceY = Tween<double>(
      begin: 0,
      end: -20,
    ).animate(CurvedAnimation(parent: _controller, curve: Curves.easeInOut));

    _scale = Tween<double>(
      begin: 1.0,
      end: 1.10,
    ).animate(CurvedAnimation(parent: _controller, curve: Curves.easeInOut));
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Dialog(
      backgroundColor: Colors.transparent,
      elevation: 0,
      insetPadding: EdgeInsets.zero,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          AnimatedBuilder(
            animation: _controller,
            builder: (_, __) => Transform.translate(
              offset: Offset(0, _bounceY.value),
              child: Transform.scale(
                scale: _scale.value,
                child: Image.asset(
                  'assets/icons/app-logo.png',
                  width: 120,
                  height: 120,
                ),
              ),
            ),
          ),
          const SizedBox(height: 24),
          if (widget.message != null)
            Text(
              widget.message!,
              style: AppTextStyles.bodyMedium.copyWith(
                color: AppColors.textLight,
                fontWeight: FontWeight.w600,
              ),
              textAlign: TextAlign.center,
            ),
          const SizedBox(height: 8),
          Row(
            mainAxisSize: MainAxisSize.min,
            children: List.generate(3, (i) => _Dot(index: i)),
          ),
        ],
      ),
    );
  }
}

/// Pontos animados de "aguardando" com delays escalonados
class _Dot extends StatefulWidget {
  final int index;
  const _Dot({required this.index});

  @override
  State<_Dot> createState() => __DotState();
}

class __DotState extends State<_Dot> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _opacity;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 900),
    );

    _opacity = Tween<double>(
      begin: 0.2,
      end: 1.0,
    ).animate(CurvedAnimation(parent: _controller, curve: Curves.easeInOut));

    Future.delayed(Duration(milliseconds: widget.index * 200), () {
      if (mounted) _controller.repeat(reverse: true);
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 4),
      child: AnimatedBuilder(
        animation: _controller,
        builder: (_, __) => Opacity(
          opacity: _opacity.value,
          child: Container(
            width: 8,
            height: 8,
            decoration: const BoxDecoration(
              color: AppColors.primary,
              shape: BoxShape.circle,
            ),
          ),
        ),
      ),
    );
  }
}
