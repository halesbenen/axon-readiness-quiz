import { questions, dimensions } from '@/data/questions';

export type DimensionId = 'people' | 'process' | 'data' | 'tools' | 'ambition';

export type ReadinessTier = 'not-ready' | 'developing' | 'ready';

export type OverallTier = 'early-stage' | 'building-foundations' | 'ready-to-build' | 'ai-forward';

export interface DimensionResult {
  id: DimensionId;
  label: string;
  icon: string;
  score: number; // 1-5
  tier: ReadinessTier;
  tierLabel: string;
  commentary: string;
  auditFocus: string;
}

export interface QuizResult {
  dimensions: DimensionResult[];
  overallScore: number;
  overallTier: OverallTier;
  overallTierLabel: string;
  overallDescription: string;
}

export function getReadinessTier(score: number): { tier: ReadinessTier; label: string } {
  if (score < 2.5) return { tier: 'not-ready', label: 'Not Ready' };
  if (score < 3.5) return { tier: 'developing', label: 'Developing' };
  return { tier: 'ready', label: 'Ready' };
}

export function getOverallTier(score: number): { tier: OverallTier; label: string; description: string } {
  if (score < 2.0) return {
    tier: 'early-stage', label: 'Early Stage',
    description: 'AI & Automation is something to start planning for. The foundations (data, processes, and tools) need some groundwork first. An audit will map exactly where to start and what to prioritise.'
  };
  if (score < 3.0) return {
    tier: 'building-foundations', label: 'Building Foundations',
    description: 'You have some of the building blocks in place. There are clear automation opportunities available now, alongside some gaps to address. An audit will identify your quickest wins and sequence the right approach.'
  };
  if (score < 4.0) return {
    tier: 'ready-to-build', label: 'Ready to Build',
    description: "You're well-placed to start an AI & Automation programme. The foundations are solid and there are clear opportunities to act on. An audit will confirm your priorities and scope the first builds."
  };
  return {
    tier: 'ai-forward', label: 'AI-Forward',
    description: "You're ahead of most businesses your size. The foundations are strong and you're primed to move into advanced automation. An audit will validate your priorities and help you move fast."
  };
}

