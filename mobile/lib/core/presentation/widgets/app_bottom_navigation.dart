import 'package:flutter/material.dart';
import 'package:material_design_icons_flutter/material_design_icons_flutter.dart';

class AppBottomNavigation extends StatelessWidget {
  final int currentIndex;
  final ValueChanged<int> onTap;

  const AppBottomNavigation({
    super.key,
    required this.currentIndex,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return BottomNavigationBar(
      currentIndex: currentIndex,
      onTap: onTap,
      type: BottomNavigationBarType.fixed,
      selectedItemColor: Theme.of(context).colorScheme.primary,
      unselectedItemColor: Colors.grey,
      items: [
        BottomNavigationBarItem(
          icon: Icon(MdiIcons.homeOutline),
          activeIcon: Icon(MdiIcons.home),
          label: 'Home',
        ),
        BottomNavigationBarItem(
          icon: Icon(MdiIcons.magnify),
          activeIcon: Icon(MdiIcons.magnify),
          label: 'Buscar',
        ),
        BottomNavigationBarItem(
          icon: Icon(MdiIcons.accountOutline),
          activeIcon: Icon(MdiIcons.account),
          label: 'Perfil',
        ),
      ],
    );
  }
}
