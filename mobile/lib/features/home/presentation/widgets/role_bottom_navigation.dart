import 'package:flutter/material.dart';
import 'package:material_design_icons_flutter/material_design_icons_flutter.dart';
import '../../../../../core/domain/enums/user_role.dart';

class RoleBottomNavigation extends StatelessWidget {
  final int currentIndex;
  final ValueChanged<int> onTap;
  final UserRole role;

  const RoleBottomNavigation({
    super.key,
    required this.currentIndex,
    required this.onTap,
    required this.role,
  });

  @override
  Widget build(BuildContext context) {
    return BottomNavigationBar(
      currentIndex: currentIndex,
      onTap: onTap,
      type: BottomNavigationBarType.fixed,
      selectedItemColor: Theme.of(context).colorScheme.primary,
      unselectedItemColor: Colors.grey,
      items: _buildItems(),
    );
  }

  List<BottomNavigationBarItem> _buildItems() {
    switch (role) {
      case UserRole.tutor:
        return [
          BottomNavigationBarItem(
            icon: Icon(MdiIcons.homeOutline),
            activeIcon: Icon(MdiIcons.home),
            label: 'Dashboard',
          ),
          BottomNavigationBarItem(
            icon: Icon(MdiIcons.calendarCheckOutline),
            activeIcon: Icon(MdiIcons.calendarCheck),
            label: 'Serviços',
          ),
          BottomNavigationBarItem(
            icon: Icon(MdiIcons.storeOutline),
            activeIcon: Icon(MdiIcons.store),
            label: 'Loja',
          ),
          BottomNavigationBarItem(
            icon: Icon(MdiIcons.fileDocumentPlusOutline),
            activeIcon: Icon(MdiIcons.fileDocumentPlus),
            label: 'Histórico',
          ),
          BottomNavigationBarItem(
            icon: Icon(MdiIcons.accountOutline),
            activeIcon: Icon(MdiIcons.account),
            label: 'Perfil',
          ),
        ];
      case UserRole.company:
      case UserRole.professional:
        return [
          BottomNavigationBarItem(
            icon: Icon(MdiIcons.homeOutline),
            activeIcon: Icon(MdiIcons.home),
            label: 'Dashboard',
          ),
          BottomNavigationBarItem(
            icon: Icon(MdiIcons.calendarMonthOutline),
            activeIcon: Icon(MdiIcons.calendarMonth),
            label: 'Agenda',
          ),
          BottomNavigationBarItem(
            icon: Icon(MdiIcons.dogSide),
            activeIcon: Icon(MdiIcons.dogSide),
            label: 'Pacientes',
          ),
          BottomNavigationBarItem(
            icon: Icon(MdiIcons.chartBoxOutline),
            activeIcon: Icon(MdiIcons.chartBox),
            label: 'Relatórios',
          ),
          BottomNavigationBarItem(
            icon: Icon(MdiIcons.accountOutline),
            activeIcon: Icon(MdiIcons.account),
            label: 'Perfil',
          ),
        ];
      case UserRole.admin:
        return [
          BottomNavigationBarItem(
            icon: Icon(MdiIcons.homeOutline),
            activeIcon: Icon(MdiIcons.home),
            label: 'Dashboard',
          ),
          BottomNavigationBarItem(
            icon: Icon(MdiIcons.calendarMonthOutline),
            activeIcon: Icon(MdiIcons.calendarMonth),
            label: 'Agenda',
          ),
          BottomNavigationBarItem(
            icon: Icon(MdiIcons.accountGroupOutline),
            activeIcon: Icon(MdiIcons.accountGroup),
            label: 'Usuarios',
          ),
          BottomNavigationBarItem(
            icon: Icon(MdiIcons.chartBoxOutline),
            activeIcon: Icon(MdiIcons.chartBox),
            label: 'Relatorios',
          ),
          BottomNavigationBarItem(
            icon: Icon(MdiIcons.accountOutline),
            activeIcon: Icon(MdiIcons.account),
            label: 'Perfil',
          ),
        ];
    }
  }
}
