import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'package:mobile/injection_container.dart' as di;
import 'package:mobile/main.dart';

void main() {
  testWidgets('App renders without crashing', (WidgetTester tester) async {
    SharedPreferences.setMockInitialValues({});
    await di.init();

    await tester.pumpWidget(const LePetApp());
    await tester.pump();

    expect(find.text('LePet'), findsOneWidget);

    // Avanca o timer de 2s do splash para evitar pending timers
    await tester.pump(const Duration(seconds: 3));
    await tester.pumpAndSettle();
  });
}
