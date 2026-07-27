import type { ModuleDescriptor, ModuleRegistry } from '@/types/admin/module';

class AdminModuleRegistry implements ModuleRegistry {
  private modules: Map<string, ModuleDescriptor> = new Map();

  register(descriptor: ModuleDescriptor): void {
    if (this.modules.has(descriptor.key)) {
      throw new Error(`Module with key "${descriptor.key}" is already registered`);
    }
    this.modules.set(descriptor.key, descriptor);
  }

  getModules(): ModuleDescriptor[] {
    return Array.from(this.modules.values());
  }

  getModule(key: string): ModuleDescriptor | undefined {
    return this.modules.get(key);
  }
}

export const moduleRegistry = new AdminModuleRegistry();
