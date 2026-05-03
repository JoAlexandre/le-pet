import 'package:flutter/material.dart';

enum PetAnimationState { idle, barking }

class AnimatedPetWidget extends StatefulWidget {
  final double size;
  final bool autoPlay;
  final PetAnimationState initialState;

  const AnimatedPetWidget({
    super.key,
    this.size = 200,
    this.autoPlay = true,
    this.initialState = PetAnimationState.idle,
  });

  @override
  State<AnimatedPetWidget> createState() => AnimatedPetWidgetState();
}

class AnimatedPetWidgetState extends State<AnimatedPetWidget>
    with TickerProviderStateMixin {
  // Controladores
  late AnimationController _pawController;
  late AnimationController _mouthController;

  // Animacoes das patas
  late Animation<double> _leftPawAngle;
  late Animation<double> _rightPawAngle;
  late Animation<double> _leftPawOffsetY;
  late Animation<double> _rightPawOffsetY;

  // Animacao da boca
  late Animation<double> _mouthScaleY;

  PetAnimationState _currentState = PetAnimationState.idle;

  @override
  void initState() {
    super.initState();
    _currentState = widget.initialState;
    _initPawAnimation();
    _initMouthAnimation();
    if (widget.autoPlay) start();
  }

  void _initPawAnimation() {
    _pawController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1200),
    );

    // Pata esquerda: rotacao levemente horaria, com atraso natural (parte de 0.12)
    _leftPawAngle = Tween<double>(
      begin: -0.12,
      end: 0.12,
    ).animate(CurvedAnimation(parent: _pawController, curve: Curves.easeInOut));

    // Pata direita: rotacao oposta para movimento alternado
    _rightPawAngle = Tween<double>(
      begin: 0.12,
      end: -0.12,
    ).animate(CurvedAnimation(parent: _pawController, curve: Curves.easeInOut));

    // Translacao vertical para dar sensacao de leveza
    _leftPawOffsetY = Tween<double>(
      begin: 0,
      end: -8,
    ).animate(CurvedAnimation(parent: _pawController, curve: Curves.easeInOut));

    _rightPawOffsetY = Tween<double>(
      begin: -8,
      end: 0,
    ).animate(CurvedAnimation(parent: _pawController, curve: Curves.easeInOut));
  }

  void _initMouthAnimation() {
    // Latido rapido: 280ms por ciclo (abrir + fechar)
    _mouthController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 280),
    );

    _mouthScaleY = TweenSequence<double>([
      TweenSequenceItem(
        tween: Tween(
          begin: 1.0,
          end: 0.15,
        ).chain(CurveTween(curve: Curves.easeIn)),
        weight: 40,
      ),
      TweenSequenceItem(
        tween: Tween(
          begin: 0.15,
          end: 1.0,
        ).chain(CurveTween(curve: Curves.elasticOut)),
        weight: 60,
      ),
    ]).animate(_mouthController);
  }

  /// Inicia todas as animacoes
  void start() {
    _pawController.repeat(reverse: true);
    if (_currentState == PetAnimationState.barking) {
      _mouthController.repeat();
    }
  }

  /// Para todas as animacoes
  void stop() {
    _pawController.stop();
    _mouthController.stop();
  }

  /// Dispara sequencia de latido por [duration] e volta ao estado idle
  void bark({Duration duration = const Duration(seconds: 2)}) {
    if (_currentState == PetAnimationState.barking) return;

    setState(() => _currentState = PetAnimationState.barking);
    _mouthController.repeat();

    Future.delayed(duration, () {
      if (!mounted) return;
      _mouthController.stop();
      _mouthController.animateTo(0);
      setState(() => _currentState = PetAnimationState.idle);
    });
  }

  @override
  void dispose() {
    _pawController.dispose();
    _mouthController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final double s = widget.size;

    return SizedBox(
      width: s,
      height: s,
      child: AnimatedBuilder(
        animation: Listenable.merge([_pawController, _mouthController]),
        builder: (context, _) => Stack(
          alignment: Alignment.center,
          clipBehavior: Clip.none,
          children: [
            // Camada base: cabeca, orelhas, olhos, nariz
            Positioned.fill(
              child: Image.asset(
                'assets/images/mascot/mascot_base.png',
                fit: BoxFit.contain,
              ),
            ),

            // Boca: escala no eixo Y com pivo no topo (simula abertura do queixo)
            Positioned(
              bottom: s * 0.24,
              left: s * 0.28,
              right: s * 0.28,
              height: s * 0.20,
              child: Transform(
                alignment: Alignment.topCenter,
                transform: Matrix4.identity()..scale(1.0, _mouthScaleY.value),
                child: Image.asset(
                  'assets/images/mascot/mascot_mouth.png',
                  fit: BoxFit.contain,
                ),
              ),
            ),

            // Pata esquerda (lado esquerdo da tela)
            Positioned(
              bottom: s * 0.03,
              left: 0,
              child: Transform.translate(
                offset: Offset(0, _leftPawOffsetY.value),
                child: Transform.rotate(
                  angle: _leftPawAngle.value,
                  alignment: Alignment.bottomRight,
                  child: SizedBox(
                    width: s * 0.33,
                    height: s * 0.42,
                    child: Image.asset(
                      'assets/images/mascot/mascot_paw_left.png',
                      fit: BoxFit.contain,
                    ),
                  ),
                ),
              ),
            ),

            // Pata direita (lado direito da tela)
            Positioned(
              bottom: s * 0.03,
              right: 0,
              child: Transform.translate(
                offset: Offset(0, _rightPawOffsetY.value),
                child: Transform.rotate(
                  angle: _rightPawAngle.value,
                  alignment: Alignment.bottomLeft,
                  child: SizedBox(
                    width: s * 0.33,
                    height: s * 0.42,
                    child: Image.asset(
                      'assets/images/mascot/mascot_paw_right.png',
                      fit: BoxFit.contain,
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
