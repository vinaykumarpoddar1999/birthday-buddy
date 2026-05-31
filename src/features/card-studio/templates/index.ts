import { templateRegistry } from './registry/template-registry';
import { luxuryGoldTemplate } from './birthday/luxury-gold';
import { cutePinkTemplate } from './birthday/cute-pink';
import { neonPartyTemplate } from './birthday/neon-party';
import { floralTemplate } from './birthday/floral';
import { photoCardTemplate } from './birthday/photo-card';

templateRegistry.registerTemplate(luxuryGoldTemplate);
templateRegistry.registerTemplate(cutePinkTemplate);
templateRegistry.registerTemplate(neonPartyTemplate);
templateRegistry.registerTemplate(floralTemplate);
templateRegistry.registerTemplate(photoCardTemplate);

export { templateRegistry };
