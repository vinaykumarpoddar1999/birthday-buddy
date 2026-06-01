import { templateRegistry } from './registry/template-registry';
import { luxuryGoldTemplate } from './birthday/luxury-gold';
import { cutePinkTemplate } from './birthday/cute-pink';
import { neonPartyTemplate } from './birthday/neon-party';
import { floralTemplate } from './birthday/floral';
import { photoCardTemplate } from './birthday/photo-card';
import { midnightGalaxyTemplate } from './birthday/midnight-galaxy';
import { tropicalParadiseTemplate } from './birthday/tropical-paradise';
import { vintageRoseTemplate } from './birthday/vintage-rose';
import { modernGeometricTemplate } from './birthday/modern-geometric';
import { confettiCelebrationTemplate } from './birthday/confetti-celebration';

templateRegistry.registerTemplate(luxuryGoldTemplate);
templateRegistry.registerTemplate(cutePinkTemplate);
templateRegistry.registerTemplate(neonPartyTemplate);
templateRegistry.registerTemplate(floralTemplate);
templateRegistry.registerTemplate(photoCardTemplate);
templateRegistry.registerTemplate(midnightGalaxyTemplate);
templateRegistry.registerTemplate(tropicalParadiseTemplate);
templateRegistry.registerTemplate(vintageRoseTemplate);
templateRegistry.registerTemplate(modernGeometricTemplate);
templateRegistry.registerTemplate(confettiCelebrationTemplate);

export { templateRegistry };
