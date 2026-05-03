import 'package:flutter/material.dart';

/// Indicador de loading inline com o logo LePet animado (bounce suave).
/// Usado dentro de paginas quando o corpo inteiro esta carregando.
class LoadingIndicator extends StatefulWidget {
  final double size;

  const LoadingIndicator({super.key, this.size = 80.0});

  @override
  State<LoadingIndicator> createState() => _LoadingIndicatorState();
}

class _LoadingIndicatorState extends State<LoadingIndicator>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _bounceY;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 700),
    )..repeat(reverse: true);

    _bounceY = Tween<double>(
      begin: 0,
      end: -12,
    ).animate(CurvedAnimation(parent: _controller, curve: Curves.easeInOut));
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Center(
      child: AnimatedBuilder(
        animation: _controller,
        builder: (_, __) => Transform.translate(
          offset: Offset(0, _bounceY.value),
          child: Image.asset(
            'assets/icons/app-logo.png',
            width: widget.size,
            height: widget.size,
          ),
        ),
      ),
    );
  }
}
