import type { QuizResult, ReadinessTier } from '@/lib/scoring';

const EXAMPLE_RESULT: QuizResult = {
  overallScore: 2.9,
  overallTier: 'building-foundations',
  overallTierLabel: 'Building Foundations',
  overallDescription:
    'You have some of the building blocks in place. There are clear automation opportunities available now, alongside some gaps to address. An audit will identify your quickest wins and sequence the right approach.',
  dimensions: [
    {
      id: 'people',
      label: 'People',
      icon: '👥',
      score: 3.2,
      tier: 'developing',
      tierLabel: 'Developing',
      commentary:
        'Your organisation has some of the right ingredients, but there are gaps in change readiness or authority that are worth addressing early. With the right approach, these are very solvable.',
      auditFocus:
        'The audit will map your stakeholder landscape and recommend how to structure the programme for maximum adoption.',
    },
    {
      id: 'process',
      label: 'Process',
      icon: '⚙️',
      score: 3.7,
      tier: 'ready',
      tierLabel: 'Ready',
      commentary:
        'You have significant automation opportunities, clear process visibility, and a good sense of where the pain is. This is a strong foundation for a fast-moving AI programme.',
      auditFocus:
        'The audit will confirm and quantify your top opportunities, and give you a clear 12-month implementation roadmap.',
    },
    {
      id: 'data',
      label: 'Data',
      icon: '📊',
      score: 2.5,
      tier: 'developing',
      tierLabel: 'Developing',
      commentary:
        'Your data situation is workable but has gaps. Some areas will be ready to automate now; others will need data clean-up or consolidation first. The audit will tell you which is which.',
      auditFocus:
        'The audit will assess data quality per system, identify which data sources are ready to connect to automation, and flag anything that needs attention.',
    },
    {
      id: 'tools',
      label: 'Tools',
      icon: '🛠️',
      score: 3.0,
      tier: 'developing',
      tierLabel: 'Developing',
      commentary:
        "You have the core tools in place but there's room to get more from them, particularly Microsoft 365, which is the foundation for most of what Axon builds.",
      auditFocus:
        "The audit will assess your M365 licence and adoption, identify underused capabilities, and map which automation tools are already available to you.",
    },
    {
      id: 'ambition',
      label: 'Ambition',
      icon: '🚀',
      score: 2.8,
      tier: 'developing',
      tierLabel: 'Developing',
      commentary:
        "There's appetite but possibly not yet full commitment or budget certainty. Getting one clear, concrete win on the board is often what turns interest into investment.",
      auditFocus:
        'The audit will identify the highest-ROI quick win and build the business case to get it funded and started.',
    },
  ],
};

function tierColor(tier: ReadinessTier): string {
  if (tier === 'ready') return '#64dfec';
  if (tier === 'developing') return '#a900f1';
  return '#ff1d79';
}

