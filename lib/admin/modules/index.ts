import { FileText } from 'lucide-react';
import { moduleRegistry } from './registry';
import { articlesService } from './articles';

export function initializeModules() {
  // Prevent duplicate registration during hot reload or multiple renders
  if (moduleRegistry.isInitialized()) {
    return;
  }

  moduleRegistry.register({
    key: 'articles',
    label: 'Articles',
    listRoute: '/admin/articles',
    createRoute: '/admin/articles/new',
    icon: FileText,
    getSummary: () => articlesService.getSummary(),
  });

  moduleRegistry.markInitialized();
}

export { moduleRegistry };
