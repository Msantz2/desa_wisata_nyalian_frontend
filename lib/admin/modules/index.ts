import { FileText } from 'lucide-react';
import { moduleRegistry } from './registry';
import { articlesService } from './articles';

export function initializeModules() {
  moduleRegistry.register({
    key: 'articles',
    label: 'Articles',
    listRoute: '/admin/articles',
    createRoute: '/admin/articles/new',
    icon: FileText,
    getSummary: () => articlesService.getSummary(),
  });
}

export { moduleRegistry };
