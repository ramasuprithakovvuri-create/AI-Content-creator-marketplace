import { CreativeBrief, User } from '../types';

const norm = (s: string) => s.toLowerCase();
const overlap = (a: string, b: string) => {
  const x = norm(a), y = norm(b);
  return x.includes(y) || y.includes(x) || x.split(/[\s()/.,-]+/).some((t) => t.length > 3 && y.includes(t));
};

export interface MatchResult {
  creator: User;
  score: number;
  pct: number;
  certified: boolean;
  reasons: string[];
}

export function matchCreators(brief: CreativeBrief, creators: User[], limit = 10): MatchResult[] {
  const models = [...brief.recommendedModelStack, ...(brief.preferredModels || [])];
  const styles = (brief.visualStyleTags || []).concat(brief.visualStyle ? [brief.visualStyle] : []);
  const skillsWanted = brief.suggestedSkills || [];

  const results = creators.filter((c) => c.creatorProfile).map((c) => {
    const p = c.creatorProfile!;
    const reasons: string[] = [];
    let score = 0;

    const toolHits = p.tools.filter((t) => models.some((m) => overlap(t, m)));
    if (toolHits.length) { score += Math.min(toolHits.length, 4) * 3; reasons.push('Tools: ' + toolHits.slice(0, 3).join(', ')); }

    const skillHits = p.skills.filter((s) => skillsWanted.some((w) => overlap(s, w)));
    if (skillHits.length) { score += Math.min(skillHits.length, 3) * 2; reasons.push('Skills: ' + skillHits.slice(0, 2).join(', ')); }

    const hay = norm([p.specialization, p.headline, ...p.skills, ...p.portfolio.map((i) => i.title + ' ' + i.description)].join(' '));
    const styleHits = styles.filter((s) => s && norm(s).split(/[\s,&/]+/).some((t) => t.length > 3 && hay.includes(t)));
    if (styleHits.length) { score += styleHits.length * 2; reasons.push('Style fit: ' + styleHits[0].slice(0, 28)); }

    const certified = p.verificationSignals.length > 0;
    if (certified) { score += 3; reasons.push('Certified'); }
    if (p.projectRateMin <= brief.budget) { score += 2; reasons.push('Within budget'); }
    score += (p.metrics.rating / 5) * 2 + (p.metrics.onTimeRate / 100);

    return { creator: c, score, pct: 0, certified, reasons };
  });

  results.sort((a, b) => b.score - a.score);
  const top = results[0]?.score || 1;
  return results.slice(0, limit).map((r) => ({ ...r, pct: Math.max(35, Math.min(99, Math.round((r.score / top) * 96))) }));
}