export default function ExampleResultPage() {
  const result = EXAMPLE_RESULT;

  const overallColor =
    result.overallTier === 'ai-forward' || result.overallTier === 'ready-to-build'
      ? '#64dfec'
      : result.overallTier === 'building-foundations'
      ? '#a900f1'
      : '#ff1d79';

  return (
    <div className="flex-1 flex flex-col">

      {/* Sample banner */}
      <div
        style={{
          backgroundColor: '#64dfec',
          color: '#230533',
          fontSize: 12,
          fontWeight: 500,
          textAlign: 'center',
          padding: '6px 16px',
          letterSpacing: '0.04em',
        }}
      >
        SAMPLE RESULT &mdash; Clearwater Consulting Ltd (38 staff, professional services)
      </div>

      {/* 1. Overall tier banner */}
      <section style={{ backgroundColor: '#230533' }} className="px-6 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <p
            className="uppercase tracking-widest mb-4"
            style={{ fontSize: 12, color: '#a900f1', fontWeight: 500 }}
          >
            AI Readiness Assessment
          </p>
          <div className="gradient-bar mx-auto mb-8" style={{ width: 80 }} />

          <div className="inline-block mb-6">
            <span
              className="px-4 py-1.5 rounded-full text-white text-sm font-medium"
              style={{ backgroundColor: overallColor, fontSize: 13 }}
            >
              {result.overallTierLabel}
            </span>
          </div>

          <div className="mb-3">
            <span style={{ fontSize: 56, fontWeight: 700, color: '#ffffff', lineHeight: 1 }}>
              {result.overallScore}
            </span>
            <span style={{ fontSize: 24, fontWeight: 300, color: '#ffffff', opacity: 0.6 }}> / 5</span>
          </div>

          <h1 className="mb-6" style={{ fontSize: 36, fontWeight: 600, color: '#ffffff', lineHeight: 1.2 }}>
            {result.overallTierLabel}
          </h1>

          <p style={{ fontSize: 16, fontWeight: 300, color: '#64dfec', lineHeight: 1.7, maxWidth: 620, margin: '0 auto' }}>
            {result.overallDescription}
          </p>
        </div>
      </section>

      {/* 2. Dimension breakdown */}
      <section style={{ backgroundColor: '#ffffff' }} className="px-6 py-12">
        <div style={{ maxWidth: 896, margin: '0 auto' }}>
          <h2 className="mb-3" style={{ fontSize: 24, fontWeight: 600, color: '#230533' }}>
            Your Breakdown
          </h2>
          <div className="gradient-bar mb-8" style={{ width: 80 }} />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
              gap: 20,
            }}
          >
            {result.dimensions.map(dim => {
              const color = tierColor(dim.tier);
              const barWidth = ((dim.score - 1) / 4) * 100;

              return (
                <div
                  key={dim.id}
                  style={{
                    border: '1px solid rgba(169,0,241,0.18)',
                    borderRadius: 12,
                    padding: 24,
                    backgroundColor: 'rgba(255,29,121,0.06)',
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span style={{ fontSize: 28 }}>{dim.icon}</span>
                      <span style={{ fontSize: 18, fontWeight: 600, color: '#230533' }}>{dim.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span style={{ fontSize: 14, color: '#a900f1', fontWeight: 500 }}>{dim.score} / 5</span>
                      <span
                        className="px-2 py-0.5 rounded-full text-white"
                        style={{ backgroundColor: color, fontSize: 11, fontWeight: 500 }}
                      >
                        {dim.tierLabel}
                      </span>
                    </div>
                  </div>

                  <div style={{ height: 6, backgroundColor: 'rgba(169,0,241,0.18)', borderRadius: 3, marginBottom: 16 }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${barWidth}%`,
                        backgroundColor: color,
                        borderRadius: 3,
                      }}
                    />
                  </div>

                  <p style={{ fontSize: 13, fontWeight: 300, color: '#230533', lineHeight: 1.6, marginBottom: 12 }}>
                    {dim.commentary}
                  </p>

                  <div>
                    <span
                      className="uppercase tracking-wider"
                      style={{ fontSize: 11, fontWeight: 500, color: '#a900f1', display: 'block', marginBottom: 4 }}
                    >
                      Audit focus:
                    </span>
                    <p style={{ fontSize: 12, fontWeight: 300, color: '#230533', lineHeight: 1.55 }}>
                      {dim.auditFocus}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. CTA section */}
      <section style={{ backgroundColor: 'rgba(255,29,121,0.06)' }} className="px-6 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="gradient-bar mx-auto mb-8" style={{ width: 80 }} />

          <h2 className="mb-4" style={{ fontSize: 28, fontWeight: 600, color: '#230533' }}>
            Ready to take the next step?
          </h2>

          <p className="mb-4" style={{ fontSize: 16, fontWeight: 300, color: '#230533', lineHeight: 1.7 }}>
            An AI Readiness Audit gives you a complete picture of your top automation opportunities,
            ranked and costed, with a clear 12-month roadmap to act on them.
          </p>

          <p className="mb-8" style={{ fontSize: 14, color: '#a900f1', fontWeight: 500 }}>
            £1,500 &middot; Fixed price &middot; 2&ndash;3 weeks
          </p>

          <a
            href="mailto:ben@axon-it.com?subject=AI%20Readiness%20Audit%20Enquiry"
            className="gradient-bg inline-flex items-center justify-center text-white mb-4"
            style={{
              height: 48,
              minWidth: 280,
              borderRadius: 8,
              fontSize: 15,
              fontWeight: 500,
              textDecoration: 'none',
              display: 'inline-flex',
            }}
          >
            Book your AI Readiness Audit &rarr;
          </a>

          <p style={{ fontSize: 12, color: '#a900f1', marginTop: 12 }}>
            Or email{' '}
            <a href="mailto:ben@axon-it.com" style={{ color: '#a900f1' }}>
              ben@axon-it.com
            </a>{' '}
            to find out more
          </p>
        </div>
      </section>

      {/* 4. Take quiz link */}
      <div className="text-center py-6" style={{ backgroundColor: '#ffffff' }}>
        <a href="/" style={{ fontSize: 13, color: '#a900f1', fontWeight: 400 }}>
          Take the assessment for your business
        </a>
      </div>
    </div>
  );
}
