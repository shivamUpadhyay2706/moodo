import { CheckSquare, Users, Wallet, LogOut } from 'lucide-react';

export const SIDEBAR_NAV_ITEMS = [
  {
    name: 'Personal Tasks',
    path: '/',
    icon: CheckSquare,
  },
  {
    name: 'My Expenses',
    path: '/expenses',
    icon: Wallet,
  },
  {
    name: 'Collab Groups',
    path: '/groups',
    icon: Users,
  },
];
