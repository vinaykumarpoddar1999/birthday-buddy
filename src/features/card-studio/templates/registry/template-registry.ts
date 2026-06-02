import type { CardTemplate, TemplateCategory } from '../../types';

class TemplateRegistry {
  private templates = new Map<string, CardTemplate>();

  registerTemplate(template: CardTemplate): void {
    this.templates.set(template.id, template);
  }

  getTemplate(id: string): CardTemplate | undefined {
    return this.templates.get(id);
  }

  getAllTemplates(): CardTemplate[] {
    return Array.from(this.templates.values());
  }

  getTemplatesByCategory(category: TemplateCategory): CardTemplate[] {
    return this.getAllTemplates().filter((t) => t.category === category);
  }

  searchTemplates(query: string, selectedCategory?: string): CardTemplate[] {
    let results = this.getAllTemplates();

    if (selectedCategory && selectedCategory !== 'all') {
      results = results.filter(
        (t) => t.category === selectedCategory || t.tags.includes(selectedCategory),
      );
    }

    if (query.trim()) {
      const q = query.toLowerCase().trim();
      results = results.filter((t) => {
        const haystack = [t.name, t.category, ...t.tags].join(' ').toLowerCase();
        return haystack.includes(q) || q.split(/\s+/).every((w) => haystack.includes(w));
      });
    }

    return results;
  }
}

export const templateRegistry = new TemplateRegistry();
