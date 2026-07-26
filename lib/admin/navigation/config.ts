import { LayoutDashboard, FileText, MapPin, Package, HelpCircle, MessageSquare, Image, Star, Settings } from 'lucide-react';
import type { NavigationItem } from '@/types/admin/navigation';

export const adminNavigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    id: 'articles',
    label: 'Articles',
    href: '/admin/articles',
    icon: FileText,
  },
  {
    id: 'destinations',
    label: 'Destinations',
    href: '/admin/destinations',
    icon: MapPin,
    disabled: true,
  },
  {
    id: 'packages',
    label: 'Tour Packages',
    href: '/admin/packages',
    icon: Package,
    disabled: true,
  },
  {
    id: 'faq',
    label: 'FAQ',
    href: '/admin/faq',
    icon: HelpCircle,
    disabled: true,
  },
  {
    id: 'reviews',
    label: 'Reviews',
    href: '/admin/reviews',
    icon: MessageSquare,
    disabled: true,
  },
  {
    id: 'gallery',
    label: 'Gallery',
    href: '/admin/gallery',
    icon: Image,
    disabled: true,
  },
  {
    id: 'videos',
    label: 'Videos',
    href: '/admin/videos',
    icon: Star,
    disabled: true,
  },
  {
    id: 'settings',
    label: 'Settings',
    href: '/admin/settings',
    icon: Settings,
    disabled: true,
  },
];