const dimensionCommentary: Record<DimensionId, Record<ReadinessTier, { commentary: string; auditFocus: string }>> = {
  people: {
    'not-ready': {
      commentary: 'There are likely organisational or authority gaps that will need addressing before an AI programme can land well. Change management and stakeholder alignment will be important early topics.',
      auditFocus: 'The audit will assess decision-making authority, change readiness, and identify the right internal sponsor before any build begins.'
    },
    'developing': {
      commentary: 'Your organisation has some of the right ingredients, but there are gaps in change readiness or authority that are worth addressing early. With the right approach, these are very solvable.',
      auditFocus: 'The audit will map your stakeholder landscape and recommend how to structure the programme for maximum adoption.'
    },
    'ready': {
      commentary: "Your organisation is well set up to adopt and benefit from AI & Automation. You have clear authority, good change history, and a team that's open to new ways of working.",
      auditFocus: 'The audit will confirm stakeholder alignment and make sure the right people are in the room for each phase.'
    }
  },
  process: {
    'not-ready': {
      commentary: 'Either your processes are largely manual and undocumented, or automation opportunities are limited. Either way, the audit will uncover where the real opportunities lie and what groundwork is needed first.',
      auditFocus: 'The audit will map your key processes in detail, quantify the manual time involved, and identify which processes are ready to automate now versus later.'
    },
    'developing': {
      commentary: 'There are clear manual processes that could be automated, and some process visibility already in place. A structured approach will help you prioritise and sequence the right builds.',
      auditFocus: 'The audit will document your top 5 candidate processes and assess automation potential, effort, and impact for each.'
    },
    'ready': {
      commentary: 'You have significant automation opportunities, clear process visibility, and a good sense of where the pain is. This is a strong foundation for a fast-moving AI programme.',
      auditFocus: 'The audit will confirm and quantify your top opportunities, and give you a clear 12-month implementation roadmap.'
    }
  },
  data: {
    'not-ready': {
      commentary: "Data quality and accessibility are likely to be the biggest constraint on your AI programme. Fixing this is often the first step, and it's achievable. Your audit will map exactly what's in place and what needs addressing.",
      auditFocus: 'The audit will inventory your data landscape, identify quality and accessibility issues, and recommend the data foundations needed before builds can start.'
    },
    'developing': {
      commentary: 'Your data situation is workable but has gaps. Some areas will be ready to automate now; others will need data clean-up or consolidation first. The audit will tell you which is which.',
      auditFocus: 'The audit will assess data quality per system, identify which data sources are ready to connect to automation, and flag anything that needs attention.'
    },
    'ready': {
      commentary: 'Your data estate is in good shape. Clean, accessible, cloud-based data is one of the most important foundations for AI, and you have it.',
      auditFocus: 'The audit will confirm data readiness per use case and make sure integration points are understood before any build begins.'
    }
  },
  tools: {
    'not-ready': {
      commentary: 'Your technology estate has significant gaps, either in the tools you use, how well they\'re adopted, or how they connect. Some foundational technology work may be needed before AI can deliver real value.',
      auditFocus: "The audit will review your full technology estate, identify what's in place and what's missing, and recommend the right platform starting points."
    },
    'developing': {
      commentary: "You have the core tools in place but there's room to get more from them, particularly Microsoft 365, which is the foundation for most of what Axon builds.",
      auditFocus: "The audit will assess your M365 licence and adoption, identify underused capabilities, and map which automation tools are already available to you."
    },
    'ready': {
      commentary: "Your technology stack is solid. With Microsoft 365 well adopted and some AI exposure already, you're primed to move into automation without major foundational work.",
      auditFocus: 'The audit will confirm integration points, check AI governance readiness, and identify where automation can be layered on top of your existing tools immediately.'
    }
  },
  ambition: {
    'not-ready': {
      commentary: "Budget, urgency, or leadership commitment may be limited right now. It's worth understanding what's holding things back. Often, the case for change becomes much clearer once specific opportunities and their ROI are quantified.",
      auditFocus: 'The audit will build the business case: quantified time savings, indicative costs, and a clear ROI picture to help you make the case internally.'
    },
    'developing': {
      commentary: "There's appetite but possibly not yet full commitment or budget certainty. Getting one clear, concrete win on the board is often what turns interest into investment.",
      auditFocus: 'The audit will identify the highest-ROI quick win and build the business case to get it funded and started.'
    },
    'ready': {
      commentary: "You're ready to move. You have a clear goal, leadership behind it, and the budget to make it happen. The audit will make sure you're spending it on the right things first.",
      auditFocus: 'The audit will confirm your priorities, sequence the builds for maximum early impact, and get you into delivery as fast as possible.'
    }
  }
};

export function calculateResults(answers: Record<string, number>): QuizResult {
  const dimensionScores: Record<DimensionId, number[]> = {
    people: [], process: [], data: [], tools: [], ambition: []
  };

  questions.forEach(q => {
    if (answers[q.id] !== undefined) {
      dimensionScores[q.dimension].push(answers[q.id]);
    }
  });

  const dimensionResults: DimensionResult[] = dimensions.map(dim => {
    const scores = dimensionScores[dim.id];
    const avg = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 1;
    const { tier, label } = getReadinessTier(avg);
    const { commentary, auditFocus } = dimensionCommentary[dim.id][tier];
    return {
      id: dim.id,
      label: dim.label,
      icon: dim.icon,
      score: Math.round(avg * 10) / 10,
      tier,
      tierLabel: label,
      commentary,
      auditFocus
    };
  });

  const overallScore = dimensionResults.reduce((a, b) => a + b.score, 0) / dimensionResults.length;
  const { tier, label, description } = getOverallTier(overallScore);

  return {
    dimensions: dimensionResults,
    overallScore: Math.round(overallScore * 10) / 10,
    overallTier: tier,
    overallTierLabel: label,
    overallDescription: description
  };
}
