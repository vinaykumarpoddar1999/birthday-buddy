import { templateRegistry } from './registry/template-registry';
import { ALL_TEMPLATES } from './catalog';

ALL_TEMPLATES.forEach((template) => templateRegistry.registerTemplate(template));

export { ALL_TEMPLATES } from './catalog';
export { templateRegistry } from './registry/template-registry';
