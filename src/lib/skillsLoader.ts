import fs from 'node:fs';
import path from 'node:path';
import { SkillDefinition } from './types';
import { SKILLS_CATALOG } from './skillsCatalog';

// Fallback memory cache of skills for environments where filesystem path differs
let cachedSkills: Map<string, SkillDefinition> | null = null;

function parseYamlList(raw: string): string[] {
  if (!raw) return [];
  const cleaned = raw.trim().replace(/^\[/, '').replace(/\]$/, '');
  return cleaned
    .split(',')
    .map((s) => s.trim().replace(/^["']|["']$/g, ''))
    .filter((s) => s.length > 0);
}

function parseSkillMarkdown(fileContent: string, fallbackId: string): SkillDefinition {
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
  const match = fileContent.match(frontmatterRegex);

  if (!match) {
    return {
      id: fallbackId,
      name: fallbackId.toUpperCase(),
      priority: 'architecture-ready',
      domainTriggers: [],
      panels: ['Summary', 'Key Facts', 'Risks'],
      graphNodeTypes: ['Entity', 'Fact', 'Risk'],
      graphEdgeTypes: ['MENTIONS', 'RELATES_TO'],
      instructions: fileContent
    };
  }

  const frontmatter = match[1];
  const body = match[2].trim();

  let id = fallbackId;
  let name = fallbackId;
  let priority: 'core' | 'architecture-ready' = 'architecture-ready';
  let domainTriggers: string[] = [];
  let panels: string[] = ['Summary', 'Key Facts', 'Risks'];
  let graphNodeTypes: string[] = ['Entity'];
  let graphEdgeTypes: string[] = ['RELATES_TO'];

  const lines = frontmatter.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    if (trimmed.startsWith('id:')) {
      id = trimmed.replace('id:', '').trim();
    } else if (trimmed.startsWith('name:')) {
      name = trimmed.replace('name:', '').trim();
    } else if (trimmed.startsWith('priority:')) {
      const prio = trimmed.replace('priority:', '').trim();
      if (prio === 'core' || prio === 'architecture-ready') {
        priority = prio;
      }
    } else if (trimmed.startsWith('domain_triggers:')) {
      domainTriggers = parseYamlList(trimmed.replace('domain_triggers:', ''));
    } else if (trimmed.startsWith('panels:')) {
      panels = parseYamlList(trimmed.replace('panels:', ''));
    } else if (trimmed.startsWith('graph_node_types:')) {
      graphNodeTypes = parseYamlList(trimmed.replace('graph_node_types:', ''));
    } else if (trimmed.startsWith('graph_edge_types:')) {
      graphEdgeTypes = parseYamlList(trimmed.replace('graph_edge_types:', ''));
    }
  }

  return {
    id,
    name,
    priority,
    domainTriggers,
    panels,
    graphNodeTypes,
    graphEdgeTypes,
    instructions: body
  };
}

export function getAllSkills(): SkillDefinition[] {
  if (cachedSkills && cachedSkills.size > 0) {
    return Array.from(cachedSkills.values());
  }

  const skillsMap = new Map<string, SkillDefinition>();
  for (const s of SKILLS_CATALOG) {
    skillsMap.set(s.id, s);
  }

  // Determine skills directory path
  const skillsDir = path.join(process.cwd(), 'skills');

  if (fs.existsSync(/*turbopackIgnore: true*/ skillsDir)) {
    try {
      const files = fs.readdirSync(/*turbopackIgnore: true*/ skillsDir);
      for (const file of files) {
        if (file.endsWith('.md')) {
          const filePath = path.join(skillsDir, file);
          const content = fs.readFileSync(/*turbopackIgnore: true*/ filePath, 'utf-8');
          const skillId = file.replace('.md', '');
          const skill = parseSkillMarkdown(content, skillId);
          skillsMap.set(skill.id, skill);
        }
      }
    } catch (err) {
      console.warn('[skillsLoader] Error reading skills directory:', err);
    }
  }

  // Ensure default fallback 'general' skill exists
  if (!skillsMap.has('general')) {
    skillsMap.set('general', {
      id: 'general',
      name: 'General Document (Fallback)',
      priority: 'architecture-ready',
      domainTriggers: [],
      panels: ['Summary', 'Key Facts', 'Risks'],
      graphNodeTypes: ['Entity', 'Fact', 'Risk'],
      graphEdgeTypes: ['MENTIONS', 'RELATES_TO'],
      instructions: 'Produce universal summary, key facts, and grounded risk assessment.'
    });
  }

  cachedSkills = skillsMap;
  return Array.from(skillsMap.values());
}

export function loadSkill(id: string): SkillDefinition {
  const all = getAllSkills();
  const found = all.find((s) => s.id.toLowerCase() === id.toLowerCase());
  if (found) return found;

  const fallback = all.find((s) => s.id === 'general');
  return (
    fallback || {
      id: 'general',
      name: 'General Document',
      priority: 'architecture-ready',
      domainTriggers: [],
      panels: ['Summary', 'Key Facts', 'Risks'],
      graphNodeTypes: ['Entity'],
      graphEdgeTypes: ['RELATES_TO'],
      instructions: 'Analyze general document contents thoroughly.'
    }
  );
}

/**
 * Matches a document's content and detected domain against skills domain_triggers
 */
export function matchSkillForDocument(text: string, domainHint?: string): SkillDefinition {
  const allSkills = getAllSkills();
  const lowerText = (text || '').toLowerCase();
  const lowerHint = (domainHint || '').toLowerCase();

  // If domainHint exactly matches a skill id (e.g. 'finance', 'legal', 'corporate', 'insurance', 'academic')
  const directMatch = allSkills.find((s) => s.id.toLowerCase() === lowerHint);
  if (directMatch) {
    return directMatch;
  }

  // Count trigger hits per skill
  let bestSkill = allSkills.find((s) => s.id === 'general') || allSkills[0];
  let highestScore = 0;

  for (const skill of allSkills) {
    if (skill.id === 'general') continue;

    let score = 0;
    for (const trigger of skill.domainTriggers) {
      const lowerTrigger = trigger.toLowerCase();
      if (lowerHint && lowerHint.includes(lowerTrigger)) {
        score += 5;
      }
      if (lowerText.includes(lowerTrigger)) {
        score += 1;
      }
    }

    if (score > highestScore && score >= 2) {
      highestScore = score;
      bestSkill = skill;
    }
  }

  return bestSkill;
}
